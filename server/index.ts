import "dotenv/config"
import express from "express"
import { createGroqProvider, createPromptParser } from "../src/core"
import cors from "cors"


import {
    appointmentSchema,
    type Appointment,
} from "../src/demo/appointmentSchema"

const app = express()
app.use(cors({
    origin: "http://localhost:5173",
}))

app.use(express.json())

const apiKey = process.env.GROQ_API_KEY

if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing")
}
const provider = createGroqProvider({
    apiKey,
    model: "openai/gpt-oss-120b",
    fields: [
        "customerName",
        "serviceType",
        "appointmentDate",
    ],
})
const parser = createPromptParser<Appointment>({
    schema: appointmentSchema,
    provider,
    requiredFields: [
        "customerName",
        "serviceType",
        "appointmentDate",
    ],
})

app.post("/api/parse", async (req, res) => {
    const { prompt } = req.body
    if (!prompt) {
        return res.status(400).json({
            error: "Prompt is required",
        })
    }
    try {
        const result = await parser.parse(prompt)

        return res.json(
            result
        )
    } catch (error) {
        console.error(error)

        return res.status(500).json({
            error: "Failed to parse prompt",
        })
    }
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})