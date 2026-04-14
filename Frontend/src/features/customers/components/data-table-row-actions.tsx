import { type Row } from '@tanstack/react-table'
import { UserPen } from 'lucide-react'
import { ActionDropdown } from '@/components/action-dropdown'
import { type Customer } from '@/types'
import { useCustomers } from './customers-provider'

type DataTableRowActionsProps = {
    row: Row<Customer>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useCustomers()
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
            editIcon={UserPen}
        />
    )
}
