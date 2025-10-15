import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
import AnalyticsPage from "./pages/Analytics";
import ProdutosPage from "./pages/Produtos";
import PagamentosPage from "./pages/Pagamentos";
import CuponsPage from "./pages/Cupons";
import RankingPage from "./pages/Ranking";
import HealthPage from "./pages/Health";
import ConfiguracoesPage from "./pages/Configuracoes";
import OnboardingPage from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/pagamentos" element={<PagamentosPage />} />
          <Route path="/cupons" element={<CuponsPage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/health" element={<HealthPage />} />
          <Route path="/configuracoes" element={<ConfiguracoesPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
