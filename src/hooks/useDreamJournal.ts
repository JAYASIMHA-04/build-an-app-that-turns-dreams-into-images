import { useCallback, useEffect, useState } from 'react'
import { DreamEntry, loadJournal, saveJournal } from '../lib/storage'

export function useDreamJournal() {
  const [entries, setEntries] = useState<DreamEntry[]>([])

  useEffect(() => {
    setEntries(loadJournal())
  }, [])

  const add = useCallback((entry: DreamEntry) => {
    setEntries((prev) => {
      if (prev.some((e) => e.id === entry.id)) return prev
      const next = [entry, ...prev]
      saveJournal(next)
      return next
    })
  }, [])

  const remove = useCallback((id: string) => {
    setEntries((prev) => {
      const next = prev.filter((e) => e.id !== id)
      saveJournal(next)
      return next
    })
  }, [])

  const clear = useCallback(() => {
    setEntries([])
    saveJournal([])
  }, [])

  return { entries, add, remove, clear }
}
