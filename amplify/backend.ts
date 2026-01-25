// Amplify
import { defineBackend } from '@aws-amplify/backend';

// Amplify - Platform Core
import {
  BackendIdentifierConversions,
  NamingConverter,
  ParameterPathConversions,
} from '@aws-amplify/platform-core';

// AWS CDK
import { Arn } from 'aws-cdk-lib';

// AWS CDK - IAM
import {
  Policy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';

// AWS CDK - IoT
import {
  CfnPolicy,
  CfnPolicyPrincipalAttachment,
  CfnRoleAlias,
  CfnThing,
  CfnThingPrincipalAttachment,
  CfnTopicRule,
} from 'aws-cdk-lib/aws-iot';

// AWS CDK - Kinesis Video Streams
import { CfnSignalingChannel } from 'aws-cdk-lib/aws-kinesisvideo';

// AWS CDK - Lambda
import { CfnPermission } from 'aws-cdk-lib/aws-lambda';

// AWS CDK - Systems Manager
import { StringParameter } from 'aws-cdk-lib/aws-ssm';

// AWS CDK - IoT Certificate
import { Certificate } from './constructs/iot/certificate';

// 認証
import { auth } from './auth/resource';

// データ
import { data } from './data/resource';

// 関数
import { putSensorValue } from './functions/put-sensor-value/resource';

// Amplifyのバックエンドを作成
const backend = defineBackend({
  auth,
  data,
  putSensorValue,
});

// AmplifyのバックエンドIDを取得
const backendId = BackendIdentifierConversions.fromStackName(backend.stack.stackName);

// AmplifyのバックエンドIDが存在しない場合は終了
if (!backendId) {
  throw new Error('Backend identifier not found.');
}

// CognitoのユーザープールとIDプール
const { cfnIdentityPool, cfnUserPool } = backend.auth.resources.cfnResources;

// ゲストアクセスを無効化
cfnIdentityPool.allowUnauthenticatedIdentities = false;

// ユーザー名でのサインインを有効化
cfnUserPool.aliasAttributes = ['email'];
cfnUserPool.usernameAttributes = [];

// パスワードポリシーを変更
cfnUserPool.policies = {
  passwordPolicy: {
    minimumLength: 8,
    requireNumbers: true,
    requireUppercase: true,
    requireLowercase: true,
  },
};

// セルフサービスのサインアップを無効化
cfnUserPool.adminCreateUserConfig = {
  allowAdminCreateUserOnly: true,
};

// IoTスタック
const iotStack = backend.createStack('IotStack');

// IoT証明書
const iotCertificate = new Certificate(iotStack, 'Certificate', {
  setAsActive: true,
});

// IoT証明書をパラメータストアに格納
Object.entries(iotCertificate).forEach(([key, stringValue]) => {
  if (['pem', 'privateKey', 'publicKey'].includes(key)) {
    // パラメータの参照名
    const referenceName = `IOT_CERTIFICATE_${new NamingConverter().toScreamingSnakeCase(key)}`;

    // パラメータの名前
    const parameterName = ParameterPathConversions.toResourceReferenceFullPath(backendId, referenceName);

    // 文字列パラメータ
    new StringParameter(iotStack, `${referenceName}Parameter`, {
      parameterName,
      stringValue,
    });
  }
});

// IoTデバイス
const iotThing = new CfnThing(iotStack, 'Thing');

// IoTデバイスをIoT証明書にアタッチ
new CfnThingPrincipalAttachment(iotStack, 'ThingPrincipalAttachment', {
  principal: iotCertificate.arn,
  thingName: iotThing.ref,
});

// IoTシグナリングチャネル
const iotSignalingChannel = new CfnSignalingChannel(iotStack, 'SignalingChannel');

// IoTシグナリングチャネルのアクセスポリシー
const iotSignalingChannelPolicy = new Policy(iotStack, 'SignalingChannelPolicy', {
  statements: [
    new PolicyStatement({
      actions: [
        'kinesisvideo:ConnectAsMaster',
        'kinesisvideo:ConnectAsViewer',
        'kinesisvideo:DescribeSignalingChannel',
        'kinesisvideo:GetIceServerConfig',
        'kinesisvideo:GetSignalingChannelEndpoint',
      ],
      resources: [
        iotSignalingChannel.attrArn,
      ],
    }),
  ],
});

// IoTシグナリングチャネルのアクセスポリシーをCognitoの認証ロールにアタッチ
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(iotSignalingChannelPolicy);

// IoTロール
const iotRole = new Role(iotStack, 'Role', {
  assumedBy: new ServicePrincipal('credentials.iot.amazonaws.com'),
});

// IoTシグナリングチャネルのアクセスポリシーをIoTロールにアタッチ
iotRole.attachInlinePolicy(iotSignalingChannelPolicy);

// IoTロールエイリアス
const iotRoleAlias = new CfnRoleAlias(iotStack, 'RoleAlias', {
  roleArn: iotRole.roleArn,
});

// IoTポリシー
const iotPolicy = new CfnPolicy(iotStack, 'Policy', {
  policyDocument: new PolicyDocument({
    statements: [
      new PolicyStatement({
        actions: [
          'iot:Connect',
        ],
        resources: [
          Arn.format({
            service: 'iot',
            resource: 'client',
            resourceName: '${iot:Connection.Thing.ThingName}',
          }, iotStack),
        ],
        conditions: {
          Bool: {
            'iot:Connection.Thing.IsAttached': 'true',
          },
        },
      }),
      new PolicyStatement({
        actions: [
          'iot:Publish',
        ],
        resources: [
          Arn.format({
            service: 'iot',
            resource: 'topic',
            resourceName: '${iot:Connection.Thing.ThingName}/sensor-value/pub',
          }, iotStack),
        ],
      }),
      new PolicyStatement({
        actions: [
          'iot:AssumeRoleWithCertificate',
        ],
        resources: [
          iotRoleAlias.attrRoleAliasArn,
        ],
      }),
    ],
  }),
});

// IoTポリシーをIoT証明書にアタッチ
new CfnPolicyPrincipalAttachment(iotStack, 'PolicyPrincipalAttachment', {
  policyName: iotPolicy.ref,
  principal: iotCertificate.arn,
});

// センサー測定値をPutするIoTルール
const iotSensorValuePutTopicRule = new CfnTopicRule(iotStack, 'SensorValuePutTopicRule', {
  topicRulePayload: {
    actions: [
      {
        lambda: {
          functionArn: backend.putSensorValue.resources.lambda.functionArn,
        },
      },
    ],
    awsIotSqlVersion: '2016-03-23',
    sql: `SELECT topic(1) AS thingName, * FROM '${iotThing.ref}/sensor-value/pub'`,
  },
});

// センサー測定値をPutするIoTルールから呼び出す権限を関数に追加
new CfnPermission(iotStack, 'SensorValuePutTopicRulePermission', {
  principal: 'iot.amazonaws.com',
  action: 'lambda:InvokeFunction',
  functionName: backend.putSensorValue.resources.lambda.functionName,
  sourceArn: iotSensorValuePutTopicRule.attrArn,
});

// IoTスタックの情報を出力
backend.addOutput({
  custom: {
    iot: {
      aws_region: iotStack.region,
      signaling_channel: {
        arn: iotSignalingChannel.attrArn,
      },
      thing: {
        name: iotThing.ref,
      },
    },
  },
});
