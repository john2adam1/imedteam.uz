export default function Team() {
    const teamMembers = [
        {
            name: "Himmatulloh Rahmatov",
            role: "Asoschi",
            desc: "“iMed Team” platformasi asoschisi. Farg’ona Shahar Bolalar Shifoxonasi. 3 yillik tajribaga ega Pediatr shifokor. “iMed Team” da pediatriya fani bo’yicha ma’ruzachi.",
            img: "/assets/himmatulloh.JPG" // Updated path to typical public
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
            role: "IT mutahasisi",
            desc: "Toshkent Davlat Tibbiyot Universiteti bakalavr talabasi. 1 yildan buyon iMed Team jamoasida mobil ilova, website qurish va ularni ishini tashkillashtirish ishlarini boshqarib keladi.",
            img: "/assets/zohidjon.jpg"
        }
    ];

    return (
        <section id="team" className="py-12 bg-slate-50 relative">
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
                            className="reveal group bg-white rounded-3xl p-8 shadow-soft border border-slate-100 hover:shadow-card transition-all duration-300 hover:-translate-y-1 text-center"
                            style={{ transitionDelay: `${idx * 50}ms` }}
                        >
                            <div className="relative mx-auto w-24 h-24 mb-6">
                                <div className="absolute inset-0 bg-primary/20 rounded-full rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
                                <div className="absolute inset-0 bg-white rounded-full overflow-hidden border-2 border-slate-100 shadow-sm">
                                    <img
                                        src={member.img}
                                        alt={member.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(member.name) + '&background=be123c&color=fff' }}
                                    />
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">
                                {member.name}
                            </h3>

                            <p className="text-primary text-xs font-bold uppercase tracking-widest mb-4">
                                {member.role}
                            </p>

                            <p className="text-slate-500 text-sm font-medium leading-relaxed line-clamp-4">
                                {member.desc}
                            </p>
                        </div>
                    ))}

                    <div className="reveal group rounded-3xl p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center hover:border-primary/20 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-soft">
                        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <span className="text-3xl font-bold">+</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">30+ Ustozlar</h3>
                        <p className="text-slate-500 text-sm font-medium">Jamoamizda yana o'nlab professional shifokorlar faoliyat yuritishadi.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
