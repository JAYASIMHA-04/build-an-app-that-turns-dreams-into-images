import type { DreamEntry } from '../lib/storage'
import { STYLES } from '../lib/styles'
import { BookIcon, TrashIcon } from './icons'

interface Props {
  entries: DreamEntry[]
  onOpen: (entry: DreamEntry) => void
  onDelete: (id: string) => void
  onClear: () => void
}

export default function DreamJournal({
  entries,
  onOpen,
  onDelete,
  onClear,
}: Props) {
  return (
    <section id="journal" className="mt-20">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2.5 text-2xl font-bold text-dream-50">
            <BookIcon className="h-6 w-6 text-dream-300" />
            Dream Journal
          </h2>
          <p className="mt-1 text-sm text-dream-300/60">
            {entries.length > 0
              ? `${entries.length} dream${entries.length === 1 ? '' : 's'} woven into memory.`
              : 'The dreams you save will be gathered here.'}
          </p>
        </div>
        {entries.length > 0 && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-dream-200/70 transition hover:border-rose-400/30 hover:text-rose-200"
          >
            <TrashIcon className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className="glass flex flex-col items-center justify-center rounded-3xl px-6 py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <BookIcon className="h-8 w-8 text-dream-300/60" />
          </div>
          <p className="text-dream-100/80">No saved dreams yet</p>
          <p className="mt-1 max-w-sm text-sm text-dream-300/50">
            When a vision resonates with you, save it to keep it forever in your
            journal.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onOpen={() => onOpen(entry)}
              onDelete={() => onDelete(entry.id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function JournalCard({
  entry,
  onOpen,
  onDelete,
}: {
  entry: DreamEntry
  onOpen: () => void
  onDelete: () => void
}) {
  const style = STYLES.find((s) => s.id === entry.styleId)

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <button
        onClick={onOpen}
        className="block aspect-square w-full overflow-hidden"
        aria-label="Open dream"
      >
        <img
          src={entry.url}
          alt={entry.dreamText}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </button>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 pt-8">
        <p className="line-clamp-2 text-xs leading-snug text-dream-100/90">
          {entry.dreamText}
        </p>
        {style && (
          <span className="mt-1 inline-block text-[10px] uppercase tracking-wide text-dream-300/60">
            {style.icon} {style.label}
          </span>
        )}
      </div>

      <button
        onClick={onDelete}
        aria-label="Delete dream"
        className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white/80 opacity-0 backdrop-blur-md transition hover:bg-rose-500/70 hover:text-white group-hover:opacity-100"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </div>
  )
}
