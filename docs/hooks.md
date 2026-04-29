# Hooks en Readink

Este documento explica, en lenguaje simple, los hooks que usamos en el proyecto y por que se usan.

## 1) useState

`useState` sirve para guardar datos que pueden cambiar en la interfaz.

En `src/context/LibraryContext.tsx` lo usamos para:
- `activeView`: saber que vista de la biblioteca esta activa.
- `selectedBookId`: saber que tarjeta de libro esta seleccionada.
- `openedBookId`: saber que libro esta abierto en el modal.

Idea clave: cuando cambia un estado, React vuelve a pintar la parte necesaria de la UI.

## 2) useEffect

`useEffect` sirve para hacer efectos secundarios.
Un efecto secundario es algo que pasa fuera del render, por ejemplo tocar `document.title` o guardar en `localStorage`.

En este proyecto se usa en dos sitios:

- `src/pages/LibraryPage.tsx`: actualiza el titulo de la pestana con el total de libros (`Readink · X libros`).
- `src/hooks/useLocalStorage.ts`: guarda automaticamente el valor en `localStorage` cuando cambia.

Asi la UI y el titulo del navegador quedan sincronizados.

## 3) useMemo

`useMemo` sirve para memorizar calculos y evitar repetirlos sin necesidad.

En `src/context/LibraryContext.tsx` lo usamos para:
- calcular conteos (`wishlist`, `reading`, `read`, `total`),
- derivar libros visibles segun la vista activa,
- separar libros por columna.
- resolver el libro abierto en el modal.

Idea clave: solo recalcula cuando cambian sus dependencias.

## 4) useCallback

`useCallback` sirve para memorizar funciones.
Esto evita crear funciones nuevas en cada render cuando se pasan a componentes hijos.

En `src/context/LibraryContext.tsx` lo usamos para:
- `handleViewChange`,
- `handleSelectBook`.
- `handleCloseModal`.

Idea clave: mejora estabilidad de props y ayuda a evitar renders innecesarios.

## 5) Custom hook reutilizable: useLocalStorage

Archivo: `src/hooks/useLocalStorage.ts`

Creamos este hook para reutilizar una necesidad comun: guardar estado en `localStorage`.

Que hace:
- intenta leer un valor guardado al iniciar,
- si no existe o falla, usa un valor inicial,
- cada vez que el estado cambia, lo guarda otra vez.

Beneficio:
- evitamos duplicar logica en varios componentes,
- el codigo del contexto y de las paginas queda mas limpio.

## Resumen rapido

- `useState`: guarda estado local.
- `useEffect`: efectos secundarios.
- `useMemo`: optimiza calculos.
- `useCallback`: optimiza funciones pasadas a hijos.
- `useLocalStorage` (custom hook): reutiliza logica de persistencia.
