import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Eye, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";

type DashboardStats = {
  total_clicks?: number;
  total_orders?: number;
  total_commission?: number;
  conversion_rate?: number;
};

interface StatsCardsProps {
  stats: DashboardStats | null;
  loading?: boolean;
}

export default function StatsCards({ stats, loading = false }: StatsCardsProps) {

  const items = [
    {
      title: "Total Clicks",
      value: stats?.total_clicks ?? 0,
      icon: Eye,
      badgeClass: "bg-[#f3f3f3] text-[#333]",
    },
    {
      title: "Total Orders",
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      badgeClass: "bg-[#f3f3f3] text-[#333]",
    },
    {
      title: "Total Commission",
      value: `R$ ${(stats?.total_commission ?? 0).toFixed(2)}`,
      icon: DollarSign,
      badgeClass: "bg-black text-white",
    },
    {
      title: "Conversion Rate",
      value: `${(stats?.conversion_rate ?? 0).toFixed(1)}%`,
      icon: TrendingUp,
      badgeClass: "bg-[#e8f5e9] text-[#0a0]",
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent>
              <div className="animate-pulse space-y-3">
                <div className="h-4 bg-[#eee] rounded w-3/4" />
                <div className="h-8 bg-[#eee] rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Card
            key={item.title}
            className="hover:border-[#d9d9d9] transition-colors"
          >
            <CardHeader className="pb-3">
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-[#111]">
                  {item.value}
                </div>
                <div className={`p-2 rounded-lg ${item.badgeClass}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
