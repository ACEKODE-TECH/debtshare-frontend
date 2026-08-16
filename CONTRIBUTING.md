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

El propio `release.yml` incluye un segundo job (`release-notes`) que se
ejecuta automaticamente despues de publicar la GitHub Release — todo dentro
del mismo workflow, sin depender de un evento `release: published` externo
(GitHub Actions no dispara workflows secundarios desde eventos generados con
`GITHUB_TOKEN`).

El job de release notes:

1. Calcula el tag anterior y el actual (orden semver, no por fecha).
2. Extrae los tickets `DEB-XXXX` mencionados en los commits de ese rango.
3. Extrae del `CHANGELOG.md` el bloque de esa version.
4. Compone la tabla de tickets como un **smart-link de Confluence**: un
   bloque embebido con una JQL (`key in (...)`) que Confluence resuelve en
   directo consultando Jira — no somos nosotros quienes hacemos fetch de
   cada ticket, así que la tabla nunca queda desactualizada (estado,
   asignado, etc. se ven en tiempo real).
5. Publica la pagina bajo `📓 Release Notes`: una unica pagina **compartida
   entre todos los proyectos** del espacio (Mobile, Front-End, Back-End...).
   El script no la crea, solo busca su ID por titulo — debe existir ya. Debajo
   crea o actualiza `<CONFLUENCE_PROJECT_PAGE> Release vX.Y.Z` (hoy
   `"Front-End Release vX.Y.Z"`); re-ejecutar contra el mismo tag actualiza
   esa misma pagina, no genera duplicados. El titulo va cualificado con el
   nombre del proyecto porque Confluence exige titulos unicos **en todo el
   espacio**, no solo entre paginas hermanas — como `📓 Release Notes` es
   compartida, un titulo generico tipo "Release v0.1.0" colisionaria con el
   de otro proyecto.

**Trade-off aceptado a proposito:** al ser un smart-link en vivo, no podemos
detectar en el momento de publicar si un ticket referenciado realmente
existe en Jira — la JQL simplemente omite las keys que no encuentra, sin
error visible en la tabla. Como red de seguridad hacemos una busqueda JQL
en bloque _antes_ de publicar y avisamos en el log de cualquier ticket que
no resuelva, pero esto es solo informativo: **nunca bloquea la publicacion**.
El manejo de `CHANGELOG.md` si sigue fallando explicitamente ante errores
irrecuperables (ver mas abajo).

Requiere los secrets documentados en
["Secrets para Release Notes"](#secrets-para-release-notes-confluence--jira)
mas abajo.

**Probarlo sin esperar a un release real:** el workflow acepta
`workflow_dispatch` (pestaña **Actions > Release > Run workflow**) pidiendo
un tag `vX.Y.Z` ya existente. Esto **no es un dry-run**: llama a las APIs
reales de Jira/Confluence y crea una pagina real. Usalo solo para validar
que los secrets funcionan.

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

## Capa de mocks (MSW) y sustitucion por el backend real

Toda la app consume datos a traves de MSW (Mock Service Worker). Los mocks
viven en `src/mocks/` y simulan una API REST completa con latencia realista,
errores aleatorios y persistencia en memoria durante la sesion.

### Arquitectura

```
src/lib/endpoints.ts      ← Todas las rutas centralizadas
src/mocks/factories.ts    ← Factories con @faker-js/faker para cada entidad
src/mocks/db.ts           ← DB en memoria con seed determinista
src/mocks/handlers/*.ts   ← Handlers MSW (CRUD + side-effects)
src/mocks/utils.ts        ← Latencia, errores simulados, paginacion cursor
```

El contrato exacto de cada endpoint (metodo, ruta, request/response con
ejemplos JSON reales) esta documentado en [`API-CONTRACT.md`](API-CONTRACT.md).

### Sustituir un mock por el endpoint real

No hace falta apagar MSW entero de golpe — se puede ir sustituyendo endpoint
a endpoint:

1. **Cambiar la ruta en `src/lib/endpoints.ts`** para que apunte a la URL
   del backend real. Si la URL base cambia, ajustar `VITE_API_BASE_URL` en
   `.env` (hoy `/api`, podria pasar a `https://api.debtshare.dev`).

2. **Eliminar el handler correspondiente** en `src/mocks/handlers/`. MSW solo
   intercepta las peticiones que matchean un handler registrado — si no hay
   handler para esa ruta, la peticion pasa al backend real sin intervencion.

3. **Comparar el contrato** del endpoint real con el documentado en
   `API-CONTRACT.md`. Si la forma de la response difiere, ajustar el hook
   de TanStack Query que consume ese endpoint o negociar el cambio con backend.

4. **Repetir** hasta que todos los handlers esten eliminados. Cuando no quede
   ninguno, eliminar la inicializacion del worker en `main.tsx` y las
   dependencias de MSW.

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

El job `release-notes` dentro de `release.yml` (ver ["Release notes en
Confluence"](#release-notes-en-confluence) arriba) necesita estos secrets en
**Settings > Secrets and variables > Actions**. Ninguno se puede derivar de
codigo; los crea el owner del repo a mano.

| Secret                 | Valor                                                                                                                             |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `ATLASSIAN_EMAIL`      | Email de la cuenta Atlassian usada para autenticar contra Jira y Confluence                                                       |
| `ATLASSIAN_API_TOKEN`  | Token de esa cuenta (id.atlassian.com > Security > API tokens) — vale para ambas APIs si Jira y Confluence viven en el mismo site |
| `JIRA_URL`             | URL base del sitio Jira Cloud, sin barra final (ej. `https://acekode.atlassian.net`)                                              |
| `CONFLUENCE_URL`       | URL base del sitio Confluence Cloud (con o sin `/wiki` final, el script lo normaliza)                                             |
| `CONFLUENCE_SPACE_KEY` | Key del espacio Confluence donde se publican las paginas (ej. `ENG`)                                                              |

La pagina de proyecto (`CONFLUENCE_PROJECT_PAGE`, hoy `"Front-End"`) esta
fijada directamente en `release-notes.yml` — no es secreta, es literalmente
el unico proyecto que este repo publica, asi que no hace falta gestionarla
como secret.

**Prerrequisito en Confluence (manual, una sola vez):**

1. Debe existir el espacio indicado en `CONFLUENCE_SPACE_KEY`.
2. Dentro de ese espacio debe existir ya una pagina titulada exactamente
   `📓 Release Notes` (compartida entre proyectos). El script la busca por
   titulo — si no la encuentra, el job falla explicitamente en el log en vez
   de crear paginas huerfanas o duplicadas. Solo la pagina de version
   (`<CONFLUENCE_PROJECT_PAGE> Release vX.Y.Z`) la crea/actualiza el script.
3. La cuenta de `ATLASSIAN_EMAIL` necesita permiso de creacion/edicion de
   paginas en ese espacio, y acceso de lectura al proyecto Jira `DEB`.
4. El site debe tener el **Jira-Confluence Smart Links** conectado (viene
   activado por defecto en Confluence Cloud cuando ambos productos estan en
   el mismo site) — es lo que renderiza la tabla de tickets embebida.
