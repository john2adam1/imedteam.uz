'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import * as PlyrModule from 'plyr';
const PlyrClass = (PlyrModule as any).default || PlyrModule;
import 'plyr/dist/plyr.css';

interface PlyrProps {
    source: any;
    options?: any;
    onReady?: (player: any) => void;
}

/**
 * CustomPlyr – wraps the Plyr library.
 *
 * Plyr requires:
 *  - A <video> element for HTML5 sources (mp4, webm, …)
 *  - A <div> element for YouTube / Vimeo embeds
 *
 * We detect the provider from `source.sources[0].provider` and render
 * the correct element so both playback modes work correctly.
 */
const CustomPlyr = forwardRef<any, PlyrProps>((props, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const divRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    // Determine which element type this source needs
    const isYoutube = props.source?.sources?.[0]?.provider === 'youtube' ||
        props.source?.sources?.[0]?.provider === 'vimeo';

    useEffect(() => {
        const el = isYoutube ? divRef.current : videoRef.current;
        if (!el) return;

        const player = new PlyrClass(el, props.options || {});
        playerRef.current = player;

        if (props.onReady) {
            player.on('ready', () => props.onReady!(player));
            if (player.ready) props.onReady!(player);
        }

        // Set initial source
        if (props.source) {
            player.source = props.source;
        }

        if (ref) {
            if (typeof ref === 'function') ref(player);
            else (ref as any).current = player;
        }

        return () => {
            try { playerRef.current?.destroy(); } catch (_) { }
            playerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isYoutube]);

    // Update source when it changes (without re-initialising the player)
    useEffect(() => {
        if (!playerRef.current || !props.source) return;

        const apply = () => {
            try {
                playerRef.current.source = props.source;
            } catch (err) {
                console.warn('Plyr source update failed:', err);
            }
        };

        if (playerRef.current.ready) {
            apply();
        } else {
            playerRef.current.once('ready', apply);
        }
    }, [props.source]);

    return (
        <div className="plyr-react w-full h-full overflow-hidden">
            {isYoutube
                ? <div ref={divRef} className="w-full h-full" />
                : <video ref={videoRef} className="w-full h-full" playsInline controls />
            }
        </div>
    );
});

CustomPlyr.displayName = 'CustomPlyr';

export default CustomPlyr;
