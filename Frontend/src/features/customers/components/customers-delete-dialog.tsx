'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Customer } from '@/types'
import { customersApi } from '@/services/customers'

type CustomerDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentRow: Customer
    onSuccess: () => void
}

export function CustomersDeleteDialog({
    open,
    onOpenChange,
    currentRow,
    onSuccess,
}: CustomerDeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        setIsLoading(true)
        try {
            await customersApi.delete(currentRow.id)
            toast.success('Customer deleted successfully')
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete customer')
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
                    Delete Customer
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete{' '}
                        <span className='font-bold'>{currentRow.name}</span>?
                    </p>
                    <br />
                </div>
            }
            confirmText='Delete'
            destructive
        />
    )
}
