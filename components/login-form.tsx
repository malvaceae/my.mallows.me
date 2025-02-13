'use client';

// React
import {
  useCallback,
  useState,
} from 'react';

// Amplify - UI React Core
import { useAuthenticator } from '@aws-amplify/ui-react-core';

// Lucide React
import {
  AlertCircle,
  Loader2,
} from 'lucide-react';

// shadcn/ui - Alert
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';

// shadcn/ui - Button
import { Button } from '@/components/ui/button';

// shadcn/ui - Card
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// shadcn/ui - Input
import { Input } from '@/components/ui/input';

// shadcn/ui - Label
import { Label } from '@/components/ui/label';

// テーマ切替ボタン
import { ThemeToggle } from '@/components/theme-toggle';

// ログインフォーム
export function LoginForm() {
  // 認証状態
  const { error, isPending, submitForm } = useAuthenticator((context) => [
    context.error,
    context.isPending,
  ]);

  // ユーザー名・パスワード
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ログイン
  const handleSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    submitForm({
      username,
      password,
    });
  }, [username, password]);

  return (
    <div className='flex items-center justify-center min-h-svh'>
      <ThemeToggle className='absolute top-0 right-0 m-2' />
      <Card className='w-full max-w-sm m-4'>
        <CardHeader>
          <CardTitle className='text-2xl'>
            ログイン
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form method='post' onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6'>
              <div className='grid gap-2'>
                <Label htmlFor='username'>
                  ユーザー名
                </Label>
                <Input
                  id='username'
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>
                  パスワード
                </Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && (
                <Alert variant='destructive'>
                  <AlertCircle className='w-4 h-4' />
                  <AlertTitle>エラー</AlertTitle>
                  <AlertDescription>
                    {error}
                  </AlertDescription>
                </Alert>
              )}
              <Button type='submit' disabled={isPending}>
                {isPending && <Loader2 className='animate-spin' />}
                {isPending ? 'ログイン中' : 'ログイン'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
