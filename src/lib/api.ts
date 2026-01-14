import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000",
  withCredentials: true,
});

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

export async function login(email: string, password: string) {
  const { data } = await api.post("/api/influencers/login/", { email, password });
  return data;
}

export async function logout() {
  const { data } = await api.post("/api/auth/logout/");
  return data;
}

export async function getMe() {
  const { data } = await api.get("/api/influencers/me/");
  return data;
}

// ============================================================================
// DASHBOARD
// ============================================================================

export async function getDashboard() {
  const { data } = await api.get("/api/influencers/dashboard/");
  return data;
}

export async function getDashboardStats() {
  const { data } = await api.get("/api/influencers/dashboard-stats/");
  return data;
}

export async function getSales(params?: { limit?: number; days?: number }) {
  const q = new URLSearchParams();
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.days) q.set("days", String(params.days));
  const qs = q.toString();
  const url = `/api/influencers/sales/${qs ? `?${qs}` : ""}`;
  const { data } = await api.get(url);
  return data as {
    results: Array<{
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
    }>;
    count: number;
  };
}

// ============================================================================
// PERFIL
// ============================================================================

export async function getProfile() {
  const { data } = await api.get("/api/influencers/profile/");
  return data;
}

export async function updateProfile(profileData: any) {
  const { data } = await api.put("/api/influencers/profile/", profileData);
  return data;
}

// ============================================================================
// ANALYTICS
// ============================================================================

export async function getAnalytics(period: string = "month") {
  const { data } = await api.get(`/api/influencers/analytics/?period=${period}`);
  return data;
}

// ============================================================================
// CUPOM
// ============================================================================

export async function getMyCoupon() {
  const { data } = await api.get("/api/influencers/my-coupon/");
  return data;
}

export async function getCouponStats() {
  const { data } = await api.get("/api/influencers/coupons/stats/");
  return data;
}

// ============================================================================
// PAGAMENTOS
// ============================================================================

export async function getPayments() {
  const { data } = await api.get("/api/influencers/payments/");
  return data;
}

export async function getPaymentSummary() {
  const { data } = await api.get("/api/influencers/payment-summary/");
  return data;
}

export async function requestWithdrawal(withdrawalData: {
  amount: number;
  payment_method: string;
  notes?: string;
}) {
  const { data } = await api.post("/api/influencers/payments/request-withdrawal/", withdrawalData);
  return data;
}

export async function updatePaymentInfo(paymentData: {
  payment_method: 'pix' | 'bank_transfer';
  pix_key?: string;
  bank_name?: string;
  bank_agency?: string;
  bank_account?: string;
  bank_account_type?: 'checking' | 'savings';
}) {
  const { data } = await api.put("/api/influencers/payment-info/", paymentData);
  return data;
}

// ============================================================================
// OUTROS
// ============================================================================

export async function getChallenges() {
  const { data } = await api.get("/api/influencers/challenges/");
  return data;
}

export async function getNotifications() {
  const { data } = await api.get("/api/influencers/notifications/");
  return data;
}

export async function getLeaderboard(period: 'total' | 'month' | 'week' = 'month') {
  const { data } = await api.get(`/api/influencers/leaderboard/?period=${period}`);
  return data;
}
