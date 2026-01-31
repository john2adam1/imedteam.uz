# EduPlatform - Educational Platform

A simple, clean, API-ready educational platform built with Next.js (App Router) and TypeScript.

## Features

- **Home Page**: Banner, categories, and course listings
- **Category Pages**: Browse courses by category
- **Course Detail**: View course modules and lessons
- **Lesson Page**: Watch videos, download PDFs, and access test materials
- **Notifications**: View and manage notifications
- **Login**: Simple phone number-based authentication (no OTP)

## Project Structure

```
imed-app/
├── app/                    # Next.js App Router pages
│   ├── category/[slug]/   # Category detail page
│   ├── course/[slug]/     # Course detail and lesson pages
│   ├── notifications/    # Notifications page
│   ├── login/             # Login page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── Banner.tsx
│   ├── CategoryCard.tsx
│   ├── CourseCard.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   └── ModuleList.tsx
├── services/             # API service layer
│   └── api.ts            # All API calls (currently using mock data)
├── types/                # TypeScript interfaces
│   └── index.ts
├── mock/                 # Mock data
│   └── data.ts
└── public/               # Static assets
```

## Data Structure

```
Category
  └── Course (free or paid)
      └── Module
          └── Lesson (free or paid)
              ├── Video
              ├── PDF
              └── Test PDF
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The project is structured to easily integrate with a real API:

1. **Update `services/api.ts`**: Replace mock data calls with actual API endpoints
2. **Set API URL**: Update `API_BASE_URL` in `services/api.ts` or use environment variables
3. **Add Authentication**: Implement token storage and include in API headers
4. **Error Handling**: Add proper error handling for API failures

### Example API Integration

In `services/api.ts`, replace:
```typescript
// Current (mock)
return mockCourses;

// With actual API call
const response = await fetch(`${API_BASE_URL}/courses`);
if (!response.ok) throw new Error('Failed to fetch courses');
return response.json();
```

## Key Design Decisions

- **Separation of Concerns**: Components don't fetch data directly; all API calls go through services
- **Type Safety**: Full TypeScript coverage with interfaces in `/types`
- **Minimal Design**: Clean, simple UI that's easy to customize
- **Mock Data**: Ready-to-use mock data for development
- **API-Ready**: Service layer prepared for easy API integration

## Future Enhancements

- Add video player component for lesson videos
- Implement user authentication and session management
- Add course enrollment functionality
- Implement payment processing
- Add search functionality
- Add user dashboard
- Add course progress tracking

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 18**

