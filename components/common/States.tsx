'use client';

import React from 'react';
import { Loader2, AlertCircle, Inbox, RefreshCw } from 'lucide-react';

/**
 * Loading State Component
 */
export const LoadingState = ({ message = 'Yuklanmoqda...' }: { message?: string }) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
        <div className="relative">
            <div className="w-16 h-16 border-4 border-primary-100 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="mt-6 text-slate-500 font-medium animate-pulse">{message}</p>
    </div>
);

/**
 * Error State Component
 */
export const ErrorState = ({
    title = 'Xatolik yuz berdi',
    message = 'Ma\'lumotlarni yuklashda xatolik yuz berdi. Iltimos qaytadan urinib ko\'ring.',
    onRetryAction
}: {
    title?: string;
    message?: string;
    onRetryAction?: () => void;
}) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-red-100">
            <AlertCircle className="h-10 w-10 text-red-500" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>
        {onRetryAction && (
            <button
                onClick={onRetryAction}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
                <RefreshCw className="h-4 w-4" />
                Qayta yuklash
            </button>
        )}
    </div>
);

/**
 * Empty State Component
 */
export const EmptyState = ({
    title = 'Ma\'lumot yo\'q',
    message = 'Hozircha bu yerda hech qanday ma\'lumotlar mavjud emas.',
    actionLabel,
    onActionAction
}: {
    title?: string;
    message?: string;
    actionLabel?: string;
    onActionAction?: () => void;
}) => (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm shadow-slate-100">
            <Inbox className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 mb-8 leading-relaxed">{message}</p>
        {onActionAction && actionLabel && (
            <button
                onClick={onActionAction}
                className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
                {actionLabel}
            </button>
        )}
    </div>
);
