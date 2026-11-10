<p align="center">
  <img src="docs/shelfaware.gif" width="320" alt="ShelfAware: nothing expires on your watch">
</p>

# ShelfAware

**Nothing expires on your watch.** ShelfAware is a warehouse and inventory app for hotels. It keeps track of what is in stock, what is about to run out or expire, and who ordered what, so nothing gets lost or wasted.

## Who is it for?

Hotel teams that work with a shared storage: kitchen and bar staff who order products, managers who approve and follow orders, and storekeepers who keep the shelves in order. Each person sees and orders only what their department and role allow.

## What can it do?

- Log in, register and reset a forgotten password
- Stock, suppliers, orders, notifications and messages in one place
- Departments and roles (admin, kitchen, service, storekeeper, ...) that decide who can order what
- English and Greek

> Work in progress: the app is built step by step, ticket by ticket.

## Tech stack

| Part        | Tools                                          |
| ----------- | ---------------------------------------------- |
| Framework   | React 19, TypeScript (strict), Vite            |
| Styling     | Tailwind CSS v4, shadcn/ui, lucide-react icons |
| Routing     | React Router                                   |
| Server data | TanStack Query, axios (one shared instance)    |
| Forms       | react-hook-form, zod                           |
| Texts       | react-i18next (English and Greek)              |

The backend lives in a separate repo (`shelfaware-api`): NestJS, Prisma and PostgreSQL.

## Getting started

You need Node.js and the backend running (default `http://localhost:8000`).

```sh
cp .env.example .env   # set VITE_API_URL to the backend URL
npm install
npm run dev            # http://localhost:5173
```

| Script          | What it does                              |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start the dev server                      |
| `npm run build` | Type-check and build for production       |
| `npm run check` | Run ESLint and Prettier checks            |
| `npm run fix`   | Auto-fix lint issues and format all files |

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
