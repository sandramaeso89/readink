import { Link } from 'react-router-dom'

// Pantalla base de login.
// Es visual por ahora: en una fase futura aquí conectaremos Firebase Auth.
export function LoginPage() {
  return (
    <section className="px-8 pb-12 pt-12">
      <p className="mb-3 text-[11px] uppercase tracking-[2px] text-[var(--ri-accent)]">Acceso</p>
      <h1 className="mb-2 text-4xl font-medium leading-tight text-[var(--ri-text-primary)]">Iniciar sesión</h1>
      <p className="mb-8 max-w-2xl text-sm text-[var(--ri-text-muted)]">
        Accede a tu biblioteca personal de lectura. Esta pantalla ya está preparada para conectar Firebase Auth
        en el siguiente paso.
      </p>

      <div className="mx-auto w-full max-w-md rounded-lg border border-[var(--ri-border)] bg-[var(--ri-surface)] p-6">
        <form className="space-y-4" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label htmlFor="email" className="mb-1 block text-xs font-medium text-[var(--ri-text-secondary)]">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="tuemail@ejemplo.com"
              className="h-11 w-full rounded-lg border border-[var(--ri-border)] bg-[#0f0f0f] px-4 text-sm text-[var(--ri-text-secondary)] outline-none transition-colors focus:border-[var(--ri-accent)]"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-xs font-medium text-[var(--ri-text-secondary)]">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="h-11 w-full rounded-lg border border-[var(--ri-border)] bg-[#0f0f0f] px-4 text-sm text-[var(--ri-text-secondary)] outline-none transition-colors focus:border-[var(--ri-accent)]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-[var(--ri-accent)] px-4 py-2 text-sm font-medium text-[var(--ri-bg)]"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--ri-text-muted)]">
          Próximamente: autenticación real con Firebase.
        </p>

        <div className="mt-5 text-center">
          <Link to="/" className="text-xs text-[var(--ri-accent)] underline">
            Volver a la biblioteca
          </Link>
        </div>
      </div>
    </section>
  )
}
