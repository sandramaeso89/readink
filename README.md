# Readink

**Tu tracker personal de lectura.** Web para organizar libros en tres estados (quiero leer / leyendo / leídos), con notas y valoraciones, usando metadatos reales vía [Open Library](https://openlibrary.org/).

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

## Estructura del repositorio

### Frontend (`src/`)

| Carpeta | Contenido |
|---------|-----------|
| `components/` | Componentes reutilizables |
| `pages/` | Pantallas / vistas |
| `hooks/` | Hooks personalizados |
| `types/` | Tipos e interfaces TypeScript |
| `utils/` | Funciones auxiliares |
| `context/` | Context API (estado global si aplica) |
| `api/` | Cliente HTTP tipado hacia el backend u Open Library |

### Backend (`server/`)

Estructura preparada para Express: `routes/`, `controllers/`, `services/`, `config/`.

## Documentación

- [Idea y alcance](docs/idea.md)
- [Gestión del proyecto (Trello, flujo de trabajo)](docs/project-management.md)
- [Agile, Scrum y Kanban](docs/agile.md) (referencia)

## Tablero Trello

**Tablero Readink:** [https://trello.com/b/UdZII2GA/readink](https://trello.com/b/UdZII2GA/readink)

> Si el tablero es privado, solo podrán abrirlo quienes tengan cuenta e invitación en Trello.

## Licencia

Por definir.
