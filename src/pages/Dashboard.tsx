import { useAuthStore } from "../stores/auth";
import StatsCards from "../components/partners/StatsCards";
import SalesChart from "../components/partners/SalesChart";
import { useEffect, useState } from "react";
import { getDashboardStats, getAnalytics, getSales } from "../lib/api";

type DashboardStats = {
  total_clicks: number;
  total_orders: number;
  total_commission: number;
  conversion_rate: number;
};

type DayData = {
  date: string;
  sales: number;
  commission: number;
  orders: number;
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [salesData, setSalesData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentSales, setRecentSales] = useState<
    Array<{
      order_id: number;
      order_number: string;
      date: string | null;
      total: number;
      commission_total: number;
      items: Array<{
        product: string;
        product_type?: string | null;
        category_ids?: number[];
        quantity: number;
        unit_commission: number;
        total_commission: number;
      }>;
    }>
  >([]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Buscar stats e analytics em paralelo
        const [statsResponse, analyticsResponse, salesResponse] =
          await Promise.all([
            getDashboardStats(),
            getAnalytics("week"),
            getSales({ limit: 10, days: 30 }),
          ]);

        if (!cancelled) {
          setStats(statsResponse);
          setSalesData(analyticsResponse.sales_by_day || []);
          setRecentSales(salesResponse.results || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          console.error("Error loading dashboard data:", err);
          setError(err?.response?.data?.error || "Erro ao carregar dados");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#444" }}>
        Welcome{user?.full_name ? `, ${user.full_name}` : ""}.
      </p>

      {error && (
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          {error}
        </div>
      )}

      <div className="mt-4 space-y-6">
        <StatsCards stats={stats} loading={loading} />
        {salesData.length > 0 && <SalesChart salesData={salesData} />}
        {/* Recent Sales Table */}
        {recentSales.length > 0 && (
          <div className="bg-white border rounded-lg">
            <div className="p-4 border-b font-semibold">Recent Sales</div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-[#666]">
                    <th className="text-left p-3">Order</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-right p-3">Total</th>
                    <th className="text-right p-3">Commission</th>
                    <th className="text-left p-3">Items</th>
                  </tr>
                </thead>
                <tbody>
                  {recentSales.map((s) => (
                    <tr key={s.order_id} className="border-b">
                      <td className="p-3 font-medium">{s.order_number}</td>
                      <td className="p-3">
                        {s.date ? new Date(s.date).toLocaleString() : "-"}
                      </td>
                      <td className="p-3 text-right">
                        R$ {s.total.toFixed(2)}
                      </td>
                      <td className="p-3 text-right text-[#059669] font-semibold">
                        R$ {s.commission_total.toFixed(2)}
                      </td>
                      <td className="p-3">
                        <div className="space-y-1">
                          {s.items.map((it, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="truncate">
                                {it.product}{" "}
                                <span className="text-[#666]">
                                  x{it.quantity}
                                </span>
                              </div>
                              <div className="text-right text-[#059669]">
                                R$ {it.total_commission.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
