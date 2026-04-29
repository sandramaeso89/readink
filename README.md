# Readink

**Tu tracker personal de lectura.** Web para organizar libros en tres estados (quiero leer / leyendo / leídos), con notas y valoraciones, usando metadatos reales vía [Open Library](https://openlibrary.org/).

Estado actual: frontend en React + TypeScript con layout minimalista oscuro, estilos con Tailwind y practica de hooks modernos.

## Stack

| Herramienta | Uso |
|-------------|-----|
| [Vite](https://vitejs.dev/) | Servidor de desarrollo y build del frontend |
| [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI tipada |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos |
| [React Hooks](https://react.dev/reference/react) | Estado, efectos y optimizacion de render |
| [React Router](https://reactrouter.com/) | Enrutado cliente (páginas y navegación) |
| Backend (carpeta `server/`) | API REST Express (por implementar) |

## Scripts

```bash
npm run dev      # desarrollo (Vite)
npm run build    # compilación para producción
npm run preview  # vista previa del build
npm run lint     # ESLint
```

## Hooks aplicados en el proyecto

En el estado global (`src/context/LibraryContext.tsx`) se usan estos hooks:

- `useState`: estado de vista activa, libro seleccionado y modal abierto.
- `useMemo`: calcula conteos y listas derivadas sin recalculos innecesarios.
- `useCallback`: mantiene estables los handlers compartidos del contexto.

Ademas, en `src/pages/LibraryPage.tsx` se usa:

- `useEffect`: actualiza el titulo de la pestana con el total de libros.

Tambien se creo un custom hook reutilizable:

- `src/hooks/useLocalStorage.ts`: guarda y recupera estado desde `localStorage`.

Documentacion detallada:

- [Guia de hooks](docs/hooks.md)

## Context API aplicada en el proyecto

Se implemento estado global compartido usando Context API para evitar prop drilling.

- Contexto global: `src/context/LibraryContext.tsx`
- Provider global: `LibraryProvider`
- Consumo del contexto: `src/pages/LibraryPage.tsx` y `src/components/books/LibraryStats.tsx`

Documentacion detallada:

- [Guia de Context API](docs/context.md)

## Rutas y navegación

La app tiene varias páginas gestionadas con React Router. Cada URL corresponde a un componente en `src/pages/` y todas comparten el layout principal (`src/layouts/MainLayout.tsx`).

| URL | Página |
|-----|--------|
| `/` | Biblioteca (lista de libros) |
| `/explorar` | Explorar (placeholder) |
| `/estadisticas` | Estadísticas (placeholder) |
| `*` | Página 404 |

Configuración central: `src/routes/AppRoutes.tsx`.

Documentacion detallada:

- [Guia de rutas](docs/routing.md)

## Identidad visual actual

- Marca protagonista: **Readink** en cabecera principal.
- Estilo general: fondo oscuro, contraste alto y estética minimalista.
- Jerarquía de texto:
  - texto grande/titulares en rojo,
  - texto secundario en blanco.
- Tarjetas de libro con fondo completo difuminado:
  - variante roja para estados `WISHLIST` y `READ`,
  - variante verde para estado `READING`.
- Paleta configurada en Tailwind (`tailwind.config.js`) bajo `colors.brand`.

## Estructura del repositorio

### Frontend (`src/`)

| Carpeta | Contenido |
|---------|-----------|
| `components/books/` | Componentes de dominio (tarjetas, listas, formulario, modal detalle) |
| `components/ui/` | Componentes UI reutilizables (button, modal base, empty state) |
| `context/` | Estado global (Context API) |
| `hooks/` | Custom hooks reutilizables |
| `layouts/` | Layouts compartidos (navbar + `<Outlet/>`) |
| `pages/` | Una página por URL (Biblioteca, Explorar, Estadísticas, 404) |
| `routes/` | Configuración central de rutas |
| `types/` | Tipos TypeScript compartidos (`Book`, `ReadingStatus`) |
| `App.tsx` | Shell mínimo: renderiza `<AppRoutes/>` |
| `main.tsx` | Punto de entrada de React (envuelve con `BrowserRouter` y `LibraryProvider`) |
| `index.css` | Estilos base e import de Tailwind |

### Flujo de render (importante)

- `index.html` es la plantilla base con `<div id="root"></div>`.
- React monta la app dentro de ese div desde `src/main.tsx`.
- La interfaz visible se construye en `src/App.tsx` y sus componentes.

### Backend (`server/`)

Estructura preparada para Express: `routes/`, `controllers/`, `services/`, `config/`.

## Documentación

- [Idea y alcance](docs/idea.md)
- [Arquitectura y diseño (API, estado, componentes)](docs/design.md)
- [Catálogo de componentes](docs/components.md)
- [Gestión del proyecto (Trello, flujo de trabajo)](docs/project-management.md)
- [Agile, Scrum y Kanban](docs/agile.md) (referencia)
- [Hooks en el proyecto](docs/hooks.md)
- [Context API en el proyecto](docs/context.md)
- [Rutas y navegación](docs/routing.md)

## Tablero Trello

**Tablero Readink:** [https://trello.com/b/UdZII2GA/readink](https://trello.com/b/UdZII2GA/readink)

> Si el tablero es privado, solo podrán abrirlo quienes tengan cuenta e invitación en Trello.

## Licencia

Por definir.
