// Amplify
import { defineBackend } from '@aws-amplify/backend';

// 認証
import { auth } from './auth/resource';

// データ
import { data } from './data/resource';

// Amplifyのバックエンドを作成
const backend = defineBackend({
  auth,
  data,
});

// ユーザープールとIDプール
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
