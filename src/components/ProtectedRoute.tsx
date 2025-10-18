import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { useEffect, useState } from "react";
import { getMe } from "../lib/api";

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, setUser } = useAuthStore();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Se já tem user, marcar como checked
    if (user) {
      console.log("✅ User already in store:", user.email);
      setChecked(true);
      return;
    }

    // Se já estamos checando, não fazer nada
    if (checked) {
      return;
    }

    console.log("🔍 No user in store, checking with backend...");
    let cancelled = false;
    
    const checkAuth = async () => {
      try {
        console.log("📡 Calling GET /api/influencers/me/");
        const me = await getMe();
        console.log("✅ User data received:", me.email, "is_influencer:", me.is_influencer);
        
        if (!cancelled) {
          setUser(me);
          setChecked(true);
        }
      } catch (error: any) {
        const status = error?.response?.status;
        console.error("❌ Auth check failed with status:", status);
        
        if (!cancelled) {
          setUser(null);
          setChecked(true);
        }
      }
    };

    checkAuth();

    return () => {
      cancelled = true;
    };
  }, [user, checked, setUser]); // Re-executar quando user mudar

  // Se ainda não checou, mostrar loading
  if (!checked) {
    console.log("⏳ Not checked yet, showing loading...");
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 16 }}>Loading…</div>
        <div style={{ fontSize: 12, color: "#666" }}>
          Verificando autenticação...
        </div>
      </div>
    );
  }

  // Já checou, mas não tem user - redirecionar para login
  if (!user) {
    console.log("❌ No user found after check, redirecting to /login");
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Tem user, verificar se é influencer
  if (!user.is_influencer) {
    console.log("❌ User is not influencer, showing error");
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <h2>Acesso Negado</h2>
        <p>Apenas influenciadores podem acessar esta área.</p>
        <button
          onClick={() => window.location.href = "https://moodverse.com.br"}
          style={{
            marginTop: 16,
            padding: "10px 20px",
            background: "#111",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Voltar para a loja
        </button>
      </div>
    );
  }

  console.log("✅ All checks passed, rendering protected routes");
  return <Outlet />;
}
