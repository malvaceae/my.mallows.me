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

// Recharts
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

// shadcn/ui - Card
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// shadcn/ui - Chart
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

// Amplify - Data Schema
import type { Schema } from '@/amplify/data/resource';

// Amplifyの設定
import outputs from '@/amplify_outputs.json';

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// グラフ設定
const chartConfig: ChartConfig = {
  temperature: {
    label: '気温',
    color: 'hsl(var(--chart-1))',
  },
  pressure: {
    label: '気圧',
    color: 'hsl(var(--chart-2))',
  },
  humidity: {
    label: '湿度',
    color: 'hsl(var(--chart-3))',
  },
};

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

      // センサー測定値を日時の昇順で保持
      setSensorValues(data.reverse());
    })();
  }, []);

  // 最新の気温・気圧・湿度
  const { temperature, pressure, humidity } = sensorValues[sensorValues.length - 1] ?? {};

  return (
    <div className='flex flex-col gap-4'>
      <div className='font-bold'>
        ダッシュボード
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='order-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              気温
            </CardTitle>
            <ThermometerSun className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {temperature?.toFixed(2) ?? '-'} ℃
            </div>
          </CardContent>
        </Card>
        <Card className='order-3'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              気圧
            </CardTitle>
            <Gauge className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {pressure?.toFixed(2) ?? '-'} hPa
            </div>
          </CardContent>
        </Card>
        <Card className='order-2'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              湿度
            </CardTitle>
            <Droplets className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {humidity?.toFixed(2) ?? '-'} ％
            </div>
          </CardContent>
        </Card>
        <Card className='order-4'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              不快指数
            </CardTitle>
            <Frown className='w-4 h-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {temperature && humidity ? calcDiscomfortIndex(temperature, humidity).toFixed(2) : '-'}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card className='order-1'>
          <CardHeader>
            <CardTitle>
              気温
            </CardTitle>
          </CardHeader>
          <CardContent className='px-2 sm:p-6'>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={sensorValues}
                margin={{ right: 12, left: 12 }}
                maxBarSize={10}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey='timestamp'
                  domain={([dataMin, dataMax]) => [
                    Math.floor(dataMin / (5 * 60)) * (5 * 60),
                    Math.floor(dataMax / (5 * 60)) * (5 * 60) + (5 * 60),
                  ]}
                  tickCount={13}
                  tickFormatter={(value) => new Date(value * 1000).toTimeString().slice(0, 5)}
                  tickLine={false}
                  tickMargin={8}
                  type='number'
                />
                <YAxis
                  axisLine={false}
                  dataKey='temperature'
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `${value.toFixed(2)} ℃`}
                  tickLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey='temperature'
                  dot={false}
                  stroke='var(--color-temperature)'
                  strokeWidth={2}
                  type='natural'
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className='order-3'>
          <CardHeader>
            <CardTitle>
              気圧
            </CardTitle>
          </CardHeader>
          <CardContent className='px-2 sm:p-6'>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={sensorValues}
                margin={{ right: 12, left: 12 }}
                maxBarSize={10}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey='timestamp'
                  domain={([dataMin, dataMax]) => [
                    Math.floor(dataMin / (5 * 60)) * (5 * 60),
                    Math.floor(dataMax / (5 * 60)) * (5 * 60) + (5 * 60),
                  ]}
                  tickCount={13}
                  tickFormatter={(value) => new Date(value * 1000).toTimeString().slice(0, 5)}
                  tickLine={false}
                  tickMargin={8}
                  type='number'
                />
                <YAxis
                  axisLine={false}
                  dataKey='pressure'
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `${value.toFixed(2)} hPa`}
                  tickLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey='pressure'
                  dot={false}
                  stroke='var(--color-pressure)'
                  strokeWidth={2}
                  type='natural'
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className='order-2'>
          <CardHeader>
            <CardTitle>
              湿度
            </CardTitle>
          </CardHeader>
          <CardContent className='px-2 sm:p-6'>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={sensorValues}
                margin={{ right: 12, left: 12 }}
                maxBarSize={10}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey='timestamp'
                  domain={([dataMin, dataMax]) => [
                    Math.floor(dataMin / (5 * 60)) * (5 * 60),
                    Math.floor(dataMax / (5 * 60)) * (5 * 60) + (5 * 60),
                  ]}
                  tickCount={13}
                  tickFormatter={(value) => new Date(value * 1000).toTimeString().slice(0, 5)}
                  tickLine={false}
                  tickMargin={8}
                  type='number'
                />
                <YAxis
                  axisLine={false}
                  dataKey='humidity'
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => `${value.toFixed(2)} ％`}
                  tickLine={false}
                  tickMargin={8}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey='humidity'
                  dot={false}
                  stroke='var(--color-humidity)'
                  strokeWidth={2}
                  type='natural'
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
