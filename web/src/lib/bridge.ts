import type { CanvasEnv, QueueResult } from './canvasOps'
import { CanvasOpError, runCanvasOp } from './canvasOps'
import { api, app } from './comfy'

const TOOL_CALL_EVENT = 'comfy-open-agent.tool_call'
const REGISTER_ROUTE = '/comfy-open-agent/bridge/register'
const RESULT_ROUTE = '/comfy-open-agent/bridge/result'

interface ToolCallMessage {
  call_id: string
  op: string
  args: Record<string, unknown>
}

interface PromptFailure {
  response?: {
    error?: { message?: string; details?: string } | string
    node_errors?: Record<string, unknown>
  }
}

function graph() {
  return app.rootGraph ?? app.graph
}

async function queueCurrentWorkflow(): Promise<QueueResult> {
  const prompt = await app.graphToPrompt()
  try {
    const res = await api.queuePrompt(0, prompt)
    return { queued: true, prompt_id: res.prompt_id, number: res.number }
  } catch (e) {
    const response = (e as PromptFailure).response
    if (!response) throw e
    const error =
      typeof response.error === 'string'
        ? response.error
        : [response.error?.message, response.error?.details]
            .filter(Boolean)
            .join(': ')
    return {
      queued: false,
      error: error || 'Prompt validation failed',
      node_errors: response.node_errors
    }
  }
}

export const browserCanvasEnv: CanvasEnv = {
  graph,
  createNode: (type) => window.LiteGraph?.createNode(type) ?? null,
  hasNodeType: (type) => Boolean(window.LiteGraph?.registered_node_types[type]),
  loadApiJson: (workflow) => app.loadApiJson(workflow, 'agent-workflow'),
  queue: queueCurrentWorkflow
}

async function postJson(route: string, body: unknown) {
  return api.fetchApi(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

async function handleToolCall(message: ToolCallMessage) {
  let reply: Record<string, unknown>
  try {
    const result = await runCanvasOp(browserCanvasEnv, message.op, message.args)
    reply = { call_id: message.call_id, ok: true, result }
  } catch (e) {
    const known = e instanceof CanvasOpError
    if (!known) console.error('[comfy-open-agent] canvas operation failed', e)
    reply = {
      call_id: message.call_id,
      ok: false,
      error: known ? e.message : `Unexpected error: ${String(e)}`
    }
  }
  await postJson(RESULT_ROUTE, reply)
}

let registeredClientId: string | undefined

async function registerClient(force = false) {
  const clientId = api.clientId
  if (!clientId || (!force && clientId === registeredClientId)) return
  registeredClientId = clientId
  try {
    await postJson(REGISTER_ROUTE, { client_id: clientId })
  } catch (e) {
    console.warn('[comfy-open-agent] bridge registration failed', e)
  }
}

export function setupBridge() {
  api.addEventListener(TOOL_CALL_EVENT, (event) => {
    void handleToolCall((event as CustomEvent<ToolCallMessage>).detail)
  })
  // clientId arrives with the first status message and can change on reconnect
  api.addEventListener('status', () => void registerClient())
  api.addEventListener('reconnected', () => void registerClient(true))
  // The most recently focused tab receives canvas operations
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') void registerClient(true)
  })
  void registerClient()
}
