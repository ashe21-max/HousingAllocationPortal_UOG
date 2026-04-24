# Housing Management API

Routes added under `/api/houses`:

- `POST /api/houses`
- `GET /api/houses`
- `GET /api/houses/:id`
- `PATCH /api/houses/:id`
- `DELETE /api/houses/:id`

Protection:

- all routes use `authenticate`
- allowed roles:
  - `ADMIN`
  - `OFFICER`

Note:

- the current backend role enum uses `OFFICER`, so that is the existing role mapped for housing officer access
