import { createFileRoute, redirect } from '@tanstack/react-router'
import { Bookings } from '@/features/bookings'
import { useAuthStore } from '@/stores/auth-store'

export const Route = createFileRoute('/_authenticated/bookings/')({
  beforeLoad: () => {
    const { auth } = useAuthStore.getState()
    const isAdmin = auth.user?.role.includes('Admin')

    if (!isAdmin) {
      throw redirect({
        to: '/errors/$error',
        params: { error: 'forbidden' },
      })
    }
  },
  component: Bookings,
})
