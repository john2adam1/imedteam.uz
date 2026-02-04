'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
    return (
        <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#fff',
                    color: '#1e293b',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '500',
                },
                success: {
                    iconTheme: {
                        primary: '#059669',
                        secondary: '#fff',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#dc2626',
                        secondary: '#fff',
                    },
                },
            }}
        />
    );
}
