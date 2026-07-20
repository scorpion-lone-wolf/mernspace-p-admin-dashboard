import type { User } from "@/types";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type { Tenant, User } from "@/types";

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
