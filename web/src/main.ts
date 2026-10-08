import { createApp, type App as VueApp } from 'vue'
import PrimeVue from 'primevue/config'
import { createI18n } from 'vue-i18n'
import AgentChatPanel from '@/components/AgentChatPanel.vue'
import en from '../locales/en/main.json'
import zh from '../locales/zh/main.json'

// @ts-ignore - ComfyUI external module
import { app } from '../../../../scripts/app.js'

const vueApps = new Map<number, VueApp>()

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: { en, zh }
})

// @ts-ignore
function createAgentWidget(node: any) {
  const container = document.createElement('div')
  container.id = `agent-chat-widget-${node.id}`
  container.style.width = '100%'
  container.style.height = '100%'
  container.style.minHeight = '500px'
  container.style.display = 'flex'
  container.style.flexDirection = 'column'
  container.style.overflow = 'hidden'

  const widget = node.addDOMWidget(
    'agent_chat',
    'agent-chat',
    container,
    {
      getMinHeight: () => 520,
      hideOnZoom: false,
      serialize: true
    }
  )

  const vueApp = createApp(AgentChatPanel, {
    widget,
    node
  })

  vueApp.use(i18n)
  vueApp.use(PrimeVue)

  vueApp.mount(container)
  vueApps.set(node.id, vueApp)

  widget.onRemove = () => {
    const vueApp = vueApps.get(node.id)
    if (vueApp) {
      vueApp.unmount()
      vueApps.delete(node.id)
    }
  }

  return { widget }
}

app.registerExtension({
  name: 'comfy-open-agent',

  settings: [
    {
      id: 'Comfy.OpenAgent.LLMProvider',
      category: ['Agent', 'OpenAgent', 'LLM'],
      name: 'LLM Provider',
      tooltip: 'Select the LLM provider to use',
      type: 'combo',
      options: ['local', 'openai', 'anthropic'],
      defaultValue: 'local'
    },
    {
      id: 'Comfy.OpenAgent.ModelName',
      category: ['Agent', 'OpenAgent', 'LLM'],
      name: 'Model Name',
      tooltip: 'Model name to use',
      type: 'string',
      defaultValue: 'llama3.2'
    },
    {
      id: 'Comfy.OpenAgent.APIEndpoint',
      category: ['Agent', 'OpenAgent', 'LLM'],
      name: 'API Endpoint',
      tooltip: 'API endpoint URL for LLM provider',
      type: 'string',
      defaultValue: 'http://localhost:11434/api/chat'
    },
    {
      id: 'Comfy.OpenAgent.APIKey',
      category: ['Agent', 'OpenAgent', 'LLM'],
      name: 'API Key',
      tooltip: 'API key for cloud providers (leave empty for local)',
      type: 'string',
      defaultValue: ''
    },
    {
      id: 'Comfy.OpenAgent.EnableMCP',
      category: ['Agent', 'OpenAgent', 'MCP'],
      name: 'Enable MCP Server',
      tooltip: 'Enable MCP server for external agent integration',
      type: 'boolean',
      defaultValue: false
    }
  ],

  getCustomWidgets() {
    return {
      // @ts-ignore
      AGENT_CHAT(node: any) {
        return createAgentWidget(node)
      }
    }
  },

  // @ts-ignore
  nodeCreated(node: any) {
    if (node.constructor?.comfyClass !== 'OpenAgent') return

    const [oldWidth, oldHeight] = node.size
    node.setSize([Math.max(oldWidth, 400), Math.max(oldHeight, 600)])
  }
})
