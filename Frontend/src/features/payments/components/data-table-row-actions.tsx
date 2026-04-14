import { type Row } from '@tanstack/react-table'
import { Edit } from 'lucide-react'
import { ActionDropdown } from '@/components/action-dropdown'
import { type Payment } from '@/types'
import { usePayments } from './payments-provider'

type DataTableRowActionsProps = {
    row: Row<Payment>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = usePayments()

    return (
        <ActionDropdown
            onEdit={() => {
                setCurrentRow(row.original)
                setOpen('edit')
            }}
            onDelete={() => {
                setCurrentRow(row.original)
                setOpen('delete')
            }}
            editIcon={Edit}
        />
    )
}
