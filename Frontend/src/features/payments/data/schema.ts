import { z } from 'zod'

export const paymentSchema = z.object({
    id: z.number(),
    bookingId: z.number(),
    amount: z.number(),
    paymentMethod: z.string(),
    isPaid: z.boolean(),
    paymentDate: z.string(),
})

export type Payment = z.infer<typeof paymentSchema>
