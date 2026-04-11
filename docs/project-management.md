# Gestión del proyecto Readink

Este documento describe **cómo está organizado el trabajo** del desarrollo de Readink: herramienta, columnas del tablero y relación con el código del repositorio.

---

## Herramienta: Trello

El seguimiento del trabajo se hace con un tablero **Trello** llamado **Readink**. Sirve para ver de un vistazo qué está pendiente, qué está en curso y qué ya está terminado, sin sustituir al repositorio Git: **Trello = planificación y estado**; **Git = código e historial**.

---

## Flujo de trabajo (columnas)

El tablero usa un flujo tipo **Kanban** con cinco listas:

| Columna | Significado |
|---------|-------------|
| **Backlog** | Ideas y bloques de trabajo priorizados que aún no se han tomado para ejecutar en serio. |
| **Todo** | Tareas acordadas y listas para empezar en el corto plazo. |
| **In Progress** | Lo que se está haciendo ahora (idealmente pocos ítems a la vez). |
| **Review** | Implementación hecha: revisión (código, pruebas, UX) antes de dar por cerrado. |
| **Done** | Completado y validado. |

### Cómo se usa en la práctica

1. Las **funcionalidades grandes** viven como tarjetas (a menudo empezando en **Backlog**).
2. Cada tarjeta se **divide en subtareas** (checklist en la misma tarjeta o tarjetas más pequeñas) para pasos técnicos concretos.
3. Las tarjetas **se mueven hacia la derecha** según avanza el trabajo: cuando empiezas algo, lo pasas a **In Progress**; cuando abres PR o pruebas, a **Review**; cuando está mergeado y OK, a **Done**.

---

## Tarjetas iniciales en Backlog

Referencia de las épicas previstas al arrancar el proyecto:

1. Layout y diseño general  
2. Backend Express — API REST  
3. Buscador de libros (Open Library API)  
4. Mis tres listas (Quiero leer / Leyendo / Leídos)  
5. Detalle de libro  
6. Valoración con estrellas  
7. Notas personales  
8. Cliente API tipado (`src/api/client.ts`)  
9. Despliegue (Vercel + Render)  

Esta lista puede cambiar: nuevas tarjetas en Backlog, división o unión de ítems según se aprenda del desarrollo.

---

## Relación con este repositorio

| En Trello | En el repo |
|-----------|------------|
| Una tarjeta “feature” | Suele corresponder a una **rama** (`feature/…`) y uno o varios **commits**. |
| Subtareas | Commits pequeños o checklist hasta cerrar la tarjeta. |
| Done | Código en `main`/`develop` (según acordéis) y, si aplica, desplegado. |

La documentación de producto sigue en [idea.md](idea.md); este archivo solo describe **organización del trabajo**, no los requisitos funcionales.

---

## Enlace al tablero

Tablero del proyecto: **[Readink en Trello](https://trello.com/b/UdZII2GA/readink)** (`https://trello.com/b/UdZII2GA/readink`). El mismo enlace está en el [README del repositorio](../README.md).
