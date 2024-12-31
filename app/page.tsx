'use client';

// Amplify - Data
import { generateClient } from 'aws-amplify/data';

// Amplify - Data Schema
import type { Schema } from '@/amplify/data/resource';

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// ホーム
export default function HomePage() {
  return (
    <div className='flex flex-col gap-4'>
      <div className='font-bold'>
        ダッシュボード
      </div>
    </div>
  );
}
