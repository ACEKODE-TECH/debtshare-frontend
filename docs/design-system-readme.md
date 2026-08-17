# Handoff: Debtshare — diseño desde cero

## Overview

Debtshare es una app para dividir gastos entre grupos (piso, viaje, cena, coworking…) al estilo Splitwise. Este handoff contiene el sistema visual completo y 13 flujos/pantallas diseñadas: onboarding, login, dashboard, crear grupo, añadir gasto, detalle de gasto, liquidación, notificaciones, invitar a grupo, aterrizaje del enlace de invitación y perfil con analítica.

## About the Design Files

Los archivos de este bundle son **referencias de diseño creadas en HTML** — prototipos que muestran el aspecto y comportamiento esperado, **no código de producción para copiar tal cual**. La tarea es **recrear estos diseños en el entorno objetivo** (React/Next.js, React Native, SwiftUI, Flutter, etc.) usando los patrones y librerías establecidas del codebase. Si aún no hay codebase, la recomendación por defecto es **Next.js + TypeScript + Tailwind** para web y **React Native (Expo) + NativeWind** para móvil, compartiendo los tokens de diseño.

El archivo principal `Debtshare Directions.dc.html` es un **design doc** con todas las pantallas apiladas en secciones (`t1`…`t13`). Cada sección puede contener 1-3 variantes (11a/11b, 12a/12b…). Las URLs `#1a`, `#12b`, etc. saltan a cada variante.

## Fidelity

**High-fidelity (hifi)**. Los diseños son pixel-perfect en cuanto a color, tipografía, spacing, radios y sombras. Deben recrearse fielmente. La única capa que puede simplificarse es la ilustración/emoji del onboarding, que es placeholder.

## Idioma

Todo el copy está en **español (es-ES)**. Formato de moneda: `1.284,50 €` (miles con punto, decimales con coma, símbolo al final con espacio). Fechas: `4 ago 2026`.

---

## Design Tokens

### Color

#### Neutros

| Token         | Hex       | Uso                                        |
| ------------- | --------- | ------------------------------------------ |
| `neutral-0`   | `#ffffff` | Fondo de tarjetas                          |
| `neutral-25`  | `#fafbfc` | Fondos secundarios sutiles, inputs         |
| `neutral-50`  | `#f5f6fa` | Fondo de pantalla, chips neutros           |
| `neutral-75`  | `#eceef3` | Fondo del "lienzo" fuera del móvil         |
| `neutral-100` | `#eef0f4` | Borde muy suave de tarjeta                 |
| `neutral-150` | `#e5e7eb` | Borde estándar, divisores                  |
| `neutral-200` | `#d1d5db` | Handle del bottom sheet                    |
| `neutral-300` | `#9ca3af` | Iconografía inactiva, chevrons             |
| `neutral-500` | `#6b7280` | Texto secundario                           |
| `neutral-700` | `#374151` | Texto sobre chips claros, botón secundario |
| `neutral-900` | `#111827` | Texto principal, botón primario oscuro     |

#### Primario (azul Debtshare)

| Token       | Hex       | Uso                                                  |
| ----------- | --------- | ---------------------------------------------------- |
| `brand-50`  | `#eff3fe` | Fondo de item de nav activo                          |
| `brand-100` | `#eff6ff` | Fondo de icon-box brand                              |
| `brand-200` | `#dbeafe` | Fondo de icon-box grupo                              |
| `brand-500` | `#3b6ef6` | **Primario** — botones, links, focus, bordes activos |
| `brand-600` | `#2563eb` | Icono sobre brand-200, gradiente end                 |
| `brand-700` | `#5b8af6` | Gradiente start del logo/hero                        |

> **Nota:** dos variantes de indigo (`#4f46e5`) y navy (`#1e3a8a`) aparecen como acentos secundarios en categorías/estados y deberían formalizarse o eliminarse (ver "Desviaciones conocidas" al final).

#### Semánticos

| Token         | Hex       | Uso                                       |
| ------------- | --------- | ----------------------------------------- |
| `success-500` | `#059669` | Balance a favor, confirmación             |
| `success-100` | `#d1fae5` | Fondo de badge success                    |
| `success-50`  | `#f0fdf4` | Fondo de badge suave                      |
| `danger-500`  | `#dc2626` | Balance en contra, error, logout          |
| `danger-100`  | `#fee2e2` | Fondo de icon-box error                   |
| `danger-200`  | `#fecaca` | Gradiente error end                       |
| `warning-500` | `#d97706` | Icono de aviso                            |
| `warning-100` | `#fef3c7` | Fondo de badge warning, pill de caducidad |
| `warning-200` | `#fde68a` | Borde/gradiente warning                   |
| `warning-700` | `#92400e` | Texto sobre warning-100                   |

#### Categorías de gasto (paleta funcional)

| Categoría    | Foreground | Background |
| ------------ | ---------- | ---------- |
| Compra       | `#d97706`  | `#fef3c7`  |
| Restaurantes | `#be185d`  | `#fce7f3`  |
| Casa         | `#2563eb`  | `#dbeafe`  |
| Transporte   | `#059669`  | `#d1fae5`  |
| Ocio         | `#4f46e5`  | `#e0e7ff`  |
| Otros        | `#6b7280`  | `#f3f4f6`  |

### Tipografía

- **Familia:** `Plus Jakarta Sans` (Google Fonts, pesos 400/500/600/700/800). Fallback: `system-ui, -apple-system, sans-serif`.
- **Escala:**

| Rol      | Size       | Weight  | Letter-spacing       | Uso                            |
| -------- | ---------- | ------- | -------------------- | ------------------------------ |
| Display  | 32-34 px   | 800     | -0.7px               | Título hero                    |
| H1       | 26 px      | 800     | -0.7px               | Título de pantalla (web)       |
| H2       | 22-24 px   | 800     | -0.5px               | Título de card, monto grande   |
| H3       | 17-20 px   | 800     | -0.3 a -0.5px        | Título de sección              |
| Body-lg  | 15 px      | 600-700 | 0                    | CTA principal                  |
| Body     | 13-13.5 px | 500-600 | 0                    | Texto general, filas           |
| Body-sm  | 12-12.5 px | 500-600 | 0                    | Texto secundario               |
| Caption  | 11-11.5 px | 600-700 | 0                    | Metas, timestamps              |
| Overline | 10.5-11 px | 700-800 | 0.4-0.6px, UPPERCASE | Etiquetas de sección           |
| Mono     | 11-12 px   | 600-700 | 0                    | Handles `@alias`, URLs, tokens |

Mono usa `ui-monospace, Menlo, monospace`.

### Espaciado

Escala base 4 px: `4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40 px`.

- Padding tarjeta mobile: `16-20 px`
- Padding tarjeta web: `20-24 px`
- Gap entre tarjetas: `12-16 px`
- Gap dentro de fila: `8-12 px`

### Radios

| Token         | Valor         | Uso                                      |
| ------------- | ------------- | ---------------------------------------- |
| `radius-xs`   | 6 px          | Chips pequeños, badges de porcentaje     |
| `radius-sm`   | 8 px          | Chips, badges medianos, botones pequeños |
| `radius-md`   | 10-11 px      | Botones estándar, inputs, item de nav    |
| `radius-lg`   | 12 px         | Cards pequeñas, tabs container           |
| `radius-xl`   | 14-16 px      | Cards estándar                           |
| `radius-2xl`  | 18 px         | Cards destacadas                         |
| `radius-3xl`  | 22 px         | Bottom sheets, hero cards                |
| `radius-full` | 9999 px / 50% | Avatares, handle del sheet               |

**Radio del móvil:** exterior 44 px, interior 36 px (marco del device frame).

### Sombras

| Token          | Valor                              | Uso                                |
| -------------- | ---------------------------------- | ---------------------------------- |
| `shadow-none`  | —                                  | Cards planas dentro de otras cards |
| `shadow-xs`    | `0 1px 3px rgba(0,0,0,0.06)`       | Tab activa dentro de container     |
| `shadow-sm`    | `0 2px 6px rgba(59,110,246,0.28)`  | Botón primario                     |
| `shadow-md`    | `0 8px 20px rgba(59,110,246,0.32)` | CTA hero                           |
| `shadow-lg`    | `0 12px 30px rgba(0,0,0,0.06)`     | Hero card                          |
| `shadow-xl`    | `0 22px 60px rgba(0,0,0,0.13)`     | Device frame, contenedor web       |
| `shadow-2xl`   | `0 24px 60px rgba(15,20,30,0.20)`  | Modal centrado                     |
| `shadow-sheet` | `0 -18px 40px rgba(0,0,0,0.12)`    | Bottom sheet                       |

### Iconos

- **Librería:** Lucide (o equivalente stroke-based). Stroke width **1.8-2.2**, `stroke-linecap:round`, `stroke-linejoin:round`.
- **Tamaños:** 11, 13, 14, 16, 18, 20, 22 px según el contenedor.
- **Icon box:** cuadrado con radio 8-10 px, fondo de tono claro (`brand-100`, `success-100`, categoría-bg), icono en tono oscuro correspondiente. Tamaños comunes 26/28/30/32/38/44 px.
- El **logo de Debtshare** es un icono `+` blanco sobre gradiente `linear-gradient(135deg, #3b6ef6, #5b8af6)`, radio 8-11 px.

### Motion

- Transición estándar: `200ms ease-out`.
- Spinner de búsqueda: `1s linear infinite`, border-top color `brand-500` sobre `neutral-150`.

---

## Screens / Views

Cada pantalla vive en su sección del design doc. IDs de referencia y variantes:

### t1 — Onboarding (introducción)

- **Ids:** `#1a` (variante A).
- **Propósito:** primer contacto, explicar qué hace Debtshare en 3-4 slides.
- **Layout mobile:** device frame 390×844. Ilustración + título + subtítulo + dots + CTA "Continuar" primario y "Saltar" texto.

### t2 — Selección de moneda / preferencias iniciales

- Post-onboarding, selección de moneda por defecto (EUR).

### t3 — Login / Sign up

- Email + contraseña, botón "Continuar con Google", link "Olvidé la contraseña".

### t4 — Home / lista de grupos

- Card oscura de balance NO (ver desviaciones, ahora todas las cards son claras) → lista de grupos con nombre, miembros, último gasto, balance por grupo.

### t5 — Detalle de grupo (dashboard del grupo)

- **Nota:** aquí SÍ hay evolución temporal (gráfica mensual). Es el único sitio donde vive.
- Cabecera con nombre + miembros, tarjeta "quién debe a quién", lista cronológica de gastos, FAB "+".

### t6 — Crear grupo

- Nombre, avatar (color/emoji picker), miembros iniciales, moneda.

### t7 — Añadir gasto

- Monto grande (numpad), quién pagó, división (equal/percent/exact), categoría (chips), fecha, foto de ticket opcional.

### t8 — Detalle de gasto

- Hero con monto y categoría, quién pagó, división por miembro, botón editar/eliminar, comentarios.

### t9 — Liquidar / Settle up

- Sugerencias de pagos mínimos, botón "Marcar como pagado", integración Bizum.

### t10 — Miembros del grupo

- Lista de miembros, roles (admin), invitar, salir del grupo.

### t11 — Centro de notificaciones — **variantes `#11a` (light) y `#11b` (dark)**

- Dos tabs: **Actividad** (nuevos gastos en tus grupos) e **Invitaciones** (pendientes con Aceptar/Rechazar).
- Timeline de tarjetas con icono de expense, monto, grupo, timestamp, miniatura opcional.
- Empty state por tab.
- Web: sidebar reducida + filas full-width; mobile: header + tabs con underline.
- Badge en la campana del header con contador.

### t12 — Invitar a grupo — **variantes `#12a` (flujo invitar) y `#12b` (aterrizaje del enlace)**

**`#12a` — Modal/sheet de invitar:**

- Segmented tabs: **Enlace** | **Alias**.
- Tab Enlace: URL corta `debtshare.app/j/pisocast-a7f2k9`, botón Copiar (toast "Enlace copiado"), pill de caducidad "Caduca en 7 días", botón Regenerar. Web: QR real + toggle "Requerir aprobación".
- Tab Alias: input `@` con spinner en vivo, lista de matches (avatar + nombre + `@handle` + grupos en común), estados por match: `Invitar` (CTA azul) / `En grupo` (chip neutro con check) / `Pendiente` (chip warning). Fallback: "invítalo por email".
- Atajos compartir: WhatsApp (`#25d366`), Telegram (`#3b6ef6`), QR (`#111827`), Más.

**`#12b` — Aterrizaje del enlace:**

- Estado **válido** (mobile + web): hero con icon-box del grupo, "Invitación al grupo", nombre grande, "Ana G. te ha invitado" con avatar, stack de 4 avatares de miembros, meta pills (moneda, nº gastos, activo), CTAs "Unirme al grupo" (primario) y "Ahora no".
- Estado **caducado** (mobile + web strip): icon-box warning con reloj, "Esta invitación ya no es válida", detalles (grupo, generado por, caducó hace X), CTAs "Pedir enlace nuevo" (oscuro) y "Ir al inicio".
- Estado **token inválido** (web strip): icon-box danger con círculo tachado, "Este enlace no existe", CTAs "Ir al inicio" y "Reportar problema".

### t13 — Perfil con analítica agregada — **variante `#13a`**

- **Mobile:** identity card (avatar 64 px, nombre, `@handle`, badges de nº grupos/gastos), **tarjeta de balance global** (fondo blanco, monto grande, split te-deben/debes/este mes en 3 columnas con divisores), sección Analítica con selector de rango, 2 KPI cards, tarjeta "Por categoría", tarjeta "Comparativa por grupo", sección Cuenta con settings.
- **Web:** dos columnas — izquierda identidad + balance global (blanca, con te-deben/debes en grid 2×1) + ajustes; derecha: header con range selector 30d/90d/Año/Todo, 4 KPIs (Total gastado, Tu parte, Ticket medio, Liquidaciones), grid 2×1 con **Por categoría** (6 filas: icon-box categoría + label + monto + % + barra fina 6 px) y **Comparativa por grupo** (barras normalizadas al grupo mayor, con overlay más oscuro representando "tu parte", leyenda al pie).
- **Importante:** el perfil NO tiene gráfica de evolución temporal — esa vive solo en el dashboard de cada grupo. Se muestra un link "Evolución temporal en cada grupo →".

---

## Componentes reutilizables

Extraer al menos estos componentes al implementarlo:

1. **`<DeviceFrame>`** — solo necesario si se mantiene el design doc; en producción no aplica.
2. **`<Card>`** — `bg:#fff, border:1px solid #eef0f4, radius:14-18px, padding:16-20px`.
3. **`<IconBox size color>`** — cuadrado con radio 8-10 px, fondo `{color}-100`, icono `{color}-500/600`.
4. **`<Avatar size>`** — círculo con imagen, opcionalmente borde `2.5px solid #fff` para stacks.
5. **`<AvatarStack>`** — 4 avatares con `margin-left:-10px` desde el segundo, borde blanco.
6. **`<Chip variant>`** — variantes: `neutral` (#f3f4f6/#6b7280), `success` (#d1fae5/#059669), `warning` (#fef3c7/#92400e), `danger` (#fee2e2/#dc2626), `brand` (#eff6ff/#3b6ef6).
7. **`<Button variant>`** — `primary` (#3b6ef6/#fff), `dark` (#111827/#fff), `secondary` (#fff/#374151 + border), `ghost` (transparente/#6b7280). Radio 10-14 px, padding vertical 10-16 px.
8. **`<SegmentedTabs>`** — container `bg:#f3f4f6, radius:11px, padding:4px`; item activo `bg:#fff, radius:8px, shadow-xs, weight:700`; item inactivo `color:#6b7280, weight:600`.
9. **`<CategoryRow>`** (usado en la analítica del perfil) — icon-box 28-30 px + label + monto + % + barra 6 px de altura, radio 3 px, con margen izquierdo alineado al final del icon-box.
10. **`<GroupCompareRow>`** — igual pero con overlay superpuesto para "tu parte".
11. **`<StatusBar>`** (mobile) — hora + señal/batería SVG, altura 44 px.
12. **`<BottomSheet>`** — `bg:#fff, radius:28px 28px 0 0, shadow-sheet, padding-top:8px` con handle `44×5 px, radius:3px, bg:#d1d5db`.
13. **`<Modal>`** (web) — centrado, `radius:18px, shadow-2xl, max-width` según contenido; header con icono + título + close; footer sticky con acciones.
14. **`<KPI>`** — overline + valor grande + delta (verde/rojo/neutral).

---

## Interacciones & Comportamiento

- **Navigation:** bottom tab bar en mobile (Inicio, Grupos, Actividad, Perfil), sidebar en web.
- **Notificaciones:** badge con contador en la campana; se limpia al abrir la tab.
- **Invitar:** al pulsar "Copiar" muestra toast success 3s; regenerar invalida el token anterior.
- **Aterrizaje enlace:** si el token es válido y el usuario no está logueado, redirige a login manteniendo el token; si es caducado/inválido, muestra la pantalla correspondiente.
- **Analítica del perfil:** el range selector cambia todos los KPIs y ambas tarjetas (categoría y grupos). Default 90 días.
- **Comparativa por grupo:** ordenada por total del grupo desc; los grupos "liquidados" muestran chip neutro en vez de balance.
- **Búsqueda por alias:** debounce 300 ms, spinner mientras carga, botón "Invitar" primario si no está en el grupo, chip "En grupo" si ya lo está, chip "Pendiente" si ya tiene invitación abierta.

## State Management

- `currentUser` — id, nombre, avatar, handle, email, moneda default.
- `groups[]` — id, nombre, miembros[], moneda, createdAt, totalSpent, userBalance.
- `expenses[]` — id, groupId, amount, currency, category, paidBy, splitMode, splits[], date, receiptUrl, comments[].
- `invitations[]` — id, groupId, invitedBy, invitedUser|token, status (pending/accepted/rejected/expired), expiresAt.
- `notifications[]` — id, type (expense_added|invitation), payload, readAt.
- Analítica del perfil: derivada, no hace falta persistir; caché de agregados por rango con `SWR`/`React Query`.

## Responsive

- **Breakpoint móvil ↔ web:** 768 px.
- Mobile: single column, bottom tab bar.
- Web: sidebar 240 px + main content, grids de 2-4 columnas para KPIs, modales centrados.

## Assets

- Avatares de ejemplo: `https://i.pravatar.cc/{size}?img={n}` — reemplazar por sistema real de avatares.
- Iconos: Lucide (npm `lucide-react` o `lucide-react-native`).
- QR: generar con `qrcode` (npm) contra la URL del enlace.
- Fuente: Plus Jakarta Sans vía Google Fonts o `@fontsource/plus-jakarta-sans`.

---

## Desviaciones conocidas del design system (a resolver antes de implementar)

Del audit realizado sobre las 13 pantallas:

1. **`t5` (Login)** fuerza `font-family: -apple-system, system-ui` en su wrapper. Alinearlo a Plus Jakarta Sans como el resto.
2. **Blues fuera de escala** — `#1e3a8a` (t7/t8) y `#1e40af` (callout en t13). Sustituir por `#2563eb`.
3. **Indigo `#4f46e5` + `#e0e7ff`** — introducido en t13 para la categoría "Ocio". Formalizarlo como token de categoría (queda como está en esta versión).
4. **Radios sueltos** — normalizar `13 px → 12 px` y `20 px → 18 px` en tarjetas.
5. **Sombra outlier** — hero del enlace válido en t12 usa `0 30px 80px rgba(0,0,0,0.35)`; bajar a `shadow-2xl` estándar (`0 24px 60px rgba(15,20,30,0.20)`).

---

## Files

- `Debtshare Directions.dc.html` — design doc completo con todas las pantallas (t1…t13). Cada `<section class="dv-turn" id="tN">` es un flujo; cada `<div class="dv-opt" id="Na">` es una variante. Abrir el archivo en un navegador para verlo.
- `support.js` — runtime del design doc, ignorar para implementación.

## Recomendación de stack

Si no hay codebase aún:

- **Web:** Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui como base de componentes primitivos.
- **Mobile:** Expo (React Native) + NativeWind + `react-native-svg` para los icon boxes y QR.
- **Compartido:** paquete `@debtshare/tokens` con los tokens de color/tipografía/spacing exportados a Tailwind config y a StyleSheet de RN.
- **Backend:** los enlaces de invitación con token firmado (JWT o similar), TTL 7 días, endpoint `POST /invitations/:token/accept`.
