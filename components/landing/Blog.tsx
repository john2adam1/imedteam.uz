export default function Blog() {
    return (
        <section id="blog" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                        Foydali <span className="text-primary">Maqolalar</span>
                    </h2>
                    <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
                        Tibbiyot olamidagi so'nggi yangiliklar, tadbirlar va foydali qo‘llanmalarni biz bilan kuzatib boring.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {[
                        {
                            category: 'Yo‘l xaritasi',
                            title: 'Tibbiyot yo‘l xaritasi 2025',
                            desc: 'O‘rganish tartibi, muhim mavzular va amaliy maslahatlar.',
                            date: '5-Fevral, 2025',
                            isMedical: true
                        },
                        {
                            category: 'Yangilik',
                            title: 'Yangi kurslarimizga qabul ochiq!',
                            desc: 'Onlayn va oflayn guruhlar uchun arizalar ochiq. Joylar soni cheklangan.',
                            date: '2-Fevral, 2025',
                            link: 'https://t.me/imedteam'
                        },
                        {
                            category: 'Tadbir',
                            title: 'Yangi darsliklarimiz nashrdan chiqdi!',
                            desc: '“iMed Team” jamoasi tomonidan ishlab chiqilgan Medical English va Gematologiya kitoblari.',
                            date: '28-Yanvar, 2025',
                            tags: ['Medical English', 'Gematologiya']
                        }
                    ].map((item, i) => (
                        <article
                            key={i}
                            className="reveal group bg-slate-50 rounded-[2.5rem] p-10 border border-slate-100 hover:bg-white hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col"
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="flex items-center justify-between mb-8">
                                <span className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-black uppercase tracking-widest">
                                    {item.category}
                                </span>
                                <span className="text-slate-400 text-xs font-bold">{item.date}</span>
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors leading-tight">
                                {item.title}
                            </h3>

                            <p className="text-slate-500 font-medium mb-8 flex-1 leading-relaxed">
                                {item.desc}
                            </p>

                            {item.isMedical && (
                                <details className="group/details mb-4">
                                    <summary className="list-none cursor-pointer flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                                        <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover/details:bg-primary group-hover/details:text-white transition-all">
                                            +
                                        </span>
                                        Tavsiyalar
                                    </summary>
                                    <div className="mt-6 p-6 rounded-2xl bg-white border border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                                        <div className="space-y-4 text-sm font-medium text-slate-600">
                                            <p className="font-black text-slate-900 border-l-4 border-primary pl-4 uppercase tracking-widest text-xs">Kurslar kesimida:</p>
                                            <ul className="space-y-3">
                                                <li className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                                                    <span><strong>1-kurs:</strong> Anatomiya, Gistologiya</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                                                    <span><strong>2-kurs:</strong> Anatomiya, Fiziologiya, Biokimyo</span>
                                                </li>
                                                <li className="flex items-center gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary ring-4 ring-primary/10"></span>
                                                    <span><strong>3-kurs:</strong> Anatomiya - Farmakologiya - Patologiya</span>
                                                </li>
                                            </ul>
                                            <p className="bg-slate-50 p-4 rounded-xl italic">Klinik fanlarni fundamental bazadan so'ng boshlash tavsiya etiladi.</p>
                                        </div>
                                    </div>
                                </details>
                            )}

                            {item.tags && (
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="px-3 py-1.5 rounded-lg bg-white border border-slate-100 text-xs font-bold text-slate-600">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group/btn">
                                    Batafsil
                                    <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                                </a>
                            ) : !item.isMedical && (
                                <button className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest group/btn">
                                    Batafsil
                                    <span className="group-hover/btn:translate-x-2 transition-transform">→</span>
                                </button>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
