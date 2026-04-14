import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { flexRender, type Table as TableType } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
    table: TableType<TData>
    columnCount: number
    showNoResults?: boolean
}

export function DataTable<TData>({
    table,
    columnCount,
    showNoResults = true,
}: DataTableProps<TData>) {
    return (
        <div className='overflow-hidden rounded-md border'>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id} className='group/row'>
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className={cn(
                                        'bg-background group-hover/row:bg-muted',
                                        (header.column.columnDef as any).meta?.className
                                    )}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                key={row.id}
                                data-state={row.getIsSelected() && 'selected'}
                                className='group/row'
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell
                                        key={cell.id}
                                        className={cn(
                                            'bg-background group-hover/row:bg-muted',
                                            (cell.column.columnDef as any).meta?.className
                                        )}
                                    >
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        showNoResults && (
                            <TableRow>
                                <TableCell
                                    colSpan={columnCount}
                                    className='h-24 text-center'
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
