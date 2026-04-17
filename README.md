# Readink

**Tu tracker personal de lectura.** Web para organizar libros en tres estados (quiero leer / leyendo / leídos), con notas y valoraciones, usando metadatos reales vía [Open Library](https://openlibrary.org/).

Estado actual: base frontend con componentes reutilizables tipados en TypeScript, estilos con Tailwind y una identidad visual oscura/editorial inspirada en referencias de color rojo + verde.

## Stack

| Herramienta | Uso |
|-------------|-----|
| [Vite](https://vitejs.dev/) | Servidor de desarrollo y build del frontend |
| [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | UI tipada |
| [Tailwind CSS](https://tailwindcss.com/) | Estilos |
| [React Router](https://reactrouter.com/) | Rutas en el cliente |
| Backend (carpeta `server/`) | API REST Express (por implementar) |

## Scripts

```bash
npm run dev      # desarrollo (Vite)
npm run build    # compilación para producción
npm run preview  # vista previa del build
npm run lint     # ESLint
```

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
| `types/` | Tipos TypeScript compartidos (`Book`, `ReadingStatus`) |
| `App.tsx` | Composición principal, marca y layout de la home |
| `main.tsx` | Punto de entrada de React |
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

## Tablero Trello

**Tablero Readink:** [https://trello.com/b/UdZII2GA/readink](https://trello.com/b/UdZII2GA/readink)

> Si el tablero es privado, solo podrán abrirlo quienes tengan cuenta e invitación en Trello.

## Licencia

Por definir.
