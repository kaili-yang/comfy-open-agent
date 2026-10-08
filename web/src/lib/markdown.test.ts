import { describe, expect, it } from 'vitest'

import { renderMarkdown } from './markdown'
import { parseNdjson } from './ndjson'

describe('renderMarkdown', () => {
  it('escapes HTML before formatting', () => {
    expect(renderMarkdown('<img onerror=x> **bold** `a<b`')).toBe(
      '&lt;img onerror=x&gt; <strong>bold</strong> <code>a&lt;b</code>'
    )
  })

  it('renders fenced code blocks verbatim', () => {
    expect(renderMarkdown('see:\n```json\n{"a": **1**}\n```\nend')).toBe(
      'see:\n<pre><code>{&quot;a&quot;: **1**}</code></pre>end'
    )
  })
})

describe('parseNdjson', () => {
  it('handles lines split across chunks', async () => {
    const encoder = new TextEncoder()
    const chunks = ['{"a":1}\n{"b"', ':2}\n', '{"c":3}']
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const c of chunks) controller.enqueue(encoder.encode(c))
        controller.close()
      }
    })
    const out: unknown[] = []
    for await (const item of parseNdjson(stream)) out.push(item)
    expect(out).toEqual([{ a: 1 }, { b: 2 }, { c: 3 }])
  })
})
