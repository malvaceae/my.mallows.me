'use client';

// React
import {
  useEffect,
  useRef,
} from 'react';

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
import outputs from '@/amplify_outputs.json';

// ライブストリーミング
export default function LivePage() {
  // videoタグ
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // WebRTCを開始
    const webrtc = (async () => {
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
        throw Error();
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
        throw Error();
      }

      // STUNサーバーのエンドポイントを追加
      iceServers.push({
        Uris: [
          `stun:stun.kinesisvideo.${outputs.custom.iot.aws_region}.amazonaws.com:443`,
        ],
      });

      // RTCPeerConnectionを作成
      const peerConnection = new RTCPeerConnection({
        iceServers: iceServers.map((iceServer) => ({
          urls: iceServer.Uris ?? [],
          credential: iceServer.Password,
          username: iceServer.Username,
        })),
      });

      // WebRTC Signalingクライアント
      const signalingClient = new SignalingClient({
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

      // SDPアンサーを受信した場合、ピア接続に登録する
      signalingClient.on('sdpAnswer', (answer) => {
        peerConnection.setRemoteDescription(answer);
      });

      // ICE Candidateを受信した場合、ピア接続に登録する
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
        if (videoRef.current && !videoRef.current.srcObject) {
          videoRef.current.srcObject = streams[0];
        }
      });

      // シグナリングチャネルに接続
      signalingClient.open();

      // シグナリングチャネルを返却
      return signalingClient;
    })();

    // 終了時にシグナリングチャネルを切断
    return () => {
      webrtc.then((signalingClient) => {
        signalingClient.close();
      });
    };
  }, []);

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-lg font-bold'>
        ラズパイからの映像を確認するサンプルページ
      </div>
      <div className='xl:flex gap-4'>
        <div className='xl:w-3/5'>
          <AspectRatio ratio={4 / 3}>
            <video
              ref={videoRef}
              className='h-full rounded-xl'
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
