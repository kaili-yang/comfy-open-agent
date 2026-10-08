const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => ESCAPES[c])
}

function renderInline(text: string): string {
  return escapeHtml(text)
    .replace(/`([^`\n]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
}

/** Render the small markdown subset LLMs use most. All input is HTML-escaped first. */
export function renderMarkdown(text: string): string {
  return text
    .split(/```[^\n]*\n?/)
    .map((part, i) =>
      i % 2 === 1
        ? `<pre><code>${escapeHtml(part.replace(/\n$/, ''))}</code></pre>`
        : renderInline(part)
    )
    .join('')
}
