# Contribuir a Debtshare

## Requisitos previos

- Node.js 22+ (ver `.nvmrc`)
- npm

```bash
npm install
npm run dev
```

## Convenciones de ramas

Cada sección del proyecto se trabaja en su propia rama:

```
feature/DEB-XX-nombre-de-seccion
```

Nunca se commitea directamente a `main`. Toda feature se mergea mediante Pull Request.

## Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/). El hook de `commitlint` rechaza mensajes que no sigan el formato:

```
tipo(scope): descripcion corta
```

Tipos permitidos: `feat`, `fix`, `chore`, `ci`, `docs`, `test`, `refactor`, `perf`, `style`.

El scope suele ser el ticket (ej. `DEB-21`), pero puede ser descriptivo si no hay ticket asociado.

## Flujo de trabajo

1. Crea tu rama desde `main`
2. Desarrolla y commitea siguiendo las convenciones
3. Abre un PR usando la plantilla del repo
4. Espera a que CI pase (lint, format, typecheck, tests, build)
5. Pide review y mergea

## Scripts utiles

| Script              | Descripcion                      |
| ------------------- | -------------------------------- |
| `npm run dev`       | Servidor de desarrollo con mocks |
| `npm run lint`      | ESLint                           |
| `npm run typecheck` | Comprobacion de tipos            |
| `npm run test`      | Tests en modo watch              |
| `npm run test:run`  | Tests una sola vez               |
| `npm run e2e`       | Tests E2E con Playwright         |
| `npm run size`      | Comprobar presupuesto de bundle  |
| `npm run build`     | Build de produccion              |

## Proteccion de rama (configuracion manual en GitHub)

El owner del repo debe activar estas reglas en **Settings > Branches > Add rule** para `main`:

- **Require status checks to pass before merging**: seleccionar los checks `quality` (CI), `e2e` (Playwright), y `check` (Semantic PR)
- **Require branches to be up to date before merging**
- **Do not allow bypassing the above settings**
- **Block direct pushes to main** (solo merge via PR)
