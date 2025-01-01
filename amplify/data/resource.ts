// Amplify
import {
  a,
  type ClientSchema,
  defineData,
} from '@aws-amplify/backend';

// スキーマを定義
const schema = a.schema({
  SensorValue: a.model({
    thingName: a.string().required(),
    timestamp: a.timestamp().required(),
    temperature: a.float().required(),
    pressure: a.float().required(),
    humidity: a.float().required(),
  })
    .identifier(['thingName', 'timestamp'])
    .authorization((allow) => [
      allow.authenticated(),
    ]),
});

// スキーマを公開
export type Schema = ClientSchema<typeof schema>;

// リソースを作成
export const data = defineData({
  schema,
});
