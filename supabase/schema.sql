-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'business_owner', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Businesses table
CREATE TABLE IF NOT EXISTS public.businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES public.categories(id),
  logo TEXT NOT NULL,
  rating NUMERIC(3,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  location TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  description TEXT NOT NULL,
  short_description TEXT,
  starting_price NUMERIC,
  maximum_price NUMERIC,
  price_range_label TEXT,
  price_range_key TEXT CHECK (price_range_key IN ('low', 'medium', 'high')),
  featured BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  hours TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_prices CHECK (starting_price IS NULL OR maximum_price IS NULL OR starting_price <= maximum_price)
);

-- Business gallery images
CREATE TABLE IF NOT EXISTS public.business_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_businesses_category ON public.businesses(category);
CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);
CREATE INDEX idx_businesses_featured ON public.businesses(featured);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_reviews_business_id ON public.reviews(business_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);

-- Row Level Security (RLS) Policies

-- Users table: Only authenticated users can read their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own profile"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Businesses table: Everyone can read active businesses
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read active businesses"
  ON public.businesses FOR SELECT
  USING (status = 'active' OR auth.uid() = owner_id);

CREATE POLICY "Business owners can insert their own businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Business owners can update their own businesses"
  ON public.businesses FOR UPDATE
  USING (auth.uid() = owner_id);

CREATE POLICY "Business owners can delete their own businesses"
  ON public.businesses FOR DELETE
  USING (auth.uid() = owner_id);

-- Business gallery: Same as businesses
ALTER TABLE public.business_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read business gallery"
  ON public.business_gallery FOR SELECT
  USING (TRUE);

-- Reviews: Everyone can read, authenticated users can create/update their own
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read reviews"
  ON public.reviews FOR SELECT
  USING (TRUE);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Insert category data
INSERT INTO public.categories (id, name, icon) VALUES
  ('restaurants', 'Restaurants & Food', '🍽️'),
  ('retail', 'Retail & Shopping', '🛍️'),
  ('health', 'Health & Wellness', '🏥'),
  ('hotels', 'Hotels & Hospitality', '🏨'),
  ('technology', 'Technology & IT', '💻'),
  ('automotive', 'Automotive', '🚗'),
  ('education', 'Education & Training', '📚'),
  ('finance', 'Finance & Banking', '🏦'),
  ('construction', 'Construction & Real Estate', '🏗️'),
  ('beauty', 'Beauty & Personal Care', '💇'),
  ('agriculture', 'Agriculture & Farming', '🌾'),
  ('transport', 'Transport & Logistics', '🚌')
ON CONFLICT (id) DO NOTHING;
