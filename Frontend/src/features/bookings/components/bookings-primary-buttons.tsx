import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBookings } from './bookings-provider'

import { useAuthStore } from '@/stores/auth-store'

export function BookingsPrimaryButtons() {
    const { setOpen } = useBookings()
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')

    if (!isAdmin) return null

    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')}>
                <Calendar className='mr-2 h-4 w-4' />
                Add Booking
            </Button>
        </div>
    )
}
