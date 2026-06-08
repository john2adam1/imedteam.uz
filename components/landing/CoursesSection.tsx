'use client';

export default function CoursesSection() {
    return (
        <section id="courses" className="py-12 bg-slate-50 relative overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="mt-10 max-w-5xl mx-auto">
                    <div className="reveal text-center max-w-2xl mx-auto mb-10">
                        <h3 className="text-3xl font-extrabold text-slate-900">Kurs yo‘nalishlari</h3>
                        <p className="text-slate-500 mt-2 font-medium">Klinik, Fundamental va Preklinik fanlar bo‘yicha modullar.</p>
                    </div>

                    <div className="grid gap-4">
                        <details className="reveal group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-soft transition-all">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="font-bold text-lg text-slate-900">Fundamental fanlar</span>
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 group-open:rotate-45 group-open:bg-primary group-open:text-white transition-all duration-300">
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </span>
                            </summary>
                            <div className="pt-4 text-slate-600 text-sm grid md:grid-cols-2 gap-3 border-t border-slate-100 mt-4">
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Anatomiya - 4 oy</li>
                                    <li>Gistologiya va hujayra biologiyasi - 2 oy</li>
                                    <li>Biokimyo - 2 oy</li>
                                    <li>Fiziologiya - 3 oy</li>
                                    <li>Fundamental farmakologiya - 1,5 oy</li>
                                </ul>
                            </div>
                        </details>

                        <details className="reveal group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-soft transition-all">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="font-bold text-lg text-slate-900">Preklinik fanlar</span>
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 group-open:rotate-45 group-open:bg-primary group-open:text-white transition-all duration-300">
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </span>
                            </summary>
                            <div className="pt-4 text-slate-600 text-sm grid md:grid-cols-2 gap-3 border-t border-slate-100 mt-4">
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Umumiy patalogiya - 1 oy</li>
                                    <li>Klinik farmakologiya - 1,5 oy</li>
                                    <li>Gematologiya - 1,5 oy</li>
                                </ul>
                            </div>
                        </details>

                        <details className="reveal group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-soft transition-all">
                            <summary className="flex cursor-pointer items-center justify-between gap-4 select-none list-none [&::-webkit-details-marker]:hidden">
                                <span className="font-bold text-lg text-slate-900">Klinik fanlar</span>
                                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-500 group-open:rotate-45 group-open:bg-primary group-open:text-white transition-all duration-300">
                                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                </span>
                            </summary>
                            <div className="pt-4 text-slate-600 text-sm grid md:grid-cols-2 lg:grid-cols-4 gap-6 border-t border-slate-100 mt-4">
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Gastroenterologiya 1 oy</li>
                                    <li>Pulmonologiya 1 oy</li>
                                    <li>Nefrologiya 1 oy</li>
                                    <li>Revmatologiya 1 oy</li>
                                    <li>EKG 1,5 oy</li>
                                </ul>
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Kardiologiya 2 oy</li>
                                    <li>Pediatriya 3 oy</li>
                                    <li>Neonatologiya 2 oy</li>
                                    <li>Nevrologiya 3 oy</li>
                                    <li>Akusherlik va ginekologiya 2 oy</li>
                                </ul>
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Endokrinologiya 3 oy</li>
                                    <li>Diabet maktabi 1 oy</li>
                                    <li>Shoshilinch tez tibbiy yordam 2 oy</li>
                                    <li>Klinik laboratoriya va diagnostika interpretatsiya 1 oy</li>
                                    <li>Otorinolaringologiya (LOR) 3 oy</li>
                                </ul>
                                <ul className="list-disc pl-5 space-y-2 marker:text-primary">
                                    <li>Urologiya 3 oy</li>
                                    <li>Mammologiya 1 oy</li>
                                    <li>Ultrasonografiya (UTT) 2 oy</li>
                                    <li>Ko‘krak qafasi radiologiyasi 1 oy</li>
                                    <li>Neyroradiologiya 1 oy</li>
                                    <li>Elektroensefalografiya (EEG) 1 oy</li>
                                </ul>
                            </div>
                        </details>
                    </div>
                </div>
            </div>
        </section>
    );
}
