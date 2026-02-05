'use client';

import { useEffect, useState } from 'react';
import { aboutService } from '@/services';
import { AboutMobile } from '@/types/mobile-api';

export default function AboutPage() {
    const [aboutContent, setAboutContent] = useState<AboutMobile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAbout() {
            try {
                const response = await aboutService.getAll();
                setAboutContent(response.about || []);
            } catch (error) {
                console.error('Failed to fetch about content:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchAbout();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">About Us</h1>

                {aboutContent.length > 0 ? (
                    <div className="space-y-8">
                        {aboutContent.map((item) => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-8">
                                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                    {item.title}
                                </h2>
                                <div className="prose max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: item.content }} />
                                {item.image_url && (
                                    <div className="mt-6 rounded-lg overflow-hidden">
                                        <img src={item.image_url} alt={item.title} className="w-full h-auto object-cover" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Welcome to Imed Educational Platform
                        </h2>
                        <p className="text-gray-600 mb-4">
                            Imed is a comprehensive online learning platform designed to provide
                            high-quality medical education to students and professionals.
                        </p>
                        <p className="text-gray-600">
                            Please contact administrator for more information.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
