export default function Services() {
    return (
        <section id="services" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-bold mb-8">
                            Nega bizni tanlashadi?
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                            iMed Team — <br />
                            <span className="text-primary">Tibbiyotni rivojlantirish </span>
                            yorqin kelajak garovidir!
                        </h2>

                        <div className="text-slate-600 mt-8 space-y-6 text-lg font-medium leading-relaxed">
                            <p>
                                2021-yildan buyon 6000 dan ziyod talaba va shifokorlarni o‘qitib kelayotgan professional platformamizga qo'shiling.
                            </p>
                            <p>
                                Bizning kurslarimiz xalqaro standartlar asosida tuzilgan va O‘zbekiston tibbiyot muhitiga mukammal moslashtirilgan.
                            </p>
                        </div>

                        <div className="mt-12 space-y-4">
                            {[
                                "Talabalarni zamonaviy va isbotli tibbiyot bilan tanishtirish",
                                "Nazariy va amaliy bilimlarni uyg‘unlashtirish",
                                "Har bir bemorga individual yondashuvni o‘rgatish"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-800">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                                        ✓
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="reveal bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/40 transition-colors"></div>
                            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">🎯</div>
                            <h3 className="text-3xl font-black mb-4">Feedback</h3>
                            <p className="text-white/70 font-medium mb-8">
                                Bizning kurslarimizda o’qigan minglab talabalarning samimiy fikrlari bilan tanishing.
                            </p>
                            <a
                                href="https://t.me/imedteam_feedback"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex py-4 px-8 rounded-2xl bg-primary hover:bg-white hover:text-primary font-black transition-all active:scale-95"
                            >
                                Fikrlarni o’qish
                            </a>
                        </div>

                        <div className="reveal bg-white rounded-[2.5rem] p-10 border-2 border-slate-100 shadow-xl shadow-slate-200/50 group">
                            <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform">🤝</div>
                            <h3 className="text-3xl font-black text-slate-900 mb-4 group-hover:text-primary transition-colors">Konsalting</h3>
                            <p className="text-slate-500 font-medium mb-8">
                                Professional jamoamiz bilan loyiha tahlili, roadmap va texnik qarorlar qabul qiling.
                            </p>
                            <a
                                href="https://t.me/iMed_team"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex py-4 px-8 rounded-2xl bg-slate-100 hover:bg-primary hover:text-white text-slate-900 font-black transition-all active:scale-95"
                            >
                                Bog‘lanish
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
