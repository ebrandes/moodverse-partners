import { useEffect, useState } from "react";
import { getDashboard } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Copy, Check } from "lucide-react";

type CouponData = {
  code: string;
  is_active: boolean;
  total_clicks: number;
  total_conversions: number;
  total_revenue: number;
  total_commission: number;
};

export default function CuponsPage() {
  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [referenceCode, setReferenceCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadCoupon();
  }, []);

  const loadCoupon = async () => {
    setLoading(true);
    setError(null);

    try {
      const dashboardData = await getDashboard();
      setCoupon(dashboardData.coupon);
      setReferenceCode(dashboardData.reference_code);
    } catch (err: any) {
      console.error("Error loading coupon:", err);
      setError(err?.response?.data?.error || "Erro ao carregar dados do cupom");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const referralUrl = `https://moodverse.com.br?ref=${referenceCode}`;

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Cupons</h1>
        <p style={{ color: "#666" }}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Cupons</h1>
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: 12, borderRadius: 8 }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Cupons</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Seu cupom de desconto e link de referência
      </p>

      {/* Cupom Principal */}
      {coupon ? (
        <>
          <Card style={{ marginBottom: 24 }}>
            <CardHeader>
              <CardTitle>Seu Cupom de Desconto</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  background: "#f9fafb",
                  padding: 24,
                  borderRadius: 8,
                  border: "2px dashed #d1d5db",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 12, color: "#666", marginBottom: 8 }}>
                  CÓDIGO DO CUPOM
                </div>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    fontFamily: "monospace",
                    color: "#111",
                    letterSpacing: 2,
                    marginBottom: 16,
                  }}
                >
                  {coupon.code}
                </div>
                <button
                  onClick={() => copyToClipboard(coupon.code)}
                  style={{
                    background: "#111",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: 8,
                    border: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? "Copiado!" : "Copiar Cupom"}
                </button>
              </div>

              {/* Status */}
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <span
                  style={{
                    background: coupon.is_active ? "#d1fae5" : "#fee2e2",
                    color: coupon.is_active ? "#065f46" : "#991b1b",
                    padding: "4px 12px",
                    borderRadius: 12,
                    fontSize: 12,
                    fontWeight: 500,
                  }}
                >
                  {coupon.is_active ? "✓ Ativo" : "✗ Inativo"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Link de Referência */}
          <Card style={{ marginBottom: 24 }}>
            <CardHeader>
              <CardTitle>Link de Referência</CardTitle>
            </CardHeader>
            <CardContent>
              <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
                Compartilhe este link nas suas redes sociais:
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  background: "#f9fafb",
                  padding: 12,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                }}
              >
                <input
                  type="text"
                  value={referralUrl}
                  readOnly
                  style={{
                    flex: 1,
                    border: "none",
                    background: "transparent",
                    fontSize: 14,
                    fontFamily: "monospace",
                    outline: "none",
                  }}
                />
                <button
                  onClick={() => copyToClipboard(referralUrl)}
                  style={{
                    background: "#111",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: 6,
                    border: "none",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copiado" : "Copiar"}
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas do Cupom */}
          <Card>
            <CardHeader>
              <CardTitle>Performance do Cupom</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Total de Cliques
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>
                    {coupon.total_clicks.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Total de Conversões
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>
                    {coupon.total_conversions}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Receita Gerada
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600 }}>
                    R$ {coupon.total_revenue.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>
                    Sua Comissão
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 600, color: "#059669" }}>
                    R$ {coupon.total_commission.toFixed(2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent style={{ padding: 32, textAlign: "center" }}>
            <p style={{ color: "#6b7280" }}>
              Nenhum cupom encontrado. Entre em contato com o suporte.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
