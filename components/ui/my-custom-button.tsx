import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface MyCustomButtonProps {
    link: string;
    text: string;
}

export function MyCustomButton({ link, text }: MyCustomButtonProps) {
    const isExternal = link.startsWith('http');

    const buttonClass = "inline-flex items-center gap-2 px-6 py-3 mt-4 mb-8 bg-accent text-accent-foreground rounded-full font-semibold shadow-sm hover:bg-accent/90 transition-all hover:scale-105 active:scale-95";

    if (isExternal) {
        return (
            <a href={link} target="_blank" rel="noopener noreferrer" className={buttonClass}>
                {text}
                <ArrowRight className="w-4 h-4" />
            </a>
        );
    }

    return (
        <Link href={link} className={buttonClass}>
            {text}
            <ArrowRight className="w-4 h-4" />
        </Link>
    );
}
