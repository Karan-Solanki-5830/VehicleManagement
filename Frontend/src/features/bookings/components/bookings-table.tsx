import { useState } from 'react'
import {
    type SortingState,
    type VisibilityState,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
import { DataTable, DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { bookingStatuses } from '../data/data'
import { bookingsColumns as columns } from './bookings-columns'

type DataTableProps = {
    data: any[]
    rowCount: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: (pagination: any) => void
    search?: string
    onSearch?: (search: string) => void
    status?: string
    onStatusChange?: (status: string) => void
}

export function BookingsTable({ data, rowCount, pagination, onPaginationChange, search, onSearch, status, onStatusChange }: DataTableProps) {
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        isAdmin ? {} : {
            id: false,
            customerId: false,
            price: false,
            actions: false,
            select: false,
        }
    )
    const [sorting, setSorting] = useState<SortingState>([])

    const table = useReactTable({
        data,
        columns,
        rowCount,
        state: {
            sorting,
            pagination,
            rowSelection,
            columnVisibility,
            globalFilter: search,
            columnFilters: status ? [{ id: 'status', value: [status] }] : [],
        },
        manualPagination: true,
        manualFiltering: true,
        enableRowSelection: true,
        onPaginationChange: onPaginationChange,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: onSearch,

        onColumnFiltersChange: (updater) => {
            const current = status ? [{ id: 'status', value: [status] }] : [];
            const next = typeof updater === 'function' ? updater(current) : updater;
            const statusFilter = next.find(f => f.id === 'status');
            onStatusChange?.((statusFilter?.value as string[])?.[0] || '');
        },

        getPaginationRowModel: getPaginationRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    return (
        <div className={cn('flex flex-1 flex-col gap-4')}>
            <DataTableToolbar
                table={table}
                searchPlaceholder='Search bookings...'
                filters={[
                    {
                        columnId: 'status',
                        title: 'Status',
                        options: bookingStatuses.map((status) => ({ ...status })),
                        hideSearch: true,
                    },
                ]}
            />
            <DataTable table={table} columnCount={columns.length} />
            <DataTablePagination table={table} className='mt-auto' />
        </div>
    )
}
