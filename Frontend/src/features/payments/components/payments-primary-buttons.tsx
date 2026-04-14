import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePayments } from './payments-provider'

export function PaymentsPrimaryButtons() {
    const { setOpen } = usePayments()

    return (
        <div className='flex gap-2'>
            <Button onClick={() => setOpen('add')}>
                <CreditCard className='mr-2 h-4 w-4' />
                Add Payment
            </Button>
        </div>
    )
}
