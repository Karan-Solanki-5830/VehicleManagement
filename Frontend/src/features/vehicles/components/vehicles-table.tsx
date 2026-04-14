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
import { cn } from '@/lib/utils'
import { DataTable, DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { vehicleStatuses } from '../data/data'
import { type Vehicle } from '@/types'
import { vehiclesColumns as columns } from './vehicles-columns'
import { useAuthStore } from '@/stores/auth-store'

type DataTableProps = {
    data: Vehicle[]
    rowCount: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: (pagination: any) => void
    search?: string
    onSearch?: (search: string) => void
    status?: string
    onStatusChange?: (status: string | undefined) => void
}

export function VehiclesTable({ data, rowCount, pagination, onPaginationChange, search, onSearch, status, onStatusChange }: DataTableProps) {
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        !isAdmin ? {
            id: false,
            vehicleNumber: false,
            actions: false,
            select: false,
        } : {}
    )
    const [sorting, setSorting] = useState<SortingState>([])

    // Sync state with prop
    const columnFilters = status ? [{ id: 'status', value: [status] }] : []

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
            columnFilters,
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
            const nextFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
            const statusFilter = nextFilters.find(f => f.id === 'status');
            if (onStatusChange) {
                const values = statusFilter?.value as string[];
                if (values && values.length > 0) {
                    onStatusChange(values[0]);
                } else {
                    onStatusChange(undefined);
                }
            }
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
                searchPlaceholder='Filter vehicles...'
                filters={[
                    {
                        columnId: 'status',
                        title: 'Status',
                        options: vehicleStatuses.map((status) => ({
                            label: status.label,
                            value: status.value,
                            icon: status.icon,
                        })),
                        hideSearch: true,
                    },
                ]}
            />
            <DataTable table={table} columnCount={columns.length} />
            <DataTablePagination table={table} className='mt-auto' />
        </div>
    )
}
