import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";

type DayData = { day: string; sales: number; commission: number };

export default function SalesChart() {
  const [data, setData] = useState<DayData[]>([]);
  const [max, setMax] = useState(1);

  useEffect(() => {
    // Placeholder data until wired to analytics endpoint
    const last7 = [
      { day: "Sun", sales: 0, commission: 0 },
      { day: "Mon", sales: 0, commission: 0 },
      { day: "Tue", sales: 0, commission: 0 },
      { day: "Wed", sales: 0, commission: 0 },
      { day: "Thu", sales: 0, commission: 0 },
      { day: "Fri", sales: 0, commission: 0 },
      { day: "Sat", sales: 0, commission: 0 },
    ];
    setData(last7);
    setMax(1);
  }, []);

  const totalSales = data.reduce((s, d) => s + d.sales, 0);
  const totalCommission = data.reduce((s, d) => s + d.commission, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales — Last 7 days</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[#eef2ff] rounded-lg">
            <div className="text-2xl font-bold text-[#111]">
              R$ {totalSales.toFixed(2)}
            </div>
            <div className="text-sm text-[#444]">Total Sales</div>
          </div>
          <div className="text-center p-4 bg-[#eaf7ea] rounded-lg">
            <div className="text-2xl font-bold text-[#111]">
              R$ {totalCommission.toFixed(2)}
            </div>
            <div className="text-sm text-[#444]">Your Commission</div>
          </div>
        </div>

        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((d) => (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div className="w-full relative flex flex-col justify-end h-full">
                <div
                  className="bg-[#3b82f6] rounded-t-md"
                  style={{ height: `${(d.sales / max) * 100}%`, minHeight: 6 }}
                />
                <div
                  className="bg-[#22c55e] rounded-t-md absolute bottom-0 w-full opacity-60"
                  style={{
                    height: `${(d.commission / max) * 100}%`,
                    minHeight: 4,
                  }}
                />
              </div>
              <div className="text-xs font-medium text-[#555]">{d.day}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
