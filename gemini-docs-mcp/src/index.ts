import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

// Define the root directory of the documentation
// Assuming the server is running from <project>/build/index.js, 
// and docs are in <project>/../gemini-api-docs
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the root directory of the documentation
// Assuming the server is running from <project>/build/index.js, 
// and docs are in <project>/../gemini-api-docs
const DOCS_ROOT = path.resolve(__dirname, "../../gemini-api-docs");

// Initialize MCP Server
const server = new McpServer({
    name: "Gemini Docs",
    version: "1.0.0",
});

// Helper to recursively list markdown files
async function getMarkdownFiles(dir: string): Promise<string[]> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files.push(...(await getMarkdownFiles(fullPath)));
        } else if (entry.isFile() && entry.name.endsWith(".md")) {
            files.push(fullPath);
        }
    }
    return files;
}

// Helper to normalize path for URI
function toUriPath(relativePath: string): string {
    return relativePath.replace(/\\/g, "/");
}

async function main() {
    console.error(`Starting Gemini Docs MCP Server...`);
    console.error(`Docs Root: ${DOCS_ROOT}`);

    try {
        const files = await getMarkdownFiles(DOCS_ROOT);

        // Register each file as a resource
        for (const filePath of files) {
            const relativePath = path.relative(DOCS_ROOT, filePath);
            const uriPath = toUriPath(relativePath);
            const resourceUri = `gemini-docs:///${uriPath}`;

            server.resource(
                relativePath, // name
                resourceUri,  // uri
                async () => {
                    const content = await fs.readFile(filePath, "utf-8");
                    return {
                        contents: [
                            {
                                uri: resourceUri,
                                text: content,
                            },
                        ],
                    };
                }
            );
            // console.error(`Registered resource: ${resourceUri}`);
        }

        // Register a resource that aggregates ALL documentation
        server.resource(
            "all-docs",
            "gemini-docs:///all",
            async () => {
                const allContent: string[] = [];
                for (const filePath of files) {
                    const relativePath = path.relative(DOCS_ROOT, filePath);
                    const fileContent = await fs.readFile(filePath, "utf-8");
                    allContent.push(`# File: ${relativePath}\n\n${fileContent}`);
                }
                return {
                    contents: [
                        {
                            uri: "gemini-docs:///all",
                            text: allContent.join("\n\n---\n\n"),
                        },
                    ],
                };
            }
        );

        // Add a search tool
        server.tool(
            "search_docs",
            { query: z.string().describe("The search query to find in documentation") },
            async ({ query }) => {
                const results: string[] = [];
                for (const file of files) {
                    const content = await fs.readFile(file, "utf-8");
                    if (content.toLowerCase().includes(query.toLowerCase())) {
                        const relativePath = path.relative(DOCS_ROOT, file);
                        results.push(relativePath);
                    }
                }
                return {
                    content: [
                        {
                            type: "text",
                            text: results.length > 0
                                ? `Found "${query}" in:\n${results.join("\n")}`
                                : `No results found for "${query}"`
                        }
                    ]
                };
            }
        );

        const transport = new StdioServerTransport();
        await server.connect(transport);
        console.error("Gemini Docs MCP Server running on stdio");
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
}

main();
