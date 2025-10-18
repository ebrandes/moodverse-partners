import { useAuthStore } from "../stores/auth";
import StatsCards from "../components/partners/StatsCards";
import SalesChart from "../components/partners/SalesChart";
import { useEffect, useState } from "react";
import { getDashboardStats, getAnalytics } from "../lib/api";

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

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscar stats e analytics em paralelo
        const [statsResponse, analyticsResponse] = await Promise.all([
          getDashboardStats(),
          getAnalytics("week"),
        ]);

        if (!cancelled) {
          setStats(statsResponse);
          setSalesData(analyticsResponse.sales_by_day || []);
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
      </div>
    </div>
  );
}
