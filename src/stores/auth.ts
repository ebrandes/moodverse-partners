import { create } from "zustand";

export interface ProductCommission {
  product_type: string;
  commission_amount: number;
}

export interface InfluencerProfile {
  id: number;
  status: string;
  reference_code: string;
  custom_slug?: string;
  total_points: number;
  current_month_points: number;
  current_level?: {
    id: number;
    name: string;
    level_number: number;
  } | null;
  product_commissions: ProductCommission[];
  total_commission: number;
  pending_commission: number;
  instagram_handle?: string;
  tiktok_handle?: string;
  youtube_channel?: string;
  bio?: string;
  pix_key?: string;
  bank_account?: string;
  approved_at?: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  is_influencer: boolean;
  influencer_profile?: InfluencerProfile;
}

interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  setUser: (user: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  setUser: (user: UserProfile | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
}));
