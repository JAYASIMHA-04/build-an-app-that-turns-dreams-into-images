import { useCallback, useRef, useState } from 'react'
import StarField from './components/StarField'
import DreamComposer from './components/DreamComposer'
import DreamCanvas from './components/DreamCanvas'
import DreamJournal from './components/DreamJournal'
import Lightbox, { LightboxData } from './components/Lightbox'
import { MoonIcon, SparklesIcon } from './components/icons'
import { useDreamJournal } from './hooks/useDreamJournal'
import {
  buildImageUrl,
  buildPrompt,
  DreamSettings,
  randomSeed,
} from './lib/pollinations'
import { downloadImage, slugify } from './lib/download'
import type { DreamEntry } from './lib/storage'
import type { Generation } from './types'

const DEFAULT_SETTINGS: DreamSettings = {
  styleId: 'dreamscape',
  moodId: 'mysterious',
  aspectId: 'square',
}

export default function App() {
  const [dreamText, setDreamText] = useState('')
  const [settings, setSettings] = useState<DreamSettings>(DEFAULT_SETTINGS)
  const [current, setCurrent] = useState<Generation | null>(null)
  const [lightbox, setLightbox] = useState<LightboxData | null>(null)

  const { entries, add, remove, clear } = useDreamJournal()
  const canvasRef = useRef<HTMLDivElement>(null)

  const isSaved = current ? entries.some((e) => e.id === current.id) : false

  const startGeneration = useCallback(
    (text: string, s: DreamSettings, seed: number) => {
      const id =
        typeof crypto !== 'undefined' && 'randomUUID' in crypto
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      const prompt = buildPrompt({
        dreamText: text,
        styleId: s.styleId,
        moodId: s.moodId,
      })
      const url = buildImageUrl({ dreamText: text, ...s, seed })
      setCurrent({
        id,
        dreamText: text.trim(),
        prompt,
        url,
        seed,
        ...s,
        status: 'loading',
      })
      // Bring the canvas into view on small screens
      requestAnimationFrame(() => {
        if (window.innerWidth < 1024) {
          canvasRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }
      })
    },
    [],
  )

  const handleGenerate = useCallback(() => {
    if (dreamText.trim().length < 3) return
    startGeneration(dreamText, settings, randomSeed())
  }, [dreamText, settings, startGeneration])

  const handleRegenerate = useCallback(() => {
    if (!current) return
    startGeneration(
      current.dreamText,
      {
        styleId: current.styleId,
        moodId: current.moodId,
        aspectId: current.aspectId,
      },
      randomSeed(),
    )
  }, [current, startGeneration])

  const setStatus = useCallback((status: Generation['status']) => {
    setCurrent((prev) => (prev ? { ...prev, status } : prev))
  }, [])

  const handleSave = useCallback(() => {
    if (!current || current.status !== 'done') return
    const entry: DreamEntry = {
      id: current.id,
      dreamText: current.dreamText,
      prompt: current.prompt,
      url: current.url,
      seed: current.seed,
      styleId: current.styleId,
      moodId: current.moodId,
      aspectId: current.aspectId,
      createdAt: Date.now(),
    }
    add(entry)
  }, [current, add])

  const handleDownloadCurrent = useCallback(() => {
    if (!current) return
    downloadImage(current.url, `dreamweaver-${slugify(current.dreamText)}.jpg`)
  }, [current])

  const handleCopyPrompt = useCallback(() => {
    if (!current) return
    navigator.clipboard?.writeText(current.prompt).catch(() => {})
  }, [current])

  const openLightbox = useCallback((d: LightboxData) => setLightbox(d), [])

  const handleDownloadLightbox = useCallback((d: LightboxData) => {
    downloadImage(d.url, `dreamweaver-${slugify(d.dreamText)}.jpg`)
  }, [])

  return (
    <div className="relative min-h-screen">
      <StarField />

      {/* Ambient nebula glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-dream-700/25 blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-fuchsia-700/20 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-cyan-600/15 blur-[120px]" />
      </div>

      <div className="relative z-10">
        <Header journalCount={entries.length} />

        <main className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
          <Hero />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-start">
            <div className="animate-fade-in-up">
              <DreamComposer
                dreamText={dreamText}
                onDreamTextChange={setDreamText}
                settings={settings}
                onSettingsChange={setSettings}
                onGenerate={handleGenerate}
                isGenerating={current?.status === 'loading'}
              />
            </div>

            <div
              ref={canvasRef}
              className="animate-fade-in-up [animation-delay:120ms] lg:sticky lg:top-24"
            >
              <DreamCanvas
                generation={current}
                isSaved={isSaved}
                onImageLoaded={() => setStatus('done')}
                onImageError={() => setStatus('error')}
                onRegenerate={handleRegenerate}
                onSave={handleSave}
                onDownload={handleDownloadCurrent}
                onCopyPrompt={handleCopyPrompt}
                onExpand={() =>
                  current &&
                  openLightbox({
                    url: current.url,
                    dreamText: current.dreamText,
                    prompt: current.prompt,
                    styleId: current.styleId,
                    moodId: current.moodId,
                    seed: current.seed,
                  })
                }
              />
            </div>
          </div>

          <DreamJournal
            entries={entries}
            onOpen={(entry) =>
              openLightbox({
                url: entry.url,
                dreamText: entry.dreamText,
                prompt: entry.prompt,
                styleId: entry.styleId,
                moodId: entry.moodId,
                seed: entry.seed,
              })
            }
            onDelete={remove}
            onClear={clear}
          />
        </main>

        <Footer />
      </div>

      <Lightbox
        data={lightbox}
        onClose={() => setLightbox(null)}
        onDownload={handleDownloadLightbox}
      />
    </div>
  )
}

function Header({ journalCount }: { journalCount: number }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#05010f]/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-dream-500 to-fuchsia-600 shadow-lg shadow-dream-900/50">
            <MoonIcon className="h-5 w-5 text-white" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">
            Dream<span className="text-gradient">weaver</span>
          </span>
        </a>
        <a
          href="#journal"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm font-medium text-dream-100 transition hover:bg-white/10"
        >
          Journal
          {journalCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-dream-500 to-fuchsia-500 px-1.5 text-xs font-semibold text-white">
              {journalCount}
            </span>
          )}
        </a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section id="top" className="py-12 text-center sm:py-16">
      <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-dream-200/80 animate-fade-in">
        <SparklesIcon className="h-3.5 w-3.5 text-dream-300" />
        Turn the impossible visions of sleep into art
      </div>
      <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-6xl animate-fade-in-up">
        Give your dreams
        <br className="hidden sm:block" />{' '}
        <span className="text-gradient">a face</span>
      </h1>
      <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-dream-200/70 sm:text-lg animate-fade-in-up [animation-delay:80ms]">
        Describe the dream you woke from and watch Dreamweaver paint it into a
        vivid, surreal image — then keep it forever in your journal.
      </p>
    </section>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-8">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-dream-300/40 sm:px-6">
        <p>
          Woven with dreams · Images generated on-device via{' '}
          <a
            href="https://pollinations.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dream-200/60 underline-offset-2 hover:underline"
          >
            Pollinations AI
          </a>
        </p>
      </div>
    </footer>
  )
}
