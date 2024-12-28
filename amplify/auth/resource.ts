// Amplify
import { defineAuth } from '@aws-amplify/backend';

// リソースを作成
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
