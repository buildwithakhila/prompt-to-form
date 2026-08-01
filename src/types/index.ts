export interface PromptToFormOptions<T> {
    schema: T
}

export interface PromptToFormResult<T> {
    data: Partial<T> | null
    loading: boolean
    error: string | null
    parse: (prompt: string) => Promise<void>
}