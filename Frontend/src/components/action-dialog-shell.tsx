import { ReactNode } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ActionDialogShellProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    formId: string
    isLoading: boolean
    children: ReactNode
}

export function ActionDialogShell({
    open,
    onOpenChange,
    title,
    description,
    formId,
    isLoading,
    children,
}: ActionDialogShellProps) {
    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className='sm:max-w-lg'>
                <DialogHeader className='text-start'>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <div className='max-h-[65vh] overflow-y-auto py-1 pr-4 -mr-4'>
                    {children}
                </div>
                <DialogFooter>
                    <Button type='submit' form={formId} disabled={isLoading}>
                        Save changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
