import { UserPlus, FileJson } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCustomers } from './customers-provider'

import { useAuthStore } from '@/stores/auth-store'

export function CustomersPrimaryButtons() {
    const { setOpen } = useCustomers()
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')

    if (!isAdmin) return null

    return (
        <div className='flex gap-2'>
            <Button variant='outline' className='w-40' onClick={() => setOpen('bulk-add')}>
                <FileJson className='mr-2' size={16} />
                Bulk Add
            </Button>
            <Button className='w-40' onClick={() => setOpen('add')}>
                <UserPlus className='mr-2' size={16} />
                Add Customer
            </Button>
        </div>
    )
}
