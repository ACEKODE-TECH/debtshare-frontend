---
"debtshare-frontend": minor
---

feat(DEB-100): listado de grupos + creación

- Nueva página `/app/groups` con grid de cards, header con balance global agregado, buscador local y card final para crear grupo (siguiendo el mockup de la sección 6).
- Cada card muestra icono coloreado según categoría, badge de estado (activo/liquidado), stack de avatares, contadores de miembros y gastos, saldo del usuario en la moneda del grupo y tiempo relativo de la última actividad.
- Modal de creación con RHF + Zod (nombre, descripción opcional con contador 0/140, moneda EUR/USD/GBP y picker de icono con 10 opciones).
- Nuevo tipo `GroupSummary` y extensión de `GET /api/groups` para devolver `memberCount`, `expenseCount`, `totalExpenses`, `myBalance`, `status`, `lastActivityAt` y `memberPreview`.
- Nuevo componente base `Modal` (Radix Dialog) reutilizable y catálogo de iconos de grupo con tints por defecto (`getGroupEmoji`, `getGroupIconTint`) — dedupe del emoji map que estaba disperso en Sidebar y CommandPalette.
- Namespace i18n `groups` con todas las cadenas de listado y creación.
- Estado vacío ilustrado (blobs + card + plus badge) y skeleton de carga por card.
