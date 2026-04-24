# Frontend Auth UI

This frontend now mirrors the backend auth flow with clear separation between UI, API calls, validation, and auth state.

## Route Groups

- `(marketing)` landing page
- `(auth)` login, verify OTP, password setup
- `(dashboard)` role-based dashboards

## Main Routes

- `/`
- `/auth/login`
- `/auth/forgot-password`
- `/auth/verify/[userId]`
- `/auth/password-setup/[userId]`
- `/dashboard/admin`
- `/dashboard/lecturer`
- `/dashboard/officer`
- `/dashboard/committee`

## Structure

- `components`: reusable UI and dashboard shell
- `features`: page-specific interactive sections
- `lib/api`: backend integration
- `lib/validation`: live form validation matching backend rules
- `lib/auth`: session helpers and role redirect mapping
- `providers`: auth context and toast provider

## Recent UI Updates

- form fields now support `lucide-react` icons
- password fields support visibility toggle
- primary actions use blue button styling
- auth layout now uses a cleaner two-column split: form on one side, office image on the other
- forgot-password now has its own route and page before OTP verification
