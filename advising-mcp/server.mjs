import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const DEFAULT_API_BASE_URL = "https://cgt390-mohammed.vercel.app";
const API_BASE_URL = process.env.SHELFWISE_API_URL || DEFAULT_API_BASE_URL;

function toolResponse(payload, isError = false) {
  return {
    content: [{ type: "text", text: JSON.stringify(payload) }],
    ...(isError ? { isError: true } : {}),
  };
}

const server = new McpServer({
  name: "shelfwise-mcp-workshop",
  version: "1.0.0",
});

server.registerTool(
  "search_books",
  {
    title: "Search Shelfwise books",
    description:
      "Search the public Shelfwise book catalog by title or author and return matching catalog records. Omit q to return all books.",
    inputSchema: {
      q: z
        .string()
        .trim()
        .min(1, "Search query must not be empty")
        .max(100, "Search query must be at most 100 characters")
        .optional()
        .describe("Optional title or author search, up to 100 characters"),
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
  },
  async ({ q }) => {
    const url = new URL("/api/books", API_BASE_URL);
    if (q !== undefined) {
      url.searchParams.set("q", q);
    }

    let response;
    try {
      response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });
    } catch {
      return toolResponse({ status: null, error: "Unable to reach the Shelfwise API." }, true);
    }

    let body;
    try {
      body = await response.json();
    } catch {
      return toolResponse(
        { status: response.status, error: "The Shelfwise API returned invalid JSON." },
        true,
      );
    }

    return toolResponse({ status: response.status, body }, !response.ok);
  },
);

try {
  await server.connect(new StdioServerTransport());
} catch {
  console.error("Failed to start the Shelfwise MCP server.");
  process.exitCode = 1;
}
