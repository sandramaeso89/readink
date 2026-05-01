# Capa de red del frontend

## Objetivo

Este documento explica cómo el frontend de Readink se conecta al backend y qué tipos usa para mantener el contrato claro.

La idea principal es simple:

- Los libros viven en backend (fuente de verdad).
- El frontend consume esos datos con un cliente API tipado.
- La UI siempre maneja tres estados de red: carga, éxito y error.

## Archivos clave

- `src/api/client.ts`: funciones HTTP (`getBooks`, `createBook`, `updateBook`, `deleteBook`).
  y `searchOpenLibrary`.
- `src/types/api.ts`: tipos del contrato de API.
- `src/context/LibraryContext.tsx`: orquesta llamadas API y expone estado a la UI.

## Tipos del contrato

### `ApiBook`

Representa un libro tal y como lo devuelve backend:

- `id`, `title`, `author`
- `status` (`wishlist` | `reading` | `read`)
- `rating`, `notes`, `progress` (opcionales)
- `createdAt`, `finishedAt`

### `ApiSuccess<T>` y `ApiError`

- `ApiSuccess<T>`: respuesta correcta con `data`.
- `ApiError`: respuesta de error con `error` y `details` opcional.

## Funciones del cliente API

### `getBooks()`

- Método: `GET /api/v1/books`
- Devuelve: `Promise<ApiBook[]>`

### `createBook(payload)`

- Método: `POST /api/v1/books`
- Devuelve: `Promise<ApiBook>`

### `updateBook(bookId, payload)`

- Método: `PATCH /api/v1/books/:id`
- Devuelve: `Promise<ApiBook>`

### `deleteBook(bookId)`

- Método: `DELETE /api/v1/books/:id`
- Devuelve: `Promise<void>`

### `searchOpenLibrary(query)`

- Método: `GET /api/v1/openlibrary/search?q=...`
- Devuelve: `Promise<ApiOpenLibraryBook[]>`
- Uso principal: autocompletar búsqueda en `AddBookForm`.

## Estados de red en UI

En `LibraryContext` se exponen:

- `booksLoading`: `true` cuando se está cargando desde API.
- `booksError`: mensaje de error cuando falla una llamada.
- `retryLoadBooks()`: función para reintentar la carga.

Las páginas que consumen libros (`Library`, `ReadBooks`, `Stats`, `Explore`) muestran:

- carga (`loading`)
- contenido (`success`)
- mensaje + botón de reintento (`error`)

## Nota de alcance actual

- Los datos de libros usan API como fuente de verdad.
- La búsqueda Open Library también pasa por backend.
- `top10` y `yearlyGoal` siguen en `localStorage` porque todavía no tienen endpoints backend.
