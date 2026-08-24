# Prompt to Form

Prompt to Form is a small TypeScript project that converts natural-language user requests into structured form data using an LLM.

Instead of asking a user to manually fill every field, the application extracts the information it can from their prompt and identifies which required fields are still missing.

## Example

User input:

> Book a site visit for Sarah tomorrow

Parsed result:

```json
{
  "data": {
    "customerName": "Sarah",
    "serviceType": "site visit",
    "appointmentDate": "2026-08-25"
  },
  "missingFields": [],
  "error": null
}
```

If the user enters:

> Book a site visit for Sarah

the parser can return:

```json
{
  "data": {
    "customerName": "Sarah",
    "serviceType": "site visit"
  },
  "missingFields": [
    "appointmentDate"
  ],
  "error": null
}
```

## How it works

The application separates AI extraction from validation and application logic.

1. The React frontend sends the user's prompt to the Express API.
2. The Express server passes the prompt to the prompt parser.
3. The parser asks the configured provider to extract structured data.
4. The Groq provider sends the prompt and expected field names to the LLM.
5. The parser checks whether required fields are missing.
6. Zod validates the returned data at runtime.
7. The structured result is returned to the React frontend.

### Architecture

```text
React
  ↓
Express API
  ↓
Prompt Parser
  ↓
Groq Provider
  ↓
Groq LLM
  ↓
Partial form data
  ↓
Required field check
  ↓
Zod validation
  ↓
Structured response
```

The provider is behind a common `PromptProvider<TData>` interface, so the parser is not tied directly to Groq. Other providers can be added without changing the core parsing logic.

## Tech stack

* React + TypeScript for the frontend
* Node.js + Express for the backend API
* Groq SDK for LLM access
* Zod for runtime validation
* Vitest for unit testing
* GitHub Actions for CI

## Running locally

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
```

The API key is only read by the Node server and is not exposed to the React frontend.

Start the backend:

```bash
npm run server
```

Start the React application in another terminal:

```bash
npm run dev
```

The frontend and backend run as separate processes during local development.

## Testing

Run the test suite with:

```bash
npm test -- --run
```

The parser tests cover:

* partial data with missing required fields
* complete valid data
* invalid data returned by a provider

## Continuous integration

GitHub Actions runs automatically for pull requests.

The CI workflow:

1. Checks out the repository
2. Sets up Node.js
3. Installs dependencies
4. Runs the test suite
5. Builds the project

This helps prevent code that fails tests or does not build successfully from being merged.

## Security

The Groq API key is stored in a server-side environment variable.

The React frontend never receives the API key directly. Requests flow through the Express backend, which then communicates with Groq.

The `.env` file is excluded from Git using `.gitignore`.

## Status

The current version includes:

* generic prompt parser
* provider abstraction
* mock provider
* Groq provider
* required-field detection
* Zod runtime validation
* React demo
* Express backend
* unit tests
* GitHub Actions CI

## License

MIT
