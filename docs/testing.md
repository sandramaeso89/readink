# Testing manual de Readink

## Objetivo

Validar funcionalidad, estabilidad básica, estado de consola y diseño responsive tras los cambios recientes de frontend y backend.

## Entorno de prueba

- Fecha: 2026-05-01
- Frontend: React + Vite
- Backend: Express (`http://localhost:4000`)
- Verificaciones técnicas ejecutadas:
  - `npm run lint` ✅
  - `npm run build` ✅
  - pruebas de endpoints REST con requests manuales ✅

## Checklist funcional (manual + requests)

### Backend API (CRUD libros)

- [x] `GET /health` devuelve `200`.
- [x] `GET /api/v1/books` devuelve `200`.
- [x] `POST /api/v1/books` válido devuelve `201`.
- [x] `POST /api/v1/books` inválido devuelve `400`.
- [x] `PATCH /api/v1/books/:id` válido devuelve `200`.
- [x] `PATCH /api/v1/books/:id` inválido devuelve `400`.
- [x] `GET /api/v1/books/:id` no existente devuelve `404`.
- [x] `DELETE /api/v1/books/:id` existente devuelve `200`.
- [x] `DELETE /api/v1/books/:id` no existente devuelve `404`.

### Búsqueda Open Library vía backend

- [x] `GET /api/v1/openlibrary/search?q=ab` devuelve `400` (query corta).
- [x] Búsqueda por título devuelve resultados.
- [x] Búsqueda por autor devuelve resultados.
- [x] Se mantiene normalización de contrato (`id`, `title`, `author`, `coverUrl`, `firstPublishYear`).

### Frontend (flujos principales validados)

- [x] Añadir libro desde formulario.
- [x] Marcar libro como `leyendo` y `leído` desde formulario y explorar.
- [x] Eliminar libro desde biblioteca/leídos con modal de confirmación.
- [x] Ver portadas cuando existe `coverUrl`.
- [x] Fallback premium cuando no hay portada.
- [x] Carga incremental con `+ Ver más` en explorar.

## Responsive y consola

### Responsive

- [x] Revisión de estructura responsive en breakpoints principales (móvil/tablet/desktop) a nivel de layout.
- [ ] Revisión visual manual pixel-perfect pendiente en dispositivo real para pulido final de espaciados finos.

### Consola / calidad

- [x] Sin errores de lint tras fixes.
- [x] Build de frontend correcto.
- [x] Build de backend correcto.

## Bugs detectados y corregidos en esta ronda

1. **Lint backend**: parámetro no usado en middleware de error (`server/src/app.ts`).
   - Estado: corregido.
2. **Fast refresh/context**: warning por exportaciones en archivo de contexto.
   - Estado: corregido moviendo instancia de contexto y hook a archivos separados.
3. **Hooks en `LibraryPage`**: setState directo en `useEffect` y memoización no estable.
   - Estado: corregido usando handler con draft previo y `useCallback` para filtro/orden.

## Resultado de la ronda

- Estado general: **estable para continuar desarrollo**.
- Recomendación: mantener esta checklist y repetirla al cerrar cada bloque funcional grande.
