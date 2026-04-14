import {
  Construction,
  LayoutDashboard,
  Bug,
  FileX,
  Lock,
  ServerOff,
  UserX,
  ShieldCheck,
  Command,
  Car,
  Calendar,
  CreditCard,
  UsersRound,
} from 'lucide-react'
import { type SidebarData } from '@/types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
  },
  teams: [
    {
      name: 'Transit',
      logo: Command,
      plan: '',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'Vehicle Management',
      items: [
        {
          title: 'Customers',
          url: '/customers',
          icon: UsersRound,
        },
        {
          title: 'Vehicles',
          url: '/vehicles',
          icon: Car,
        },
        {
          title: 'Bookings',
          url: '/bookings',
          icon: Calendar,
        },
        {
          title: 'Payments',
          url: '/payments',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Auth',
      items: [
        {
          title: 'Login',
          url: '/login',
          icon: ShieldCheck,
        },
        {
          title: 'Register',
          url: '/register',
          icon: ShieldCheck,
        },
      ],
    },
    {
      title: 'Errors',
      items: [
        {
          title: 'Errors',
          icon: Bug,
          items: [
            {
              title: 'Unauthorized',
              url: '/errors/unauthorized',
              icon: Lock,
            },
            {
              title: 'Forbidden',
              url: '/errors/forbidden',
              icon: UserX,
            },
            {
              title: 'Not Found',
              url: '/errors/not-found',
              icon: FileX,
            },
            {
              title: 'Internal Server Error',
              url: '/errors/internal-server-error',
              icon: ServerOff,
            },
            {
              title: 'Maintenance Error',
              url: '/errors/maintenance-error',
              icon: Construction,
            },
          ],
        },
      ],
    },
  ],
}
