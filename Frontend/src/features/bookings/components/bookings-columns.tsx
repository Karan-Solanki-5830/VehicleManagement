import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'

import { DataTableColumnHeader, columnAlignments } from '@/components/data-table'
import { cn } from '@/lib/utils'
import { DataTableRowActions } from './data-table-row-actions'

export const bookingsColumns: ColumnDef<any>[] = [

    {
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Booking ID' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => <div className={cn('font-medium', columnAlignments.numeric.cell)}>{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'customerId',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Customer' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => {
            const customerId = row.getValue('customerId') as number
            const customerName = row.original.customerName as string
            return (
                <div className={cn('flex flex-col', columnAlignments.text.cell)}>
                    <span className='font-medium'>{customerName}</span>
                    <span className='text-xs text-muted-foreground'>ID: {customerId}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'vehicleId',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Vehicle' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => {
            const vehicleId = row.getValue('vehicleId') as number
            const vehicleNumber = row.original.vehicleNumber as string
            return (
                <div className={cn('flex flex-col', columnAlignments.text.cell)}>
                    <span className='font-medium'>{vehicleNumber}</span>
                    <span className='text-xs text-muted-foreground'>ID: {vehicleId}</span>
                </div>
            )
        },
    },
    {
        accessorKey: 'bookingDate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Booking Date' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => {
            const date = row.getValue('bookingDate') as string
            return <div className={columnAlignments.text.cell}>{date ? date.substring(0, 10) : ''}</div>
        },
    },
    {
        accessorKey: 'returnDate',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Return Date' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => {
            const returnDate = row.getValue('returnDate') as string | null
            return <div className={columnAlignments.text.cell}>{returnDate ? returnDate.substring(0, 10) : 'Ongoing'}</div>
        },
    },
    {
        accessorKey: 'price',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Price' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => (
            <div className={cn('font-semibold', columnAlignments.numeric.cell)}>${row.getValue('price')}</div>
        ),
    },
    {
        accessorKey: 'status',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Status' className={columnAlignments.center.header} />
        ),
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const variant =
                status === 'Confirmed' ? 'default' :
                    status === 'Failed' ? 'destructive' : 'outline'

            return (
                <div className={columnAlignments.center.cell}>
                    <Badge variant={variant}>{status}</Badge>
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
