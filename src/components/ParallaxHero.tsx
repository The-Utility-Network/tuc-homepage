'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface ParallaxHeroProps {
  image: string;
  title: string;
  subtitle: string;
  color: string;
  medallion?: string;
  imagePosition?: 'center' | 'left' | 'right' | 'top' | 'bottom';
}

export default function ParallaxHero({ image, title, subtitle, color, medallion, imagePosition = 'center' }: ParallaxHeroProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      setOffset({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Map position to object-position class
  const positionClass = {
    center: 'object-center',
    left: 'object-left',
    right: 'object-right',
    top: 'object-top',
    bottom: 'object-bottom',
  }[imagePosition];

  return (
    <div className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${offset.x * 30}px, ${offset.y * 30}px) scale(1.1)` }}
      >
        <Image
          src={image}
          alt="Hero Background"
          fill
          className={`object-cover opacity-80 ${positionClass}`}
          priority
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center space-y-6 max-w-4xl px-6 flex flex-col items-center">
        {medallion && (
          <div className="relative w-32 h-32 md:w-48 md:h-48 mb-4 animate-float">
            <div className="absolute inset-0 rounded-full blur-xl opacity-30" style={{ backgroundColor: color }} />
            <Image
              src={medallion}
              alt="Medallion"
              fill
              className="object-contain drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            />
          </div>
        )}
        <h1
          className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]"
          style={{ textShadow: `0 0 50px ${color}` }}
        >
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 font-light tracking-wide bg-black/60 backdrop-blur-md p-4 rounded-xl inline-block border border-white/10">
          {subtitle}
        </p>
      </div>

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 pointer-events-none" />
    </div>
  );
}
