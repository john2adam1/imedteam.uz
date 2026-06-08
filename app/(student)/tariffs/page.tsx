'use client';

import { useState, useEffect, Suspense } from 'react';
import { tariffService, courseService, orderService } from '@/services';
import { useRouter, useSearchParams } from 'next/navigation';
import { Clock, BookOpen, CreditCard } from 'lucide-react';
import { MobileCourseRes, OrderCreateBody } from '@/types/mobile-api';
import { PromoCodeModal } from '@/components/student/PromoCodeModal';

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
                // 1. Fetch course details first (if courseId exists)
                let courseData: MobileCourseRes | null = null;

                if (courseId) {
                    try {
                        courseData = await courseService.getCourseById(courseId);
                        setSelectedCourse(courseData);

                        // ✅ ROBUST FREE COURSE DETECTION: Redirect free courses immediately
                        const isFree = !!(
                            courseData.is_public ||
                            !courseData.price ||
                            courseData.price.length === 0 ||
                            courseData.price.every(p => p.price === 0)
                        );

                        // ✅ CAN BUY CHECK: Redirect if course is not for sale
                        const cannotBuy = !isFree && courseData.can_buy === false;

                        // If free, redirect immediately and STOP here
                        if (isFree || cannotBuy) {
                            console.log(isFree ? 'Redirecting free course:' : 'Redirecting non-purchasable course:', courseId);
                            router.replace(`/courses/${courseId}`);
                            return;
                        }
                    } catch (err) {
                        console.error('Failed to fetch course:', err);
                        // If course fetch fails, we might still want to try showing tariffs? 
                        // Or maybe just fail safely. For now, let's continue to try fetching tariffs
                        // but usually if course fails, tariffs for it won't make sense.
                    }
                }

                // 2. Only fetch tariffs if we're not redirecting
                const tariffData = await tariffService.getAll();
                setTariffs(tariffData);

            } catch (error) {
                console.error('Failed to load data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [courseId, router]);

    // PromoCode Modal State
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [selectedTariff, setSelectedTariff] = useState<any>(null);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const getPriceForTariff = (tariffId: string, defaultPrice: number) => {
        if (!selectedCourse?.price) return defaultPrice;
        const coursePrice = selectedCourse.price.find(p => p.tariff_id === tariffId);
        return coursePrice ? coursePrice.price : defaultPrice;
    };

    const formatPrice = (price: any) => {
        const numPrice = Number(price);
        if (isNaN(numPrice)) return 'Nomalum';

        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    // ✅ ROBUST TARIFF FILTERING: Exclude free courses and invalid prices
    const displayedTariffs = tariffs?.tariffs?.filter((tariff: any) => {
        if (!courseId) return true;
        if (!selectedCourse?.price) return false;

        const isFree = !!(
            selectedCourse.is_public ||
            !selectedCourse.price ||
            selectedCourse.price.length === 0 ||
            selectedCourse.price.every(p => p.price === 0)
        );
        if (isFree) return false;

        const coursePrice = selectedCourse.price.find(p => p.tariff_id === tariff.id);
        return coursePrice !== undefined && typeof coursePrice.price === 'number' && !isNaN(coursePrice.price);
    }) || [];

    const handlePurchase = (tariff: any) => {
        if (!courseId) {
            router.push('/courses');
            return;
        }

        const isFree = !!(
            selectedCourse?.is_public ||
            !selectedCourse?.price ||
            selectedCourse?.price.length === 0 ||
            selectedCourse?.price.every(p => p.price === 0)
        );
        if (isFree) {
            console.warn('Blocked order creation for free course');
            router.push(`/courses/${courseId}`);
            return;
        }

        setSelectedTariff(tariff);
        setIsPromoModalOpen(true);
    };

    const handleConfirmPurchase = async (tariffId: string, promoCode?: string, promoId?: string) => {
        try {
            setIsPurchasing(true);
            const orderData: OrderCreateBody = {
                tariff_id: tariffId,
                course_id: courseId || undefined,
            };

            if (promoId) {
                orderData.promocode_id = promoId;
            }

            const response = await orderService.create(orderData) as any;

            if (response.url) {
                window.location.assign(response.url);
            } else if (response.order_id) {
                alert('Buyurtma muvaffaqiyatli yaratildi');
                router.push('/courses');
            } else {
                throw new Error('Tolov havolasi topilmadi');
            }
        } catch (error: any) {
            console.error('Purchase failed:', error);
            alert(error.message || 'Tolovni amalga oshirishda xatolik yuz berdi');
        } finally {
            setIsPurchasing(false);
            setIsPromoModalOpen(false);
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

    const isFree = !!(
        selectedCourse?.is_public ||
        !selectedCourse?.price ||
        selectedCourse?.price.length === 0 ||
        selectedCourse?.price.every(p => p.price === 0)
    );
    if (isFree) {
        return (
            <div className="max-w-2xl mx-auto p-10 text-center">
                <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-10 mb-8">
                    <div className="text-5xl mb-4">🎁</div>
                    <h2 className="text-2xl font-black text-emerald-900 mb-2">Bu kurs bepul!</h2>
                    <p className="text-emerald-700 font-medium">
                        Bu kurs hamma uchun bepul. Sotib olish kerak emas, darhol boshlang!
                    </p>
                </div>
                <button
                    onClick={() => router.push(`/courses/${courseId}`)}
                    className="px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all active:scale-95"
                >
                    Kursga qaytish
                </button>
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

            {/* Tariff Cards Grid - Optimized for 2 Plans */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto mt-8">
                {displayedTariffs.map((tariff: any, index: number) => {
                    const basePrice = selectedCourse?.price?.find((p: any) => p.tariff_id === tariff.id)?.price ?? tariff.price;
                    const isPopular = index === 0; // Make first plan popular

                    return (
                        <div
                            key={tariff.id}
                            className={`bg-white rounded-[3rem] border-2 ${isPopular ? 'border-primary shadow-premium' : 'border-gray-100 shadow-soft'} p-12 flex flex-col hover:shadow-premium hover:-translate-y-1 transition-all duration-500 group relative ${isPopular ? 'lg:scale-105' : ''}`}
                        >
                            {/* Popular Badge */}
                            {isPopular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <div className="px-6 py-2 bg-gradient-to-r from-primary to-primary-600 text-white rounded-full text-sm font-black uppercase tracking-widest shadow-lg">
                                        ⭐ OMMABOP
                                    </div>
                                </div>
                            )}

                            {/* Tariff Name & Duration */}
                            <div className="flex flex-col items-center text-center mb-10">
                                <div className={`w-24 h-24 ${isPopular ? 'bg-primary/10' : 'bg-slate-50'} rounded-[2.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                    <Clock className={`w-12 h-12 ${isPopular ? 'text-primary' : 'text-primary'}`} />
                                </div>
                                <h3 className="text-3xl font-black text-gray-900 mb-3">{tariff.name}</h3>
                                <div className={`px-6 py-3 ${isPopular ? 'bg-primary/10 text-primary' : 'bg-emerald-50 text-emerald-600'} rounded-full text-sm font-black uppercase tracking-widest`}>
                                    {tariff.duration} oylik kirish
                                </div>
                            </div>

                            {/* Description */}
                            {tariff.description && (
                                <p className="text-gray-400 text-base font-medium mb-12 text-center flex-grow leading-relaxed">
                                    {tariff.description}
                                </p>
                            )}

                            {/* Price Section */}
                            <div className="mb-12 text-center">
                                <div className="text-[11px] text-gray-300 font-black uppercase tracking-[0.3em] mb-3">Obuna narxi</div>
                                <div className={`text-5xl font-black ${isPopular ? 'text-primary' : 'text-gray-900'} tracking-tight mb-2`}>
                                    {formatPrice(basePrice)}
                                </div>
                                {isPopular && (
                                    <div className="text-sm text-emerald-600 font-bold">Eng yaxshi tanlov!</div>
                                )}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => handlePurchase(tariff)}
                                className={`w-full py-6 px-8 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 active:scale-[0.98] ${isPopular ? 'bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:from-primary-600 hover:to-primary' : 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg'}`}
                            >
                                <CreditCard className="w-6 h-6" />
                                <span>Sotib olish</span>
                            </button>
                        </div>
                    );
                })}

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

            {/* Promo Modal Integration */}
            {selectedTariff && (
                <PromoCodeModal
                    isOpen={isPromoModalOpen}
                    onClose={() => setIsPromoModalOpen(false)}
                    tariffId={selectedTariff.id}
                    courseId={courseId!}
                    tariffName={selectedTariff.name}
                    basePrice={getPriceForTariff(selectedTariff.id, selectedTariff.price)}
                    onPurchase={handleConfirmPurchase}
                    isPurchasing={isPurchasing}
                />
            )}
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