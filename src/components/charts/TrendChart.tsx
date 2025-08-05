import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

const data = [
  { day: '1', amount: 120 },
  { day: '3', amount: 85 },
  { day: '5', amount: 200 },
  { day: '7', amount: 95 },
  { day: '9', amount: 160 },
  { day: '11', amount: 75 },
  { day: '13', amount: 310 },
  { day: '15', amount: 140 },
  { day: '17', amount: 95 },
  { day: '19', amount: 180 },
  { day: '21', amount: 125 },
  { day: '23', amount: 220 },
  { day: '25', amount: 190 },
  { day: '27', amount: 110 },
  { day: '29', amount: 260 },
  { day: '31', amount: 145 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-neon">
        <p className="text-card-foreground font-medium">Day {label}</p>
        <p className="text-primary font-bold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const TrendChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="day" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="hsl(var(--chart-3))"
            strokeWidth={3}
            fill="url(#colorGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};