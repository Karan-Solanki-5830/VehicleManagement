import { create } from 'zustand'
import { parseJwt } from '@/lib/auth'

const ACCESS_TOKEN = 'thisisjustarandomstring'

interface AuthUser {
  accountNo: string
  email: string
  name?: string
  role: string[]
  imageUrl?: string
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
    isAuthenticated: () => boolean
  }
}

export const useAuthStore = create<AuthState>()((set, get) => {
  const initToken = typeof window !== 'undefined' ? sessionStorage.getItem(ACCESS_TOKEN) || '' : ''

  let initUser: AuthUser | null = null
  if (initToken) {
    try {
      const payload = parseJwt(initToken)
      initUser = {
        accountNo: payload.sub || payload.nameid || 'N/A',
        email: payload.unique_name || payload.name || '',
        name: payload.unique_name || payload.name || '',
        role: Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : ['user'],
        imageUrl: payload.ImageUrl || '',
        exp: payload.exp * 1000,
      }
    } catch (e) {
      console.error('Failed to parse token on init', e)
    }
  }

  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          sessionStorage.setItem(ACCESS_TOKEN, accessToken)
          try {
            const payload = parseJwt(accessToken)
            const user = {
              accountNo: payload.sub || payload.nameid || 'N/A',
              email: payload.unique_name || payload.name || '',
              name: payload.unique_name || payload.name || '',
              role: Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : ['user'],
              imageUrl: payload.ImageUrl || '',
              exp: payload.exp * 1000,
            }
            return { ...state, auth: { ...state.auth, accessToken, user } }
          } catch (e) {
            return { ...state, auth: { ...state.auth, accessToken } }
          }
        }),
      resetAccessToken: () =>
        set((state) => {
          sessionStorage.removeItem(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '', user: null } }
        }),
      reset: () =>
        set((state) => {
          sessionStorage.removeItem(ACCESS_TOKEN)
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
      isAuthenticated: () => {
        const state = get()
        return !!state.auth.accessToken && !!state.auth.user
      },
    },
  }
})
