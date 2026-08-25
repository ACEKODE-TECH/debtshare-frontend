---
"debtshare-frontend": patch
---

feat(DEB-100): añadir filtro por estado al listado de grupos

- Nueva fila de chips (Todos · Con actividad · Liquidados) con contador por estado, siguiendo el mockup mobile de la sección 6.
- El filtro se combina con el buscador local; la card final "Crear nuevo grupo" solo aparece con la vista "Todos" y sin búsqueda activa.
- Mensajes vacíos específicos por filtro cuando el resultado queda en cero.
