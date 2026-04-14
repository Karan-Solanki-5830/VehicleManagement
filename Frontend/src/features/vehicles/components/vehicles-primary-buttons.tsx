import { Car, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useVehicles } from './vehicles-provider'
import { useAuthStore } from '@/stores/auth-store'


export function VehiclesPrimaryButtons() {
    const { setOpen, setBookingOpen } = useVehicles()
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')

    if (isAdmin) {
        return (
            <div className='flex gap-2'>
                <Button onClick={() => setOpen('add')}>
                    <Car className='mr-2 h-4 w-4' />
                    Add Vehicle
                </Button>
            </div>
        )
    }

    return (
        <div className='flex gap-2'>
            <Button onClick={() => setBookingOpen(true)}>
                <Calendar className='mr-2 h-4 w-4' />
                Book a Vehicle
            </Button>
        </div>
    )
}
