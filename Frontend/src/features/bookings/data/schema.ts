import { z } from 'zod'

export const bookingSchema = z.object({
    id: z.number(),
    customerId: z.number(),
    vehicleId: z.number(),
    bookingDate: z.string(),
    returnDate: z.string().nullable(),
    price: z.number(),
    status: z.string(),
})

export type Booking = z.infer<typeof bookingSchema>
