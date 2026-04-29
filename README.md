# Readink

**Tu Web personal de lectura.** Web para organizar libros en tres estados (quiero leer / leyendo / leídos), con notas y valoraciones, usando metadatos reales vía [Open Library](https://openlibrary.org/).

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
# desarrollo (Vite)
npm run dev     # inicia servidor de desarrollo
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
- La guia tambien explica en que casos conviene usar Context API y cuando es mejor mantener estado local.

## Rutas y navegación

La app tiene varias páginas gestionadas con React Router. Cada URL corresponde a un componente en `src/pages/` y todas comparten el layout principal (`src/layouts/MainLayout.tsx`).

| URL | Página |
|-----|--------|
| `/` | Biblioteca (lista de libros) |
| `/leidos` | Leidos (lista completa + Top 10) |
| `/explorar` | Explorar (recomendaciones segun biblioteca local) |
| `/estadisticas` | Estadísticas (metricas reales) |
| `*` | Página 404 |

Configuración central: `src/routes/AppRoutes.tsx`.

Desde la columna `Leidos` en `LibraryPage`, al hacer clic en el titulo se abre la pagina de leidos con:

- listado completo de libros leidos,
- seccion Top 10 con limite maximo de 10 libros,
- boton por libro para anadir al Top 10,
- boton por libro en Top 10 para eliminarlo.

En la columna `Leyendo`, al abrir el resumen de un libro ahora aparece la accion:

- `Marcar como leido` (mueve el libro de `reading` a `read`).
- `Guardar progreso` para actualizar el porcentaje de avance (0% a 100%).
- `Volver a quiero leer` (mueve el libro de `reading` a `wishlist`).

En la columna `Quiero leer`, al abrir el resumen de un libro ahora aparece:

- `Marcar como leyendo` (mueve el libro de `wishlist` a `reading` con progreso inicial 0%).

Documentacion detallada:

- [Guia de rutas](docs/routing.md)

En `/estadisticas` ahora se muestran metricas reales de lectura:

- resumen global (total, leidos, leyendo, quiero leer),
- porcentajes de progreso,
- valoracion media,
- top autores,
- distribucion por genero,
- resumen del Top 10 actual.

En `/explorar` se muestran recomendaciones y sugerencias locales segun tus autores/generos mas usados.

## Funcionalidades nuevas (abril 2026)

Se implementaron mejoras clave orientadas a UX y crecimiento del proyecto:

- Objetivo anual de lectura con barra de progreso en `Estadísticas`.
- Buscador, filtros y orden en `Biblioteca`.
- Notas personales por libro (edición desde modal).
- Importación/autocompletado desde Open Library en el formulario.
- Estados vacíos mejorados con CTA claros.
- Nuevos metadatos (`createdAt`, `finishedAt`) para estadísticas y orden.

Documentación detallada:

- [Nuevas funcionalidades](docs/features.md)

## Formularios controlados

Se implemento un formulario controlado para anadir libros usando React:

- Componente: `src/components/books/AddBookForm.tsx`
- Apertura desde cabecera: boton `+ Anadir libro` en `src/layouts/MainLayout.tsx`
- Renderizado dentro de modal: `src/components/ui/Modal.tsx`
- Estado global de guardado: `addBook` en `src/context/LibraryContext.tsx`
- Incluye validacion basica (titulo y autor obligatorios) y mensajes de error/exito.
- Si el estado es `Leido`, permite guardar puntuacion con estrellas (1 a 5).
- Las tarjetas ya soportan `coverUrl` para mostrar portadas al conectar Open Library.

Documentacion detallada:

- [Guia de formularios](docs/forms.md)

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
- [Formularios controlados](docs/forms.md)
- [Nuevas funcionalidades](docs/features.md)

## Tablero Trello

**Tablero Readink:** [https://trello.com/b/UdZII2GA/readink](https://trello.com/b/UdZII2GA/readink)

> Si el tablero es privado, solo podrán abrirlo quienes tengan cuenta e invitación en Trello.

## Licencia

Por definir.
