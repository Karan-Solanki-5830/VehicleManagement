'use client'

import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type Vehicle } from '@/types'
import { vehiclesApi } from '@/services/vehicles'

type VehicleDeleteDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    vehicle: Vehicle | null
    onSuccess: () => void
}

export function VehiclesDeleteDialog({
    open,
    onOpenChange,
    vehicle,
    onSuccess,
}: VehicleDeleteDialogProps) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!vehicle) return

        setIsLoading(true)
        try {
            await vehiclesApi.delete(vehicle.id)
            toast.success('Vehicle deleted successfully')
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete vehicle')
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
                    Delete Vehicle
                </span>
            }
            desc={
                <div className='space-y-4'>
                    <p className='mb-2'>
                        Are you sure you want to delete{' '}
                        <span className='font-bold'>{vehicle?.vehicleNumber}</span>?
                    </p>
                </div>
            }
            confirmText='Delete'
            destructive
        />
    )
}
