'use client';

import { useState, useEffect, Suspense } from 'react';
import { tariffService, courseService, orderService } from '@/services';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, BookOpen, CreditCard } from 'lucide-react';
import { MobileCourseRes } from '@/types/mobile-api';

function TariffsContent() {
    const [tariffs, setTariffs] = useState<any>(null);
    const [selectedCourse, setSelectedCourse] = useState<MobileCourseRes | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const courseId = searchParams?.get('courseId');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [tariffData, courseData] = await Promise.all([
                    tariffService.getAll(),
                    courseId ? courseService.getCourseById(courseId) : Promise.resolve(null)
                ]);

                setTariffs(tariffData);
                if (courseData) {
                    setSelectedCourse(courseData);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [courseId]);

    const getPriceForTariff = (tariffId: string, defaultPrice: number) => {
        if (!selectedCourse?.price) return defaultPrice;
        const coursePrice = selectedCourse.price.find(p => p.tariff_id === tariffId);
        return coursePrice ? coursePrice.price : defaultPrice;
    };

    const formatPrice = (price: any) => {
        const numPrice = Number(price);
        if (isNaN(numPrice)) return 'Noma’lum';

        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    // Filter tariffs that actually have a price for this course if courseId is present
    const displayedTariffs = tariffs?.tariffs?.filter((tariff: any) => {
        if (!courseId) return true; // Show all if no specific course selected
        if (!selectedCourse?.price) return false;

        // Find if this specific course has a price for this tariff
        const coursePrice = selectedCourse.price.find(p => p.tariff_id === tariff.id);
        return coursePrice !== undefined && typeof coursePrice.price === 'number' && !isNaN(coursePrice.price);
    }) || [];

    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    const handlePurchase = async (tariffId: string) => {
        if (!courseId) {
            router.push('/app/courses');
            return;
        }

        try {
            setPurchasingId(tariffId);
            const response = await orderService.create({
                tariff_id: tariffId,
                course_id: courseId, // Adding course_id in case it's needed
                payment_method: 'payme' // Default payment method
            }) as any;

            console.log('Order created:', response);

            if (response.url) {
                window.location.assign(response.url);
            } else if (response.order_id) {
                // If no payment URL, maybe show success and redirect to user courses
                alert('Buyurtma muvaffaqiyatli yaratildi');
                router.push('/app/courses');
            } else {
                throw new Error('To‘lov havolasi topilmadi');
            }
        } catch (error: any) {
            console.error('Purchase failed:', error);
            alert(error.message || 'To‘lovni amalga oshirishda xatolik yuz berdi');
        } finally {
            setPurchasingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-10 space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">Obuna davomiyligi</h1>
                <p className="text-lg text-gray-400 font-medium max-w-2xl mx-auto">
                    Bilim olishda cheklov yo'q. O'zingizga mos muddatni tanlang va darhol o'rganishni boshlang.
                </p>
                {selectedCourse && (
                    <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-primary/5 rounded-full text-primary font-bold border border-primary/10">
                        <BookOpen size={18} />
                        Kurs: {selectedCourse.name}
                    </div>
                )}
            </div>

            {/* Info Banner */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-soft relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>
                <div className="flex items-start gap-6 relative z-10">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-gray-900 mb-2">Qanday ishlaydi?</h3>
                        <p className="text-gray-500 leading-relaxed font-medium">
                            Siz kursni tanlaganingizda, turli obuna muddatlari uchun
                            maxsus narxlarni ko'rishingiz mumkin. Tanlangan muddat davomida siz kurs materiallariga, videolariga va testlariga
                            <span className="text-primary font-bold"> cheksiz kirish </span> huquqiga ega bo'lasiz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tariff Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
                {displayedTariffs.map((tariff: any) => (
                    <div
                        key={tariff.id}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-10 flex flex-col hover:shadow-premium hover:-translate-y-2 transition-all duration-500 group relative"
                    >
                        {/* Tariff Name & Duration */}
                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 group-hover:bg-primary/5 transition-colors group-hover:scale-110 duration-500">
                                <Clock className="w-10 h-10 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">{tariff.name}</h3>
                            <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest">
                                {tariff.duration} kunlik kirish
                            </div>
                        </div>

                        {/* Description */}
                        {tariff.description && (
                            <p className="text-gray-400 text-sm font-medium mb-10 text-center flex-grow leading-relaxed">
                                {tariff.description}
                            </p>
                        )}

                        {/* Price Section */}
                        <div className="mb-10 text-center">
                            <div className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em] mb-2">Obuna narxi</div>
                            <div className="text-4xl font-black text-gray-900 tracking-tight">
                                {formatPrice(getPriceForTariff(tariff.id, tariff.price))}
                            </div>
                        </div>

                        {/* CTA Button */}
                        <button
                            disabled={purchasingId !== null}
                            onClick={() => handlePurchase(tariff.id)}
                            className="w-full py-5 px-8 rounded-2xl font-black bg-primary text-white hover:bg-primary-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        >
                            {purchasingId === tariff.id ? (
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <CreditCard className="w-6 h-6" />
                            )}
                            <span className="text-lg">{purchasingId === tariff.id ? 'Yaratilmoqda...' : 'Sotib olish'}</span>
                        </button>
                    </div>
                ))}

                {/* Empty State */}
                {displayedTariffs.length === 0 && (
                    <div className="col-span-full text-center py-20">
                        <div className="bg-slate-50 rounded-[3rem] border-2 border-dashed border-gray-100 p-20">
                            <div className="w-20 h-20 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-gray-200" />
                            </div>
                            <p className="text-gray-400 text-xl font-bold">
                                {courseId ? "Bu kurs uchun hozircha tariflar mavjud emas" : "Hozircha obuna davomiyliklari mavjud emas"}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* How it Works Section */}
            <div className="mt-20 bg-gradient-to-br from-slate-50 to-white rounded-[3rem] p-12 border border-gray-100 shadow-inner">
                <h3 className="text-3xl font-black text-gray-900 mb-12 text-center tracking-tight">Kurs sotib olish jarayoni</h3>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center relative">
                        <div className="w-16 h-16 bg-white text-primary rounded-[1.5rem] flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-card">1</div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">Kursni tanlang</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            O'zingizga mos kursni topib, tafsilotlarini va dasturini ko'rib chiqing.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-lg shadow-primary/30">2</div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">Muddatni tanlang</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            Mutaxassislarimiz tomonidan tavsiya etilgan muddatli tarifni tanlang.
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-white text-primary rounded-[1.5rem] flex items-center justify-center text-2xl font-black mx-auto mb-8 shadow-card">3</div>
                        <h4 className="text-xl font-black text-gray-900 mb-3">To'lov qiling</h4>
                        <p className="text-sm text-gray-400 font-medium leading-relaxed">
                            Xavfsiz to'lov tizimi orqali to'lov qiling va darhol o'rganishni boshlang.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TariffsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        }>
            <TariffsContent />
        </Suspense>
    );
}
