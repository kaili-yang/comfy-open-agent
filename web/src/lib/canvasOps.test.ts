import { describe, expect, it } from 'vitest'

import type { CanvasEnv } from './canvasOps'
import { CanvasOpError, runCanvasOp } from './canvasOps'
import type { Graph, GraphLink, GraphNode, Widget } from './comfy'

interface NodeSpec {
  inputs?: [string, string][]
  outputs?: [string, string][]
  widgets?: Partial<Widget>[]
}

const NODE_TYPES: Record<string, NodeSpec> = {
  CheckpointLoaderSimple: {
    outputs: [['MODEL', 'MODEL'], ['CLIP', 'CLIP'], ['VAE', 'VAE']],
    widgets: [{ name: 'ckpt_name', value: 'a.safetensors', options: { values: ['a.safetensors', 'b.safetensors'] } }]
  },
  KSampler: {
    inputs: [['model', 'MODEL'], ['positive', 'CONDITIONING']],
    outputs: [['LATENT', 'LATENT']],
    widgets: [{ name: 'seed', value: 0 }, { name: 'steps', value: 20 }]
  }
}

function makeEnv() {
  const nodes: GraphNode[] = []
  const links = new Map<number, GraphLink>()
  let nextId = 1
  let nextLink = 1

  const graph: Graph = {
    nodes,
    links,
    getNodeById: (id) => nodes.find((n) => n.id === id) ?? null,
    add: (node) => {
      node.id = nextId++
      nodes.push(node)
    },
    remove: (node) => {
      nodes.splice(nodes.indexOf(node), 1)
    },
    setDirtyCanvas: () => undefined
  }

  function createNode(type: string): GraphNode | null {
    const spec = NODE_TYPES[type]
    if (!spec) return null
    const node: GraphNode = {
      id: -1,
      type,
      title: type,
      mode: 0,
      pos: [0, 0],
      size: [200, 100],
      inputs: (spec.inputs ?? []).map(([name, t]) => ({ name, type: t, link: null })),
      outputs: (spec.outputs ?? []).map(([name, t]) => ({ name, type: t, links: [] })),
      widgets: (spec.widgets ?? []).map((w) => ({ name: w.name!, value: w.value, options: w.options })),
      connect(slot, target, targetSlot) {
        const out = this.outputs[Number(slot)]
        const input = target.inputs[Number(targetSlot)]
        if (out.type !== input.type) return null
        const id = nextLink++
        links.set(id, { origin_id: this.id, origin_slot: Number(slot), target_id: target.id, target_slot: Number(targetSlot) })
        input.link = id
        out.links = [...(out.links ?? []), id]
        return { id }
      },
      disconnectInput(slot) {
        const input = this.inputs[Number(slot)]
        const had = input.link != null
        if (had) links.delete(input.link!)
        input.link = null
        return had
      }
    }
    return node
  }

  const loaded: Record<string, unknown>[] = []
  const env: CanvasEnv = {
    graph: () => graph,
    createNode,
    hasNodeType: (type) => type in NODE_TYPES,
    loadApiJson: async (wf) => {
      loaded.push(wf)
    },
    queue: async () => ({ queued: true, prompt_id: 'p1' })
  }
  return { env, graph, loaded }
}

describe('canvas operations', () => {
  it('adds nodes to the right of existing ones and applies widgets', async () => {
    const { env } = makeEnv()
    const first = (await runCanvasOp(env, 'add_node', { node_type: 'CheckpointLoaderSimple' })) as { node_id: number }
    const second = (await runCanvasOp(env, 'add_node', {
      node_type: 'KSampler',
      widgets: { steps: 30, cfg: 7 }
    })) as { node_id: number; widget_errors: string[] }

    expect(first.node_id).toBe(1)
    expect(second.widget_errors).toEqual(["no widget 'cfg' (widgets: seed, steps)"])
    const canvas = (await runCanvasOp(env, 'get_canvas', {})) as { nodes: { pos: number[]; widgets: Record<string, unknown> }[] }
    expect(canvas.nodes[1].pos).toEqual([360, 100])
    expect(canvas.nodes[1].widgets.steps).toBe(30)
  })

  it('connects by slot name, type or index and reports links in get_canvas', async () => {
    const { env } = makeEnv()
    await runCanvasOp(env, 'add_node', { node_type: 'CheckpointLoaderSimple' })
    await runCanvasOp(env, 'add_node', { node_type: 'KSampler' })

    await runCanvasOp(env, 'connect', { from_node: '1', from_output: 'model', to_node: 2, to_input: '0' })
    const canvas = (await runCanvasOp(env, 'get_canvas', {})) as {
      nodes: { inputs: { name: string; from?: unknown }[] }[]
    }
    expect(canvas.nodes[1].inputs[0].from).toEqual({ node: 1, output: 0 })

    await expect(
      runCanvasOp(env, 'connect', { from_node: 1, from_output: 'CLIP', to_node: 2, to_input: 'model' })
    ).rejects.toThrow(/incompatible types/)
    await expect(
      runCanvasOp(env, 'connect', { from_node: 1, from_output: 'nope', to_node: 2, to_input: 'model' })
    ).rejects.toThrow(/outputs: 0:MODEL\(MODEL\)/)
  })

  it('rejects combo values that are not options', async () => {
    const { env } = makeEnv()
    await runCanvasOp(env, 'add_node', { node_type: 'CheckpointLoaderSimple' })
    await expect(
      runCanvasOp(env, 'set_widgets', { node_id: 1, values: { ckpt_name: 'c.safetensors' } })
    ).rejects.toThrow(/not an option/)
    expect(await runCanvasOp(env, 'set_widgets', { node_id: 1, values: { ckpt_name: 'b.safetensors' } })).toEqual({
      applied: ['ckpt_name']
    })
  })

  it('validates node types before loading a workflow', async () => {
    const { env, loaded } = makeEnv()
    await expect(
      runCanvasOp(env, 'load_workflow', { workflow: { '1': { class_type: 'Nope', inputs: {} } } })
    ).rejects.toBeInstanceOf(CanvasOpError)
    expect(loaded).toEqual([])
    await runCanvasOp(env, 'load_workflow', { workflow: { '1': { class_type: 'KSampler', inputs: {} } } })
    expect(loaded).toHaveLength(1)
  })

  it('removes and disconnects', async () => {
    const { env, graph } = makeEnv()
    await runCanvasOp(env, 'add_node', { node_type: 'CheckpointLoaderSimple' })
    await runCanvasOp(env, 'add_node', { node_type: 'KSampler' })
    await runCanvasOp(env, 'connect', { from_node: 1, from_output: 0, to_node: 2, to_input: 'model' })
    expect(await runCanvasOp(env, 'disconnect', { node_id: 2, input: 'model' })).toEqual({
      disconnected: true,
      input: 'model'
    })
    await runCanvasOp(env, 'remove_node', { node_id: '1' })
    expect(graph.nodes.map((n) => n.id)).toEqual([2])
    await expect(runCanvasOp(env, 'remove_node', { node_id: 1 })).rejects.toThrow(/not found/)
  })

  it('refuses to queue an empty canvas', async () => {
    const { env } = makeEnv()
    await expect(runCanvasOp(env, 'queue_workflow', {})).rejects.toThrow(/empty/)
  })
})
