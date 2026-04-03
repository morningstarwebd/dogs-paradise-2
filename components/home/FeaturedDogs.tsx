'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import SectionHeading from '@/components/ui/SectionHeading';
import CategoryStrip from '@/components/home/CategoryStrip';
import DogCard from '@/components/dogs/DogCard';
import MobileCarousel from '@/components/ui/MobileCarousel';
import { dogs } from '@/data/dogs';
import { staggerContainer } from '@/lib/animations';
import Link from 'next/link';

export default function FeaturedDogs() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showAll, setShowAll] = useState(false);

  const featuredDogsList = dogs.filter((d) => d.featured);
  const featuredOnly = featuredDogsList.length > 0 ? featuredDogsList : dogs;

  const filtered = activeCategory === 'all'
    ? featuredOnly
    : dogs.filter((d) => d.categorySlug === activeCategory);

  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 section-solid-blue" id="featured-dogs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Our Puppies"
          subtitle="Browse our carefully raised puppies. Every one is vaccinated, vet-checked, and KCI registered."
        />

        {/* Category Filter */}
        <div className="mb-10 flex justify-center">
          <CategoryStrip activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        </div>

        {/* Mobile Carousel */}
        <MobileCarousel autoPlay autoPlayInterval={3500} itemWidth="large">
          {filtered.slice(0, 8).map((dog, i) => (
            <DogCard key={dog.id} dog={dog} index={i} />
          ))}
        </MobileCarousel>

        {/* Desktop Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden lg:grid lg:grid-cols-3 gap-6"
        >
          {displayed.map((dog, i) => (
            <DogCard key={dog.id} dog={dog} index={i} />
          ))}
        </motion.div>

        {/* Load More / View All */}
        <div className="mt-12 text-center flex flex-wrap gap-4 justify-center">
          {!showAll && filtered.length > 6 && (
            <button
              onClick={() => setShowAll(true)}
              className="hidden lg:inline-flex glass-btn px-8 py-3 text-sm font-medium"
            >
              Load More ({filtered.length - 6} more)
            </button>
          )}
          <Link href="/breeds" className="glass-btn px-8 py-3 text-sm font-medium">
            View All Breeds →
          </Link>
        </div>
      </div>
    </section>
  );
}
