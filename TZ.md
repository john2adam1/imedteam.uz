# IMED Technical Specification (TZ) & Project Documentation

## 1. Project Overview
**IMED** is a modern educational platform specifically designed for medical professionals and students. It provides access to video courses, study materials, and testing systems with a premium, responsive UI.

## 2. Technology Stack
- **Framework**: [Next.js 14.0.4](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React Hooks (useState, useEffect) & Context API
- **Icons**: Lucide React
- **Video Player**: [Plyr](https://plyr.io/) (Custom implementation for YouTube/Server fallback)
- **Database/Auth**: Firebase (v12)
- **Animations**: CSS Transitions, Scroll Reveals, Canvas Confetti

## 3. Project Structure
```text
/app
  /(auth)         # Authentication routes (Login, Signup)
  /(landing)      # Main landing page components
  /(student)      # Student dashboard and course consumption
    /lessons      # Lesson view with video player and materials
  /api            # Internal API routes
/components
  /landing        # Marketing sections (Hero, Team, Partners)
  /student        # Learning-specific components
  /ui             # Reusable UI elements (PDFViewer, CustomPlyr)
/lib
  auth-context    # Firebase authentication logic
  language-context# Multi-language support
/services
  lesson.service  # API calls for lesson data
  course.service  # API calls for course listings
  auth.service    # Authentication API wrappers
```

## 4. API Integration & Swagger

### 4.1. Documentation
The project includes a Swagger documentation file at `swagger.json` in the root directory. This contains the full specification of the backend API.
- **Base URL**: `https://prod.axadjonovsardorbek.uz`
- **Default Namespace**: `/mobile` (handled automatically by `apiClient`)

### 4.2. Service to Endpoint Mapping

#### Authentication (`auth.ts`)
| Function | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `login` | POST | `/auth/user/login` | Authenticate user |
| `checkUser` | POST | `/auth/user/check` | Check if user exists |
| `sendOtp` | POST | `/auth/user/otp/send` | Send verification code |
| `confirmOtp` | POST | `/auth/user/otp/confirm` | Verify code |
| `changePassword` | PUT | `/auth/password/change` | Update credentials |

#### Courses (`course.ts`)
| Function | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `getCourses` | GET | `/course` | List all courses |
| `getCourseById` | GET | `/course/{id}` | Detailed course info |
| `getUserCourses` | GET | `/course/permission` | Courses user has access to |
| `getCourseWithPermission` | GET | `/course/permission/{id}` | Specific enrollment info |

#### Lessons (`lesson.ts`)
| Function | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| `getLessonById` | GET | `/lesson/{id}` | Get video and materials |
| `endLesson` | PUT | `/lesson/{id}/end` | Mark lesson as complete |

#### Other Systems
- **Banners**: `bannerService` -> `/banner` (GET)
- **Profile**: `profileService` -> `/user/profile` (GET/PUT)
- **Activity**: `activityService` -> `/user/activity` (POST)
- **Notifications**: `notificationService` -> `/user/notification` (GET)

## 5. Key Functional Modules

### 5.1. Video Player System (CustomPlyr)
The platform uses a robust video delivery system that handles:
- **YouTube Source**: Primary source for lessons.
- **Server Fallback**: Automatic failover to local server storage if YouTube is blocked or fails.
- **Custom UI**: Integrated with Plyr for a consistent professional look.
- **Stability Fix**: Uses direct element references instead of selectors to support multiple videos per page without conflicts.

### 5.2. Learning Management
- **Lessons**: Sequential access to video content.
- **Materials**: Built-in PDF viewer for study guides and documents.
- **Progress Tracking**: Automatic tracking of lesson completion.
- **Tests**: Integrated testing system for each module.

### 5.3. User Experience
- **Responsive Design**: Mobile-first architecture.
- **Theme**: Premium "Medical" aesthetic (Primary colors: Maroon/Gold, clean white backgrounds).
- **Interactions**: Smooth scroll reveals, interactive course cards, and success animations.

## 6. Development Guidelines
- **Component Creation**: Use `use client` only where necessary.
- **Styling**: Follow the established Tailwind design tokens. Use `class-variance-authority` (CVA) for complex components.
- **Services**: All API calls should be encapsulated in the `/services` folder.
- **Types**: Always define interfaces in the `types/` folder or within the service file for data structures.

## 7. Recent Maintenance & Fixes
- **[2026-06-08]**: Fixed a critical `TypeError` in Plyr initialization where multiple players on one page were conflicting due to selector-based initialization in `plyr-react`. Switched to `CustomPlyr` using direct element refs.
- **[2026-06-08]**: Stabilized player container keys to prevent unnecessary unmounts during YouTube API ready state.

## 8. Configuration
- **Environment**: `.env` file should contain Firebase credentials and API base URLs.
- **Docker**: Project includes `Dockerfile` and `docker-compose.yaml` for containerized deployment.

---
*Created by Antigravity AI for developer handoff.*
