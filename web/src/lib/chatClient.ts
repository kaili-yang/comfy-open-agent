import { api } from './comfy'
import { parseNdjson } from './ndjson'

export type AgentEvent =
  | { type: 'start'; conversation_id: string; model: string; provider: string }
  | { type: 'text'; text: string }
  | { type: 'tool_call'; id: string; name: string; arguments: Record<string, unknown> }
  | { type: 'tool_result'; id: string; name: string; ok: boolean; summary: string }
  | { type: 'notice'; message: string }
  | { type: 'error'; message: string }
  | { type: 'done' }

export interface ChatRequest {
  message: string
  conversation_id?: string
  provider: string
  model: string
  base_url: string
  api_key: string
  max_steps: number
  client_id?: string
}

export async function* sendChat(request: ChatRequest): AsyncGenerator<AgentEvent> {
  const res = await api.fetchApi('/comfy-open-agent/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  })
  if (!res.ok || !res.body) {
    let message = `HTTP ${res.status}`
    try {
      message = ((await res.json()) as { error?: string }).error ?? message
    } catch {
      // Body was not JSON; keep the status text
    }
    yield { type: 'error', message }
    return
  }
  yield* parseNdjson<AgentEvent>(res.body)
}

async function post(route: string, body: unknown) {
  await api.fetchApi(route, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
}

export const stopChat = (conversationId: string) =>
  post('/comfy-open-agent/chat/stop', { conversation_id: conversationId })

export const resetChat = (conversationId: string) =>
  post('/comfy-open-agent/chat/reset', { conversation_id: conversationId })
