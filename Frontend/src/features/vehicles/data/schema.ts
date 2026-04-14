import { z } from 'zod'

export const vehicleSchema = z.object({
    id: z.number(),
    vehicleNumber: z.string(),
    model: z.string(),
    type: z.string(),
    capacity: z.number(),
    isAvailable: z.boolean(),
})

export type Vehicle = z.infer<typeof vehicleSchema>
