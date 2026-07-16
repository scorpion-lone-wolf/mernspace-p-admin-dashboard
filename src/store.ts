import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface Tenant {
  id: string;
  name: string;
  address: string;
}
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  tenant?: Tenant;
}

interface AuthState {
  user: User | null;
  isAuthLoading: boolean;
  setUser: (user: User) => void;
  setAuthLoading: (isAuthLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    isAuthLoading: true,

    // actions
    setUser: (user: User) => set({ user }),
    setAuthLoading: (isAuthLoading: boolean) => set({ isAuthLoading }),

    logout: () => set({ user: null }),
  })),
);
