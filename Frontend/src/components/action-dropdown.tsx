import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { LucideIcon, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface ActionDropdownProps {
    onEdit: () => void
    onDelete: () => void
    editIcon?: LucideIcon
    editLabel?: string
    deleteLabel?: string
    dropdownWidth?: string
}

export function ActionDropdown({
    onEdit,
    onDelete,
    editIcon: EditIcon,
    editLabel = 'Edit',
    deleteLabel = 'Delete',
    dropdownWidth = 'w-[160px]',
}: ActionDropdownProps) {
    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <DotsHorizontalIcon className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className={cn(dropdownWidth)}>
                <DropdownMenuItem onClick={onEdit}>
                    {EditIcon && <EditIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />}
                    {editLabel}
                    {!EditIcon && (
                        <DropdownMenuShortcut>
                            {/* For components that don't pass an icon to the left, we can use a shortcut style */}
                        </DropdownMenuShortcut>
                    )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={onDelete}
                    className='text-red-500!'
                >
                    <Trash2 className={cn('mr-2 h-3.5 w-3.5', !EditIcon ? '' : 'text-red-500!')} />
                    {deleteLabel}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
