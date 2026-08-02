import type { PromptProvider } from "../providers/types"

export interface PromptToFormOptions<TSchema, TData> {
    schema: TSchema
    provider: PromptProvider<TData>
}

export interface PromptToFormResponse<T> {
    data: Partial<T> | null
    error: string | null
    missingFields: (keyof T)[]
}