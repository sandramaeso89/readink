import { useLibraryContext } from '../../context/LibraryContext'

export function LibraryStats() {
  // Leemos métricas globales desde Context para no pasar props.
  const { counts } = useLibraryContext()

  return (
    <section className="grid grid-cols-2 gap-3 px-8 pb-8 md:grid-cols-4">
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-5 py-3.5">
        <p className="mb-1 text-[22px] font-medium text-[var(--ri-accent)]">{counts.wishlist}</p>
        <p className="text-[11px] tracking-[0.5px] text-[var(--ri-text-muted)]">Quiero leer</p>
      </div>
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-5 py-3.5">
        <p className="mb-1 text-[22px] font-medium text-[var(--ri-reading)]">{counts.reading}</p>
        <p className="text-[11px] tracking-[0.5px] text-[var(--ri-text-muted)]">Leyendo</p>
      </div>
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-5 py-3.5">
        <p className="mb-1 text-[22px] font-medium text-[var(--ri-text-primary)]">{counts.read}</p>
        <p className="text-[11px] tracking-[0.5px] text-[var(--ri-text-muted)]">Leidos</p>
      </div>
      <div className="rounded-md border border-[var(--ri-border)] bg-[var(--ri-surface)] px-5 py-3.5">
        <p className="mb-1 text-[22px] font-medium text-[var(--ri-text-primary)]">{counts.total}</p>
        <p className="text-[11px] tracking-[0.5px] text-[var(--ri-text-muted)]">Total en biblioteca</p>
      </div>
    </section>
  )
}
