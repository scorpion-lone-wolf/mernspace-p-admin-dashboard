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
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    // actions
    setUser: (user: User) => set({ user }),

    logout: () => set({ user: null }),
  })),
);
