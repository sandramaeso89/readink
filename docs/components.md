# Componentes de Readink

Este documento explica los componentes reutilizables creados para el ejercicio.
Todos consumen datos tipados con TypeScript.

---

## Tipos base

Archivo: `src/types/book.ts`

- `ReadingStatus`: estado de lectura (`WISHLIST`, `READING`, `READ`).
- `Book`: tipo principal que usa la UI para pintar libros.

---

## Componentes UI reutilizables

### `Button`

Archivo: `src/components/ui/Button.tsx`

**Qué hace**
- Botón reutilizable con variantes visuales (`primary`, `secondary`, `ghost`).

**Props principales**
- `children: ReactNode`
- `variant?: 'primary' | 'secondary' | 'ghost'`
- También acepta props nativas de `<button>` (`onClick`, `type`, `disabled`, etc.).

### `EmptyState`

Archivo: `src/components/ui/EmptyState.tsx`

**Qué hace**
- Muestra un estado vacío cuando no hay resultados o no hay datos.

**Props**
- `title: string`
- `description: string`

### `Modal`

Archivo: `src/components/ui/Modal.tsx`

**Qué hace**
- Ventana modal genérica para mostrar contenido encima de la pantalla.

**Props**
- `isOpen: boolean`
- `title: string`
- `children: ReactNode`
- `onClose: () => void`

---

## Componentes de dominio (libros)

### `SearchForm`

Archivo: `src/components/books/SearchForm.tsx`

**Qué hace**
- Formulario de búsqueda por texto (título/autor).

**Props**
- `value: string`
- `onChange: (value: string) => void`
- `onSubmit: (event: FormEvent<HTMLFormElement>) => void`

### `BookCard`

Archivo: `src/components/books/BookCard.tsx`

**Qué hace**
- Tarjeta individual de libro (portada, título, autor, año y botón de detalle).

**Props**
- `book: Book`
- `onOpenDetails: (book: Book) => void`

### `BookList`

Archivo: `src/components/books/BookList.tsx`

**Qué hace**
- Lista de tarjetas de libros.
- Si no hay libros, muestra `EmptyState`.

**Props**
- `title: string`
- `books: Book[]`
- `emptyMessage: string`
- `onOpenDetails: (book: Book) => void`

### `BookDetailModal`

Archivo: `src/components/books/BookDetailModal.tsx`

**Qué hace**
- Muestra detalles del libro dentro de un modal.
- Reutiliza el componente `Modal`.

**Props**
- `book: Book | null`
- `onClose: () => void`

---

## Composición de componentes (cómo se combinan)

Archivo: `src/App.tsx`

La app usa composición así:

1. `SearchForm` para filtrar.
2. `BookList` para pintar resultados.
3. `BookList` renderiza muchas `BookCard`.
4. `BookCard` dispara apertura de `BookDetailModal`.
5. `BookDetailModal` reutiliza `Modal`.

Esto cumple el patrón de composición: componentes pequeños que se unen para formar una pantalla completa.

---

## Tailwind aplicado

Se usan clases Tailwind en todos los componentes creados para:

- Layout responsive (`grid`, `flex`, `max-w-*`, `md:*`, `xl:*`)
- Espaciado y jerarquía visual (`p-*`, `gap-*`, `text-*`)
- Estética minimalista (`rounded-*`, `shadow-sm`, paleta `slate` y `violet`)

Archivo global de estilos base: `src/index.css`.
