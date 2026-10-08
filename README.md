# Comfy Open Agent

An open-source agent for ComfyUI: chat with an LLM in a sidebar panel and it
builds, edits, runs and debugs the workflow on your canvas. The same tools are
exposed over MCP, so Claude Code, Codex and other MCP clients can drive
ComfyUI too.

## Features

- **Sidebar chat panel** that edits the live canvas (add/remove/connect nodes,
  set widget values, load whole workflows), queues runs, waits for results and
  looks at the output images.
- **Any LLM with tool calling**: local OpenAI-compatible servers (Ollama,
  LM Studio, vLLM, ...), the OpenAI API, or the Anthropic API.
- **MCP server** at `/comfy-open-agent/mcp` (Streamable HTTP) with the same
  tool set.
- **Grounded in your install**: the agent looks up real node types, input
  names, combo options and model files instead of guessing.
- **Skills**: `SKILL.md` instruction packs with reference files, loaded on
  demand.

## How it works

```
 Sidebar panel ──POST /comfy-open-agent/chat──▶ Agent loop (Python) ──▶ LLM
                                                    │
                       ┌────────────────────────────┴───────────────┐
             server tools (node catalog,          canvas tools (get_canvas,
             models, run status, images,          add_node, connect, ...)
             skills) run in Python                      │ websocket
                                                        ▼
 MCP client ──POST /comfy-open-agent/mcp──▶ same tools   browser tab runs the
                                                        operation on the graph
```

The LiteGraph canvas only exists in the browser, so canvas tools are sent to
the open ComfyUI tab over ComfyUI's websocket. The tab applies them and posts
the result back. Canvas tools therefore need a ComfyUI tab to be open; the
most recently focused tab receives them.

## Installation

```bash
cd ComfyUI/custom_nodes
git clone <repo-url> comfy-open-agent
pip install -r comfy-open-agent/requirements.txt   # in ComfyUI's Python environment
```

Restart ComfyUI and open the **Open Agent** tab in the left sidebar. The built
frontend (`web/dist`) is committed, so Node.js is only needed for development.

## Configuration

Settings → **Open Agent**:

| Setting | Notes |
| --- | --- |
| LLM provider | `local` (any OpenAI-compatible server), `openai`, `anthropic` |
| Model name | Empty = provider default: `qwen3` / `gpt-5` / `claude-opus-5-5` |
| API base URL | Empty = `http://localhost:11434/v1` / `https://api.openai.com/v1` / `https://api.anthropic.com` |
| API key | Not needed for local servers. If empty, the server uses `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` |
| Max steps | Tool calls per message before the agent pauses (default 30) |

Local models must support tool calling (for example `qwen2.5`, `qwen3`,
`llama3.1` in Ollama). Bigger models follow multi-step instructions much more
reliably.

With the Anthropic provider on the official endpoint, Claude Opus 5.5 / Sonnet
5.5 / Opus 5 / Fable 5.1 requests opt into server-side refusal fallbacks
(`fallbacks: "default"`), so a declined request is retried on Anthropic's
recommended fallback model instead of failing.

## Using it over MCP

Add the endpoint to your MCP client, e.g. Claude Code:

```bash
claude mcp add --transport http comfyui http://127.0.0.1:8188/comfy-open-agent/mcp
```

Keep a ComfyUI tab open for the canvas tools. Skills are also exposed as MCP
resources (`skill://<name>`).

### Tools

| Tool | Runs in | Purpose |
| --- | --- | --- |
| `get_canvas` | browser | Nodes, widget values and links on the canvas |
| `load_workflow` | browser | Replace the canvas with an API-format workflow |
| `add_node`, `remove_node` | browser | Add / remove a node |
| `connect`, `disconnect` | browser | Link slots by name or index |
| `set_widgets` | browser | Set widget values (combo values are validated) |
| `queue_workflow` | browser | Queue the canvas; returns `prompt_id` or validation errors |
| `search_nodes`, `get_node_info` | server | Find node types and their inputs/outputs |
| `list_models` | server | Model folders and files |
| `get_run_status` | server | Wait for a run; outputs and execution errors |
| `view_image` | server | Return an output/input/temp image to the model |
| `read_skill` | server | Load a skill or one of its reference files |

## Skills

A skill is a directory with a `SKILL.md` and optional reference files:

```
skills/
  my-skill/
    SKILL.md
    references/
      workflow.json
```

```markdown
---
name: my-skill
description: One line saying when the agent should use this skill.
---

# My Skill

Step-by-step instructions for the agent...
```

The agent sees every skill's name and description and loads the full text with
`read_skill` when one matches. Built-in skills live in `skills/`; add your own
directories with the `COMFY_OPEN_AGENT_SKILLS_DIR` environment variable
(`os.pathsep`-separated). A skill there with the same name overrides the
built-in one.

## HTTP API

All routes are also available under `/api/...`.

| Route | Purpose |
| --- | --- |
| `POST /comfy-open-agent/chat` | Run one user message; streams NDJSON events |
| `POST /comfy-open-agent/chat/stop` | Stop a running turn |
| `POST /comfy-open-agent/chat/reset` | Forget a conversation |
| `GET /comfy-open-agent/info` | Provider defaults, skills, whether a tab is connected |
| `POST/GET/DELETE /comfy-open-agent/mcp` | MCP endpoint |

Conversations are kept in server memory and are lost when ComfyUI restarts.
Changing the provider, model or base URL starts a new conversation.

## Development

```bash
# Backend tests (no ComfyUI needed)
pip install pytest anthropic openai
python -m pytest

# Frontend
cd web
npm install
npm test           # unit tests
npm run build      # typecheck + build to web/dist
npm run dev        # rebuild on change
```

### Project structure

```
comfy-open-agent/
├── __init__.py                 # ComfyUI entry: registers routes, serves web/dist
├── src/comfy_open_agent/
│   ├── routes.py               # HTTP routes
│   ├── bridge.py               # Forwards canvas tools to the browser tab
│   ├── agent/loop.py           # Agent loop, conversations, system prompt
│   ├── llm/providers.py        # OpenAI-compatible and Anthropic providers
│   ├── tools/                  # Tool registry, canvas/server/skill tools
│   ├── mcp/server.py           # MCP JSON-RPC handling
│   └── skills/manager.py       # Skill discovery
├── skills/                     # Built-in skills
├── tests/                      # Backend tests
└── web/
    ├── src/main.ts             # Registers settings, sidebar tab, bridge
    ├── src/lib/canvasOps.ts    # Canvas operations run in the browser
    ├── src/components/         # Chat panel
    └── dist/                   # Built bundle loaded by ComfyUI
```

## License

MIT
