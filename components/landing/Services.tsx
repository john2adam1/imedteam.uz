'use client';

import React from 'react';
import {
    ShieldCheck,
    Zap,
    UserCheck,
    Brain,
    Globe,
    Award,
    Star,
    BookOpen,
    ArrowRight
} from 'lucide-react';

export default function Services() {
    const stats = [
        { label: 'Tashkil etilgan', value: '2021' },
        { label: 'Talabalar', value: '10,000+' },
        { label: 'Feedbacklar', value: '5,000+' },
    ];

    const features = [
        {
            title: "Zamonaviy Tibbiyot",
            desc: "Isbotli (Evidence-based) tibbiyot bilan tanishish va uni amaliyotga tatbiq etish.",
            icon: Award,
            color: "bg-blue-500"
        },
        {
            title: "Nazariya va Amaliyot",
            desc: "Bilimlarni faqat nazariy emas, balki tayyor amaliy instrumentlar orqali o'rganish.",
            icon: Zap,
            color: "bg-amber-500"
        },
        {
            title: "Individual Yondashuv",
            desc: "Har bir bemorga o'z yaqini sifatida qarash va chinakam shifokorlik mas'uliyatini his qilish.",
            icon: UserCheck,
            color: "bg-emerald-500"
        },
        {
            title: "Klinik Fikrlash",
            desc: "Murakkab vaziyatlarda to'g'ri qaror qabul qilish va klinik tafakkurni rivojlantirish.",
            icon: Brain,
            color: "bg-purple-500"
        },
        {
            title: "Xalqaro Standartlar",
            desc: "Kurslar xalqaro manbalar asosida tuzilgan va O'zbekiston muhitiga moslashtirilgan.",
            icon: Globe,
            color: "bg-indigo-500"
        },
        {
            title: "Professional Jamoa",
            desc: "Soha mutaxassislari bilan networking va tajriba almashish imkoniyati.",
            icon: ShieldCheck,
            color: "bg-rose-500"
        }
    ];

    const books = [
        "Medical English",
        "Gematalogiya",
        "Antibiotiklar Farmakologiyasi",
        "Kardiologiya",
        "Qon-Tomir patologiyasi"
    ];

    return (
        <section id="services" className="py-24 bg-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-primary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    <div className="reveal">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-bold mb-8">
                            Nega bizni tanlashadi?
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                            iMed Team — <br />
                            <span className="text-primary italic">Tibbiyotni davolovchi </span>
                            maskan!
                        </h2>

                        <p className="text-slate-600 text-xl font-medium leading-relaxed mb-10 max-w-2xl">
                            “iMed Team” platformasi 2021-yildan buyon tibbiyot sohasida inqilobiy o‘zgarishlar qilmoqda.
                            Bizning maqsadimiz — O‘zbekiston tibbiyotini xalqaro darajaga olib chiqish.
                        </p>

                        <div className="grid grid-cols-3 gap-6 mb-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-colors">
                                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {features.map((feature, i) => (
                                <div key={i} className="group p-6 rounded-[2rem] bg-white border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-2xl ${feature.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                        <feature.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="sticky top-32 space-y-8 reveal">
                        {/* Feedback Card */}
                        <div className="relative group overflow-hidden bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-slate-900/20">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8 backdrop-blur-xl border border-white/10">
                                    <Star className="text-primary fill-primary" size={32} />
                                </div>
                                <h3 className="text-4xl font-black mb-4">Feedback</h3>
                                <p className="text-white/60 text-lg font-medium mb-8 leading-relaxed">
                                    Minglab talabalar va shifokorlarning samimiy fikrlari bilan telegram kanalimizda tanishing.
                                </p>
                                <a
                                    href="https://t.me/imedteam_feedback"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 py-5 px-10 rounded-2xl bg-primary text-white font-black hover:bg-primary/90 hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-primary/20"
                                >
                                    Fikrlarni o‘qish
                                    <ArrowRight size={20} />
                                </a>
                            </div>
                        </div>

                        {/* Books Card */}
                        <div className="group bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 hover:border-primary/20 transition-all duration-500">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <BookOpen className="text-primary" size={32} />
                            </div>
                            <h3 className="text-4xl font-black text-slate-900 mb-6">Mualliflik Kitoblarimiz</h3>
                            <div className="grid gap-4 mb-10">
                                {books.map((book, i) => (
                                    <div key={i} className="flex items-center gap-3 text-slate-600 font-bold group/item">
                                        <div className="w-2 h-2 bg-primary/20 rounded-full group-hover/item:bg-primary group-hover/item:scale-125 transition-all"></div>
                                        {book}
                                    </div>
                                ))}
                            </div>
                            <a
                                href="https://t.me/manager_iMedteam"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 py-5 px-10 rounded-2xl bg-slate-900 text-white font-black hover:bg-primary transition-all active:scale-95 shadow-xl shadow-slate-900/10"
                            >
                                Buyurtma berish
                                <ArrowRight size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
