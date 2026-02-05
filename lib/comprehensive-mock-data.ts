// Comprehensive Mock Data
// Based on Swagger API documentation for iMed platform
// Matches all mobile API endpoints with realistic data

export const mockData = {
  // Authentication endpoints
  '/auth/user/login': {
    access_token: 'mock-jwt-token-' + Date.now(),
    refresh_token: 'mock-refresh-token-' + Date.now(),
    id: 'user-' + Date.now(),
    role: 'user'
  },
  '/auth/user/check': {
    has_account: true
  },
  '/auth/password/change': 'Password changed successfully',

  // User profile endpoints
  '/user/get/profile': {
    id: 'user-' + Date.now(),
    phone_number: '+998910000000',
    name: 'Test User',
    fcm_token: null,
    image_url: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=User'
  },
  '/user/update/profile': 'Profile updated successfully',
  '/user/delete/profile': 'Profile deleted successfully',

  // Course endpoints
  '/course': {
    courses: [
      {
        id: 'course-1',
        name: 'Asosiy tibbiyot',
        description: 'Tibbiyotning asosiy tamoyillari va konsepsiyalari',
        image_url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Course+1',
        teacher_name: 'Dr. Alisher Karimov',
        is_active: true,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: 'course-2',
        name: 'Jarrohlik',
        description: 'Jarrohlik usullari va operatsiyalar',
        image_url: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Course+2',
        teacher_name: 'Dr. Gulnora Nazarova',
        is_active: true,
        created_at: '2024-01-20T10:00:00Z',
        updated_at: '2024-01-20T10:00:00Z'
      },
      {
        id: 'course-3',
        name: 'Terapiya',
        description: 'Ichki kasalliklarni davolash usullari',
        image_url: 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Course+3',
        teacher_name: 'Dr. Bekzod Umarov',
        is_active: true,
        created_at: '2024-01-25T10:00:00Z',
        updated_at: '2024-01-25T10:00:00Z'
      }
    ],
    count: 3
  },
  '/course/1': {
    id: 'course-1',
    name: 'Asosiy tibbiyot',
    description: 'Tibbiyotning asosiy tamoyillari va konsepsiyalari. Bu kursda tibbiyot tarixi, asosiy tushunchalar va zamonaviy yondashuvlar ko\'rib chiqiladi.',
    image_url: 'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=Asosiy+tibbiyot',
    teacher_name: 'Dr. Alisher Karimov',
    teacher_image_url: 'https://via.placeholder.com/100x100/4F46E5/FFFFFF?text=Teacher',
    duration: 120, // hours
    price: 500000, // UZS
    is_active: true,
    lessons_count: 15,
    students_count: 234,
    rating: 4.8,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  '/course/permission': {
    user_courses: [
      {
        id: 'user-course-1',
        course_id: 'course-1',
        course_name: 'Asosiy tibbiyot',
        course_image_url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Course+1',
        user_id: 'user-' + Date.now(),
        user_name: 'Test User',
        tariff_id: 'tariff-1',
        tariff_name: 'Premium',
        duration: 120,
        percentage: 65,
        total_lessons: 15,
        completed_lessons: 10,
        is_active: true,
        started_at: '2024-01-15T10:00:00Z',
        ended_at: '2024-05-15T10:00:00Z',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z'
      }
    ],
    count: 1
  },
  '/course/permission/1': {
    id: 'user-course-1',
    course_id: 'course-1',
    course_name: 'Asosiy tibbiyot',
    course_image_url: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Course+1',
    user_id: 'user-' + Date.now(),
    user_name: 'Test User',
    tariff_id: 'tariff-1',
    tariff_name: 'Premium',
    duration: 120,
    percentage: 65,
    total_lessons: 15,
    completed_lessons: 10,
    is_active: true,
    started_at: '2024-01-15T10:00:00Z',
    ended_at: '2024-05-15T10:00:00Z',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-02-01T10:00:00Z'
  },

  // Lesson endpoints
  '/lesson/1': {
    id: 'lesson-1',
    title: 'Tibbiyotga kirish',
    description: 'Tibbiyot faniga kirish, asosiy tushunchalar va tarix',
    video_url: 'https://sample-videos.com/zip-10/sample.mp4',
    duration: 45, // minutes
    order: 1,
    course_id: 'course-1',
    is_completed: false,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  },
  '/lesson/1/end': 'Lesson marked as completed',

  // Subject endpoints
  '/subject': {
    subjects: [
      {
        id: 'subject-1',
        name: 'Anatomiya',
        description: 'Inson tanasining tuzilishi va funksiyalari',
        image_url: 'https://via.placeholder.com/200x200/EF4444/FFFFFF?text=Anatomiya',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'subject-2',
        name: 'Fiziologiya',
        description: 'Organizmlarning hayotiy faoliyati',
        image_url: 'https://via.placeholder.com/200x200/10B981/FFFFFF?text=Fiziologiya',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'subject-3',
        name: 'Biokimyo',
        description: 'Hayotiy jarayonlarning kimyoviy asoslari',
        image_url: 'https://via.placeholder.com/200x200/F59E0B/FFFFFF?text=Biokimyo',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    count: 3
  },

  // Banner endpoints
  '/banner': {
    banners: [
      {
        id: 'banner-1',
        title: 'Yangi kurslar!',
        description: '2024 yil uchun eng yangi tibbiyot kurslari',
        image_url: 'https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=New+Courses',
        link_url: '/courses',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'banner-2',
        title: 'Chegirma',
        description: 'Barcha kurslarda 20% chegirma',
        image_url: 'https://via.placeholder.com/800x400/EF4444/FFFFFF?text=Sale+20%25',
        link_url: '/tariffs',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    count: 2
  },

  // Notification endpoints
  '/notification/user': {
    notifications: [
      {
        id: 'notif-1',
        title: 'Yangi dars',
        description: 'Asosiy tibbiyot kursida yangi dars qo\'shildi',
        type: 'lesson',
        is_read: false,
        created_at: '2024-02-01T10:00:00Z'
      },
      {
        id: 'notif-2',
        title: 'Kurs tugadi',
        description: 'Tabriklaymiz, siz kursni muvaffaqiyatli tamomladingiz!',
        type: 'course_completion',
        is_read: false,
        created_at: '2024-01-30T16:00:00Z'
      },
      {
        id: 'notif-3',
        title: 'Tizim yangilanishi',
        description: 'Platformada yangi imkoniyatlar qo\'shildi',
        type: 'system',
        is_read: true,
        created_at: '2024-01-25T12:00:00Z'
      }
    ],
    count: 3
  },
  '/notification/1/read': 'Notification marked as read',

  // About endpoints
  '/about': {
    abouts: [
      {
        id: 'about-1',
        title: 'Biz haqimizda',
        content: 'iMed Team - bu zamonaviy tibbiyot ta\'lim platformasi. Biz talabalarga sifatli ta\'lim taklif etamiz.',
        image_url: 'https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=About+Us',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    count: 1
  },

  // FAQ endpoints
  '/faq': {
    faqs: [
      {
        id: 'faq-1',
        question: 'Kurslarga qanday qatnashish mumkin?',
        answer: 'Platformaga ro\'yxatdan o\'ting, kerakli kursni tanlang va to\'lov amalga oshiring.',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'faq-2',
        question: 'Kursni qachon boshlash mumkin?',
        answer: 'Kurslarni istalgan vaqtda boshlashingiz mumkin, ular o\'z-o\'zidan davom etadi.',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    count: 2
  },

  // App Route endpoints
  '/app-route': {
    app_routes: [
      {
        id: 'route-1',
        title: 'Bosh sahifa',
        path: '/app',
        icon: 'home',
        is_active: true,
        order: 1,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'route-2',
        title: 'Kurslarim',
        path: '/app/my-courses',
        icon: 'book',
        is_active: true,
        order: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    count: 2
  },

  // Tariff endpoints
  '/tariff': {
    tariffs: [
      {
        id: 'tariff-1',
        name: 'Basic',
        description: 'Asosiy kurslarga kirish',
        price: 200000,
        duration: 30, // days
        features: ['10 ta kurs', 'Asosiy qo\'llab-quvvatlash'],
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      },
      {
        id: 'tariff-2',
        name: 'Premium',
        description: 'Barcha kurslarga to\'liq kirish',
        price: 500000,
        duration: 90, // days
        features: ['Barcha kurslar', 'VIP qo\'llab-quvvatlash', 'Sertifikat'],
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      }
    ],
    count: 2
  },

  // Order endpoints
  '/order': 'Order created successfully',

  // Contact endpoints
  '/contact': 'Message sent successfully',

  // User activity endpoints
  '/user/activity/stats': {
    total_watch_time: 1200, // minutes
    completed_lessons: 15,
    total_lessons: 20,
    streak: 5, // days
    last_active: '2024-02-01T10:00:00Z'
  },
  '/user/activity': 'Activity recorded successfully',

  // Rating endpoints
  '/user/rating': {
    rating: 4.8,
    total_reviews: 127,
    position: 15, // in leaderboard
    total_users: 500
  }
};

// Helper function to get mock response for any endpoint
export function getMockResponse(endpoint: string, params?: any): any {
  // Handle dynamic endpoints with IDs
  if (endpoint.includes('/course/') && !endpoint.includes('/permission')) {
    const courseId = endpoint.split('/')[2];
    return (mockData as any)[`/course/${courseId}`] || (mockData as any)['/course/1'];
  }
  
  if (endpoint.includes('/course/permission/') && endpoint.split('/').length > 3) {
    const courseId = endpoint.split('/')[3];
    return (mockData as any)[`/course/permission/${courseId}`] || (mockData as any)['/course/permission/1'];
  }
  
  if (endpoint.includes('/lesson/') && !endpoint.includes('/end')) {
    const lessonId = endpoint.split('/')[2];
    return (mockData as any)[`/lesson/${lessonId}`] || (mockData as any)['/lesson/1'];
  }
  
  if (endpoint.includes('/notification/') && endpoint.includes('/read')) {
    return (mockData as any)['/notification/1/read'];
  }
  
  // Return static mock data
  return (mockData as any)[endpoint];
}
