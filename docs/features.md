# Nuevas funcionalidades (abril 2026)

Este documento resume las mejoras implementadas para que Readink se acerque a apps de lectura tipo Goodreads/StoryGraph, manteniendo complejidad junior.

## 1) Objetivo de lectura anual

- Estado global en `LibraryContext`: `yearlyGoal` y `setYearlyGoal`.
- Cálculo en `StatsPage`: libros terminados en el año actual (`finishedAt`) y porcentaje de avance.
- UI en `StatsPage`: barra de progreso + input para cambiar meta anual.

## 2) Búsqueda, filtros y orden en Biblioteca

- Buscador por `título`, `autor` y `nota`.
- Filtro por `género`.
- Filtro por `estado`.
- Orden por:
  - añadidos recientemente (`createdAt`),
  - título A-Z,
  - mejor valorados,
  - mayor progreso.

Implementado en `src/pages/LibraryPage.tsx`.

## 3) Notas por libro

- Nuevo campo opcional `note` en `LibraryCard`.
- Acción global `updateBookNote(bookId, note)` en contexto.
- Edición de nota dentro del modal de detalle del libro.
- Vista previa breve de nota en la tarjeta de libro.

## 4) Importación desde Open Library (fase 2)

- En `AddBookForm` se añadió buscador con autocompletado (`search.json`).
- Al elegir un resultado, se rellenan campos de:
  - título,
  - autor,
  - portada (`coverUrl`),
  - género (normalizado al catálogo interno).
- Sigue existiendo modo manual con campos normales.

## 5) Estados vacíos mejorados (CTA)

Se añadieron mensajes más claros con llamadas a la acción en:

- `ExplorePage` (bloques sin datos de tendencias/recomendadas/sugerencias),
- `LibraryPage` (columnas filtradas sin resultados).

## 6) Fechas para estadísticas reales

Nuevos metadatos:

- `createdAt`: fecha de alta del libro.
- `finishedAt`: fecha cuando pasa a estado `read`.

Esto permite:

- objetivo anual real,
- orden por reciente más robusto,
- futuras estadísticas mensuales sin refactor grande.
