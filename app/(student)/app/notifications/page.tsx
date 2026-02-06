'use client';

import { useEffect, useState } from 'react';
import { notificationService } from '@/services';
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
      const response = await notificationService.getNotifications(params);
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
    <div style={{ padding: '20px' }}>
      <h1>Bildirishnomalar</h1>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'all' ? '#007bff' : '#f8f9fa',
            color: filter === 'all' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          Hammasi
        </button>
        <button
          onClick={() => setFilter('unread')}
          style={{
            padding: '8px 16px',
            backgroundColor: filter === 'unread' ? '#007bff' : '#f8f9fa',
            color: filter === 'unread' ? 'white' : 'black',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}
        >
          O'qilmagan
        </button>
      </div>

      {notifications.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', border: '1px dashed #ccc' }}>
          <p>{filter === 'unread' ? "O'qilmagan bildirishnomalar yo'q" : "Hozircha bildirishnomalar yo'q"}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '15px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                backgroundColor: !notification.is_read ? '#f0f7ff' : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{notification.title}</h3>
                {!notification.is_read && (
                  <button onClick={() => handleMarkAsRead(notification.id)}>Mark as Read</button>
                )}
              </div>
              <p style={{ margin: '0 0 10px 0' }}>{notification.message}</p>
              <span style={{ fontSize: '10px', color: '#999' }}>{formatDate(notification.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

