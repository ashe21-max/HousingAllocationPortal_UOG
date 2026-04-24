# Housing Officer Dashboard

This dashboard adds the housing asset management interface for the `OFFICER` role.

Included:

- table view for registered housing units
- quick filters for:
  - `Available`
  - `Under Maintenance`
- add-house slide-over form
- house details drawer backed by `GET /api/houses/:id`
- status/condition edit flow backed by `PATCH /api/houses/:id`
- delete confirmation backed by `DELETE /api/houses/:id`
- `react-hook-form` + `zod` validation
- `@tanstack/react-query` for fetch and create mutations against `/api/houses`
- feature code split into:
  - small UI components
  - constants
  - schema
  - utilities

Files:

- `client/features/housing/components/housing-management-panel.tsx`
- `client/features/housing/components/*`
- `client/constants/housing.ts`
- `client/schemas/housing.ts`
- `client/utils/housing.ts`
- `client/lib/api/housing.ts`
- `client/providers/query-provider.tsx`
