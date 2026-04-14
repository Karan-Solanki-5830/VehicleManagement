'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Form, FormField } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/password-input'
import { SelectDropdown } from '@/components/select-dropdown'
import { FormGridField } from '@/components/form-grid-field'
import { ImageUploadField } from '@/components/image-upload-field'
import { ActionDialogShell } from '@/components/action-dialog-shell'
import { roles } from '../data/data'
import { type Customer } from '@/types'
import { customersApi } from '@/services/customers'

const formSchema = z
    .object({
        name: z.string().min(1, 'Name is required.'),
        email: z.email({
            error: (iss) => (iss.input === '' ? 'Email is required.' : undefined),
        }),
        phone: z.string().min(1, 'Phone is required.'),
        address: z.string().min(1, 'Address is required.'),
        password: z.string().transform((pwd) => pwd.trim()),
        role: z.string().min(1, 'Role is required.'),
        image: z.instanceof(File).optional(),
        isEdit: z.boolean(),
    })
    .refine(
        (data) => {
            if (data.isEdit && !data.password) return true
            return data.password.length > 0
        },
        {
            message: 'Password is required.',
            path: ['password'],
        }
    )
    .refine(
        ({ isEdit, password }) => {
            if (isEdit && !password) return true
            return password.length >= 7
        },
        {
            message: 'Password must be at least 7 characters long.',
            path: ['password'],
        }
    )

type CustomerForm = z.infer<typeof formSchema>

type CustomersActionDialogProps = {
    currentRow?: Customer
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

export function CustomersActionDialog({
    currentRow,
    open,
    onOpenChange,
    onSuccess,
}: CustomersActionDialogProps) {
    const isEdit = !!currentRow
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<CustomerForm>({
        resolver: zodResolver(formSchema),
        defaultValues: isEdit
            ? {
                ...currentRow,
                password: currentRow?.password || '',
                isEdit,
            }
            : {
                name: '',
                email: '',
                phone: '',
                address: '',
                role: 'User',
                password: '',
                isEdit,
            },
    })

    const onSubmit = async (values: CustomerForm) => {
        setIsLoading(true)
        try {
            const customerData: any = {
                name: values.name,
                email: values.email,
                phone: values.phone,
                address: values.address,
                role: values.role,
            }

            if (values.password) {
                customerData.password = values.password
            }

            let customerId: number
            if (isEdit && currentRow) {
                customerData.id = currentRow.id
                await customersApi.update(currentRow.id, customerData)
                customerId = currentRow.id
                toast.success('Customer updated successfully')
            } else {
                const response = await customersApi.create(customerData)
                customerId = response.id
                toast.success('Customer created successfully')
            }

            const imageFile = form.getValues('image')
            if (imageFile) {
                await customersApi.uploadImage(customerId, imageFile)
            }

            form.reset()
            onOpenChange(false)
            onSuccess()
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join(', ')
                    : error.response?.data?.message || error.response?.data?.title || 'Operation failed'

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
            title={isEdit ? 'Edit Customer' : 'Add New Customer'}
            description={isEdit ? 'Update the customer here. Click save when you\'re done.' : 'Create new customer here. Click save when you\'re done.'}
            formId='customer-form'
            isLoading={isLoading}
        >
            <Form {...form}>
                <form
                    id='customer-form'
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4 px-0.5'
                >
                    <FormField
                        control={form.control}
                        name='image'
                        render={({ field }) => (
                            <ImageUploadField
                                value={field.value}
                                onChange={field.onChange}
                                previewUrl={currentRow?.imageUrl}
                            />
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormGridField label='Name'>
                                <Input placeholder='John Doe' autoComplete='off' {...field} />
                            </FormGridField>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormGridField label='Email'>
                                <Input placeholder='john@example.com' {...field} />
                            </FormGridField>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='phone'
                        render={({ field }) => (
                            <FormGridField label='Phone'>
                                <Input placeholder='+1234567890' {...field} />
                            </FormGridField>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='address'
                        render={({ field }) => (
                            <FormGridField label='Address'>
                                <Input placeholder='123 Main St' {...field} />
                            </FormGridField>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                            <FormGridField label='Role'>
                                <SelectDropdown
                                    defaultValue={field.value}
                                    onValueChange={field.onChange}
                                    placeholder={<span className='text-muted-foreground'>Select Role</span>}
                                    isControlled={true}
                                    items={roles.map(({ label, value }) => ({ label, value }))}
                                />
                            </FormGridField>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormGridField label='Password' optional={isEdit}>
                                <PasswordInput placeholder='********' {...field} />
                            </FormGridField>
                        )}
                    />
                </form>
            </Form>
        </ActionDialogShell>
    )
}

