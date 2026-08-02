export interface PromptToFormOptions<T> {
    schema: T
}

export interface PromptToFormResponse<T> {
    data: Partial<T> | null
    error: string | null
    missingFields: []
}