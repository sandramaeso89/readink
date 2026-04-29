# Context API en Readink

Este documento explica, en lenguaje simple, como usamos Context API en el proyecto.

## Que problema resuelve Context API

Cuando varios componentes necesitan el mismo estado, pasar props de padre a hijo muchas veces se vuelve pesado.
Eso se llama "prop drilling".

Con Context API:
- guardamos el estado en un lugar global,
- y cualquier componente hijo puede leerlo sin cadenas largas de props.

## Implementacion en este proyecto

### 1) Creamos el contexto

Archivo: `src/context/LibraryContext.tsx`

Usamos `createContext` para definir un contexto llamado `LibraryContext`.
Ese contexto guarda el estado global de la biblioteca:
- libros,
- vista activa,
- libro seleccionado,
- libro abierto en el modal,
- listas filtradas y conteos,
- funciones de accion.

### 2) Creamos el Provider

Tambien en `src/context/LibraryContext.tsx` creamos `LibraryProvider`.

El Provider:
- contiene el estado global,
- calcula datos derivados (conteos y listas),
- expone funciones (`handleViewChange`, `handleSelectBook`, `handleCloseModal`),
- y entrega todo a la app con `<LibraryContext.Provider value={...}>`.

### 3) Envolvemos la app con el Provider

Archivo: `src/main.tsx`

Envolvemos `<App />` con `<LibraryProvider>`.
Asi, todo lo que esta dentro de la app puede usar el contexto.

### 4) Consumimos el contexto en distintos componentes

Creamos el hook `useLibraryContext` para consumirlo de forma segura.

Se usa en:
- `src/pages/LibraryPage.tsx` (pantalla de biblioteca, columnas y modal),
- `src/components/books/LibraryStats.tsx` (tarjetas de metricas).

## Cuando es util usar Context API

Context API es util cuando:
- varios componentes lejanos comparten el mismo estado,
- quieres evitar prop drilling,
- el estado global no es tan complejo como para usar Redux u otra libreria.

## Cuando no usarlo

Si un estado solo lo usa un componente o su hijo directo, `useState` local suele ser mejor.
Es mas simple y evita complejidad innecesaria.

## Resumen rapido

- `createContext`: crea el contenedor global.
- `Provider`: comparte el estado con el arbol de componentes.
- `useContext`: permite leer ese estado desde cualquier hijo.
