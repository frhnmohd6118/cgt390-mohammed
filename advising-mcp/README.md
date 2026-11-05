# Shelfwise MCP Workshop

A standalone MCP stdio server with one read-only tool, `search_books`. It searches the public Shelfwise catalog through `GET /api/books` and returns the matching book records.

## Requirements and setup

- Node.js 24 or newer
- npm

Install dependencies from this directory:

```sh
cd advising-mcp
npm install
```

The server uses the existing `@modelcontextprotocol/sdk` and Zod dependencies. By default it calls `https://cgt390-mohammed.vercel.app/api/books`. For local testing, set `SHELFWISE_API_URL` to the origin of the running Shelfwise app:

```sh
SHELFWISE_API_URL=http://localhost:3000 npm start
```

No advising API credentials or Supabase user credentials are required. The server communicates over stdio; stdout is reserved for MCP messages.

## MCP Inspector

From `advising-mcp`, start Inspector with the local app URL:

```sh
SHELFWISE_API_URL=http://localhost:3000 \
  npx -y @modelcontextprotocol/inspector node ./server.mjs
```

In Inspector, select `search_books` and optionally provide `q` to search book titles and author names. Omit `q` to retrieve the full catalog. Successful calls return the API HTTP status and JSON response as MCP text content; API, network, and invalid-JSON errors are surfaced as tool errors.

## Input validation

`q` is optional. When provided, it is trimmed, must contain at least one non-whitespace character, and may be at most 100 characters. Invalid inputs are rejected by the MCP input schema before the HTTP request is made. The API independently enforces the same length and non-empty requirements.

## Checks

Run the server syntax check with:

```sh
npm run check
```
