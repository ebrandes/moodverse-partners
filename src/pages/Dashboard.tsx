import { useAuthStore } from "../stores/auth";
import StatsCards from "../components/partners/StatsCards";
import SalesChart from "../components/partners/SalesChart";

export default function DashboardPage() {
  const { user } = useAuthStore();
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: "#444" }}>
        Welcome{user?.full_name ? `, ${user.full_name}` : ""}.
      </p>
      <div className="mt-4 space-y-6">
        <StatsCards />
        <SalesChart />
      </div>
    </div>
  );
}
