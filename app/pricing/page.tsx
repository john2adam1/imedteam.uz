'use client';

import { useEffect, useState } from 'react';
import { tariffService, orderService } from '@/services/mobile-api';
import { TariffRes } from '@/types/mobile-api';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const [tariffs, setTariffs] = useState<TariffRes[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderingId, setOrderingId] = useState<string | null>(null);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        async function fetchTariffs() {
            try {
                const response = await tariffService.getAll();
                setTariffs(response.tariffs || []);
            } catch (error) {
                console.error('Failed to fetch tariffs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchTariffs();
    }, []);

    const handlePurchase = async (tariffId: string) => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        setOrderingId(tariffId);
        try {
            // Assume order creation returns a payment URL or success message
            // Based on mobile-api.ts, create returns string? (Need to check service)
            const response = await orderService.create({
                tariff_id: tariffId,
                payment_method: 'click', // Defaulting to click or similar?
            });

            // If response contains url, redirect? Or just show success.
            // API return type was string. Assuming JSON string or payment URL.
            // Let's alert for now or updated flow.
            alert('Order created successfully! (Mock payment flow)');
        } catch (error: any) {
            alert(`Failed to create order: ${error.message}`);
        } finally {
            setOrderingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
                <p className="text-xl text-gray-600">Choose the plan that fits your learning needs.</p>
            </div>

            {tariffs.length === 0 ? (
                <div className="text-center text-gray-500">No tariff plans available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {tariffs.map((tariff) => (
                        <div key={tariff.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 flex flex-col">
                            <div className="p-8 flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">{tariff.name}</h3>
                                <div className="flex items-baseline mb-6">
                                    <span className="text-4xl font-extrabold text-blue-600">
                                        {new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumSignificantDigits: 3 }).format(tariff.price)}
                                    </span>
                                    <span className="text-gray-500 ml-2">/ {tariff.duration} days</span>
                                </div>
                                {tariff.description && (
                                    <p className="text-gray-600 mb-6">{tariff.description}</p>
                                )}
                                <ul className="space-y-4 mb-8">
                                    {tariff.features?.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-gray-600">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-8 bg-gray-50">
                                <button
                                    onClick={() => handlePurchase(tariff.id)}
                                    disabled={orderingId === tariff.id}
                                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-70"
                                >
                                    {orderingId === tariff.id ? 'Processing...' : 'Choose Plan'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
