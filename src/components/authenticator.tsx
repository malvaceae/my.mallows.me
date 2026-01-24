// Amplify - UI React Core
import {
  AuthenticatorProvider,
  useAuthenticator,
  useAuthenticatorInitMachine,
} from '@aws-amplify/ui-react-core';

// ログインフォーム
import { LoginForm } from '@/components/login-form';

// 認証機能の初期化と画面表示
function AuthenticatorInternal({
  children,
}: {
  children: React.ReactNode;
}) {
  // 認証状態
  const { authStatus, user } = useAuthenticator((context) => [
    context.authStatus,
    context.user,
  ]);

  // 初期化
  useAuthenticatorInitMachine({
    initialState: 'signIn',
  });

  // 初期化前の場合は何も表示しない
  if (authStatus === 'configuring') {
    return null;
  }

  // 認証済みの場合は子要素を表示する
  if (authStatus === 'authenticated') {
    return user ? children : <LoginForm />;
  }

  return <LoginForm />;
}

// 認証機能
export function Authenticator({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthenticatorProvider>
      <AuthenticatorInternal>
        {children}
      </AuthenticatorInternal>
    </AuthenticatorProvider>
  );
}
