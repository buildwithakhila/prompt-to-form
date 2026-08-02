import type {
    PromptToFormOptions,
    PromptToFormResponse,
} from "../types"

export function createPromptParser<TSchema, TData>(
    options: PromptToFormOptions<TSchema, TData>,
) {
    return {
        async parse(
            prompt: string,
        ): Promise<PromptToFormResponse<TData>> {
            const data = await options.provider.parse(prompt)

            return {
                data,
                missingFields: [],
                error: null,
            }
        },
    }
}