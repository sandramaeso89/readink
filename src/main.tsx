import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { LibraryProvider } from './context/LibraryContext'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('No se encontro el elemento root para montar la app')
}

// Orden de los providers (de fuera hacia dentro):
// 1. StrictMode -> ayudas de desarrollo de React.
// 2. BrowserRouter -> habilita rutas basadas en URL del navegador.
// 3. LibraryProvider -> estado global de libros accesible desde cualquier ruta.
createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <LibraryProvider>
        <App />
      </LibraryProvider>
    </BrowserRouter>
  </StrictMode>,
)
