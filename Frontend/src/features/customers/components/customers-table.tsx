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
import { roles } from '../data/data'
import { type Customer } from '@/types'
import { customersColumns as columns } from './customers-columns'

type DataTableProps = {
    data: Customer[]
    rowCount: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: (pagination: any) => void
    search?: string
    onSearch?: (search: string) => void
    role?: string
    onRoleChange?: (role: string) => void
}

export function CustomersTable({ data, rowCount, pagination, onPaginationChange, search, onSearch, role, onRoleChange }: DataTableProps) {
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        isAdmin ? {} : {
            email: false,
            phone: false,
            address: false,
            actions: false,
            select: false,
        }
    )
    const [sorting, setSorting] = useState<SortingState>([])

    // Sync table column filters state with our role prop
    const columnFilters = role ? [{ id: 'role', value: [role] }] : []

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
        manualFiltering: true, // Enable manual filtering since we handle it server-side
        enableRowSelection: true,
        onPaginationChange: onPaginationChange,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnVisibilityChange: setColumnVisibility,
        onGlobalFilterChange: onSearch,

        onColumnFiltersChange: (updater) => {
            const nextFilters = typeof updater === 'function' ? updater(columnFilters) : updater;
            const roleFilter = nextFilters.find(f => f.id === 'role');
            if (onRoleChange) {
                // The filter value from the dropdown is an array
                const value = roleFilter?.value as string[];
                onRoleChange(value && value.length > 0 ? value[0] : '');
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
                searchPlaceholder='Filter customers...'
                filters={[
                    {
                        columnId: 'role',
                        title: 'Role',
                        options: roles.map((role) => ({ ...role })),
                        hideSearch: true,
                    },
                ]}
            />
            <DataTable table={table} columnCount={columns.length} />
            <DataTablePagination table={table} className='mt-auto' />
        </div>
    )
}
