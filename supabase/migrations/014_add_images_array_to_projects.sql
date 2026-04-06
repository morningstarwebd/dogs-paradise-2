-- Dogs Paradise — Add images array to projects table
-- Version: 014
-- Description: Adds images text[] column for multiple product images (Shopify-style)

-- Add images array column to store multiple image URLs
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Add price column for product pricing
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS price numeric(10,2);

-- Add status column for availability
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS status text DEFAULT 'available'
    CHECK (status IN ('available', 'sold', 'coming_soon', 'reserved'));

-- Add gender column
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS gender text
    CHECK (gender IN ('male', 'female'));

-- Add age column  
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS age text;

-- Add characteristics JSONB for dog attributes
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS characteristics jsonb DEFAULT '{}'::jsonb;

-- Add health_info JSONB for health details
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS health_info jsonb DEFAULT '{}'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN public.projects.images IS 'Array of image URLs for product gallery';
COMMENT ON COLUMN public.projects.price IS 'Product price (nullable for inquiry-based)';
COMMENT ON COLUMN public.projects.status IS 'Availability status: available, sold, coming_soon, reserved';
COMMENT ON COLUMN public.projects.characteristics IS 'Dog characteristics: size, energy_level, coat_length, etc.';
COMMENT ON COLUMN public.projects.health_info IS 'Health info: vaccinated, dewormed, vet_checked, etc.';
