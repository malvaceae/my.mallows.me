// React
import {
  useEffect,
  useState,
} from 'react';

// TanStack Router
import { createFileRoute } from '@tanstack/react-router';

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
  Area,
  AreaChart,
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

// shadcn/ui - Toggle Group
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group';

// Amplify - Data Schema
import type { Schema } from '~/amplify/data/resource';

// Amplifyの設定
import outputs from '~/amplify_outputs.json';

// Amplifyのデータクライアント
const client = generateClient<Schema>();

// グラフ設定
const chartConfig: ChartConfig = {
  temperature: {
    label: '気温',
    color: 'var(--chart-1)',
  },
  pressure: {
    label: '気圧',
    color: 'var(--chart-2)',
  },
  humidity: {
    label: '湿度',
    color: 'var(--chart-3)',
  },
};

// 表示期間の一覧
const periods = [
  {
    title: '1時間',
    value: 1 * 60 * 60,
    interval: 10 * 60,
  },
  {
    title: '3時間',
    value: 3 * 60 * 60,
    interval: 20 * 60,
  },
  {
    title: '12時間',
    value: 12 * 60 * 60,
    interval: 30 * 60,
  },
  {
    title: '1日',
    value: 24 * 60 * 60,
    interval: 60 * 60,
  },
];

// 日時を時間と分の文字列に変換
const toHourAndMinute = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// 不快指数の計算
const calcDiscomfortIndex = (t: number, h: number) => {
  return .81 * t + .01 * h * (.99 * t - 14.3) + 46.3;
};

// センサー測定値
type SensorValue = Pick<Schema['SensorValue']['type'], 'timestamp' | 'temperature' | 'pressure' | 'humidity'>;

// ルート
export const Route = createFileRoute('/')({
  component: Home,
});

// ホーム
function Home() {
  // センサー測定値
  const [sensorValues, setSensorValues] = useState<SensorValue[]>([]);

  // 最新の気温・気圧・湿度
  const { temperature, pressure, humidity } = sensorValues[sensorValues.length - 1] ?? {};

  // 気温・気圧・湿度の一覧
  const [temperatures, pressures, humidities] = [
    sensorValues.map(({ temperature }) => temperature),
    sensorValues.map(({ pressure }) => pressure),
    sensorValues.map(({ humidity }) => humidity),
  ];

  // 気温の最小値・最大値
  const temperatureMin = Math.min(...temperatures);
  const temperatureMax = Math.max(...temperatures);

  // 気圧の最小値・最大値
  const pressureMin = Math.min(...pressures);
  const pressureMax = Math.max(...pressures);

  // 湿度の最小値・最大値
  const humidityMin = Math.min(...humidities);
  const humidityMax = Math.max(...humidities);

  // 表示期間
  const [period, setPeriod] = useState(periods[0]);

  // 現在時刻
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000));

  // X軸の目盛り
  const xTicks = [...Array(period.value / period.interval)].map((_, i) => {
    return (Math.floor(timestamp / period.interval) - i) * period.interval;
  });

  // Y軸の目盛り
  const yTicks = {
    temperature: Number.isFinite(temperatureMin) && Number.isFinite(temperatureMax)
      ? [...Array(Math.ceil(temperatureMax) - Math.floor(temperatureMin) + 3)]
        .map((_, i) => Math.ceil(temperatureMax) + 1 - i)
      : [],
    pressure: Number.isFinite(pressureMin) && Number.isFinite(pressureMax)
      ? [...Array(Math.ceil(pressureMax) - Math.floor(pressureMin) + 3)]
        .map((_, i) => Math.ceil(pressureMax) + 1 - i)
      : [],
    humidity: Number.isFinite(humidityMin) && Number.isFinite(humidityMax)
      ? [...Array(Math.ceil(humidityMax) - Math.floor(humidityMin) + 3)]
        .map((_, i) => Math.ceil(humidityMax) + 1 - i)
      : [],
  };

  useEffect(() => {
    (async () => {
      // センサー測定値を初期化
      setSensorValues([]);

      // 現在時刻を更新
      const timestamp = Math.floor(Date.now() / 1000);
      setTimestamp(timestamp);

      // センサー測定値をタイムスタンプの降順で取得
      const { data } = await client.models.SensorValue.list({
        thingName: outputs.custom.iot.thing.name,
        sortDirection: 'DESC',
        limit: 1440,
        selectionSet: [
          'timestamp',
          'temperature',
          'pressure',
          'humidity',
        ],
        timestamp: {
          gt: timestamp - period.value,
        },
      });

      // センサー測定値をタイムスタンプの昇順で保持
      setSensorValues(data.reverse());
    })();

    // データの追加を監視
    const sub = client.models.SensorValue.onCreate({
      selectionSet: [
        'timestamp',
        'temperature',
        'pressure',
        'humidity',
      ],
    }).subscribe({
      next(data) {
        // 現在時刻を更新
        const timestamp = Math.floor(Date.now() / 1000);
        setTimestamp(timestamp);

        // センサー測定値を更新
        setSensorValues((prev) => [...prev.filter(({ timestamp }) => {
          return timestamp > data.timestamp - period.value;
        }), data]);
      },
    });

    // 終了時に監視を停止
    return () => sub.unsubscribe();
  }, [period]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <div className='text-lg font-bold'>
          ダッシュボード
        </div>
        <ToggleGroup
          type='single'
          value={String(periods.indexOf(period))}
          variant='outline'
          onValueChange={(value) => value && setPeriod(periods[Number(value)])}
        >
          {periods.map((period, i) => (
            <ToggleGroupItem value={String(i)} key={i}>
              {period.title}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card className='order-1'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm'>
              気温
            </CardTitle>
            <ThermometerSun className='h-4 w-4 text-muted-foreground' />
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
            <Gauge className='h-4 w-4 text-muted-foreground' />
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
            <Droplets className='h-4 w-4 text-muted-foreground' />
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
            <Frown className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {temperature && humidity ? calcDiscomfortIndex(temperature, humidity).toFixed(2) : '-'}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
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
                margin={{ top: 12, right: 18 }}
                maxBarSize={10}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey='timestamp'
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => toHourAndMinute(new Date(value * 1000))}
                  tickLine={false}
                  tickMargin={8}
                  ticks={xTicks}
                  type='number'
                />
                <YAxis
                  axisLine={false}
                  dataKey='temperature'
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value.toFixed(2)} ℃`}
                  tickLine={false}
                  tickMargin={8}
                  ticks={yTicks.temperature}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey='temperature'
                  dot={false}
                  stroke='var(--color-temperature)'
                  strokeWidth={2}
                  type='monotone'
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
              <AreaChart
                accessibilityLayer
                data={sensorValues}
                margin={{ top: 12, right: 18 }}
                maxBarSize={10}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey='timestamp'
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => toHourAndMinute(new Date(value * 1000))}
                  tickLine={false}
                  tickMargin={8}
                  ticks={xTicks}
                  type='number'
                />
                <YAxis
                  axisLine={false}
                  dataKey='pressure'
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value.toFixed(2)} hPa`}
                  tickLine={false}
                  tickMargin={8}
                  ticks={yTicks.pressure}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Area
                  dataKey='pressure'
                  dot={false}
                  fill='var(--color-pressure)'
                  stroke='var(--color-pressure)'
                  strokeWidth={2}
                  type='monotone'
                />
              </AreaChart>
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
                margin={{ top: 12, right: 18 }}
                maxBarSize={10}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  axisLine={false}
                  dataKey='timestamp'
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => toHourAndMinute(new Date(value * 1000))}
                  tickLine={false}
                  tickMargin={8}
                  ticks={xTicks}
                  type='number'
                />
                <YAxis
                  axisLine={false}
                  dataKey='humidity'
                  domain={['dataMin', 'dataMax']}
                  tickFormatter={(value) => `${value.toFixed(2)} ％`}
                  tickLine={false}
                  tickMargin={8}
                  ticks={yTicks.humidity}
                />
                <ChartTooltip
                  content={<ChartTooltipContent hideLabel />}
                />
                <Line
                  dataKey='humidity'
                  dot={false}
                  stroke='var(--color-humidity)'
                  strokeWidth={2}
                  type='monotone'
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
