# Retrospectiva final del proyecto Readink

## 1) Qué aprendí durante el proyecto

Durante este proyecto pasé de una app más local (estado en cliente) a una app más profesional con backend propio.

Aprendizajes clave:

- Separar responsabilidades mejora mucho el mantenimiento:
  - frontend para experiencia de usuario,
  - backend para reglas de negocio y contrato de datos.
- Definir tipos claros en TypeScript evita muchos errores "silenciosos".
- Los estados de red (`loading`, `success`, `error`) son obligatorios para una UX real, no un detalle opcional.
- Documentar cada capa (`api.md`, `api-client.md`, `testing.md`, `deployment.md`) ayuda a no perder control cuando el proyecto crece.

## 2) Cómo conecté frontend (React/TypeScript), backend (Express) y API

La conexión final quedó así:

1. El frontend usa un cliente API tipado en `src/api/client.ts`.
2. Ese cliente llama al backend Express (`/api/v1/books` y `/api/v1/openlibrary/search`).
3. El backend aplica arquitectura por capas:
   - `routes`: rutas HTTP,
   - `controllers`: request/response y códigos HTTP,
   - `services`: lógica,
   - `validators`: validación de entrada.
4. Para Open Library, el frontend no llama directo a la API externa:
   - llama a backend,
   - backend consulta Open Library,
   - backend normaliza la respuesta (`id`, `title`, `author`, `coverUrl`, `firstPublishYear`),
   - backend filtra idioma español y devuelve contrato estable al frontend.

Resultado: el frontend queda más limpio y desacoplado de cambios externos de Open Library.

## 3) Principales problemas encontrados y cómo se resolvieron

### A) Desalineación entre tipos frontend y backend

Problema:

- La UI tenía un modelo de libro y el backend otro parecido, pero no idéntico.

Solución:

- Crear tipos de contrato en `src/types/api.ts`.
- Añadir mapeo en contexto para transformar datos API a modelo de UI.

Aprendizaje:

- Tener "contrato de API" explícito evita errores al evolucionar ambos lados.

### B) Integración de Open Library con resultados incompletos

Problema:

- Algunos libros no aparecían buscando solo por título.

Solución:

- En backend, búsqueda paralela por título y autor, combinación de resultados y deduplicación.
- Filtro por idioma español para cumplir requisito funcional.

Aprendizaje:

- Integrar API externa exige normalizar, filtrar y controlar calidad de datos antes de llegar al frontend.

### C) Problemas de UI al añadir acciones nuevas

Problema:

- Al añadir botón de eliminar y nuevas acciones, algunas tarjetas quedaron desalineadas y con overflow.

Solución:

- Ajustes de layout en tarjetas y contenedores (`flex`, `min-w-0`, `truncate`, `line-clamp`).
- Reemplazo de `window.confirm` por modal visual consistente.

Aprendizaje:

- Cambios pequeños en funcionalidad pueden romper la composición visual; siempre hay que revalidar UI.

### D) Warnings/lint en hooks y fast refresh

Problema:

- Warnings por `setState` en `useEffect`, memoización no estable y exportaciones en contexto.

Solución:

- Preparar borradores de estado en handlers de interacción.
- Usar `useCallback` para funciones de filtro.
- Separar instancia de contexto y hook en archivos específicos.

Aprendizaje:

- Las reglas de hooks ayudan a prevenir bugs reales de sincronización y renders difíciles de depurar.

### E) Deploy completo frontend + backend

Problema:

- Frontend desplegado, pero backend faltaba y el cliente seguía apuntando a localhost.

Solución:

- Preparar backend para Vercel en `server/api/index.ts` y `server/vercel.json`.
- Cambiar cliente a `VITE_API_BASE_URL` con fallback local.
- Desplegar backend en `https://readink-api.vercel.app`.

Aprendizaje:

- La configuración de entorno es parte del producto, no solo "infra".

## 4) Cómo utilicé IA durante el desarrollo

La IA se usó como asistente técnico y de aprendizaje, no como reemplazo de criterio.

Usos prácticos:

- Diseñar pasos pequeños y seguros para cada tarea.
- Detectar inconsistencias entre implementación y documentación.
- Proponer fixes concretos tras errores de lint/build.
- Redactar documentación técnica consistente entre capas.
- Guiar decisiones con enfoque junior (simple, mantenible, sin sobreingeniería).

Límite importante:

- Cada cambio se validó con pruebas/lint/build y revisión visual; no se aplicó nada "a ciegas".

## 5) Conclusión final

Readink evolucionó de un MVP de frontend a una aplicación full-stack coherente:

- contrato de API claro,
- backend por capas,
- cliente tipado,
- estados de red sólidos,
- UX más consistente,
- despliegue real en producción.

El siguiente salto natural es persistencia completa en backend para todo (incluyendo Top 10 y objetivo anual) y autenticación de usuarios.
