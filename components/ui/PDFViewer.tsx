'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface PDFViewerProps {
    url: string;
    name: string;
    onClose: () => void;
}

export default function PDFViewer({ url, name, onClose }: PDFViewerProps) {
    const [proxyUrl, setProxyUrl] = useState<string>('');

    useEffect(() => {
        if (url) {
            setProxyUrl(`/api/pdf-proxy?url=${encodeURIComponent(url)}#toolbar=0&navpanes=0&scrollbar=0`);
        }
    }, [url]);

    // Block keyboard shortcuts: Ctrl+S, Ctrl+P, Ctrl+U
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const ctrl = e.ctrlKey || e.metaKey;
            if (ctrl && ['s', 'p', 'u'].includes(e.key.toLowerCase())) {
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleKeyDown, { capture: true });
        return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col animate-in fade-in duration-200"
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/50">
                <h3 className="text-white font-bold line-clamp-1 max-w-md">{name}</h3>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-red-500/20 hover:text-red-500 text-white rounded-xl transition-all"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Viewer Content */}
            <div className="flex-1 bg-slate-900 relative">
                {proxyUrl && (
                    <iframe
                        src={proxyUrl}
                        className="w-full h-full border-none"
                        title={name}
                    />
                )}
                {/* Transparent overlay — blocks context menu outside iframe area;
                    pointer-events: none lets scroll/wheel events pass through to the iframe */}
                <div
                    className="absolute inset-0"
                    style={{ pointerEvents: 'none' }}
                    onContextMenu={(e) => e.preventDefault()}
                />
            </div>
        </div>
    );
}
