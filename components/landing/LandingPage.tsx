'use client';

import { useEffect } from 'react';
import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Partners from '@/components/landing/Partners';
import Services from '@/components/landing/Services';
import CoursesSection from '@/components/landing/CoursesSection';
import Team from '@/components/landing/Team';
import Blog from '@/components/landing/Blog';
import Contact from '@/components/landing/Contact';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
    useEffect(() => {
        // Reveal on scroll logic
        const onScrollReveal = () => {
            document.querySelectorAll('.reveal').forEach((el) => {
                const trigger = window.innerHeight * 0.9;
                const rect = el.getBoundingClientRect();
                if (rect.top < trigger) {
                    el.classList.add('show');
                }
            });
        };

        window.addEventListener('scroll', onScrollReveal, { passive: true });
        // Trigger once on load
        onScrollReveal();

        return () => {
            window.removeEventListener('scroll', onScrollReveal);
        };
    }, []);

    return (
        <main className="min-h-screen bg-white text-slate-900 font-sans selection:bg-primary-100 selection:text-primary-700">
            <Header />
            <Hero />
            <Partners />
            <Services />
            <CoursesSection />
            <Team />
            <Blog />
            <Contact />
            <Footer />
        </main>
    );
}
