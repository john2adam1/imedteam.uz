'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    className
}: ModalProps) {
    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className={cn(
                "bg-white rounded-[2.5rem] w-full max-w-2xl shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col",
                className
            )}>
                {/* Header */}
                <div className="px-8 py-6 flex items-center justify-between border-b border-gray-100 flex-shrink-0">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h3>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-50 rounded-2xl transition-all text-gray-400 hover:text-gray-900 active:scale-90"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {children}
                </div>
            </div>
        </div>
    );
}
