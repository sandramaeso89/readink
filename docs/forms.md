# Formularios en Readink

Este documento explica, en lenguaje simple, el formulario controlado de "Anadir libro" que se implemento en la app.

## 1) Que es un formulario controlado

Un formulario controlado en React es un formulario donde los inputs dependen del estado (`useState`).

Eso significa:

- el valor de cada campo vive en una variable de estado,
- cada cambio del usuario actualiza ese estado con `onChange`,
- y React decide siempre que se muestra en pantalla.

## 2) Donde esta implementado

- Componente: `src/components/books/AddBookForm.tsx`
- Boton disparador: `src/layouts/MainLayout.tsx` (`+ Anadir libro`)
- Modal contenedor: `src/components/ui/Modal.tsx`
- Guardado global: `src/context/LibraryContext.tsx` con `addBook`

## 3) Estado de los inputs

En `AddBookForm` se gestionan estos estados:

- `title`: titulo del libro
- `author`: autor del libro
- `genre`: genero principal del libro
- `status`: estado inicial (`wishlist`, `reading`, `read`)
- `stars`: puntuacion de 1 a 5 (solo cuando el estado es `read`)

Tambien se usan:

- `formStatus`: para saber si hay error o exito
- `message`: texto de feedback para la usuaria

## 4) Validacion basica

Antes de guardar, validamos:

- titulo obligatorio
- autor obligatorio
- estrellas solo si el libro esta en estado leido (1 a 5)

Si falta alguno:

- no se envia el formulario,
- se muestra mensaje de error: "Completa titulo y autor antes de guardar."

## 5) Mensajes de error y confirmacion

Despues de intentar enviar:

- si hay error de validacion: mensaje rojo
- si todo va bien: mensaje de confirmacion en verde

Mensaje de exito:

- "Libro anadido correctamente."

## 6) Flujo simple del formulario

1. La usuaria pulsa `+ Anadir libro` en la cabecera.
2. Se abre un modal con `AddBookForm`.
3. La usuaria escribe titulo, autor, genero y estado.
4. Si elige estado `Leido`, puede elegir estrellas (1-5).
5. Pulsa "Guardar libro".
6. React valida campos.
7. Si es valido, se llama `addBook(...)` del contexto global.
8. Se limpia el formulario y el modal se cierra.

## 7) Por que esta solucion es buena para nivel junior

- Es clara y facil de mantener.
- Usa patron estandar de React (controlado con `useState`).
- Separa responsabilidades:
  - `AddBookForm` gestiona UI + validacion basica,
  - `LibraryContext` guarda el libro en el estado global.
