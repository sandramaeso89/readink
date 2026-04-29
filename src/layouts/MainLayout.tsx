import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { AddBookForm } from '../components/books/AddBookForm'
import { Modal } from '../components/ui/Modal'

// Lista de enlaces del navbar.
// Los tenemos en un array para no repetir JSX y poder añadir rutas facil.
const NAV_LINKS = [
  { to: '/', label: 'Biblioteca', end: true },
  { to: '/explorar', label: 'Explorar', end: false },
  { to: '/estadisticas', label: 'Estadísticas', end: false },
]

// Funcion helper que calcula las clases del NavLink segun si esta activo o no.
// React Router nos pasa { isActive } automaticamente.
function navLinkClasses({ isActive }: { isActive: boolean }) {
  const base = 'cursor-pointer text-[13px] transition-colors'
  const active = 'text-[var(--ri-accent)]'
  const inactive = 'text-[var(--ri-text-muted)] hover:text-[var(--ri-text-primary)]'
  return `${base} ${isActive ? active : inactive}`
}

// Layout principal: navbar arriba + <Outlet/> donde se pinta la pagina activa.
// Esto evita duplicar el navbar en cada pagina.
export function MainLayout() {
  // Usamos año automático para no tener que editar el footer cada año.
  const currentYear = new Date().getFullYear()
  // Controla si el modal para anadir libro esta abierto.
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false)

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-4 py-8 font-sans text-white md:px-8">
      <div className="mx-auto w-full max-w-6xl overflow-hidden rounded-lg border border-[var(--ri-border)] bg-[var(--ri-bg)]">
        <nav className="flex items-center justify-between border-b border-[var(--ri-border)] px-8 py-5">
          <NavLink to="/" className="text-5xl font-medium tracking-[-0.5px] text-[var(--ri-accent)]">
            read<span className="font-normal text-[var(--ri-text-primary)]">ink</span>
          </NavLink>

          <ul className="hidden list-none items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} className={navLinkClasses}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() => setIsAddBookModalOpen(true)}
            className="rounded-md bg-[var(--ri-accent)] px-4 py-1.5 text-xs font-medium text-[var(--ri-bg)]"
          >
            + Añadir libro
          </button>
        </nav>

        {/* Aqui se pinta la pagina activa segun la URL. */}
        <Outlet />

        <Modal
          isOpen={isAddBookModalOpen}
          title="Añadir libro"
          onClose={() => setIsAddBookModalOpen(false)}
        >
          <AddBookForm onSuccess={() => setIsAddBookModalOpen(false)} />
        </Modal>

        {/* Footer global simple para firmar la web en todas las paginas. */}
        <footer className="border-t border-[var(--ri-border)] px-8 py-4 text-center text-xs text-[var(--ri-text-muted)]">
          {/* Linea principal del footer con formato estandar profesional. */}
          <p className="mb-1">
            © {currentYear} Readink. Todos los derechos reservados. Sitio Web desarrollado por Sandra Maeso.
          </p>
          <p>
            <a
              href="https://github.com/sandramaeso89"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--ri-text-primary)]"
            >
              GitHub
            </a>{' '}
            ·{' '}
            <a
              href="https://www.linkedin.com/in/sandra-maeso"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[var(--ri-text-primary)]"
            >
              LinkedIn
            </a>
          </p>
        </footer>
      </div>
    </main>
  )
}
