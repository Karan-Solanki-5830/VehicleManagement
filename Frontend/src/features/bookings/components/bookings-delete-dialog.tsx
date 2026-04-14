'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Booking } from '@/types'
import { bookingsApi } from '@/services/bookings'

type BookingDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    booking: Booking | null
    onSuccess: () => void
}

export function BookingsDeleteDialog({
    open,
    onOpenChange,
    booking,
    onSuccess,
}: BookingDeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!booking) return

        setIsLoading(true)
        try {
            await bookingsApi.delete(booking.id)
            toast.success('Booking deleted successfully')
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete booking')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ConfirmDialog
            open={open}
            onOpenChange={onOpenChange}
            handleConfirm={handleDelete}
            disabled={isLoading}
            footerClassName='sm:justify-center'
            title={
                <span className='text-destructive'>
                    <AlertTriangle
                        className='me-1 inline-block stroke-destructive'
                        size={18}
                    />{' '}
                    Delete Booking
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete Booking{' '}
                        <span className='font-bold'>#{booking?.id}</span>?
                    </p>
                </div>
            }
            confirmText='Delete'
            destructive
        />
    )
}
