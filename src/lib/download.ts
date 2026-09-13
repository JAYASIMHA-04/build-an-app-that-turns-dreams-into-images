/**
 * Download an image. Tries to fetch the bytes (Pollinations sends permissive
 * CORS headers) so we can trigger a real file download; if the network blocks
 * that, we gracefully fall back to opening the image in a new tab.
 */
export async function downloadImage(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    triggerDownload(objectUrl, filename)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 4000)
  } catch {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

function triggerDownload(href: string, filename: string): void {
  const a = document.createElement('a')
  a.href = href
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
}

export function slugify(text: string, max = 48): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
  return slug || 'dream'
}
