import { z } from "zod"

export const appointmentSchema = z.object({
    customerName: z.string(),
    serviceType: z.string(),
    appointmentDate: z.string()
})

export type Appointment = z.infer<typeof appointmentSchema>