# SportsAura Web

The website of the SportsAura platform, where people find and hire sports trainers.
Built with **Next.js**. It talks to the SportsAura backend services (starting with the
[user service](https://github.com/aariffulalam/sportsaura_user_service)) over their REST APIs.

- How the code is organised: [STRUCTURE.md](STRUCTURE.md)
- How all SportsAura services fit together: the `sportsaura` docs repo (`ARCHITECTURE.md`)

> **Status:** project setup only. The home page is a "coming soon" page; login, trainer pages and
> booking will be added next.

## Contents

1. [Tech stack](#tech-stack)
2. [What you need installed](#what-you-need-installed)
3. [Quick start](#quick-start)
4. [Environment variables](#environment-variables)
5. [Scripts](#scripts)
6. [Code quality: ESLint and Prettier](#code-quality-eslint-and-prettier)
7. [Editor setup (red and yellow lines)](#editor-setup-red-and-yellow-lines)
8. [Tests](#tests)
9. [Run with Docker](#run-with-docker)
10. [Troubleshooting](#troubleshooting)

## Tech stack

| Area       | Choice                                           |
| ---------- | ------------------------------------------------ |
| Framework  | Next.js 16 (App Router)                          |
| UI library | React 19                                         |
| Language   | TypeScript (strict mode)                         |
| Styling    | Tailwind CSS 4                                   |
| Linter     | ESLint 9 with the Next.js rules                  |
| Formatter  | Prettier, with the Tailwind class-sorting plugin |
| Tests      | Vitest                                           |
| Runtime    | Node.js 24 (LTS)                                 |
| Containers | Docker (Next.js standalone output)               |
| CI         | GitHub Actions (`.github/workflows/ci.yml`)      |

## What you need installed

| Tool                  | Needed for                                           | Check              |
| --------------------- | ---------------------------------------------------- | ------------------ |
| Node.js 24            | Running the app and every script                     | `node -v`          |
| npm (comes with Node) | Installing packages                                  | `npm -v`           |
| Docker Desktop        | Only for running the production build in a container | `docker --version` |

## Quick start

```bash
# 1. Install packages
npm install

# 2. Create your environment file from the sample
cp .env.example .env            # Windows PowerShell: Copy-Item .env.example .env

# 3. Start the development server
npm run dev
```

Open <http://localhost:3000>. The page reloads automatically when you save a file.

To use features that call the backend, also start the
[user service](https://github.com/aariffulalam/sportsaura_user_service#quick-start-with-docker)
on port 8081.

## Environment variables

Settings live in `.env` (never committed). [`.env.example`](.env.example) is the sample to copy.

| Variable           | Required                  | Example                 | Meaning                      |
| ------------------ | ------------------------- | ----------------------- | ---------------------------- |
| `USER_SERVICE_URL` | yes, for backend features | `http://localhost:8081` | Base URL of the user service |

Rules:

- A variable **without** the `NEXT_PUBLIC_` prefix is only available on the server. Use this for
  service URLs and anything secret.
- A variable **with** `NEXT_PUBLIC_` is built into the JavaScript the browser downloads. Never put
  a secret in one.
- Read server variables through `src/lib/env.ts`, which checks them and gives a clear error when
  one is missing.
- When you add a variable, update `.env.example`, `src/lib/env.ts` and the table above together.

## Scripts

| Command                | What it does                                                       |
| ---------------------- | ------------------------------------------------------------------ |
| `npm run dev`          | Start the development server on port 3000                          |
| `npm run build`        | Build the production version                                       |
| `npm run start`        | Run the production build (after `build`)                           |
| `npm run lint`         | Check the code with ESLint                                         |
| `npm run lint:fix`     | Fix what ESLint can fix automatically                              |
| `npm run format`       | Format every file with Prettier                                    |
| `npm run format:check` | Only report files that are not formatted                           |
| `npm run typecheck`    | Check TypeScript types (generates Next.js route types first)       |
| `npm run test`         | Run the tests once                                                 |
| `npm run test:watch`   | Re-run tests on every save                                         |
| `npm run check`        | Lint + format check + typecheck + tests. **Run before every push** |

## Code quality: ESLint and Prettier

| Tool     | What it does                    | Config                                   |
| -------- | ------------------------------- | ---------------------------------------- |
| ESLint   | Finds bugs and bad patterns     | [`eslint.config.mjs`](eslint.config.mjs) |
| Prettier | Formats every file the same way | [`.prettierrc.json`](.prettierrc.json)   |

ESLint includes the official Next.js rules (React, hooks, accessibility, Core Web Vitals,
TypeScript) plus these SportsAura rules:

| Rule                                                           | Level   | Why                           |
| -------------------------------------------------------------- | ------- | ----------------------------- |
| No unused variables or imports                                 | error   | Dead code hides bugs          |
| No `any` type                                                  | error   | Keeps TypeScript useful       |
| `===` instead of `==`                                          | error   | Avoids surprising comparisons |
| `const` when a variable never changes                          | error   | Makes intent clear            |
| No `console.log` (`console.warn` and `console.error` are fine) | warning | Debug output should not ship  |
| `import type` for type-only imports                            | warning | Smaller bundles, clearer code |

**Errors** fail `npm run lint` and CI. **Warnings** are shown but do not fail.
`eslint-config-prettier` switches off every ESLint rule that would argue with Prettier, so the two
never conflict. Prettier also sorts Tailwind class names into a standard order.

## Editor setup (red and yellow lines)

The repo ships VS Code settings so problems show while you type.

1. Install Node.js 24 and run `npm install`.
2. Open this folder in VS Code.
3. When VS Code asks **"Do you want to install the recommended extensions?"**, choose **Install**.

| You see                   | Comes from                       | Meaning                         |
| ------------------------- | -------------------------------- | ------------------------------- |
| Red line                  | ESLint error or TypeScript error | Must fix; CI will fail          |
| Yellow line               | ESLint warning                   | Worth fixing, does not fail CI  |
| File reformats on save    | Prettier                         | Same result as `npm run format` |
| ESLint auto-fixes on save | ESLint                           | Fixes like `let` → `const`      |

All problems are also listed in the **Problems** panel (`Ctrl+Shift+M`).

## Tests

```bash
npm run test         # once
npm run test:watch   # keep running while you work
```

Test files sit next to the file they test and end in `.test.ts` or `.test.tsx`,
for example `src/lib/env.test.ts`.

## Run with Docker

Runs the production build the same way it will run on a server.

```bash
cp .env.example .env
docker compose up --build
```

Open <http://localhost:3000>. Inside the container, `localhost` means the container itself, so to
reach backend services running on your machine set
`USER_SERVICE_URL=http://host.docker.internal:8081` in `.env`.

No Node.js installed? You can run any script through Docker, for example:

```bash
docker run --rm -v "${PWD}:/app" -v sportsaura-web-node-modules:/app/node_modules -w /app \
  node:24-alpine sh -c "npm install && npm run check"
```

## Troubleshooting

| Problem                                                         | Cause and fix                                                                                 |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `USER_SERVICE_URL is not set`                                   | No `.env` file. Copy `.env.example` to `.env`                                                 |
| `Port 3000 is already in use`                                   | Stop the other app, or run `npx next dev -p 3001`                                             |
| CORS error in the browser console when calling the user service | The user service does not allow this website's address yet. It needs a CORS setting (planned) |
| `npm run format:check` fails in CI                              | Run `npm run format` and commit the result                                                    |
| No red/yellow lines in VS Code                                  | Run `npm install`, install the recommended extensions, then _ESLint: Restart ESLint Server_   |
| Types like `LayoutProps` not found                              | Run `npm run typecheck` once (it generates them), or start `npm run dev`                      |

## A note on `AGENTS.md`

`AGENTS.md` is written by Next.js itself. It tells AI coding assistants to read the docs bundled
in `node_modules/next/dist/docs/`, because this Next.js version is newer than most of their
training. Keep it committed; `next dev` re-creates it anyway.

---

**Author:** Aarif Alam
