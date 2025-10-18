import { useEffect, useState } from "react";
import {
  getPaymentSummary,
  requestWithdrawal,
  updatePaymentInfo,
  getMe,
} from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { toast } from "sonner";

type PaymentSummary = {
  available_balance: number;
  total_earned: number;
  pending_withdrawal: number;
  total_paid: number;
  processing: number;
  minimum_withdrawal: number;
  can_withdraw: boolean;
};

type Payment = {
  id: number;
  amount: number;
  status: string;
  status_display: string;
  payment_method: string;
  created_at: string;
  paid_at: string | null;
  period: string;
};

type PaymentInfo = {
  payment_method: "pix" | "bank_transfer";
  pix_key: string;
  bank_name: string;
  bank_agency: string;
  bank_account: string;
  bank_account_type: "checking" | "savings";
};

export default function PagamentosPage() {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    payment_method: "pix",
    pix_key: "",
    bank_name: "",
    bank_agency: "",
    bank_account: "",
    bank_account_type: "checking",
  });
  const [savingPaymentInfo, setSavingPaymentInfo] = useState(false);
  const [isEditingPaymentInfo, setIsEditingPaymentInfo] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Buscar dados do influencer para pegar informações de pagamento
      const userData = await getMe();
      const influencerProfile = userData.influencer_profile || {};

      setPaymentInfo({
        payment_method: influencerProfile.pix_key
          ? "pix"
          : influencerProfile.bank_account
          ? "bank_transfer"
          : "pix",
        pix_key: influencerProfile.pix_key || "",
        bank_name: influencerProfile.bank_name || "",
        bank_agency: influencerProfile.bank_agency || "",
        bank_account: influencerProfile.bank_account || "",
        bank_account_type: influencerProfile.bank_account_type || "checking",
      });

      const summaryData = await getPaymentSummary();
      setSummary(summaryData);

      // Payment history está dentro do summary
      if (summaryData.payment_history) {
        setPayments(summaryData.payment_history);
      }
    } catch (err: any) {
      console.error("Error loading payment data:", err);
      setError(err?.response?.data?.error || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePaymentInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPaymentInfo(true);

    try {
      await updatePaymentInfo(paymentInfo);
      toast("Dados de pagamento salvos com sucesso!");
      setIsEditingPaymentInfo(false);
      loadData();
    } catch (err: any) {
      console.error("Error saving payment info:", err);
      toast(err?.response?.data?.error || "Erro ao salvar dados de pagamento");
    } finally {
      setSavingPaymentInfo(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!summary) return;
    const amount = summary.available_balance;
    if (amount < (summary.minimum_withdrawal || 50)) {
      toast(
        `Saldo mínimo para saque: R$ ${(
          summary.minimum_withdrawal || 50
        ).toFixed(2)}`
      );
      return;
    }

    setWithdrawing(true);
    try {
      await requestWithdrawal({
        amount,
        payment_method: paymentInfo.payment_method,
        notes: "Solicitação via portal partners",
      });

      toast("Solicitação de saque enviada com sucesso!");
      setShowWithdrawModal(false);
      loadData();
    } catch (err: any) {
      console.error("Error requesting withdrawal:", err);
      toast(err?.response?.data?.error || "Erro ao solicitar saque");
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Pagamentos</h1>
        <p style={{ color: "#666" }}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, marginBottom: 8 }}>Pagamentos</h1>
        <div
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: 12,
            borderRadius: 8,
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Pagamentos</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Gerencie seus ganhos e solicite saques
      </p>

      {/* Dados Bancários - Summary + Edit */}
      <Card style={{ marginBottom: 24 }}>
        <CardHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <CardTitle>Dados Bancários</CardTitle>
            <button
              onClick={() => setIsEditingPaymentInfo((v) => !v)}
              style={{
                background: isEditingPaymentInfo ? "#e5e7eb" : "#111827",
                color: isEditingPaymentInfo ? "#111827" : "#fff",
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {isEditingPaymentInfo ? "Cancelar" : "Alterar"}
            </button>
          </div>
        </CardHeader>
        <CardContent>
          {!isEditingPaymentInfo && (
            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <span style={{ fontSize: 12, color: "#6b7280" }}>Método</span>
                <div style={{ fontSize: 14, fontWeight: 600 }}>
                  {paymentInfo.payment_method === "pix"
                    ? "PIX"
                    : "Transferência Bancária"}
                </div>
              </div>
              {paymentInfo.payment_method === "pix" ? (
                <div>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>
                    Chave PIX
                  </span>
                  <div style={{ fontSize: 14 }}>
                    {paymentInfo.pix_key
                      ? `${paymentInfo.pix_key.slice(
                          0,
                          3
                        )}••••••${paymentInfo.pix_key.slice(-3)}`
                      : "—"}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                    gap: 12,
                  }}
                >
                  <div>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      Banco
                    </span>
                    <div style={{ fontSize: 14 }}>
                      {paymentInfo.bank_name || "—"}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      Agência
                    </span>
                    <div style={{ fontSize: 14 }}>
                      {paymentInfo.bank_agency || "—"}
                    </div>
                  </div>
                  <div>
                    <span style={{ fontSize: 12, color: "#6b7280" }}>
                      Conta
                    </span>
                    <div style={{ fontSize: 14 }}>
                      {paymentInfo.bank_account
                        ? `••••${paymentInfo.bank_account.slice(-4)}`
                        : "—"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {isEditingPaymentInfo && (
            <form onSubmit={handleSavePaymentInfo}>
              {/* Método de Pagamento */}
              <div style={{ marginBottom: 20 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 14,
                    fontWeight: 500,
                    marginBottom: 8,
                  }}
                >
                  Método de Pagamento
                </label>
                <div style={{ display: "flex", gap: 16 }}>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="pix"
                      checked={paymentInfo.payment_method === "pix"}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          payment_method: e.target.value as "pix",
                        })
                      }
                    />
                    <span>PIX</span>
                  </label>
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={paymentInfo.payment_method === "bank_transfer"}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          payment_method: e.target.value as "bank_transfer",
                        })
                      }
                    />
                    <span>Transferência Bancária</span>
                  </label>
                </div>
              </div>

              {/* Campos PIX */}
              {paymentInfo.payment_method === "pix" && (
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 14,
                      fontWeight: 500,
                      marginBottom: 8,
                    }}
                  >
                    Chave PIX
                  </label>
                  <input
                    type="text"
                    value={paymentInfo.pix_key}
                    onChange={(e) =>
                      setPaymentInfo({
                        ...paymentInfo,
                        pix_key: e.target.value,
                      })
                    }
                    placeholder="seuemail@example.com ou CPF/CNPJ"
                    required
                    style={{
                      width: "100%",
                      padding: 10,
                      border: "1px solid #ddd",
                      borderRadius: 8,
                      fontSize: 14,
                    }}
                  />
                </div>
              )}

              {/* Campos Transferência Bancária */}
              {paymentInfo.payment_method === "bank_transfer" && (
                <>
                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      Nome do Banco
                    </label>
                    <input
                      type="text"
                      value={paymentInfo.bank_name}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          bank_name: e.target.value,
                        })
                      }
                      placeholder="Ex: Banco do Brasil"
                      required
                      style={{
                        width: "100%",
                        padding: 10,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 16,
                      marginBottom: 20,
                    }}
                  >
                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 8,
                        }}
                      >
                        Agência
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.bank_agency}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            bank_agency: e.target.value,
                          })
                        }
                        placeholder="1234"
                        required
                        style={{
                          width: "100%",
                          padding: 10,
                          border: "1px solid #ddd",
                          borderRadius: 8,
                          fontSize: 14,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: 500,
                          marginBottom: 8,
                        }}
                      >
                        Conta
                      </label>
                      <input
                        type="text"
                        value={paymentInfo.bank_account}
                        onChange={(e) =>
                          setPaymentInfo({
                            ...paymentInfo,
                            bank_account: e.target.value,
                          })
                        }
                        placeholder="56789-0"
                        required
                        style={{
                          width: "100%",
                          padding: 10,
                          border: "1px solid #ddd",
                          borderRadius: 8,
                          fontSize: 14,
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 14,
                        fontWeight: 500,
                        marginBottom: 8,
                      }}
                    >
                      Tipo de Conta
                    </label>
                    <select
                      value={paymentInfo.bank_account_type}
                      onChange={(e) =>
                        setPaymentInfo({
                          ...paymentInfo,
                          bank_account_type: e.target.value as
                            | "checking"
                            | "savings",
                        })
                      }
                      required
                      style={{
                        width: "100%",
                        padding: 10,
                        border: "1px solid #ddd",
                        borderRadius: 8,
                        fontSize: 14,
                      }}
                    >
                      <option value="checking">Conta Corrente</option>
                      <option value="savings">Poupança</option>
                    </select>
                  </div>
                </>
              )}

              {/* Botão Salvar */}
              <button
                type="submit"
                disabled={savingPaymentInfo}
                style={{
                  background: "#059669",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: 8,
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: savingPaymentInfo ? "not-allowed" : "pointer",
                  opacity: savingPaymentInfo ? 0.6 : 1,
                }}
              >
                {savingPaymentInfo ? "Salvando..." : "Salvar Dados Bancários"}
              </button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Cards de Saldo */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Saldo Disponível</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#059669" }}>
              R$ {summary?.available_balance?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Ganho</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#111" }}>
              R$ {summary?.total_earned?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendente</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#f59e0b" }}>
              R$ {summary?.pending_withdrawal?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Já Recebido</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: 32, fontWeight: 700, color: "#6b7280" }}>
              R$ {summary?.total_paid?.toFixed(2) || "0.00"}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botão de Saque (saldo total) */}
      {summary?.can_withdraw &&
        summary.available_balance >= (summary.minimum_withdrawal || 0) &&
        !summary.pending_withdrawal &&
        !summary.processing && (
          <button
            onClick={() => setShowWithdrawModal(true)}
            style={{
              background: "#059669",
              color: "white",
              padding: "12px 24px",
              borderRadius: 8,
              border: "none",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              marginBottom: 24,
            }}
          >
            Solicitar Saque
          </button>
        )}

      {!summary?.can_withdraw && summary && (
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          Saldo mínimo para saque: R$ {summary.minimum_withdrawal.toFixed(2)}
        </p>
      )}

      {/* Histórico de Pagamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Pagamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {payments.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      PERÍODO
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      VALOR
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      STATUS
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      MÉTODO
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "12px 8px",
                        fontSize: 12,
                        color: "#666",
                      }}
                    >
                      DATA
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr
                      key={payment.id}
                      style={{ borderBottom: "1px solid #f5f5f5" }}
                    >
                      <td style={{ padding: "12px 8px", fontSize: 14 }}>
                        {payment.period}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        R$ {payment.amount.toFixed(2)}
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: 14 }}>
                        <span
                          style={{
                            background:
                              payment.status === "paid"
                                ? "#d1fae5"
                                : payment.status === "pending"
                                ? "#fef3c7"
                                : "#e5e7eb",
                            color:
                              payment.status === "paid"
                                ? "#065f46"
                                : payment.status === "pending"
                                ? "#92400e"
                                : "#374151",
                            padding: "4px 8px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          {payment.status_display}
                        </span>
                      </td>
                      <td style={{ padding: "12px 8px", fontSize: 14 }}>
                        {payment.payment_method}
                      </td>
                      <td
                        style={{
                          padding: "12px 8px",
                          fontSize: 14,
                          color: "#6b7280",
                        }}
                      >
                        {payment.paid_at
                          ? new Date(payment.paid_at).toLocaleDateString(
                              "pt-BR"
                            )
                          : new Date(payment.created_at).toLocaleDateString(
                              "pt-BR"
                            )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ padding: 32, textAlign: "center", color: "#6b7280" }}>
              Nenhum pagamento registrado ainda.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Saque - confirmar saldo total */}
      {showWithdrawModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowWithdrawModal(false)}
        >
          <div
            style={{
              background: "white",
              padding: 24,
              borderRadius: 12,
              width: 400,
              maxWidth: "90%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>
              Confirmar Saque
            </h2>
            <p style={{ fontSize: 14, color: "#374151", marginBottom: 8 }}>
              Você deseja sacar o saldo total disponível?
            </p>
            <p
              style={{
                fontSize: 18,
                fontWeight: 700,
                marginBottom: 16,
                color: "#059669",
              }}
            >
              R$ {summary?.available_balance?.toFixed(2)}
            </p>
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
              Mínimo para saque: R$ {summary?.minimum_withdrawal?.toFixed(2)}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setShowWithdrawModal(false)}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  border: "1px solid #ddd",
                  background: "white",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleWithdrawal}
                disabled={withdrawing}
                style={{
                  flex: 1,
                  padding: "10px 16px",
                  background: "#059669",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  cursor: withdrawing ? "not-allowed" : "pointer",
                  opacity: withdrawing ? 0.6 : 1,
                }}
              >
                {withdrawing ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
