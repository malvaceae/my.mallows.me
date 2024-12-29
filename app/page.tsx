'use client';

// Amplify
import { Amplify } from 'aws-amplify';

// Amplify - Data
import { generateClient } from 'aws-amplify/data';

// Amplify - Data Schema
import type { Schema } from '@/amplify/data/resource';

// Amplify - UI React
import { useAuthenticator } from '@aws-amplify/ui-react';

// Amplifyの設定
import outputs from '@/amplify_outputs.json';

// Amplifyの設定を適用
Amplify.configure(outputs);

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// トップページ
export default function Page() {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  return (
    <main>
      <h1>Hello, {user.username}!</h1>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}
