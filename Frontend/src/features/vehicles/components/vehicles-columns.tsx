import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

import { DataTableColumnHeader, columnAlignments } from '@/components/data-table'
import { type Vehicle } from '@/types'
import { DataTableRowActions } from './data-table-row-actions'

export const vehiclesColumns: ColumnDef<Vehicle>[] = [

    {
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Vehicle ID' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => <div className={cn(columnAlignments.numeric.cell)}>{row.getValue('id')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'vehicleNumber',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Vehicle Number' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => (
            <div className={cn('font-medium', columnAlignments.text.cell)}>{row.getValue('vehicleNumber')}</div>
        ),
    },
    {
        accessorKey: 'model',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Model' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => <div className={columnAlignments.text.cell}>{row.getValue('model')}</div>,
    },
    {
        accessorKey: 'type',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Type' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => <div className={columnAlignments.text.cell}>{row.getValue('type')}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'capacity',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Capacity' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => (
            <div className={columnAlignments.numeric.cell}>{row.getValue('capacity')} passengers</div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' className={columnAlignments.center.header} />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return (
                <div className={columnAlignments.center.cell}>
                    <Badge
                        variant={status === 'Available' ? 'default' : status === 'Maintenance' ? 'destructive' : 'secondary'}
                        className={cn(
                            status === 'Available' && 'bg-green-500 hover:bg-green-600'
                        )}
                    >
                        {status}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Actions' className={columnAlignments.actions.header} />
        ),
        cell: ({ row }) => (
            <div className={columnAlignments.actions.cell}>
                <DataTableRowActions row={row} />
            </div>
        ),
    },
]
