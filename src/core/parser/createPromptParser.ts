import type {
    PromptToFormOptions,
    PromptToFormResponse,
} from "../types"
export function createPromptParser<TData>(
    options: PromptToFormOptions<TData>,
) {
    return {
        async parse(
            prompt: string,
        ): Promise<PromptToFormResponse<TData>> {
            const providerData = await options.provider.parse(prompt)
            const missingFields = options.requiredFields.filter(
                (field) => providerData[field] === undefined,
            )
            if (missingFields.length > 0) {
                return {
                    data: providerData,
                    missingFields,
                    error: null,
                }
            }
            const validationResult = options.schema.safeParse(providerData)

            if (!validationResult.success) {
                return {
                    data: null,
                    missingFields: [],
                    error: "The provider returned invalid form data",
                }
            }

            return {
                data: validationResult.data,
                missingFields: [],
                error: null,
            }
        },
    }
}