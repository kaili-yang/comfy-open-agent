// Minimal typings for the parts of the ComfyUI frontend this extension uses.
// The real modules are served by ComfyUI at /scripts/app.js and /scripts/api.js.

export type NodeId = number | string

export interface WidgetOptions {
  values?: unknown
  min?: number
  max?: number
}

export interface Widget {
  name: string
  type?: string
  value: unknown
  options?: WidgetOptions
  callback?: (value: unknown, canvas?: unknown, node?: GraphNode) => void
}

export interface InputSlot {
  name: string
  type: string | number
  link: number | null
  widget?: { name: string }
}

export interface OutputSlot {
  name: string
  type: string | number
  links: number[] | null
}

export interface GraphNode {
  id: NodeId
  type: string
  title: string
  mode: number
  pos: [number, number] | Float32Array
  size: [number, number] | Float32Array
  inputs: InputSlot[]
  outputs: OutputSlot[]
  widgets?: Widget[]
  getInputLink?(slot: number): GraphLink | null
  getOutputNodes?(slot: number): GraphNode[] | null
  connect(slot: number | string, target: GraphNode, targetSlot: number | string): unknown | null
  disconnectInput(slot: number | string): boolean
}

export interface GraphLink {
  origin_id: NodeId
  origin_slot: number
  target_id: NodeId
  target_slot: number
}

export interface Graph {
  nodes: GraphNode[]
  getNodeById(id: NodeId): GraphNode | null
  getLink?(id: number): GraphLink | undefined
  links: Map<number, GraphLink> | Record<number, GraphLink>
  add(node: GraphNode): unknown
  remove(node: GraphNode): void
  setDirtyCanvas(fg: boolean, bg?: boolean): void
}

export interface SettingParams {
  id: string
  name: string
  type: 'boolean' | 'number' | 'combo' | 'text' | 'hidden'
  defaultValue: unknown
  tooltip?: string
  options?: string[]
  category?: string[]
  attrs?: Record<string, unknown>
}

export interface SidebarTab {
  id: string
  title: string
  icon?: string
  tooltip?: string
  type: 'custom'
  render: (container: HTMLElement) => void
  destroy?: () => void
}

export interface ComfyExtension {
  name: string
  settings?: SettingParams[]
  setup?: () => void | Promise<void>
}

export interface ComfyApp {
  graph: Graph
  rootGraph?: Graph
  extensionManager: {
    registerSidebarTab(tab: SidebarTab): void
    setting: { get(id: string): unknown }
  }
  registerExtension(extension: ComfyExtension): void
  graphToPrompt(): Promise<{ output: Record<string, unknown>; workflow: unknown }>
  loadApiJson(apiData: Record<string, unknown>, fileName: string): Promise<void>
}

export interface PromptResponse {
  prompt_id?: string
  number?: number
  node_errors?: Record<string, unknown>
}

export interface ComfyApi extends EventTarget {
  clientId?: string
  apiURL(route: string): string
  fetchApi(route: string, options?: RequestInit): Promise<Response>
  queuePrompt(
    number: number,
    data: { output: Record<string, unknown>; workflow: unknown }
  ): Promise<PromptResponse>
}
