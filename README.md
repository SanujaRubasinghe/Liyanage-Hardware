# New Liyanage Hardware

Next.js 14 storefront and admin application.

## Setup

1. Copy `.env.example` to `.env.local` and supply the public API, Google Maps, and reCAPTCHA values.
2. Run `npm install`.
3. Start the storefront with `npm run dev` and the API with `npm run dev:backend`.

## Validation

- `npm run test` checks migration contracts, including the URL-driven category routing and environment convention.
- `npm run build` creates the production build.
- `npm run check` runs both; GitHub Actions executes it for pushes and pull requests.

Public client variables must use the `NEXT_PUBLIC_` prefix. Do not put credentials or other secrets in those variables.

The `/admin` route remains a client-only compatibility shell for the existing React Router admin panel. New admin functionality should be implemented as native Next routes.
