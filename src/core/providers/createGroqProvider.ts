import Groq from "groq-sdk"
import type { PromptProvider } from "./types"

interface GroqProviderOptions {
    apiKey: string
    model: string
}

export function createGroqProvider<TData>(
    options: GroqProviderOptions,
): PromptProvider<TData> {
    const client = new Groq({
        apiKey: options.apiKey,
    })
    return {
        async parse(prompt: string) {
            const completion = await client.chat.completions.create({
                model: options.model,
                messages: [
                    {
                        role: "system",
                        content:
                            "Extract form data from the user's request. Return only valid JSON.",
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                response_format: {
                    type: "json_object",
                },
            })
            const content = completion.choices[0]?.message.content
            if (!content) {
                throw new Error("Groq returned an empty response")
            }
            const parsedData = JSON.parse(content) as Partial<TData>

            return parsedData
        },
    }

}