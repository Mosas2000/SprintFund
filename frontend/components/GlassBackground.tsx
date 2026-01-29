'use client';

import React, { useEffect, useState } from 'react';

export default function GlassBackground() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
            {/* Dynamic gradients that follow the mouse */}
            <div
                className="absolute w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-all duration-1000 ease-out bg-orange-500"
                style={{
                    left: `${mousePosition.x}%`,
                    top: `${mousePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                }}
            />
            <div
                className="absolute w-[400px] h-[400px] rounded-full blur-[100px] opacity-10 transition-all duration-[2000ms] ease-out bg-blue-500"
                style={{
                    left: `${100 - mousePosition.x}%`,
                    top: `${100 - mousePosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {/* Static ambient blobs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Noise texture overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none contrast-150 brightness-150"
                style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
        </div>
    );
}
