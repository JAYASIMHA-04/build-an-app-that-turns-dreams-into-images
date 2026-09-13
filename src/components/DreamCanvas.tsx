import { useEffect, useState } from 'react'
import { ASPECTS, MOODS, STYLES } from '../lib/styles'
import type { Generation } from '../types'
import {
  AlertIcon,
  CheckIcon,
  CopyIcon,
  DownloadIcon,
  ExpandIcon,
  RefreshIcon,
  SparklesIcon,
} from './icons'

interface Props {
  generation: Generation | null
  isSaved: boolean
  onImageLoaded: () => void
  onImageError: () => void
  onRegenerate: () => void
  onSave: () => void
  onDownload: () => void
  onExpand: () => void
  onCopyPrompt: () => void
}

const loadingLines = [
  'Gathering stardust…',
  'Untangling the threads of sleep…',
  'Painting with moonlight…',
  'Coaxing shapes from the mist…',
  'Listening to the subconscious…',
  'Folding light into form…',
]

export default function DreamCanvas({
  generation,
  isSaved,
  onImageLoaded,
  onImageError,
  onRegenerate,
  onSave,
  onDownload,
  onExpand,
  onCopyPrompt,
}: Props) {
  const [lineIndex, setLineIndex] = useState(0)
  const [copied, setCopied] = useState(false)

  const isLoading = generation?.status === 'loading'

  useEffect(() => {
    if (!isLoading) return
    setLineIndex(0)
    const t = setInterval(
      () => setLineIndex((i) => (i + 1) % loadingLines.length),
      2200,
    )
    return () => clearInterval(t)
  }, [isLoading, generation?.id])

  const aspect =
    ASPECTS.find((a) => a.id === generation?.aspectId) ?? ASPECTS[0]
  const ratio = `${aspect.width} / ${aspect.height}`

  if (!generation) {
    return (
      <div className="glass flex min-h-[420px] flex-col items-center justify-center rounded-3xl p-10 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 animate-pulse-ring rounded-full border border-dream-400/40" />
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-dream-600/40 to-fuchsia-600/30">
            <SparklesIcon className="h-9 w-9 text-dream-200" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-dream-100">
          Your vision will appear here
        </h3>
        <p className="mt-2 max-w-xs text-sm text-dream-300/60">
          Describe a dream, choose a mood, and let Dreamweaver paint it into
          existence.
        </p>
      </div>
    )
  }

  const style = STYLES.find((s) => s.id === generation.styleId)
  const mood = MOODS.find((m) => m.id === generation.moodId)

  function handleCopy() {
    onCopyPrompt()
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="glass overflow-hidden rounded-3xl">
      <div
        className="relative w-full overflow-hidden bg-black/40"
        style={{ aspectRatio: ratio }}
      >
        {/* Loading skeleton / shimmer */}
        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <div className="skeleton absolute inset-0 animate-shimmer opacity-70" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative mb-5 h-16 w-16">
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-dream-300 border-r-fuchsia-400" />
                <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-dream-500/50 to-fuchsia-500/40 blur-[2px]" />
                <SparklesIcon className="absolute inset-0 m-auto h-6 w-6 text-white" />
              </div>
              <p
                key={lineIndex}
                className="animate-fade-in text-sm font-medium text-dream-100"
              >
                {loadingLines[lineIndex]}
              </p>
            </div>
          </div>
        )}

        {/* Error state */}
        {generation.status === 'error' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 text-rose-300">
              <AlertIcon className="h-7 w-7" />
            </div>
            <div>
              <p className="font-semibold text-rose-100">
                The dream slipped away
              </p>
              <p className="mt-1 text-sm text-dream-300/60">
                The image couldn’t be conjured. Check your connection and try
                again.
              </p>
            </div>
            <button
              onClick={onRegenerate}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              <RefreshIcon className="h-4 w-4" /> Try again
            </button>
          </div>
        )}

        {/* Image (kept mounted so onLoad fires; hidden until ready) */}
        <img
          key={generation.url}
          src={generation.url}
          alt={generation.dreamText}
          onLoad={onImageLoaded}
          onError={onImageError}
          className={`h-full w-full object-cover transition-opacity duration-700 ${
            generation.status === 'done' ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Expand button */}
        {generation.status === 'done' && (
          <button
            onClick={onExpand}
            aria-label="View full size"
            className="absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
          >
            <ExpandIcon className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Meta + actions */}
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
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
            seed {generation.seed}
          </span>
        </div>

        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-dream-100/70">
          “{generation.dreamText}”
        </p>

        <div className="flex flex-wrap gap-2">
          <ActionButton
            onClick={onSave}
            disabled={generation.status !== 'done' || isSaved}
            primary
          >
            {isSaved ? (
              <>
                <CheckIcon className="h-4 w-4" /> Saved
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4" /> Save to journal
              </>
            )}
          </ActionButton>
          <ActionButton
            onClick={onRegenerate}
            disabled={generation.status === 'loading'}
          >
            <RefreshIcon className="h-4 w-4" /> Reimagine
          </ActionButton>
          <ActionButton
            onClick={onDownload}
            disabled={generation.status !== 'done'}
          >
            <DownloadIcon className="h-4 w-4" /> Download
          </ActionButton>
          <ActionButton onClick={handleCopy}>
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4" /> Copied
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4" /> Prompt
              </>
            )}
          </ActionButton>
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  disabled,
  primary,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  primary?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-40 ${
        primary
          ? 'bg-gradient-to-r from-dream-600 to-fuchsia-600 text-white hover:brightness-110'
          : 'border border-white/10 bg-white/5 text-dream-100 hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  )
}
