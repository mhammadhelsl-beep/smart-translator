# Smart Translator

Smart Translator is a Next.js TypeScript web app for bilingual Arabic and English translation plus linguistic analysis. Users enter a word or sentence, and the app sends it to a local Next.js API route that uses DeepSeek for structured analysis and can optionally use SerpAPI to fetch real-world example sentences for English words.

## Main Features

- Analyze Arabic or English words and sentences.
- Translate input text to the other supported language.
- Display linguistic details such as summary, part of speech, root word, morphology, tense information, sentence structure, contextual meanings, common mistakes, synonyms, antonyms, collocations, and usage tips when returned by the analysis API.
- Show results in tabbed sections for linguistic analysis, contexts, examples, synonyms/antonyms, and tips.
- Copy or download the analysis result as JSON.
- Store recent analysis history in browser `localStorage`.
- Use an in-memory server cache for API results.
- Optionally fetch example sentences from SerpAPI for English single-word inputs.

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- PostCSS
- Axios
- Lucide React icons
- React Markdown dependency is installed, but its usage is not specified yet in the current source files.
- DeepSeek Chat Completions API
- SerpAPI, optional

## Project Structure

```text
smart-translator/
|-- src/
|   |-- app/
|   |   |-- api/
|   |   |   `-- analyze/
|   |   |       `-- route.ts
|   |   |-- globals.css
|   |   |-- layout.tsx
|   |   `-- page.tsx
|   |-- components/
|   |   |-- QuickCard.tsx
|   |   |-- ResultTabs.tsx
|   |   |-- SearchBar.tsx
|   |   `-- Sidebar.tsx
|   |-- lib/
|   |   |-- cache.ts
|   |   |-- deepseek.ts
|   |   `-- serp.ts
|   `-- types/
|       `-- analysis.ts
|-- .gitignore
|-- next-env.d.ts
|-- next.config.js
|-- package-lock.json
|-- package.json
|-- postcss.config.js
|-- tailwind.config.js
`-- tsconfig.json
```

## Installation

Install dependencies with npm:

```bash
npm install
```

## Development

Run the local development server:

```bash
npm run dev
```

Then open the local URL shown by Next.js, typically:

```text
http://localhost:3000
```

## Build

Create a production build:

```bash
npm run build
```

Start the production server after building:

```bash
npm run start
```

## Linting

Run the configured lint command:

```bash
npm run lint
```

## Environment Variables

Create a local environment file such as `.env.local`. Do not commit this file.

Required:

```text
DEEPSEEK_API_KEY=your_deepseek_api_key
```

Optional:

```text
SERP_API_KEY=your_serpapi_key
```

Notes:

- `DEEPSEEK_API_KEY` is required for `/api/analyze` to call the DeepSeek API.
- `SERP_API_KEY` is optional. If it is missing, the app returns no SerpAPI examples and continues running.
- Secrets are ignored by `.gitignore` and should not be pushed to GitHub.

## Usage

1. Start the app with `npm run dev`.
2. Enter an Arabic or English word or sentence in the search box.
3. Submit the form to request analysis from `/api/analyze`.
4. Review the result summary and translation.
5. Open the tabs to inspect linguistic analysis, contexts, examples, synonyms/antonyms, and usage tips.
6. Use the copy or download buttons to export the JSON result.
7. Use the history sidebar to reopen recent analyses saved in the browser.

## GitHub Repository

Repository: https://github.com/mhammadhelsl-beep/smart-translator.git

Main branch: `main`

## Future Improvements

- Add automated tests for the API route and UI components.
- Add input validation limits and clearer user-facing error states.
- Add persistent server-side storage if cached analyses should survive server restarts.
- Add deployment documentation.
- Improve documentation for the expected DeepSeek JSON response shape.
- Clarify production hosting and runtime requirements.

## License

Not specified yet. The current `package.json` lists `ISC`.
