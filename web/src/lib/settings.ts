import type { SettingParams } from './comfy'
import { app } from './comfy'

export const SETTING_IDS = {
  provider: 'OpenAgent.Provider',
  model: 'OpenAgent.Model',
  baseUrl: 'OpenAgent.BaseURL',
  apiKey: 'OpenAgent.APIKey',
  maxSteps: 'OpenAgent.MaxSteps'
} as const

export const PROVIDERS = ['local', 'openai', 'anthropic'] as const
export type Provider = (typeof PROVIDERS)[number]

const CATEGORY = 'Open Agent'

export const settingDefinitions: SettingParams[] = [
  {
    id: SETTING_IDS.provider,
    category: [CATEGORY, 'Model', 'Provider'],
    name: 'LLM provider',
    tooltip:
      'local = any OpenAI-compatible server (Ollama, LM Studio, vLLM...), openai = OpenAI API, anthropic = Claude API',
    type: 'combo',
    options: [...PROVIDERS],
    defaultValue: 'local'
  },
  {
    id: SETTING_IDS.model,
    category: [CATEGORY, 'Model', 'Model'],
    name: 'Model name',
    tooltip:
      'Leave empty for the provider default (local: qwen3, openai: gpt-5, anthropic: claude-opus-5-5). Local models must support tool calling.',
    type: 'text',
    defaultValue: ''
  },
  {
    id: SETTING_IDS.baseUrl,
    category: [CATEGORY, 'Model', 'Base URL'],
    name: 'API base URL',
    tooltip:
      'Leave empty for the provider default (local: http://localhost:11434/v1).',
    type: 'text',
    defaultValue: ''
  },
  {
    id: SETTING_IDS.apiKey,
    category: [CATEGORY, 'Model', 'API key'],
    name: 'API key',
    tooltip:
      'Not needed for local servers. If empty, the ComfyUI server falls back to OPENAI_API_KEY / ANTHROPIC_API_KEY.',
    type: 'text',
    defaultValue: '',
    attrs: { type: 'password' }
  },
  {
    id: SETTING_IDS.maxSteps,
    category: [CATEGORY, 'Agent', 'Max steps'],
    name: 'Max tool steps per message',
    type: 'number',
    defaultValue: 30,
    attrs: { min: 1, max: 100, step: 1 }
  }
]

function read<T>(id: string, fallback: T): T {
  const value = app.extensionManager.setting.get(id)
  return value === undefined || value === null ? fallback : (value as T)
}

export function readAgentSettings() {
  return {
    provider: read<string>(SETTING_IDS.provider, 'local'),
    model: read<string>(SETTING_IDS.model, ''),
    base_url: read<string>(SETTING_IDS.baseUrl, ''),
    api_key: read<string>(SETTING_IDS.apiKey, ''),
    max_steps: Number(read<number>(SETTING_IDS.maxSteps, 30)) || 30
  }
}
