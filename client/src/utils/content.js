const ORDERED_LINE = /^\s*(\d+)[.)]\s+/
const UNORDERED_LINE = /^\s*[-*]\s+/
const HEADING_LINE = /^##\s+(.+)$/

export function parseArticleBlocks(text) {
  const blocks = []
  const rawBlocks = String(text || '').split(/\n{2,}/)

  for (const raw of rawBlocks) {
    const lines = raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)

    if (lines.length === 0) continue

    const headingMatch = HEADING_LINE.exec(lines[0])
    if (headingMatch && lines.length === 1) {
      blocks.push({ type: 'heading', text: headingMatch[1] })
      continue
    }

    if (lines.every((line) => ORDERED_LINE.test(line))) {
      blocks.push({
        type: 'ordered',
        items: lines.map((line) => line.replace(ORDERED_LINE, '')),
      })
      continue
    }

    if (lines.every((line) => UNORDERED_LINE.test(line))) {
      blocks.push({
        type: 'list',
        items: lines.map((line) => line.replace(UNORDERED_LINE, '')),
      })
      continue
    }

    blocks.push({ type: 'paragraph', text: lines.join(' ') })
  }

  return blocks
}

export function extractHeadings(blocks) {
  return blocks.filter((block) => block.type === 'heading')
}
