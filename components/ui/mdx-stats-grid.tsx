import React from 'react';

interface StatsGridProps {
    stats: {
        number: string;
        label: string;
    }[];
}

export function StatsGrid({ stats }: StatsGridProps) {
    if (!stats || stats.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 my-16 w-full">
            {stats.map((stat, index) => (
                <div key={index} className="bg-background border border-border p-8 rounded-3xl text-center shadow-sm flex flex-col justify-center">
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-accent mb-3">{stat.number}</h3>
                    <p className="text-sm md:text-base uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</p>
                </div>
            ))}
        </div>
    );
}
