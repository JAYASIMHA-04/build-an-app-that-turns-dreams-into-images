import type { DreamSettings } from './lib/pollinations'

export type GenerationStatus = 'loading' | 'done' | 'error'

export interface Generation extends DreamSettings {
  id: string
  dreamText: string
  prompt: string
  url: string
  seed: number
  status: GenerationStatus
}
