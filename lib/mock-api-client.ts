// Mock API Client for Development
// Use this when the real API is down

export interface ApiClientOptions extends RequestInit {
    requiresAuth?: boolean;
}

// Mock responses
const mockResponses = {
    '/auth/user/login': {
        access_token: 'mock-token-12345',
        refresh_token: 'mock-refresh-12345',
        id: 'user-123',
        role: 'user'
    },
    '/auth/user/check': {
        has_account: true
    },
    '/user/get/profile': {
        id: 'user-123',
        phone_number: '+998910000000',
        name: 'Test User',
        fcm_token: null,
        image_url: null
    },
    '/course': {
        courses: [
            {
                id: 'course-1',
                name: 'Test Course',
                description: 'Test Description',
                image_url: null,
                is_active: true,
                created_at: '2024-01-01T00:00:00Z',
                updated_at: '2024-01-01T00:00:00Z'
            }
        ],
        count: 1
    }
};

export async function mockApiClient<T>(
    endpoint: string,
    options: ApiClientOptions = {}
): Promise<T> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockResponse = mockResponses[endpoint as keyof typeof mockResponses];
    
    if (mockResponse) {
        return mockResponse as T;
    }

    // For endpoints without mocks, return empty success
    if (endpoint.includes('/notification/') && endpoint.includes('/read')) {
        return 'Success' as T;
    }

    if (endpoint.includes('/lesson/') && endpoint.includes('/end')) {
        return 'Lesson completed' as T;
    }

    throw new Error(`Mock endpoint not implemented: ${endpoint}`);
}

export function setAuthToken(token: string): void {
    console.log('Mock: Setting auth token:', token);
    localStorage.setItem('auth_token', token);
}

export function removeAuthToken(): void {
    console.log('Mock: Removing auth token');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
}
