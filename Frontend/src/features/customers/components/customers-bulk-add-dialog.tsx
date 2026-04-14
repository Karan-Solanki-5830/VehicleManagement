import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, Loader2 } from 'lucide-react'
import { customersApi } from '@/services/customers'

interface Props {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function CustomersBulkAddDialog({ open, onOpenChange, onSuccess }: Props) {
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleBulkAdd = async () => {
        if (!file) {
            toast.error('Please select an Excel file')
            return
        }

        setIsLoading(true)
        try {
            await customersApi.bulkCreate(file)
            toast.success('Successfully added customers from Excel')
            setFile(null)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            console.error('Bulk add error:', error)
            toast.error(error.response?.data?.message || 'Failed to upload Excel file')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle>Bulk Add Customers</DialogTitle>
                    <DialogDescription>
                        Upload an Excel file (.xlsx) containing customer data.
                        <br />
                        <span className='font-medium text-xs text-muted-foreground mt-2 block'>
                            Columns: Name | Email | Phone | Address | Password (opt) | Role (opt)
                        </span>
                    </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                    <div className='grid w-full max-w-sm items-center gap-1.5'>
                        <Label htmlFor='file'>Excel File</Label>
                        <Input
                            id='file'
                            type='file'
                            accept='.xlsx, .xls'
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            className='cursor-pointer'
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleBulkAdd} disabled={isLoading || !file}>
                        {isLoading ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload className='mr-2 h-4 w-4' />
                                Upload & Import
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
