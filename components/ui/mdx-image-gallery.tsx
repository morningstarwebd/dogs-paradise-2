import React from 'react';

interface ImageGalleryProps {
    images: string[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
    if (!images || images.length === 0) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-16">
            {images.map((src, index) => (
                <div key={index} className="rounded-3xl overflow-hidden h-[300px] md:h-[400px] border border-border shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={src}
                        alt={`Gallery Image ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                </div>
            ))}
        </div>
    );
}
