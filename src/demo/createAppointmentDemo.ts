import {
    createMockProvider,
    createPromptParser,
} from "../core"
import {
    appointmentSchema,
    type Appointment,
} from "./appointmentSchema"

const provider = createMockProvider<Appointment>({
    customerName: "Sarah Collins",
    serviceType: "Site visit",
})


export const appointmentParser = createPromptParser<Appointment>({
    schema: appointmentSchema,
    provider,
    requiredFields: [
        "customerName",
        "serviceType",
        "appointmentDate",
    ],
})