# Readink

**Tu tracker personal de lectura.** Aplicación web para organizar libros en tres estados (quiero leer / leyendo / leídos), con notas y valoraciones, usando metadatos reales vía [Open Library](https://openlibrary.org/).

## Qué resuelve

Centralizar en un solo sitio el seguimiento de tu biblioteca personal: qué te falta por leer, qué estás leyendo y qué has terminado, con notas y puntuaciones cuando corresponda.

## Público objetivo

Lectores habituales o casuales que quieren una biblioteca digital ordenada sin complicarse.

## Stack previsto

| Capa | Tecnología |
|------|------------|
| Frontend | Cliente web (despliegue previsto en **Vercel**) |
| Búsqueda de libros | **Open Library API** (gratis, sin API key) |
| Backend (opcional) | **Express**, API REST — despliegue previsto en **Render** |
| Persistencia local | **LocalStorage** en el MVP; backend para datos centralizados si aplica |

## Documentación

- [Idea y alcance del proyecto](docs/idea.md)
- [Agile, Scrum y Kanban](docs/agile.md) (referencia de metodología)

## Organización del desarrollo (Trello)

El trabajo se gestiona en un tablero **Trello** llamado **Readink**. Flujo tipo Kanban:

| Columna | Propósito |
|---------|-----------|
| **Backlog** | Funcionalidades y bloques de trabajo priorizados, aún no planificados para la iteración actual |
| **Todo** | Tarjetas listas para empezar |
| **In Progress** | En curso |
| **Review** | Revisión de código, pruebas o UX antes de dar por cerrado |
| **Done** | Completado |

Cada tarjeta de funcionalidad se descompone en **subtareas técnicas** (checklist o tarjetas hijas). Las tarjetas se **mueven entre columnas** según el avance real del desarrollo.

### Tarjetas iniciales en Backlog

1. Layout y diseño general  
2. Backend Express — API REST  
3. Buscador de libros (Open Library API)  
4. Mis tres listas (Quiero leer / Leyendo / Leídos)  
5. Detalle de libro  
6. Valoración con estrellas  
7. Notas personales  
8. Cliente API tipado (`src/api/client.ts`)  
9. Despliegue (Vercel + Render)  

## API REST del backend (referencia)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/books` | Listar libros guardados |
| `POST` | `/api/books` | Añadir un libro a una lista |
| `PATCH` | `/api/books/:id` | Actualizar lista, nota o valoración |
| `DELETE` | `/api/books/:id` | Eliminar un libro |

## Licencia

Por definir.
