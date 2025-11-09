// src/stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type User = {
  id: string
  name: string
  email: string
  gender: string
  birthdate: string
  avatar_url: string;
  created_at: string;
  favourite_modal: string[];
}

type AuthState = {
  isLogin: boolean
  token: string | null
  user: User | null

  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      isLogin: false,
      token: null,
      user: null,

      login: (user, token) =>
        set({
          isLogin: true,
          token: token,
          user,
        }),

      logout: () =>
        set({
          isLogin: false,
          token: null,
          user: null,
        }),
    }),
    {
      name: 'auth-storage', // key trong localStorage
    }
  )
)
