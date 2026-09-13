import { useEffect } from 'react'
import { MOODS, STYLES } from '../lib/styles'
import { CloseIcon, DownloadIcon } from './icons'

export interface LightboxData {
  url: string
  dreamText: string
  prompt: string
  styleId: string
  moodId: string
  seed: number
}

interface Props {
  data: LightboxData | null
  onClose: () => void
  onDownload: (data: LightboxData) => void
}

export default function Lightbox({ data, onClose, onDownload }: Props) {
  useEffect(() => {
    if (!data) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [data, onClose])

  if (!data) return null

  const style = STYLES.find((s) => s.id === data.styleId)
  const mood = MOODS.find((m) => m.id === data.moodId)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
      >
        <CloseIcon className="h-5 w-5" />
      </button>

      <div
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl md:flex-row md:bg-white/5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-1 items-center justify-center bg-black/40">
          <img
            src={data.url}
            alt={data.dreamText}
            className="max-h-[60vh] w-full object-contain md:max-h-[92vh]"
          />
        </div>

        <div className="flex w-full flex-col gap-4 p-6 md:w-80 md:shrink-0">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-dream-300/60">
              The dream
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-dream-50">
              “{data.dreamText}”
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {style && (
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-dream-200/80">
                {style.icon} {style.label}
              </span>
            )}
            {mood && (
              <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-dream-200/80">
                {mood.icon} {mood.label}
              </span>
            )}
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-dream-300/50">
              seed {data.seed}
            </span>
          </div>

          <button
            onClick={() => onDownload(data)}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-dream-600 to-fuchsia-600 px-4 py-3 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <DownloadIcon className="h-4 w-4" /> Download image
          </button>
        </div>
      </div>
    </div>
  )
}
