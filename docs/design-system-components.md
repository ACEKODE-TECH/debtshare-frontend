# Componentes base — Debtshare Design System

Referencias a tokens con la notación del JSON en `packages/design-tokens/src/primitives.json` (ej. `color.brand.primary`, `radius.md`, `spacing.lg`).

## 1. Button

### Variantes

| Variante      | Uso                                                              |
| ------------- | ---------------------------------------------------------------- |
| `primary`     | Acción principal (CTA único por vista).                          |
| `secondary`   | Acción secundaria (fondo neutro, borde).                         |
| `ghost`       | Acción terciaria / navegación (sin fondo).                       |
| `destructive` | Eliminar, salir de grupo. Sólo cuando la acción es irreversible. |

### Tamaños

| Tamaño         | Alto mínimo | Padding H         | Texto                           | Icono |
| -------------- | ----------- | ----------------- | ------------------------------- | ----- |
| `sm`           | 32          | `spacing.md` (12) | `typography.body.md` (12) / 700 | 14    |
| `md` (default) | 44          | `spacing.lg` (16) | `typography.body.lg` (14) / 700 | 16    |
| `lg`           | 52          | `spacing.xl` (20) | `typography.body.xl` (15) / 700 | 18    |

Radio: `radius.lg` (12) en todos los tamaños. Nunca pill.

### Estados por variante

**primary**

- `default`: bg `color.brand.primary`, texto `color.text.light.onBrand`, sin borde, shadow `shadow.lg` (0 6px 16px rgba(59,110,246,0.35)).
- `hover`: bg `color.brand.primaryHover` (`#2563eb`), shadow `shadow.lgAlt`.
- `pressed`: bg `color.brand.primaryHover`, shadow `shadow.md`, transform `translateY(1px)`.
- `focus`: mismo que default + anillo 2px solid `color.brand.primaryLight` con offset 2px.
- `disabled`: bg `color.neutral.300` (light) / `color.neutral.775` (dark), texto `color.neutral.550`, sin shadow, sin puntero.
- `loading`: mismos colores que default, contenido reemplazado por spinner 16px color `onBrand`, texto oculto pero el ancho se conserva.

**secondary**

- `default`: bg `color.surface.light.card` (light) / `color.surface.dark.cardAlt` (dark), borde 1px `color.neutral.300` / `color.neutral.775`, texto `color.text.light.primary` / `color.text.dark.primary`, sin shadow.
- `hover`: bg `color.neutral.125` (light) / `color.neutral.825` (dark).
- `pressed`: bg `color.neutral.150` / `color.neutral.850`.
- `focus`: mismo que default + anillo 2px `color.brand.primary`.
- `disabled`: opacidad 0.5 sobre default, texto `color.text.light.muted`.

**ghost**

- `default`: bg transparente, texto `color.text.light.secondary` / `color.text.dark.secondary`, sin borde, sin shadow.
- `hover`: bg `color.neutral.125` / `color.neutral.825`.
- `pressed`: bg `color.neutral.150` / `color.neutral.850`.
- `focus`: anillo 2px `color.brand.primary` con offset 2px.
- `disabled`: opacidad 0.4.

**destructive**

- `default`: bg `color.semantic.error` (`#dc2626`), texto `#fff`, sin borde.
- `hover`: bg oklch(-8% L), `pressed`: bg oklch(-14% L).
- `focus`: anillo `color.semantic.errorLight`.
- `disabled`: bg `color.semantic.errorTint`, texto `color.semantic.error` con opacidad 0.5.

### Icono

- Alineado al texto con `spacing.sm` (8) de separación.
- Icono solo (icon-only button): mantiene alto mínimo del tamaño; ancho == alto; radio idéntico.

### Reglas de comportamiento

- Full-width: el botón se estira sólo si el padre lo indica; nunca por defecto.
- Texto: una sola línea, sin wrap, sin ellipsis. Si no cabe, se sube al tamaño mayor o se acorta la copy.
- Loading: bloquea eventos de puntero; mantiene ancho computado antes del cambio para evitar reflow.
- Transición: 150 ms ease-out sobre `background`, `box-shadow`, `transform`.

## 2. Input (text field)

### Variantes

| Variante   | Uso                                                           |
| ---------- | ------------------------------------------------------------- |
| `text`     | Texto libre corto.                                            |
| `textarea` | Texto largo (mín. 3 líneas).                                  |
| `numeric`  | Cantidades, importes. Alineación derecha cuando es moneda.    |
| `search`   | Con icono lupa a la izquierda y botón clear cuando hay valor. |

### Anatomía

- **Label** (opcional, encima): `typography.body.sm` (11) / 700 / letterSpacing 0.5px / uppercase / color `color.text.light.tertiary`. Separación label→field: `spacing.xs` (6).
- **Field**: contenedor con borde + fondo.
- **Help/error** (debajo): `typography.body.md` (12) / 500. Separación field→help: `spacing.2xs` (4).

### Dimensiones

- Alto mínimo: 44 (mobile) / 40 (web dense).
- Padding H: `spacing.mdPlus` (14). Padding V: 10.
- Radio: `radius.lg` (12).
- Icono interno (search, prefijo €): 16, con `spacing.sm` de separación al texto.
- Texto: `typography.body.lg` (14) / 500 / color `color.text.light.primary`.
- Placeholder: mismo tamaño, color `color.text.light.muted`.

### Estados

| Estado     | Borde                                                            | Fondo (light)              | Fondo (dark)                 | Texto                    |
| ---------- | ---------------------------------------------------------------- | -------------------------- | ---------------------------- | ------------------------ |
| `default`  | 1px `color.neutral.300`                                          | `color.surface.light.card` | `color.surface.dark.cardAlt` | primary                  |
| `hover`    | 1px `color.neutral.425`                                          | ídem                       | ídem                         | primary                  |
| `focus`    | 1.5px `color.brand.primary` + anillo 3px `rgba(59,110,246,0.15)` | ídem                       | ídem                         | primary                  |
| `filled`   | 1px `color.neutral.300`                                          | ídem                       | ídem                         | primary                  |
| `disabled` | 1px `color.neutral.300`                                          | `color.neutral.125`        | `color.neutral.850`          | `color.text.light.muted` |
| `error`    | 1.5px `color.semantic.error` + anillo 3px `rgba(220,38,38,0.12)` | ídem                       | ídem                         | primary                  |
| `readonly` | 1px `color.neutral.250`                                          | `color.neutral.75`         | `color.neutral.875`          | secondary                |

Mensaje de error: `color.semantic.error`, `typography.body.md` (12) / 600. Help text: `color.text.light.tertiary`, `typography.body.md` (12) / 500.

### Reglas de comportamiento

- `numeric`: sólo acepta dígitos y `.` o `,` según locale; el símbolo de moneda es prefijo fijo dentro del field, nunca parte del valor.
- `search clear`: aparece sólo cuando `value.length > 0`; al pulsar restaura foco al field.
- `textarea`: crece verticalmente hasta máx. 6 líneas y luego scroll interno.
- `autofill`: repintar fondo del navegador para que coincida con el token de fondo.

## 3. ExpenseCard (Card de gasto)

### Variantes

| Variante  | Uso                                   |
| --------- | ------------------------------------- |
| `default` | En feed de grupo o inicio.            |
| `compact` | En listas densas (perfil, historial). |
| `settled` | Ya saldado — grayscale suave.         |

### Anatomía (izquierda → derecha)

1. **Icono de categoría** — cuadrado 44×44, radio `radius.mdPlus` (11), fondo tint de categoría, glyph 20 color oscuro de la misma categoría.
2. **Bloque texto** (flex 1):
   - Línea 1: título del gasto, `typography.body.2xl` (17) / 800 / letterSpacing -0.3px / color `text.primary`. Truncado en 1 línea con ellipsis.
   - Línea 2: subtítulo «Pagó X · hace Y», `typography.body.md` (12) / 500 / color `text.tertiary`. Truncado en 1 línea.
3. **Bloque importe** (alineado derecha):
   - Importe total: `typography.body.xl` (15) / 800 / letterSpacing -0.3px / color `text.primary`. Sufijo € no separado.
   - Delta personal: `typography.body.md` (12) / 700 / color `semantic.success` si +, `semantic.error` si −. Prefijo `+` / `−` obligatorio.

### Dimensiones

- Padding: `spacing.lg` (16) V, `spacing.lgPlus` (18) H.
- Gap entre icono / texto / importe: `spacing.mdPlus` (14).
- Radio del card: `radius.xlPlus` (18).
- Fondo: `surface.card`. Borde: 1px `color.neutral.200` (light) / `color.neutral.825` (dark). Sin shadow por defecto.
- Alto mínimo: 76.

### Estados

- `default`: como arriba.
- `hover` (web): borde `color.neutral.350`, shadow `shadow.xs`. Cursor pointer.
- `pressed / active`: bg `color.neutral.125` / `color.neutral.825`.
- `focus` (kb): anillo 2px `color.brand.primary` con offset 2px.
- `settled`: título y subtítulo color `text.muted`; icono con opacidad 0.6; importe delta color `text.tertiary` sin signo cromático; badge pequeño «Saldado» (ver Badge/neutral).

### Categorías (icono + tint)

| Categoría     | Tint bg                    | Glyph color          |
| ------------- | -------------------------- | -------------------- |
| Comida/bebida | `accent.mustardTint`       | `accent.mustardDark` |
| Transporte    | `brand.primaryTint`        | `brand.primary`      |
| Alojamiento   | `accent.plumTint`          | `accent.plum`        |
| Ocio          | `color.neutral.250`        | `color.neutral.700`  |
| Compras       | `semantic.successTintSoft` | `semantic.success`   |
| Otros         | `color.neutral.150`        | `color.neutral.650`  |

### Reglas de comportamiento

- Título trunca a 1 línea; si el importe es muy largo (>7 chars incl. moneda) el título reduce su ancho disponible.
- Importes negativos: signo `−` (minus U+2212), NO guion `-`.
- Formato de moneda: `es-ES` (`1.284,50 €`).
- Delta: si es exactamente `0,00 €`, se muestra «Sin impacto» en `text.tertiary` sin color de signo.

## 4. Avatar

### Variantes

| Variante      | Uso                                     |
| ------------- | --------------------------------------- |
| `image`       | Con URL de foto.                        |
| `initials`    | Fallback: 1–2 letras.                   |
| `placeholder` | Silueta cuando no hay usuario asignado. |

### Tamaños

| Nombre | Diámetro | Ring width | Texto (initials) |
| ------ | -------- | ---------- | ---------------- |
| `xs`   | 20       | 1.5        | 9 / 700          |
| `sm`   | 28       | 1.5        | 11 / 700         |
| `md`   | 36       | 2          | 13 / 800         |
| `lg`   | 48       | 2          | 17 / 800         |
| `xl`   | 64       | 2.5        | 22 / 800         |

Forma: círculo (`radius.pill`). `object-fit: cover`.

### Estados

- `default`: sin ring.
- `current-user`: ring 2.5px `color.brand.primary` (aplicable a `lg`+).
- `selected` (en pickers): ring 2px `color.brand.primary` + halo 2px `rgba(59,110,246,0.2)`.
- `disabled/inactive`: opacidad 0.4, grayscale 100%.
- `loading` (imagen cargando): skeleton `color.neutral.150` con shimmer.

### Initials fallback

- Fondo: color derivado del hash del nombre, tomado de una paleta fija de 8 tints (uno por color acento del sistema).
- Texto: siempre `#fff` para tints saturados, `text.primary` para tints muy claros — decidido por luminancia del bg.
- Genera hasta 2 letras: primera de nombre y primera de apellido; si sólo hay un token, 1 letra.

### AvatarGroup

- Máx. n visibles (default 3). El resto se colapsa en un chip `+N` con mismo diámetro, bg `color.neutral.200`, texto `text.secondary` 11/800.
- Overlap: 30% del diámetro. Cada avatar tiene un borde 2px del color de superficie del padre (para «recortarlos» del apilamiento).
- Orden: current-user primero si está.

## 5. Badge

### Variantes

| Variante       | Fondo                      | Texto                        |
| -------------- | -------------------------- | ---------------------------- |
| `neutral`      | `color.neutral.150`        | `color.text.light.secondary` |
| `brand`        | `color.brand.primaryTint`  | `color.brand.primary`        |
| `success`      | `semantic.successTintSoft` | `semantic.success`           |
| `warning`      | `accent.mustardTint`       | `accent.mustardDark`         |
| `danger`       | `semantic.errorTintSoft`   | `semantic.error`             |
| `plum`         | `accent.plumTint`          | `accent.plum`                |
| `solid.danger` | `semantic.error`           | `#fff`                       |

### Tamaños

| Tamaño | Alto | Padding H             | Texto      | Radio               |
| ------ | ---- | --------------------- | ---------- | ------------------- |
| `sm`   | 18   | `spacing.xs` (6)      | 10 / 800   | `radius.sm` (6)     |
| `md`   | 22   | `spacing.sm` (8)      | 10.5 / 800 | `radius.sm` (6)     |
| `lg`   | 26   | `spacing.smPlus` (10) | 11.5 / 700 | `radius.smPlus` (8) |

Uppercase opcional: para tags de estado (SALDADO, PENDIENTE) sí; para conteos (5 grupos) no.

### Estados

- Estático — no tiene hover/focus salvo que sea clickable (chip filtro). Si lo es, aplica variantes de `ghost` button del mismo color.

### Con punto (dot badge)

- Círculo 6×6 delante del texto, mismo color que el texto, separación `spacing.xs`.

### Numeric badge (para contadores standalone, ej. sobre la campana — ver Bell)

- Ver componente Bell.

## 6. Tabs

### Variantes

| Variante    | Uso                                                              |
| ----------- | ---------------------------------------------------------------- |
| `underline` | Navegación principal dentro de una vista (default).              |
| `pill`      | Filtros compactos (ej. Todos / Pendientes / Saldados).           |
| `segmented` | Toggle binario/ternario en toolbar (ej. periodo 7d / 30d / 90d). |

### underline

- Contenedor: fila con `spacing.2xl` (24) entre tabs, borde inferior 1px `color.neutral.200`.
- Tab: padding 12 V / 0 H (el gap va en el contenedor).
- Texto: 14 / 700, color `text.tertiary` (inactivo) / `text.primary` (activo).
- Indicador activo: barra 2px `color.brand.primary` alineada al borde inferior, ancho == texto.
- Hover: texto → `text.secondary`.
- Focus: anillo 2px `color.brand.primary` sobre el tab completo.
- Disabled: opacidad 0.4, sin puntero.

### pill

- Contenedor: `display:flex; gap: spacing.sm` (8).
- Tab: padding 8 V / `spacing.md` (12) H, radio `radius.smPlus` (8), texto 12 / 700.
- Inactivo: bg transparente, texto `text.tertiary`, borde 1px `color.neutral.300`.
- Activo: bg `color.brand.primaryTint`, texto `color.brand.primary`, sin borde.
- Hover inactivo: bg `color.neutral.125`.

### segmented

- Contenedor: fila con bg `color.neutral.125` / (dark) `color.neutral.850`, radio `radius.smPlus` (8), padding 3.
- Tab: padding 6 V / `spacing.md` H, radio `radius.sm` (6), texto 11.5 / 600.
- Inactivo: bg transparente, texto `text.tertiary`.
- Activo: bg `surface.card`, shadow `shadow.xs`, texto `text.primary`.

### Reglas de comportamiento

- Overflow horizontal: en mobile permite scroll horizontal sin scrollbar visible; el tab activo se auto-centra al cambiar.
- Cambio de tab: transición 150 ms del indicador (underline) o del pill activo.
- Contador por tab (opcional): número como sufijo « · 3» en `text.tertiary` (nunca en Badge encima).

## 7. Bell (notificación con badge)

### Anatomía

- Contenedor cuadrado tipo icon-button: 36×36, radio `radius.mdPlus` (11), bg `surface.card`, borde 1px `color.neutral.300`.
- Icono campana: 16, color `text.secondary`.
- Numeric badge en esquina sup-derecha.

### Numeric badge

- Formato: círculo mínimo 16×16 cuando es 1 dígito; se convierte en pill (radio `pill`) para 2+ dígitos con padding H 4.
- Alto: 16 fijo.
- bg `color.semantic.error`, texto `#fff`, `typography.body.2xs` (10) / 800.
- Posición: `top: -4px; right: -4px` respecto al contenedor.
- Borde: 2px del color de superficie del padre (para recortar del icon-button).

### Reglas de comportamiento (números)

- `0` → no se renderiza el badge.
- `1–99` → número exacto.
- `>99` → literal `99+`.
- `>999` → literal `99+` igualmente (nunca `1k+`).
- Cambio de valor: animación `scale 0.6 → 1.0` en 200 ms `ease-out` sólo cuando pasa de 0 a >0, o cuando el número aumenta. Al bajar a 0, fade-out 150 ms.
- Solo dot (sin número, para señalar «hay algo nuevo»): círculo 8×8, mismos colores, misma posición, sin texto. Se usa cuando `unread > 0` pero no interesa mostrar el conteo.

### Estados del bell

- `default`: como anatomía.
- `hover`: bg `color.neutral.125`.
- `pressed`: bg `color.neutral.150`.
- `focus`: anillo 2px `color.brand.primary` offset 2px.
- `open` (menú desplegado): bg `color.brand.primaryTint`, icono `color.brand.primary`.

## 8. EmptyState

### Variantes

| Variante  | Uso                                        |
| --------- | ------------------------------------------ |
| `neutral` | No hay datos aún (feed vacío, sin gastos). |
| `success` | Estado positivo (todo saldado).            |
| `error`   | Fallo al cargar.                           |
| `search`  | Sin resultados de búsqueda/filtro.         |

### Anatomía (vertical, centrado)

- **Ilustración/icono contenedor**: círculo 72×72, bg tint según variante, glyph 32 dentro.
- **Título**: `typography.display.xs` (20) / 800 / letterSpacing -0.3px / `text.primary`. Margen sup 20.
- **Descripción**: `typography.body.lg` (14) / 500 / line-height 1.5 / `text.tertiary`. Max-width 320. Margen sup 8.
- **CTA** (opcional): Button primary `md` o secondary `md`. Margen sup 20.
- **Link secundario** (opcional): ghost `sm`. Margen sup 12.

### Tokens por variante

| Variante  | Bg icono                   | Color icono                 |
| --------- | -------------------------- | --------------------------- |
| `neutral` | `color.neutral.150`        | `color.text.light.tertiary` |
| `success` | `semantic.successTintSoft` | `semantic.success`          |
| `error`   | `semantic.errorTintSoft`   | `semantic.error`            |
| `search`  | `brand.primaryTint`        | `brand.primary`             |

### Dimensiones del contenedor

- Padding V: `spacing.4xl` (44) mínimo por lado.
- Padding H: `spacing.2xl` (24) mínimo.
- Alineación horizontal centrada; alineación vertical centrada dentro del contenedor padre siempre que haya altura disponible.

### Reglas de comportamiento

- Máximo 1 CTA primario. Si hay 2 acciones, la segunda es `ghost` debajo.
- Descripción: máx. 2 líneas de texto (aprox. 140 caracteres). Si el mensaje requiere más, mover a un modal informativo.
- `search`: la descripción debe incluir el término buscado entre comillas cuando aplique; CTA sugerida «Limpiar filtros» (ghost).
- `error`: CTA obligatoria «Reintentar» (secondary). No mostrar tecnicismos del error al usuario final.
- No usar en modales pequeños (<320px de alto); ahí prefiere una línea de texto neutral.

---

Los tokens de dark mode se resuelven automáticamente sustituyendo `color.surface.light.*` por `color.surface.dark.*` y `color.text.light.*` por `color.text.dark.*`; el resto de tokens (brand, semantic, accent) es cross-theme salvo que se indique variante explícita en la tabla.
