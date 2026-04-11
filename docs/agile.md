# Metodologías de desarrollo: Agile, Scrum y Kanban

Este documento resume en qué consisten Agile, Scrum y Kanban, cómo se relacionan entre sí y en qué contextos suele tener sentido elegir cada enfoque.

---

## ¿Qué es Agile y cuál es su objetivo?

**Agile** (ágil) no es un único método con pasos fijos, sino un **conjunto de valores y principios** acordados por la industria del software para producir valor de forma iterativa y adaptativa.

Su **objetivo central** es **entregar software útil de manera frecuente**, respondiendo al cambio en lugar de seguir un plan rígido hasta el final. En la práctica eso significa:

- Dividir el trabajo en **ciclos cortos** con entregas o demostraciones regulares.
- **Colaborar** de forma estrecha con quien pide el producto y con el equipo técnico.
- **Ajustar prioridades** cuando aparecen nuevos requisitos o se aprende algo del uso real del software.
- Favorecer **software que funciona** y **feedback** sobre documentación extensa o procesos burocráticos por sí solos.

Agile se describe a menudo con el **Manifiesto Agile** y sus doce principios: individuos e interacciones, software funcionando, colaboración con el cliente y respuesta al cambio, por encima de procesos pesados, documentación como fin, negociación contractual fija y seguir un plan inmutable.

**En resumen:** Agile es la **filosofía**; Scrum y Kanban son **formas concretas** de organizar el trabajo que pueden alinearse con esos principios.

---

## ¿Qué es Scrum y sus conceptos principales?

**Scrum** es un **marco de trabajo** (framework) muy estructurado para desarrollar productos complejos en equipos pequeños y multi-funcionales. Define roles, eventos y artefactos con nombres propios.

### Roles

- **Product Owner (PO):** representa a negocio y usuarios. **Prioriza** qué se construye y mantiene claro el **valor** de cada ítem. Es quien dice “qué” y en qué orden, no “cómo” lo implementa el equipo.
- **Scrum Master:** **facilita** el proceso Scrum, ayuda a quitar impedimentos y protege al equipo de interrupciones que rompan el ritmo acordado. No es el jefe de proyecto ni quien reparte tareas técnicas.
- **Equipo de desarrollo:** profesionales que **diseñan, construyen y prueban** el incremento del producto. Son auto-organizados y comparten la responsabilidad del resultado del sprint.

### Sprints

Un **sprint** es un **periodo de tiempo fijo** (habitualmente entre una y cuatro semanas) en el que el equipo se compromete a completar un conjunto de trabajo seleccionado desde el backlog. Al terminar el sprint, el producto debería estar en un estado **potencialmente entregable** (incremento).

### Backlog

- **Product Backlog:** lista **ordenada** de todo lo que podría hacerse en el producto (funcionalidades, mejoras, correcciones). El PO la prioriza; el equipo la estima y la refina.
- **Sprint Backlog:** subconjunto de ítems elegidos para el sprint actual, más el plan del equipo para **cómo** va a completarlos.

### Reviews y otros eventos habituales

- **Sprint Planning:** al inicio del sprint, el equipo elige qué del backlog entrará en el sprint y cómo lo abordará.
- **Daily Scrum (daily):** reunión breve diaria para alinear el progreso y detectar bloqueos.
- **Sprint Review:** al final del sprint, se **muestra** el incremento a interesados y se recoge **feedback** para el backlog.
- **Sprint Retrospective:** reflexión interna del equipo sobre **cómo trabajar mejor** en el siguiente sprint.

Scrum impone **ritmo** (sprints de duración fija), **compromiso por sprint** y **ceremonias** predefinidas para inspeccionar y adaptar.

---

## ¿Qué es Kanban y cómo se usa para organizar tareas?

**Kanban** es un método de **gestión visual del flujo de trabajo**. Su origen está en la manufactura; en software se usa para **ver** el estado de cada tarea y **limitar** cuánto trabajo hay en curso a la vez.

### Ideas clave

- **Tablero:** columnas típicas como *Por hacer*, *En progreso*, *En revisión*, *Hecho* (o las que el equipo defina). Cada tarea es una **tarjeta** que se mueve de columna en columna.
- **Límite de trabajo en curso (WIP):** se fija un máximo de ítems en ciertas columnas (sobre todo en “En progreso”) para **no saturar** al equipo y **reducir** el tiempo de espera entre pasos.
- **Flujo continuo:** no hay obligación de “cajas” de tiempo como el sprint; el trabajo **entra y sale** según capacidad y prioridad.
- **Métricas:** tiempo de ciclo, throughput, cuellos de botella; sirven para **mejorar el proceso** sin imponir un calendario de releases fijo por iteración.

### Cómo se usa en la práctica

El equipo **prioriza** una cola de trabajo (a veces llamada backlog o lista de entrada), **toma** el siguiente ítem cuando hay capacidad según los límites WIP y **avanza** la tarjeta hasta “Hecho”. Las reglas del tablero (definición de “hecho”, quién puede mover tarjetas, etc.) se acuerdan y se refinan con el tiempo.

Kanban es **flexible**: no prescribe roles ni reuniones obligatorias; el foco está en **visualizar**, **limitar el trabajo simultáneo** y **optimizar el flujo**.

---

## Diferencias entre Scrum y Kanban

| Aspecto | Scrum | Kanban |
|--------|--------|--------|
| **Estructura temporal** | Iteraciones de duración fija (sprints). | Flujo continuo; sin sprint obligatorio. |
| **Roles** | PO, Scrum Master, equipo de desarrollo definidos. | No define roles obligatorios; el equipo adapta responsabilidades. |
| **Planificación** | Compromiso explícito por sprint en el planning. | Priorización continua; se “tira” del siguiente trabajo según capacidad. |
| **Cambios mid-sprint** | Se desaconseja cambiar el alcance del sprint en curso; el cambio suele esperar al siguiente sprint. | Más flexible para cambiar prioridades cuando hay capacidad. |
| **Eventos** | Planning, daily, review, retrospectiva son parte del marco. | No impone ceremonias; se pueden usar reuniones similares si aportan valor. |
| **Métricas típicas | Velocidad, burndown, cumplimiento del sprint. | Tiempo de ciclo, WIP, throughput. |
| **Adaptación** | Inspección y adaptación al **cierre** de cada sprint. | Inspección **continua** del tablero y del flujo. |

Ambos pueden **combinarse** (por ejemplo, un tablero Kanban dentro de sprints), pero conceptualmente Scrum es más **prescriptivo** y Kanban más **minimalista** en reglas.

---

## ¿Cuándo usar cada metodología?

### Agile

Tiene sentido cuando el **alcance o el mercado cambian** con frecuencia, cuando se quiere **feedback temprano** y cuando se prioriza **entregar valor por incrementos** en lugar de un único lanzamiento grande al final. No sustituye por sí solo la gestión de personas ni la calidad técnica; orienta la **cultura** y las **expectativas** del proyecto.

### Scrum

Conviene cuando:

- El producto se puede **desglosar en incrementos** entregables cada pocas semanas.
- Hay interés en **ritmo estable**, **roles claros** (especialmente un PO disponible) y **ceremonias** que den estructura al equipo.
- El entorno permite **compromisos por sprint** y se valora la **previsibilidad** a corto plazo.

Es menos ideal si las prioridades cambian **varias veces al día** o si el trabajo es muy reactivo (colas de incidencias), donde el sprint puede sentirse rígido.

### Kanban

Encaja bien cuando:

- Hay **muchas peticiones entrantes** o **soporte y desarrollo** mezclados.
- Se necesita **flexibilidad** para reordenar sin esperar al cierre de un sprint.
- El problema principal es **cuellos de botella** o **demasiado trabajo a la vez**; visualizar y limitar WIP ayuda directamente.
- El equipo quiere **evolucionar el proceso** sin adoptar todo el paquete de Scrum.

Puede ser menos adecuado si el equipo necesita **disciplina externa** muy explícita (roles y fechas fijas) y aún no tiene hábitos de priorización ni límites de trabajo en curso.

---

## Conclusión

**Agile** define **por qué** trabajar de forma iterativa y colaborativa. **Scrum** ofrece un **marco con sprints, roles y eventos** para entregar producto de forma regular. **Kanban** ofrece **visualización y control del flujo** con límites de trabajo en curso, sin imponer la estructura temporal de Scrum. La elección depende del tipo de trabajo, de la estabilidad de las prioridades y de la madurez del equipo; en muchos contextos se combinan ideas de ambos mundos siempre que se respeten los principios de transparencia, inspección y adaptación.
