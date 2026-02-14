'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
    id: string;
    title: string;
    description?: string;
    image_url: string;
    link_url?: string;
}

interface BannerSliderProps {
    banners: Banner[];
}

export default function BannerSlider({ banners }: BannerSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, [banners.length]);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + banners.length) % banners.length);
    }, [banners.length]);

    // Auto-advance slides
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    if (!banners || banners.length === 0) return null;

    return (
        <div
            className="relative w-full overflow-hidden rounded-[3rem] shadow-premium hover:shadow-2xl transition-all duration-500 group"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            <div
                className="flex transition-transform duration-700 ease-in-out h-[300px] md:h-[400px]"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {banners.map((banner) => (
                    <div
                        key={banner.id}
                        className="w-full flex-shrink-0 relative h-full cursor-pointer"
                        onClick={() => banner.link_url && window.open(banner.link_url, '_blank')}
                    >
                        {/* Background Image */}
                        {banner.image_url ? (
                            <img
                                src={banner.image_url}
                                alt={banner.title}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600/800000/FFFFFF?text=IMED+PLATFORMA';
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900" />
                        )}

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-10 lg:p-14">
                            <div className="max-w-3xl space-y-4">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                                    Yangi e'lon
                                </div>
                                <h2 className="text-3xl lg:text-5xl font-black text-white leading-tight drop-shadow-md">
                                    {banner.title}
                                </h2>
                                <p className="text-white/90 text-lg font-medium leading-relaxed line-clamp-2 drop-shadow-sm max-w-2xl">
                                    {banner.description}
                                </p>
                                {banner.link_url && (
                                    <div className="pt-4">
                                        <span className="inline-flex items-center gap-2 text-white font-black uppercase tracking-widest text-sm hover:gap-4 transition-all">
                                            Batafsil bilish <ChevronRight size={18} />
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            {banners.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-95 opacity-0 group-hover:opacity-100 shadow-lg"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all active:scale-95 opacity-0 group-hover:opacity-100 shadow-lg"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                                        ? 'w-8 bg-white'
                                        : 'w-2 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
