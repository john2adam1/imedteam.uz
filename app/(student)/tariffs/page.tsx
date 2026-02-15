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

                        // If free, redirect immediately and STOP here
                        if (isFree) {
                            console.log('Redirecting free course:', courseId);
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

    // Promocode state
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<any>(null);
    const [promoLoading, setPromoLoading] = useState(false);
    const [promoError, setPromoError] = useState('');

    const handleApplyPromo = async () => {
        if (!promoCode.trim()) return;

        // If specific tariff is selected, use it, otherwise use first available (less accurate but enables early check)
        const sampleTariffId = displayedTariffs[0]?.id;

        try {
            setPromoLoading(true);
            setPromoError('');
            setAppliedPromo(null);

            const res = await import('@/services').then(m => m.promocodeService.check({
                code: promoCode,
                course_id: courseId!,
                tariff_id: sampleTariffId // Send a hint, though API might validate globally
            }));

            if (res.is_valid) {
                setAppliedPromo(res);
            } else {
                setPromoError(res.message || 'Promokod yaroqsiz');
            }
        } catch (error: any) {
            console.error('Promo check failed:', error);
            const msg = error.message || '';
            // Handle specific known error strings from backend if they come as 500s or other errors not in the 200 payload
            if (msg.includes('not found') || msg.includes('topilmadi')) {
                setPromoError('Bunday promokod mavjud emas');
            } else if (msg.includes('expired')) {
                setPromoError('Promokod muddati tugagan');
            } else if (msg.includes('inactive')) {
                setPromoError('Promokod faol emas');
            } else {
                setPromoError(msg || 'Promokod tekshirishda xatolik');
            }
        } finally {
            setPromoLoading(false);
        }
    };

    const getPriceForTariff = (tariffId: string, defaultPrice: number) => {
        if (!selectedCourse?.price) return defaultPrice;
        const coursePrice = selectedCourse.price.find(p => p.tariff_id === tariffId);
        let finalPrice = coursePrice ? coursePrice.price : defaultPrice;

        // Apply discount if exists and valid
        if (appliedPromo && appliedPromo.is_valid) {
            // Use the backend calculation if it matches the current tariff (best accuracy)
            if (appliedPromo.tariff_id === tariffId && appliedPromo.total_amount !== null) {
                return appliedPromo.total_amount;
            }

            // Fallback: Manual calculation for other tariffs (e.g. if user switches or checks generally)
            if (appliedPromo.discount_type === 'percent' && appliedPromo.discount_value) {
                finalPrice = finalPrice * (1 - appliedPromo.discount_value / 100);
            } else if (appliedPromo.discount_type === 'fixed' && appliedPromo.discount_value) {
                finalPrice = Math.max(0, finalPrice - appliedPromo.discount_value);
            }
        }

        return finalPrice;
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

    const [purchasingId, setPurchasingId] = useState<string | null>(null);

    const handlePurchase = async (tariffId: string) => {
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

        try {
            setPurchasingId(tariffId);
            // Include promocode if applied
            const orderData: any = {
                tariff_id: tariffId,
                course_id: courseId,
                payment_method: 'payme'
            };

            if (appliedPromo) {
                orderData.promocode = promoCode; // Assuming API accepts this field
            }

            const response = await orderService.create(orderData) as any;

            console.log('Order created:', response);

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

            {/* Promocode Section */}
            <div className="max-w-xl mx-auto w-full">
                <div className="bg-white rounded-[2rem] p-3 border-2 border-gray-100 shadow-xl shadow-gray-100/50 flex flex-col md:flex-row gap-3">
                    <div className="flex-1 relative flex items-center">
                        <div className="absolute left-4 pointer-events-none text-xl">
                            🏷️
                        </div>
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            placeholder="Promokod (masalan: SALE20)"
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-primary/20 border-2 rounded-xl font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all uppercase"
                            disabled={appliedPromo?.is_valid}
                        />
                    </div>
                    <button
                        onClick={handleApplyPromo}
                        disabled={promoLoading || !promoCode || appliedPromo?.is_valid}
                        className={`px-8 py-3 rounded-xl font-black transition-all active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 ${appliedPromo?.is_valid
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-lg shadow-gray-900/20 disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                    >
                        {promoLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Tekshirish...</span>
                            </>
                        ) : appliedPromo?.is_valid ? (
                            <>
                                <span>✓</span>
                                <span>Qabul qilindi</span>
                            </>
                        ) : (
                            'Tekshirish'
                        )}
                    </button>
                </div>

                {/* Messages below input */}
                <div className="mt-4 px-4 text-center">
                    {promoError && (
                        <div className="inline-block p-3 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 text-sm animate-in fade-in slide-in-from-top-2">
                            ⚠️ {promoError}
                        </div>
                    )}
                    {appliedPromo?.is_valid && (
                        <div className="inline-flex items-center gap-3 p-3 bg-emerald-50 text-emerald-800 font-bold rounded-xl border border-emerald-100 text-sm animate-in fade-in slide-in-from-top-2 shadow-sm">
                            <span className="text-xl">🎉</span>
                            <div className="text-left">
                                <div className="text-emerald-900">Promokod faollashtirildi</div>
                                <div className="text-emerald-600 font-medium text-xs">
                                    {appliedPromo.discount_type === 'percent'
                                        ? `${appliedPromo.discount_value}% chegirma`
                                        : `${appliedPromo.discount_value?.toLocaleString()} UZS chegirma`}
                                    {' '} ({appliedPromo.discount_amount?.toLocaleString()} UZS tejaldi)
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    setAppliedPromo(null);
                                    setPromoCode('');
                                    setPromoError('');
                                }}
                                className="ml-2 w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                            >✕</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Tariff Cards Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                {displayedTariffs.map((tariff: any) => {
                    const originalPrice = getPriceForTariff(tariff.id, tariff.price);

                    // For display, getPriceForTariff already returns the FINAL discounted price if promo is active
                    // so we need to recalculate original strictly for display comparison
                    const basePrice = selectedCourse?.price?.find((p: any) => p.tariff_id === tariff.id)?.price ?? tariff.price;
                    const finalPrice = getPriceForTariff(tariff.id, basePrice);

                    return (
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

                                {appliedPromo && appliedPromo.is_valid && basePrice !== finalPrice ? (
                                    <div className="flex flex-col items-center">
                                        <div className="text-lg font-bold text-gray-400 line-through decoration-red-400">
                                            {formatPrice(basePrice)}
                                        </div>
                                        <div className="text-4xl font-black text-emerald-600 tracking-tight">
                                            {formatPrice(finalPrice)}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-4xl font-black text-gray-900 tracking-tight">
                                        {formatPrice(basePrice)}
                                    </div>
                                )}
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