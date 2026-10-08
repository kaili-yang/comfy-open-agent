import type {
  Graph,
  GraphLink,
  GraphNode,
  InputSlot,
  NodeId,
  OutputSlot
} from './comfy'

export interface CanvasEnv {
  graph(): Graph
  createNode(type: string): GraphNode | null
  hasNodeType(type: string): boolean
  loadApiJson(workflow: Record<string, unknown>): Promise<void>
  queue(): Promise<QueueResult>
}

export interface QueueResult {
  queued: boolean
  prompt_id?: string
  number?: number
  error?: string
  node_errors?: Record<string, unknown>
}

export type ToolArgs = Record<string, unknown>
type Op = (env: CanvasEnv, args: ToolArgs) => unknown | Promise<unknown>

const MAX_WIDGET_STRING = 500
const NODE_GAP = 60
const MODE_NAMES: Record<number, string> = { 2: 'muted', 4: 'bypassed' }

export class CanvasOpError extends Error {}

function fail(message: string): never {
  throw new CanvasOpError(message)
}

function asRecord(value: unknown, name: string): Record<string, unknown> {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    fail(`${name} must be an object`)
  }
  return value as Record<string, unknown>
}

function parseNodeId(value: unknown): NodeId {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && value.trim() !== '') {
    const trimmed = value.trim()
    return /^\d+$/.test(trimmed) ? Number(trimmed) : trimmed
  }
  fail('node id is required')
}

function getNode(graph: Graph, id: unknown): GraphNode {
  const nodeId = parseNodeId(id)
  const node = graph.getNodeById(nodeId)
  if (!node) fail(`Node ${String(nodeId)} not found. Call get_canvas for current ids.`)
  return node
}

function getLink(graph: Graph, id: number): GraphLink | undefined {
  if (graph.getLink) return graph.getLink(id)
  const links = graph.links
  return links instanceof Map ? links.get(id) : links[id]
}

// Newer frontends deprecate reading input.link / output.links directly
function inputLink(graph: Graph, node: GraphNode, index: number) {
  if (node.getInputLink) return node.getInputLink(index)
  const id = node.inputs[index].link
  return id == null ? undefined : getLink(graph, id)
}

function outputLinkCount(node: GraphNode, index: number): number {
  if (node.getOutputNodes) return node.getOutputNodes(index)?.length ?? 0
  return node.outputs[index].links?.length ?? 0
}

function slotIndex(
  slots: readonly (InputSlot | OutputSlot)[],
  slot: unknown,
  kind: 'input' | 'output',
  node: GraphNode
): number {
  const text = String(slot ?? '').trim()
  const available = () =>
    slots.map((s, i) => `${i}:${s.name}(${String(s.type)})`).join(', ') ||
    'none'
  if (/^\d+$/.test(text)) {
    const index = Number(text)
    if (index < slots.length) return index
    fail(`${node.type} #${node.id} has no ${kind} ${index}. ${kind}s: ${available()}`)
  }
  const byName = slots.findIndex((s) => s.name === text)
  if (byName !== -1) return byName
  const lower = text.toLowerCase()
  const loose = slots.findIndex(
    (s) =>
      s.name.toLowerCase() === lower || String(s.type).toLowerCase() === lower
  )
  if (loose !== -1) return loose
  fail(`${node.type} #${node.id} has no ${kind} '${text}'. ${kind}s: ${available()}`)
}

function round(value: number): number {
  return Math.round(value)
}

function widgetValue(value: unknown): unknown {
  if (typeof value === 'string' && value.length > MAX_WIDGET_STRING) {
    return `${value.slice(0, MAX_WIDGET_STRING)}… (${value.length} chars)`
  }
  return value
}

function describeNode(graph: Graph, node: GraphNode) {
  const widgets: Record<string, unknown> = {}
  for (const w of node.widgets ?? []) {
    if (!w.name || w.type === 'button' || w.value === undefined) continue
    if (typeof w.value === 'object' && w.value !== null) continue
    widgets[w.name] = widgetValue(w.value)
  }

  const inputs = node.inputs.map((input, index) => {
    const entry: Record<string, unknown> = {
      name: input.name,
      type: input.type
    }
    const link = inputLink(graph, node, index)
    if (link) entry.from = { node: link.origin_id, output: link.origin_slot }
    return entry
  })

  const description: Record<string, unknown> = {
    id: node.id,
    type: node.type,
    pos: [round(node.pos[0]), round(node.pos[1])],
    inputs,
    outputs: node.outputs.map((o, index) => ({
      index,
      name: o.name,
      type: o.type,
      links: outputLinkCount(node, index)
    })),
    widgets
  }
  if (node.title && node.title !== node.type) description.title = node.title
  if (MODE_NAMES[node.mode]) description.mode = MODE_NAMES[node.mode]
  return description
}

function nextFreePosition(graph: Graph): [number, number] {
  if (graph.nodes.length === 0) return [100, 100]
  let right = -Infinity
  let top = Infinity
  for (const node of graph.nodes) {
    right = Math.max(right, node.pos[0] + node.size[0])
    top = Math.min(top, node.pos[1])
  }
  return [round(right + NODE_GAP), round(top)]
}

function applyWidgets(node: GraphNode, values: Record<string, unknown>) {
  const applied: string[] = []
  const errors: string[] = []
  for (const [name, value] of Object.entries(values)) {
    const widget = node.widgets?.find((w) => w.name === name)
    if (!widget) {
      const names = node.widgets?.map((w) => w.name).join(', ') || 'none'
      errors.push(`no widget '${name}' (widgets: ${names})`)
      continue
    }
    const options = widget.options?.values
    if (Array.isArray(options) && !options.includes(value)) {
      const preview = options.slice(0, 15).map(String).join(', ')
      errors.push(
        `'${String(value)}' is not an option for ${name}. Options: ${preview}${options.length > 15 ? ', …' : ''}`
      )
      continue
    }
    widget.value = value
    widget.callback?.(value, undefined, node)
    applied.push(name)
  }
  return { applied, errors }
}

function markDirty(graph: Graph) {
  graph.setDirtyCanvas(true, true)
}

export const canvasOps: Record<string, Op> = {
  get_canvas(env) {
    const graph = env.graph()
    return {
      node_count: graph.nodes.length,
      nodes: graph.nodes.map((node) => describeNode(graph, node))
    }
  },

  async load_workflow(env, args) {
    const workflow = asRecord(args.workflow, 'workflow')
    const entries = Object.entries(workflow)
    if (entries.length === 0) fail('workflow is empty')
    for (const [id, node] of entries) {
      const classType = asRecord(node, `node ${id}`).class_type
      if (typeof classType !== 'string') fail(`node ${id} has no class_type`)
      if (!env.hasNodeType(classType)) {
        fail(`node ${id}: unknown node type '${classType}'. Use search_nodes.`)
      }
    }
    await env.loadApiJson(workflow)
    const graph = env.graph()
    return {
      loaded: graph.nodes.length,
      nodes: graph.nodes.map((n) => ({ id: n.id, type: n.type }))
    }
  },

  add_node(env, args) {
    const type = String(args.node_type ?? '')
    if (!type) fail('node_type is required')
    const graph = env.graph()
    const node = env.createNode(type)
    if (!node) fail(`Unknown node type '${type}'. Use search_nodes.`)

    const pos = Array.isArray(args.pos) && args.pos.length === 2
      ? [Number(args.pos[0]), Number(args.pos[1])]
      : nextFreePosition(graph)
    node.pos[0] = pos[0]
    node.pos[1] = pos[1]
    if (typeof args.title === 'string' && args.title) node.title = args.title
    graph.add(node)

    const result: Record<string, unknown> = {
      node_id: node.id,
      inputs: node.inputs.map((i) => `${i.name} (${String(i.type)})`),
      outputs: node.outputs.map((o, i) => `${i}:${o.name} (${String(o.type)})`),
      widgets: node.widgets?.map((w) => w.name) ?? []
    }
    if (args.widgets) {
      const { errors } = applyWidgets(node, asRecord(args.widgets, 'widgets'))
      if (errors.length) result.widget_errors = errors
    }
    markDirty(graph)
    return result
  },

  remove_node(env, args) {
    const graph = env.graph()
    const node = getNode(graph, args.node_id)
    graph.remove(node)
    markDirty(graph)
    return { removed: node.id }
  },

  connect(env, args) {
    const graph = env.graph()
    const from = getNode(graph, args.from_node)
    const to = getNode(graph, args.to_node)
    const out = slotIndex(from.outputs, args.from_output, 'output', from)
    const input = slotIndex(to.inputs, args.to_input, 'input', to)
    const link = from.connect(out, to, input)
    if (!link) {
      fail(
        `Cannot connect ${from.type}.${from.outputs[out].name} (${String(from.outputs[out].type)}) ` +
          `to ${to.type}.${to.inputs[input].name} (${String(to.inputs[input].type)}): incompatible types`
      )
    }
    markDirty(graph)
    return {
      connected: `${from.id}:${from.outputs[out].name} -> ${to.id}:${to.inputs[input].name}`
    }
  },

  disconnect(env, args) {
    const graph = env.graph()
    const node = getNode(graph, args.node_id)
    const index = slotIndex(node.inputs, args.input, 'input', node)
    const removed = node.disconnectInput(index)
    markDirty(graph)
    return { disconnected: removed, input: node.inputs[index].name }
  },

  set_widgets(env, args) {
    const graph = env.graph()
    const node = getNode(graph, args.node_id)
    const { applied, errors } = applyWidgets(node, asRecord(args.values, 'values'))
    markDirty(graph)
    if (applied.length === 0 && errors.length) fail(errors.join('; '))
    return errors.length ? { applied, errors } : { applied }
  },

  async queue_workflow(env) {
    if (env.graph().nodes.length === 0) fail('The canvas is empty')
    return env.queue()
  }
}

export async function runCanvasOp(
  env: CanvasEnv,
  op: string,
  args: ToolArgs
): Promise<unknown> {
  const handler = canvasOps[op]
  if (!handler) fail(`Unknown canvas operation '${op}'`)
  return handler(env, args ?? {})
}
