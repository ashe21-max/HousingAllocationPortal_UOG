# Auth

This document describes the full backend authentication flow for ASHU GONDER.

## Core Flow

1. An `ADMIN` creates a user.
2. The created user starts with `password = null` and `is_verified = false`.
3. The user enters their email to begin access.
4. The backend generates an OTP and sends it by email.
5. The user verifies the OTP.
6. The user sets a password.
7. Future logins use email and password.
8. A JWT is issued and the user is redirected to their role dashboard.

## Flow Diagram

```text
ADMIN LOGIN
    |
    v
POST /api/auth/login
    |
    v
JWT cookie issued (httpOnly)
    |
    v
POST /api/admin/users
    |
    v
Admin creates user (ADMIN / LECTURER / OFFICER / COMMITTEE)
    |
    v
USER STARTS ACCESS
    |
    +--> First-time login:
    |        POST /api/auth/login/initiate
    |            |
    |            v
    |        user found by email
    |            |
    |            v
    |        OTP generated + stored + emailed via Brevo
    |            |
    |            v
    |        POST /api/auth/otp/verify
    |            |
    |            +--> invalid code -> attempts +1
    |            +--> attempts >= 3 -> blocked
    |            +--> expired -> rejected
    |            |
    |            v
    |        user marked verified
    |            |
    |            v
    |        POST /api/auth/password/setup
    |            |
    |            v
    |        bcrypt hash saved
    |            |
    |            v
    |        POST /api/auth/login
    |            |
    |            v
    |        JWT cookie issued
    |            |
    |            v
    |        redirect to role dashboard
    |
    +--> Returning login:
    |        POST /api/auth/login
    |            |
    |            v
    |        email + password checked
    |            |
    |            v
    |        JWT cookie issued
    |            |
    |            v
    |        redirect to role dashboard
    |
    +--> Forgot password:
             POST /api/auth/forgot-password
                 |
                 v
             OTP generated + emailed
                 |
                 v
             POST /api/auth/otp/verify?reset
                 |
                 v
             POST /api/auth/password/setup
                 |
                 v
             user logs in again
```

## Main Rules

- Only `ADMIN` can create users.
- Admin can create every role, including another `ADMIN`.
- Newly created users start with:
  - `password = null`
  - `is_verified = false`
- OTP format is `4 digits + 2 uppercase letters`.
- OTP expires in `5 minutes`.
- Only one active OTP row exists per user.
- OTP verification attempts are limited to `3`.
- OTP resend attempts are limited to `3`.
- Password setup requires the user to already be verified.
- Passwords are hashed with `bcrypt` using `saltRounds = 12`.
- Password must contain:
  - at least `8` characters
  - uppercase
  - lowercase
  - number
  - special character

## Security Model

- JWT payload contains:
  - `userId`
  - `role`
- JWT expiration is `1 day`.
- JWT secret comes from `JWT_SECRET`.
- Backend auth is stored in an `httpOnly` cookie.
- Cookie parsing uses `cookie-parser`.
- Auth middleware accepts:
  - `Authorization: Bearer <token>`
  - or the auth cookie
- Role protection uses `requireRole(...roles)`.
- CORS is handled by the `cors` middleware and limited to `http://localhost:3000` by default.

## Main Routes

### Admin

- `POST /api/admin/users`

### Auth

- `POST /api/auth/login/initiate`
- `POST /api/auth/forgot-password`
- `POST /api/auth/otp/resend`
- `POST /api/auth/otp/verify`
- `POST /api/auth/password/setup`
- `POST /api/auth/login`
- `POST /api/auth/logout`

## Role Routing

- `ADMIN` -> `/dashboard/admin`
- `LECTURER` -> `/dashboard/lecturer`
- `OFFICER` -> `/dashboard/officer`
- `COMMITTEE` -> `/dashboard/committee`

## Backend Structure

- `controller`: HTTP handling
- `services`: business flow logic
- `repository`: Drizzle database access
- `validators`: input validation
- `middleware`: auth and role guards
- `utils`: token generation, OTP generation, Brevo sending
