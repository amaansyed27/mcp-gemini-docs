# Gemini Docs MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to the Gemini API documentation.

## Features

- **📖 Access Documentation**: Read the full content of Gemini API docs directly within your AI chat interface.
- **🔍 Search Capabilities**: Use the `search_docs` tool to find specific topics, guides, and API references.
- **⚡ Fast & Local**: Runs locally on your machine, serving files from the `gemini-api-docs` directory.
- **🛠️ Broad Compatibility**: Works with Claude Desktop, Cursor, VS Code (Google Antigravity, GitHub Copilot), and any MCP-compliant client.

## Directory Structure

- `gemini-api-docs/`: Contains the Markdown documentation files.
- `gemini-docs-mcp/`: The MCP server implementation (Node.js/TypeScript).

## Prerequisites

- **Node.js**: v16 or higher.
- **NPM**: Installed with Node.js.

## Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <repository-url>
    cd mcp-gemini-docs
    ```

2.  **Install Dependencies & Build**:
    Navigate to the server directory and build the project:
    ```bash
    cd gemini-docs-mcp
    npm install
    npm run build
    ```

## Configuration

Add the server to your MCP client configuration. Replace `/absolute/path/to/` with the actual full path to this repository on your machine.

### 1. Claude Desktop & Claude Code

Edit `%APPDATA%\Claude\claude_desktop_config.json` (Windows) or `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS).

```json
{
  "mcpServers": {
    "gemini-docs": {
      "command": "node",
      "args": [
        "/absolute/path/to/mcp-gemini-docs/gemini-docs-mcp/build/index.js"
      ]
    }
  }
}
```

### 2. Google Antigravity (VS Code)

1.  Open **File > Preferences > Settings**.
2.  Search for "Antigravity MCP".
3.  Edit `mcp_config.json` (or use Command Palette: "Antigravity: Open MCP Config").
4.  Add:

```json
"gemini-docs": {
  "command": "node",
  "args": [
    "/absolute/path/to/mcp-gemini-docs/gemini-docs-mcp/build/index.js"
  ],
  "env": {}
}
```

### 3. Cursor

1.  Go to **Cursor Settings > Features > MCP**.
2.  Click **"Add New MCP Server"**.
3.  **Name**: `gemini-docs`
4.  **Type**: `command`
5.  **Command**: `node /absolute/path/to/mcp-gemini-docs/gemini-docs-mcp/build/index.js`

### 4. GitHub Copilot (VS Code)

*Note: Requires active Copilot subscription and MCP preview access.*

Configure via `.vscode/settings.json` or your user settings:

```json
"github.copilot.mcpServers": {
    "gemini-docs": {
        "command": "node",
        "args": ["/absolute/path/to/mcp-gemini-docs/gemini-docs-mcp/build/index.js"]
    }
}
```

### 5. CLI Tools (Gemini CLI, OpenAI Codex CLI)

Pass the server startup command as an argument.

```bash
# Example
gemini-cli --mcp-server "node /path/to/mcp-gemini-docs/gemini-docs-mcp/build/index.js"
```

## Usage

Once configured, you can ask your AI assistant questions like:

- "Search the Gemini docs for 'structured output'"
- "Read the documentation for 'models'"
- "How do I use context caching with the Gemini API?"

## License

ISC
