import { z } from 'zod'

export const customerSchema = z.object({
    id: z.number(),
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
    password: z.string().optional(),
    role: z.enum(['User', 'Admin']),
})

export type Customer = z.infer<typeof customerSchema>

export const customerFormSchema = customerSchema
    .omit({ id: true })
    .extend({
        id: z.number().optional(),
    })

export type CustomerFormValues = z.infer<typeof customerFormSchema>
