import type {
    PromptToFormOptions,
    PromptToFormResponse,
} from "../types"

export function createPromptParser<TSchema, TData>(
    options: PromptToFormOptions<TSchema>,
) {
    return {
        async parse(
            prompt: string,
        ): Promise<PromptToFormResponse<TData>> {
            console.log("Parsing prompt:", prompt)
            console.log("Using schema:", options.schema)

            return {
                data: null,
                missingFields: [],
                error: null,
            }
        },
    }
}