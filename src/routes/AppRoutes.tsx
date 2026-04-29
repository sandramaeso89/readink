import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { ExplorePage } from '../pages/ExplorePage'
import { LibraryPage } from '../pages/LibraryPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { ReadBooksPage } from '../pages/ReadBooksPage'
import { StatsPage } from '../pages/StatsPage'

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
