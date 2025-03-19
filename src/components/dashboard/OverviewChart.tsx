
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface OverviewChartProps {
  data: ChartData[];
  title: string;
  className?: string;
}

export default function OverviewChart({ data, title, className }: OverviewChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className={cn("glass-card p-6", className)}>
      <h3 className="font-medium mb-4">{title}</h3>
      
      <div className="relative h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
          <p className="text-3xl font-bold">{total}</p>
          <p className="text-sm text-muted-foreground">Total Items</p>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{item.value}</span>
              <span className="text-xs text-muted-foreground">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
