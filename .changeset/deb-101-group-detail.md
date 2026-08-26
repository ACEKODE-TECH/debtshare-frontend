---
"debtshare-frontend": minor
---

feat(DEB-101): vista de detalle de grupo con feed de gastos

- Nueva página `/app/groups/:groupId` con breadcrumb a la lista, selector de grupos (dropdown con avatar y check en el actual), stats chip row (mi balance, total gastado, miembros) y botón "Nuevo gasto" (deshabilitado hasta DEB-104).
- Feed de gastos ordenado cronológicamente y agrupado por sección de fecha ("Hoy", "Ayer", "Miércoles · 3 sep", "Marzo 2025") — no una tabla plana.
- Cada `ExpenseFeedItem` muestra icono de categoría con tint, descripción, quién pagó (con avatar), número de personas del split y — desde la perspectiva del usuario — importe total + "Prestas / Debes / No participas".
- Nuevo `GET /api/groups/:groupId/expenses` enriquece cada item con `paidByUser`, `myShare` y `splitCount` para pintar el feed sin llamadas adicionales.
- Empty state ilustrado, skeleton loading y estados de error con retry.
- Selector de grupos vive dentro del detalle (no en el sidebar) para saltar entre grupos sin volver al listado.
