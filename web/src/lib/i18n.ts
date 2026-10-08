import en from '../locales/en/main.json'
import zh from '../locales/zh/main.json'
import { app } from './comfy'

export type MessageKey = keyof typeof en
const catalogs: Record<string, Record<MessageKey, string>> = { en, zh }

function locale(): string {
  const configured = app.extensionManager?.setting.get('Comfy.Locale')
  const value = typeof configured === 'string' ? configured : navigator.language
  return value.toLowerCase().startsWith('zh') ? 'zh' : 'en'
}

export function t(key: MessageKey, params: Record<string, string> = {}): string {
  const template = catalogs[locale()][key] ?? en[key]
  return template.replace(/\{(\w+)\}/g, (_, name: string) => params[name] ?? '')
}
