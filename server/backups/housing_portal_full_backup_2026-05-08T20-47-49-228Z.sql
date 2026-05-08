--
-- PostgreSQL database dump
--

\restrict CTv8AthyZbmMbYZiJ3cL27SgC26PaZJuODsvcrSLfgc5sNILEOYJL1eh5ProqY5

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

-- Started on 2026-05-08 23:47:49

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 17411)
-- Name: drizzle; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA drizzle;


--
-- TOC entry 930 (class 1247 OID 17723)
-- Name: allocation_result_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.allocation_result_status AS ENUM (
    'PRELIMINARY',
    'PUBLISHED'
);


--
-- TOC entry 903 (class 1247 OID 17554)
-- Name: application_round_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_round_status AS ENUM (
    'DRAFT',
    'OPEN',
    'CLOSED',
    'ARCHIVED'
);


--
-- TOC entry 906 (class 1247 OID 17564)
-- Name: application_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.application_status AS ENUM (
    'DRAFT',
    'SUBMITTED',
    'UNDER_REVIEW',
    'RANKED',
    'ALLOCATED',
    'REJECTED',
    'WITHDRAWN'
);


--
-- TOC entry 924 (class 1247 OID 17691)
-- Name: committee_ranking_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.committee_ranking_status AS ENUM (
    'DRAFT',
    'PRELIMINARY_SUBMITTED',
    'FINAL_SUBMITTED'
);


--
-- TOC entry 936 (class 1247 OID 17760)
-- Name: complaint_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.complaint_status AS ENUM (
    'OPEN',
    'RESOLVED',
    'CLOSED'
);


--
-- TOC entry 915 (class 1247 OID 17633)
-- Name: document_purpose; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.document_purpose AS ENUM (
    'EDUCATIONAL_TITLE',
    'EDUCATIONAL_LEVEL',
    'SERVICE_YEARS',
    'RESPONSIBILITY',
    'FAMILY_STATUS',
    'DISABILITY_CERTIFICATION',
    'HIV_ILLNESS_CERTIFICATION',
    'SPOUSE_PROOF',
    'OTHER'
);


--
-- TOC entry 918 (class 1247 OID 17652)
-- Name: document_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.document_status AS ENUM (
    'UPLOADED',
    'VERIFIED',
    'REJECTED'
);


--
-- TOC entry 882 (class 1247 OID 17460)
-- Name: housing_condition; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.housing_condition AS ENUM (
    'New',
    'Good',
    'Needs Repair',
    'Under Maintenance'
);


--
-- TOC entry 885 (class 1247 OID 17470)
-- Name: housing_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.housing_status AS ENUM (
    'Available',
    'Occupied',
    'Reserved'
);


--
-- TOC entry 888 (class 1247 OID 17478)
-- Name: room_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.room_type AS ENUM (
    'Studio',
    '1-Bedroom',
    '2-Bedroom',
    '3-Bedroom'
);


--
-- TOC entry 873 (class 1247 OID 17422)
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.user_role AS ENUM (
    'ADMIN',
    'LECTURER',
    'OFFICER',
    'COMMITTEE'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 219 (class 1259 OID 17413)
-- Name: __drizzle_migrations; Type: TABLE; Schema: drizzle; Owner: -
--

CREATE TABLE drizzle.__drizzle_migrations (
    id integer NOT NULL,
    hash text NOT NULL,
    created_at bigint
);


--
-- TOC entry 218 (class 1259 OID 17412)
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE; Schema: drizzle; Owner: -
--

CREATE SEQUENCE drizzle.__drizzle_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 5253 (class 0 OID 0)
-- Dependencies: 218
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: drizzle; Owner: -
--

ALTER SEQUENCE drizzle.__drizzle_migrations_id_seq OWNED BY drizzle.__drizzle_migrations.id;


--
-- TOC entry 239 (class 1259 OID 17930)
-- Name: allocation_overrides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allocation_overrides (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    original_room_id uuid,
    new_room_id uuid NOT NULL,
    reason text NOT NULL,
    status character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    approved_by uuid,
    approved_at timestamp with time zone,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 241 (class 1259 OID 17976)
-- Name: allocation_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allocation_reports (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    round_id uuid NOT NULL,
    round_name character varying(255) NOT NULL,
    round_status character varying(50) NOT NULL,
    committee_ranking_status character varying(50) NOT NULL,
    allocation_count text NOT NULL,
    report_data jsonb NOT NULL,
    sent_by_user_id uuid NOT NULL,
    sent_at timestamp without time zone DEFAULT now() NOT NULL,
    status character varying(50) DEFAULT 'PENDING'::character varying NOT NULL,
    admin_notes text,
    reviewed_at timestamp without time zone,
    reviewed_by_user_id uuid,
    deleted_at timestamp without time zone
);


--
-- TOC entry 230 (class 1259 OID 17727)
-- Name: allocation_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allocation_results (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    round_id uuid NOT NULL,
    application_id uuid NOT NULL,
    housing_unit_id uuid NOT NULL,
    allocated_by_user_id uuid NOT NULL,
    status public.allocation_result_status DEFAULT 'PRELIMINARY'::public.allocation_result_status NOT NULL,
    allocated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 237 (class 1259 OID 17892)
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    type character varying(50) DEFAULT 'INFO'::character varying NOT NULL,
    target_roles text,
    is_active boolean DEFAULT true NOT NULL,
    starts_at timestamp with time zone,
    ends_at timestamp with time zone,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 226 (class 1259 OID 17579)
-- Name: application_rounds; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.application_rounds (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status public.application_round_status DEFAULT 'DRAFT'::public.application_round_status NOT NULL,
    starts_at timestamp with time zone NOT NULL,
    ends_at timestamp with time zone NOT NULL,
    created_by_user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    committee_ranking_status public.committee_ranking_status DEFAULT 'DRAFT'::public.committee_ranking_status NOT NULL,
    committee_preliminary_submitted_at timestamp with time zone,
    committee_final_submitted_at timestamp with time zone
);


--
-- TOC entry 227 (class 1259 OID 17590)
-- Name: applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.applications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    round_id uuid NOT NULL,
    preferred_housing_unit_id uuid,
    score_snapshot_id uuid,
    status public.application_status DEFAULT 'DRAFT'::public.application_status NOT NULL,
    submitted_at timestamp with time zone,
    reviewed_at timestamp with time zone,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    reviewed_by_user_id uuid,
    compliance_issue boolean DEFAULT false NOT NULL,
    compliance_notes text,
    final_score double precision
);


--
-- TOC entry 235 (class 1259 OID 17856)
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    action character varying(50) NOT NULL,
    affected_record uuid,
    details text,
    ip_address character varying(45),
    user_agent text,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 234 (class 1259 OID 17839)
-- Name: backup_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    description text,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- TOC entry 240 (class 1259 OID 17959)
-- Name: backup_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    backup_id uuid,
    level character varying(20) NOT NULL,
    message text NOT NULL,
    details text,
    "timestamp" timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 233 (class 1259 OID 17820)
-- Name: backup_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.backup_schedule (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    frequency character varying(50) NOT NULL,
    tables text[],
    enabled boolean DEFAULT true NOT NULL,
    retention_days integer DEFAULT 30 NOT NULL,
    last_run_at timestamp with time zone,
    next_run_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone,
    created_by uuid NOT NULL
);


--
-- TOC entry 229 (class 1259 OID 17697)
-- Name: committee_rank_entries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.committee_rank_entries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    round_id uuid NOT NULL,
    application_id uuid NOT NULL,
    rank_position integer NOT NULL,
    updated_by_user_id uuid NOT NULL
);


--
-- TOC entry 231 (class 1259 OID 17767)
-- Name: complaint_messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaint_messages (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    thread_id uuid NOT NULL,
    sender_user_id uuid NOT NULL,
    message text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 232 (class 1259 OID 17776)
-- Name: complaint_threads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaint_threads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    lecturer_user_id uuid NOT NULL,
    target_department character varying(255) NOT NULL,
    subject character varying(255) NOT NULL,
    status public.complaint_status DEFAULT 'OPEN'::public.complaint_status NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 222 (class 1259 OID 17487)
-- Name: housing_units; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.housing_units (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    building_name character varying(255) NOT NULL,
    block_number character varying(100) NOT NULL,
    room_number character varying(100) NOT NULL,
    room_type public.room_type NOT NULL,
    condition public.housing_condition NOT NULL,
    status public.housing_status DEFAULT 'Available'::public.housing_status NOT NULL,
    location character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 228 (class 1259 OID 17659)
-- Name: lecturer_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lecturer_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    application_id uuid,
    purpose public.document_purpose NOT NULL,
    original_file_name character varying(255) NOT NULL,
    mime_type character varying(120) NOT NULL,
    size_bytes integer NOT NULL,
    storage_path text NOT NULL,
    notes text,
    status public.document_status DEFAULT 'UPLOADED'::public.document_status NOT NULL,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 17499)
-- Name: lecturer_scoring_criteria; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lecturer_scoring_criteria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    educational_title character varying(255) NOT NULL,
    educational_level character varying(128) NOT NULL,
    service_years integer DEFAULT 0 NOT NULL,
    responsibility character varying(255) NOT NULL,
    family_status character varying(255) NOT NULL,
    female_bonus_eligible boolean DEFAULT false NOT NULL,
    disability_bonus_eligible boolean DEFAULT false NOT NULL,
    hiv_illness_bonus_eligible boolean DEFAULT false NOT NULL,
    spouse_bonus_eligible boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 17431)
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    code character varying(12) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    attempts integer DEFAULT 0 NOT NULL,
    resend_count integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 224 (class 1259 OID 17514)
-- Name: score_snapshots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.score_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    scoring_policy_id uuid,
    breakdown jsonb NOT NULL,
    base_total double precision NOT NULL,
    bonus_total double precision NOT NULL,
    final_score double precision NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 225 (class 1259 OID 17523)
-- Name: scoring_policies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.scoring_policies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    version integer DEFAULT 1 NOT NULL,
    effective_from timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- TOC entry 238 (class 1259 OID 17912)
-- Name: system_backups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_backups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    filename character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    size integer NOT NULL,
    status character varying(50) DEFAULT 'creating'::character varying NOT NULL,
    description text,
    created_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    completed_at timestamp with time zone,
    tables text[],
    file_path character varying(500),
    checksum character varying(64),
    restored_at timestamp with time zone,
    restored_by uuid
);


--
-- TOC entry 236 (class 1259 OID 17874)
-- Name: system_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_config (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    value text NOT NULL,
    description text,
    is_public boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by uuid
);


--
-- TOC entry 221 (class 1259 OID 17438)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(320) NOT NULL,
    password character varying(255),
    role public.user_role NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    department character varying(255),
    is_active boolean DEFAULT true NOT NULL
);


--
-- TOC entry 4864 (class 2604 OID 17416)
-- Name: __drizzle_migrations id; Type: DEFAULT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations ALTER COLUMN id SET DEFAULT nextval('drizzle.__drizzle_migrations_id_seq'::regclass);


--
-- TOC entry 5225 (class 0 OID 17413)
-- Dependencies: 219
-- Data for Name: __drizzle_migrations; Type: TABLE DATA; Schema: drizzle; Owner: -
--

COPY drizzle.__drizzle_migrations (id, hash, created_at) FROM stdin;
1	13355394e838851a7788000be6ce3f1afa84166b4dd399b2616474f5ff8d3b59	1774984956940
2	e7e816ead89046472b1db502a45cab721b784ae551d8df0d7173ac88c203bd30	1774992676927
3	a681fd279fe53a182c503338723ed1a816f4667d529f7bfd8f903761154611d1	1775395409859
4	0a7af184706cf04e2ff3629b261ec1c307e9d3f0839ef0fd573e2b34c2191e45	1775606400000
5	70a513e47f97eeb4fbf011401b1269e0c8443bb8bd376a40a75aa5037aad23ff	1775979129454
6	b6491286c4b23558bb2a9673f35bf02cd1d9ad927049ade8f27270b88e4d267b	1776165593465
7	daeb174ba57bb1e926cf48d54753b012a4886c6a6d0f668c75bf14ba6e195f77	1776167734066
8	6953abcebf165e3d4513f79ec8d02a5d8b67a353b2509945877ba00842cf491d	1776168857035
9	3cba3620e8f3768a886a9ed919b831fe230e13517814ec847f3e228a5cdb091b	1776170618203
10	4be377cfa15f9ad738d0f412b3f8f637652569971aefdadc0c728a51cac5d006	1776171305266
11	637ba44d81b9e2c7038bc4ea79498f3d83996fc9200906b39cf892a2760b3ce8	1776173036242
12	dcba7ba62356487f1e273cc5a0d0b0b16fcec06692754218135021f0babcdeba	1776174110483
\.


--
-- TOC entry 5245 (class 0 OID 17930)
-- Dependencies: 239
-- Data for Name: allocation_overrides; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.allocation_overrides (id, application_id, original_room_id, new_room_id, reason, status, approved_by, approved_at, created_by, created_at) FROM stdin;
\.


--
-- TOC entry 5247 (class 0 OID 17976)
-- Dependencies: 241
-- Data for Name: allocation_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.allocation_reports (id, round_id, round_name, round_status, committee_ranking_status, allocation_count, report_data, sent_by_user_id, sent_at, status, admin_notes, reviewed_at, reviewed_by_user_id, deleted_at) FROM stdin;
\.


--
-- TOC entry 5236 (class 0 OID 17727)
-- Dependencies: 230
-- Data for Name: allocation_results; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.allocation_results (id, round_id, application_id, housing_unit_id, allocated_by_user_id, status, allocated_at) FROM stdin;
\.


--
-- TOC entry 5243 (class 0 OID 17892)
-- Dependencies: 237
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.announcements (id, title, content, type, target_roles, is_active, starts_at, ends_at, created_by, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 5232 (class 0 OID 17579)
-- Dependencies: 226
-- Data for Name: application_rounds; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.application_rounds (id, name, description, status, starts_at, ends_at, created_by_user_id, created_at, updated_at, committee_ranking_status, committee_preliminary_submitted_at, committee_final_submitted_at) FROM stdin;
c3cedcaa-49a2-462f-a350-400a12c43b30	2026 uog first use  in portal	this is the first round house alloction by uog  student developmed portal for final project	OPEN	2026-03-29 09:56:00+03	2026-07-30 09:57:00+03	afd12936-078a-47fc-b575-4dc80503e10e	2026-04-30 09:59:14.715928+03	2026-05-06 21:54:09.212+03	DRAFT	\N	\N
4fcbe634-4c48-45d5-95f2-7d6f5d922334	ashu	thus is for test	OPEN	2025-08-08 20:08:00+03	2026-05-08 18:09:00+03	afd12936-078a-47fc-b575-4dc80503e10e	2026-05-08 18:08:46.864887+03	2026-05-08 19:38:09.877+03	PRELIMINARY_SUBMITTED	2026-05-08 19:38:09.877+03	\N
\.


--
-- TOC entry 5233 (class 0 OID 17590)
-- Dependencies: 227
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.applications (id, user_id, round_id, preferred_housing_unit_id, score_snapshot_id, status, submitted_at, reviewed_at, notes, created_at, updated_at, reviewed_by_user_id, compliance_issue, compliance_notes, final_score) FROM stdin;
48d39bbe-221a-4fe9-91bc-e9014662a7b8	a76bc6f8-65bb-4a21-aaef-21c99b637630	4fcbe634-4c48-45d5-95f2-7d6f5d922334	\N	0c7d136f-2e69-43a2-96ce-bb0fadb8b994	SUBMITTED	2026-05-08 19:57:25.3+03	2026-05-08 19:03:53.328+03	{"fullName":"ashu Ashenafi","staffId":"GUR/87654/89","email":"ashenafih212121@gmail.com","phoneNumber":"0987654321","college":"College of Informatics","department":"Informatics","educationalTitle":"PROFESSOR","educationalLevel":"PHD","startDateAtUog":"2025-04-30","otherServiceInstitution":"","otherServiceDuration":"","researchInstitution":"","researchDuration":"","teachingInstitution":"","teachingDuration":"","responsibility":"VICE_DEAN","familyStatus":"SINGLE_WITHOUT_CHILDREN","spouseName":"","spouseStaffId":"","numberOfDependents":"","hasSpouseAtUog":false,"isFemale":true,"isDisabled":true,"hasChronicIllness":true,"score":{"educationalTitle":40,"educationalLevel":5,"serviceYears":2.52,"responsibility":9,"familyStatus":0,"baseTotal":56.52,"femaleBonus":2.83,"disabilityBonus":2.83,"chronicIllnessBonus":1.7,"spouseBonus":0,"final":63.88},"submittedAt":"2026-05-08T16:57:25.217Z"}	2026-05-08 18:45:00.213715+03	2026-05-08 19:57:25.3+03	0bdfda9b-4b29-4d8a-a879-635b9a5974db	f	\N	\N
\.


--
-- TOC entry 5241 (class 0 OID 17856)
-- Dependencies: 235
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.audit_logs (id, user_id, action, affected_record, details, ip_address, user_agent, "timestamp") FROM stdin;
\.


--
-- TOC entry 5240 (class 0 OID 17839)
-- Dependencies: 234
-- Data for Name: backup_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_config (id, key, value, description, updated_at, updated_by) FROM stdin;
63a5a2d8-279a-4365-9815-b61bdf71d2b9	backup_directory	./backups	Directory to store backup files	2026-04-28 10:19:25.212499+03	\N
24ccc59a-d686-4fce-af6f-d9464dfcea36	max_backup_size	1073741824	Maximum backup file size in bytes (1GB)	2026-04-28 10:19:25.212499+03	\N
5f60e89b-1ec5-4197-bd84-527f1a414e4e	compression_enabled	true	Enable backup compression	2026-04-28 10:19:25.212499+03	\N
080a6264-036d-4b77-bad2-7d01719f4b66	auto_cleanup_days	90	Days to keep old backups before cleanup	2026-04-28 10:19:25.212499+03	\N
\.


--
-- TOC entry 5246 (class 0 OID 17959)
-- Dependencies: 240
-- Data for Name: backup_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_logs (id, backup_id, level, message, details, "timestamp") FROM stdin;
1387d40a-30c7-48db-b5a8-681ad4aca76a	dea6bdd3-3f45-438a-9d84-573111cebf90	INFO	Backup started	{"type":"full"}	2026-05-08 23:47:49.237935+03
4302ccca-41e4-473f-b569-2df88a465588	dea6bdd3-3f45-438a-9d84-573111cebf90	INFO	Executing pg_dump	{"command":"pg_dump --host=localhost --port=5432 --username=postgres --dbname=HAS --format=plain --no-owner --no-privileges --verbose > \\"C:\\\\Users\\\\j\\\\Desktop\\\\HousingAllocationSystem\\\\server\\\\backups\\\\housing_portal_full_backup_2026-05-08T20-47-49-228Z.sql\\""}	2026-05-08 23:47:49.243492+03
\.


--
-- TOC entry 5239 (class 0 OID 17820)
-- Dependencies: 233
-- Data for Name: backup_schedule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.backup_schedule (id, name, type, frequency, tables, enabled, retention_days, last_run_at, next_run_at, created_at, updated_at, created_by) FROM stdin;
\.


--
-- TOC entry 5235 (class 0 OID 17697)
-- Dependencies: 229
-- Data for Name: committee_rank_entries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.committee_rank_entries (id, round_id, application_id, rank_position, updated_by_user_id) FROM stdin;
e81ab538-8ba3-48bd-b58e-06ec8610b1bd	4fcbe634-4c48-45d5-95f2-7d6f5d922334	48d39bbe-221a-4fe9-91bc-e9014662a7b8	1	0bdfda9b-4b29-4d8a-a879-635b9a5974db
\.


--
-- TOC entry 5237 (class 0 OID 17767)
-- Dependencies: 231
-- Data for Name: complaint_messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaint_messages (id, thread_id, sender_user_id, message, created_at) FROM stdin;
05e110e6-86bf-4e2e-beae-705fc954cd28	5e04d538-0ac2-4b7a-b3a8-f4e6ed1ba51f	a76bc6f8-65bb-4a21-aaef-21c99b637630	hiii	2026-04-23 02:44:46.283095+03
594522bf-663d-4ea5-aa5b-b74b664f5e09	5e04d538-0ac2-4b7a-b3a8-f4e6ed1ba51f	a76bc6f8-65bb-4a21-aaef-21c99b637630	rrrrrr	2026-04-23 02:45:05.268245+03
6e4ff009-a183-4eab-972f-24bd7536a38b	5e04d538-0ac2-4b7a-b3a8-f4e6ed1ba51f	0bdfda9b-4b29-4d8a-a879-635b9a5974db	pleas see your document	2026-04-23 02:46:22.611424+03
397d87c4-b116-4952-80b9-3e2f9f78c643	e388b961-ed11-42b8-b196-9846ca4dfd09	a76bc6f8-65bb-4a21-aaef-21c99b637630	pleas see detail	2026-04-26 23:05:01.506126+03
b9afa9fb-2e5d-41f4-9f1f-61a94fd4bdd9	5e04d538-0ac2-4b7a-b3a8-f4e6ed1ba51f	0bdfda9b-4b29-4d8a-a879-635b9a5974db	no	2026-04-26 23:07:06.860503+03
a5c1ab1b-39ce-4de3-96e4-4154fedd3942	dac2fa7f-1b77-4dd0-a104-273e17c6431b	a76bc6f8-65bb-4a21-aaef-21c99b637630	hii i am try to don all the thing	2026-04-28 00:05:57.986645+03
86e9d437-4e3a-4a78-964d-8f14c23e66eb	5e04d538-0ac2-4b7a-b3a8-f4e6ed1ba51f	0bdfda9b-4b29-4d8a-a879-635b9a5974db	hii	2026-04-28 19:05:48.778285+03
c5469f0d-4446-4a71-8e8a-1c0886ba2376	dac2fa7f-1b77-4dd0-a104-273e17c6431b	0bdfda9b-4b29-4d8a-a879-635b9a5974db	hiii	2026-04-28 19:06:14.340181+03
7733852a-29a6-4e39-812c-3c9b09156674	e01dec3f-352f-42a6-a180-14a4fe789dec	a76bc6f8-65bb-4a21-aaef-21c99b637630	why not allocate me	2026-05-08 13:53:01.413644+03
0443fa5b-3f30-4efd-b5d9-deb7faf79183	e01dec3f-352f-42a6-a180-14a4fe789dec	0bdfda9b-4b29-4d8a-a879-635b9a5974db	you collection in cot correct	2026-05-08 13:53:40.605186+03
\.


--
-- TOC entry 5238 (class 0 OID 17776)
-- Dependencies: 232
-- Data for Name: complaint_threads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.complaint_threads (id, lecturer_user_id, target_department, subject, status, created_at, updated_at) FROM stdin;
e388b961-ed11-42b8-b196-9846ca4dfd09	a76bc6f8-65bb-4a21-aaef-21c99b637630	College of Natural and Computational Sciences	i am	OPEN	2026-04-26 23:05:01.506126+03	2026-04-26 23:05:01.506126+03
5e04d538-0ac2-4b7a-b3a8-f4e6ed1ba51f	a76bc6f8-65bb-4a21-aaef-21c99b637630	College of Informatics	i am	OPEN	2026-04-23 02:44:46.283095+03	2026-04-28 19:05:48.81+03
dac2fa7f-1b77-4dd0-a104-273e17c6431b	a76bc6f8-65bb-4a21-aaef-21c99b637630	College of Informatics	score	OPEN	2026-04-28 00:05:57.986645+03	2026-04-28 19:06:14.368+03
e01dec3f-352f-42a6-a180-14a4fe789dec	a76bc6f8-65bb-4a21-aaef-21c99b637630	College of Informatics	why	OPEN	2026-05-08 13:53:01.413644+03	2026-05-08 13:53:40.611+03
\.


--
-- TOC entry 5228 (class 0 OID 17487)
-- Dependencies: 222
-- Data for Name: housing_units; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.housing_units (id, building_name, block_number, room_number, room_type, condition, status, location, created_at, updated_at) FROM stdin;
dafa884c-74fb-442d-9979-54a4ed908c32	marak	2	1	1-Bedroom	Needs Repair	Available	gon	2026-05-08 18:01:05.910433+03	2026-05-08 18:01:05.910433+03
250ed57e-4dc4-4274-b7b6-35bde8ab828e	maraki	1	1	1-Bedroom	Good	Available	gonde	2026-05-08 17:58:57.701853+03	2026-05-08 18:03:56.712+03
\.


--
-- TOC entry 5234 (class 0 OID 17659)
-- Dependencies: 228
-- Data for Name: lecturer_documents; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lecturer_documents (id, user_id, application_id, purpose, original_file_name, mime_type, size_bytes, storage_path, notes, status, uploaded_at) FROM stdin;
d8d4b170-be4d-4c9f-83d6-a8c78e5c69b5	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1776901070187-v2p0utrw.jpg	\N	UPLOADED	2026-04-23 02:37:50.422319+03
2ed4b499-6f9d-4954-a6e9-96d10b389f06	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	SPOUSE_PROOF	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1776901150784-d0wn6apc.jpg	\N	UPLOADED	2026-04-23 02:39:11.030844+03
1dee480a-eb38-41b1-bc1a-49857316190d	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778225494015-6rdztofy.jpg	Supporting document for housing application	UPLOADED	2026-05-08 10:31:34.086793+03
f54595ab-c5d2-4f7e-aeb6-a41da6cd4d12	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778225627903-6aaavwpa.jpg	Supporting document for housing application	UPLOADED	2026-05-08 10:33:47.92929+03
0801f448-08f7-4bf7-b165-1680fb67c627	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778226859318-nc0e1l38.jpg	Supporting document for housing application	UPLOADED	2026-05-08 10:54:19.434971+03
b13d00f4-adac-41de-8bf8-c4b8dd18953f	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778237415169-ah1r2a1i.jpg	Supporting document for housing application	UPLOADED	2026-05-08 13:50:15.311333+03
31ad0a80-25f4-4b31-9d3b-8c49a53da673	a76bc6f8-65bb-4a21-aaef-21c99b637630	\N	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778237421940-oro6x6ah.jpg	Supporting document for housing application	UPLOADED	2026-05-08 13:50:21.968869+03
4f72df4d-223a-4427-9d98-553d5bb387b8	a76bc6f8-65bb-4a21-aaef-21c99b637630	48d39bbe-221a-4fe9-91bc-e9014662a7b8	OTHER	Screenshot 2026-04-27 224037.png	image/png	75442	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778255100662-uayo19i8.png	Supporting document for housing application	UPLOADED	2026-05-08 18:45:00.682884+03
f0b6c15e-0620-463e-9beb-472c577a0bca	a76bc6f8-65bb-4a21-aaef-21c99b637630	48d39bbe-221a-4fe9-91bc-e9014662a7b8	OTHER	111download111.jpg	image/jpeg	7767	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778255100640-5qt0omyd.jpg	Supporting document for housing application	UPLOADED	2026-05-08 18:45:00.700062+03
d845bdf4-12fd-4879-9d31-29bc5b8fd12b	a76bc6f8-65bb-4a21-aaef-21c99b637630	48d39bbe-221a-4fe9-91bc-e9014662a7b8	OTHER	mar.jpg	image/jpeg	15664	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778255100667-ziudxb36.jpg	Supporting document for housing application	UPLOADED	2026-05-08 18:45:00.70798+03
79ca58cc-89e3-41eb-ab42-8548f13ca9c6	a76bc6f8-65bb-4a21-aaef-21c99b637630	48d39bbe-221a-4fe9-91bc-e9014662a7b8	OTHER	Screenshot 2026-04-27 224037.png	image/png	75442	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778259437313-s407nu63.png	Supporting document for housing application	UPLOADED	2026-05-08 19:57:17.338172+03
c2a8563b-edad-44f2-a10e-08161e3b8ab0	a76bc6f8-65bb-4a21-aaef-21c99b637630	48d39bbe-221a-4fe9-91bc-e9014662a7b8	OTHER	Screenshot 2026-04-27 224037.png	image/png	75442	C:\\Users\\j\\Desktop\\HousingAllocationSystem\\server\\uploads\\lecturer-documents\\1778259445274-dvx1ewov.png	Supporting document for housing application	UPLOADED	2026-05-08 19:57:25.27937+03
\.


--
-- TOC entry 5229 (class 0 OID 17499)
-- Dependencies: 223
-- Data for Name: lecturer_scoring_criteria; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.lecturer_scoring_criteria (id, user_id, educational_title, educational_level, service_years, responsibility, family_status, female_bonus_eligible, disability_bonus_eligible, hiv_illness_bonus_eligible, spouse_bonus_eligible, created_at, updated_at) FROM stdin;
222d67a7-0356-4784-a653-b372a4cd7dcb	64328bc6-b586-4705-92fb-838719d8217a	ASSISTANT_PROFESSOR	MSC	7	DEAN	MARRIED_WITH_CHILDREN	f	f	f	f	2026-05-07 00:46:08.467154+03	2026-05-07 00:46:08.465+03
d98286cc-97a4-4a73-8db2-d436c9942d6a	0075fbb5-f75a-4913-8ae8-9da29c25195a	LECTURER	PHD	9	DEPARTMENT_HEAD	MARRIED_WITHOUT_CHILDREN	f	t	f	f	2026-05-07 00:54:38.396482+03	2026-05-07 00:54:38.393+03
a07f4686-05ec-4765-88b2-074a3310e350	4c3f1078-304c-463d-8556-93c57d032aea	ASSISTANT_LECTURER	MSC	5	DEPARTMENT_HEAD	MARRIED_WITH_CHILDREN	f	t	f	t	2026-05-07 00:58:32.358757+03	2026-05-07 00:58:32.357+03
c7752be7-3ed4-43fa-a02a-1095252696a1	45ee7a33-615b-4a72-998e-5a28202bea50	LECTURER	BSC	5	UNIT_HEAD	MARRIED_WITH_CHILDREN	f	f	t	t	2026-05-07 01:01:52.35718+03	2026-05-07 01:01:52.355+03
a18e214e-1810-4bcc-b46f-da32e5e3f273	553d3e0f-3be4-44de-bcc6-b045ada0d595	ASSOCIATE_PROFESSOR	PHD	5	DEPARTMENT_HEAD	MARRIED_WITHOUT_CHILDREN	f	t	f	f	2026-05-07 01:05:04.361783+03	2026-05-07 01:05:04.359+03
51f8a67d-6f97-476f-bce6-d0e4174a9e0f	ecef26d0-b631-489a-aaa7-2ea96623a388	ASSISTANT_LECTURER	MSC	7	DEPARTMENT_HEAD	MARRIED_WITHOUT_CHILDREN	f	f	t	f	2026-05-07 01:08:12.498789+03	2026-05-07 01:08:12.495+03
36636872-a9b6-4e5e-8beb-b4a8b8df9c0a	22a5fd30-426f-48bd-945c-0e9199cea345	ASSISTANT_PROFESSOR	MSC	8	PROGRAM_COORDINATOR	MARRIED_WITH_CHILDREN	f	f	t	t	2026-05-07 01:11:20.559865+03	2026-05-07 01:11:20.557+03
9b9dc249-9b91-47bb-b2c1-00e7d301b622	443bbe6a-0a3c-460a-9842-22ac6d67a191	ASSOCIATE_PROFESSOR	PHD	9	VICE_DEAN	MARRIED_WITH_CHILDREN	f	t	f	t	2026-05-07 01:15:11.944527+03	2026-05-07 01:15:11.943+03
ae09a5d6-e4c2-43a2-88e8-81f948e5b43c	5b3dc64d-8c42-4fd4-bdc2-e6a344c6326e	ASSISTANT_PROFESSOR	MSC	8	UNIT_HEAD	MARRIED_WITHOUT_CHILDREN	f	t	f	f	2026-05-07 01:18:23.338727+03	2026-05-07 01:18:23.337+03
8eea05c5-6d17-4829-8036-b6e5007f6f8f	0a2962b7-63f8-4e39-b354-c5dd9601a5a6	PROFESSOR	PHD	8	UNIT_HEAD	MARRIED_WITHOUT_CHILDREN	f	t	f	f	2026-05-07 01:20:59.717934+03	2026-05-07 01:20:59.712+03
accf5002-7204-4377-a08c-d3eb3ec84c9e	efd4d8ac-9333-4804-ba2a-b580bd323d33	ASSISTANT_PROFESSOR	PHD	0	DEPARTMENT_HEAD	MARRIED_WITH_CHILDREN	t	f	f	f	2026-04-30 23:49:07.031718+03	2026-04-30 23:49:07.025+03
86c6fcfd-e708-4f25-ad31-6655092626de	080d618e-e9e6-431e-aeaf-2d6f033c25f5	PROFESSOR	MSC	0	DEAN	SINGLE_WITHOUT_CHILDREN	t	t	t	f	2026-05-04 21:53:15.468385+03	2026-05-04 21:53:22.804+03
c4a68e21-cca4-444e-8397-55954e82aa2f	a76bc6f8-65bb-4a21-aaef-21c99b637630	PROFESSOR	PHD	1	VICE_DEAN	SINGLE_WITHOUT_CHILDREN	t	t	t	f	2026-04-23 00:20:42.695925+03	2026-05-08 19:57:23.95+03
cc8cf5bb-2579-4ffc-b895-ce1f1832339c	58778945-045e-4b62-bf71-eeef2eed0cfa	LECTURER	MSC	25	DEPARTMENT_HEAD	SINGLE_WITHOUT_CHILDREN	f	f	f	f	2026-05-03 15:20:54.27257+03	2026-05-03 15:42:04.606+03
\.


--
-- TOC entry 5226 (class 0 OID 17431)
-- Dependencies: 220
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.otp_codes (id, user_id, code, expires_at, attempts, resend_count) FROM stdin;
5f47309e-1986-4b6f-b0f7-7a0d425230bf	c3b60fe9-85cf-45e3-a01a-97c4f2e39da2	Q741F6	2026-05-07 01:26:14.542+03	0	0
495eae7e-35cc-4aaa-bd35-470f038a081f	a76bc6f8-65bb-4a21-aaef-21c99b637630	5I8O95	2026-05-08 19:46:16.421+03	0	0
5e398c3f-6e75-4065-8b0e-62d069c3a068	afd12936-078a-47fc-b575-4dc80503e10e	Y563Y0	2026-04-23 16:32:50.856+03	0	0
5ccbe174-3c54-462e-a701-b6032dfdc3be	320ec13d-1e77-4520-b981-2e009671e1f1	S8V853	2026-04-30 21:16:01+03	0	0
8c0140b4-c873-4559-871f-2c9a78a1b75f	0b39b8e3-4c68-453e-b5c3-768bf5d35df6	IP0436	2026-04-30 22:51:57.501+03	0	0
980f4de4-87c4-45ec-9498-41e5a0dcf560	080d618e-e9e6-431e-aeaf-2d6f033c25f5	TP8044	2026-04-30 08:58:35.008+03	0	0
88d43450-4901-4649-8956-ac20eb859571	0bdfda9b-4b29-4d8a-a879-635b9a5974db	7E7X33	2026-05-06 21:13:24.65+03	0	0
f41f7f72-abd8-4e01-9b32-0d913f4479f5	4ea19621-4295-4a3f-b522-4aef718ea07d	2U397B	2026-05-06 21:53:16.51+03	0	0
\.


--
-- TOC entry 5230 (class 0 OID 17514)
-- Dependencies: 224
-- Data for Name: score_snapshots; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.score_snapshots (id, user_id, scoring_policy_id, breakdown, base_total, bonus_total, final_score, created_at) FROM stdin;
9e5b4274-4a5c-460d-b2e6-3b79482c84c9	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-23 00:20:42.817318+03
65ea38f5-550d-441f-8b19-96a7c74800cb	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-23 00:29:31.358159+03
4a252d12-3311-4c43-9190-d6dc8dd4ba98	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-23 18:34:36.767272+03
9d3adfc4-651e-4276-8022-99b138ee9dcc	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 21:45:21.451849+03
8f5143e2-3bdb-40a5-b4eb-c909e3f451df	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 21:48:47.060691+03
e942f0b5-53cb-4bff-9ae8-58cf1ed8baa1	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 21:56:56.468783+03
6c751aab-0bcb-4e6b-a8be-3a7a4cede3bf	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 21:57:25.636726+03
7032fbb8-3dcf-4b47-9b13-afd429b0239c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:01:50.280073+03
ce428462-e509-4b58-9870-e15c9c6676fd	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:03:38.489164+03
9b1065b9-33ef-41d4-8130-a46a30d6d838	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:26:31.354044+03
ac24cec2-6d87-4e43-8acc-65b5a5b9e15c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:26:54.926489+03
63dd320a-2f3e-4167-9cb8-a2fe3f72f308	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:29:43.151173+03
7094d102-3ce1-4c5c-af02-783ac1b3c29b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:30:11.636993+03
a2ccdbde-998f-4fa7-b6aa-29a7b794f9d6	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:30:43.045729+03
d1164dd0-2b2b-4c14-9e48-b5c902687e22	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-04-26 22:33:06.299994+03
86183468-4e70-458b-8182-34226c804d9a	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:40:37.048104+03
159ee90d-34a9-4df1-ba78-76284606686b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:53:51.290147+03
125928a7-3a42-4b84-a1f9-eaf26015807a	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:54:25.059326+03
6c634389-3fbf-4909-9831-4bb9463ecd72	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:54:37.75476+03
857f5f6b-9732-4637-be44-e4d1ba1cedf5	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 22:59:38.512283+03
23019a5e-5b19-461b-a113-1df5e4557095	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 23:00:02.710163+03
df6ec7f8-d33a-4a63-a366-efe757f7c306	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 23:00:30.073034+03
fa1ab14c-f1d4-4d5f-9469-bf75ca3ed291	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-26 23:00:50.834715+03
a0ad6e2e-d323-428f-bf78-f5d87c737acd	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 00:14:24.812441+03
7c0bfd6c-9ba0-4519-8951-6322855920a7	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 00:14:38.699512+03
5b4be626-228a-47b0-b9c1-034b74af50a6	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 00:17:45.894633+03
08f393c7-2457-4bca-b8ba-36e141f9b979	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 09:04:00.208957+03
1f619cb3-49b0-417e-9385-4bd0516604ac	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 09:27:25.146278+03
acf0f26c-16db-46a0-9b77-6054588c3b50	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 23:27:34.30372+03
a4895407-93db-4fac-bffc-89209b0f1c73	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 23:31:16.690018+03
7255442d-7f38-4fab-84e6-faedf19f805f	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 23:31:28.833652+03
3d2211ae-6a19-4f07-93a0-f3642e41597a	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 23:31:40.694465+03
bc0485c8-4861-455d-88e5-b3ca477c2835	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 23:32:03.565906+03
9460888a-9b8f-41fe-8f99-ba4f5a781d63	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	8	58	2026-04-27 23:54:13.189639+03
0eb1904a-38b4-44d7-8a77-a33ff54e1079	efd4d8ac-9333-4804-ba2a-b580bd323d33	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 44.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 49.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	44.8	5	49.8	2026-04-30 23:49:07.055149+03
2632a954-4f01-4f66-bbdf-a6bbbd8455ea	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-02 12:35:31.524349+03
260c9a18-cca8-4bca-a7f0-c7aa5c16af9a	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-02 12:37:17.909157+03
5f17dd8c-b3c4-4be4-a6dc-ac894010d4f5	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-02 13:09:18.055073+03
1b19613f-318e-4920-9ef1-9b4663b81d01	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-02 13:09:43.811114+03
15eb26c9-f66d-4d4d-9a6b-87f87eb2af1d	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-02 13:10:34.381544+03
443057b7-c68b-4101-b7cc-f6bdf9b4f653	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-02 13:10:36.642803+03
db25248c-592d-471a-b09e-48954d1ba475	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-02 13:10:37.776161+03
facc6919-427d-4c22-9de1-5e766371aa21	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-02 13:10:49.526714+03
ba32cc17-0ab4-472d-9fc6-ee9d9bd00b72	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 44.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 57.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	44.8	13	57.8	2026-05-02 13:11:31.891848+03
78cc12f2-1438-41c1-b28d-25a7ab993ddc	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 44.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 57.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	44.8	13	57.8	2026-05-02 13:12:10.421276+03
57add074-2ce3-4cf4-a59c-ba8f90dc0757	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-02 13:17:04.949833+03
8a3936fa-ce98-4035-a012-8c35a04b729d	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-02 13:17:17.538403+03
0486c23d-0749-4909-8bc3-a3c8430d34d1	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-02 13:20:25.026703+03
cb5a76da-aa72-41d3-abdf-ec4f640d0371	58778945-045e-4b62-bf71-eeef2eed0cfa	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 21.88, "criteria": "Service Years", "yourPoints": 62.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 61.58, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	61.58	0	61.58	2026-05-03 15:20:54.305192+03
1696ccd1-d37d-45c6-8ebf-13c9e06eeddf	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 15:37:40.068008+03
46b07094-4c51-41dc-aee3-445bea7fa4a7	58778945-045e-4b62-bf71-eeef2eed0cfa	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 21.88, "criteria": "Service Years", "yourPoints": 62.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 61.58, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.58, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	61.58	0	61.58	2026-05-03 15:42:04.763724+03
f65df5fa-cfdb-4f29-9af1-4a5b10730088	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 15:50:12.354509+03
ffb9494a-d219-4240-bbc9-73b539bcca0c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 15:51:22.4324+03
5674fa06-ad6a-4721-9713-1fcd8601a94f	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 44.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 57.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	44.8	13	57.8	2026-05-03 15:51:36.718734+03
ab11c119-2114-4001-bf04-ea9cd4467a01	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 15:52:40.34056+03
33fc7112-af19-4cce-95ee-acf79e6c55d7	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 15:53:10.217446+03
ce088e37-2049-40cc-83cf-e0896b625316	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 15:53:42.089719+03
eb078112-a1a5-406f-a214-807d3a58b9d1	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 16:04:03.245456+03
5338edf7-2f1d-4ae5-bfaf-56e09fb2c60c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-03 16:04:11.548507+03
7cf4c81e-e7e7-48dc-81f0-1ef72c4975ad	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-03 16:04:58.014993+03
9ed61b88-8113-458c-91cf-29e621636048	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 40.8, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.8, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	40.8	13	53.8	2026-05-03 16:05:01.463738+03
51fa1123-90d2-493d-87b4-620efb225b16	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 51.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	13	51.55	2026-05-03 16:05:58.724857+03
baa66ad9-8b83-46bf-a22f-f89451bbdfc2	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 51.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	13	51.55	2026-05-03 16:06:00.374041+03
ff61ea82-4406-4158-9094-bd813a827252	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 51.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	13	51.55	2026-05-03 16:06:12.379025+03
f8758aa6-0dd1-4e7e-ba66-d3dbd0b54fec	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 51.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	13	51.55	2026-05-03 16:07:20.258631+03
c24d7182-2a5d-4fa3-ba3f-d2ee1e169ef1	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:05.973553+03
66b7ca40-518d-4c4c-8754-6a0a5ab3b9ee	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:12.0539+03
b27b34c6-3006-4b78-9133-ec1183242970	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:14.97657+03
d0212ac6-f899-4175-a054-59ac4f0e3a17	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:15.908015+03
29e57b06-4ba9-456b-bb0f-c1fe67350675	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:16.650474+03
d1b70741-ce1d-42e1-b96e-0854d96a5a58	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:17.33737+03
8f6af31d-a8e5-4a27-9f2b-481eb130536e	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:18.126579+03
e39cc3e7-7353-47f2-a64d-544d013e6f82	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:19.149188+03
e7c9c98c-2d89-4a9a-b177-af2c7d23dc94	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:08:19.9119+03
a6ff6816-1e0f-4dfb-850d-274299fb6bcf	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:10:07.057677+03
c0366637-0ae9-45c4-9b4a-12561b2fdfa8	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:11:55.7086+03
b5517eba-1cba-46b0-ab79-96dbd3dd7f0b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:15:30.887218+03
0f4c4e55-9eef-4915-b10f-f9d02a21e5f1	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 38.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	38.55	18	56.55	2026-05-03 16:15:33.950528+03
f9f9d5ac-02d5-47f7-a9db-15892099bc1c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:16:21.578037+03
793c7f27-7241-45b5-84b8-e69a7d3f1c43	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:16:26.568353+03
2fa465bc-ba63-4c32-a372-83d55bcec7f2	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:16:29.676297+03
d7f0cd44-ac9f-467e-be6c-55997f20db45	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:26:40.263848+03
66449055-2c40-4a07-a7e3-7218bbd95255	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:29:54.968542+03
92103aa9-3c0c-4407-8396-ac23b0919920	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:36:22.711421+03
c9bc40f1-27e3-44f0-ac4f-76acd30b2a71	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 60.55, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.55	18	60.55	2026-05-03 16:37:31.371736+03
46a2e9f1-bf53-4bfb-90b8-7268d63a1cb0	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-03 16:44:06.751431+03
9dd90daa-3d48-4ca3-b53b-23847474bb58	080d618e-e9e6-431e-aeaf-2d6f033c25f5	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-04 21:53:15.485889+03
717ae37b-d7c6-4389-b36f-d59f651c926d	080d618e-e9e6-431e-aeaf-2d6f033c25f5	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-04 21:53:22.808083+03
8e53530c-5573-4152-a630-c13a533ef059	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 09:36:48.860072+03
0aba7a96-8832-4c31-81c2-9dc40bd1c022	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 09:36:55.247731+03
3396cac1-c53c-4ab0-b22a-89592156ee7a	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 09:44:10.375015+03
24f176e9-0eb8-4c0b-b61b-6c9e436ce559	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 10:22:31.614158+03
cc24ad91-b70e-4cc1-a43c-31af8a5524de	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 10:29:10.32788+03
8a0b28e8-2cd9-4502-bc18-09dec7f50d9e	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 10:30:00.457813+03
fc44900b-3feb-4368-97f5-f98ae2fcd16c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 11:05:15.766408+03
1b4ee911-884b-4ab1-b896-a6f6ebdb0c9b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 11:36:04.399103+03
8b191d5b-ffef-478d-a3ea-6806c3d2c721	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 11:36:38.743381+03
bf3e9822-f7c4-47f8-bd1e-5c7b29cb0309	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 11:36:40.302827+03
57ad94e7-5ac6-4b53-b1d2-ec8f70bcb033	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 12:29:17.872146+03
9acde93b-4145-4742-af62-417e9049fa4f	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.9	13	67.9	2026-05-05 12:29:20.873379+03
8b97c345-d88d-488c-8818-9038b0270e6b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 12:29:58.385276+03
1cc57463-e941-4351-b251-8cb0e1f576df	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 12:30:02.291371+03
deb1123b-3e6a-48b7-98d0-8bb4f1798781	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 12:30:03.66172+03
d028b774-5303-4644-886c-6ef886761917	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 12:51:06.698034+03
006ed8ac-7b05-4ce3-98c6-c81cf98cc8e0	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 13:06:05.191585+03
9b5cb8ea-907c-45b3-9c87-c13a0f019ac2	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 13:06:08.52034+03
908f3ce6-052b-4bab-b872-1b814cd96a05	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-05 23:06:42.343512+03
ea951c41-5287-4222-9161-46007d962f43	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.9, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 61.9, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.9	13	61.9	2026-05-06 20:57:55.301341+03
a0e3df53-5ccd-4744-b142-788ba43a70af	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 43.7, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.7, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	43.7	13	56.7	2026-05-06 20:59:56.354828+03
bd43cbfd-154a-4d81-84d6-fa7e1d4f8c35	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 43.7, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.7, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	43.7	13	56.7	2026-05-06 21:00:07.777771+03
14a6facb-6fdf-420e-992c-551f286b83a3	64328bc6-b586-4705-92fb-838719d8217a	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 6.13, "criteria": "Service Years", "yourPoints": 17.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 49.83, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 49.83, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	49.83	0	49.83	2026-05-07 00:46:08.48452+03
c55857ea-3f56-4ea7-a184-203311007ddc	0075fbb5-f75a-4913-8ae8-9da29c25195a	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 7.88, "criteria": "Service Years", "yourPoints": 22.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.68, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 53.68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.68	5	53.68	2026-05-07 00:54:38.412546+03
3fabca82-1661-4ca1-809e-b090c957f1ff	4c3f1078-304c-463d-8556-93c57d032aea	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 4.38, "criteria": "Service Years", "yourPoints": 12.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 48.08, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 58.08, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	48.08	10	58.08	2026-05-07 00:58:32.477809+03
ecfc2df4-ad19-499c-b106-bd062374cea7	45ee7a33-615b-4a72-998e-5a28202bea50	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 24.8, "criteria": "Educational Title", "yourPoints": 62, "weightLabel": "40%"}, {"kind": "base", "score": 2.75, "criteria": "Educational Level", "yourPoints": 55, "weightLabel": "5%"}, {"kind": "base", "score": 4.38, "criteria": "Service Years", "yourPoints": 12.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 42.93, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 50.93, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	42.93	8	50.93	2026-05-07 01:01:52.363041+03
f850b2e1-a9af-4084-979a-d0ec8ca23747	553d3e0f-3be4-44de-bcc6-b045ada0d595	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 4.38, "criteria": "Service Years", "yourPoints": 12.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 54.38, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 59.38, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	54.38	5	59.38	2026-05-07 01:05:04.366897+03
128e2c4f-66d1-40a2-9232-1fd46288b4f4	ecef26d0-b631-489a-aaa7-2ea96623a388	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 6.13, "criteria": "Service Years", "yourPoints": 17.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 49.83, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 52.83, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	49.83	3	52.83	2026-05-07 01:08:12.504956+03
a6e44c31-fa01-4843-b1a6-83988bd29425	22a5fd30-426f-48bd-945c-0e9199cea345	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 7, "criteria": "Service Years", "yourPoints": 20, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50.7, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Disability (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 58.7, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50.7	8	58.7	2026-05-07 01:11:20.660635+03
430ea2cf-fb5f-4c0b-8c26-a6aa06ce4d1e	443bbe6a-0a3c-460a-9842-22ac6d67a191	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 7.88, "criteria": "Service Years", "yourPoints": 22.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 57.88, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 67.88, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	57.88	10	67.88	2026-05-07 01:15:11.950766+03
d7dd9fb6-c682-45d6-9935-254841984a6f	5b3dc64d-8c42-4fd4-bdc2-e6a344c6326e	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 7, "criteria": "Service Years", "yourPoints": 20, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50.7, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 55.7, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50.7	5	55.7	2026-05-07 01:18:23.490604+03
6086e586-52a4-40f5-972f-99be83bd48cd	0a2962b7-63f8-4e39-b354-c5dd9601a5a6	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 7, "criteria": "Service Years", "yourPoints": 20, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 63, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 0, "criteria": "Female (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "HIV/Illness (+3%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63	5	68	2026-05-07 01:20:59.721849+03
a910a363-14ba-4d77-bff1-5c8298dc46c9	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 43.7, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.7, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	43.7	13	56.7	2026-05-07 15:36:45.667928+03
d802deb0-176c-4525-b66a-5a6ca4e90fd0	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 28.8, "criteria": "Educational Title", "yourPoints": 72, "weightLabel": "40%"}, {"kind": "base", "score": 3.9, "criteria": "Educational Level", "yourPoints": 78, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 43.7, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 56.7, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	43.7	13	56.7	2026-05-07 15:48:50.00398+03
8b7ec201-ffe5-446c-8670-e538c70395f7	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	13	69	2026-05-07 17:24:46.453681+03
8b7fa8ed-da50-4863-a832-6ffce469ed72	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-07 17:43:44.070101+03
fc11fffb-5362-4852-8620-540d06b7b70e	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	18	74	2026-05-08 09:59:43.310935+03
f6be4e1f-a1cc-43cc-8555-c19462f1da43	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 66.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.32, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.32, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.99, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.32, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 78.30999999999997, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	66.36	11.95	78.30999999999997	2026-05-08 09:59:59.429244+03
c1127007-1612-498a-ba5b-a0018496350e	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56	18	74	2026-05-08 10:00:19.393918+03
1cc8b52a-ef9e-467a-819a-41015d894f80	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:00:46.074379+03
8ba42dd3-968a-4eec-9d18-1f9ad8d45138	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:00:51.240643+03
044161bf-aaea-44dc-b582-9797a6223e3e	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:03:14.922804+03
a8c58d86-4130-400b-85dc-9c95f9252baf	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:04:53.736428+03
f08acbae-c9b6-47d5-9182-7bfb1bba30c2	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:05:26.754077+03
b30c2f5f-d5e3-4238-bea7-beae4eed5c2e	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:15:02.651233+03
6aa117d5-88aa-4029-b4e3-144cbe91cae0	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:15:04.927627+03
61fc5338-3152-4212-9486-042107fd8a0c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:17:18.257383+03
416d60a7-74b0-4da7-b1b3-c68816a76037	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:17:22.698016+03
4062c0c5-458d-4ee8-9608-eecf5bf70919	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:18:09.130387+03
f275c349-4805-4529-ba73-3d00ca0af47f	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:19:18.206623+03
60ef5f87-9c60-4352-8481-fd4447cbf122	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:19:19.355705+03
d9a062f2-83ef-4bc5-a6ed-5c3568307d16	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:20:35.896982+03
10ed895b-d8bd-4ca3-95a8-5aee56ce7ecb	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:20:58.898199+03
ff5d41d1-684a-4d1e-8210-27a78f2c2b22	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:21:42.296345+03
7823a42b-65a7-4c8e-9fbf-0e6ea6087b16	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:22:49.748778+03
644e42e4-94c6-4d60-bbd5-e395fd7c3c67	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:23:46.968092+03
4683d987-3b84-4ec1-9cf9-ae0f4a8e45cd	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:24:29.500023+03
3412ba1b-d190-4d26-82b7-13b8d5e91c88	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:25:17.573112+03
613c0711-50f2-43a9-9375-50c103be3a6b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:25:19.122231+03
b2b25822-f1f4-4a13-be3e-1fc0c823a674	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:25:26.642223+03
ea789603-25aa-4bcf-ac58-1c3b177f74e0	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:25:27.464004+03
601eeb6f-9909-44c6-bed7-4165dc6df752	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:26:49.747299+03
c0f884b8-fa2f-40e4-98d8-787e57bef5e8	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:26:51.835242+03
a4c32751-d3c1-44aa-accd-226e9d7e4f3b	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:26:57.623273+03
6ef90bd6-d735-49f3-8250-a7869ad4474f	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:31:30.794019+03
b0e63aab-586b-4297-8982-9ee07308e3db	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:31:33.953671+03
47c7aacc-4635-4742-8e2d-1fb979cab4aa	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:33:44.312844+03
a4c9414e-04eb-4253-8587-3b295adc7fe3	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:33:47.582655+03
5d0cf503-33b1-4f20-92b4-e33c113053f4	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Spouse Bonus (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 68, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	18	68	2026-05-08 10:54:15.840302+03
af3480f5-b50e-40a7-b90e-69c59603c4d2	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.36, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 10, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 63.36, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.17, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.9, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.17, "criteria": "Spouse Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "total", "score": 74.77000000000001, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	63.36	11.41	74.77000000000001	2026-05-08 10:54:18.919971+03
c0648571-8c7f-4726-be5f-ae11a26a4e0c	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-08 13:50:18.147302+03
d375a8c3-05b7-4aad-8db2-3fa8f2b3a2a3	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0.19, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 10, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 0, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 52.19, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 2.61, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 2.61, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.57, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 58.98, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	52.19	6.79	58.98	2026-05-08 13:50:21.913623+03
134fc516-f9d6-4261-9bf7-e4b3807cc228	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-08 18:45:07.128154+03
3c6fefc1-d251-4170-9576-3a25a8196929	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-08 18:45:30.727798+03
94d880d0-4813-4b2a-a67c-67272fab8638	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 37, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 1.55, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 9, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 8, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 60.55, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 3.03, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3.03, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.82, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 68.42999999999999, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	60.55	7.88	68.42999999999999	2026-05-08 18:45:32.086478+03
485bd9bb-0acc-41a4-8ee6-c4b9876fe0dc	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 34, "criteria": "Educational Title", "yourPoints": 85, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0, "criteria": "Service Years", "yourPoints": 0, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 50, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	50	13	63	2026-05-08 18:47:05.397826+03
a0dfab2c-8de7-4110-a8f6-429ded879c04	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0.88, "criteria": "Service Years", "yourPoints": 2.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56.88, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69.88, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56.88	13	69.88	2026-05-08 19:57:19.606122+03
d912a165-fd6d-4fcd-9021-81f092e0b39f	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 0.88, "criteria": "Service Years", "yourPoints": 2.5, "weightLabel": "35%"}, {"kind": "base", "score": 5.5, "criteria": "Responsibility", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "base", "score": 5.5, "criteria": "Family Status", "yourPoints": 55, "weightLabel": "10%"}, {"kind": "total", "score": 56.88, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 5, "criteria": "Female (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 5, "criteria": "Disability (+5%)", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 3, "criteria": "HIV/Illness (+3%)", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus (+5%)", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 69.88, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56.88	13	69.88	2026-05-08 19:57:23.957846+03
0c7d136f-2e69-43a2-96ce-bb0fadb8b994	a76bc6f8-65bb-4a21-aaef-21c99b637630	73644ae9-0d62-40a7-98bd-6f6177fee72b	[{"kind": "base", "score": 40, "criteria": "Educational Title", "yourPoints": 100, "weightLabel": "40%"}, {"kind": "base", "score": 5, "criteria": "Educational Level", "yourPoints": 100, "weightLabel": "5%"}, {"kind": "base", "score": 2.52, "criteria": "Service Years", "yourPoints": 100, "weightLabel": "35%"}, {"kind": "base", "score": 9, "criteria": "Responsibility", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "base", "score": 0, "criteria": "Family Status", "yourPoints": 100, "weightLabel": "10%"}, {"kind": "total", "score": 56.52, "criteria": "Base Total", "yourPoints": null, "weightLabel": "100%"}, {"kind": "bonus", "score": 2.83, "criteria": "Female Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 2.83, "criteria": "Disability Bonus", "yourPoints": 5, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 1.7, "criteria": "Chronic Illness Bonus", "yourPoints": 3, "weightLabel": "Bonus"}, {"kind": "bonus", "score": 0, "criteria": "Spouse Bonus", "yourPoints": null, "weightLabel": "Bonus"}, {"kind": "total", "score": 63.88, "criteria": "FINAL SCORE", "yourPoints": null, "weightLabel": ""}]	56.52	7.36	63.88	2026-05-08 19:57:25.260596+03
\.


--
-- TOC entry 5231 (class 0 OID 17523)
-- Dependencies: 225
-- Data for Name: scoring_policies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.scoring_policies (id, name, description, version, effective_from, created_at) FROM stdin;
73644ae9-0d62-40a7-98bd-6f6177fee72b	Default Housing Scoring Policy	Standard policy for housing allocation scoring	1	2026-04-23 00:14:13.788728+03	2026-04-23 00:14:13.788728+03
\.


--
-- TOC entry 5244 (class 0 OID 17912)
-- Dependencies: 238
-- Data for Name: system_backups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_backups (id, filename, type, size, status, description, created_by, created_at, completed_at, tables, file_path, checksum, restored_at, restored_by) FROM stdin;
dea6bdd3-3f45-438a-9d84-573111cebf90	housing_portal_full_backup_2026-05-08T20-47-49-228Z.sql	full	0	creating	Manual full backup	0b39b8e3-4c68-453e-b5c3-768bf5d35df6	2026-05-08 23:47:49.228+03	\N	\N	\N	\N	\N	\N
\.


--
-- TOC entry 5242 (class 0 OID 17874)
-- Dependencies: 236
-- Data for Name: system_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_config (id, key, value, description, is_public, updated_at, updated_by) FROM stdin;
5c752ab4-580a-4c47-b3ee-729f945b14f3	maintenance_mode	false	System maintenance mode status	f	2026-04-28 10:19:36.03827+03	\N
\.


--
-- TOC entry 5227 (class 0 OID 17438)
-- Dependencies: 221
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, name, email, password, role, is_verified, created_at, department, is_active) FROM stdin;
0b39b8e3-4c68-453e-b5c3-768bf5d35df6	Tadie	tademan121@gmail.com	$2b$12$b9R8.zTWGprDcGhdwgX0q.GRmePjunNh7M0qPzJZ21tiiXSihRtmu	COMMITTEE	t	2026-04-30 22:26:08.553146+03	College of Agriculture and Environmental Sciences	t
cc8f3ba4-4ae5-4efe-96ea-9ff1a32f5db3	Meku	mequanintaye16@gmail.com	$2b$12$KCMhiXEzUGlOsu.q0HXw1.x/LyHlu0Rb8FwfL1b614WHi9QeqfyoK	COMMITTEE	t	2026-04-30 19:45:14.347471+03	College of Business and Economics	t
2954ef00-444f-4cdd-83ac-de04dfc2f968	ashu	liboyog908@gmail.com	\N	LECTURER	f	2026-05-01 00:23:41.922769+03	College of Informatics	t
2e4152fb-ea75-4d26-bb31-67bc995e82d8	hanan	hanny22162@gmail.com	$2b$12$qfJH.OZkSz/KtmApGagUEuerlhZj22Y2p7l1PJ4QyUl0flirbJ2EO	LECTURER	t	2026-05-01 00:24:41.628514+03	College of Informatics	t
afd12936-078a-47fc-b575-4dc80503e10e	ashe	ashenafih774@gmail.com	$2b$12$BtqKosH5QOMj2clt1hTKSuYA6m.m1gU7tsqtVQqDTIpAS//eBcSdi	OFFICER	t	2026-04-21 20:59:59.072286+03	\N	t
52e25e40-9758-4d9c-9d24-aeb6387e47cb	Mequanint	mekuayenew2018@gmail.com	$2b$12$Y2V6XZRW08IBpFu/Zt0X7eVQUpY1hx0q5jpVh.8mTKjxq1DHzomGO	COMMITTEE	t	2026-04-30 19:47:35.125842+03	College of Natural and Computational Sciences	t
5c261679-5f8e-471d-8d2e-ab65bc78f8df	Tadesse	tadesseb121@gmail.com	$2b$12$/wdiQgyiNTeCyPxlcUUcb.1i07twwOn5laxfI0BKHsScie3UfgfQ2	COMMITTEE	t	2026-04-30 22:28:13.030786+03	College of Social Sciences and Humanities	t
123cd261-41c7-416f-a5f1-9d2246fe560c	Maru A	maruabebe349@gmail.com	$2b$12$wjAtjuAeZwmVdFJUW2olTe91xgf6fI218O9S8JLY/V7kP9Kh7N2/G	COMMITTEE	t	2026-04-30 22:37:22.100982+03	College of Education	t
6383f011-751a-4fc6-87dc-166af2e03c41	Misganew	misganewayenew12@gmail.com	$2b$12$1dGZgsG65I/OkJuacRP1lu7NpaYldHjpceIB4zClR7Jr0YSNxmHW.	COMMITTEE	t	2026-04-30 20:10:32.17132+03	College of Veterinary Medicine and Animal Sciences	t
c3b60fe9-85cf-45e3-a01a-97c4f2e39da2	Habtu Alemu	habtuazanaw@gmail.com	$2b$12$wCyFzFi7XbSqkyj1BxT.5.I.KC5C7gXc8SCOcGI7VphdyDPfyzQJG	LECTURER	t	2026-05-06 22:21:03.80273+03	College of Informatics	t
080d618e-e9e6-431e-aeaf-2d6f033c25f5	anu	anwarayalew946@gmail.com	$2b$12$Ebh4K.N0BWEEgUh8GyVrQuxnkmkHoCH67CqKbJd1nMTyi2g1HTlP2	LECTURER	t	2026-04-23 22:04:41.518851+03	College of Informatics	t
efd4d8ac-9333-4804-ba2a-b580bd323d33	hanna	hannabelete41@gmail.com	$2b$12$QXYGCl59P7u4P.9lLae5hOv.HK91htMAyNPCRgPO0Lx6g3F.xLOze	LECTURER	t	2026-04-30 23:13:02.569643+03	College of Informatics	t
320ec13d-1e77-4520-b981-2e009671e1f1	Getabalew Kemaw	getabalewkemaw@gmail.com	$2b$12$P60hv7J/Rdt70A3aZxDx1eKA5YlSIahV3PjQ3pqjSl3ktNmFxOyfS	ADMIN	t	2026-04-21 20:55:59.758468+03	\N	t
f6d65a52-0ce6-43b8-a306-a1ee4dc74a84	ashu	muzecasug430@gmail.com	$2b$12$AH0UH7skZVu4rcyNJ33XhO4cIeU7ExZTz8oEZzO0Tx7la0DQMfFl6	LECTURER	t	2026-05-01 00:21:09.276406+03	College of Informatics	t
61e58469-0d28-469f-8cfa-8a93d80e2faf	anu	anumuhammad225@gmail.com	$2b$12$8Ykxl6kqPUPIQnAvDa1GTOZZj0C0aA3H7PoIwInkxhPTCzhx5J6zG	LECTURER	t	2026-04-28 09:26:41.915857+03	College of Informatics	t
a76bc6f8-65bb-4a21-aaef-21c99b637630	ashu Ashenafi	ashenafih212121@gmail.com	$2b$12$9ejIL8blI/sLbmbJ33JhZOrevTBkUiPJ3Jyvw1QRN9.lSSUEcNh/G	LECTURER	t	2026-04-21 20:59:16.903029+03	College of Informatics	t
0bdfda9b-4b29-4d8a-a879-635b9a5974db	ashu 	hashenafi577@gmail.com	$2b$12$LEjoIe4QntIR9eILU0cepOxUyyw05sEj9bYCkPNG68C.zKEpG.wJS	COMMITTEE	t	2026-04-21 21:01:28.931413+03	College of Informatics	t
72c6ca56-286a-48ae-b986-e845919f0bd8	yordanos	yordidagne349@gmail.com	\N	LECTURER	f	2026-05-01 00:21:33.308417+03	College of Informatics	t
a7431da8-b79b-4f2e-827e-c033d6425665	anwar	anwar.toyba1@gmail.com	$2b$12$yIka8KIF0GEKAInnvXrLYuHlbB5Ik9jGJiB1/i7h0bjNdZcLbuAkO	LECTURER	t	2026-04-30 08:49:15.614247+03	College of Informatics	t
50ccc357-5c7b-491c-aea3-61b7c0422bf0	Mequanint Ayenew	mekuayenew12@gmail.com	$2b$12$/GfW9eFlHeZKke2e0NmGGOPyJaCHl1fpJ2frKWxabfANZQ1qdYkUO	COMMITTEE	t	2026-04-30 19:38:56.476527+03	College of Medicine and Health Sciences	t
a260f3b5-1761-406a-a7a3-8fa61ab86d7e	Misgie	misganewa12@gmail.com	$2b$12$V2X9KWEollldUG1kxfaSneRLYSEBqr8.nerrB6qXxaJNJq/LJklG6	COMMITTEE	t	2026-04-30 20:15:30.81897+03	School of Law	t
0a2962b7-63f8-4e39-b354-c5dd9601a5a6	Amanual aza	amanualazanaw21@gmail.com	$2b$12$BcRBTVTwBw4m5BPj/xrRiuVdtQSGREZcnCFmfHt688.iK3hvtpSqq	LECTURER	t	2026-05-06 21:23:13.628596+03	College of Informatics	t
4d1662a2-fa29-4c66-90a2-bfdf56efca0e	kalab	kaleabayenew519@gmail.com	$2b$12$h2bxvTsB.D.l3byM3NWK2eaBh02wQB5HSquh8nZhKQSWbCh7fKVlC	COMMITTEE	t	2026-04-30 20:21:10.008035+03	College of Education	t
15c27ad0-f169-43d9-bf04-29dc6fe2d924	Adane	adanedessie19@gmail.com	$2b$12$4voEWARFvxBe4I8qfJnMF.wOPvP8e4Rt/ddKD4LllU0vPbrUziDY.	COMMITTEE	t	2026-04-30 22:10:21.048741+03	Institute of Technology	t
02260037-6f2e-4f58-a095-d087eaa005e7	Maru	maruab03@gmail.com	$2b$12$TfDgMG1pVSyaBupnc4F98.5n0y/3sDFIKT4LNtkr3cNVX.VXyfx6O	COMMITTEE	t	2026-04-30 22:17:25.75835+03	Institute of Biotechnology	t
e8602b77-c5a1-4859-8f9e-8b486262c9b3	Melat	mmelat772@gmail.com	$2b$12$hK.T9xah5RQLa0vQslEjp./qjOdRtnEB3cqL69TYC4mgMkT2j3EtO	LECTURER	t	2026-05-01 00:22:37.259513+03	College of Informatics	t
4ea19621-4295-4a3f-b522-4aef718ea07d	ashu	ashenafiyfat@gmail.com	$2b$12$nTukWCure/aZLoOifgZAD..WN1bRwT9fZVvoEuIQcvVwMdw/xFeh6	ADMIN	t	2026-04-30 10:35:42.079248+03	\N	t
c00847fa-4f09-478f-831d-e6a2f34682e7	beki	drhconxj@telegmail.com	$2b$12$.rBKVf81w6Du4amM9EEeyu.q8v8InaONNOy2fnF8oyecfgWUndRFa	LECTURER	t	2026-05-06 19:26:39.293117+03	College of Informatics	t
443bbe6a-0a3c-460a-9842-22ac6d67a191	Mikiyas Alebel	amanualazanaw14@gmail.com	$2b$12$eZ0N.SKiSGjoKLVp/F2ia.aHdpJPQxrdJnm0hg5mF6OdT81ggbwee	LECTURER	t	2026-05-06 22:38:48.879455+03	College of Informatics	t
447dad85-7f56-488f-b3e2-02efe96d4893	hermela	hermaab1221@gmail.com	\N	LECTURER	f	2026-05-01 00:27:36.523593+03	College of Informatics	t
4d7b891d-a85f-442b-be51-e2f0b6193cc2	mekdes	mekdesfekede0@gmail.com	\N	LECTURER	f	2026-05-01 00:28:31.536315+03	College of Informatics	t
9f1d1cbf-1700-474b-b0fe-0b78fd1ca4b8	hiwot	hiwottulu515@gmail.com	\N	LECTURER	f	2026-05-02 19:55:20.838167+03	College of Informatics	t
666be2e3-63c8-449f-a661-f617522a4ec8	haymanot	haymanotbelete012@gmail.com	\N	LECTURER	f	2026-05-02 19:56:00.120098+03	College of Informatics	t
ac6a1140-8dbc-4c41-af56-311fdc91e0ff	Abush	muluadd3181@gmail.com	\N	LECTURER	f	2026-05-03 14:41:32.636089+03	College of Informatics	t
5b45a741-d5c2-46dd-ba7a-63d55ae52c96	Meku	mulugeta5518@gmail.com	\N	LECTURER	f	2026-05-03 14:42:19.278806+03	College of Informatics	t
67b0fcfc-89e3-454b-82a9-52256506b34c	hanny	hann101626@gmail.com	$2b$12$0s7YYEqiA6GJv7aVrqjRFOs80x19lyVX5XohNXJ4UA7AIWLWU9GqK	LECTURER	t	2026-05-01 00:23:20.806085+03	College of Informatics	t
8448e580-6ee2-4cdd-ab61-95438a85ee9f	Mekie	yene3181@gmail.com	\N	LECTURER	f	2026-05-03 14:42:55.011858+03	College of Informatics	t
58778945-045e-4b62-bf71-eeef2eed0cfa	Gebre	gebereaschale@gmail.com	$2b$12$KiMvYpzXwFD6pYOLIvpLMOuYhvXBCCdvSdYe9/PvVxxeNQfgC7xyC	LECTURER	t	2026-05-03 14:55:29.941122+03	College of Informatics	t
0075fbb5-f75a-4913-8ae8-9da29c25195a	ALEX ALEBEL	amanualazanaw12@gmail.com	$2b$12$dJRIxkslHit3KIjptk/bOehYz7Kd36Dw2DFeMV2hkLHE7PTFHgEmS	LECTURER	t	2026-05-06 21:34:57.952407+03	College of Informatics	t
39a4d501-ac3f-4e96-8c9b-d26714076368	Belay Alebel	amanualaza955@gmail.com	\N	LECTURER	f	2026-05-06 23:05:26.03021+03	College of Informatics	t
5b3dc64d-8c42-4fd4-bdc2-e6a344c6326e	Biruk Kebede	amanaza955@gmail.com	$2b$12$JhUJTU5BNC1eyhQvm5X3e.pkV.wkUprNH8fRVW9wVV1TI8sTpNuLC	LECTURER	t	2026-05-06 23:07:39.559778+03	College of Informatics	t
553d3e0f-3be4-44de-bcc6-b045ada0d595	Amanual Tesfaye	amanuel3461@gmail.com	$2b$12$Py4n/rHSQ4mEpAY2fa.47uNEa.rUPEI4Rl8elFHIqbUXrBGgHK7dO	LECTURER	t	2026-05-06 23:11:30.435453+03	College of Informatics	t
45ee7a33-615b-4a72-998e-5a28202bea50	Getahun Nigusie	getahunnig21@gmail.com	$2b$12$mJ75m7S0eHUYg3bv1jROHOtL2bFNTybrpcNcdJGUgDhgjM3y3Rtbm	LECTURER	t	2026-05-06 23:28:19.69911+03	College of Informatics	t
22a5fd30-426f-48bd-945c-0e9199cea345	Fasil Abebe	amanualazanaw3434@gmail.com	$2b$12$3OnYkrzjeUGNZRi8Q598OOv7NMdqFLka6k502THFihIO8WfruJWaK	LECTURER	t	2026-05-06 23:31:52.338787+03	College of Informatics	t
ecef26d0-b631-489a-aaa7-2ea96623a388	Gebre Hailu	amanualazanaw11@gmail.com	$2b$12$JRKhZPqR.ZIT/W3mT0dLBe0H0PVN8xLSCcjTKpbz8kCFT9MRgFP8G	LECTURER	t	2026-05-06 23:45:39.677496+03	College of Informatics	t
4c3f1078-304c-463d-8556-93c57d032aea	Amare Hailu	amanualaza21@gmail.com	$2b$12$VGYXG6oXb4WZ6yGNbScHIOYDrsbOTZc1NO0jNgDtjHXR2cwfLuchG	LECTURER	t	2026-05-06 23:50:54.754688+03	College of Informatics	t
64328bc6-b586-4705-92fb-838719d8217a	Henok Mesfin	amanual2589@gmail.com	$2b$12$d4PW1RRF34/c1dDHR/Xmj.QFEz3F4Wfn9kAaVKdsJ39ZdpXuT0CJi	LECTURER	t	2026-05-06 23:54:03.670336+03	College of Informatics	t
\.


--
-- TOC entry 5254 (class 0 OID 0)
-- Dependencies: 218
-- Name: __drizzle_migrations_id_seq; Type: SEQUENCE SET; Schema: drizzle; Owner: -
--

SELECT pg_catalog.setval('drizzle.__drizzle_migrations_id_seq', 12, true);


--
-- TOC entry 4940 (class 2606 OID 17420)
-- Name: __drizzle_migrations __drizzle_migrations_pkey; Type: CONSTRAINT; Schema: drizzle; Owner: -
--

ALTER TABLE ONLY drizzle.__drizzle_migrations
    ADD CONSTRAINT __drizzle_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 5035 (class 2606 OID 17939)
-- Name: allocation_overrides allocation_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_overrides
    ADD CONSTRAINT allocation_overrides_pkey PRIMARY KEY (id);


--
-- TOC entry 5043 (class 2606 OID 17985)
-- Name: allocation_reports allocation_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_reports
    ADD CONSTRAINT allocation_reports_pkey PRIMARY KEY (id);


--
-- TOC entry 4988 (class 2606 OID 17734)
-- Name: allocation_results allocation_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_results
    ADD CONSTRAINT allocation_results_pkey PRIMARY KEY (id);


--
-- TOC entry 5025 (class 2606 OID 17903)
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- TOC entry 4964 (class 2606 OID 17589)
-- Name: application_rounds application_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_rounds
    ADD CONSTRAINT application_rounds_pkey PRIMARY KEY (id);


--
-- TOC entry 4969 (class 2606 OID 17600)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 5014 (class 2606 OID 17864)
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5008 (class 2606 OID 17849)
-- Name: backup_config backup_config_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_config
    ADD CONSTRAINT backup_config_key_key UNIQUE (key);


--
-- TOC entry 5010 (class 2606 OID 17847)
-- Name: backup_config backup_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_config
    ADD CONSTRAINT backup_config_pkey PRIMARY KEY (id);


--
-- TOC entry 5040 (class 2606 OID 17967)
-- Name: backup_logs backup_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_logs
    ADD CONSTRAINT backup_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5005 (class 2606 OID 17830)
-- Name: backup_schedule backup_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_schedule
    ADD CONSTRAINT backup_schedule_pkey PRIMARY KEY (id);


--
-- TOC entry 4983 (class 2606 OID 17702)
-- Name: committee_rank_entries committee_rank_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_rank_entries
    ADD CONSTRAINT committee_rank_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 4993 (class 2606 OID 17775)
-- Name: complaint_messages complaint_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_messages
    ADD CONSTRAINT complaint_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4998 (class 2606 OID 17786)
-- Name: complaint_threads complaint_threads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_threads
    ADD CONSTRAINT complaint_threads_pkey PRIMARY KEY (id);


--
-- TOC entry 4951 (class 2606 OID 17497)
-- Name: housing_units housing_units_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.housing_units
    ADD CONSTRAINT housing_units_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 17668)
-- Name: lecturer_documents lecturer_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lecturer_documents
    ADD CONSTRAINT lecturer_documents_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 17513)
-- Name: lecturer_scoring_criteria lecturer_scoring_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lecturer_scoring_criteria
    ADD CONSTRAINT lecturer_scoring_criteria_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 2606 OID 17437)
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_pkey PRIMARY KEY (id);


--
-- TOC entry 4958 (class 2606 OID 17522)
-- Name: score_snapshots score_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_snapshots
    ADD CONSTRAINT score_snapshots_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 2606 OID 17532)
-- Name: scoring_policies scoring_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.scoring_policies
    ADD CONSTRAINT scoring_policies_pkey PRIMARY KEY (id);


--
-- TOC entry 5029 (class 2606 OID 17921)
-- Name: system_backups system_backups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_backups
    ADD CONSTRAINT system_backups_pkey PRIMARY KEY (id);


--
-- TOC entry 5019 (class 2606 OID 17885)
-- Name: system_config system_config_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_key_key UNIQUE (key);


--
-- TOC entry 5021 (class 2606 OID 17883)
-- Name: system_config system_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_pkey PRIMARY KEY (id);


--
-- TOC entry 4947 (class 2606 OID 17447)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5032 (class 1259 OID 17950)
-- Name: allocation_overrides_application_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_overrides_application_id_idx ON public.allocation_overrides USING btree (application_id);


--
-- TOC entry 5033 (class 1259 OID 17952)
-- Name: allocation_overrides_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_overrides_created_by_idx ON public.allocation_overrides USING btree (created_by);


--
-- TOC entry 5036 (class 1259 OID 17951)
-- Name: allocation_overrides_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_overrides_status_idx ON public.allocation_overrides USING btree (status);


--
-- TOC entry 5044 (class 1259 OID 17986)
-- Name: allocation_reports_round_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_reports_round_id_idx ON public.allocation_reports USING btree (round_id);


--
-- TOC entry 5045 (class 1259 OID 17987)
-- Name: allocation_reports_sent_by_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_reports_sent_by_user_id_idx ON public.allocation_reports USING btree (sent_by_user_id);


--
-- TOC entry 5046 (class 1259 OID 17988)
-- Name: allocation_reports_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_reports_status_idx ON public.allocation_reports USING btree (status);


--
-- TOC entry 4986 (class 1259 OID 17758)
-- Name: allocation_results_housing_unit_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_results_housing_unit_idx ON public.allocation_results USING btree (housing_unit_id);


--
-- TOC entry 4989 (class 1259 OID 17755)
-- Name: allocation_results_round_application_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX allocation_results_round_application_unique ON public.allocation_results USING btree (round_id, application_id);


--
-- TOC entry 4990 (class 1259 OID 17756)
-- Name: allocation_results_round_housing_unit_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX allocation_results_round_housing_unit_unique ON public.allocation_results USING btree (round_id, housing_unit_id);


--
-- TOC entry 4991 (class 1259 OID 17757)
-- Name: allocation_results_round_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX allocation_results_round_idx ON public.allocation_results USING btree (round_id);


--
-- TOC entry 5022 (class 1259 OID 17911)
-- Name: announcements_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX announcements_created_by_idx ON public.announcements USING btree (created_by);


--
-- TOC entry 5023 (class 1259 OID 17909)
-- Name: announcements_is_active_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX announcements_is_active_idx ON public.announcements USING btree (is_active);


--
-- TOC entry 5026 (class 1259 OID 17910)
-- Name: announcements_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX announcements_type_idx ON public.announcements USING btree (type);


--
-- TOC entry 4965 (class 1259 OID 17626)
-- Name: application_rounds_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX application_rounds_status_idx ON public.application_rounds USING btree (status);


--
-- TOC entry 4966 (class 1259 OID 17627)
-- Name: application_rounds_window_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX application_rounds_window_idx ON public.application_rounds USING btree (starts_at, ends_at);


--
-- TOC entry 4967 (class 1259 OID 17689)
-- Name: applications_compliance_issue_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX applications_compliance_issue_idx ON public.applications USING btree (compliance_issue);


--
-- TOC entry 4970 (class 1259 OID 17629)
-- Name: applications_round_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX applications_round_id_idx ON public.applications USING btree (round_id);


--
-- TOC entry 4971 (class 1259 OID 17631)
-- Name: applications_round_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX applications_round_status_idx ON public.applications USING btree (round_id, status);


--
-- TOC entry 4972 (class 1259 OID 17630)
-- Name: applications_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX applications_status_idx ON public.applications USING btree (status);


--
-- TOC entry 4973 (class 1259 OID 17628)
-- Name: applications_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX applications_user_id_idx ON public.applications USING btree (user_id);


--
-- TOC entry 5011 (class 1259 OID 17871)
-- Name: audit_logs_action_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_action_idx ON public.audit_logs USING btree (action);


--
-- TOC entry 5012 (class 1259 OID 17873)
-- Name: audit_logs_affected_record_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_affected_record_idx ON public.audit_logs USING btree (affected_record);


--
-- TOC entry 5015 (class 1259 OID 17872)
-- Name: audit_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_timestamp_idx ON public.audit_logs USING btree ("timestamp");


--
-- TOC entry 5016 (class 1259 OID 17870)
-- Name: audit_logs_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX audit_logs_user_id_idx ON public.audit_logs USING btree (user_id);


--
-- TOC entry 5006 (class 1259 OID 17855)
-- Name: backup_config_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_config_key_idx ON public.backup_config USING btree (key);


--
-- TOC entry 5037 (class 1259 OID 17973)
-- Name: backup_logs_backup_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_logs_backup_id_idx ON public.backup_logs USING btree (backup_id);


--
-- TOC entry 5038 (class 1259 OID 17974)
-- Name: backup_logs_level_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_logs_level_idx ON public.backup_logs USING btree (level);


--
-- TOC entry 5041 (class 1259 OID 17975)
-- Name: backup_logs_timestamp_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_logs_timestamp_idx ON public.backup_logs USING btree ("timestamp");


--
-- TOC entry 5001 (class 1259 OID 17836)
-- Name: backup_schedule_enabled_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_schedule_enabled_idx ON public.backup_schedule USING btree (enabled);


--
-- TOC entry 5002 (class 1259 OID 17837)
-- Name: backup_schedule_frequency_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_schedule_frequency_idx ON public.backup_schedule USING btree (frequency);


--
-- TOC entry 5003 (class 1259 OID 17838)
-- Name: backup_schedule_next_run_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX backup_schedule_next_run_at_idx ON public.backup_schedule USING btree (next_run_at);


--
-- TOC entry 4981 (class 1259 OID 17719)
-- Name: committee_rank_entries_application_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX committee_rank_entries_application_id_unique ON public.committee_rank_entries USING btree (application_id);


--
-- TOC entry 4984 (class 1259 OID 17721)
-- Name: committee_rank_entries_round_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX committee_rank_entries_round_id_idx ON public.committee_rank_entries USING btree (round_id);


--
-- TOC entry 4985 (class 1259 OID 17720)
-- Name: committee_rank_entries_round_rank_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX committee_rank_entries_round_rank_unique ON public.committee_rank_entries USING btree (round_id, rank_position);


--
-- TOC entry 4994 (class 1259 OID 17803)
-- Name: complaint_messages_sender_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX complaint_messages_sender_user_id_idx ON public.complaint_messages USING btree (sender_user_id);


--
-- TOC entry 4995 (class 1259 OID 17802)
-- Name: complaint_messages_thread_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX complaint_messages_thread_id_idx ON public.complaint_messages USING btree (thread_id);


--
-- TOC entry 4996 (class 1259 OID 17804)
-- Name: complaint_threads_lecturer_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX complaint_threads_lecturer_user_id_idx ON public.complaint_threads USING btree (lecturer_user_id);


--
-- TOC entry 4999 (class 1259 OID 17806)
-- Name: complaint_threads_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX complaint_threads_status_idx ON public.complaint_threads USING btree (status);


--
-- TOC entry 5000 (class 1259 OID 17805)
-- Name: complaint_threads_target_department_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX complaint_threads_target_department_idx ON public.complaint_threads USING btree (target_department);


--
-- TOC entry 4949 (class 1259 OID 17498)
-- Name: housing_units_block_room_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX housing_units_block_room_unique ON public.housing_units USING btree (block_number, room_number);


--
-- TOC entry 4974 (class 1259 OID 17990)
-- Name: idx_applications_final_score; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_applications_final_score ON public.applications USING btree (final_score);


--
-- TOC entry 4975 (class 1259 OID 17680)
-- Name: lecturer_documents_application_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lecturer_documents_application_id_idx ON public.lecturer_documents USING btree (application_id);


--
-- TOC entry 4978 (class 1259 OID 17681)
-- Name: lecturer_documents_purpose_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lecturer_documents_purpose_idx ON public.lecturer_documents USING btree (purpose);


--
-- TOC entry 4979 (class 1259 OID 17682)
-- Name: lecturer_documents_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lecturer_documents_status_idx ON public.lecturer_documents USING btree (status);


--
-- TOC entry 4980 (class 1259 OID 17679)
-- Name: lecturer_documents_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lecturer_documents_user_id_idx ON public.lecturer_documents USING btree (user_id);


--
-- TOC entry 4954 (class 1259 OID 17549)
-- Name: lecturer_scoring_criteria_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lecturer_scoring_criteria_user_id_idx ON public.lecturer_scoring_criteria USING btree (user_id);


--
-- TOC entry 4955 (class 1259 OID 17548)
-- Name: lecturer_scoring_criteria_user_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX lecturer_scoring_criteria_user_id_unique ON public.lecturer_scoring_criteria USING btree (user_id);


--
-- TOC entry 4941 (class 1259 OID 17454)
-- Name: otp_codes_expires_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX otp_codes_expires_at_idx ON public.otp_codes USING btree (expires_at);


--
-- TOC entry 4944 (class 1259 OID 17458)
-- Name: otp_codes_user_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX otp_codes_user_id_unique ON public.otp_codes USING btree (user_id);


--
-- TOC entry 4956 (class 1259 OID 17551)
-- Name: score_snapshots_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX score_snapshots_created_at_idx ON public.score_snapshots USING btree (created_at);


--
-- TOC entry 4959 (class 1259 OID 17550)
-- Name: score_snapshots_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX score_snapshots_user_id_idx ON public.score_snapshots USING btree (user_id);


--
-- TOC entry 4960 (class 1259 OID 17552)
-- Name: scoring_policies_effective_from_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX scoring_policies_effective_from_idx ON public.scoring_policies USING btree (effective_from);


--
-- TOC entry 5027 (class 1259 OID 17929)
-- Name: system_backups_created_by_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_backups_created_by_idx ON public.system_backups USING btree (created_by);


--
-- TOC entry 5030 (class 1259 OID 17927)
-- Name: system_backups_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_backups_status_idx ON public.system_backups USING btree (status);


--
-- TOC entry 5031 (class 1259 OID 17928)
-- Name: system_backups_type_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_backups_type_idx ON public.system_backups USING btree (type);


--
-- TOC entry 5017 (class 1259 OID 17891)
-- Name: system_config_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX system_config_key_idx ON public.system_config USING btree (key);


--
-- TOC entry 4945 (class 1259 OID 17455)
-- Name: users_email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_email_unique ON public.users USING btree (email);


--
-- TOC entry 4948 (class 1259 OID 17456)
-- Name: users_role_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_role_idx ON public.users USING btree (role);


--
-- TOC entry 5076 (class 2606 OID 17940)
-- Name: allocation_overrides allocation_overrides_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_overrides
    ADD CONSTRAINT allocation_overrides_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5077 (class 2606 OID 17945)
-- Name: allocation_overrides allocation_overrides_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_overrides
    ADD CONSTRAINT allocation_overrides_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5062 (class 2606 OID 17750)
-- Name: allocation_results allocation_results_allocated_by_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_results
    ADD CONSTRAINT allocation_results_allocated_by_user_id_users_id_fk FOREIGN KEY (allocated_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5063 (class 2606 OID 17740)
-- Name: allocation_results allocation_results_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_results
    ADD CONSTRAINT allocation_results_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 5064 (class 2606 OID 17745)
-- Name: allocation_results allocation_results_housing_unit_id_housing_units_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_results
    ADD CONSTRAINT allocation_results_housing_unit_id_housing_units_id_fk FOREIGN KEY (housing_unit_id) REFERENCES public.housing_units(id) ON DELETE RESTRICT;


--
-- TOC entry 5065 (class 2606 OID 17735)
-- Name: allocation_results allocation_results_round_id_application_rounds_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allocation_results
    ADD CONSTRAINT allocation_results_round_id_application_rounds_id_fk FOREIGN KEY (round_id) REFERENCES public.application_rounds(id) ON DELETE CASCADE;


--
-- TOC entry 5073 (class 2606 OID 17904)
-- Name: announcements announcements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5051 (class 2606 OID 17601)
-- Name: application_rounds application_rounds_created_by_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.application_rounds
    ADD CONSTRAINT application_rounds_created_by_user_id_users_id_fk FOREIGN KEY (created_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5052 (class 2606 OID 17616)
-- Name: applications applications_preferred_housing_unit_id_housing_units_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_preferred_housing_unit_id_housing_units_id_fk FOREIGN KEY (preferred_housing_unit_id) REFERENCES public.housing_units(id) ON DELETE SET NULL;


--
-- TOC entry 5053 (class 2606 OID 17684)
-- Name: applications applications_reviewed_by_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_reviewed_by_user_id_users_id_fk FOREIGN KEY (reviewed_by_user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5054 (class 2606 OID 17611)
-- Name: applications applications_round_id_application_rounds_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_round_id_application_rounds_id_fk FOREIGN KEY (round_id) REFERENCES public.application_rounds(id) ON DELETE CASCADE;


--
-- TOC entry 5055 (class 2606 OID 17621)
-- Name: applications applications_score_snapshot_id_score_snapshots_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_score_snapshot_id_score_snapshots_id_fk FOREIGN KEY (score_snapshot_id) REFERENCES public.score_snapshots(id) ON DELETE SET NULL;


--
-- TOC entry 5056 (class 2606 OID 17606)
-- Name: applications applications_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5071 (class 2606 OID 17865)
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5070 (class 2606 OID 17850)
-- Name: backup_config backup_config_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_config
    ADD CONSTRAINT backup_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5078 (class 2606 OID 17968)
-- Name: backup_logs backup_logs_backup_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_logs
    ADD CONSTRAINT backup_logs_backup_id_fkey FOREIGN KEY (backup_id) REFERENCES public.system_backups(id) ON DELETE CASCADE;


--
-- TOC entry 5069 (class 2606 OID 17831)
-- Name: backup_schedule backup_schedule_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.backup_schedule
    ADD CONSTRAINT backup_schedule_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5059 (class 2606 OID 17709)
-- Name: committee_rank_entries committee_rank_entries_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_rank_entries
    ADD CONSTRAINT committee_rank_entries_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE CASCADE;


--
-- TOC entry 5060 (class 2606 OID 17704)
-- Name: committee_rank_entries committee_rank_entries_round_id_application_rounds_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_rank_entries
    ADD CONSTRAINT committee_rank_entries_round_id_application_rounds_id_fk FOREIGN KEY (round_id) REFERENCES public.application_rounds(id) ON DELETE CASCADE;


--
-- TOC entry 5061 (class 2606 OID 17714)
-- Name: committee_rank_entries committee_rank_entries_updated_by_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.committee_rank_entries
    ADD CONSTRAINT committee_rank_entries_updated_by_user_id_users_id_fk FOREIGN KEY (updated_by_user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- TOC entry 5066 (class 2606 OID 17792)
-- Name: complaint_messages complaint_messages_sender_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_messages
    ADD CONSTRAINT complaint_messages_sender_user_id_users_id_fk FOREIGN KEY (sender_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5067 (class 2606 OID 17787)
-- Name: complaint_messages complaint_messages_thread_id_complaint_threads_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_messages
    ADD CONSTRAINT complaint_messages_thread_id_complaint_threads_id_fk FOREIGN KEY (thread_id) REFERENCES public.complaint_threads(id) ON DELETE CASCADE;


--
-- TOC entry 5068 (class 2606 OID 17797)
-- Name: complaint_threads complaint_threads_lecturer_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_threads
    ADD CONSTRAINT complaint_threads_lecturer_user_id_users_id_fk FOREIGN KEY (lecturer_user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5057 (class 2606 OID 17674)
-- Name: lecturer_documents lecturer_documents_application_id_applications_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lecturer_documents
    ADD CONSTRAINT lecturer_documents_application_id_applications_id_fk FOREIGN KEY (application_id) REFERENCES public.applications(id) ON DELETE SET NULL;


--
-- TOC entry 5058 (class 2606 OID 17669)
-- Name: lecturer_documents lecturer_documents_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lecturer_documents
    ADD CONSTRAINT lecturer_documents_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5048 (class 2606 OID 17533)
-- Name: lecturer_scoring_criteria lecturer_scoring_criteria_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lecturer_scoring_criteria
    ADD CONSTRAINT lecturer_scoring_criteria_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5047 (class 2606 OID 17448)
-- Name: otp_codes otp_codes_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp_codes
    ADD CONSTRAINT otp_codes_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5049 (class 2606 OID 17543)
-- Name: score_snapshots score_snapshots_scoring_policy_id_scoring_policies_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_snapshots
    ADD CONSTRAINT score_snapshots_scoring_policy_id_scoring_policies_id_fk FOREIGN KEY (scoring_policy_id) REFERENCES public.scoring_policies(id) ON DELETE SET NULL;


--
-- TOC entry 5050 (class 2606 OID 17538)
-- Name: score_snapshots score_snapshots_user_id_users_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.score_snapshots
    ADD CONSTRAINT score_snapshots_user_id_users_id_fk FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5074 (class 2606 OID 17922)
-- Name: system_backups system_backups_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_backups
    ADD CONSTRAINT system_backups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5075 (class 2606 OID 17953)
-- Name: system_backups system_backups_restored_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_backups
    ADD CONSTRAINT system_backups_restored_by_fkey FOREIGN KEY (restored_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 5072 (class 2606 OID 17886)
-- Name: system_config system_config_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_config
    ADD CONSTRAINT system_config_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


-- Completed on 2026-05-08 23:47:50

--
-- PostgreSQL database dump complete
--

\unrestrict CTv8AthyZbmMbYZiJ3cL27SgC26PaZJuODsvcrSLfgc5sNILEOYJL1eh5ProqY5

