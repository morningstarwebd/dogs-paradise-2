CREATE TABLE IF NOT EXISTS public.experience_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_enabled BOOLEAN DEFAULT true,
    particle_count INTEGER DEFAULT 3000,
    glow_intensity FLOAT DEFAULT 1.5,
    theme_mode TEXT DEFAULT 'dark',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.experience_settings ENABLE ROW LEVEL SECURITY;

-- Allow read access to all users
CREATE POLICY "Allow public read access on experience_settings" 
ON public.experience_settings 
FOR SELECT 
USING (true);

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update access on experience_settings" 
ON public.experience_settings 
FOR UPDATE 
TO authenticated 
USING (true);

-- Insert default row
INSERT INTO public.experience_settings (id, hero_enabled, particle_count, glow_intensity, theme_mode)
VALUES ('00000000-0000-0000-0000-000000000000', true, 3000, 1.5, 'dark')
ON CONFLICT (id) DO NOTHING;
