export interface DreamEntry {
  id: string
  dreamText: string
  prompt: string
  url: string
  seed: number
  styleId: string
  moodId: string
  aspectId: string
  createdAt: number
}

const STORAGE_KEY = 'dreamweaver.journal.v1'

export function loadJournal(): DreamEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as DreamEntry[]
  } catch {
    return []
  }
}

export function saveJournal(entries: DreamEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    /* storage may be unavailable (private mode) — fail silently */
  }
}
