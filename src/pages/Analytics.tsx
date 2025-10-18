import { useEffect, useState } from "react";
import { getAnalytics } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";

type Analytics = {
  period: string;
  total_clicks: number;
  total_orders: number;
  total_sales: number;
  total_commission: number;
  conversion_rate: number;
  sales_by_day: Array<{ date: string; sales: number; commission: number; orders: number }>;
  top_products: Array<{ name: string; sales_count: number; total_revenue: number; commission_earned: number }>;
  traffic_sources?: Array<{ source: string; clicks: number; conversions: number }>;
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [period, setPeriod] = useState<string>("month");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getAnalytics(period);
      setAnalytics(data);
    } catch (err: any) {
      console.error("Error loading analytics:", err);
      setError(err?.response?.data?.error || "Erro ao carregar analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Analytics</h1>
        <p style={{ color: "#666" }}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Analytics</h1>
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 8 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, marginBottom: 4 }}>Analytics</h1>
          <p style={{ color: "#666" }}>Análise detalhada do seu desempenho</p>
        </div>

        {/* Filtro de Período */}
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          style={{
            padding: "8px 16px",
            border: "1px solid #ddd",
            borderRadius: 8,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <option value="week">Última Semana</option>
          <option value="month">Último Mês</option>
          <option value="year">Último Ano</option>
        </select>
      </div>

      {/* Cards de Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Card>
          <CardHeader>
            <CardTitle>Cliques</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {analytics?.total_clicks?.toLocaleString() || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {analytics?.total_orders || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vendas</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              R$ {analytics?.total_sales?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comissão</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#059669" }}>
              R$ {analytics?.total_commission?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700 }}>
              {analytics?.conversion_rate?.toFixed(1) || "0.0"}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Produtos */}
      {analytics?.top_products && analytics.top_products.length > 0 && (
        <Card style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Top Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                    <th style={{ textAlign: "left", padding: "12px 8px", fontSize: 12, color: "#666" }}>
                      PRODUTO
                    </th>
                    <th style={{ textAlign: "right", padding: "12px 8px", fontSize: 12, color: "#666" }}>
                      VENDAS
                    </th>
                    <th style={{ textAlign: "right", padding: "12px 8px", fontSize: 12, color: "#666" }}>
                      RECEITA
                    </th>
                    <th style={{ textAlign: "right", padding: "12px 8px", fontSize: 12, color: "#666" }}>
                      SUA COMISSÃO
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.top_products.map((product, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #f5f5f5" }}>
                      <td style={{ padding: "12px 8px", fontSize: 14, fontWeight: 500 }}>
                        {product.name}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: 14, textAlign: "right" }}>
                        {product.sales_count}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: 14, textAlign: "right" }}>
                        R$ {product.total_revenue.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: 14, textAlign: "right", fontWeight: 600, color: "#059669" }}>
                        R$ {product.commission_earned.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fontes de Tráfego */}
      {analytics?.traffic_sources && analytics.traffic_sources.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fontes de Tráfego</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ display: "grid", gap: 12 }}>
              {analytics.traffic_sources.map((source, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 12,
                    background: "#f9fafb",
                    borderRadius: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{source.source}</div>
                    <div style={{ fontSize: 12, color: "#666" }}>
                      {source.clicks} cliques • {source.conversions} conversões
                    </div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#059669" }}>
                    {source.clicks > 0 ? ((source.conversions / source.clicks) * 100).toFixed(1) : "0.0"}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
