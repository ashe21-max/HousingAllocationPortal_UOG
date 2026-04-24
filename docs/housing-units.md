# Housing Units Schema

This module defines the `housing_units` table for the Housing Allocation System.

Added:

- `server/src/lib/db/schema/housing.ts`
- enum definitions for:
  - `room_type`
  - `housing_condition`
  - `housing_status`
- exported TypeScript types for select and insert usage in the backend

Constraint:

- unique combination of `block_number` and `room_number`
