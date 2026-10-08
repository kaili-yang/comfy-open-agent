import type { App as VueApp } from 'vue'
import { createApp } from 'vue'

import AgentChatPanel from '@/components/AgentChatPanel.vue'
import { setupBridge } from '@/lib/bridge'
import { app } from '@/lib/comfy'
import { t } from '@/lib/i18n'
import { settingDefinitions } from '@/lib/settings'

let panel: VueApp | null = null

app.registerExtension({
  name: 'comfy-open-agent',
  settings: settingDefinitions,

  setup() {
    setupBridge()

    app.extensionManager.registerSidebarTab({
      id: 'comfy-open-agent',
      title: t('title'),
      icon: 'pi pi-comments',
      tooltip: t('tooltip'),
      type: 'custom',
      render(container) {
        panel?.unmount()
        Object.assign(container.style, {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        })
        panel = createApp(AgentChatPanel)
        panel.mount(container)
      },
      destroy() {
        panel?.unmount()
        panel = null
      }
    })
  }
})
