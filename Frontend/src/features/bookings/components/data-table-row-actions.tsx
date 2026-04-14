import { type Row } from '@tanstack/react-table'
import { Edit } from 'lucide-react'
import { ActionDropdown } from '@/components/action-dropdown'
import { type Booking } from '@/types'
import { useBookings } from './bookings-provider'

type DataTableRowActionsProps = {
    row: Row<Booking>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useBookings()

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
