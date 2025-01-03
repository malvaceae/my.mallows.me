// AWS Lambda
import type { Handler } from 'aws-lambda';

// Amplify
import { Amplify } from 'aws-amplify';

// Amplify - Data
import { generateClient } from 'aws-amplify/data';

// Amplify - Backend Function Runtime
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';

// 環境変数
import { env } from '$amplify/env/put-sensor-value';

// Amplify - Data Schema
import type { Schema } from '../../data/resource';

// Amplifyの設定を取得
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

// Amplifyの設定を適用
Amplify.configure(resourceConfig, libraryOptions);

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// センサー測定値をPutする
export const handler: Handler = async (event) => {
  await client.models.SensorValue.create(event);
};
