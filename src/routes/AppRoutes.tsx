import { lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'

// Lazy loading por ruta:
// cada página se carga cuando se visita, para reducir carga inicial.
const LibraryPage = lazy(() =>
  import('../pages/LibraryPage').then((module) => ({ default: module.LibraryPage })),
)
const ReadBooksPage = lazy(() =>
  import('../pages/ReadBooksPage').then((module) => ({ default: module.ReadBooksPage })),
)
const ExplorePage = lazy(() =>
  import('../pages/ExplorePage').then((module) => ({ default: module.ExplorePage })),
)
const StatsPage = lazy(() =>
  import('../pages/StatsPage').then((module) => ({ default: module.StatsPage })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

// Configuracion central de rutas de la app.
// Tenerlo en un solo archivo facilita ver el mapa URL -> pagina.
export function AppRoutes() {
  return (
    <Routes>
      {/* Rutas que comparten el layout principal (navbar + contenedor). */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LibraryPage />} />
        <Route path="/leidos" element={<ReadBooksPage />} />
        <Route path="/explorar" element={<ExplorePage />} />
        <Route path="/estadisticas" element={<StatsPage />} />

        {/* Catch-all: cualquier URL no listada arriba cae en la 404. */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
