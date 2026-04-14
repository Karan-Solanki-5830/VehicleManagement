import { BookingsActionDialog } from '@/features/bookings/components/bookings-action-dialog'
import { useVehicles } from './vehicles-provider'
import { VehiclesActionDialog } from './vehicles-action-dialog'
import { VehiclesDeleteDialog } from './vehicles-delete-dialog'

export function VehiclesDialogs({ onSuccess }: { onSuccess: () => void }) {
    const { open, setOpen, currentRow, setCurrentRow, bookingOpen, setBookingOpen } = useVehicles()

    const handleOpenChange = (state: boolean) => {
        if (!state) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 200)
        }
    }

    return (
        <>
            <VehiclesActionDialog
                key={`action-${currentRow?.id || 'new'}`}
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleOpenChange}
                currentRow={currentRow || undefined}
                onSuccess={onSuccess}
            />
            {currentRow && (
                <VehiclesDeleteDialog
                    open={open === 'delete'}
                    onOpenChange={handleOpenChange}
                    vehicle={currentRow}
                    onSuccess={onSuccess}
                />
            )}
            <BookingsActionDialog
                open={bookingOpen}
                onOpenChange={setBookingOpen}
                onSuccess={() => { }}
            />
        </>
    )
}
