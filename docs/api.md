# API Readink (Express)

Base URL local: `http://localhost:4000`

## Estructura por capas

- `routes/`: define las rutas HTTP.
- `controllers/`: recibe request/response y decide el código HTTP.
- `services/`: contiene la lógica de negocio y datos en memoria.
- `validators/`: valida datos en la frontera de red.

## Modelo Book

```json
{
  "id": "string",
  "title": "string",
  "author": "string",
  "status": "wishlist | reading | read",
  "rating": "number (1-5, opcional)",
  "notes": "string (opcional)",
  "progress": "number (0-100, opcional)",
  "createdAt": "string ISO date",
  "finishedAt": "string ISO date (opcional)"
}
```

## Endpoints

### GET `/health`

Comprueba que el server está activo.

**Respuesta 200**

```json
{
  "status": "ok"
}
```

### GET `/api/v1/books`

Devuelve todos los libros.

**Respuesta 200**

```json
{
  "data": []
}
```

### GET `/api/v1/books/:id`

Devuelve un libro por id.

**Respuesta 200**

```json
{
  "data": {
    "id": "a1b2c3",
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "status": "reading",
    "progress": 40,
    "createdAt": "2026-05-01T15:00:00.000Z"
  }
}
```

**Respuesta 404**

```json
{
  "error": "Libro no encontrado."
}
```

### POST `/api/v1/books`

Crea un libro.

**Request**

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "status": "wishlist",
  "notes": "Quiero leerlo este mes"
}
```

**Respuesta 201**

```json
{
  "data": {
    "id": "new-id",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "status": "wishlist",
    "notes": "Quiero leerlo este mes",
    "createdAt": "2026-05-01T15:00:00.000Z"
  }
}
```

**Respuesta 400**

```json
{
  "error": "Datos invalidos.",
  "details": [
    "title es obligatorio y debe ser texto."
  ]
}
```

### PATCH `/api/v1/books/:id`

Actualiza parcialmente un libro.

**Request**

```json
{
  "status": "read",
  "rating": 5,
  "progress": 100
}
```

**Respuesta 200**

```json
{
  "data": {
    "id": "a1b2c3",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "status": "read",
    "rating": 5,
    "progress": 100,
    "createdAt": "2026-05-01T15:00:00.000Z",
    "finishedAt": "2026-05-01T16:00:00.000Z"
  }
}
```

**Respuesta 400**

```json
{
  "error": "Datos invalidos.",
  "details": [
    "Debes enviar al menos un campo valido para actualizar."
  ]
}
```

**Respuesta 404**

```json
{
  "error": "Libro no encontrado."
}
```

### DELETE `/api/v1/books/:id`

Elimina un libro por id.

**Respuesta 200**

```json
{
  "message": "Libro eliminado correctamente."
}
```

**Respuesta 404**

```json
{
  "error": "Libro no encontrado."
}
```

### GET `/api/v1/openlibrary/search?q=...`

Busca libros en Open Library pasando por backend y devuelve un formato normalizado.

**Request**

- Query param obligatorio: `q` (mínimo 3 caracteres)
- Ejemplo: `/api/v1/openlibrary/search?q=harry%20potter`

**Respuesta 200**

```json
{
  "data": [
    {
      "id": "/works/OL82563W",
      "title": "Harry Potter and the Philosopher's Stone",
      "author": "J. K. Rowling",
      "coverUrl": "https://covers.openlibrary.org/b/id/12345-L.jpg",
      "firstPublishYear": 1997
    }
  ]
}
```

**Respuesta 400**

```json
{
  "error": "Parámetros inválidos.",
  "details": [
    "q debe tener al menos 3 caracteres."
  ]
}
```

## Errores generales

Si ocurre un error inesperado en servidor:

**Respuesta 500**

```json
{
  "error": "Error interno del servidor."
}
```
