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
        <section id="team" className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="reveal text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-extrabold">“iMed Team” jamoasi</h2>
                    <p className="text-slate-600 mt-2">
                        Bizda shifokorlik va ustozlik mahoratiga ega bo’lgan, yetarli tajribaga ega bo’lgan TOP ustoz shifokorlar dars o’tishadi!
                        Jamoada 30 dan ziyod shifokorlar faoliyat yuritib kelishadi.
                    </p>
                </div>
                <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, idx) => (
                        <div key={idx} className="reveal rounded-2xl border border-slate-100 bg-white p-6 shadow-soft text-center group hover:shadow-card transition duration-300">
                            <div className="mx-auto w-20 h-20 rounded-full bg-slate-100 grid place-items-center shadow-sm overflow-hidden mb-4">
                                {/* Use next/image? Or plain img. Plain img for simplicity with external URLs or raw paths */}
                                <img src={member.img} alt={member.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + member.name }} />
                            </div>
                            <div className="mt-4 font-extrabold text-slate-900 group-hover:text-primary-700 transition">{member.name}</div>
                            <div className="text-sm text-slate-500 font-medium">{member.role}</div>
                            <div className="mt-3 text-xs text-slate-600 line-clamp-4 leading-relaxed">
                                {member.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
