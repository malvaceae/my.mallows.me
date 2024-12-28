// Amplify
import { Amplify } from 'aws-amplify';

// Amplify - Data
import { generateClient } from 'aws-amplify/data';

// Amplify - Data Schema
import type { Schema } from '@/amplify/data/resource';

// Amplifyの設定
import outputs from '@/amplify_outputs.json';

// Amplifyの設定を適用
Amplify.configure(outputs);

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// トップページ
export default function Page() {
  return (
    <main>
      <h1>Hello, World!</h1>
    </main>
  );
}
