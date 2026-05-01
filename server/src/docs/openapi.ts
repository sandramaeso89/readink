// Documento OpenAPI mínimo para visualizar y probar la API en Swagger UI.
export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Readink API",
    version: "1.0.0",
    description: "Documentación básica de endpoints del backend Express de Readink.",
  },
  servers: [
    {
      url: "http://localhost:4000",
      description: "Servidor local",
    },
    {
      url: "https://readink-api.vercel.app",
      description: "Servidor producción",
    },
  ],
  paths: {
    "/health": {
      get: {
        summary: "Healthcheck del servidor",
        responses: {
          "200": {
            description: "Servidor activo",
          },
        },
      },
    },
    "/api/v1/books": {
      get: {
        summary: "Listar libros",
        responses: {
          "200": {
            description: "Lista de libros",
          },
        },
      },
      post: {
        summary: "Crear libro",
        responses: {
          "201": { description: "Libro creado" },
          "400": { description: "Datos inválidos" },
        },
      },
    },
    "/api/v1/books/{id}": {
      get: {
        summary: "Obtener libro por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Libro encontrado" },
          "404": { description: "Libro no encontrado" },
        },
      },
      patch: {
        summary: "Actualizar libro por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Libro actualizado" },
          "400": { description: "Datos inválidos" },
          "404": { description: "Libro no encontrado" },
        },
      },
      delete: {
        summary: "Eliminar libro por id",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": { description: "Libro eliminado" },
          "404": { description: "Libro no encontrado" },
        },
      },
    },
    "/api/v1/openlibrary/search": {
      get: {
        summary: "Buscar libros en Open Library (vía backend)",
        parameters: [
          {
            name: "q",
            in: "query",
            required: true,
            schema: { type: "string" },
            description: "Texto de búsqueda (mínimo 3 caracteres).",
          },
        ],
        responses: {
          "200": { description: "Resultados normalizados de Open Library" },
          "400": { description: "Parámetros inválidos" },
          "500": { description: "Error interno del servidor" },
        },
      },
    },
  },
} as const;
