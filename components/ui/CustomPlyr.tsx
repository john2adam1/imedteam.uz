'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import * as PlyrModule from 'plyr';
const Plyr = (PlyrModule as any).default || PlyrModule;
import 'plyr/dist/plyr.css';

interface PlyrProps {
    source: any;
    options?: any;
    onReady?: (player: any) => void;
}

const CustomPlyr = forwardRef<any, PlyrProps>((props, ref) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (!elementRef.current) return;

        // Use the element reference directly instead of a selector
        // This avoids issues with multiple players on the same page
        const player = new Plyr(elementRef.current, props.options || {});
        playerRef.current = player;

        if (props.source) {
            player.source = props.source;
        }

        if (props.onReady) {
            player.on('ready', () => props.onReady!(player));
            if (player.ready) props.onReady!(player);
        }

        if (ref) {
            if (typeof ref === 'function') ref(player);
            else (ref as any).current = player;
        }

        return () => {
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, []);

    // Update source when it changes
    useEffect(() => {
        if (playerRef.current && props.source) {
            // Avoid redundant source updates
            const currentSource = playerRef.current.source;
            if (JSON.stringify(currentSource) !== JSON.stringify(props.source)) {
                playerRef.current.source = props.source;
            }
        }
    }, [props.source]);

    return (
        <div className="plyr-react plyr w-full h-full">
            <div ref={elementRef} className="w-full h-full" />
        </div>
    );
});

CustomPlyr.displayName = 'CustomPlyr';

export default CustomPlyr;
