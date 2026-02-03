'use client';

import { useEffect } from 'react';

export default function Hero() {

    // Logic for reveal on scroll (duplicated locally or could be a hook, 
    // but putting it in useEffect here or simpler: use a global script in layout? 
    // Better: React-way. But for speed/copy-paste, simple IntersectionObserver is best.)
    // Actually, index.html used a simple script. Let's use a hook or simple checking.
    // Since I added .reveal CSS, I need the JS triggers.
    // I'll create a reusable useScrollReveal hook later or just add global listener in Header or Page.
    // For now, just markup.

    return (
        <section id="home" className="relative overflow-hidden pt-10">
            <div className="absolute inset-0 -z-10">
                <div className="absolute -top-24 -left-24 w-[36rem] h-[36rem] rounded-full bg-primary-100 blur-3xl opacity-60"></div>
                <div className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full bg-primary-200 blur-3xl opacity-60"></div>
            </div>
            <div className="max-w-7xl mx-auto px-4 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
                <div className="reveal show"> {/* Added 'show' by default for Hero or handle via JS */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold ring-1 ring-primary-200 mb-4">
                        ✨ iMed Team — Tibbiyotni davolovchi maskan!
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                        Onlayn platformamizga xush kelibsiz! Tibbiyotni biz bilan tez, oson va sifatli{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
                            o‘rganing!
                        </span>
                    </h1>
                    <p className="mt-4 text-slate-600 text-lg">
                        Yanada qulay formatda o’qish uchun quyidagi ilovamizni yuklab oling:
                    </p>

                    {/* App download buttons */}
                    <div className="mt-8 flex flex-col gap-4">
                        {/* Android */}
                        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm max-w-md bg-white">
                            <a href="/assets/app-release.apk" download className="flex-shrink-0">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                    alt="Get it on Google Play"
                                    className="h-12"
                                />
                            </a>
                            <div>
                                <div className="text-gray-700 font-semibold text-base">Android uchun yuklab olish</div>
                                <div className="text-sm text-gray-500">iMed Team ilovasining so‘nggi versiyasi</div>
                            </div>
                        </div>

                        {/* iOS */}
                        <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition shadow-sm max-w-md bg-white">
                            <a
                                href="https://apps.apple.com/uz/app/imed-team/id6745555493"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0"
                            >
                                <img
                                    src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                                    alt="Download on the App Store"
                                    className="h-12"
                                />
                            </a>
                            <div>
                                <div className="text-gray-700 font-semibold text-base">iOS uchun yuklab olish</div>
                                <div className="text-sm text-gray-500">iPhone va iPad foydalanuvchilari uchun</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side image or empty space as in original */}
                <div className="hidden lg:block">
                    {/* Potentially an illustration here if available */}
                </div>
            </div>
        </section>
    );
}
