# Prompt to Form

Convert natural-language prompts into structured, validated form data using TypeScript and LLM providers.

Prompt to Form extracts information from user input, detects missing required fields, validates complete results, and returns a predictable response.

## Install

```bash
npm install @akhila_dev/prompt-to-form
```

## Quick start with Groq

Prompt to Form includes a Groq provider, so you don't need to implement the Groq API call yourself.

Your Groq API key should be provided from a server-side environment variable.

```ts
import {
  createGroqProvider,
  createPromptParser
} from "@akhila_dev/prompt-to-form"

type SupportTicket = {
  issue: string
  priority: string
}

const provider = createGroqProvider<SupportTicket>({
  apiKey: process.env.GROQ_API_KEY!,
  model: "your-groq-model",
  fields: ["issue", "priority"]
})

const schema = {
  safeParse(data: unknown) {
    const value = data as SupportTicket

    if (
      typeof value.issue === "string" &&
      typeof value.priority === "string"
    ) {
      return {
        success: true as const,
        data: value
      }
    }

    return {
      success: false as const,
      error: "Invalid support ticket"
    }
  }
}

const parser = createPromptParser<SupportTicket>({
  provider,
  schema,
  requiredFields: ["issue", "priority"]
})

const result = await parser.parse(
  "My payment failed and I need help urgently"
)

console.log(result)
```

Example result:

```json
{
  "data": {
    "issue": "payment failed",
    "priority": "urgent"
  },
  "missingFields": [],
  "error": null
}
```

## Missing fields

The parser can return partial data when the user has not provided everything required.

For example:

```text
My payment failed
```

If `priority` is required, the result can be:

```json
{
  "data": {
    "issue": "payment failed"
  },
  "missingFields": ["priority"],
  "error": null
}
```

Your application can then ask the user only for the missing information.

## Validation

Prompt to Form is not tied to a specific validation library.

The parser accepts any validator implementing the `safeParse` contract. This means you can use your own validator or integrate a compatible validation library.

## Custom providers

The parser is also not tied to Groq.

You can implement the `PromptProvider<TData>` interface to connect another LLM provider or your own extraction logic.

```ts
const provider = {
  async parse(prompt: string) {
    return {
      issue: "payment failed",
      priority: "urgent"
    }
  }
}
```

## How it works

Prompt to Form separates LLM extraction from validation and application logic.

1. Your application sends a natural-language prompt to the parser.
2. The parser asks the configured provider to extract structured data.
3. The provider returns partial form data.
4. The parser checks whether required fields are missing.
5. If all required fields are present, the configured schema validates the data.
6. The parser returns a predictable result containing `data`, `missingFields`, and `error`.

### Architecture

```text
User prompt
    ↓
Prompt Parser
    ↓
Configured Provider
    ↓
LLM / extraction logic
    ↓
Partial structured data
    ↓
Required field check
    ↓
Schema validation
    ↓
{ data, missingFields, error }
```

The provider is behind the `PromptProvider<TData>` interface, so the core parser is independent of the underlying LLM.

The repository also contains a React frontend and Express backend that demonstrate one way to use the package with Groq while keeping the API key server-side.

## Package

The reusable library is built with:

- TypeScript
- Groq SDK for the built-in Groq provider
- Generic provider abstraction for custom LLM integrations
- Generic `safeParse` validation contract

The package does not require React or Express.

## Demo application

This repository also contains an example application built with:

- React + TypeScript
- Node.js + Express
- Groq
- Vitest
- GitHub Actions

## Running demo locally

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
