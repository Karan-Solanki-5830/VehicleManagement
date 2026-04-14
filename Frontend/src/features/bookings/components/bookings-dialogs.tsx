import { useBookings } from './bookings-provider'
import { BookingsActionDialog } from './bookings-action-dialog'
import { BookingsDeleteDialog } from './bookings-delete-dialog'

export function BookingsDialogs({ onSuccess }: { onSuccess: () => void }) {
    const { open, setOpen, currentRow, setCurrentRow } = useBookings()

    const handleOpenChange = (state: boolean) => {
        if (!state) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 200)
        }
    }

    return (
        <>
            <BookingsActionDialog
                key={`action-${currentRow?.id || 'new'}`}
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleOpenChange}
                currentRow={currentRow || undefined}
                onSuccess={onSuccess}
            />
            {currentRow && (
                <BookingsDeleteDialog
                    open={open === 'delete'}
                    onOpenChange={handleOpenChange}
                    booking={currentRow}
                    onSuccess={onSuccess}
                />
            )}
        </>
    )
}
