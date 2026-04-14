import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: () => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('thisisjustarandomstring') : ''
    if (!token) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.pathname + location.search,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})
