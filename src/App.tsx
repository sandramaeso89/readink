import { Suspense } from 'react'
import { AppRoutes } from './routes/AppRoutes'

// App actua como "shell" minimo de la aplicacion.
// Toda la logica de navegacion vive en AppRoutes.
function App() {
  return (
    <Suspense
      fallback={
        // Fallback simple mientras carga una página lazy.
        <div className="flex min-h-screen items-center justify-center bg-[var(--ri-bg)] px-6">
          <p className="text-sm text-[var(--ri-text-muted)]">Cargando página...</p>
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  )
}

export default App
