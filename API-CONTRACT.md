# Contrato de API — Debtshare (mocks)

Cada endpoint listado aqui esta implementado como handler de MSW y definido como constante en `src/lib/endpoints.ts`. Cuando el backend real este listo, este documento sirve para comparar campo a campo y decidir si adaptar el mock al contrato real o negociar cambios.

Todas las rutas llevan el prefijo `/api` (configurado en `VITE_API_BASE_URL`).

---

## Convenciones generales

### Paginacion cursor-based

Los listados largos usan paginacion cursor-based. Parametros de query:

| Param    | Tipo   | Default | Descripcion                 |
| -------- | ------ | ------- | --------------------------- |
| `cursor` | string | —       | ID del ultimo item recibido |
| `limit`  | number | 10-20   | Maximo de items por pagina  |

Respuesta:

```json
{
  "items": [],
  "nextCursor": "exp_42" | null,
  "hasMore": true | false,
  "total": 128
}
```

### Errores

```json
{ "message": "Descripcion del error" }
```

Con status HTTP: 400, 404, 409, 500.

### Latencia simulada

Todos los endpoints tienen latencia aleatoria de 300-900ms. El endpoint de OCR tarda 1500-2500ms.

### Errores aleatorios

Las operaciones de escritura tienen ~4% de probabilidad de devolver 500. Solo se activa con `VITE_ENABLE_MOCK_ERRORS=true`.

---

## Auth

### `GET /api/me`

Devuelve el usuario autenticado actual.

**Response 200:**

```json
{
  "id": "user_1",
  "name": "Marta Sanz",
  "alias": "marta.sanz",
  "email": "marta.sanz@example.com",
  "avatarUrl": null,
  "createdAt": "2025-11-02T09:14:00.000Z"
}
```

---

## Usuarios

### `GET /api/users`

Lista todos los usuarios. Soporta busqueda por nombre, alias o email.

| Param    | Tipo   | Descripcion                      |
| -------- | ------ | -------------------------------- |
| `search` | string | Filtro por nombre, alias o email |

**Response 200:** `User[]`

### `GET /api/users/:id`

**Response 200:** `User`
**Response 404:** usuario no encontrado

### `GET /api/users/alias/:alias`

Busca usuario por alias exacto.

**Response 200:** `User`
**Response 404:** alias no encontrado

### `PUT /api/users/:id`

Actualiza datos del usuario.

**Request body:** campos parciales de `User` (excepto `id`)
**Response 200:** `User` actualizado

---

## Grupos

### `GET /api/groups`

Grupos donde el usuario autenticado es miembro. Cada elemento incluye contadores y estado agregado para pintar la vista de listado sin llamadas adicionales.

**Response 200:** `GroupSummary[]`

```json
[
  {
    "id": "group_6",
    "name": "Viaje a Lisboa",
    "description": "Puente de diciembre, del 4 al 7",
    "currency": "EUR",
    "icon": "flight",
    "createdBy": "user_1",
    "createdAt": "2026-06-14T09:12:00.000Z",
    "memberCount": 3,
    "expenseCount": 14,
    "totalExpenses": 757.42,
    "myBalance": 127.97,
    "status": "active",
    "lastActivityAt": "2026-08-24T18:32:00.000Z",
    "memberPreview": [
      { "id": "user_1", "name": "Marta Sanz", "avatarUrl": null },
      { "id": "user_2", "name": "Diego Ferrer", "avatarUrl": "https://…" }
    ]
  }
]
```

- `myBalance`: saldo del usuario en la moneda del grupo (positivo = le deben, negativo = debe).
- `status`: `"active"` mientras haya cuentas por saldar; `"settled"` cuando todos están a cero.
- `memberPreview`: primeros ≤ 4 miembros (el usuario actual primero) para el stack de avatares.

### `GET /api/groups/:id`

**Response 200:**

```json
{
  "id": "group_1",
  "name": "Viaje a Lisboa",
  "description": "Puente de diciembre, del 4 al 7",
  "currency": "EUR",
  "icon": "flight",
  "createdBy": "user_1",
  "createdAt": "2025-11-02T09:20:00.000Z"
}
```

### `POST /api/groups`

Crea un grupo y añade al usuario actual como primer miembro.

**Request body:**

```json
{
  "name": "Finde en Asturias",
  "description": "Septiembre 2026",
  "currency": "EUR",
  "icon": "mountain"
}
```

**Response 201:** `Group`

### `PUT /api/groups/:id`

**Request body:** campos parciales de `Group`
**Response 200:** `Group` actualizado

### `DELETE /api/groups/:id`

Elimina el grupo y todos sus datos asociados (miembros, gastos, splits, settlements, invitaciones).

**Response 204:** sin cuerpo

---

## Miembros de grupo

### `GET /api/groups/:groupId/members`

**Response 200:**

```json
[
  {
    "id": "gm_1",
    "groupId": "group_1",
    "userId": "user_1",
    "joinedAt": "2025-11-02T09:20:00.000Z",
    "user": {
      "id": "user_1",
      "name": "Marta Sanz",
      "alias": "marta.sanz",
      "email": "marta.sanz@example.com",
      "avatarUrl": null,
      "createdAt": "2025-11-02T09:14:00.000Z"
    }
  }
]
```

### `POST /api/groups/:groupId/members`

Añade un usuario directamente (sin invitacion).

**Request body:**

```json
{ "userId": "user_4" }
```

**Response 201:** `GroupMember` con `user` expandido
**Response 409:** el usuario ya es miembro

### `DELETE /api/groups/:groupId/members/:memberId`

**Response 204:** sin cuerpo

---

## Categorias

### `GET /api/categories`

Lista todas las categorias de gasto. Set fijo, no editable.

**Response 200:**

```json
[
  { "id": "cat_food", "name": "Comida", "icon": "utensils" },
  { "id": "cat_transport", "name": "Transporte", "icon": "car" },
  { "id": "cat_housing", "name": "Alojamiento", "icon": "house" },
  { "id": "cat_leisure", "name": "Ocio", "icon": "gamepad" },
  { "id": "cat_utilities", "name": "Suministros", "icon": "zap" },
  { "id": "cat_shopping", "name": "Compras", "icon": "shopping-bag" },
  { "id": "cat_health", "name": "Salud", "icon": "heart-pulse" },
  { "id": "cat_other", "name": "Otros", "icon": "ellipsis" }
]
```

---

## Gastos

### `GET /api/groups/:groupId/expenses`

Paginacion cursor-based, ordenados por fecha descendente.

| Param        | Tipo   | Descripcion                    |
| ------------ | ------ | ------------------------------ |
| `cursor`     | string | Cursor de paginacion           |
| `limit`      | number | Items por pagina (default: 10) |
| `categoryId` | string | Filtro por categoria           |

**Response 200:** `CursorPage<Expense>`

### `GET /api/expenses/:id`

Devuelve el gasto con sus splits embebidos.

**Response 200:**

```json
{
  "id": "exp_1",
  "groupId": "group_1",
  "description": "Vuelos Madrid-Lisboa",
  "amount": 342,
  "currency": "EUR",
  "categoryId": "cat_transport",
  "date": "2025-11-10T00:00:00.000Z",
  "paidBy": "user_1",
  "createdBy": "user_1",
  "createdAt": "2025-11-10T20:12:00.000Z",
  "receiptId": null,
  "splitMethod": "equal",
  "splits": [
    { "id": "split_1", "expenseId": "exp_1", "userId": "user_1", "amount": 114, "shareValue": null },
    { "id": "split_2", "expenseId": "exp_1", "userId": "user_2", "amount": 114, "shareValue": null },
    { "id": "split_3", "expenseId": "exp_1", "userId": "user_3", "amount": 114, "shareValue": null }
  ]
}
```

Cada elemento del array `items` se enriquece con:

- `paidByUser`: `{ id, name, avatarUrl }` — para pintar el avatar y el "Pagó X" sin lookup adicional.
- `myShare`: cantidad que le toca al usuario actual (0 si no participa en el split).
- `splitCount`: número total de personas entre las que se ha repartido el gasto.

### `POST /api/groups/:groupId/expenses`

Crea un gasto, genera splits automaticamente (equal) y notificaciones para el resto de miembros del grupo.

**Request body:**

```json
{
  "description": "Cena japonesa",
  "amount": 87.6,
  "currency": "EUR",
  "categoryId": "cat_food",
  "date": "2026-01-15T21:00:00.000Z",
  "paidBy": "user_1",
  "excludeMembers": ["user_3"]
}
```

`excludeMembers` es opcional — si se omite, el gasto se divide entre todos los miembros del grupo.

**Response 201:** `Expense` con `splits[]`

### `PUT /api/expenses/:id`

Si cambia el `amount`, los splits se recalculan.

**Request body:** campos parciales de `Expense` + `excludeMembers` opcional
**Response 200:** `Expense` con `splits[]`

### `DELETE /api/expenses/:id`

Elimina el gasto y sus splits.

**Response 204:** sin cuerpo

---

## Tickets (Receipts)

### `GET /api/receipts?groupId=xxx`

| Param     | Tipo   | Descripcion      |
| --------- | ------ | ---------------- |
| `groupId` | string | Filtro por grupo |

**Response 200:** `Receipt[]`

### `GET /api/receipts/:id`

**Response 200:**

```json
{
  "id": "receipt_1",
  "groupId": "group_2",
  "expenseId": "exp_7",
  "merchantName": "Mercadona",
  "merchantTaxId": "A46103834",
  "issuedAt": "2025-12-06T17:48:00.000Z",
  "currency": "EUR",
  "total": 63.75,
  "imageUrl": "/mock-assets/receipts/placeholder.jpg",
  "status": "processed",
  "createdBy": "user_5",
  "createdAt": "2025-12-06T18:00:00.000Z"
}
```

### `POST /api/receipts/process`

Endpoint de OCR simulado. Recibe una imagen como `FormData`, tarda ~2s, devuelve datos extraidos.

**Request:** `multipart/form-data`

| Campo     | Tipo   | Requerido | Descripcion       |
| --------- | ------ | --------- | ----------------- |
| `groupId` | string | si        | Grupo destino     |
| `image`   | File   | si        | Imagen del ticket |

**Response 201:** `Receipt` con `status: "needs_review"`

### `PUT /api/receipts/:id`

Confirmar revision, vincular a un gasto, o editar datos.

**Request body:** campos parciales de `Receipt`
**Response 200:** `Receipt` actualizado

### `DELETE /api/receipts/:id`

**Response 204:** sin cuerpo

---

## Liquidaciones (Settlements)

### `GET /api/groups/:groupId/settlements`

Paginacion cursor-based, ordenados por fecha descendente.

**Response 200:** `CursorPage<Settlement>`

### `GET /api/settlements/:id`

**Response 200:**

```json
{
  "id": "settlement_1",
  "groupId": "group_1",
  "fromUserId": "user_3",
  "toUserId": "user_1",
  "amount": 114,
  "currency": "EUR",
  "status": "completed",
  "settledAt": "2025-12-08T10:00:00.000Z",
  "createdAt": "2025-12-08T09:55:00.000Z"
}
```

### `POST /api/groups/:groupId/settlements`

Registrar una liquidacion ("settle up").

**Request body:**

```json
{
  "fromUserId": "user_3",
  "toUserId": "user_1",
  "amount": 114
}
```

**Response 201:** `Settlement` con `status: "completed"`

### `DELETE /api/settlements/:id`

**Response 204:** sin cuerpo

---

## Balances y deudas

### `GET /api/groups/:groupId/balances`

Balance neto de cada miembro del grupo. Positivo = el grupo le debe; negativo = debe al grupo.

**Response 200:**

```json
[
  { "groupId": "group_1", "userId": "user_1", "amount": 152.23, "currency": "EUR" },
  { "groupId": "group_1", "userId": "user_2", "amount": 26.67, "currency": "EUR" },
  { "groupId": "group_1", "userId": "user_3", "amount": -178.9, "currency": "EUR" }
]
```

### `GET /api/groups/:groupId/debts`

Deudas simplificadas al minimo numero de transacciones. Derivado de los balances.

**Response 200:**

```json
[
  { "from": "user_3", "to": "user_1", "amount": 152.23, "currency": "EUR" },
  { "from": "user_3", "to": "user_2", "amount": 26.67, "currency": "EUR" }
]
```

---

## Invitaciones

### `GET /api/groups/:groupId/invitations`

**Response 200:** `GroupInvitation[]`

### `POST /api/groups/:groupId/invitations`

Crear invitacion por alias o por enlace.

**Request body (alias):**

```json
{
  "method": "alias",
  "alias": "pablo.reyes"
}
```

**Request body (enlace):**

```json
{
  "method": "link"
}
```

**Response 201:**

```json
{
  "id": "inv_1",
  "groupId": "group_1",
  "invitedByUserId": "user_1",
  "method": "alias",
  "token": "a1b2c3d4e5f6",
  "inviteeUserId": "user_4",
  "status": "pending",
  "createdAt": "2026-01-15T10:00:00.000Z"
}
```

**Response 404:** alias no encontrado
**Response 409:** el usuario ya es miembro

### `POST /api/invitations/:id/accept`

Acepta la invitacion y crea el `GroupMember` correspondiente (regla §9.9).

**Response 200:**

```json
{
  "invitation": { "...invitacion con status: accepted..." },
  "member": { "...GroupMember creado..." }
}
```

### `POST /api/invitations/:id/decline`

**Response 200:** `GroupInvitation` con `status: "declined"`

### `GET /api/invitations/token/:token`

Resuelve un enlace de invitacion. Devuelve la invitacion y el grupo para mostrar la pantalla de "Unirse a...".

**Response 200:**

```json
{
  "invitation": { "...GroupInvitation..." },
  "group": { "...Group..." }
}
```

### `POST /api/invitations/token/:token`

Une al usuario actual al grupo via enlace (regla §9.7: sin estado pendiente intermedio).

**Response 201:**

```json
{
  "invitation": { "...GroupInvitation..." },
  "member": { "...GroupMember creado..." }
}
```

**Response 409:** ya es miembro del grupo

---

## Notificaciones

### `GET /api/notifications`

Notificaciones del usuario autenticado, cursor-paginated.

| Param    | Tipo   | Descripcion                                     |
| -------- | ------ | ----------------------------------------------- |
| `cursor` | string | Cursor de paginacion                            |
| `limit`  | number | Items por pagina (default: 20)                  |
| `type`   | string | Filtro: `expense_added` o `invitation_received` |

**Response 200:**

```json
{
  "items": [
    {
      "id": "notif_1",
      "userId": "user_1",
      "type": "expense_added",
      "groupId": "group_1",
      "expenseId": "exp_2",
      "invitationId": null,
      "isRead": false,
      "createdAt": "2025-11-12T10:03:00.000Z"
    }
  ],
  "nextCursor": null,
  "hasMore": false,
  "total": 2,
  "unreadCount": 1
}
```

### `PATCH /api/notifications/:id`

Marca una notificacion como leida/no leida.

**Request body:**

```json
{ "isRead": true }
```

**Response 200:** `Notification` actualizada

### `POST /api/notifications/read-all`

Marca todas las notificaciones del usuario como leidas.

**Response 200:**

```json
{ "markedAsRead": 3 }
```

---

## Tasas de cambio

### `GET /api/exchange-rates`

Tasas de conversion entre divisas soportadas (EUR, USD, GBP). Set fijo.

| Param  | Tipo   | Default | Descripcion               |
| ------ | ------ | ------- | ------------------------- |
| `from` | string | EUR     | Divisa origen             |
| `to`   | string | —       | Divisa destino (opcional) |

**Con `to`:**

```json
{ "from": "EUR", "to": "USD", "rate": 1.085 }
```

**Sin `to` (todas las tasas desde `from`):**

```json
{
  "base": "EUR",
  "rates": { "EUR": 1, "USD": 1.085, "GBP": 0.857 }
}
```
