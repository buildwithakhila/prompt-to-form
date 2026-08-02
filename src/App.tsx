import { useState } from "react"
import { appointmentParser } from "./demo/createAppointmentDemo"
import type { Appointment } from "./demo/appointmentSchema"


function App() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<Partial<Appointment> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingFields, setMissingFields] = useState<string[]>([])

  async function handleParse() {
    setLoading(true)
    setError(null)

    try {
      const response = await appointmentParser.parse(prompt)
      setResult(response.data)
      setMissingFields(response.missingFields.map(String))
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong",
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main>
      <h1>Prompt to Form</h1>

      <textarea
        value={prompt}
        onChange={(event) => setPrompt(event.target.value)}
        placeholder="Book a rodent inspection for Sarah Collins"
      />
      <button
        onClick={handleParse}
        disabled={loading || !prompt.trim()}
      >
        {loading ? "Parsing..." : "Parse appointment"}
      </button>
      {error && <p role="alert">{error}</p>}
      {missingFields.length > 0 && (
        <p>
          Missing fields: {missingFields.join(", ")}
        </p>
      )}
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </main>
  )
}

export default App