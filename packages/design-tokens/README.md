# @debtshare/design-tokens

Single source of truth for colour, typography, spacing, radius and shadow across Debtshare.
The web app consumes the generated CSS and Tailwind theme; the future Kotlin/Compose Multiplatform mobile app will consume its own output from the same primitives.

## Layers

```
src/primitives.json   Raw values delivered by design. Never referenced from components.
src/semantic.json     Roles (text.primary, surface.card, border.default...) — the ONLY layer components read.
```

The semantic layer speaks the same vocabulary as [`docs/design-system-components.md`](../../docs/design-system-components.md), which is the contract for Button, Input, ExpenseCard, Avatar, Badge, Tabs, Bell and EmptyState.

## Outputs

```
build/web/tokens.css           CSS custom properties, themed via [data-theme="dark"].
build/web/tailwind.tokens.js   Object consumed by tailwind.config.js.
build/kotlin/                  Placeholder for a future Compose Multiplatform output.
```

Both files are checked in so the app can consume them without a pre-build step. Regenerate after any change to `src/`.

## Build

From the repo root:

```bash
npm run tokens:build
```

## What is intentionally excluded

- `radius.device.*` and `shadow.device.*` primitives — they render the device chrome of the Claude Design mockup, not the app. Kept in `primitives.json` so the origin of the JSON is traceable; filtered out of every generated output.
- Primitives are hidden from the Tailwind theme so no component can accidentally reach `bg-neutral-300`. If you need a colour, add or use a semantic role.

## Style Dictionary

`style-dictionary.config.mjs` is a placeholder for the eventual Kotlin platform (see the file for the migration path). The web output does not use Style Dictionary today — the build script is small and the mapping shape is bespoke enough that a hand-written script is clearer.
