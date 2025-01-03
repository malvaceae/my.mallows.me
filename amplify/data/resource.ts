// Amplify
import {
  a,
  type ClientSchema,
  defineData,
} from '@aws-amplify/backend';

// 関数
import { putSensorValue } from '../functions/put-sensor-value/resource';

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
})
  .authorization((allow) => [
    allow.resource(putSensorValue).to(['mutate']),
  ]);

// スキーマを公開
export type Schema = ClientSchema<typeof schema>;

// リソースを作成
export const data = defineData({
  schema,
});
