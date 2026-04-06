export default function Services() {
    return (
        <section id="services" className="py-12 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-bold mb-8">
                            Nega bizni tanlashadi?
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                            iMed Team — <br />
                            <span className="text-primary">Tibbiyotni rivojlantirish </span>
                            yorqin kelajak garovidir!
                        </h2>

                        <div className="text-slate-600 mt-8 space-y-6 text-lg font-medium leading-relaxed">
                            <p>
                                “iMed Team” tibbiy platformasi 2021-yildan buyon o‘z faoliyatlarini olib bormoqda. Shu kungacha biz 6000 dan ziyod bo‘lgan talaba va shifokorlarni o‘qitib keldik.
                            </p>
                            <p>
                                Bizning kurslarimizdagi barcha manbalar xalqaro darajadagi ma’lumotlar asosiga tuzilgan va O’zbekiston muhitiga moslashtirilgan.
                            </p>
                        </div>

                        <div className="mt-12 space-y-4">
                            {[
                                "Talaba va shifokorlarni zamonaviy va isbotli tibbiyot bilan tanishtirish",
                                "Nazariy va amaliy bilimlarni birgalikda uyg‘unlashtira olish",
                                "Har bir bemorga o‘z yaqini sifatida individual yondashuvni o‘rgatish"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 font-semibold text-slate-800 transition-all hover:bg-white hover:shadow-soft">
                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0 text-xs">
                                        ✓
                                    </div>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid gap-8">
                        <div className="reveal bg-slate-900 rounded-3xl p-10 text-white shadow-xl shadow-slate-900/10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/40 transition-all duration-300"></div>
                            <div className="text-5xl mb-6 transform group-hover:scale-105 transition-transform duration-300">🎯</div>
                            <h3 className="text-3xl font-bold mb-4">Feedback</h3>
                            <p className="text-white/70 font-medium mb-8">
                                Bizning kurslarimizda o’qigan minglab talaba va shifokorlarning samimiy fikrlari bilan tanishing.
                            </p>
                            <a
                                href="https://t.me/imedteam_feedback"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex py-4 px-8 rounded-2xl bg-primary text-white hover:bg-primary-600 font-bold transition-all active:scale-95"
                            >
                                Fikrlarni o’qish
                            </a>
                        </div>

                        <div className="reveal bg-white rounded-3xl p-10 border border-slate-100 shadow-soft hover:shadow-card transition-all duration-300 group">
                            <div className="text-5xl mb-6 transform group-hover:scale-105 transition-transform duration-300">📚</div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-primary transition-colors">Mualliflik Kitoblarimiz</h3>
                            <div className="text-slate-500 font-medium mb-8 flex flex-col gap-1">
                                <p>• Medical English</p>
                                <p>• Gematalogiya</p>
                                <p>• Antibiotiklar Farmakologiyasi</p>
                            </div>
                            <a
                                href="https://t.me/iMed_team"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex py-4 px-8 rounded-2xl bg-primary text-white hover:bg-primary-600 font-bold transition-all active:scale-95 shadow-lg shadow-primary/20"
                            >
                                Buyurtma berish
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
