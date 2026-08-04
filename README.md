# Debtshare — Frontend

Frontend de **Debtshare**, una app que combina la gestión de gastos
compartidos estilo Tricount (grupos, splits, balances) con el escaneo de
tickets/facturas estilo Factorial, y un dashboard de analíticas.

> Proyecto en desarrollo por fases. El backend lo construye un compañero en
> paralelo; mientras tanto todo el acceso a datos pasa por una capa de mocks
> (MSW) que imita latencia real, errores ocasionales y paginación.

## Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** (config custom, tokens de diseño en `src/index.css` —
  se definen en la Sección 2)
- **TanStack Query** para estado de servidor + **Zustand** para estado de
  cliente
- **React Router v7**
- **React Hook Form** + **Zod** para formularios y validación
- **Motion** para animaciones
- **MSW (Mock Service Worker)** para simular el backend
- **Vitest** + **Testing Library** para tests

## Requisitos

- Node.js 22+ (LTS)
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`). En
desarrollo, MSW arranca automáticamente e intercepta todas las llamadas a
`/api/*` con datos de ejemplo — no hace falta ningún backend levantado.

## Scripts disponibles

| Script                  | Qué hace                                      |
| ----------------------- | --------------------------------------------- |
| `npm run dev`           | Arranca el servidor de desarrollo (con mocks) |
| `npm run build`         | Type-checks y build de producción             |
| `npm run preview`       | Sirve el build de producción localmente       |
| `npm run lint`          | ESLint sobre todo el proyecto                 |
| `npm run typecheck`     | Comprueba tipos sin emitir output             |
| `npm run format`        | Formatea con Prettier                         |
| `npm run format:check`  | Comprueba formato sin escribir                |
| `npm test` / `test:run` | Tests con Vitest (watch / one-shot)           |

## Arquitectura de carpetas

```
src/
  app/            # providers, router y layout raíz — arranque de la app
  features/       # un directorio por dominio (auth, groups, expenses, receipts, dashboard)
  shared/
    components/   # UI genérica reutilizable entre features
    hooks/        # hooks genéricos sin lógica de dominio
    lib/          # api client (fetch tipado) y utilidades
  mocks/
    handlers/     # handlers de MSW, uno por recurso
    fixtures/     # datos de ejemplo + lógica derivada (balances, simplificación de deudas)
  types/          # entidades de dominio compartidas (User, Group, Expense...)
  test/           # setup global de Vitest
```

Cada `feature` es dueña de sus propios componentes, hooks de datos y lógica;
`shared` solo contiene lo que no depende de ningún dominio concreto. Ningún
componente llama a `fetch` directamente: todo pasa por hooks de TanStack
Query que usan el api client de `src/shared/lib/api.ts`, así el día que el
backend real esté listo solo hay que apagar los mocks / cambiar la
`baseURL`.

## Estado actual

Sección 1 completada: esqueleto del proyecto, tooling, arquitectura de
carpetas, capa de mocks y api client. **Todavía no hay UI ni pantallas
diseñadas** — eso empieza en la Sección 2 (design system).
