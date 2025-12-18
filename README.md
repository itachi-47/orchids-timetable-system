# SATS - Smart Academic Timetable System

An intelligent, constraint-based timetable scheduling platform for academic institutions.

## Features

- Automated conflict-free timetable generation
- Role-based access control (Admin, HOD, Coordinator, Faculty, Student)
- Resource management (Subjects, Faculty, Rooms, Batches)
- Draft workflow with HOD approval system
- PDF and Excel export in MITS format

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes, Server Actions
- **Database**: Supabase (PostgreSQL), MongoDB
- **Authentication**: NextAuth.js

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Set up environment variables (copy `.env.example` to `.env.local`)
4. Run the development server:
   ```bash
   bun dev
   ```

## Test Credentials

All test accounts use password: `test123`

| Role        | Email                          |
|-------------|--------------------------------|
| Admin       | testadmin@mitsgwalior.in       |
| HOD         | testhod@mitsgwalior.in         |
| Coordinator | testcoordinator@mitsgwalior.in |
| Faculty     | testfaculty@mitsgwalior.in     |
| Student     | teststudent@mitsgwl.ac.in      |

## License

MIT
