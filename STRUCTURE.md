# Project structure

Where everything in the SportsAura website lives and why.
Read the [short version](#the-short-version) first; the rest goes folder by folder.

## The short version

In Next.js, **folders inside `src/app/` are the website's URLs**:

```
src/app/page.tsx                          →  /
src/app/sports/page.tsx                   →  /sports
src/app/trainers/page.tsx                 →  /trainers
src/app/trainers/[id]/page.tsx            →  /trainers/42
src/app/how-it-works/page.tsx             →  /how-it-works
src/app/for-trainers/page.tsx             →  /for-trainers
src/app/(auth)/login/page.tsx             →  /login
src/app/(auth)/register/page.tsx          →  /register
src/app/dashboard/page.tsx                →  /dashboard
src/app/dashboard/trainer-profile/page.tsx →  /dashboard/trainer-profile
src/app/account/page.tsx                  →  /account
src/app/admin/users/page.tsx              →  /admin/users
```

**Where the words on the pages come from:** not from this code. Page text, sports and trainers
are loaded from the trainer service's database on every request, through
`src/lib/trainer-service.ts`. Components in `src/components/ContentBlocks.tsx` only decide how a
block of text looks.

Everything that is not a page lives elsewhere in `src/`:

```
src/app/         Pages and layouts (URLs)
src/components/  Reusable UI pieces: header, form fields, buttons, badges
src/features/    Code for one area of the site: auth/ (login, cookies), trainers/ (profile form)
src/lib/         Small helpers with no UI: settings, backend service clients, formatting
src/proxy.ts     Runs before every request: keeps users signed in, guards private pages
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
    ├── proxy.ts               Before every request: refresh expired login, guard private pages
    ├── app/
    │   ├── layout.tsx         The frame around every page: <html>, fonts, header
    │   ├── page.tsx           The home page ( / )
    │   ├── globals.css        Tailwind and site-wide styles
    │   ├── favicon.ico        Browser tab icon
    │   ├── (auth)/            Group for sign-in pages; the name does not appear in the URL
    │   │   ├── layout.tsx     Centered card around login and register
    │   │   ├── login/page.tsx
    │   │   └── register/page.tsx
    │   ├── error.tsx          Friendly "Something went wrong" page, e.g. when a service is down
    │   ├── sports/page.tsx    All sports (public)
    │   ├── trainers/          Trainer list with filters, and trainers/[id] for one trainer (public)
    │   ├── how-it-works/page.tsx, for-trainers/page.tsx   Text pages (public)
    │   ├── dashboard/         Role-based dashboard, and trainer-profile/ for trainers
    │   ├── account/page.tsx   My profile (signed-in users)
    │   └── admin/users/page.tsx  All users (ADMIN only)
    ├── components/
    │   ├── SiteHeader.tsx     Logo, public links, sign-in links or the signed-in user and Sign out
    │   ├── ContentBlocks.tsx  HeroBlock, BlockGrid, CallToAction: show text from the database
    │   ├── SportCard.tsx      A sport with icon and trainer count
    │   ├── TrainerCard.tsx    A trainer summary card, and SportChips
    │   ├── Skeleton.tsx       Grey placeholders while data loads
    │   ├── FormField.tsx      Labelled input with hint and error text
    │   ├── FormMessage.tsx    Error banner for a whole form
    │   ├── SubmitButton.tsx   Button that disables itself while the form is sending
    │   └── RoleBadge.tsx      Coloured USER / TRAINER / ADMIN label
    ├── features/trainers/
    │   ├── actions.ts         Server Action: save my trainer profile
    │   └── components/        TrainerProfileForm.tsx
    ├── features/auth/
    │   ├── actions.ts         Server Actions: login, register, logout
    │   ├── components/        LoginForm.tsx, RegisterForm.tsx (interactive, "use client")
    │   ├── cookies.ts         Cookie names and options (httpOnly, sameSite, lifetime)
    │   ├── session.ts         Read, set and clear the login cookies
    │   ├── current-user.ts    getCurrentUser(): the signed-in user, or null
    │   ├── refresh-once.ts    One refresh call for parallel requests with the same token
    │   ├── form-state.ts      Turns API errors into messages shown on the forms
    │   └── auth.test.ts       Tests for the files above
    └── lib/
        ├── env.ts             Reads and checks server-side settings
        ├── api-client.ts      Shared HTTP helper and ApiError for every backend service
        ├── user-service.ts    Typed client for the user service REST API
        ├── trainer-service.ts Typed client for the trainer service: sports, trainers, page text
        ├── format.ts          Date and rupee formatting
        └── *.test.ts          Tests next to the file they test
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

### `src/components/` — shared UI

Small, reusable pieces used on more than one page: the header, form fields, buttons, badges.
One component per file, named in PascalCase: `TrainerCard.tsx`.

### `src/features/` — one folder per area

Each area (auth today; trainers and bookings later) keeps all its parts together: its forms in
`components/`, its Server Actions in `actions.ts`, and its helpers. `features/auth/` is the
example to copy.

Pages that need the signed-in user call `getCurrentUser()` **inside a `<Suspense>` boundary**.
It reads a cookie, and in this Next.js version that is only allowed inside a boundary; the rest of
the page still loads instantly.

### `src/lib/` — helpers without UI

| File                 | Responsibility                                                                                                                                                  |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `env.ts`             | Reads `USER_SERVICE_URL` (and future settings) and throws a clear error if missing or not a URL                                                                 |
| `api-client.ts`      | Sends a request to a backend service. Error responses become an `ApiError` with the server's message and field errors; `nullIfNotFound` turns a 404 into `null` |
| `user-service.ts`    | Calls the user service: login, register, refresh, logout, my profile, list users                                                                                |
| `trainer-service.ts` | Calls the trainer service: sports, trainer search and profiles, page text, save my profile                                                                      |
| `format.ts`          | Formats dates and rupees the same way on server and browser                                                                                                     |

Public pages call these inside `<Suspense>` and start with `await connection()`. That tells
Next.js to load the data on every request, not once at build time (the services are not running
during the build).

### `src/proxy.ts` — runs before every request

Keeps users signed in by swapping an expired access token for a new one, and sends signed-out
visitors of `/account` and `/admin/...` to `/login`. Pages and Server Actions still check the
login themselves; the proxy is only the first gate.

### `public/` — static files

Served exactly as they are, from the site root: `public/robots.txt` → `/robots.txt`.

## Tests

Test files live next to the file they test: `env.ts` → `env.test.ts`. Vitest finds every
`src/**/*.test.ts(x)` file. Browser end-to-end tests (Playwright) for the sign-in flows are the
next step.

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
