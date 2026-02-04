# iMed Team - Educational Platform

A premium, API-driven medical education platform built with Next.js (App Router), Tailwind CSS, and TypeScript.

## Core Features

- **Student Application**: Personalized learning dashboard, course catalog, lesson player with video & materials, and learning statistics.
- **Admin Panel**: Comprehensive management of banners, courses, subjects, and users.
- **Landing Site**: High-converting landing pages for course promotion.
- **Unified Auth**: Phone-number based authentication with separate flows for students and administrators.
- **Real-time Notifications**: System-wide notifications for student updates.

## Project Structure

```
imedteam/
├── app/
│   ├── (landing)/      # Public marketing pages
│   ├── (auth)/         # Centralized login & registration
│   ├── (student)/app/  # Student portal (courses, lessons, leaderboard, profile)
│   └── (admin)/admin/  # Administrator dashboard
├── components/
│   ├── student/        # UI components specifically for students
│   ├── admin/          # UI components for the admin panel
│   ├── landing/        # Sections for the marketing pages
│   ├── common/         # Shared utilities like Toast providers
│   └── ui/             # Primitive UI components (buttons, cards, etc.)
├── services/           # API Service Layer
│   ├── mobile-api.ts   # Client for the /mobile endpoints (Student App)
│   └── admin-api.ts    # Client for the /web endpoints (Admin Panel)
├── types/              # TypeScript Type Definitions
│   ├── mobile-api.ts   # Student App types compliant with Swagger
│   └── admin.ts        # Admin Panel types
└── lib/                # Shared utilities & context providers
    ├── auth-context.ts # Global authentication state management
    └── api-client.ts   # Base fetch wrapper for consistent API calls
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set Environment Variables**:
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=https://dev.axadjonovsardorbek.uz/api
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

## Development Standards

- **API Compliance**: All services must strictly follow the Swagger documentation.
- **Premium Styling**: Use the defined design system (Tailwind CSS) with a focus on modern, vibrant aesthetics.
- **Type Safety**: Ensure all API responses are correctly typed in `types/mobile-api.ts` or `types/admin.ts`.
- **Client/Server Balance**: Use `'use client'` strategically for interactive components while leveraging Server Components for metadata and initial loads.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Lucide React (Icons)
- **State Management**: React Context, Cookies
- **Language**: TypeScript
- **Notifications**: React Hot Toast
