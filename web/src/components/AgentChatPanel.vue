<template>
  <div class="coa-panel">
    <header class="coa-header">
      <div class="coa-heading">
        <span class="coa-title">{{ t('title') }}</span>
        <span v-if="chat.model" class="coa-model">{{ chat.model }}</span>
      </div>
      <button
        class="coa-button coa-ghost"
        :disabled="chat.running"
        :title="t('newChat')"
        @click="newConversation"
      >
        <i class="pi pi-plus" /> {{ t('newChat') }}
      </button>
    </header>

    <div ref="scroller" class="coa-messages">
      <p v-if="chat.items.length === 0" class="coa-empty">
        {{ t('welcome') }}<br />
        <small>{{ t('settingsHint') }}</small>
      </p>

      <template v-for="(item, index) in chat.items" :key="index">
        <div v-if="item.kind === 'user'" class="coa-bubble coa-user">
          {{ item.text }}
        </div>
        <div
          v-else-if="item.kind === 'assistant'"
          class="coa-bubble coa-assistant"
          v-html="renderMarkdown(item.text)"
        />
        <details v-else-if="item.kind === 'tool'" class="coa-tool">
          <summary>
            <i :class="toolIcon(item.step.status)" />
            <span class="coa-tool-name">{{ item.step.name }}</span>
            <span class="coa-tool-args">{{ argsPreview(item.step.arguments) }}</span>
          </summary>
          <pre>{{ JSON.stringify(item.step.arguments, null, 2) }}</pre>
          <pre v-if="item.step.summary">{{ item.step.summary }}</pre>
        </details>
        <div
          v-else
          :class="['coa-notice', item.error && 'coa-error']"
        >
          {{ item.text }}
        </div>
      </template>

      <div v-if="chat.running" class="coa-working">
        <i class="pi pi-spin pi-spinner" /> {{ t('working') }}
      </div>
    </div>

    <form class="coa-input" @submit.prevent="submit">
      <textarea
        v-model="draft"
        rows="3"
        :placeholder="t('placeholder')"
        @keydown.enter="onEnter"
      />
      <button
        v-if="chat.running"
        type="button"
        class="coa-button coa-stop"
        @click="stopRunning"
      >
        <i class="pi pi-stop-circle" /> {{ t('stop') }}
      </button>
      <button v-else type="submit" class="coa-button" :disabled="!draft.trim()">
        <i class="pi pi-send" /> {{ t('send') }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'

import type { ToolStep } from '@/lib/chatStore'
import { chat, newConversation, sendMessage, stopRunning } from '@/lib/chatStore'
import { t } from '@/lib/i18n'
import { renderMarkdown } from '@/lib/markdown'

const draft = ref('')
const scroller = ref<HTMLElement>()

function submit() {
  const text = draft.value
  if (!text.trim() || chat.running) return
  draft.value = ''
  void sendMessage(text)
}

function onEnter(event: KeyboardEvent) {
  // Let Shift+Enter add a newline and keep IME composition (e.g. Chinese input) intact
  if (event.shiftKey || event.isComposing) return
  event.preventDefault()
  submit()
}

function toolIcon(status: ToolStep['status']) {
  if (status === 'running') return 'pi pi-spin pi-spinner'
  return status === 'ok' ? 'pi pi-check coa-ok' : 'pi pi-times coa-fail'
}

function argsPreview(args: Record<string, unknown>) {
  const text = JSON.stringify(args)
  if (!text || text === '{}') return ''
  return text.length > 60 ? `${text.slice(0, 60)}…` : text
}

function scrollToBottom() {
  void nextTick(() => {
    if (scroller.value) scroller.value.scrollTop = scroller.value.scrollHeight
  })
}

watch(() => [chat.items.length, chat.running], scrollToBottom)
onMounted(scrollToBottom)
</script>

<style scoped>
.coa-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  color: var(--input-text, #ddd);
  font-size: 13px;
}

.coa-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border-color, #444);
}

.coa-heading {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.coa-title {
  font-weight: 600;
  font-size: 14px;
}

.coa-model {
  font-size: 11px;
  opacity: 0.6;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coa-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.coa-empty {
  opacity: 0.7;
  line-height: 1.5;
}

.coa-bubble {
  padding: 8px 10px;
  border-radius: 8px;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.45;
}

.coa-user {
  align-self: flex-end;
  max-width: 85%;
  background: var(--p-primary-color, #3b82f6);
  color: var(--p-primary-contrast-color, #fff);
}

.coa-assistant {
  background: var(--comfy-input-bg, #222);
}

.coa-assistant :deep(pre) {
  margin: 6px 0;
  padding: 8px;
  overflow-x: auto;
  border-radius: 6px;
  background: var(--comfy-menu-bg, #111);
  white-space: pre;
}

.coa-assistant :deep(code) {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 12px;
}

.coa-tool {
  font-size: 12px;
  border-left: 2px solid var(--border-color, #444);
  padding-left: 8px;
}

.coa-tool summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  list-style: none;
}

.coa-tool-name {
  font-family: ui-monospace, Menlo, Consolas, monospace;
}

.coa-tool-args {
  opacity: 0.55;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.coa-tool pre {
  margin: 4px 0;
  padding: 6px;
  max-height: 200px;
  overflow: auto;
  border-radius: 4px;
  background: var(--comfy-input-bg, #222);
  white-space: pre-wrap;
  word-break: break-word;
}

.coa-ok {
  color: #22c55e;
}

.coa-fail {
  color: #ef4444;
}

.coa-notice {
  font-size: 12px;
  opacity: 0.75;
  font-style: italic;
}

.coa-error {
  color: #ef4444;
  opacity: 1;
  font-style: normal;
}

.coa-working {
  font-size: 12px;
  opacity: 0.7;
}

.coa-input {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 10px 12px;
  border-top: 1px solid var(--border-color, #444);
}

.coa-input textarea {
  resize: vertical;
  min-height: 60px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid var(--border-color, #444);
  background: var(--comfy-input-bg, #222);
  color: inherit;
  font: inherit;
}

.coa-button {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  background: var(--p-primary-color, #3b82f6);
  color: var(--p-primary-contrast-color, #fff);
  font: inherit;
}

.coa-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.coa-ghost {
  background: transparent;
  color: inherit;
  border: 1px solid var(--border-color, #444);
  font-size: 12px;
  padding: 4px 8px;
}

.coa-stop {
  background: #ef4444;
}
</style>
