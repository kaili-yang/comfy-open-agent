export async function* parseNdjson<T>(
  stream: ReadableStream<Uint8Array>
): AsyncGenerator<T> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { value, done } = await reader.read()
    buffer += decoder.decode(value, { stream: !done })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (line.trim()) yield JSON.parse(line) as T
    }
    if (done) break
  }
  if (buffer.trim()) yield JSON.parse(buffer) as T
}
