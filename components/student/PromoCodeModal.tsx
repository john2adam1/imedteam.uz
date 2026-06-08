import { useState, useEffect } from 'react';
import { X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { promocodeService } from '@/services';
import { PromocodeRes } from '@/types/mobile-api';

interface PromoCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    tariffId: string;
    courseId: string;
    tariffName: string;
    basePrice: number;
    onPurchase: (tariffId: string, promoCode?: string, promoId?: string) => void;
    isPurchasing: boolean;
}

export function PromoCodeModal({
    isOpen,
    onClose,
    tariffId,
    courseId,
    tariffName,
    basePrice,
    onPurchase,
    isPurchasing
}: PromoCodeModalProps) {
    const [promoCode, setPromoCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromocodeRes | null>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setPromoCode('');
            setError('');
            setAppliedPromo(null);
        }
    }, [isOpen, tariffId]);

    const handleCheckPromo = async () => {
        if (!promoCode.trim()) return;

        setLoading(true);
        setError('');
        setAppliedPromo(null);

        try {
            const res = await promocodeService.check({
                promocode: promoCode,
                course_id: courseId,
                tariff_id: tariffId
            });

            if (res.is_valid) {
                setAppliedPromo(res);
            } else {
                // Map backend error messages to user-friendly text
                const errorMap: Record<string, string> = {
                    "promocode not found": "Bunday promokod mavjud emas",
                    "promocode expired": "Promokod muddati tugagan",
                    "promocode inactive": "Promokod faol emas",
                    "promocode not started": "Promokod hali boshlanmagan",
                    "order amount is too small for this promocode": "Buyurtma summasi yetarli emas",
                    "promocode usage limit reached for user": "Siz bu promokoddan foydalanish limitiga yetdingiz",
                    "promocode usage limit reached": "Promokoddan foydalanish limiti tugagan",
                    "unexpected error": "Kutilmagan xatolik",
                    "course or tariff not found": "Kurs yoki tarif topilmadi"
                };

                // Use the map or fallback to the message from backend or default
                setError(errorMap[res.message] || res.message || 'Promokod yaroqsiz');
            }
        } catch (err: any) {
            console.error('Promo check failed:', err);
            // If the error object itself has a message property matching our constants
            const msg = err.message || '';
            const errorMap: Record<string, string> = {
                "promocode not found": "Bunday promokod mavjud emas",
                "promocode expired": "Promokod muddati tugagan",
                "promocode inactive": "Promokod faol emas",
                "promocode not started": "Promokod hali boshlanmagan",
                "order amount is too small for this promocode": "Buyurtma summasi yetarli emas",
                "promocode usage limit reached for user": "Siz bu promokoddan foydalanish limitiga yetdingiz",
                "promocode usage limit reached": "Promokoddan foydalanish limiti tugagan",
                "unexpected error": "Kutilmagan xatolik",
                "course or tariff not found": "Kurs yoki tarif topilmadi"
            };

            setError(errorMap[msg] || 'Tekshirishda xatolik yuz berdi');
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = () => {
        if (appliedPromo?.is_valid) {
            onPurchase(tariffId, promoCode, appliedPromo.promocode_id || undefined);
        } else {
            // Proceed without promo code
            onPurchase(tariffId);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('uz-UZ', {
            style: 'currency',
            currency: 'UZS',
            maximumFractionDigits: 0
        }).format(price);
    };

    // Use values directly from backend response
    const finalPrice = appliedPromo?.total_amount ?? basePrice;
    const discountAmount = appliedPromo?.discount_amount ?? 0;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Promokod bormi?</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <p className="text-sm text-gray-500 font-medium mb-1">Tanlangan tarif:</p>
                        <p className="text-xl font-black text-gray-900">{tariffName}</p>
                    </div>

                    {/* Input Area */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Promokod kiritish</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={promoCode}
                                onChange={(e) => {
                                    setPromoCode(e.target.value.toUpperCase());
                                    setError('');
                                    if (appliedPromo) setAppliedPromo(null);
                                }}
                                placeholder="Masalan: IMED2024"
                                className={`w-full pl-4 pr-12 py-3.5 bg-slate-50 border-2 rounded-xl font-bold text-gray-900 placeholder:text-gray-400 outline-none transition-all uppercase ${error ? 'border-red-200 focus:border-red-500 bg-red-50' :
                                    appliedPromo ? 'border-emerald-200 bg-emerald-50' :
                                        'border-transparent focus:bg-white focus:border-primary/20'
                                    }`}
                                disabled={loading}
                            />

                            {/* Status Icon / Check Button */}
                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                ) : appliedPromo ? (
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                        <Check size={18} strokeWidth={3} />
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleCheckPromo}
                                        disabled={!promoCode || loading}
                                        className="p-2 text-sm font-bold text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        TEKSHIRISH
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Status Messages */}
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in slide-in-from-top-1">
                                <AlertCircle size={14} />
                                {error}
                            </div>
                        )}

                        {appliedPromo && (
                            <div className="flex items-center gap-2 text-emerald-600 text-xs font-bold animate-in slide-in-from-top-1">
                                <span className="bg-emerald-100 px-2 py-0.5 rounded text-[10px] uppercase">
                                    {appliedPromo.discount_type === 'percent' ? `-${appliedPromo.discount_value}%` : 'Chegirma'}
                                </span>
                                Promokod qo'llanilindi!
                            </div>
                        )}
                    </div>

                    {/* Price Summary */}
                    <div className="bg-slate-50 rounded-2xl p-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-500 font-medium text-sm">Asl narxi</span>
                            <span className={`font-bold ${appliedPromo ? 'text-gray-400 line-through decoration-red-400' : 'text-gray-900'}`}>
                                {formatPrice(basePrice)}
                            </span>
                        </div>

                        {appliedPromo && (
                            <div className="flex justify-between items-center mb-2 text-emerald-600">
                                <span className="font-bold text-sm">Chegirma</span>
                                <span className="font-bold">-{formatPrice(discountAmount)}</span>
                            </div>
                        )}

                        <div className="pt-3 mt-1 border-t border-gray-200 flex justify-between items-center">
                            <span className="text-gray-900 font-black text-sm uppercase tracking-wide">Jami to'lov</span>
                            <span className="text-2xl font-black text-primary">
                                {formatPrice(finalPrice)}
                            </span>
                        </div>
                    </div>

                    {/* Actions */}
                    <button
                        onClick={handleConfirm}
                        disabled={isPurchasing}
                        className="w-full py-4 rounded-xl font-black bg-primary text-white text-lg hover:bg-primary-600 active:scale-[0.98] transition-all shadow-lg shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPurchasing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Yaratilmoqda...
                            </>
                        ) : (
                            'To\'lovga o\'tish'
                        )}
                    </button>

                    {!appliedPromo && !isPurchasing && (
                        <button
                            onClick={handleConfirm}
                            className="w-full py-3 text-gray-400 font-bold text-sm hover:text-gray-600 transition-colors"
                        >
                            Promokodsiz davom etish
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
