# ShelfAware — frontend

React + TypeScript + Vite app for ShelfAware, a hotel warehouse inventory system.

## Getting started

```sh
cp .env.example .env   # set VITE_API_URL to the backend URL
npm install
npm run dev
```

| Script          | What it does                                |
| --------------- | ------------------------------------------- |
| `npm run dev`   | Start the dev server                        |
| `npm run build` | Type-check and build for production         |
| `npm run check` | Run ESLint and Prettier checks              |
| `npm run fix`   | Auto-fix lint issues and format all files   |

## Tech stack

- **React Router** for routing
- **TanStack Query** for server data (fetching, caching, refetching)
- **axios** for HTTP, through one shared instance
- **i18next** for translations (English and Greek)

## Folder structure

Code is grouped by **feature**: everything for one business area lives in one folder. Shared code is grouped by type.

```
src/
├── app/            App wiring: router, layout
├── features/       One folder per business area
│   ├── dashboard/
│   ├── inventory/
│   ├── suppliers/
│   ├── map/
│   ├── orders/
│   └── settings/
├── components/     Shared UI used by many features (Button, Modal, ...)
├── lib/            Setup for outside libraries (axios, query client, i18n)
├── config/         App config read from environment variables
├── locales/        Translation files (en.json, el.json)
└── assets/         Images and brand files
```

### Where does a file go?

1. Sets up how the whole app works (routing, providers, layout)? → `app/`
2. Belongs to one business area? → `features/<area>/`
3. Generic UI used in many places? → `components/`
4. Setup for an outside library? → `lib/`

### Conventions

- **API calls** go through `api` from `lib/api.ts`. It sends cookies and handles 401, 403, 404, 422, 429 and 5xx responses in one place.
- **Server data** is fetched with `useQuery`. Defaults live in `lib/queryClient.ts` (data stays fresh for 1 minute, one retry).
- **No hardcoded text.** Every user-facing string lives in `locales/*.json`. Use `useTranslation()` in components and `i18n.t()` outside them.
- **Named exports**, and file name = component name (e.g. `SuppliersPage.tsx` exports `SuppliersPage`).
