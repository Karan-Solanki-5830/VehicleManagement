import { useCustomers } from './customers-provider'
import { CustomersActionDialog } from './customers-action-dialog'
import { CustomersDeleteDialog } from './customers-delete-dialog'
import { CustomersBulkAddDialog } from './customers-bulk-add-dialog'

export function CustomersDialogs({ onSuccess }: { onSuccess: () => void }) {
    const { open, setOpen, currentRow, setCurrentRow } = useCustomers()

    const handleOpenChange = (state: boolean) => {
        if (!state) {
            setOpen(null)
            setTimeout(() => setCurrentRow(null), 200) // Clear after exit animation
        }
    }

    return (
        <>
            <CustomersActionDialog
                key={`action-${currentRow?.id || 'new'}`}
                open={open === 'add' || open === 'edit'}
                onOpenChange={handleOpenChange}
                currentRow={currentRow || undefined}
                onSuccess={onSuccess}
            />
            <CustomersBulkAddDialog
                open={open === 'bulk-add'}
                onOpenChange={handleOpenChange}
                onSuccess={onSuccess}
            />
            {currentRow && (
                <CustomersDeleteDialog
                    open={open === 'delete'}
                    onOpenChange={handleOpenChange}
                    currentRow={currentRow}
                    onSuccess={onSuccess}
                />
            )}
        </>
    )
}
