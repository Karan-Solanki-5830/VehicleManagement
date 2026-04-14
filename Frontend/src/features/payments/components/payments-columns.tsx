import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader, columnAlignments } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const paymentsColumns: ColumnDef<any>[] = [
    {
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Payment ID' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => <div className={cn('font-medium', columnAlignments.numeric.cell)}>{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'bookingId',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Booking ID' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => <div className={cn('font-medium', columnAlignments.numeric.cell)}>{row.getValue('bookingId')}</div>,
    },
    {
        accessorKey: 'bookingLabel',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Booking' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => {
            const bookingLabel = row.getValue('bookingLabel') as string
            const vehicleLabel = row.original.vehicleLabel as string

            return (
                <div className={cn('flex flex-col', columnAlignments.text.cell)}>
                    <span className='font-medium'>{bookingLabel || 'Unknown'}</span>
                    {vehicleLabel && (
                        <span className='text-xs text-muted-foreground'>{vehicleLabel}</span>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: 'amount',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Amount' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => (
            <div className={cn('font-semibold', columnAlignments.numeric.cell)}>${row.getValue('amount')}</div>
        ),
    },
    {
        accessorKey: 'paymentMethod',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Payment Method' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => <div className={columnAlignments.text.cell}>{row.getValue('paymentMethod')}</div>,
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        accessorKey: 'paymentDate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Payment Date' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => (
            <div className={columnAlignments.text.cell}>{new Date(row.getValue('paymentDate')).toLocaleDateString()}</div>
        ),
    },
    {
        accessorKey: 'isPaid',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' className={columnAlignments.center.header} />
        ),
        cell: ({ row }) => {
            const isPaid = row.getValue('isPaid') as boolean
            return (
                <div className={columnAlignments.center.cell}>
                    <Badge
                        variant={isPaid ? 'default' : 'destructive'}
                        className={cn(
                            isPaid && 'bg-green-500 hover:bg-green-600'
                        )}
                    >
                        {isPaid ? 'Paid' : 'Unpaid'}
                    </Badge>
                </div>
            )
        },
        filterFn: (row, id, value: string[]) => {
            return value.includes(String(row.getValue(id)))
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
