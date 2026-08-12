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

### Release notes en Confluence

Cuando `release.yml` publica la GitHub Release (evento `release: published`),
se dispara `release-notes.yml`. Ese workflow:

1. Calcula el tag anterior y el actual (orden semver, no por fecha).
2. Extrae los tickets `DEB-XXXX` mencionados en los commits de ese rango.
3. Consulta cada ticket en Jira (resumen, tipo, estado).
4. Extrae del `CHANGELOG.md` el bloque de esa version.
5. Compone una pagina en Confluence (formato storage) con el changelog arriba
   y los tickets agrupados por tipo debajo, y la crea via API.

Si algun ticket no existe en Jira (404) o Confluence rechaza la creacion, el
job falla explicitamente en el log y **no** se publica una pagina a medias:
primero se resuelven todos los tickets, y solo si todos resuelven bien se
llama a Confluence.

Requiere los secrets documentados en
["Secrets para Release Notes"](#secrets-para-release-notes-confluence--jira)
mas abajo.

**Probarlo sin esperar a un release real:** el workflow tambien acepta
`workflow_dispatch` (pestaña **Actions > Release Notes > Run workflow**)
pidiendo un tag `vX.Y.Z` ya existente. Esto **no es un dry-run**: llama a las
APIs reales de Jira/Confluence y crea una pagina real. Usalo solo para
validar que los secrets funcionan, no lo dispares contra el mismo tag mas de
una vez (crearia paginas duplicadas).

## Scripts utiles

| Script                          | Descripcion                                                                                                            |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`                   | Servidor de desarrollo con mocks                                                                                       |
| `npm run lint`                  | ESLint                                                                                                                 |
| `npm run typecheck`             | Comprobacion de tipos                                                                                                  |
| `npm run test`                  | Tests en modo watch                                                                                                    |
| `npm run test:run`              | Tests una sola vez                                                                                                     |
| `npm run e2e`                   | Tests E2E con Playwright                                                                                               |
| `npm run size`                  | Comprobar presupuesto de bundle                                                                                        |
| `npm run build`                 | Build de produccion                                                                                                    |
| `npm run changeset`             | Declarar un cambio para el changelog                                                                                   |
| `npm run release-notes:publish` | Publica la pagina de release notes en Confluence (usado por CI, requiere los secrets de Jira/Confluence en el entorno) |

## Configuracion manual en GitHub

Esto no se puede configurar por codigo y lo gestiona el owner del repo.

### Permitir que Actions abra PRs

**Settings > Actions > General > Workflow permissions** →
**Allow GitHub Actions to create and approve pull requests**.

Ya esta activado. Sin ello el workflow de release no puede abrir la PR de
"Version Packages".

Nota: `default_workflow_permissions` esta en `read`, que es lo correcto y seguro.
Los workflows que necesitan escribir (`release`, `labeler`, `codeql`, `size-limit`)
declaran su propio bloque `permissions:`, que tiene prioridad sobre ese default.

### Proteccion de `main` (rulesets)

La proteccion esta implementada con **rulesets** (Settings > Rules > Rulesets),
no con la proteccion de ramas clasica.

Reglas activas hoy sobre `main`: bloqueo de borrado, bloqueo de force-push,
historial lineal obligatorio, y PR obligatoria.

Dos ajustes pendientes en el ruleset `main`:

- **Required approvals: 2 → 0.** En un repo de un solo desarrollador nadie puede
  aprobar la PR (no puedes aprobar la tuya), asi que con 2 aprobaciones **no se
  puede mergear nada**, incluida la PR de release. Con `bypass_actors` vacio, ni
  siquiera un admin puede saltarselo.
- **Falta "Require status checks to pass"**: añadir `quality` (CI), `e2e` y
  `check` (Semantic PR). Ahora mismo se puede mergear con CI en rojo.

Al exigir historial lineal, mergea con **squash** o **rebase**, nunca merge commit.

### Secrets para Release Notes (Confluence + Jira)

El workflow `release-notes.yml` (ver ["Release notes en
Confluence"](#release-notes-en-confluence) arriba) necesita estos secrets en
**Settings > Secrets and variables > Actions**. Ninguno se puede derivar de
codigo; los crea el owner del repo a mano.

| Secret                      | Valor                                                                                                                      |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `JIRA_BASE_URL`             | URL base del sitio Jira Cloud, sin barra final (ej. `https://acekode.atlassian.net`)                                       |
| `JIRA_EMAIL`                | Email de la cuenta Atlassian usada para autenticar contra la API de Jira                                                   |
| `JIRA_API_TOKEN`            | Token de API de esa cuenta (id.atlassian.com > Security > API tokens)                                                      |
| `CONFLUENCE_BASE_URL`       | URL base del sitio Confluence Cloud, sin barra final (normalmente igual que `JIRA_BASE_URL` si es el mismo site Atlassian) |
| `CONFLUENCE_EMAIL`          | Email de la cuenta usada para autenticar contra la API de Confluence                                                       |
| `CONFLUENCE_API_TOKEN`      | Token de API de esa cuenta                                                                                                 |
| `CONFLUENCE_SPACE_KEY`      | Key del espacio Confluence donde se publican las paginas (ej. `ENG`)                                                       |
| `CONFLUENCE_PARENT_PAGE_ID` | ID numerico de la pagina padre bajo la que cuelgan las releases                                                            |

`JIRA_EMAIL`/`CONFLUENCE_EMAIL` y sus tokens pueden ser la misma cuenta si
Jira y Confluence viven en el mismo site Atlassian — se documentan por
separado porque el script no asume que lo sean.

**Prerrequisito en Confluence (manual, una sola vez):**

1. Debe existir el espacio indicado en `CONFLUENCE_SPACE_KEY`.
2. Dentro de ese espacio debe existir ya una pagina padre (ej. titulada
   "Releases") bajo la que colgaran las paginas que crea este workflow. El
   script no la crea — solo crea paginas hijas de un `ancestors.id` que ya
   tiene que existir. Copia el ID numerico de esa pagina (visible en su URL,
   o en **... > Page information**) a `CONFLUENCE_PARENT_PAGE_ID`.
3. La cuenta de `CONFLUENCE_EMAIL` necesita permiso de creacion de paginas en
   ese espacio.
