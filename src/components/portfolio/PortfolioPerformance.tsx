
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Portfolio } from "@/types/portfolio";
import { 
  PieChart, 
  LineChart, 
  BarChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line, 
  Pie, 
  Bar 
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, BarChart2, PieChart as PieChartIcon } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

interface PortfolioPerformanceProps {
  portfolio: Portfolio;
}

export function PortfolioPerformance({ portfolio }: PortfolioPerformanceProps) {
  const pieData = useMemo(() => {
    // Only include holdings with non-zero value
    return portfolio.holdings
      .filter(holding => holding.value > 0)
      .map(holding => ({
        name: holding.asset.symbol.toUpperCase(),
        value: holding.value,
        fill: getRandomColor(holding.asset.id),
      }));
  }, [portfolio.holdings]);

  // Generate random historical data for demonstration
  const generateHistoricalData = () => {
    const data = [];
    let value = portfolio.totalValue * 0.8;
    
    for (let i = 30; i >= 0; i--) {
      // Random daily change (-2% to +2%)
      const change = (Math.random() * 4 - 2) / 100;
      value = value * (1 + change);
      
      data.push({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        value: value,
      });
    }
    
    // End with the current value
    data[data.length - 1].value = portfolio.totalValue;
    
    return data;
  };

  const lineData = useMemo(() => generateHistoricalData(), [portfolio.totalValue]);

  // Calculate top performing assets
  const topPerformers = useMemo(() => {
    return [...portfolio.holdings]
      .sort((a, b) => b.return.percentage - a.return.percentage)
      .slice(0, 5)
      .map(holding => ({
        name: holding.asset.symbol.toUpperCase(),
        value: holding.return.percentage,
        fill: holding.return.percentage >= 0 ? "#22c55e" : "#ef4444",
      }));
  }, [portfolio.holdings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Performance History</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-1">
          <ChartContainer 
            config={{
              line: { theme: { light: "#3b82f6", dark: "#60a5fa" } },
              area: { theme: { light: "#3b82f6", dark: "#60a5fa" } },
            }}
            className="h-[300px]"
          >
            <LineChart
              data={lineData}
              margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return `${date.getDate()}/${date.getMonth() + 1}`;
                }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => {
                  return portfolio.currency === 'INR' ? `₹${formatCompactNumber(value)}` : `$${formatCompactNumber(value)}`;
                }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.75rem] uppercase text-muted-foreground">
                              Date
                            </span>
                            <span className="font-bold">
                              {new Date(payload[0].payload.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.75rem] uppercase text-muted-foreground">
                              Value
                            </span>
                            <span className="font-bold">
                              {formatCurrency(payload[0].value as number, portfolio.currency)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Asset Allocation</CardTitle>
          <PieChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {pieData.length > 0 ? (
            <ChartContainer 
              config={pieData.reduce((config, item) => {
                config[item.name] = { color: item.fill };
                return config;
              }, {} as Record<string, { color: string }>)}
              className="h-[200px]"
            >
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                />
                <Tooltip content={<ChartTooltipContent nameKey="name" labelKey="value" formatter={(value) => formatCurrency(value as number, portfolio.currency)} />} />
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No assets to display
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="md:col-span-3">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          <BarChart2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-1">
          {topPerformers.length > 0 ? (
            <ChartContainer
              config={topPerformers.reduce((config, item) => {
                config[item.name] = { color: item.fill };
                return config;
              }, {} as Record<string, { color: string }>)}
              className="h-[200px]"
            >
              <BarChart data={topPerformers} layout="vertical" margin={{ top: 10, right: 10, left: 80, bottom: 10 }}>
                <XAxis 
                  type="number" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `${value.toFixed(1)}%`}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  formatter={(value) => [`${(value as number).toFixed(2)}%`, "Return"]}
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                />
              </BarChart>
            </ChartContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              No performance data to display
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions
function getRandomColor(seed: string): string {
  // Generate a deterministic color based on the seed string
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Convert to hexadecimal and ensure it's 6 characters
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
}
