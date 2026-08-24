import { describe, expect, it } from "vitest"
import { createPromptParser } from "./createPromptParser"
import { createMockProvider } from "../providers/createMockProvider"

type Appointment = {
    customerName: string
    serviceType: string
    appointmentDate: string
}

const provider = createMockProvider<Appointment>({
    customerName: "Sarah",
    serviceType: "Site visit",
})

const schema = {
    safeParse(data: unknown) {
        return {
            success: true as const,
            data: data as Partial<Appointment>,
        }
    },
}

describe("createPromptParser", () => {
    it("returns missing required fields", async () => {
        const parser = createPromptParser<Appointment>({
            schema,
            provider,
            requiredFields: [
                "customerName",
                "serviceType",
                "appointmentDate",
            ],
        })
        const result = await parser.parse(
            "Book a site visit for Sarah",
        )
        expect(result.missingFields).toEqual([
            "appointmentDate",
        ])
        expect(result.data).toEqual({
            customerName: "Sarah",
            serviceType: "Site visit",
        })
    });

    it("returns valid data when all required fields are present", async () => {
        const completeProvider = createMockProvider<Appointment>({
            customerName: "Sarah",
            serviceType: "Site visit",
            appointmentDate: "2026-08-25",
        })

        const parser = createPromptParser<Appointment>({
            schema,
            provider: completeProvider,
            requiredFields: [
                "customerName",
                "serviceType",
                "appointmentDate",
            ],
        })

        const result = await parser.parse(
            "Book a site visit for Sarah",
        )

        expect(result.missingFields).toEqual([])
        expect(result.error).toBeNull()
        expect(result.data).toEqual({
            customerName: "Sarah",
            serviceType: "Site visit",
            appointmentDate: "2026-08-25",
        })
    });

    it("returns an error when provider data fails schema validation", async () => {
        const invalidSchema = {
            safeParse() {
                return {
                    success: false as const,
                    error: new Error("Invalid data"),
                }
            },
        }

        const completeProvider = createMockProvider<Appointment>({
            customerName: "Sarah",
            serviceType: "Site visit",
            appointmentDate: "2026-08-25",
        })

        const parser = createPromptParser<Appointment>({
            schema: invalidSchema,
            provider: completeProvider,
            requiredFields: [
                "customerName",
                "serviceType",
                "appointmentDate",
            ],
        })

        const result = await parser.parse(
            "Book a site visit for Sarah",
        )

        expect(result.data).toBeNull()
        expect(result.missingFields).toEqual([])
        expect(result.error).toBe(
            "The provider returned invalid form data",
        )
    })
})