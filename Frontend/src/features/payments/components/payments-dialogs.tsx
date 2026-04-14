import { usePayments } from './payments-provider'
import { PaymentsActionDialog } from './payments-action-dialog'
import { PaymentsDeleteDialog } from './payments-delete-dialog'

export function PaymentsDialogs({ onSuccess }: { onSuccess: () => void }) {
    const { open, setOpen, currentRow, setCurrentRow } = usePayments()

    const handleOpenChange = (state: boolean) => {
        if (!state) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 200)
        }
    }

    return (
        <>
            <PaymentsActionDialog
                key={`action-${currentRow?.id || 'new'}`}
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleOpenChange}
                currentRow={currentRow || undefined}
                onSuccess={onSuccess}
            />
            {currentRow && (
                <PaymentsDeleteDialog
                    open={open === 'delete'}
                    onOpenChange={handleOpenChange}
                    payment={currentRow}
                    onSuccess={onSuccess}
                />
            )}
        </>
    )
}
