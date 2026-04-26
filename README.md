# 🏠 Web-Based Housing Allocation System for UOG Lecturers

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![postgresSQL](https://img.shields.io/badge/postgresSQL-8.x-4479A1?logo=postgresSQL)](https://www.postgresSQL.com/)

## 📌 Overview

The **Web-Based Housing Allocation System** is a comprehensive digital solution developed for the **University of Gondar (UOG)** to automate and streamline the housing allocation process for academic staff (lecturers). The system replaces the existing manual, paper-based process—which is prone to delays, errors, and lack of transparency—with a **fair, transparent, and efficient rule-based web platform**.

By digitizing applications, automating score calculations based on institutional policies, and providing complete audit trails, this system ensures equitable access to university housing while significantly reducing administrative workload.

---

## 🎯 Project Objectives

### General Objective
To provide a web platform that automates housing allocation for UOG lecturers, offering a transparent, equitable, and effective method of managing university housing resources.

### Specific Objectives
- Analyze the existing manual housing allocation system and identify its shortcomings.
- Design and implement a secure, role-based web platform.
- Automate scoring and ranking using predefined institutional rules.
- Provide real-time application tracking and allocation results.
- Generate comprehensive reports and maintain audit logs for accountability.
- Ensure role-based access control (RBAC) for different user types.

---

## 👥 User Roles (Role-Based Access Control)

The system implements strict **Role-Based Access Control (RBAC)** to ensure that users can only access features and data relevant to their responsibilities.

| Role                      | Key Responsibilities                                                                                   |
| ------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Lecturer**              | , submit housing application, upload documents, view score/rank/allocation results, file complaints. |
| **Housing Officer**       | Manage housing units, view ranked lists, allocate houses, publish results, generate reports, post announcements. |
| **Housing Committee**     | Review applications, approve/reject, rank applicants using score, respond to queries, manage compliance.  |
| **System Administrator**  | Manage users & roles, configure system rules, view system logs, ensure security and maintenance.           |

> 🔐 **Security Features:** Password hashing, JWT-based authentication, session management, and comprehensive audit logging of all critical actions.

---

## ⚙️ Key Features

- **Automated Rule-Based Scoring:**  
  Calculates priority scores based on academic rank (40%), years of service (35%), university responsibility (10%), family status (10%), and educational level (5%).

- **Transparent Allocation:**  
  Lecturers can view their scores, ranking, and allocation results. The system automatically handles tie-breaking and waiting lists.

- **Complaint & Compliance Management:**  
  Lecturers can submit queries/appeals; committee members can respond and track issue resolution.

- **Reporting & Audit Trail:**  
  Generate allocation summaries, occupancy reports, and maintain immutable audit logs for all actions.

- **Waiting List Automation:**  
  Unallocated applicants are automatically added to a sorted waiting list. When units become free, the system allocates to the next eligible lecturer.

---

## 🏗️ Technical Architecture

The system follows a **three-layer architecture**:

| Layer          | Technology Stack                                      |
| -------------- | ----------------------------------------------------- |
| **Presentation** | React.js (dynamic, responsive UI)                   |
| **Application**  | nodejs (business logic, rule engine, APIs) |
| **Data**          | postgers (relational database)                          |



## **OUR PROJECT = 3-LAYER FULL-STACK SYSTEM **
- 🔷 1. FRONTEND (Client Layer) 📁 Folder: /client ✔ What it contains: React components (.tsx) Pages / routing UI logic API calls to backend 🧩 Technologies used in YOUR project: React TypeScript Tailwind CSS React Hook Form + Zod React Query
  ---
- 🔷 2. BACKEND (Server Layer) 📁 Folder: /server ✔ What it contains: Express server setup API routes Controllers / logic Middleware 🧩 Technologies used: Node.js Express.js TypeScript JWT (authentication) bcrypt (password hashing) multer (file upload)
  ---
- 🔷 3. DATABASE (Data Layer) 🧩 Technology: PostgreSQL 🔗 Accessed via: Drizzle ORM and others we use
  ---
Node.js + TypeScript
Express
cors
cookie-parser
PostgreSQL
Drizzle ORM
Drizzle Kit
Brevo email
JWT authentication

**Development Tools:**  
- Figma (UI/UX design)
- Visual Studio Code
- GitHub (version control)
- Postman (API testing)
- Telegram (team collaboration)

---

## 📁 Project Structure (Simplified)

```plaintext
housing-allocation-system/
├── frontend/               # React.js UI
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Lecturer, Officer, Committee, Admin dashboards
│   │   └── services/       # API calls to backend
├── database/               # postgres schema & migration
├── doc/               # documentation's 
├── backend/                #  application
│   ├── app/
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Scoring engine, security helpers
