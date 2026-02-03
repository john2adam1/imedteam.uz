export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-white">
            <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-11 h-11 rounded-lg bg-transparent grid place-items-center">
                        <img src="/imedteamlogo.png" alt="Logo" className="w-full h-full object-contain rounded-lg" />
                    </div>
                    <div className="font-extrabold text-lg text-slate-800">iMed Team</div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 text-slate-700">
                    <a href="https://instagram.com/imed_team" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0-5c2.7 0 3.03.01 4.1.06 1.06.05 1.78.22 2.41.46.66.26 1.22.61 1.77 1.16.55.55.9 1.11 1.16 1.77.24.63.41 1.35.46 2.41.05 1.07.06 1.4.06 4.1s-.01 3.03-.06 4.1c-.05 1.06-.22 1.78-.46 2.41a4.9 4.9 0 0 1-1.16 1.77 4.9 4.9 0 0 1-1.77 1.16c-.63.24-1.35.41-2.41.46-1.07.05-1.4.06-4.1.06s-3.03-.01-4.1-.06c-1.06-.05-1.78-.22-2.41-.46a4.9 4.9 0 0 1-1.77-1.16 4.9 4.9 0 0 1-1.16-1.77c-.24-.63-.41-1.35-.46-2.41C2.01 15.03 2 14.7 2 12s.01-3.03.06-4.1c.05-1.06.22-1.78.46-2.41.26-.66.61-1.22 1.16-1.77.55-.55 1.11-.9 1.77-1.16.63-.24 1.35-.41 2.41-.46C8.97 2.01 9.3 2 12 2zm6.75-.9a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3z" />
                        </svg>
                        <span className="font-medium">Instagram</span>
                    </a>

                    <a href="http://www.youtube.com/@imedteam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.5 7.2s-.23-1.64-.95-2.36c-.9-.95-1.9-.95-2.36-1C16.9 3.5 12 3.5 12 3.5h0s-4.9 0-8.19.34c-.46.05-1.46.05-2.36 1C.73 5.56.5 7.2.5 7.2S.25 9.12.25 11.04v1.92C.25 14.88.5 16.8.5 16.8s.23 1.64.95 2.36c.9.95 2.08.92 2.6 1.02 1.88.18 7.95.34 7.95.34s4.9 0 8.19-.34c.46-.05 1.46-.05 2.36-1 .72-.72.95-2.36.95-2.36s.25-1.92.25-3.84v-1.92c0-1.92-.25-3.84-.25-3.84zM9.75 14.5V8.5l6 3-6 3z" />
                        </svg>
                        <span className="font-medium">YouTube</span>
                    </a>

                    <a href="https://t.me/imedteam" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-700 transition">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9.036 15.28 8.87 19.1c.34 0 .49-.15.67-.33l1.61-1.56 3.34 2.45c.61.33 1.06.16 1.22-.56l2.21-10.37c.2-.89-.32-1.23-.91-1.02l-12.94 5c-.88.34-.86.84-.15 1.06l3.31 1.03 7.69-4.86c.36-.22.7-.1.42.14" />
                        </svg>
                        <span className="font-medium">Telegram</span>
                    </a>
                </div>
            </div>
            <div className="border-t border-slate-100 text-sm text-slate-500 py-4">
                <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
                    <div>© {new Date().getFullYear()} iMed Team. Barcha huquqlar himoyalangan.</div>
                    <div>iMed Team.</div>
                </div>
            </div>
        </footer>
    );
}
