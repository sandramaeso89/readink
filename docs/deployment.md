# Despliegue en Vercel

Esta guía deja frontend y backend desplegados en Vercel con una conexión limpia por variable de entorno.

## 1) Frontend (Vite)

Estado actual:

- Frontend desplegado en: [https://readink.vercel.app/](https://readink.vercel.app/)
- API desplegada en: [https://readink-api.vercel.app/](https://readink-api.vercel.app/)

## 2) Backend (Express en el mismo repo)

Para mantener la arquitectura actual (`routes/controllers/services/validators`) se despliega la carpeta `server/` como proyecto separado en Vercel.

Archivos preparados:

- `server/api/index.ts`: exporta la app de Express como función HTTP.
- `server/vercel.json`: enruta todas las peticiones a `api/index.ts`.

Pasos:

1. Entra a `server/`.
2. Haz login si hace falta:
   - `npx vercel login`
3. Despliega en producción:
   - `npx vercel --prod`
4. Copia la URL final de la API (en este proyecto: `https://readink-api.vercel.app`).

## 3) Variable de entorno del frontend

El cliente API usa:

- `VITE_API_BASE_URL`

Configúrala en el proyecto de frontend en Vercel:

- Key: `VITE_API_BASE_URL`
- Value: `https://readink-api.vercel.app`
- Entornos: Production (y Preview si quieres)

Luego redeploy del frontend para aplicar la variable.

## 4) Verificación en producción

Checklist rápida:

1. Frontend abre correctamente: `https://readink.vercel.app/`
2. API responde health:
   - `https://readink-api.vercel.app/health` devuelve `200`.
3. Flujo app:
   - listar libros,
   - crear libro,
   - editar libro,
   - eliminar libro,
   - buscar Open Library desde el formulario.

## 5) Estado final del despliegue

- Frontend operativo en `readink.vercel.app`.
- Backend operativo en `readink-api.vercel.app`.
- Integración final depende de tener `VITE_API_BASE_URL` configurada en el proyecto frontend y hacer redeploy.
