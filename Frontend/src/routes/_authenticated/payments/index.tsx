import { createFileRoute, redirect } from '@tanstack/react-router'
import { Payments } from '@/features/payments'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/payments/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    const userRole = auth.user?.role || []
    if (!userRole.includes('Admin')) {
      throw redirect({
        to: '/errors/$error',
        params: { error: 'forbidden' },
      })
    }
  },
  component: Payments,
})
