import { type ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader, columnAlignments } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { roles } from '../data/data'
import { type Customer } from '@/types'
import { DataTableRowActions } from './data-table-row-actions'

export const customersColumns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'imageUrl',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Avatar' className={columnAlignments.center.header} />
        ),
        cell: ({ row }) => {
            const imageUrl = row.getValue('imageUrl') as string;
            const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(row.original.name)}&background=random`;
            const fullUrl = imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `http://custtapi.runasp.net${imageUrl}`) : defaultImage;

            return (
                <div className='flex items-center justify-center'>
                    <img
                        src={fullUrl}
                        alt={row.original.name}
                        className='h-10 w-10 rounded-full object-cover border shadow-sm'
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = defaultImage;
                        }}
                    />
                </div>
            )
        },
        enableSorting: false,
    },
    {
        accessorKey: 'id',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='User ID' className={columnAlignments.numeric.header} />
        ),
        cell: ({ row }) => <div className={cn(columnAlignments.numeric.cell)}>{row.getValue('id')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Name' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => (
            <LongText className={cn('max-w-36', columnAlignments.text.cell)}>{row.getValue('name')}</LongText>
        ),
        meta: {
            className: cn(
                'drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)]',
                'max-md:sticky start-6 @4xl/content:table-cell @4xl/content:drop-shadow-none'
            ),
        },
        enableHiding: false,
    },

    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Email' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => (
            <div className={cn('text-nowrap', columnAlignments.text.cell)}>{row.getValue('email')}</div>
        ),
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Phone' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => <div className={columnAlignments.text.cell}>{row.getValue('phone')}</div>,
        enableSorting: false,
    },
    {
        accessorKey: 'address',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Address' className={columnAlignments.text.header} />
        ),
        cell: ({ row }) => (
            <LongText className={cn('max-w-48', columnAlignments.text.cell)}>{row.getValue('address')}</LongText>
        ),
        enableSorting: false,
    },
    {
        accessorKey: 'role',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Role' className={columnAlignments.center.header} />
        ),
        cell: ({ row }) => {
            const { role } = row.original
            const userType = roles.find(({ value }) => value === role)

            if (!userType) {
                return null
            }

            return (
                <div className='flex items-center justify-center gap-x-2'>
                    {userType.icon && (
                        <userType.icon size={16} className='text-muted-foreground' />
                    )}
                    <span className='text-sm capitalize'>{row.getValue('role')}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        enableSorting: false,
        enableHiding: false,
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
