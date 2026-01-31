import { aboutService } from '@/services/mobile-api';

export default async function AboutPage() {
    let aboutContent = [];

    try {
        const response = await aboutService.getAll();
        aboutContent = response.about || [];
    } catch (error) {
        console.error('Failed to fetch about content:', error);
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
                                <div className="prose max-w-none text-gray-600">
                                    {item.content}
                                </div>
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
                            Our platform offers a wide range of courses, interactive lessons,
                            and expert-led content to help you advance your medical knowledge
                            and skills.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
