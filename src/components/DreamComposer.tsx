import { useMemo } from 'react'
import { ASPECTS, DREAM_PROMPTS, MOODS, STYLES } from '../lib/styles'
import type { DreamSettings } from '../lib/pollinations'
import { DiceIcon, SparklesIcon } from './icons'

interface Props {
  dreamText: string
  onDreamTextChange: (v: string) => void
  settings: DreamSettings
  onSettingsChange: (s: DreamSettings) => void
  onGenerate: () => void
  isGenerating: boolean
}

const MAX_LEN = 600

export default function DreamComposer({
  dreamText,
  onDreamTextChange,
  settings,
  onSettingsChange,
  onGenerate,
  isGenerating,
}: Props) {
  const canGenerate = dreamText.trim().length >= 3 && !isGenerating

  const surprise = useMemo(
    () => () => {
      const pick =
        DREAM_PROMPTS[Math.floor(Math.random() * DREAM_PROMPTS.length)]
      onDreamTextChange(pick)
    },
    [onDreamTextChange],
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canGenerate) {
      e.preventDefault()
      onGenerate()
    }
  }

  return (
    <div className="glass rounded-3xl p-5 sm:p-7 shadow-2xl shadow-black/40">
      <div className="mb-3 flex items-center justify-between">
        <label
          htmlFor="dream"
          className="text-sm font-medium uppercase tracking-[0.2em] text-dream-200/80"
        >
          Describe your dream
        </label>
        <button
          type="button"
          onClick={surprise}
          className="group inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-dream-100 transition hover:border-dream-300/40 hover:bg-white/10"
        >
          <DiceIcon className="h-3.5 w-3.5 transition group-hover:rotate-12" />
          Surprise me
        </button>
      </div>

      <div className="relative">
        <textarea
          id="dream"
          value={dreamText}
          onChange={(e) => onDreamTextChange(e.target.value.slice(0, MAX_LEN))}
          onKeyDown={handleKeyDown}
          rows={4}
          placeholder="Last night I dreamt of a city floating on the back of a sleeping whale, its windows glowing like fireflies…"
          className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 text-base leading-relaxed text-dream-50 outline-none transition placeholder:text-dream-300/40 focus:border-dream-400/50 focus:ring-2 focus:ring-dream-500/30"
        />
        <span className="pointer-events-none absolute bottom-3 right-4 text-xs tabular-nums text-dream-300/40">
          {dreamText.length}/{MAX_LEN}
        </span>
      </div>

      <div className="mt-6 space-y-5">
        <OptionRow label="Style">
          {STYLES.map((s) => (
            <Chip
              key={s.id}
              active={settings.styleId === s.id}
              onClick={() => onSettingsChange({ ...settings, styleId: s.id })}
            >
              <span aria-hidden>{s.icon}</span>
              {s.label}
            </Chip>
          ))}
        </OptionRow>

        <OptionRow label="Mood">
          {MOODS.map((m) => (
            <Chip
              key={m.id}
              active={settings.moodId === m.id}
              onClick={() => onSettingsChange({ ...settings, moodId: m.id })}
            >
              <span aria-hidden>{m.icon}</span>
              {m.label}
            </Chip>
          ))}
        </OptionRow>

        <OptionRow label="Shape">
          {ASPECTS.map((a) => (
            <Chip
              key={a.id}
              active={settings.aspectId === a.id}
              onClick={() => onSettingsChange({ ...settings, aspectId: a.id })}
            >
              <span aria-hidden>{a.icon}</span>
              {a.label}
            </Chip>
          ))}
        </OptionRow>
      </div>

      <button
        type="button"
        onClick={onGenerate}
        disabled={!canGenerate}
        className="btn-glow group mt-7 flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-dream-600 via-fuchsia-600 to-cyan-500 bg-[length:200%_auto] px-6 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-[position:100%_center] disabled:cursor-not-allowed disabled:opacity-40 disabled:saturate-50"
      >
        <SparklesIcon
          className={`h-5 w-5 ${isGenerating ? 'animate-spin' : 'transition group-hover:scale-110'}`}
        />
        {isGenerating ? 'Weaving your dream…' : 'Visualize dream'}
      </button>
      <p className="mt-3 text-center text-xs text-dream-300/40">
        Tip: press <kbd className="rounded bg-white/10 px-1.5 py-0.5">⌘</kbd> +{' '}
        <kbd className="rounded bg-white/10 px-1.5 py-0.5">Enter</kbd> to generate
      </p>
    </div>
  )
}

function OptionRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-dream-300/50">
        {label}
      </div>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
        active
          ? 'border-transparent bg-gradient-to-r from-dream-500/90 to-fuchsia-500/90 text-white shadow-lg shadow-dream-900/40'
          : 'border-white/10 bg-white/5 text-dream-100/80 hover:border-dream-300/30 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
