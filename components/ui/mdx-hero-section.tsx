import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    buttonText?: string;
    buttonLink?: string;
}

export function HeroSection({ title, subtitle, buttonText, buttonLink }: HeroSectionProps) {
    return (
        <div className="flex flex-col items-center text-center my-16 px-6 sm:px-12">
            <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
                {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8">
                {subtitle}
            </p>
            {buttonText && buttonLink && (
                <Link
                    href={buttonLink}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-bold shadow-md hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 text-lg"
                >
                    {buttonText}
                    <ArrowRight className="w-5 h-5" />
                </Link>
            )}
        </div>
    );
}
