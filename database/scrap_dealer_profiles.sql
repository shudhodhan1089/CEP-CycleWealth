-- Create scrap_dealer_profiles table for extended profile information
-- This table stores additional business details for scrap dealers

CREATE TABLE IF NOT EXISTS public.scrap_dealer_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(user_id) ON DELETE CASCADE,
    
    -- Business Information
    business_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    description TEXT,
    working_hours VARCHAR(255),
    established_year INTEGER,
    website VARCHAR(500),
    
    -- Services and Specialties
    services TEXT[] DEFAULT '{}',
    specialties TEXT,
    pickup_radius DECIMAL(10, 2), -- in kilometers
    minimum_weight DECIMAL(10, 2), -- in kilograms
    
    -- Payment Methods
    payment_methods TEXT[] DEFAULT '{}',
    
    -- Certifications
    certifications TEXT[] DEFAULT '{}',
    
    -- Social Media Links
    social_media JSONB DEFAULT '{}',
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_pickup_radius CHECK (pickup_radius IS NULL OR pickup_radius > 0),
    CONSTRAINT valid_minimum_weight CHECK (minimum_weight IS NULL OR minimum_weight > 0),
    CONSTRAINT valid_established_year CHECK (established_year IS NULL OR (established_year >= 1900 AND established_year <= EXTRACT(YEAR FROM NOW())))
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_scrap_dealer_profiles_user_id ON public.scrap_dealer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_scrap_dealer_profiles_city ON public.scrap_dealer_profiles(city);
CREATE INDEX IF NOT EXISTS idx_scrap_dealer_profiles_services ON public.scrap_dealer_profiles USING GIN(services);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.scrap_dealer_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON public.scrap_dealer_profiles
    FOR SELECT USING (auth.uid()::text = user_id::text);

-- Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON public.scrap_dealer_profiles
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Policy: Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON public.scrap_dealer_profiles
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Policy: Users can only delete their own profile
CREATE POLICY "Users can delete own profile" ON public.scrap_dealer_profiles
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_scrap_dealer_profiles_updated_at
    BEFORE UPDATE ON public.scrap_dealer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Grant permissions
GRANT ALL ON public.scrap_dealer_profiles TO authenticated;
GRANT SELECT ON public.scrap_dealer_profiles TO anon;

-- Sample data for testing (optional)
-- INSERT INTO public.scrap_dealer_profiles (
--     user_id,
--     business_name,
--     address,
--     city,
--     state,
--     zip_code,
--     description,
--     working_hours,
--     established_year,
--     website,
--     services,
--     specialties,
--     pickup_radius,
--     minimum_weight,
--     payment_methods,
--     certifications,
--     social_media
-- ) VALUES (
--     'your-user-id-here',
--     'Green Earth Recycling',
--     '123 Main Street, Sector 15',
--     'Mumbai',
--     'Maharashtra',
--     '400001',
--     'We are a leading scrap recycling company specializing in metal, plastic, and e-waste recycling. Our mission is to promote sustainable waste management and reduce environmental impact.',
--     'Mon-Fri: 9:00 AM - 6:00 PM, Sat: 9:00 AM - 1:00 PM',
--     2015,
--     'https://greenearthrecycling.com',
--     ARRAY['Metal Scrap Collection', 'Plastic Recycling', 'E-Waste Collection'],
--     'Industrial waste management, bulk scrap collection, certified recycling processes',
--     25.5,
--     10.0,
--     ARRAY['Cash', 'Bank Transfer', 'UPI', 'Paytm'],
--     ARRAY['ISO 14001', 'Local Municipal License'],
--     '{
--         "facebook": "https://facebook.com/greenearthrecycling",
--         "instagram": "https://instagram.com/greenearthrecycling",
--         "twitter": "https://twitter.com/greenearthrecycling",
--         "linkedin": "https://linkedin.com/company/greenearthrecycling"
--     }'::jsonb
-- );
