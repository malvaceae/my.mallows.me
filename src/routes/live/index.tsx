// React
import {
  useEffect,
  useRef,
} from 'react';

// TanStack Router
import { createFileRoute } from '@tanstack/react-router';

// AWS SDK - Kinesis Video Streams
import {
  ChannelProtocol,
  ChannelRole,
  GetSignalingChannelEndpointCommand,
  KinesisVideoClient,
} from '@aws-sdk/client-kinesis-video';

// AWS SDK - Kinesis Video Streams Signaling
import {
  GetIceServerConfigCommand,
  KinesisVideoSignalingClient,
} from '@aws-sdk/client-kinesis-video-signaling';

// Amazon Kinesis Video Streams WebRTC SDK
import {
  Role,
  SignalingClient,
} from 'amazon-kinesis-video-streams-webrtc';

// Amplify - Auth
import { fetchAuthSession } from 'aws-amplify/auth';

// shadcn/ui - Aspect Ratio
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Amplifyの設定
import outputs from '~/amplify_outputs.json';

// ルート
export const Route = createFileRoute('/live/')({
  head() {
    return {
      meta: [
        {
          title: 'ライブストリーミング | my.mallows.me',
        },
      ],
    };
  },
  component: Live,
});

// ライブストリーミング
function Live() {
  // videoタグ
  const videoRef = useRef<HTMLVideoElement>(null);

  // ピア接続
  const peerConnectionRef = useRef<RTCPeerConnection>(null);

  // WebRTC Signalingクライアント
  const signalingClientRef = useRef<SignalingClient>(null);

  useEffect(() => {
    // アクティブかどうか
    let isActive = true;

    // 接続をクリーンアップ
    const cleanup = () => {
      isActive = false;

      // シグナリングチャネルを切断
      if (signalingClientRef.current) {
        signalingClientRef.current.close();
        signalingClientRef.current = null;
      }

      // ピア接続を切断
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }
    };

    // WebRTCを開始
    (async () => {
      // クレデンシャルを取得
      const { credentials } = await fetchAuthSession();

      // Kinesis Video Streamsクライアント
      const kinesisVideo = new KinesisVideoClient({
        region: outputs.custom.iot.aws_region,
        credentials,
      });

      // シグナリングチャネルのエンドポイントを取得
      const { ResourceEndpointList: endpoints } = await kinesisVideo.send(new GetSignalingChannelEndpointCommand({
        ChannelARN: outputs.custom.iot.signaling_channel.arn,
        SingleMasterChannelEndpointConfiguration: {
          Protocols: [
            ChannelProtocol.HTTPS,
            ChannelProtocol.WSS,
          ],
          Role: ChannelRole.VIEWER,
        },
      }));

      // シグナリングチャネルのエンドポイントが存在しない場合は終了
      if (!endpoints) {
        throw new Error('Signaling channel endpoints not found.');
      }

      // プロトコル別のエンドポイントを取得
      const endpointsByProtocol = Object.fromEntries(endpoints.map((endpoint) => [
        endpoint.Protocol,
        endpoint.ResourceEndpoint,
      ]));

      // Kinesis Video Streams Signalingクライアント
      const kinesisVideoSignaling = new KinesisVideoSignalingClient({
        region: outputs.custom.iot.aws_region,
        endpoint: endpointsByProtocol.HTTPS,
        credentials,
      });

      // ICEサーバーの構成情報を取得
      const { IceServerList: iceServers } = await kinesisVideoSignaling.send(new GetIceServerConfigCommand({
        ChannelARN: outputs.custom.iot.signaling_channel.arn,
      }));

      // ICEサーバーの構成情報が存在しない場合は終了
      if (!iceServers) {
        throw new Error('ICE server configuration not found.');
      }

      // STUNサーバーのエンドポイントを追加
      iceServers.push({
        Uris: [
          `stun:stun.kinesisvideo.${outputs.custom.iot.aws_region}.amazonaws.com:443`,
        ],
      });

      // 接続処理
      const connect = () => {
        // ピア接続
        const peerConnection = peerConnectionRef.current = new RTCPeerConnection({
          iceServers: iceServers.map((iceServer) => ({
            urls: iceServer.Uris ?? [],
            credential: iceServer.Password,
            username: iceServer.Username,
          })),
        });

        // WebRTC Signalingクライアント
        const signalingClient = signalingClientRef.current = new SignalingClient({
          channelARN: outputs.custom.iot.signaling_channel.arn,
          channelEndpoint: endpointsByProtocol.WSS,
          credentials,
          region: outputs.custom.iot.aws_region,
          role: Role.VIEWER,
          clientId: Math.random().toString(36).substring(2).toUpperCase(),
          systemClockOffset: kinesisVideo.config.systemClockOffset,
        });

        // シグナリングチャネルに接続した場合
        signalingClient.on('open', async () => {
          // SDPオファーを作成
          const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true,
          });

          // SDPオファーをピア接続に登録
          await peerConnection.setLocalDescription(offer);

          // SDPオファーをシグナリングチャネルに送信
          if (peerConnection.localDescription) {
            signalingClient.sendSdpOffer(peerConnection.localDescription);
          }
        });

        // SDPアンサーを受信した場合はピア接続に登録する
        signalingClient.on('sdpAnswer', (answer) => {
          peerConnection.setRemoteDescription(answer);
        });

        // ICE Candidateを受信した場合はピア接続に登録する
        signalingClient.on('iceCandidate', (candidate) => {
          peerConnection.addIceCandidate(candidate);
        });

        // シグナリングチャネルでエラーが発生した場合
        signalingClient.on('error', (error) => {
          console.error(error);
        });

        // ピア接続が生成したICE Candidateをシグナリングチャネルに送信する
        peerConnection.addEventListener('icecandidate', ({ candidate }) => {
          if (candidate) {
            signalingClient.sendIceCandidate(candidate);
          }
        });

        // 映像や音声のトラックをvideoタグに追加する
        peerConnection.addEventListener('track', ({ streams }) => {
          if (videoRef.current) {
            videoRef.current.srcObject = streams[0];
          }
        });

        // ピア接続が切断された場合は再接続する
        peerConnection.addEventListener('connectionstatechange', () => {
          if (
            peerConnection.connectionState === 'disconnected' ||
            peerConnection.connectionState === 'failed'
          ) {
            cleanup();
            connect();
          }
        });

        // シグナリングチャネルに接続
        signalingClient.open();
      };

      // アクティブな場合は接続を開始
      if (isActive) {
        connect();
      }
    })();

    // 終了時にクリーンアップ
    return cleanup;
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-lg font-bold'>
        ラズパイからの映像を確認するサンプルページ
      </div>
      <div className='gap-4 xl:flex'>
        <div className='xl:w-3/5'>
          <AspectRatio ratio={4 / 3}>
            <video
              ref={videoRef}
              className='h-full w-full rounded-xl [&::-webkit-media-controls-timeline]:hidden'
              autoPlay
              controls
              muted
            />
          </AspectRatio>
        </div>
      </div>
    </div>
  );
}
