# Mobile API Client Documentation

This project provides a clean, simple API client for the mobile application using only `/mobile/*` endpoints.

## Architecture

- **API Client**: `lib/api-client.ts` - Core HTTP client with authentication
- **Services**: `services/*.ts` - Domain-specific API services
- **Types**: `types/mobile-api.ts` - TypeScript interfaces
- **Examples**: `examples/api-usage.ts` - Usage examples

## Quick Start

### 1. Import Services

```typescript
import { authService, courseService, lessonService } from '@/services';
```

### 2. Login User

```typescript
const login = async (phone: string, password: string) => {
  try {
    const response = await authService.login({
      phone_number: phone,
      password: password,
    });
    
    console.log('Login successful:', response);
    // Token is automatically stored
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### 3. Fetch Protected Data

```typescript
const getCourses = async () => {
  try {
    const courses = await courseService.getCourses();
    console.log('Courses:', courses);
    return courses;
  } catch (error) {
    console.error('Failed to fetch courses:', error);
  }
};
```

### 4. Mark Lesson as Completed

```typescript
const completeLesson = async (lessonId: string) => {
  try {
    const result = await lessonService.endLesson(lessonId);
    console.log('Lesson completed:', result);
  } catch (error) {
    console.error('Failed to complete lesson:', error);
  }
};
```

## Available Services

### Auth Service (`authService`)
- `checkUser(data)` - Check if user exists
- `login(data)` - Login and store token
- `changePassword(data)` - Change password
- `logout()` - Logout and remove token

### Course Service (`courseService`)
- `getCourses(params?)` - Get all courses
- `getCourseById(id)` - Get course by ID
- `getUserCourses(params?)` - Get user's courses
- `getCourseWithPermission(id)` - Get course with permission

### Lesson Service (`lessonService`)
- `getLessonById(id)` - Get lesson by ID
- `endLesson(id)` - Mark lesson as completed

### Profile Service (`profileService`)
- `getUserProfile()` - Get user profile
- `updateProfile(data)` - Update profile
- `deleteProfile()` - Delete profile

### Notification Service (`notificationService`)
- `getNotifications(params?)` - Get notifications
- `markAsRead(id)` - Mark notification as read

### Banner Service (`bannerService`)
- `getBanners()` - Get all banners
- `getBannerById(id)` - Get banner by ID

## API Base URL

```
https://dev.axadjonovsardorbek.uz/api/mobile
```

## Authentication

The API client automatically handles authentication tokens:

1. **Login**: Token is stored in cookies and localStorage
2. **API Calls**: Token is automatically added to Authorization header
3. **Logout**: Token is removed from storage

## Error Handling

All API calls throw errors with descriptive messages:

```typescript
try {
  const result = await someService.someMethod();
} catch (error) {
  // Error contains message from API or generic error
  console.error(error.message);
}
```

## Usage Examples

See `examples/api-usage.ts` for complete examples of:

- User authentication flow
- Profile management
- Course and lesson operations
- Notification handling
- Complete workflow example

## TypeScript Support

All API responses are fully typed with TypeScript interfaces from `types/mobile-api.ts`.

## Environment Variables

The API client uses a fixed base URL. If you need to override it, you can modify `lib/api-client.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://dev.axadjonovsardorbek.uz/api';
```

## Important Notes

- **Mobile Only**: Only `/mobile/*` endpoints are used
- **No Admin**: No admin endpoints are included
- **User-Based**: Authentication is user-based, not admin-based
- **Clean Architecture**: Simple, focused functions for each operation
- **Auto Token Management**: Tokens are handled automatically
