'use client';

import React from 'react';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-slate-200/50 flex items-center justify-center p-4">
                        <img src="/imedteamlogo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="bg-white py-12 px-10 shadow-2xl shadow-slate-200/50 rounded-[3rem] border border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
}
