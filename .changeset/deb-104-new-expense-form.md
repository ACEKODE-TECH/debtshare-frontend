---
"debtshare-frontend": minor
---

feat(DEB-104): formulario de nuevo gasto con reparto igualitario

- Nuevo modal `NewExpenseModal` en el detalle de grupo: importe grande centrado, descripción, chips de categoría (una por cada `Category` con emoji + tint), fecha (default hoy, sin futuro), pagador (dropdown con avatar) y reparto por avatares con toggle include/exclude.
- El "cada uno" se recalcula **en vivo** al cambiar importe/miembros; los céntimos sobrantes se los queda quien pagó (regla de negocio §9.1) — validado con 8 casos unitarios en `computeEqualShares`.
- Nuevos hooks: `useGroupMembers` (GET /groups/:id/members hidratado con usuario) y `useCreateExpense` (POST + invalidación de expenses / balances / groups queries).
- Botón "Añadir gasto" del `GroupDetailPage` activado (header y empty state); el "Nuevo gasto" del command palette abre el modal en el grupo activo.
- Validación live con `mode: onChange` + `delayError: 350ms` (mismo patrón que `CreateGroupModal`).
- Nuevo namespace `groups.expense.*` (top-level en el JSON para reutilización desde cualquier página).
