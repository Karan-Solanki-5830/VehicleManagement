'use client'

import { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { FormGridField } from '@/components/form-grid-field'
import { ActionDialogShell } from '@/components/action-dialog-shell'
import { bookingStatuses } from '../data/data'
import { type Booking, type Customer, type Vehicle } from '@/types'
import { bookingsApi } from '@/services/bookings'
import { customersApi } from '@/services/customers'
import { vehiclesApi } from '@/services/vehicles'
import { useAuthStore } from '@/stores/auth-store'

const formSchema = z.object({
    customerId: z.coerce.number().min(1, 'Customer ID is required.'),
    vehicleId: z.coerce.number().min(1, 'Vehicle ID is required.'),
    bookingDate: z.string().min(1, 'Booking date is required.'),
    returnDate: z.string().nullable(),
    price: z.coerce.number().min(0, 'Price must be at least 0.'),
    status: z.string().min(1, 'Status is required.'),
})

type BookingForm = z.infer<typeof formSchema>

type BookingsActionDialogProps = {
    currentRow?: Booking
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function BookingsActionDialog({
    currentRow,
    open,
    onOpenChange,
    onSuccess,
}: BookingsActionDialogProps) {
    const isEdit = !!currentRow
    const [isLoading, setIsLoading] = useState(false)
    const [customers, setCustomers] = useState<Customer[]>([])
    const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([])
    const [isCustomersLoading, setIsCustomersLoading] = useState(false)
    const [isVehiclesLoading, setIsVehiclesLoading] = useState(false)
    const [customersError, setCustomersError] = useState<string | null>(null)
    const [vehiclesError, setVehiclesError] = useState<string | null>(null)
    const { auth } = useAuthStore()
    const isAdmin = auth.user?.role.includes('Admin')
    const currentUserId = auth.user?.accountNo ? parseInt(auth.user.accountNo) : 0
    const currentUserName = auth.user?.name || ''

    const form = useForm<BookingForm>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: isEdit
            ? {
                ...currentRow,
                returnDate: currentRow.returnDate || '',
            }
            : {
                customerId: isAdmin ? 0 : currentUserId,
                vehicleId: 0,
                bookingDate: new Date().toISOString().split('T')[0],
                returnDate: '',
                price: 0,
                status: 'Pending',
            },
    })

    useEffect(() => {
        if (open) {
            fetchFormData()
        }
    }, [open])

    const fetchFormData = async () => {
        setIsCustomersLoading(true)
        setIsVehiclesLoading(true)
        setCustomersError(null)
        setVehiclesError(null)

        try {
            const customersData = await customersApi.getLookup()
            setCustomers(customersData as any)
        } catch (error) {
            setCustomersError('Failed to load customers')
        } finally {
            setIsCustomersLoading(false)
        }

        try {
            const vehiclesData = await vehiclesApi.getAvailable()
            setAvailableVehicles(vehiclesData as any)
        } catch (error) {
            setVehiclesError('Failed to load available vehicles')
        } finally {
            setIsVehiclesLoading(false)
        }
    }

    const onSubmit = async (values: BookingForm) => {
        setIsLoading(true)
        try {
            const payload = {
                ...values,
                returnDate: values.returnDate || null,
            }

            if (isEdit && currentRow) {
                const updatePayload = { ...payload, id: currentRow.id }
                await bookingsApi.update(currentRow.id, updatePayload as any)
                toast.success('Booking updated successfully')
            } else {
                await bookingsApi.create(payload as any)
                toast.success('Booking created successfully')
            }

            form.reset()
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(', ')
                    : error.response?.data?.message || 'Operation failed. Please check your data and try again.'

            toast.error(errorMessage)
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
            title={isEdit ? 'Edit Booking' : 'Add New Booking'}
            description={isEdit ? 'Update the booking here. Click save when you\'re done.' : 'Create new booking here. Click save when you\'re done.'}
            formId='booking-form'
            isLoading={isLoading}
        >
            <Form {...form}>
                <form
                    id='booking-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 px-0.5'
                >
                    <FormField
                        control={form.control}
                        name='customerId'
                        render={({ field }) => (
                            <FormGridField label='Customer'>
                                {isAdmin ? (
                                    <div className='space-y-1'>
                                        <SelectDropdown
                                            defaultValue={field.value !== 0 ? field.value.toString() : undefined}
                                            onValueChange={field.onChange}
                                            placeholder={<span className='text-muted-foreground'>Select Available Customer</span>}
                                            className='w-full'
                                            isControlled={true}
                                            isPending={isCustomersLoading}
                                            items={customers.map((c) => ({
                                                label: `${c.id} - ${c.name}`,
                                                value: c.id.toString(),
                                            }))}
                                        />
                                        {customersError && (
                                            <p className='text-[0.8rem] font-medium text-destructive mt-1'>{customersError}</p>
                                        )}
                                    </div>
                                ) : (
                                    <Input value={currentUserName} disabled className="w-full" />
                                )}
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='vehicleId'
                        render={({ field }) => (
                            <FormGridField label='Vehicle'>
                                <div className='space-y-1'>
                                    <SelectDropdown
                                        defaultValue={field.value !== 0 ? field.value.toString() : undefined}
                                        onValueChange={field.onChange}
                                        placeholder={<span className='text-muted-foreground'>Select Available Vehicle</span>}
                                        className='w-full'
                                        isControlled={true}
                                        isPending={isVehiclesLoading}
                                        items={availableVehicles.map((v) => ({
                                            label: `${v.id} - ${v.vehicleNumber}`,
                                            value: v.id.toString(),
                                        }))}
                                    />
                                    {vehiclesError && (
                                        <p className='text-[0.8rem] font-medium text-destructive mt-1'>{vehiclesError}</p>
                                    )}
                                </div>
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='bookingDate'
                        render={({ field }) => (
                            <FormGridField label='Booking Date'>
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
                        name='returnDate'
                        render={({ field }) => (
                            <FormGridField label='Return Date'>
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
                        name='price'
                        render={({ field }) => (
                            <FormGridField label='Price'>
                                <Input type='number' min='0' step='0.01' placeholder='100.00' {...field} />
                            </FormGridField>
                        )}
                    />
                    {isEdit && (
                        <FormField
                            control={form.control}
                            name='status'
                            render={({ field }) => (
                                <FormGridField label='Status'>
                                    <SelectDropdown
                                        defaultValue={field.value}
                                        onValueChange={field.onChange}
                                        placeholder={<span className='text-muted-foreground'>Select Status</span>}
                                        isControlled={true}
                                        items={bookingStatuses.map(({ label, value }) => ({ label, value }))}
                                    />
                                </FormGridField>
                            )}
                        />
                    )}
                </form>
            </Form>
        </ActionDialogShell>
    )
}

