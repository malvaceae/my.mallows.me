'use client';

// React
import {
  useEffect,
  useState,
} from 'react';

// Amplify - Data
import { generateClient } from 'aws-amplify/data';

// Lucide React
import {
  Droplets,
  Frown,
  Gauge,
  ThermometerSun,
} from 'lucide-react';

// shadcn/ui - Card
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Amplify - Data Schema
import type { Schema } from '@/amplify/data/resource';

// Amplifyの設定
import outputs from '@/amplify_outputs.json';

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// 不快指数の計算
const calcDiscomfortIndex = (t: number, h: number) => {
  return .81 * t + .01 * h * (.99 * t - 14.3) + 46.3;
};

// ホーム
export default function HomePage() {
  // センサー測定値
  const [sensorValues, setSensorValues] = useState<Schema['SensorValue']['type'][]>([]);

  useEffect(() => {
    (async () => {
      // センサー測定値を取得
      const { data } = await client.models.SensorValue.list({
        thingName: outputs.custom.iot.thing.name,
        sortDirection: 'DESC',
        limit: 60,
      });

      // センサー測定値を保持
      setSensorValues(data);
    })();
  }, []);

  // 最新の気温・気圧・湿度
  const { temperature, pressure, humidity } = sensorValues[0] ?? {};

  return (
    <div className='flex flex-col gap-4'>
      <div className='font-bold'>
        ダッシュボード
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              気温
            </CardTitle>
            <ThermometerSun className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(temperature * 100) / 100 || '-'} ℃
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              気圧
            </CardTitle>
            <Gauge className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(pressure * 100) / 100 || '-'} hPa
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              湿度
            </CardTitle>
            <Droplets className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(humidity * 100) / 100 || '-'} ％
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              不快指数
            </CardTitle>
            <Frown className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {Math.round(calcDiscomfortIndex(temperature, humidity) * 100) / 100 || '-'}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
