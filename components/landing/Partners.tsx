export default function Partners() {
    return (
        <section className="py-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="marquee rounded-2xl border border-slate-100 p-4 bg-white shadow-soft">
                    <div className="marquee-track">
                        {/* Duplicated items to ensure smooth infinite scroll */}
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                            <div
                                key={i}
                                className="flex items-center gap-3 px-5 py-3 rounded-lg border border-slate-100 bg-white shadow-sm min-w-[180px]"
                            >
                                <img src="/imedteamlogo.png" alt="Logo" className="w-8 h-8 object-contain" />
                                <span className="font-semibold text-base">iMed Team</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
