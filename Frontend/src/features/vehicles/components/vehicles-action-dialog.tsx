'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown'
import { FormGridField } from '@/components/form-grid-field'
import { ActionDialogShell } from '@/components/action-dialog-shell'
import { vehicleTypes, vehicleStatuses } from '../data/data'
import { type Vehicle } from '@/types'
import { vehiclesApi } from '@/services/vehicles'

const formSchema = z.object({
    vehicleNumber: z.string().min(1, 'Vehicle number is required.'),
    model: z.string().min(1, 'Model is required.'),
    type: z.string().min(1, 'Type is required.'),
    capacity: z.coerce.number().min(1, 'Capacity must be at least 1.'),
    status: z.enum(['Available', 'Maintenance', 'Disabled']),
})

type VehicleForm = z.infer<typeof formSchema>

type VehiclesActionDialogProps = {
    currentRow?: Vehicle
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function VehiclesActionDialog({
    currentRow,
    open,
    onOpenChange,
    onSuccess,
}: VehiclesActionDialogProps) {
    const isEdit = !!currentRow
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<VehicleForm>({
        resolver: zodResolver(formSchema) as any,
        defaultValues: isEdit && currentRow
            ? {
                vehicleNumber: currentRow.vehicleNumber,
                model: currentRow.model,
                type: currentRow.type,
                capacity: currentRow.capacity,
                status: currentRow.status,
            }
            : {
                vehicleNumber: '',
                model: '',
                type: 'SUV',
                capacity: 4,
                status: 'Available',
            },
    })

    const onSubmit = async (values: VehicleForm) => {
        setIsLoading(true)
        try {
            if (isEdit && currentRow) {
                const vehicleData = { ...values, id: currentRow.id }
                await vehiclesApi.update(currentRow.id, vehicleData)
                toast.success('Vehicle updated successfully')
            } else {
                await vehiclesApi.create(values)
                toast.success('Vehicle created successfully')
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
            title={isEdit ? 'Edit Vehicle' : 'Add New Vehicle'}
            description={isEdit ? 'Update the vehicle here. Click save when you\'re done.' : 'Create new vehicle here. Click save when you\'re done.'}
            formId='vehicle-form'
            isLoading={isLoading}
        >
            <Form {...form}>
                <form
                    id='vehicle-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 px-0.5'
                >
                    <FormField
                        control={form.control}
                        name='vehicleNumber'
                        render={({ field }) => (
                            <FormGridField label='Vehicle Number'>
                                <Input placeholder='ABC-1234' autoComplete='off' {...field} />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='model'
                        render={({ field }) => (
                            <FormGridField label='Model'>
                                <Input placeholder='Toyota Camry' {...field} />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='type'
                        render={({ field }) => (
                            <FormGridField label='Type'>
                                <SelectDropdown
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    placeholder={<span className='text-muted-foreground'>Select Type</span>}
                                    isControlled={true}
                                    items={vehicleTypes.map(({ label, value }) => ({ label, value }))}
                                />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='capacity'
                        render={({ field }) => (
                            <FormGridField label='Capacity'>
                                <Input type='number' min='1' placeholder='4' {...field} />
                            </FormGridField>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='status'
                        render={({ field }) => (
                            <FormGridField label='Status'>
                                <SelectDropdown
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    isControlled={true}
                                    items={vehicleStatuses.map(({ label, value }) => ({ label, value }))}
                                />
                            </FormGridField>
                        )}
                    />
                </form>
            </Form>
        </ActionDialogShell>
    )
}

