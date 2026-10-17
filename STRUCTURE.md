# Project structure

Where everything in the SportsAura website lives and why.
Read the [short version](#the-short-version) first; the rest goes folder by folder.

## The short version

In Next.js, **folders inside `src/app/` are the website's URLs**:

```
src/app/page.tsx                    →  /
src/app/login/page.tsx              →  /login            (planned)
src/app/trainers/page.tsx           →  /trainers         (planned)
src/app/trainers/[id]/page.tsx      →  /trainers/42      (planned)
```

Everything that is not a page lives elsewhere in `src/`:

```
src/app/         Pages and layouts (URLs)
src/components/  Reusable UI pieces: buttons, cards, forms      (create when first needed)
src/features/    Code for one area of the site: auth, trainers  (create when first needed)
src/lib/         Small helpers with no UI: settings, API client, formatting
```

Three rules hold the structure together:

1. **Pages stay thin.** A page arranges components and loads data; logic lives in `features/` or `lib/`.
2. **Server code and browser code are kept apart.** Files are Server Components by default and run
   only on the server. Only files that start with `"use client"` run in the browser.
3. **Secrets never reach the browser.** Service URLs and tokens are read on the server through
   `src/lib/env.ts`. Only `NEXT_PUBLIC_*` variables are visible in the browser.

## Full tree

```
sportsaura_web/
├── .editorconfig              Basic editor rules (indent, line endings) for any editor
├── .env.example               Sample environment file; copy to .env
├── .gitattributes             Forces LF line endings so Windows/macOS/Linux agree
├── .gitignore                 Files git must not track (.env, node_modules, .next, ...)
├── .dockerignore              Files Docker must not copy into the image
├── .github/workflows/ci.yml   CI: lint, format check, typecheck, tests, build on every push
├── .prettierrc.json           Formatter rules
├── .prettierignore            Files the formatter skips
├── .vscode/
│   ├── extensions.json        Extensions VS Code offers to install
│   └── settings.json          Turns on lint lines, format-on-save, fix-on-save
├── AGENTS.md                  Written by Next.js: tells AI assistants where the docs are
├── Dockerfile                 How to build the production image
├── docker-compose.yml         Runs the production image on port 3000
├── eslint.config.mjs          Lint rules (errors = red, warnings = yellow)
├── next.config.ts             Next.js settings (standalone output for Docker)
├── package.json               Dependencies and scripts (npm run ...)
├── package-lock.json          Exact installed versions; always commit it
├── tsconfig.json              TypeScript settings; "@/..." means "src/..."
├── vitest.config.mts          Test runner settings
├── README.md                  How to run and use the project
├── STRUCTURE.md               This file
├── public/                    Files served as-is at the site root (robots.txt, images)
└── src/
    ├── app/
    │   ├── layout.tsx         The frame around every page: <html>, fonts, page title
    │   ├── page.tsx           The home page ( / )
    │   ├── globals.css        Tailwind and site-wide styles
    │   └── favicon.ico        Browser tab icon
    └── lib/
        ├── env.ts             Reads and checks server-side settings
        └── env.test.ts        Tests for env.ts
```

## Folder by folder

### `src/app/` — pages and URLs

| File name       | Meaning                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `page.tsx`      | The page shown at this folder's URL                                         |
| `layout.tsx`    | A frame wrapped around this page and every page below it                    |
| `loading.tsx`   | What to show while the page loads (add when needed)                         |
| `error.tsx`     | What to show if the page fails (add when needed)                            |
| `not-found.tsx` | Custom 404 page (add when needed)                                           |
| `route.ts`      | An API endpoint instead of a page, e.g. for login cookies (add when needed) |

Special folder names:

| Folder     | Meaning                                                | Example                          |
| ---------- | ------------------------------------------------------ | -------------------------------- |
| `[id]`     | A changing part of the URL                             | `trainers/[id]` → `/trainers/42` |
| `(group)`  | Groups pages without changing the URL                  | `(auth)/login` → `/login`        |
| `_private` | Not a URL; a place for files used only by nearby pages | `_components/`                   |

### `src/components/` — shared UI (create when first needed)

Small, reusable pieces used on more than one page: `Button`, `Card`, `Input`, `Header`.
One component per file, named in PascalCase: `TrainerCard.tsx`.

### `src/features/` — one folder per area (create when first needed)

When an area grows (login, trainers, bookings), keep all its parts together:

```
src/features/auth/
├── components/   LoginForm.tsx, RegisterForm.tsx
├── api.ts        Calls to the user service
└── types.ts      Shapes of the data
```

### `src/lib/` — helpers without UI

| File     | Responsibility                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------- |
| `env.ts` | Reads `USER_SERVICE_URL` (and future settings) and throws a clear error if missing or not a URL |

Planned: an API client that adds the login token to requests and turns error responses into
readable messages.

### `public/` — static files

Served exactly as they are, from the site root: `public/robots.txt` → `/robots.txt`.

## Tests

Test files live next to the file they test: `env.ts` → `env.test.ts`. Vitest finds every
`src/**/*.test.ts(x)` file. Browser end-to-end tests (Playwright) will be added once there are
real user flows such as login.

## Where do I put new code?

| I want to...                                | Do this                                                                            |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| Add a page                                  | New folder in `src/app/` with a `page.tsx`                                         |
| Add a part used on many pages               | `src/components/Name.tsx`                                                          |
| Add a feature (login, trainers)             | `src/features/<feature>/` with its components and API calls                        |
| Call a backend service                      | A function in `src/features/<feature>/api.ts`, using the URL from `src/lib/env.ts` |
| Make something interactive (clicks, typing) | A component that starts with `"use client"`; keep it as small as possible          |
| Add a setting                               | `.env.example` → `src/lib/env.ts` → README table                                   |
| Add an image or file at a fixed URL         | `public/`                                                                          |
| Change a lint rule                          | `eslint.config.mjs`                                                                |
| Change formatting                           | `.prettierrc.json` (rarely)                                                        |

## Naming conventions

| Thing       | Convention               | Example                                           |
| ----------- | ------------------------ | ------------------------------------------------- |
| URL folders | kebab-case               | `src/app/my-bookings/`                            |
| Components  | PascalCase file and name | `TrainerCard.tsx` → `export function TrainerCard` |
| Other files | camelCase                | `formatPrice.ts`                                  |
| Hooks       | `use` + PascalCase       | `useCurrentUser.ts`                               |
| Types       | PascalCase               | `type Trainer = { ... }`                          |
| Tests       | same name + `.test`      | `formatPrice.test.ts`                             |
| Imports     | absolute from `src`      | `import { readServerEnv } from "@/lib/env"`       |
