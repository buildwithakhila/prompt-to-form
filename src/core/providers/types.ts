export interface PromptProvider<TData> {
    parse(prompt: string): Promise<Partial<TData>>
}