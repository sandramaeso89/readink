# Rutas en Readink

Documento explicativo de cómo está organizado el enrutado de la aplicación.

## ¿Qué es React Router?

Una librería que permite tener **varias páginas dentro de una SPA** (Single Page Application). Mapea una URL del navegador a un componente React.

- Si el usuario entra en `/` → ve la `LibraryPage`.
- Si entra en `/explorar` → ve la `ExplorePage`.
- Si entra en una URL que no existe → ve la `NotFoundPage`.

Versión usada en este proyecto: `react-router-dom` v7 (ver `package.json`).

## Mapa de rutas

| URL | Componente | Archivo |
|-----|------------|---------|
| `/` | `LibraryPage` | `src/pages/LibraryPage.tsx` |
| `/leidos` | `ReadBooksPage` | `src/pages/ReadBooksPage.tsx` |
| `/explorar` | `ExplorePage` | `src/pages/ExplorePage.tsx` |
| `/estadisticas` | `StatsPage` | `src/pages/StatsPage.tsx` |
| `*` (cualquier otra) | `NotFoundPage` | `src/pages/NotFoundPage.tsx` |

Todas las rutas comparten el layout `MainLayout` (navbar + contenedor exterior).

## Estructura de carpetas

```
src/
├── layouts/
│   └── MainLayout.tsx      # navbar + <Outlet/>
├── pages/
│   ├── LibraryPage.tsx     # /
│   ├── ReadBooksPage.tsx   # /leidos
│   ├── ExplorePage.tsx     # /explorar
│   ├── StatsPage.tsx       # /estadisticas
│   └── NotFoundPage.tsx    # *
├── routes/
│   └── AppRoutes.tsx       # configuración central de <Routes>
├── App.tsx                 # shell: solo renderiza <AppRoutes/>
└── main.tsx                # <BrowserRouter> envuelve la app
```

Cada carpeta tiene una responsabilidad única:

- **`layouts/`**: estructura visual común (navbar, sidebar, footer...).
- **`pages/`**: una página por archivo. Cada página corresponde a una URL.
- **`routes/`**: configuración de qué URL muestra qué página.

## Flujo de renderizado

1. `main.tsx` envuelve la app con `<BrowserRouter>`. Esto activa el enrutado.
2. `App.tsx` renderiza `<AppRoutes/>`.
3. `AppRoutes` define qué componente corresponde a cada URL.
4. Todas las rutas van dentro de `<Route element={<MainLayout/>}>`, así que React Router primero pinta `MainLayout` y luego inserta la página en el `<Outlet/>` que hay dentro del layout.

```
main.tsx
 └── <BrowserRouter>
      └── <LibraryProvider>
           └── <App/>
                └── <AppRoutes/>
                     └── <MainLayout/>          <- navbar + <Outlet/>
                          └── <LibraryPage/>    <- (o la página que toque)
```

## Componentes clave de React Router

| Componente | Para qué sirve |
|------------|----------------|
| `<BrowserRouter>` | Raíz del enrutado. Escucha cambios en la URL. Se pone una sola vez en `main.tsx`. |
| `<Routes>` | Contenedor que agrupa todas las rutas. |
| `<Route path="..." element={...} />` | Declara "si la URL es X, renderiza Y". |
| `<Outlet/>` | Marcador dentro de un layout donde se pinta la página hija. |
| `<NavLink to="...">` | Enlace que conoce si está activo (clase automática para resaltarlo). |
| `<Link to="...">` | Enlace normal, sin estado activo. |

## Navegación: `<NavLink>` vs `<button>`

Antes, el navbar usaba `<button>` con `onClick` para cambiar la vista interna. Ahora usa `<NavLink>` porque:

- Cambia la URL del navegador (se puede compartir, volver atrás con el botón del navegador, etc.).
- Resalta automáticamente el link activo (recibe `isActive: boolean` en el `className`).
- Es más semántico: es un enlace real, no un botón.

Ejemplo de cómo se usa en `MainLayout`:

```tsx
<NavLink
  to="/explorar"
  className={({ isActive }) => isActive ? 'text-amber' : 'text-muted'}
>
  Explorar
</NavLink>
```

La prop `end` (usada en el link a `/`) evita que ese enlace se marque como activo en cualquier URL que empiece por `/`. Sin `end`, estaría "activo" incluso cuando estés en `/explorar`.

## Cómo añadir una nueva ruta

Pasos mínimos:

1. Crear el componente de la página en `src/pages/MiNuevaPagina.tsx`.
2. Importarlo en `src/routes/AppRoutes.tsx`.
3. Añadir `<Route path="/mi-ruta" element={<MiNuevaPagina/>} />` dentro del `<Route element={<MainLayout/>}>`.
4. (Opcional) Añadir enlace en navbar o en alguna sección existente (por ejemplo, la columna "Leidos" en `LibraryPage.tsx`).

## Página 404

La ruta `*` (comodín) atrapa cualquier URL que no coincida con las anteriores. Es importante que esté **al final** del listado de rutas: React Router busca en orden y `*` hace match con todo.

## Decisiones técnicas

- **`BrowserRouter` clásico** en lugar de `createBrowserRouter` (data router). Razón: sintaxis JSX más legible para nivel junior, menos conceptos de golpe. Podemos migrar más adelante si añadimos loaders/acciones.
- **Un archivo por página** en vez de un `App.tsx` gigante: facilita el mantenimiento y el lazy loading futuro.
- **Configuración central en `AppRoutes.tsx`**: de un vistazo se ve todo el mapa URL → componente.

## Recursos

- [Documentación oficial de React Router](https://reactrouter.com/)
- [Tutorial oficial](https://reactrouter.com/en/main/start/tutorial)
