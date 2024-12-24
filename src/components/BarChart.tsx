import { Bar, BarChart as RechartsBarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface BarChartProps {
  data: { name: string; value: number; input_title: string; post_thumbnail: string }[];
  valueFormatter: (value: number) => string;
}

const CustomTooltip = ({ active, payload, label, valueFormatter }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-4 rounded shadow-lg">
        <img src={data.post_thumbnail} alt={data.input_title} className="w-32 h-32 object-cover mb-2 rounded" />
        <p className="font-bold">{data.input_title}</p>
        <p>{`${label}: ${valueFormatter(data.value)}`}</p>
      </div>
    );
  }
  return null;
};

export function BarChart({ data, valueFormatter }: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip content={<CustomTooltip valueFormatter={valueFormatter} />} />
        <Bar dataKey="value" fill="#8884d8" />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
