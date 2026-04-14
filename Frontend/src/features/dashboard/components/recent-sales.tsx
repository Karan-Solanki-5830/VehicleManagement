import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { dashboardApi, type RecentBooking } from '@/services/dashboard'
import { useEffect, useState } from 'react'

export function RecentBookings() {
  const [recentPayments, setRecentPayments] = useState<RecentBooking[]>([])

  useEffect(() => {
    const fetchRecentPayments = async () => {
      try {
        const data = await dashboardApi.getRecentBookings()
        setRecentPayments(data)
      } catch (error) {
        console.error('Failed to load recent payments', error)
      }
    }
    fetchRecentPayments()
  }, [])

  return (
    <div className='space-y-10'>
      {recentPayments.map((payment, index) => {
        const fallback = payment.customerName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <div key={payment.id} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              <AvatarImage
                src={`/avatars/0${(index % 5) + 1}.png`}
                alt='Avatar'
              />
              <AvatarFallback>{fallback}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm leading-none font-medium'>
                  {payment.customerName}
                </p>
                <p className='text-sm text-muted-foreground'>
                  Vehicle: {payment.vehicleNumber}
                </p>
              </div>
              <div className='font-medium'>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                }).format(payment.amount)}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
