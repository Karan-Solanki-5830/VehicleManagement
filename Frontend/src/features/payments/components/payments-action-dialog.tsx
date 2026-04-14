'use client'

import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { SelectDropdown } from '@/components/select-dropdown'
import { FormGridField } from '@/components/form-grid-field'
import { ActionDialogShell } from '@/components/action-dialog-shell'
import { paymentMethods } from '../data/data'
import { type Payment } from '@/types'
import { paymentsApi } from '@/services/payments'

const formSchema = z.object({
    bookingId: z.coerce.number().min(1, 'Booking ID is required.'),
    amount: z.coerce.number().min(0, 'Amount must be at least 0.'),
    paymentMethod: z.string().min(1, 'Payment method is required.'),
    isPaid: z.boolean(),
    paymentDate: z.string().min(1, 'Payment date is required.'),
})

type PaymentForm = z.infer<typeof formSchema>

type PaymentsActionDialogProps = {
    currentRow?: Payment
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function PaymentsActionDialog({
    currentRow,
    open,
    onOpenChange,
    onSuccess,
}: PaymentsActionDialogProps) {
    const isEdit = !!currentRow
    const [isLoading, setIsLoading] = useState(false)
    const [bookingLookups, setBookingLookups] = useState<any[]>([])
    const [isLookupsLoading, setIsLookupsLoading] = useState(false)

    useEffect(() => {
        if (open) {
            const fetchLookups = async () => {
                try {
                    setIsLookupsLoading(true)
                    const data = await paymentsApi.getBookingLookup()
                    setBookingLookups(data)
                } catch (error) {
                    console.error('Failed to fetch booking lookups:', error)
                    toast.error('Failed to load booking information')
                } finally {
                    setIsLookupsLoading(false)
                }
            }
            fetchLookups()
        }
    }, [open])

    const form = useForm<PaymentForm>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: isEdit && currentRow
            ? {
                bookingId: currentRow.bookingId,
                amount: currentRow.amount,
                paymentMethod: currentRow.paymentMethod || 'Cash',
                isPaid: currentRow.isPaid,
                paymentDate: currentRow.paymentDate || new Date().toISOString().split('T')[0],
            }
            : {
                bookingId: 0,
                amount: 0,
                paymentMethod: 'Cash',
                isPaid: false,
                paymentDate: new Date().toISOString().split('T')[0],
            },
    })

    const onSubmit = async (values: PaymentForm) => {
        setIsLoading(true)
        try {
            if (isEdit && currentRow) {
                const paymentData = { ...values, id: currentRow.id }
                await paymentsApi.update(currentRow.id, paymentData)
                toast.success('Payment updated successfully')
            } else {
                await paymentsApi.create(values)
                toast.success('Payment created successfully')
            }

            form.reset()
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Operation failed')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <ActionDialogShell
            open={open}
            onOpenChange={(state) => {
                form.reset()
                onOpenChange(state)
            }}
            title={isEdit ? 'Edit Payment' : 'Add New Payment'}
            description={isEdit ? 'Update the payment here. Click save when you\'re done.' : 'Create new payment here. Click save when you\'re done.'}
            formId='payment-form'
            isLoading={isLoading}
        >
            <Form {...form}>
                <form
                    id='payment-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 px-0.5'
                >
                    <FormField
                        control={form.control}
                        name='bookingId'
                        render={({ field }) => (
                            <FormGridField label='Booking'>
                                <SelectDropdown
                                    defaultValue={field.value !== 0 ? field.value?.toString() : undefined}
                                    onValueChange={field.onChange}
                                    placeholder={<span className='text-muted-foreground'>Select Booking</span>}
                                    className='w-full'
                                    isControlled={true}
                                    isPending={isLookupsLoading}
                                    items={bookingLookups.map((b) => ({
                                        label: `${b.bookingId} - ${b.customerName} (${b.vehicleNumber})`,
                                        value: b.bookingId.toString(),
                                    }))}
                                />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='amount'
                        render={({ field }) => (
                            <FormGridField label='Amount'>
                                <Input type='number' min='0' step='0.01' placeholder='100.00' {...field} />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='paymentMethod'
                        render={({ field }) => (
                            <FormGridField label='Method'>
                                <SelectDropdown
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    placeholder={<span className='text-muted-foreground'>Select Method</span>}
                                    isControlled={true}
                                    items={paymentMethods.map(({ label, value }) => ({ label, value }))}
                                />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='paymentDate'
                        render={({ field }) => (
                            <FormGridField label='Date'>
                                <Input
                                    type='date'
                                    {...field}
                                    value={field.value ? field.value.toString().substring(0, 10) : ''}
                                />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='isPaid'
                        render={({ field }) => (
                            <FormGridField label='Is Paid'>
                                <div className='flex items-center h-9'>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </div>
                            </FormGridField>
                        )}
                    />
                </form>
            </Form>
        </ActionDialogShell>
    )
}

