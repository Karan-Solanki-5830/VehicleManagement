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
import { paymentMethods, paymentStatuses } from '../data/data'
import { paymentsColumns as columns } from './payments-columns'

type DataTableProps = {
    data: any[]
    rowCount: number
    pagination: { pageIndex: number; pageSize: number }
    onPaginationChange: (pagination: any) => void
    search?: string
    onSearch?: (search: string) => void
    method?: string
    onMethodChange?: (method: string) => void
    isPaid?: boolean
    onIsPaidChange?: (isPaid: boolean | undefined) => void
}

export function PaymentsTable({ data, rowCount, pagination, onPaginationChange, search, onSearch, method, onMethodChange, isPaid, onIsPaidChange }: DataTableProps) {
    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [sorting, setSorting] = useState<SortingState>([])

    // Sync state
    const columnFilters = [
        ...(method ? [{ id: 'paymentMethod', value: [method] }] : []),
        ...(isPaid !== undefined ? [{ id: 'isPaid', value: [isPaid.toString()] }] : [])
    ]

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

            const methodF = nextFilters.find(f => f.id === 'paymentMethod');
            onMethodChange?.((methodF?.value as string[])?.[0] || '');

            const paidF = nextFilters.find(f => f.id === 'isPaid');
            const paidVal = (paidF?.value as string[])?.[0];
            onIsPaidChange?.(paidVal !== undefined ? paidVal === 'true' : undefined);
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
                searchPlaceholder='Search payments...'
                filters={[
                    {
                        columnId: 'paymentMethod',
                        title: 'Payment Method',
                        options: paymentMethods.map((method) => ({ ...method })),
                        hideSearch: true,
                    },
                    {
                        columnId: 'isPaid',
                        title: 'Status',
                        options: paymentStatuses.map((status) => ({
                            label: status.label,
                            value: status.value.toString(),
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
