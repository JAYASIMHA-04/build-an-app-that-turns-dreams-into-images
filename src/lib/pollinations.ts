import { ASPECTS, MOODS, STYLES } from './styles'

export interface DreamSettings {
  styleId: string
  moodId: string
  aspectId: string
}

export interface GenerationParams extends DreamSettings {
  dreamText: string
  seed: number
}

/** Base quality modifiers appended to every dream for a rich, cohesive look. */
const BASE_MODIFIERS =
  'dreamlike, highly detailed, atmospheric depth, cohesive composition, masterpiece, trending on artstation'

export function buildPrompt(params: {
  dreamText: string
  styleId: string
  moodId: string
}): string {
  const style = STYLES.find((s) => s.id === params.styleId)
  const mood = MOODS.find((m) => m.id === params.moodId)

  const parts = [
    params.dreamText.trim(),
    style?.modifiers,
    mood?.modifiers,
    BASE_MODIFIERS,
  ].filter(Boolean)

  return parts.join(', ')
}

/**
 * Build a Pollinations.ai image URL. Pollinations is a free, no-API-key,
 * CORS-friendly text-to-image endpoint that works directly from the browser,
 * so the app is fully functional standalone with zero configuration.
 */
export function buildImageUrl(params: GenerationParams): string {
  const aspect = ASPECTS.find((a) => a.id === params.aspectId) ?? ASPECTS[0]
  const prompt = buildPrompt(params)

  const url = new URL(
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`,
  )
  url.searchParams.set('width', String(aspect.width))
  url.searchParams.set('height', String(aspect.height))
  url.searchParams.set('seed', String(params.seed))
  url.searchParams.set('model', 'flux')
  url.searchParams.set('nologo', 'true')
  url.searchParams.set('enhance', 'true')
  return url.toString()
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 1_000_000_000)
}
