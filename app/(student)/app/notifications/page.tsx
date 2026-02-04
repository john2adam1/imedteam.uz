'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '@/services/mobile-api';
import { UserNotification } from '@/types/mobile-api';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const params = filter === 'unread' ? { is_read: false } as any : undefined;
      const response = await notificationService.getAll(params);
      setNotifications(response.notifications || []);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      // Update local state
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading && notifications.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bildirishnomalar</h1>
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'all'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            Hammasi
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'unread'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            O'qilmagan
          </button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-slate-50 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-medium italic">
            {filter === 'unread' ? 'O\'qilmagan bildirishnomalar yo\'q' : 'Hozircha bildirishnomalar yo\'q'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-3xl p-6 shadow-sm border transition-all hover:shadow-md ${!notification.is_read ? 'border-primary-100 bg-primary-50/10' : 'border-slate-100'}`}
            >
              <div className="flex justify-between items-start gap-4 mb-2">
                <h3 className={`text-lg font-bold text-slate-800 ${!notification.is_read ? 'text-primary-900' : ''}`}>
                  {notification.title}
                </h3>
                {!notification.is_read && (
                  <button
                    onClick={() => handleMarkAsRead(notification.id)}
                    className="flex-shrink-0 text-[10px] font-black uppercase tracking-widest text-primary-600 hover:text-primary-700 transition-colors bg-white px-3 py-1 rounded-lg border border-primary-100 shadow-sm"
                  >
                    O'qildi
                  </button>
                )}
              </div>
              <p className="text-slate-600 text-sm mb-4 leading-relaxed">{notification.message}</p>
              <div className="flex items-center gap-2 text-slate-400">
                <span className="text-[10px] font-bold uppercase tracking-widest">{formatDate(notification.created_at)}</span>
                {!notification.is_read && (
                  <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse"></span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

