<template>
  <div class="agent-chat-panel">
    <div class="chat-header">
      <h3>{{ t('agent.title') }}</h3>
      <div class="provider-selector">
        <Dropdown
          v-model="selectedProvider"
          :options="providers"
          optionLabel="label"
          optionValue="value"
          placeholder="Select Provider"
          class="provider-dropdown"
        />
      </div>
    </div>

    <div class="chat-messages" ref="messagesContainer">
      <div
        v-for="(message, index) in messages"
        :key="index"
        :class="['message', message.role]"
      >
        <div class="message-avatar">
          <span v-if="message.role === 'user'">👤</span>
          <span v-else>🤖</span>
        </div>
        <div class="message-content">
          <div class="message-text">{{ message.content }}</div>
          <div v-if="message.operations" class="message-operations">
            <div v-for="(op, opIndex) in message.operations" :key="opIndex" class="operation">
              <Tag :value="op.type" severity="info" />
              <span>{{ op.description }}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-if="isProcessing" class="message assistant">
        <div class="message-avatar">🤖</div>
        <div class="message-content">
          <ProgressSpinner style="width: 24px; height: 24px" strokeWidth="4" />
          <span>{{ t('agent.thinking') }}</span>
        </div>
      </div>
    </div>

    <div class="chat-input">
      <Textarea
        v-model="userInput"
        :placeholder="t('agent.placeholder')"
        rows="3"
        autoResize
        @keydown.ctrl.enter="sendMessage"
      />
      <Button
        :label="t('agent.send')"
        icon="pi pi-send"
        @click="sendMessage"
        :disabled="!userInput.trim() || isProcessing"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Textarea from 'primevue/textarea'
import Tag from 'primevue/tag'
import ProgressSpinner from 'primevue/progressspinner'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  operations?: Array<{
    type: string
    description: string
  }>
}

interface Props {
  widget: any
  node: any
}

const props = defineProps<Props>()
const { t } = useI18n()

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: t('agent.welcome'),
  },
])
const userInput = ref('')
const isProcessing = ref(false)
const selectedProvider = ref('local')
const messagesContainer = ref<HTMLElement>()

const providers = [
  { label: 'Local LLM', value: 'local' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
]

async function sendMessage() {
  if (!userInput.value.trim() || isProcessing.value) return

  const userMessage = userInput.value.trim()
  userInput.value = ''

  // Add user message
  messages.value.push({
    role: 'user',
    content: userMessage,
  })

  // Update widget
  updateWidget()

  isProcessing.value = true
  scrollToBottom()

  try {
    // Send to backend
    const response = await sendToBackend(userMessage)

    // Add assistant response
    messages.value.push({
      role: 'assistant',
      content: response.message || t('agent.done'),
      operations: response.operations,
    })

    updateWidget()
  } catch (error) {
    console.error('Error sending message:', error)
    messages.value.push({
      role: 'assistant',
      content: t('agent.error'),
    })
  } finally {
    isProcessing.value = false
    scrollToBottom()
  }
}

async function sendToBackend(message: string) {
  // @ts-ignore
  const graph = app.graph

  // Get node configuration
  const llmProvider = selectedProvider.value
  const modelName = props.node.widgets?.find((w: any) => w.name === 'model_name')?.value || 'llama3.2'
  const apiEndpoint = props.node.widgets?.find((w: any) => w.name === 'api_endpoint')?.value || 'http://localhost:11434/api/chat'
  const apiKey = props.node.widgets?.find((w: any) => w.name === 'api_key')?.value || ''

  // Prepare the request
  const requestData = {
    messages: messages.value,
    provider: llmProvider,
    model: modelName,
    api_endpoint: apiEndpoint,
    api_key: apiKey,
  }

  // Update widget with request data
  props.widget.value = requestData

  // Trigger node execution
  // @ts-ignore
  await app.queuePrompt()

  // Get the result from the node output
  // This is a simplified version - actual implementation will poll for results
  return {
    message: 'Workflow updated successfully',
    operations: [
      {
        type: 'graph_edit',
        description: 'Added/modified nodes based on your request',
      },
    ],
  }
}

function updateWidget() {
  props.widget.value = {
    messages: messages.value,
    provider: selectedProvider.value,
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

onMounted(() => {
  // Load existing messages from widget if available
  if (props.widget.value?.messages) {
    messages.value = props.widget.value.messages
  }
  if (props.widget.value?.provider) {
    selectedProvider.value = props.widget.value.provider
  }
  scrollToBottom()
})

watch(selectedProvider, () => {
  updateWidget()
})
</script>

<style scoped>
.agent-chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #1e1e1e;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #2d2d2d;
  border-bottom: 1px solid #3d3d3d;
}

.chat-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.provider-selector {
  display: flex;
  align-items: center;
  gap: 8px;
}

.provider-dropdown {
  width: 150px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.message.assistant .message-avatar {
  background: #4a90e2;
}

.message.user .message-avatar {
  background: #5cb85c;
}

.message-content {
  flex: 1;
  max-width: 80%;
}

.message.assistant .message-content {
  background: #2d2d2d;
  border-radius: 8px 8px 8px 0;
  padding: 12px;
}

.message.user .message-content {
  background: #4a90e2;
  border-radius: 8px 8px 0 8px;
  padding: 12px;
}

.message-text {
  white-space: pre-wrap;
  word-wrap: break-word;
}

.message-operations {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.operation {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #888;
}

.chat-input {
  padding: 12px 16px;
  background: #2d2d2d;
  border-top: 1px solid #3d3d3d;
  display: flex;
  gap: 8px;
}

.chat-input :deep(.p-textarea) {
  flex: 1;
  background: #1e1e1e;
  border: 1px solid #3d3d3d;
  color: #ffffff;
}

.chat-input :deep(.p-textarea:focus) {
  border-color: #4a90e2;
}
</style>
