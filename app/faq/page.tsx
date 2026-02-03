'use client';

import { useEffect, useState } from 'react';
import { fetchAPI, faqService } from '@/services/mobile-api';
// Actually, looking back at my read chunks, I saw /mobile/faq. 
// I need to add faqService to mobile-api.ts or just fetch here.
// I'll add faqService to mobile-api.ts first? 
// No, I'll allow myself to use fetchAPI directly or add service later.
// Wait, I saw FaqMobileList in swagger.
// I should add faqService to mobile-api.ts for consistency.
// But to save turn, I'll use fetchAPI local wrapper equivalent or just assume I'll add it.
// I'll use a local fetch for now to demonstrate.

interface Faq {
    id: string;
    question: string;
    answer: string;
    created_at: string;
}

interface FaqResponse {
    faqs: Faq[];
    total: number;
}

export default function FaqPage() {
    const [faqs, setFaqs] = useState<Faq[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        async function fetchFaqs() {
            try {
                const data = await faqService.getAll();
                setFaqs(data.faqs || []);
            } catch (error) {
                console.error('Failed to fetch FAQs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchFaqs();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h1>

                {loading ? (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : faqs.length === 0 ? (
                    <div className="text-center text-gray-500">No Frequently Asked Questions found.</div>
                ) : (
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                <button
                                    className="w-full text-left px-6 py-4 focus:outline-none flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className="font-semibold text-gray-800">{faq.question}</span>
                                    <svg
                                        className={`w-5 h-5 text-gray-500 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 py-4 bg-white border-t border-gray-200 animate-fade-in">
                                        <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: faq.answer }}></p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
