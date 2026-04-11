export default function Team() {
    const teamMembers = [
        {
            name: "Himmatulloh Rahmatov",
            role: "Asoschi",
            desc: "“iMed Team” platformasi asoschisi. Farg’ona Shahar Bolalar Shifoxonasi. 3 yillik tajribaga ega Pediatr shifokor. “iMed Team” da pediatriya fani bo’yicha ma’ruzachi.",
            img: "/assets/himmatulloh.jpg"
        },
        {
            name: "Ulug’bek Mahmudov",
            role: "Ma'ruzachi",
            desc: "Farg‘ona tibbiyot instituti, endokrinologiya kafedrasi assistenti va tayanch doktaranti. Toshkent shahar endokrinologiya markazida onlayn diabet maktabi mudiri.",
            img: "/assets/ulugbekmahmudov.jpg"
        },
        {
            name: "Bekjon Sattarov",
            role: "Ma'ruzachi",
            desc: "TTA radiologiya kafedrasida assistenti. 5 yillik ish tajribaga ega. Hozirda Janubiy Koreyaning Yonsei Cancer Centerida amaliyotda.",
            img: "/assets/bekjonsattarov.jpg"
        },
        {
            name: "Mirzahamid Mirzalatipov",
            role: "Ma'ruzachi",
            desc: "Farg’ona shahar “Bolajon” klinikasi LOR jarroh shifokori. 4 yillik tajribaga ega. “iMed Team” da LOR fani ma’ruzachisi.",
            img: "/assets/mirzahamidmirzapolatov.jpg"
        },
        {
            name: "Doniyor Yakubov",
            role: "Ma'ruzachi",
            desc: "FJSTI gospital xirurgiya kafedrasi assistenti. “MDM clinic” urolog shifokori. 4 yillik ish tajriba. “iMed Team” da urologiya fani ma’ruzachisi",
            img: "/assets/doniyoryakubov.jpg"
        },
        {
            name: "Rasuljon Xolmatov",
            role: "Ma'ruzachi",
            desc: "ADTI klinikasi nevrologiya bo'limi. ADTI Nevrologiya kafedrasi assistenti va tayanch doktoranti. Ish tajribasi 8 yil.",
            img: "/assets/rasuljonxolmatov.jpg"
        },
        {
            name: "Zohidjon Zaylobiddinov",
            role: "IT mutaxassisi",
            desc: "Toshkent Davlat Tibbiyot Universiteti bakalavr talabasi. 1 yildan buyon iMed Team jamoasida mobil ilova, website qurish va ularni ishini tashkillashtirish ishlarini boshqarib keladi.",
            img: "/assets/zohidjon.jpg"
        },
        {
            name: "Mahliyo Rashidova",
            role: "Ma'ruzachi",
            desc: "“iMed Team” jamoasi a'zosi va Tibbiy radiolog, uzist 8 yillik ish tajribaga ega. ADTI Tibbiy radiologiya kafedrasi assitenti va doktaranti. “Onko-med” xususiy shifoxonasida shifokor uzist bo’lib ishlab kelmoqda. Ko’plab xalqaro davlatlarda tajriba orttirgan. “iMed Team” platformasi UTT va boshqa radiologik kurslar ma’ruzachisi",
            img: "/assets/mahliyorashidova.jpg"
        },
        {
            name: "Muhammadqodir Arabboyev",
            role: "Ma'ruzachi",
            desc: "iMed Team jamoasi a'zosi va “iMed Team” platformasi urologiya kursi o’qituvchisi. Central Asian Medical University Urologiya yoʻnalishi magistratranti. Qoʻshtepa Tuman Poliklinika Shifokori",
            img: "/assets/muhammadqodirarabboyev.jpg"
        },
        {
            name: "Nilufar Mamadaliyeva",
            role: "Ma'ruzachi",
            desc: "“iMed Team” jamoasi a'zosi va “iMed Team” fiziologiya kursi o’qituvchisi. FJSTI bituruvchi kurs talabasi.",
            img: "/assets/nilufarmamadaliyeva.png"
        },
        {
            name: "Rahmonqul Namozov",
            role: "Ma'ruzachi",
            desc: "“iMed Team” jamoasi a'zosi va Surxondaryo Viloyat Koʻp Tarmoqli Tibbiyot Markazi Nefrologiya-Gemodializ boʻlimida ishlayman. “iMed Team” platformasi Nefrologiya kursi lektori.",
            img: "/assets/rahmonqulnomozov.jpg"
        },
        {
            name: "Sardorbek Mamurov",
            role: "Ma'ruzachi",
            desc: "“iMed Team” jamoasi a'zosi va Namangan viloyati “Mamura Shifo” klinikasi revmatologi. “iMed Team” platformasi revmatologiya kursi lektori. Medical English kitobi va patologiya darsliklari muallifi.",
            img: "/assets/sardorbekmamurov.JPG"
        },
        {
            name: "Ulugbek Zaylobidinov",
            role: "Ma'ruzachi",
            desc: "“iMed Team” jamoasi a'zosi va tajribali mutaxassis shifokor.",
            img: "/assets/ulugbekzaylobidinov.jpg"
        },
        {
            name: "Hikmatillayev Diyorbek",
            role: "Ma'ruzachi",
            desc: "“iMed Team” platformasi  anatomiya fani o’qituvchisi.  Farmed klinikasi navbatchi travmatolog-ortopedi.",
            img: "/assets/umarbekhikmatillayev.jpg"
        },
        {
            name: "Yuldosheva Mohichehra",
            role: "Ma'ruzachi",
            desc: "“iMed Team” platformasi pediatriya kursi o’qituvchisi.",
            img: "/assets/yuldoshevamohichehra.jpg"
        },
        {
            name: "Behzod Madaminov",
            role: "Ma'ruzachi",
            desc: "“iMed Team” platformasi o’quv bo’limi product manageri. Preklinik Patologiya fanlari, Biokimyo, Fiziologiya, Nevrologiya kabi fanlarni va Gematologiya, Kardiologiya, Qon-Tomir patologiyasi kitobi muallifi. Hozirda Germaniyada Neyrojarrohlik bo’yicha o’qishni davom ettirmoqda.",
            img: "/assets/behzodmadaminov.jpg"
        }
    ];

    return (
        <section id="team" className="py-20 bg-white relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="reveal text-center max-w-3xl mx-auto mb-10">
                    <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
                        “iMed Team” jamoasi
                    </h2>
                    <p className="text-slate-500 mt-6 text-lg font-medium leading-relaxed">
                        Bizda shifokorlik va ustozlik mahoratiga ega bo’lgan, yetarli tajribaga ega bo’lgan TOP ustoz shifokorlar dars o’tishadi!
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {teamMembers.map((member, idx) => (
                        <div
                            key={idx}
                            className="reveal group bg-slate-900 rounded-3xl p-8 shadow-2xl shadow-slate-900/10 border border-white/5 hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2 text-center"
                            style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-primary/20 rounded-full rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                                <div className="absolute inset-0 bg-slate-800 rounded-full overflow-hidden border-2 border-white/10 shadow-sm">
                                    <img
                                        src={member.img + "?v=1"}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=be123c&color=fff' }}
                                    />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                {member.name}
                            </h3>

                            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
                                {member.role}
                            </p>

                            <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-4">
                                {member.desc}
                            </p>
                        </div>
                    ))}

                    <div className="reveal group rounded-3xl p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:border-primary/40 hover:bg-slate-900 transition-all duration-500 group/link cursor-pointer">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="text-3xl font-bold">+</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-white mb-2 transition-colors">30+ Ustozlar</h3>
                        <p className="text-slate-500 group-hover:text-slate-400 text-sm font-medium transition-colors">Jamoamizda yana o'nlab professional shifokorlar faoliyat yuritishadi.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
