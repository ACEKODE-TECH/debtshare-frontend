---
"debtshare-frontend": minor
---

feat(DEB-106): soporte básico multi-moneda

- Selector de moneda (`EUR / USD / GBP`) en el `NewExpenseModal` — cada gasto puede tener una moneda distinta a la del grupo.
- Hint "≈ 45,20 EUR · tasa simulada" bajo el importe cuando difiere, alimentado por `GET /api/exchange-rates?from=X&to=Y`.
- `ExpenseFeedItem` muestra una línea secundaria "≈ N EUR" cuando el gasto está en otra moneda que la del grupo.
- Nuevo hook `useExchangeRate(from, to)` con cache de 1h y helper `convertAmount`.
- Mocks (`groups`, `balances`) ahora convierten cross-currency antes de sumar: `myBalance`, `totalExpenses`, settlements y balances por miembro se calculan siempre en la moneda del grupo.
- Tabla `RATES` extraída a `src/mocks/exchange.ts` para consistencia entre handlers.
- Seed: un gasto de Time Out Market en USD para probar la conversión.
