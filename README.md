# Comfy Open Agent

An open-source ComfyUI agent that provides AI-powered workflow building and editing capabilities. This is a free alternative to Comfy Agent/ComfyTV Bot.

## Features

- **Full-stack implementation**: Python backend + Vue frontend
- **Multi-provider LLM support**: Local LLM (Ollama/LM Studio), OpenAI, Anthropic
- **MCP (Model Context Protocol) compliant**: Compatible with Claude Code, Codex, and other MCP clients
- **Chat interface**: Natural language conversation to build and edit workflows
- **Graph editing**: Add, connect, configure, and remove nodes programmatically
- **Agent skills system**: Support for SKILL.md format for reusable instruction packs
- **Workflow validation**: Check workflows before execution
- **Image inspection**: View and analyze generated outputs

## Architecture

- **Backend**: Python custom nodes with MCP server
- **Frontend**: Vue 3 chat panel integrated with ComfyUI_frontend
- **Protocol**: Model Context Protocol (MCP) for agent communication

## Installation

### Backend (Python)

1. Clone this repository into your ComfyUI `custom_nodes` directory:
```bash
cd ComfyUI/custom_nodes
git clone <repo-url> comfy-open-agent
```

2. Install Python dependencies:
```bash
cd comfy-open-agent
pip install -r requirements.txt
```

3. Restart ComfyUI

### Frontend (Vue)

1. Navigate to the web directory:
```bash
cd comfy-open-agent/web
npm install
npm run build
```

2. Refresh ComfyUI

## Configuration

Configure LLM providers in ComfyUI settings:

### Local LLM (Ollama)
- Set Ollama base URL (default: `http://localhost:11434`)
- Select model name (e.g., `llama3.2`, `mistral`)

### OpenAI API
- Set API endpoint (default: `https://api.openai.com/v1`)
- Provide API key
- Select model (e.g., `gpt-4`, `gpt-3.5-turbo`)

### Anthropic API
- Set API endpoint (default: `https://api.anthropic.com`)
- Provide API key
- Select model (e.g., `claude-3-opus`, `claude-3-sonnet`)

## Usage

### Using the Chat Interface

1. Add the "Open Agent" node to your workflow
2. The chat panel will appear in the node
3. Describe what you want to create (e.g., "Create a text-to-image workflow with SDXL")
4. The agent will:
   - Understand your request
   - Build the appropriate nodes
   - Connect them correctly
   - Set default values
   - Execute the workflow

### Using MCP Server

The MCP server is available at `POST /comfy-open-agent/mcp` on your ComfyUI server.

Tools available:
- `get_canvas`: Read live canvas snapshot
- `edit_graph`: Add/remove/modify nodes
- `run_workflow`: Execute workflows
- `inspect_image`: View generated outputs
- `list_models`: Browse available models
- `get_workflow`: Get current workflow as JSON

### Example MCP Client (Python)

```python
import httpx

async def call_mcp_tool(tool_name: str, arguments: dict):
    response = await httpx.post(
        "http://localhost:8188/comfy-open-agent/mcp",
        json={
            "jsonrpc": "2.0",
            "method": "tools/call",
            "params": {
                "name": tool_name,
                "arguments": arguments
            },
            "id": 1
        }
    )
    return response.json()
```

## Agent Skills

The agent skills system allows you to create reusable instruction packs for specific tasks.

### Built-in Skills

- **basic-workflow-builder**: Build basic text-to-image workflows

### Creating Custom Skills

Create a new skill by adding a directory to `skills/`:

```
skills/
  my-skill/
    SKILL.md
    references/
      example-workflow.json
      prompt-template.txt
```

The `SKILL.md` file should contain:
- A description (first line or explicit `Description:` field)
- When to use this skill
- Step-by-step instructions
- Example workflows
- Tips and best practices

### Example Skill Format

```markdown
# My Skill

**Description**: Brief description of what this skill does.

## When to use this skill

Use this skill when...

## Instructions

Step-by-step instructions...

## Example workflows

Code examples...

## Tips

Additional tips...
```

## Development

### Backend Development

```bash
cd comfy-open-agent
python -m pytest tests/
```

### Frontend Development

```bash
cd comfy-open-agent/web
npm run dev  # Watch mode for development
npm run build  # Production build
npm run typecheck  # Type checking
```

## Project Structure

```
comfy-open-agent/
├── src/
│   └── comfy_open_agent/
│       ├── nodes.py           # Main node definitions
│       ├── mcp/
│       │   └── server.py      # MCP server implementation
│       ├── llm/
│       │   └── providers.py   # LLM provider implementations
│       ├── graph/
│       │   └── operations.py  # Graph editing operations
│       └── skills/
│           └── manager.py     # Skills system manager
├── web/
│   ├── src/
│   │   ├── components/
│   │   │   └── AgentChatPanel.vue
│   │   ├── locales/
│   │   └── main.ts
│   └── package.json
├── skills/                    # Agent skills directory
│   └── basic-workflow-builder/
│       └── SKILL.md
├── requirements.txt
├── pyproject.toml
└── README.md
```

## License

MIT License - Free and open source

## Contributing

Contributions welcome! Please read the guidelines below:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Roadmap

- [ ] Add more built-in skills (video generation, image editing, etc.)
- [ ] Implement workflow validation and error checking
- [ ] Add support for custom node discovery
- [ ] Improve LLM prompt engineering for better graph generation
- [ ] Add workflow templates library
- [ ] Implement memory/context for multi-turn conversations
- [ ] Add support for batch operations
- [ ] Create comprehensive documentation

## Acknowledgments

- Inspired by Comfy Agent and ComfyTV Bot
- Built with Vue 3, PrimeVue, and the ComfyUI frontend API
- Uses the Model Context Protocol (MCP) for agent integration
