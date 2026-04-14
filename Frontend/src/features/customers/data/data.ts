import { User, Shield } from 'lucide-react'

export const roles = [
    {
        label: 'User',
        value: 'User',
        icon: User,
    },
    {
        label: 'Admin',
        value: 'Admin',
        icon: Shield,
    },
] as const
