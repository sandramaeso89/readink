// Pagina "Estadisticas" (ruta "/estadisticas"): placeholder minimalista.
// Mas adelante mostrara graficos, rachas de lectura y metricas detalladas.
export function StatsPage() {
  return (
    <section className="px-8 pb-16 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">
        Estadisticas
      </p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Tu progreso de lectura.
      </h1>
      <p className="text-sm text-[var(--ri-text-muted)]">
        Proximamente veras aqui graficos, rachas y metricas de tu habito lector.
      </p>
    </section>
  )
}
