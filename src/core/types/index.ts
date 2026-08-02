import type { PromptProvider } from "../providers/types"

export interface SchemaValidator<TData> {
    safeParse(data: unknown):
        | {
            success: true
            data: Partial<TData>
        }
        | {
            success: false
            error: unknown
        }
}
export interface PromptToFormOptions<TData> {
    schema: SchemaValidator<TData>
    provider: PromptProvider<TData>
    requiredFields: readonly (keyof TData)[]
}

export interface PromptToFormResponse<T> {
    data: Partial<T> | null
    error: string | null
    missingFields: (keyof T)[]
}