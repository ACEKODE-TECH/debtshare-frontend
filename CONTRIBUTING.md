# Contribuir a Debtshare

## Requisitos previos

- Node.js 22+ (ver `.nvmrc`)
- npm

```bash
npm install
npm run dev
```

## Modelo de ramas (trunk-based)

`main` es la **unica rama larga** del repo. No existe una rama `develop` permanente:
todo sale de `main` y vuelve a `main`.

Cada seccion o tarea se trabaja en una rama corta que se borra al mergear:

```
feature/DEB-XX-nombre-de-seccion
task/DEB-XX-nombre-de-tarea
```

Nunca se commitea directamente a `main`. Toda rama entra mediante Pull Request.
Las ramas se mantienen cortas (dias, no semanas) para evitar divergencia.

## Convenciones de commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/). El hook de `commitlint` rechaza mensajes que no sigan el formato:

```
tipo(scope): descripcion corta
```

Tipos permitidos: `feat`, `fix`, `chore`, `ci`, `docs`, `test`, `refactor`, `perf`, `style`.

El scope suele ser el ticket (ej. `DEB-21`), pero puede ser descriptivo si no hay ticket asociado.

## Flujo de trabajo

1. Crea tu rama corta desde `main`
2. Desarrolla y commitea siguiendo las convenciones
3. Si el cambio es relevante para el usuario final, añade un changeset (ver abajo)
4. Abre un PR usando la plantilla del repo
5. Espera a que CI pase (lint, format, typecheck, tests, build)
6. Mergea a `main` y borra la rama

## Versionado y release (Changesets)

El changelog no se genera adivinando desde los commits: cada PR declara
explicitamente si merece entrar en el changelog y con que tipo de bump.

### Al desarrollar

Si tu PR tiene un cambio relevante para el usuario final:

```bash
npm run changeset
```

Elige el bump (`patch` / `minor` / `major`), escribe un resumen en lenguaje de
usuario, y **commitea el archivo generado** en `.changeset/` junto a tu codigo.

Si el PR no necesita entrar en el changelog (refactor interno, CI, docs), no
añadas changeset. Para dejarlo explicito puedes usar `npx changeset --empty`.

### Al mergear a `main`

El workflow `release.yml` se ejecuta automaticamente:

- **Si hay changesets pendientes**: mantiene abierta y actualizada una PR
  titulada `chore(release): version packages` que acumula todos los cambios
  pendientes. Esa PR **no se mergea en cada feature**, se va acumulando.
- **Al mergear esa PR de release**: sube la version en `package.json`,
  actualiza `CHANGELOG.md`, crea el tag `vX.Y.Z` y publica la GitHub Release
  con ese changelog.

Es decir: tu decides cuando cerrar una version mergeando la PR de release.

> `npx changeset version` no se ejecuta a mano en local: lo hace el bot.
> Requiere `GITHUB_TOKEN` porque el changelog enlaza PRs y autores.

## Scripts utiles

| Script              | Descripcion                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Servidor de desarrollo con mocks     |
| `npm run lint`      | ESLint                               |
| `npm run typecheck` | Comprobacion de tipos                |
| `npm run test`      | Tests en modo watch                  |
| `npm run test:run`  | Tests una sola vez                   |
| `npm run e2e`       | Tests E2E con Playwright             |
| `npm run size`      | Comprobar presupuesto de bundle      |
| `npm run build`     | Build de produccion                  |
| `npm run changeset` | Declarar un cambio para el changelog |

## Configuracion manual en GitHub

Estas dos cosas no se pueden configurar por codigo y las activa el owner del repo.

### 1. Permitir que Actions abra PRs

**Settings > Actions > General > Workflow permissions**:

- Marcar **Allow GitHub Actions to create and approve pull requests**

Sin esto, el workflow de release **no puede abrir la PR de "Version Packages"**
y falla con un error de permisos.

### 2. Proteccion de rama

En **Settings > Branches > Add rule** para `main`:

- **Require status checks to pass before merging**: seleccionar los checks `quality` (CI), `e2e` (Playwright), y `check` (Semantic PR)
- **Require branches to be up to date before merging**
- **Do not allow bypassing the above settings**
- **Block direct pushes to main** (solo merge via PR)
