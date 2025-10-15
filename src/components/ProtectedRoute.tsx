import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/auth";
import { useEffect } from "react";
import { getMe } from "../lib/api";

export default function ProtectedRoute() {
  const location = useLocation();
  const { user, setUser, loading, setLoading } = useAuthStore();

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (user || loading) return;
      setLoading(true);
      try {
        const me = await getMe();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [user, loading, setUser, setLoading]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Loading…</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!user.is_influencer) {
    window.location.href = "https://moodverse.com.br";
    return null;
  }

  return <Outlet />;
}
