export default function Blog() {
    return (
        <section id="blog" className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="reveal text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-extrabold">Yangiliklar</h2>
                    <p className="text-slate-600 mt-2">Tadbirlar, maqolalar va foydali qo‘llanmalar.</p>
                </div>
                <div className="mt-10 grid md:grid-cols-3 gap-6">
                    <article className="reveal rounded-2xl border border-slate-100 bg-white p-6 shadow-soft hover:shadow-card transition duration-300">
                        <div className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Blog</div>
                        <h3 className="mt-2 font-extrabold text-lg text-slate-900">Tibbiyot yo‘l xaritasi 2025</h3>
                        <p className="mt-2 text-slate-600 text-sm">O‘rganish tartibi, muhim mavzular va amaliy maslahatlar.</p>

                        <details className="mt-4 group">
                            <summary className="inline-flex cursor-pointer px-3 py-2 rounded-lg border border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-700 text-sm transition font-medium select-none">
                                O‘qish
                            </summary>

                            <div className="mt-3 text-slate-700 text-sm leading-relaxed border-t border-slate-100 pt-3 space-y-3 animation-fade-in text-left">
                                <p className="font-medium text-primary-700">Kichik kurslar uchun tavsiya:</p>
                                <ul className="list-disc list-inside space-y-1 pl-1">
                                    <li><strong>1-kurslar:</strong> Anatomiya, Gistologiya</li>
                                    <li><strong>2-kurslar:</strong> Anatomiya, Fiziologiya, Biokimyo</li>
                                    <li><strong>3-kurslar:</strong> Anatomiya, Fiziologiya, Biokimyo, Farmakologiya, Patologiya</li>
                                </ul>
                                <p><strong>4–5–6-kurslar:</strong> klinik fanlarni to‘g‘ridan to‘g‘ri o‘qishlari mumkin.</p>
                                <p>Fundamental fanlarda muammosi bo‘lmaganlar uchun birinchi navbatda <strong>“Terapiya”</strong> kursidan boshlash maqsadga muvofiq.</p>
                                <p className="italic text-slate-500 text-xs">
                                    Individual tavsiya olish uchun biz bilan bog‘laning!
                                </p>
                            </div>
                        </details>
                    </article>

                    <article className="reveal rounded-2xl border border-slate-100 bg-white p-6 shadow-soft hover:shadow-card transition duration-300">
                        <div className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Yangilik</div>
                        <h3 className="mt-2 font-extrabold text-lg text-slate-900">Yangi kurslarimizga qabul ochiq!</h3>
                        <p className="mt-2 text-slate-600 text-sm">Onlayn va oflayn guruhlar uchun arizalar ochiq.</p>
                        <a
                            href="https://t.me/imedteam"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex px-3 py-2 rounded-lg border border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-700 text-sm transition font-medium"
                        >
                            Batafsil
                        </a>
                    </article>

                    <article className="reveal rounded-2xl border border-slate-100 bg-white p-6 shadow-soft hover:shadow-card transition duration-300">
                        <div className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Tadbir</div>
                        <h3 className="mt-2 font-extrabold text-lg text-slate-900">Kitoblarimiz</h3>
                        <p className="mt-2 text-slate-600 text-sm">“iMed Team” ishlab chiqqan kitoblar bilan tanishing!</p>
                        <div className="mt-4 flex gap-2 flex-wrap">
                            <button className="inline-flex px-3 py-2 rounded-lg border border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-700 text-sm transition font-medium">Medical English</button>
                            <button className="inline-flex px-3 py-2 rounded-lg border border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-700 text-sm transition font-medium">Gematologiya</button>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
}
