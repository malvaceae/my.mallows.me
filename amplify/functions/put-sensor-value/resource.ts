// Amplify
import { defineFunction } from '@aws-amplify/backend';

// リソースを作成
export const putSensorValue = defineFunction({
  architecture: 'arm64',
  runtime: 22,
});
