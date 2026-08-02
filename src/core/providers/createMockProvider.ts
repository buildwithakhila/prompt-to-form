import type { PromptProvider } from "./types"

export function createMockProvider<TData>(
    response: Partial<TData>,
): PromptProvider<TData> {
    return {
        async parse() {
            return response
        },
    }
}