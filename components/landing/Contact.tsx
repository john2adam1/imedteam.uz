export default function Contact() {
    return (
        <section id="contact" className="py-16 bg-gradient-to-b from-primary-50 to-primary-50/40">
            <div className="max-w-3xl mx-auto px-4">
                <div className="reveal text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900">Biz bilan bog'lanish</h2>
                    <p className="text-slate-600 mt-2">Savollaringiz bo‘lsa yozing — mamnuniyat bilan javob beramiz.</p>
                </div>
                <div className="mt-8 reveal rounded-2xl border border-slate-100 bg-white p-8 shadow-soft">
                    <div className="grid sm:grid-cols-2 gap-6 text-slate-700 text-lg">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📍</span> Manzil: Farg'ona shahar
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📞</span> Telefon: +998 94 016 44 22
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">✉️</span> Email: imedteam1@gmail.com
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">🕒</span> Ish vaqti: Du–Shan 9:00–18:00
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-center">
                        <a
                            href="https://t.me/iMed_team"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#229ED9] hover:bg-[#1e8dbf] text-white font-semibold shadow-soft transition transform hover:-translate-y-1"
                        >
                            {/* Telegram icon */}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M9.036 15.28 8.87 19.1c.34 0 .49-.15.67-.33l1.61-1.56 3.34 2.45c.61.33 1.06.16 1.22-.56l2.21-10.37c.2-.89-.32-1.23-.91-1.02l-12.94 5c-.88.34-.86.84-.15 1.06l3.31 1.03 7.69-4.86c.36-.22.7-.1.42.14" />
                            </svg>
                            Telegram kanalga o‘tish
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
