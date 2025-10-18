import { useAuthStore } from "../stores/auth";

export default function ConfiguracoesPage() {
  const { user } = useAuthStore();
  const influencer = user?.influencer_profile;

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Configurações</h1>
      <p style={{ color: "#666", marginBottom: 24 }}>
        Informações do seu perfil e comissões
      </p>

      {/* Informações do perfil */}
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 600 }}>
          Dados do Perfil
        </h2>
        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: "#666", display: "block" }}>
              Nome
            </label>
            <p style={{ fontSize: 14, margin: "4px 0" }}>{user?.full_name || "-"}</p>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", display: "block" }}>
              Email
            </label>
            <p style={{ fontSize: 14, margin: "4px 0" }}>{user?.email || "-"}</p>
          </div>
          <div>
            <label style={{ fontSize: 12, color: "#666", display: "block" }}>
              Código de Referência
            </label>
            <p
              style={{
                fontSize: 14,
                margin: "4px 0",
                fontFamily: "monospace",
                background: "#f5f5f5",
                padding: "4px 8px",
                borderRadius: 4,
                display: "inline-block",
              }}
            >
              {influencer?.reference_code || "-"}
            </p>
          </div>
          {influencer?.current_level && (
            <div>
              <label style={{ fontSize: 12, color: "#666", display: "block" }}>
                Nível Atual
              </label>
              <p style={{ fontSize: 14, margin: "4px 0" }}>
                {influencer.current_level.name} (Nível {influencer.current_level.level_number})
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Comissões por Produto */}
      <div
        style={{
          background: "white",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 600 }}>
          Comissões por Produto
        </h2>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 16 }}>
          Valores que você recebe por cada produto vendido através do seu link de
          referência.
        </p>

        {influencer?.product_commissions &&
        influencer.product_commissions.length > 0 ? (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e5e5" }}>
                  <th
                    style={{
                      textAlign: "left",
                      padding: "12px 8px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Tipo de Produto
                  </th>
                  <th
                    style={{
                      textAlign: "right",
                      padding: "12px 8px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#666",
                      textTransform: "uppercase",
                    }}
                  >
                    Comissão por Unidade
                  </th>
                </tr>
              </thead>
              <tbody>
                {influencer.product_commissions.map((commission, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid #f5f5f5",
                    }}
                  >
                    <td style={{ padding: "12px 8px", fontSize: 14 }}>
                      <span
                        style={{
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {commission.product_type}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px 8px",
                        fontSize: 14,
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#059669",
                      }}
                    >
                      R$ {commission.commission_amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            style={{
              padding: 32,
              textAlign: "center",
              background: "#f9fafb",
              borderRadius: 8,
              border: "1px dashed #d1d5db",
            }}
          >
            <p style={{ color: "#6b7280", fontSize: 14 }}>
              Nenhuma comissão configurada ainda.
              <br />
              Entre em contato com o administrador para configurar suas comissões.
            </p>
          </div>
        )}
      </div>

      {/* Resumo de Comissões */}
      {influencer && (
        <div
          style={{
            marginTop: 20,
            background: "white",
            padding: 24,
            borderRadius: 12,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: 18, marginBottom: 16, fontWeight: 600 }}>
            Resumo Financeiro
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, color: "#666", display: "block" }}>
                Total de Comissões Recebidas
              </label>
              <p style={{ fontSize: 24, fontWeight: 600, color: "#059669", marginTop: 4 }}>
                R$ {influencer.total_commission?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#666", display: "block" }}>
                Comissões Pendentes
              </label>
              <p style={{ fontSize: 24, fontWeight: 600, color: "#f59e0b", marginTop: 4 }}>
                R$ {influencer.pending_commission?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
