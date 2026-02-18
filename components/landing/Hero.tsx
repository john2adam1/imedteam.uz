'use client';

export default function Hero() {
    return (
        <section id="home" className="relative overflow-hidden pt-20 pb-10 lg:pt-32 lg:pb-16">
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[50rem] h-[50rem] rounded-full bg-primary/5 blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] rounded-full bg-primary/10 blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                <div className="reveal">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/10 text-primary text-sm font-bold mb-8 animate-bounce-subtle">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        iMed Team — Tibbiyot Olami!
                    </div>

                    <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
                        Tibbiyotni biz bilan <br />
                        <span className="text-primary italic">Tez, oson va sifatli </span>
                        o‘rganing!
                    </h1>

                    <p className="mt-8 text-slate-600 text-xl leading-relaxed max-w-xl">
                        Professional shifokorlar va ekspertlar tomonidan tayyorlangan darslar.
                        Istalgan joyda va istalgan vaqtda bilim oling.
                    </p>

                    <div className="mt-12 flex flex-wrap gap-6">
                        <a
                            href="https://apps.apple.com/uz/app/imed-team/id6745555493"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group relative px-8 py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-4 hover:bg-primary transition-all duration-300 shadow-2xl shadow-slate-900/20 active:scale-95"
                        >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" alt="iOS" className="w-6 h-6 brightness-0 invert" />
                            <div className="flex flex-col items-start leading-none text-left">
                                <span className="text-[10px] uppercase tracking-widest opacity-60">Download on</span>
                                <span className="text-lg">App Store</span>
                            </div>
                        </a>
                    </div>
                </div>

                <div className="relative lg:block hidden">
                    <div className="absolute inset-0 bg-primary/10 rounded-[3rem] rotate-3 scale-105 blur-2xl"></div>
                    <div className="relative bg-white p-4 rounded-[3rem] shadow-2xl shadow-primary/10 border border-slate-100 overflow-hidden transform hover:-rotate-1 transition-transform duration-700">
                        <img
                            src="/assets/masterklass.jpg"
                            alt="Medical Students Studying"
                            className="w-full h-full object-cover rounded-[2.5rem]"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
