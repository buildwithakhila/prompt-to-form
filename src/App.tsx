import { useState } from "react"
import "./App.css"
import type { Appointment } from "./demo/appointmentSchema"

const EXAMPLE_PROMPTS = [
  "Book a rodent inspection for Sarah Collins tomorrow",
  "Schedule a site visit for Alex next Friday",
  "Set up a boiler service for Priya on the 14th",
]

const FIELD_LABELS: Record<string, string> = {
  customerName: "Customer",
  serviceType: "Service",
  appointmentDate: "Date",
}

function App() {
  const [prompt, setPrompt] = useState("")
  const [result, setResult] = useState<Partial<Appointment> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [missingFields, setMissingFields] = useState<string[]>([])
  const [showRaw, setShowRaw] = useState(false)

  async function handleParse() {
    setLoading(true)
    setError(null)

    try {
      const httpResponse = await fetch("http://localhost:3001/api/parse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
        }),
      })

      const response = await httpResponse.json()

      if (!httpResponse.ok) {
        throw new Error(response.error ?? "Failed to parse prompt")
      }

      setResult(response.data)
      setMissingFields((response.missingFields ?? []).map(String))
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

  const resultEntries = result
    ? Object.entries(result).filter(([, value]) => value !== undefined && value !== null && value !== "")
    : []

  return (
    <main className="page">
      <div className="card">
        <span className="eyebrow">✨ AI-assisted form parsing</span>
        <h1>Prompt to Form</h1>
        <p className="subtitle">
          Describe an appointment in plain English — the parser extracts what it can
          and tells you what's still missing.
        </p>

        <label className="field-label" htmlFor="prompt">Your request</label>
        <textarea
          id="prompt"
          className="prompt-input"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Book a rodent inspection for Sarah Collins tomorrow"
        />

        <div className="examples">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              key={example}
              type="button"
              className="example-chip"
              onClick={() => setPrompt(example)}
            >
              {example}
            </button>
          ))}
        </div>

        <button
          className="parse-btn"
          onClick={handleParse}
          disabled={loading || !prompt.trim()}
        >
          {loading && <span className="spinner" aria-hidden="true" />}
          {loading ? "Parsing…" : "Parse appointment"}
        </button>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {!error && missingFields.length > 0 && (
          <div className="alert alert-missing">
            Missing: {missingFields.map((field) => FIELD_LABELS[field] ?? field).join(", ")}
          </div>
        )}

        {!error && resultEntries.length > 0 && (
          <div className="result">
            <div className="result-heading">✅ Parsed successfully</div>

            <dl className="field-grid">
              {resultEntries.map(([key, value]) => (
                <div className="field-row" key={key}>
                  <dt>{FIELD_LABELS[key] ?? key}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              className="raw-toggle"
              onClick={() => setShowRaw((prev) => !prev)}
            >
              {showRaw ? "Hide raw JSON" : "View raw JSON"}
            </button>
            {showRaw && (
              <pre className="raw-json">{JSON.stringify(result, null, 2)}</pre>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

export default App
