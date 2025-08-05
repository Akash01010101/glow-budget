import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Food & Dining', value: 850, color: 'hsl(var(--chart-1))' },
  { name: 'Transportation', value: 420, color: 'hsl(var(--chart-2))' },
  { name: 'Shopping', value: 680, color: 'hsl(var(--chart-3))' },
  { name: 'Entertainment', value: 320, color: 'hsl(var(--chart-4))' },
  { name: 'Bills & Utilities', value: 970, color: 'hsl(var(--chart-5))' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-neon">
        <p className="text-card-foreground font-medium">{payload[0].name}</p>
        <p className="text-primary font-bold">
          ${payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const ExpenseChart = () => {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={120}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={entry.color}
                strokeWidth={2}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            wrapperStyle={{ color: 'hsl(var(--card-foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};