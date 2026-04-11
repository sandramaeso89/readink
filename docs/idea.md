# Readink — Idea del proyecto

**Readink** es una aplicación web tipo **microapp**: una sola función bien resuelta, interfaz clara y poco peso conceptual. No requiere obligatoriamente una base de datos relacional: el cliente puede persistir en **LocalStorage** y enriquecer datos con la **API de Open Library** (gratis, sin API key). Opcionalmente, un backend **Express** puede centralizar el almacenamiento y exponer una API REST.

---

## Problema que resuelve

Llevar el control de los libros que quieres leer, los que estás leyendo y los que ya has leído, con **notas personales** y **valoraciones**, todo en **un solo lugar**, sin depender de hojas sueltas ni de varias apps desconectadas.

---

## Usuario objetivo

**Lectores habituales o casuales** que quieren **organizar su biblioteca personal digital** y recordar qué les gustó, qué están leyendo y qué tienen pendiente.

---

## Funcionalidades principales

- **Buscar libros reales** mediante la [Open Library Search API](https://openlibrary.org/dev/docs/api/search) (gratuita, sin clave).
- **Tres listas:** Quiero leer / Leyendo / Leídos.
- **Mover libros** entre listas (flujo tipo kanban ligero).
- **Valoración con estrellas** (solo en la lista **Leídos**).
- **Notas personales** por libro.
- **Detalle del libro:** portada, autor, año, sinopsis (según datos devueltos por la API).

---

## Funcionalidades opcionales

- **Buscador y filtros** dentro de tus listas (por título, autor, etiquetas si las hubiera).
- **Estadísticas:** libros leídos este año, media de valoración.
- **Modo oscuro.**

---

## Posibles mejoras futuras

- Sincronización entre dispositivos si hay cuenta de usuario y backend.
- Exportar/importar biblioteca (JSON) para copias de seguridad.
- Objetivos de lectura anuales o por mes.
- Integración con más fuentes de metadatos si hiciera falta.
- PWA offline para consultar listas sin red.

---

## Datos y persistencia

| Enfoque | Uso |
|--------|-----|
| **LocalStorage + Open Library** | MVP sin servidor: catálogo en el navegador, búsqueda y metadatos vía API pública. |
| **Backend Express** | Si se quiere API propia, persistencia en disco/JSON o más adelante una base de datos. |

---

## API REST del backend Express (opcional)

Endpoints previstos:

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/api/books` | Obtener todos los libros guardados |
| `POST` | `/api/books` | Añadir un libro a una lista |
| `PATCH` | `/api/books/:id` | Cambiar lista, nota o valoración |
| `DELETE` | `/api/books/:id` | Eliminar un libro |

---

## Repositorio

El código vive en Git; el remoto **`origin`** ya está configurado hacia el repositorio del proyecto en GitHub. No es necesario crear otro repositorio para esta misma app.
