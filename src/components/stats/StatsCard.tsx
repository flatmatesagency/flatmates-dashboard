import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  format?: (value: number) => string;
}

export function StatsCard({ title, value, icon, format }: StatsCardProps) {
  const formattedValue = format ? format(value) : value.toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-card-foreground flex items-center gap-2">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-card-foreground">
          {formattedValue}
        </div>
      </CardContent>
    </Card>
  );
} 