# debtshare-frontend

## 0.3.0

### Minor Changes

- [#58](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/58) [`68bb37c`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/68bb37c4f3407792cc6fe86873489c2539b7bd99) Thanks [@Fer97p](https://github.com/Fer97p)! - feat(DEB-100): listado de grupos + creación

  - Nueva página `/app/groups` con grid de cards, header con balance global agregado, buscador local y card final para crear grupo (siguiendo el mockup de la sección 6).
  - Cada card muestra icono coloreado según categoría, badge de estado (activo/liquidado), stack de avatares, contadores de miembros y gastos, saldo del usuario en la moneda del grupo y tiempo relativo de la última actividad.
  - Modal de creación con RHF + Zod (nombre, descripción opcional con contador 0/140, moneda EUR/USD/GBP y picker de icono con 10 opciones).
  - Nuevo tipo `GroupSummary` y extensión de `GET /api/groups` para devolver `memberCount`, `expenseCount`, `totalExpenses`, `myBalance`, `status`, `lastActivityAt` y `memberPreview`.
  - Nuevo componente base `Modal` (Radix Dialog) reutilizable y catálogo de iconos de grupo con tints por defecto (`getGroupEmoji`, `getGroupIconTint`) — dedupe del emoji map que estaba disperso en Sidebar y CommandPalette.
  - Namespace i18n `groups` con todas las cadenas de listado y creación.
  - Estado vacío ilustrado (blobs + card + plus badge) y skeleton de carga por card.

- [#59](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/59) [`a10b33b`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/a10b33b7f69aa5aac4d38cae226bbccaba056966) Thanks [@Fer97p](https://github.com/Fer97p)! - feat(DEB-101): vista de detalle de grupo con feed de gastos

  - Nueva página `/app/groups/:groupId` con breadcrumb a la lista, selector de grupos (dropdown con avatar y check en el actual), stats chip row (mi balance, total gastado, miembros) y botón "Nuevo gasto" (deshabilitado hasta DEB-104).
  - Feed de gastos ordenado cronológicamente y agrupado por sección de fecha ("Hoy", "Ayer", "Miércoles · 3 sep", "Marzo 2025") — no una tabla plana.
  - Cada `ExpenseFeedItem` muestra icono de categoría con tint, descripción, quién pagó (con avatar), número de personas del split y — desde la perspectiva del usuario — importe total + "Prestas / Debes / No participas".
  - Nuevo `GET /api/groups/:groupId/expenses` enriquece cada item con `paidByUser`, `myShare` y `splitCount` para pintar el feed sin llamadas adicionales.
  - Empty state ilustrado, skeleton loading y estados de error con retry.
  - Selector de grupos vive dentro del detalle (no en el sidebar) para saltar entre grupos sin volver al listado.

- [#61](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/61) [`1ed5785`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/1ed5785ad88ff72954dda7f20e98474586fd94a8) Thanks [@Fer97p](https://github.com/Fer97p)! - feat(DEB-104): formulario de nuevo gasto con reparto igualitario

  - Nuevo modal `NewExpenseModal` en el detalle de grupo: importe grande centrado, descripción, chips de categoría (una por cada `Category` con emoji + tint), fecha (default hoy, sin futuro), pagador (dropdown con avatar) y reparto por avatares con toggle include/exclude.
  - El "cada uno" se recalcula **en vivo** al cambiar importe/miembros; los céntimos sobrantes se los queda quien pagó (regla de negocio §9.1) — validado con 8 casos unitarios en `computeEqualShares`.
  - Nuevos hooks: `useGroupMembers` (GET /groups/:id/members hidratado con usuario) y `useCreateExpense` (POST + invalidación de expenses / balances / groups queries).
  - Botón "Añadir gasto" del `GroupDetailPage` activado (header y empty state); el "Nuevo gasto" del command palette abre el modal en el grupo activo.
  - Validación live con `mode: onChange` + `delayError: 350ms` (mismo patrón que `CreateGroupModal`).
  - Nuevo namespace `groups.expense.*` (top-level en el JSON para reutilización desde cualquier página).

- [#63](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/63) [`3545abb`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/3545abb123bffb46b191df2ee0679fc0f45f4a5a) Thanks [@Fer97p](https://github.com/Fer97p)! - feat(DEB-106): soporte básico multi-moneda

  - Selector de moneda (`EUR / USD / GBP`) en el `NewExpenseModal` — cada gasto puede tener una moneda distinta a la del grupo.
  - Hint "≈ 45,20 EUR · tasa simulada" bajo el importe cuando difiere, alimentado por `GET /api/exchange-rates?from=X&to=Y`.
  - `ExpenseFeedItem` muestra una línea secundaria "≈ N EUR" cuando el gasto está en otra moneda que la del grupo.
  - Nuevo hook `useExchangeRate(from, to)` con cache de 1h y helper `convertAmount`.
  - Mocks (`groups`, `balances`) ahora convierten cross-currency antes de sumar: `myBalance`, `totalExpenses`, settlements y balances por miembro se calculan siempre en la moneda del grupo.
  - Tabla `RATES` extraída a `src/mocks/exchange.ts` para consistencia entre handlers.
  - Seed: un gasto de Time Out Market en USD para probar la conversión.

- [#52](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/52) [`37bdb54`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/37bdb547b054b91fab64da4e76221290a186d851) Thanks [@Fer97p](https://github.com/Fer97p)! - Add authenticated app layout with sidebar navigation, workspace-style group switcher, notification badge, and responsive mobile bottom tabs

- [#53](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/53) [`6b52c47`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/6b52c47a63fe1033fddabe859905ffb94c1211e6) Thanks [@Fer97p](https://github.com/Fer97p)! - Restructure app routes and add invitation flow with returnTo redirect

- [#54](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/54) [`b387b9d`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/b387b9d24e05744769854d780d5d98eccfd0ae16) Thanks [@Fer97p](https://github.com/Fer97p)! - Add command palette (Ctrl+K / Cmd+K) with fuzzy search for navigation, group switching, creating expenses, and theme toggle. Add subtle CSS page transitions between app routes.

- [#50](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/50) [`fae9e86`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/fae9e869254b9b20d97eae6f92afd35516c4e59f) Thanks [@Fer97p](https://github.com/Fer97p)! - Add login screen with simulated auth layer, route guards, theme toggle, and i18n system

- [#46](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/46) [`e6c791f`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/e6c791fdf66ba6d6922b149beedca982135fd337) Thanks [@Fer97p](https://github.com/Fer97p)! - Add complete mock data layer: MSW handlers with full CRUD for all domain entities, faker-based factories, in-memory DB, cursor-based pagination, simulated OCR endpoint, and API contract documentation

- [#51](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/51) [`3953f08`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/3953f088a24c8b4f7005682613a66f0e9b0f0a4b) Thanks [@Fer97p](https://github.com/Fer97p)! - Add registration page with alias availability check, password strength meter, and terms acceptance

### Patch Changes

- [#60](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/60) [`ca7ff4a`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/ca7ff4a155a1d82d3890515b18b8b44761ccdc2f) Thanks [@Fer97p](https://github.com/Fer97p)! - feat(DEB-100): añadir filtro por estado al listado de grupos

  - Nueva fila de chips (Todos · Con actividad · Liquidados) con contador por estado, siguiendo el mockup mobile de la sección 6.
  - El filtro se combina con el buscador local; la card final "Crear nuevo grupo" solo aparece con la vista "Todos" y sin búsqueda activa.
  - Mensajes vacíos específicos por filtro cuando el resultado queda en cero.

## 0.2.0

### Minor Changes

- [#32](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/32) [`8a8a13d`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/8a8a13da8830cbf31918da0334337063738a019f) Thanks [@Fer97p](https://github.com/Fer97p)! - Add ExpenseCard component with default, compact and settled variants, 6 category icons with tint colors, and es-ES currency formatting

- [#35](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/35) [`c469001`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/c46900107923b5178a03cad942d932cd4900753d) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Tabs component with underline, pill, and segmented variants

- [#31](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/31) [`65a82f2`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/65a82f2da4aebcd2ceca9b32a18fab8c6db15fee) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Input component with text, textarea, numeric and search variants

- [#37](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/37) [`9bcb01b`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/9bcb01bb40d7838042cc933b0a113b04c5fcb3cf) Thanks [@Fer97p](https://github.com/Fer97p)! - Add EmptyState component with neutral, success, error and search variants

- [#29](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/29) [`99bff84`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/99bff84f05908b3f53050af01eabb1c303637cfc) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Button component with CVA variant system, cn utility, and self-hosted Plus Jakarta Sans typography

- [#38](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/38) [`bb918ff`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/bb918ff71104913f08e349ce30e213df799774ab) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Storybook with dark mode toggle, stories for all components, and remove showcase pages

- [#34](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/34) [`a3f1372`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/a3f137250452a83b85b378a51671ef1450182176) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Badge component with 7 color variants, 3 sizes, dot badge, and uppercase support

- [#36](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/36) [`39e9c50`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/39e9c50a4cf82544f428121edcd049328338362b) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Bell notification button with numeric badge, dot mode and pop animation

- [#33](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/33) [`93c4462`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/93c44624fd9a66c7a6cd8f4580da05fa823eef2f) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Avatar component with initials, image, placeholder variants and AvatarGroup

### Patch Changes

- [#39](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/39) [`b37f182`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/b37f182b8753ce717c74094268058c86442dbceb) Thanks [@Fer97p](https://github.com/Fer97p)! - Add Chromatic visual regression workflow to CI

- [#40](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/40) [`9893f88`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/9893f88fbaa0d14419959519cf39bf1d3f03a0c2) Thanks [@Fer97p](https://github.com/Fer97p)! - Add custom SVG illustrations for empty states

- [#33](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/33) [`93c4462`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/93c44624fd9a66c7a6cd8f4580da05fa823eef2f) Thanks [@Fer97p](https://github.com/Fer97p)! - Fix self-referencing CSS variable declarations in token build that caused broken colors in dark mode

- [#41](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/41) [`4292206`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/42922062484c3ad0951fc32b42407af24ac38252) Thanks [@Fer97p](https://github.com/Fer97p)! - Add automated release notes publishing to Confluence: the CHANGELOG entry plus a live Jira-issues table for the referenced tickets, published under a per-project page hierarchy

- [#35](https://github.com/ACEKODE-TECH/debtshare-frontend/pull/35) [`c469001`](https://github.com/ACEKODE-TECH/debtshare-frontend/commit/c46900107923b5178a03cad942d932cd4900753d) Thanks [@Fer97p](https://github.com/Fer97p)! - Configure tailwind-merge to recognize custom font-size tokens, preventing text-color class conflicts
