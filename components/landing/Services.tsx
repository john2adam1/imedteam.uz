export default function Services() {
    return (
        <section id="services" className="py-16 bg-gradient-to-b from-primary-50 to-primary-50/40">
            <div className="max-w-7xl mx-auto px-4">
                <div className="reveal text-center max-w-2xl mx-auto">
                    <h2 className="text-3xl font-extrabold">iMed Team haqida!</h2>
                    <div className="text-slate-600 mt-2 space-y-4 leading-relaxed">
                        <p>
                            “iMed Team” tibbiy platformasi 2021-yildan buyon o‘z faoliyatlarini olib bormoqda. Shu kungacha
                            biz 6000 dan ziyod bo‘lgan talaba va shifokorlarni o‘qitib keldik. Bizning talabalar turli xil
                            davlat va xususiy shifoxonalarda malakali mutaxassis bo‘lib ishlab kelishmoqda.
                        </p>

                        <p>
                            Shuningdek, ularning turli xalqaro hamda milliy olimpiadalarda faxrli o‘rinlarni egallab
                            kelayotganlari diqqatga sazovordir.
                        </p>

                        <p>
                            Bizning kurslarimizdagi barcha manbalar xalqaro darajadagi ma’lumotlar asosiga tuzilgan va
                            O’zbekiston muhitiga moslashtirilgan. Kurs davomida nafaqat bilim, balki ustoz shifokorlar
                            tomonidan amaliy tayyor instrumentlar va shablonlarni qo‘lga kiritasiz.
                        </p>

                        <p>
                            Kurs davomida O’zbekiston va qo‘shni davlatlardan yig‘ilgan shifokor va talabalar bilan{' '}
                            <strong>networking</strong> qilish imkoniyati ham mavjud bo‘ladi!
                        </p>

                        <h3 className="font-semibold text-primary-700 mt-6">Shiorimiz:</h3>
                        <ul className="list-disc list-inside space-y-2 text-left inline-block">
                            <li>Talaba va shifokorlarni zamonaviy va isbotli tibbiyot bilan to‘laqonli tanishtirish</li>
                            <li>Nazariy va amaliy bilimlarni birgalikda uyg‘unlashtira olish</li>
                            <li>Har bir bemorga o‘z yaqini sifatida individual yondashuvni o‘rgatish</li>
                            <li>
                                Bir so‘z bilan aytganda: O’zbekiston tibbiyotini yangi darajaga olib chiqish — bu bizning
                                eng ustuvor vazifamiz!
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 grid md:grid-cols-2 gap-6">
                    <div className="reveal rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
                        <div className="text-3xl">🎯</div>
                        <div className="mt-3 font-extrabold text-xl">Feedback</div>
                        <p className="text-slate-600 mt-2 text-sm">
                            Online/offline kurslarimizda o’qigan ayrim talaba va shifokorlarni fikrini o’qib ko’ring😊
                        </p>
                        <a
                            href="https://t.me/imedteam_feedback"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex px-3 py-2 rounded-lg border border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-700 text-sm"
                        >
                            Feedbacklarni o’qish
                        </a>
                    </div>

                    <div className="reveal rounded-2xl border border-slate-100 bg-white p-6 shadow-soft">
                        <div className="text-3xl">🤝</div>
                        <div className="mt-3 font-extrabold text-xl">Konsalting</div>
                        <p className="text-slate-600 mt-2 text-sm">
                            Jamoa bilan loyihani tahlil qilish, roadmap va dizayn/texnik qarorlar.
                        </p>
                        <a
                            href="https://t.me/iMed_team"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex px-3 py-2 rounded-lg border border-slate-200 hover:border-primary-500 text-slate-700 hover:text-primary-700 text-sm"
                        >
                            Bog‘lanish
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
