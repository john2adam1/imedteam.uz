'use client';

import { useState, useEffect } from 'react';
import { tariffService, courseService } from '@/services';
import { useRouter } from 'next/navigation';
import { Clock, BookOpen } from 'lucide-react';

export default function TariffsPage() {
    const [tariffs, setTariffs] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadTariffs = async () => {
            try {
                const data = await tariffService.getAll();
                setTariffs(data);
            } catch (error) {
                console.error('Failed to load tariffs:', error);
            } finally {
                setLoading(false);
            }
        };

        loadTariffs();
    }, []);

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
        <div className="max-w-7xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Obuna davomiyligi</h1>
                <p className="text-lg text-gray-600">Kurslarga kirish uchun obuna muddatini tanlang</p>
            </div>

            {/* Info Banner */}
            <div className="bg-primary-50 border border-primary-200 rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <BookOpen className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Qanday ishlaydi?</h3>
                        <p className="text-gray-700 text-sm">
                            Har bir kurs o'zining narxiga ega. Siz kursni tanlaganingizda, turli obuna muddatlari uchun
                            narxlarni ko'rishingiz mumkin. Obuna muddati tugaguncha kurs materiallariga to'liq kirish huquqiga ega bo'lasiz.
                        </p>
                    </div>
                </div>
            </div>

            {/* Tariff Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 mt-12">
                {tariffs?.tariffs?.map((tariff: any) => (
                    <div
                        key={tariff.id}
                        className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
                    >
                        {/* Tariff Name & Duration */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{tariff.name}</h3>
                                <p className="text-sm text-gray-600">{tariff.duration} kun</p>
                            </div>
                        </div>

                        {/* Description */}
                        {tariff.description && (
                            <p className="text-gray-600 text-sm mb-6">{tariff.description}</p>
                        )}

                        {/* Duration Highlight */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-600 text-sm">Obuna muddati:</span>
                                <span className="text-xl font-bold text-gray-900">{tariff.duration} kun</span>
                            </div>
                        </div>

                        {/* Info Text */}
                        <p className="text-xs text-gray-500 text-center mb-4">
                            Narx har bir kurs uchun alohida belgilanadi
                        </p>

                        {/* CTA Button */}
                        <button
                            onClick={() => router.push('/app/courses')}
                            className="w-full py-3 px-6 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 transition-all shadow-md"
                        >
                            Kurslarni ko'rish
                        </button>
                    </div>
                ))}

                {/* Empty State */}
                {(!tariffs?.tariffs || tariffs.tariffs.length === 0) && (
                    <div className="col-span-full text-center py-16">
                        <div className="bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 p-12">
                            <p className="text-gray-500 text-lg">Hozircha obuna davomiyliklari mavjud emas</p>
                        </div>
                    </div>
                )}
            </div>

            {/* How it Works Section */}
            <div className="mt-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Kurs sotib olish jarayoni</h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">1</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Kursni tanlang</h4>
                        <p className="text-sm text-gray-600">O'zingizga mos kursni topib, tafsilotlarini ko'ring</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">2</div>
                        <h4 className="font-semibold text-gray-900 mb-2">Muddatni tanlang</h4>
                        <p className="text-sm text-gray-600">6 kun yoki 12 kun obuna muddatini tanlang</p>
                    </div>
                    <div className="text-center">
                        <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">3</div>
                        <h4 className="font-semibold text-gray-900 mb-2">To'lovni amalga oshiring</h4>
                        <p className="text-sm text-gray-600">To'lov qiling va darhol kursga kirish huquqini oling</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
