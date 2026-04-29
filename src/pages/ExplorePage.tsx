// Pagina "Explorar" (ruta "/explorar"): por ahora solo un placeholder
// minimalista hasta que definamos su contenido real.
export function ExplorePage() {
  return (
    <section className="px-8 pb-16 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">
        Explorar
      </p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Descubre nuevos libros.
      </h1>
      <p className="text-sm text-[var(--ri-text-muted)]">
        Proximamente podras buscar y explorar titulos desde Open Library.
      </p>
    </section>
  )
}
