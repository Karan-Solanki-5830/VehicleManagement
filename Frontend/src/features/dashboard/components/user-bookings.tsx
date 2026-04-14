import { useEffect, useState } from 'react'
import { customersApi } from '@/services/customers'
import { vehiclesApi } from '@/services/vehicles'
import type { Booking, Vehicle } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Calendar, Car } from 'lucide-react'

interface EnrichedBooking extends Booking {
  vehicleModel?: string
  vehicleNumber?: string
}

interface UserBookingsProps {
  customerId: number
}

const statusColors: Record<string, string> = {
  Pending: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  Confirmed: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  Completed: 'bg-green-500/15 text-green-600 dark:text-green-400',
  Cancelled: 'bg-red-500/15 text-red-500 dark:text-red-400',
}

export function UserBookings({ customerId }: UserBookingsProps) {
  const [bookings, setBookings] = useState<EnrichedBooking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const [rawBookings, vehiclesResult] = await Promise.all([
          customersApi.getBookings(customerId),
          vehiclesApi.getAll(1, 1000),
        ])

        const vehicles: Vehicle[] = vehiclesResult.items ?? []

        // Take the 5 most recent, enrich with vehicle info
        const enriched: EnrichedBooking[] = rawBookings
          .slice(-5)
          .reverse()
          .map((b: Booking) => {
            const vehicle = vehicles.find((v) => v.id === b.vehicleId)
            return {
              ...b,
              vehicleModel: vehicle?.model ?? 'Unknown vehicle',
              vehicleNumber: vehicle?.vehicleNumber ?? '—',
            }
          })

        setBookings(enriched)
      } catch (error) {
        console.error('Failed to load user bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [customerId])

  if (loading) {
    return (
      <div className='space-y-4'>
        {[1, 2, 3].map((i) => (
          <div key={i} className='flex items-center gap-4 animate-pulse'>
            <div className='h-9 w-9 rounded-full bg-muted' />
            <div className='flex-1 space-y-2'>
              <div className='h-3 w-2/3 rounded bg-muted' />
              <div className='h-3 w-1/2 rounded bg-muted' />
            </div>
            <div className='h-5 w-16 rounded bg-muted' />
          </div>
        ))}
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-8 text-center text-muted-foreground'>
        <Calendar className='mb-2 h-8 w-8 opacity-40' />
        <p className='text-sm'>No bookings yet.</p>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {bookings.map((booking) => (
        <div key={booking.id} className='flex items-start gap-3'>
          <div className='flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10'>
            <Car className='h-4 w-4 text-primary' />
          </div>
          <div className='flex flex-1 flex-wrap items-center justify-between gap-1'>
            <div className='space-y-0.5'>
              <p className='text-sm font-medium leading-none'>
                {booking.vehicleModel}
              </p>
              <p className='text-xs text-muted-foreground'>
                {booking.vehicleNumber} &middot;{' '}
                {new Date(booking.bookingDate).toLocaleDateString()}
                {booking.returnDate &&
                  ` → ${new Date(booking.returnDate).toLocaleDateString()}`}
              </p>
            </div>
            <Badge
              variant='secondary'
              className={statusColors[booking.status] ?? ''}
            >
              {booking.status}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
