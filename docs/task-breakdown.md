# ASHU GONDER — Task breakdown (applications, scoring, and role workspaces)

This document is the **single roadmap** for building the lecturer application experience, **application summary / score breakdown** (backend + UI), committee and officer workflows, admin tooling, and shared capabilities (profiles, alerts, usability). It ties your product requirements to **what already exists** in the repo and **what must be added next**.

---

## 1. How to read this document

- **Epics** are large outcomes (e.g. “Lecturer can submit an application”).
- **Tasks** are implementable units with clear acceptance criteria.
- **Step-by-step execution:** use **Section 11** (`T1` → `T20`) as the **single ordered backlog**; implement one step per PR/session unless a step is explicitly small enough to pair.
- **Dependencies** matter: scoring and document verification should exist **before** ranking and allocation assume “final” scores.
- **“Currently implemented”** is grounded in the codebase as of this breakdown; adjust checkboxes when you ship.

---

## 2. Scoring model (product spec — backend source of truth)

The **Application Summary** panel should reflect a server-calculated breakdown (client can preview, server must validate on submit). Weights and bonuses below match your specification.

| Line item | Type | Weight / rule | Notes for engineering |
|-----------|------|----------------|------------------------|
| Educational Title | Base | 40% | Map discrete titles → point band or lookup table; version rules per policy year if needed. |
| Educational Level | Base | 5% | e.g. PhD / MSc / BSc bands. |
| Service Years | Base | 35% | Usually a function of years (caps, steps). |
| Responsibility | Base | 10% | Administrative / leadership roles. |
| Family Status | Base | 10% | Marital / dependents per policy. |
| **Base total** | — | **100%** | Sum of weighted components → **max 100** before bonuses (define whether bonuses stack over 100 or cap at 100 — **decide in policy task** and document in API). |
| Female | Bonus | +5% | Affirmative action; apply tie-break / additive rules per regulation. |
| Disability | Bonus | +5% | Proof + verification gate. |
| HIV/Illness | Bonus | +3% | Sensitive data: strict access control + audit. |
| Spouse bonus | Bonus | +5% | Only if policy defines eligibility. |
| **Final score** | — | **__/100** (or policy-defined cap) | Store **versioned snapshot** on each application (committee must not see scores change retroactively when rules update). |

**Form actions (lecturer application UI)**

| Action | Behaviour |
|--------|-----------|
| **Edit** | Return form to editable state; preserve drafts. |
| **Preview score** | `POST` or `GET` calculation endpoint using current form values **without** persisting application (or persist as `DRAFT`). |
| **Submit application** | Validate eligibility, attach latest **verified** score snapshot (or pending if policy allows), set status `SUBMITTED`, immutable fields locked per round rules. |
| **Clear form** | Reset client state; optionally delete server draft if you store drafts. |

### 2.1 Product UI map (structure to implement)

Use this as the **screen checklist**; backend tables and APIs should support each block.

**Application Summary (backend-calculated; show “Your Points” and “Score” per row)**

| Criteria | Weight | Your Points | Score |
|----------|--------|-------------|-------|
| Educational Title | 40% | ___ | ___ |
| Educational Level | 5% | ___ | ___ |
| Service Years | 35% | ___ | ___ |
| Responsibility | 10% | ___ | ___ |
| Family Status | 10% | ___ | ___ |
| Base Total | 100% |  | _____ |
| Female (+5%) | Bonus |  | +_____ |
| Disability (+5%) | Bonus |  | +_____ |
| HIV/Illness (+3%) | Bonus |  | +_____ |
| Spouse Bonus (+5%) | Bonus |  | +_____ |
| **FINAL SCORE** |  |  | **_____/100** |

**Form actions (end of lecturer application flow)**

| Action | Button |
|--------|--------|
| Edit when needed | Save / edit draft |
| Preview score (calculate without submitting) | Preview |
| Submit application | Submit |
| Clear form | Reset all fields |

**Lecturer — main actions**

| Action | Button |
|--------|--------|
| Apply for housing | New application |
| View my application | View application |
| Upload documents | Upload documents |
| Check allocation result | View result |
| Submit / receive complaint issue | File complaint |
| My score breakdown | (dedicated summary / same as Application Summary + history) |

**Committee — main actions**

| Action | Button |
|--------|--------|
| Review applications | Review applications |
| Rank applicants | Rank applicants |
| View compliance issues | View compliance |
| Respond to queries | Respond |
| Submit final rank | Submit final rank |
| Send preliminary for review | Send preliminary |

**Officer — main actions**

| Action | Button |
|--------|--------|
| Manage housing units | Manage units *(implemented)* |
| View available houses | View available |
| Run allocation | Run allocation |
| Generate reports | Generate reports |
| Publish results | Publish results |
| Post announcement | Post announcement |

**Admin — main actions**

| Action | Button |
|--------|--------|
| Manage users | Manage users *(create only; extend)* |
| System activity logs | View logs |
| System backup | Backup now |
| System settings | Settings |

**All roles**

- Each role: **own profile** (view/edit) and room for **micro-features** (alerts, empty states, shortcuts, accessibility) — see cross-cutting epics (Section 5) and polish (Phase F).

---

## 3. Currently implemented (inventory)

Use this to avoid duplicating work and to sequence new schema/API work.

### 3.1 Backend (`server/`)

| Area | Status | Notes |
|------|--------|--------|
| Express API + CORS + cookies | Done | `src/app.ts` |
| Auth: admin creates user, OTP, password, login, forgot password | Done | `docs/auth.md`, `routes/auth.routes.ts`, `routes/admin.routes.ts` |
| Roles in DB | Done | `ADMIN`, `LECTURER`, `OFFICER`, `COMMITTEE` — `schema/auth.ts` |
| Housing units CRUD | Done | `/api/houses`, `schema/housing.ts`, officer/admin only |
| Lecturer profile (extend `users` or separate table) | Not done | Today: name, email, department on `users` only |
| Scoring rules + lecturer claims + proofs | Not done | No tables/services |
| Application rounds | Not done | — |
| Applications (submit / view / status) | Not done | — |
| Committee review / rank / preliminary / final | Not done | — |
| Allocation engine | Not done | — |
| Complaints / queries / compliance | Not done | — |
| Activity logs / backup / settings | Not done | — |

### 3.2 Frontend (`client/`)

| Area | Status | Notes |
|------|--------|--------|
| Auth pages + session | Done | login, verify, password setup, forgot password |
| Role routing + dashboard gate | Done | `DashboardGate`, `redirect-by-role.ts` |
| Admin dashboard | Partial | User creation (`AdminCreateUserForm`) |
| Officer dashboard | Partial | **Housing management** (`HousingManagementPanel`) |
| Lecturer dashboard | Placeholder | Copy only — no applications UI |
| Committee dashboard | Placeholder | — |
| Shell: nav, logout, toasts | Done | `DashboardShell` — sidebar mostly generic; admin has extra “Manage users” link |
| Application summary / score UI | Not done | — |

---

## 4. End-to-end flows (target)

These flows drive task ordering.

### 4.1 Lecturer: profile → score → apply

1. Lecturer completes **profile / criteria form** (titles, years, responsibilities, family, bonus eligibility fields).
2. Uploads **evidence** (PDF/images) per claim.
3. **Officer or committee** (policy decision) **verifies** claims → system computes **verified base + bonuses** → **locked score version** for that user.
4. Lecturer opens **new application** for an **open round**, picks unit(s) or general preference per rules.
5. **Preview score** uses current draft; **submit** attaches frozen score snapshot + application payload.
6. Lecturer **views** submitted application, **allocation result** when published, **files complaint** if allowed.

**Dependency:** housing units + rounds must exist before meaningful applications; **verified score** should exist before submit if policy requires it.

### 4.2 Committee: review → rank → finalize

1. See applications for round + filters (unit, department, status).
2. **Review** documents and compliance flags (missing proof, disputed claim).
3. **Rank** applicants (sort by final score snapshot; tie-breakers per policy — gender/disability etc. may already be in snapshot).
4. **Send preliminary** list for review / objections window (optional product).
5. **Submit final rank** → locks committee output for officer allocation step.

### 4.3 Officer: housing → allocation → publish

1. **Manage units** (already).
2. **View available** inventory (read-only list with filters).
3. **Run allocation** (algorithm: match committee rank + availability + business rules).
4. **Publish results** + **announcements** (notifications + public/role-specific views).
5. **Generate reports** (CSV/PDF — later phase).

### 4.4 Admin: users → logs → backup → settings

1. **Manage users** (extend beyond create: edit, deactivate, reset flows).
2. **Activity logs** (audit trail for sensitive actions).
3. **Backup** (operational: DB dump strategy or integrate with hosting).
4. **Settings** (feature flags, email templates, round defaults).

---

## 5. Cross-cutting epics (all roles)

Complete these early; they reduce rework on every dashboard.

| ID | Epic | Tasks | Depends on |
|----|------|-------|------------|
| X1 | **Role dashboard layout** | Shared “main actions” grid per role; consistent primary/secondary buttons; mobile-friendly. | — |
| X2 | **Profile (read/update)** | API: `GET/PATCH /api/users/me` (or `/profile`); optional avatar; validate role-scoped fields; UI profile page for all roles. | Auth middleware |
| X3 | **Notifications / alerts** | In-app alert model (toast + bell + persisted “notifications” table); email for critical events (optional). | X2 optional |
| X4 | **Audit log** | `audit_events` table + middleware hook on sensitive routes; admin viewer. | DB |
| X5 | **File storage** | Choose store (local dev / S3-compatible); signed upload URLs; virus scan policy (later). | Infra decision |
| X6 | **Policy versioning** | `scoring_policy` + effective dates; snapshot foreign key on `application`. | Scoring schema |

---

## 6. Phased roadmap (recommended order)

Phases are sequenced so you do not build applications without a place to store scores and proofs.

### Phase A — Domain foundation (database + API skeleton)

| Task ID | Task | Outcome |
|---------|------|---------|
| A1 | Design Drizzle schema: `lecturer_profile`, `lecturer_claim`, `document` (or normalized proof table), `score_snapshot`, `scoring_policy`, `application_round`, `application`, `application_status` enum, `committee_rank_entry`, `allocation_result`, `complaint`/`query` (as needed). | Migrations + types |
| A2 | Define **state machine** for application statuses (`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `RANKED`, `ALLOCATED`, `REJECTED`, etc.) — align with UoG process. | Documented enum + transitions |
| A3 | **Score calculation** service: inputs → base components → bonuses → final; unit tests with fixtures from regulations. | Pure functions + tests |
| A4 | API routes (stubs then implement): `POST .../score/preview`, `GET .../score/me`, `POST .../applications` (draft/submit), `GET .../applications/me`, committee/officer/admin lists. | OpenAPI or `docs/` endpoint list |

### Phase B — Lecturer: profile, documents, score breakdown

| Task ID | Task | Outcome |
|---------|------|---------|
| B1 | Lecturer profile form + PATCH API | Persist criteria fields |
| B2 | Upload documents per claim | Files linked to claims |
| B3 | **Application Summary** component (table you specified) fed by API | Parity with spec |
| B4 | **Preview score** + **Edit** + **Clear** + validation messages | UX complete |
| B5 | Verification workflow (officer/committee role who approves claims) | `verified` flags drive snapshot eligibility |
| B6 | Generate **official score snapshot** on verification milestone | Immutable record for applications |

### Phase C — Applications (lecturer + committee + officer reads)

| Task ID | Task | Outcome |
|---------|------|---------|
| C1 | Officer/admin: create **application round** (dates, status `OPEN`/`CLOSED`). | Rounds manageable |
| C2 | Lecturer: **New application** (select unit / preference); enforce round open + eligibility. | Submit path |
| C3 | Lecturer: **View my application(s)** | List + detail |
| C4 | Committee: **Review applications** queue | Filters, status transitions |
| C5 | Committee: **Rank applicants** (per unit or per round — **product decision**) | Ordered list persisted |
| C6 | Committee: **Submit final rank** + optional **send preliminary** | Status + timestamps |
| C7 | Officer: **Run allocation** from ranks + availability | Persist results |
| C8 | Publish: lecturer **View result** | Read-only result |

### Phase D — Complaints, compliance, queries

| Task ID | Task | Outcome |
|---------|------|---------|
| D1 | **File complaint** + status tracking | Lecturer portal |
| D2 | Committee **compliance / issues** view | Triage |
| D3 | **Respond to queries** (threaded messages) | Committee/lecturer |

### Phase E — Admin & operations

| Task ID | Task | Outcome |
|---------|------|---------|
| E1 | Extend **Manage users** (list, edit role, deactivate) | Admin UX |
| E2 | **System activity logs** viewer | Uses audit table |
| E3 | **Backup** + **Settings** | Document procedure or automate |

### Phase F — Polish (“micro features”)

| Task ID | Task | Outcome |
|---------|------|---------|
| F1 | Empty states, skeletons, optimistic UI where safe | Better perceived performance |
| F2 | Keyboard focus, ARIA on forms/tables | Accessibility |
| F3 | Email templates for: round opened, result published, complaint received | Ops completeness |

---

## 7. Role — main actions → task mapping

Each block lists **your main CTA**, then concrete backlog items (many align with phases above).

### 7.1 Lecturer

| Main action | Primary deliverables |
|-------------|----------------------|
| **Apply for housing** (`NEW APPLICATION`) | Round picker, unit preference UI, submit + draft, validation against score snapshot |
| **View my application** (`VIEW APPLICATION`) | List/detail, status timeline, withdraw if policy allows |
| **Upload documents** (`UPLOAD DOCUMENTS`) | Claim-centric uploads, re-upload until verified, size/type validation |
| **Check allocation result** (`VIEW RESULT`) | Read allocation + link to published announcement |
| **Submit / receive complaint** (`FILE COMPLAINT`) | Form + ticket id + notifications |
| **My score breakdown** (`MY SCORE BREAKDOWN`) | Same table as Application Summary + history of snapshots |

**Micro-feature ideas:** deadline countdown on dashboard, “missing documents” checklist, inline help for each criterion, PDF preview modal.

### 7.2 Committee

| Main action | Primary deliverables |
|-------------|----------------------|
| **Review applications** (`REVIEW APPLICATIONS`) | Queue, filters, document viewer, notes |
| **Rank applicants** (`RANK APPLICANTS`) | Drag-sort or numeric rank; persist order; conflict detection |
| **View compliance issues** (`VIEW COMPLIANCE`) | Flags from review (missing proof, policy exception) |
| **Respond to queries** (`RESPOND`) | Shared inbox with lecturer |
| **Submit final rank** (`SUBMIT FINAL RANK`) | Irreversible or role-gated undo window |
| **Send preliminary for review** (`SEND PRELIMINARY`) | Status change + notify applicants if required |

**Micro-feature ideas:** side-by-side document + score, compare two applicants, export round summary.

### 7.3 Officer

| Main action | Primary deliverables |
|-------------|----------------------|
| **Manage housing units** (`MANAGE UNITS`) | **Already implemented** — extend as needed (bulk import, photos) |
| **View available houses** (`VIEW AVAILABLE`) | Read-only housing browser + export |
| **Run allocation** (`RUN ALLOCATION`) | Service + audit + idempotency |
| **Generate reports** (`GENERATE REPORTS`) | CSV/PDF per round |
| **Publish results** (`PUBLISH RESULTS`) | Flip visibility flags, timestamps |
| **Post announcement** (`POST ANNOUNCEMENT`) | Rich text + audience (all lecturers / round participants) |

**Micro-feature ideas:** occupancy dashboard charts, maintenance flag on units.

### 7.4 Admin

| Main action | Primary deliverables |
|-------------|----------------------|
| **Manage users** (`MANAGE USERS`) | **Partial** — add list/edit/deactivate |
| **System activity logs** (`VIEW LOGS`) | Audit viewer + export |
| **System backup** (`BACKUP NOW`) | Runbook or scripted pg_dump |
| **System settings** (`SETTINGS`) | Feature flags, scoring policy picker for new rounds |

**Micro-feature ideas:** impersonation (dangerous — only with heavy audit), rate-limit dashboard.

---

## 8. API / UI checklist (traceability)

Use this as a master checklist when you implement.

- [ ] **GET** lecturer score breakdown (current + history)
- [ ] **POST** score preview (no persist)
- [ ] **POST** application draft save
- [ ] **POST** application submit
- [ ] **GET** my applications
- [ ] **GET** application by id (role-scoped)
- [ ] **GET** committee application queue
- [ ] **PATCH** committee rank / notes / compliance flags
- [ ] **POST** committee preliminary / final submit
- [ ] **POST** officer run allocation
- [ ] **POST** officer publish results
- [ ] **POST** announcements
- [ ] **POST** complaints
- [ ] **GET/PATCH** profile (all roles)
- [ ] **GET** admin audit log

---

## 9. Open decisions (resolve before heavy UI)

Record answers here as the team decides.

1. **Final score cap:** Can final exceed 100 after bonuses, or hard cap at 100?
2. **Who verifies proofs:** Officer only, committee only, or split by claim type?
3. **Ranking granularity:** Per housing unit vs global list per round?
4. **Draft applications:** Server-side drafts vs client-only until submit?
5. **Bonus sensitivity:** Separate RBAC + field-level redaction for health-related data?

---

## 10. Suggested first sprint (smallest vertical slice)

1. **A1** subset: `application_round` (minimal) + `score_snapshot` + extend profile storage.  
2. **A3** score calculator + tests.  
3. **B3–B4** lecturer page: Application Summary + Preview + Clear (wired to API).  
4. **C2** minimal submit: one round, one unit choice, attach latest snapshot.

When that slice works, committee/officer flows build on the same `application` and `score_snapshot` tables without rework.

---

## 11. Step-by-step development order (do one task at a time)

Follow this list **in order** unless a task is explicitly skippable (e.g. you defer file storage). After each task, update Section 3 checkboxes and commit.

| Step | ID | What to build | Unlocks (UI / capability) | Depends on |
|------|-----|---------------|---------------------------|------------|
| 1 | **T1** | Drizzle schema + migration: lecturer **criteria** storage (inputs for the five base rows + bonus flags), optional `scoring_policy` stub, **`score_snapshot`** (store computed breakdown JSON + final score + timestamps). | Data layer for Application Summary | — |
| 2 | **T2** | Pure **score calculation** module + unit tests (weights 40/5/35/10/10 + bonuses); document cap rule in code comment once decided. | Correct numbers for Summary | T1 |
| 3 | **T3** | API: **`POST /api/score/preview`** (body = criteria; returns full table rows + base total + bonuses + final). No DB write required for preview. | Preview score (backend truth) | T2 |
| 4 | **T4** | API: **`GET /api/score/me`** (latest saved criteria + latest snapshot if any); optional **`POST /api/score/save`** for draft criteria. | Persist lecturer inputs | T1, T2 |
| 5 | **T5** | Lecturer UI: **criteria form** + **Application Summary** panel bound to preview/me; buttons **Edit**, **Preview score**, **Clear**. | Form actions (except submit) | T3, T4 |
| 6 | **T6** | Schema: **`application_round`** + **`application`** (status enum from A2); minimal relations to user + round + optional housing unit. | Data for applications | T1 |
| 7 | **T7** | API: draft/submit application; submit validates round open + attaches **snapshot id**. Button **Submit application**. | New application submit | T5, T6 |
| 8 | **T8** | Lecturer UI: **New application** wizard (round + unit choice) + **View my application** list/detail. | Lecturer CTAs: apply + view | T7 |
| 9 | **T9** | File storage decision + **`document`** (or equivalent) + upload API; link files to claims/criteria. | **Upload documents** | T1, auth |
| 10 | **T10** | Verification flags + workflow (who verifies — resolve Section 9); regenerate **official snapshot** after verification. | Trusted score on submit | T9 |
| 11 | **T11** | Lecturer dashboard **action grid** (Section 2.1 lecturer buttons) routing to real pages; placeholder only where not built. | Navigation UX | T5+ |
| 12 | **T12** | **Profile** `GET/PATCH /api/users/me` + profile page for **all roles** (shared layout). | Profile edit everywhere | Auth |
| 13 | **T13** | Committee: **Review applications** queue + application detail (read-only lecturer data + documents). | Committee CTA: review | T7, T9 |
| 14 | **T14** | Committee: **Rank applicants** persistence + **View compliance** flags on applications. | Rank + compliance | T13 |
| 15 | **T15** | Committee: **Send preliminary** + **Submit final rank** (status transitions + timestamps). | Preliminary / final | T14 |
| 16 | **T16** | Officer: **View available** housing (reuse housing list API with filters). | Officer CTA: view available | Existing houses |
| 17 | **T17** | Officer: **Run allocation** job + **`allocation_result`** storage. | Run allocation | T15, T16 |
| 18 | **T18** | Officer: **Publish results** + **Post announcement**; lecturer **View result**. | Publish + view result | T17 |
| 19 | **T19** | **Complaints** + committee **Respond** + **queries** thread (minimal). | File complaint + respond | T12 |
| 20 | **T20** | Admin: user list/edit/deactivate; **audit log**; **settings** stub; backup runbook in `docs/`. | Admin CTAs | T12, X4 |

**Optional parallel track (micro-features):** after **T11**, add in-app **notifications** (X3), empty states, and deadline alerts without blocking core flow.

**Current repo shortcut:** Steps **T16** partially exists (housing CRUD); **T20** “Manage users” partially exists (create user only). Treat those as **extend**, not greenfield.

---

## Document maintenance

- **Owner:** assign in your team process.  
- **Update when:** a phase ships, schema changes, or policy weights change.  
- **Related docs:** `docs/setup.md`, `docs/auth.md`, `docs/housing-management-api.md`, `forme.md` (product notes at repo root).
