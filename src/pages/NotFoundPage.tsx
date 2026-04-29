import { Link } from 'react-router-dom'

// Pagina 404: se muestra cuando la URL no coincide con ninguna ruta definida.
// React Router la activa con <Route path="*" />.
export function NotFoundPage() {
  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center px-8 pb-16 pt-12 text-center">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">
        Error 404
      </p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">
        Pagina no encontrada.
      </h1>
      <p className="mb-6 text-sm text-[var(--ri-text-muted)]">
        La pagina que buscas no existe o ha sido movida.
      </p>
      <Link
        to="/"
        className="rounded-md bg-[var(--ri-accent)] px-4 py-1.5 text-xs font-medium text-[var(--ri-bg)]"
      >
        Volver al inicio
      </Link>
    </section>
  )
}
