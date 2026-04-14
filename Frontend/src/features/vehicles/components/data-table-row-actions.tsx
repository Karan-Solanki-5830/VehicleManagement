import { type Row } from '@tanstack/react-table'
import { Edit } from 'lucide-react'
import { ActionDropdown } from '@/components/action-dropdown'
import { type Vehicle } from '@/types'
import { useVehicles } from '../components/vehicles-provider'

type DataTableRowActionsProps = {
    row: Row<Vehicle>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useVehicles()

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
