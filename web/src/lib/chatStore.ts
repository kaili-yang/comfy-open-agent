import { reactive, watch } from 'vue'

import type { AgentEvent } from './chatClient'
import { resetChat, sendChat, stopChat } from './chatClient'
import { api } from './comfy'
import { t } from './i18n'
import { readAgentSettings } from './settings'

export interface ToolStep {
  id: string
  name: string
  arguments: Record<string, unknown>
  status: 'running' | 'ok' | 'error'
  summary?: string
}

export type ChatItem =
  | { kind: 'user'; text: string }
  | { kind: 'assistant'; text: string }
  | { kind: 'tool'; step: ToolStep }
  | { kind: 'notice'; text: string; error?: boolean }

interface ChatState {
  items: ChatItem[]
  conversationId?: string
  running: boolean
  model?: string
}

const STORAGE_KEY = 'comfy-open-agent.chat'
const MAX_STORED_ITEMS = 200

function loadState(): ChatState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<ChatState>
      return {
        items: (saved.items ?? []).map((item) =>
          item.kind === 'tool' && item.step.status === 'running'
            ? { ...item, step: { ...item.step, status: 'error' } }
            : item
        ),
        conversationId: saved.conversationId,
        model: saved.model,
        running: false
      }
    }
  } catch {
    // Storage unavailable or corrupt: start fresh
  }
  return { items: [], running: false }
}

export const chat = reactive<ChatState>(loadState())

watch(
  () => [chat.items.length, chat.conversationId, chat.running],
  () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          items: chat.items.slice(-MAX_STORED_ITEMS),
          conversationId: chat.conversationId,
          model: chat.model
        })
      )
    } catch {
      // Ignore quota / private mode errors
    }
  }
)

function findStep(id: string): ToolStep | undefined {
  for (let i = chat.items.length - 1; i >= 0; i--) {
    const item = chat.items[i]
    if (item.kind === 'tool' && item.step.id === id) return item.step
  }
  return undefined
}

export function applyEvent(event: AgentEvent) {
  switch (event.type) {
    case 'start':
      chat.conversationId = event.conversation_id
      chat.model = `${event.provider} · ${event.model}`
      break
    case 'text':
      chat.items.push({ kind: 'assistant', text: event.text })
      break
    case 'tool_call':
      chat.items.push({
        kind: 'tool',
        step: { id: event.id, name: event.name, arguments: event.arguments, status: 'running' }
      })
      break
    case 'tool_result': {
      const step = findStep(event.id)
      if (step) {
        step.status = event.ok ? 'ok' : 'error'
        step.summary = event.summary
      }
      break
    }
    case 'notice':
      chat.items.push({ kind: 'notice', text: event.message })
      break
    case 'error':
      chat.items.push({ kind: 'notice', text: event.message, error: true })
      break
    case 'done':
      break
  }
}

export async function sendMessage(text: string) {
  const message = text.trim()
  if (!message || chat.running) return
  chat.items.push({ kind: 'user', text: message })
  chat.running = true
  try {
    for await (const event of sendChat({
      ...readAgentSettings(),
      message,
      conversation_id: chat.conversationId,
      client_id: api.clientId
    })) {
      applyEvent(event)
    }
  } catch (e) {
    applyEvent({ type: 'error', message: t('requestFailed', { message: String(e) }) })
  } finally {
    chat.running = false
  }
}

export async function stopRunning() {
  if (chat.conversationId) await stopChat(chat.conversationId)
}

export async function newConversation() {
  if (chat.running) return
  const id = chat.conversationId
  chat.items = []
  chat.conversationId = undefined
  if (id) await resetChat(id).catch(() => undefined)
}
