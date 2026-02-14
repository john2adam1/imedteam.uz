export default function Partners() {
    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal text-center mb-12">
                    <h2 className="text-sm uppercase tracking-[0.3em] font-black text-slate-400">Bizning Hamkorlar</h2>
                </div>

                <div className="marquee relative">
                    <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-slate-50 to-transparent z-10"></div>
                    <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-slate-50 to-transparent z-10"></div>

                    <div className="marquee-track py-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 px-8 py-4 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30 min-w-[240px] group hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:rotate-12 transition-transform">
                                    <img src="/assets/favicon.ico.png" alt="Logo" className="w-12 h-12 object-contain" />
                                </div>
                                <span className="font-black text-lg text-slate-900 tracking-tight">iMed Team</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
