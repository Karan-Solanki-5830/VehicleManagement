'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Payment } from '@/types'
import { paymentsApi } from '@/services/payments'

type PaymentDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    payment: Payment | null
    onSuccess: () => void
}

export function PaymentsDeleteDialog({
    open,
    onOpenChange,
    payment,
    onSuccess,
}: PaymentDeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!payment) return

        setIsLoading(true)
        try {
            await paymentsApi.delete(payment.id)
            toast.success('Payment deleted successfully')
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete payment')
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
                    Delete Payment
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete Payment{' '}
                        <span className='font-bold'>#{payment?.id}</span>?
                    </p>
                </div>
            }
            confirmText='Delete'
            destructive
        />
    )
}
