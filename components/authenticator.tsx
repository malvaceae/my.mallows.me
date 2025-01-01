'use client';

// Amplify
import { Amplify } from 'aws-amplify';

// Amplify - UI React
import { Authenticator as AmplifyAuthenticator } from '@aws-amplify/ui-react';

// ログインフォーム
import { LoginForm } from '@/components/login-form';

// Amplifyの設定
import outputs from '@/amplify_outputs.json';

// Amplifyの設定を適用
Amplify.configure(outputs);

// 認証
export function Authenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AmplifyAuthenticator.Provider>
      <LoginForm>{children}</LoginForm>
    </AmplifyAuthenticator.Provider>
  );
}
