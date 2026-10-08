declare global {
  interface Window {
    LiteGraph?: {
      createNode(type: string): import('../scripts/comfy-types').GraphNode | null
      registered_node_types: Record<string, unknown>
    }
  }
}

export {}
