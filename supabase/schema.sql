-- =======================================================
-- RAITHA MITHRA (ರೈತ ಮಿತ್ರ) — SUPABASE DATABASE SCHEMA
-- =======================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  preferred_language TEXT DEFAULT 'kn' CHECK (preferred_language IN ('en', 'kn')),
  phone TEXT,
  state TEXT DEFAULT 'Karnataka',
  district TEXT DEFAULT 'Mandya',
  crops_grown TEXT[] DEFAULT '{}',
  land_size_acres NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. MARKET PRICES TABLE
CREATE TABLE IF NOT EXISTS public.market_prices (
  id BIGSERIAL PRIMARY KEY,
  crop TEXT NOT NULL,
  crop_image TEXT,
  category TEXT DEFAULT 'Grain', -- 'Grain', 'Vegetable', 'Spice', 'Oilseed', 'Fruit', 'Horticulture', 'Other'
  market TEXT NOT NULL,
  district TEXT NOT NULL,
  state TEXT NOT NULL DEFAULT 'Karnataka',
  price NUMERIC NOT NULL,
  previous_price NUMERIC,
  trend TEXT DEFAULT 'stable', -- 'up', 'down', 'stable'
  unit TEXT NOT NULL DEFAULT 'Quintal',
  reliability TEXT DEFAULT 'Trusted', -- 'Trusted', 'Estimate only'
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT NOT NULL DEFAULT 'AgMarknet / KRAMA',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_market_prices_crop_date ON public.market_prices (crop, date DESC);
CREATE INDEX IF NOT EXISTS idx_market_prices_district ON public.market_prices (district);

-- 3. NATIONWIDE GOVERNMENT SCHEMES TABLE (Central + State)
CREATE TABLE IF NOT EXISTS public.schemes (
  id BIGSERIAL PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_kn TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_kn TEXT NOT NULL,
  eligibility_en TEXT NOT NULL,
  eligibility_kn TEXT NOT NULL,
  benefit_en TEXT NOT NULL,
  benefit_kn TEXT NOT NULL,
  scope TEXT NOT NULL DEFAULT 'central' CHECK (scope IN ('central', 'state')),
  state TEXT, -- Null for central, or state name for state schemes
  category TEXT NOT NULL DEFAULT 'all', -- 'small', 'marginal', 'all', 'women'
  application_link TEXT,
  deadline TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CROP GUIDES TABLE
CREATE TABLE IF NOT EXISTS public.crop_guides (
  id BIGSERIAL PRIMARY KEY,
  crop_name_en TEXT NOT NULL UNIQUE,
  crop_name_kn TEXT NOT NULL,
  season TEXT NOT NULL,
  soil_type TEXT NOT NULL,
  water_needs TEXT NOT NULL,
  fertilizer_schedule TEXT NOT NULL,
  harvest_time TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_kn TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CALCULATIONS TABLE
CREATE TABLE IF NOT EXISTS public.calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop TEXT NOT NULL,
  season TEXT,
  costs_json JSONB NOT NULL DEFAULT '{}',
  yield_expected NUMERIC NOT NULL,
  unit_price NUMERIC NOT NULL,
  revenue NUMERIC NOT NULL,
  profit NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. DIAGNOSES TABLE
CREATE TABLE IF NOT EXISTS public.diagnoses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  image_url TEXT NOT NULL,
  crop_name TEXT DEFAULT 'Unknown',
  detected_issue TEXT NOT NULL,
  confidence NUMERIC DEFAULT 0,
  diagnosis_en TEXT NOT NULL,
  diagnosis_kn TEXT NOT NULL,
  treatment_en TEXT NOT NULL,
  treatment_kn TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can read market prices" ON public.market_prices FOR SELECT USING (true);
CREATE POLICY "Service role can insert market prices" ON public.market_prices FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read schemes" ON public.schemes FOR SELECT USING (true);
CREATE POLICY "Anyone can read crop guides" ON public.crop_guides FOR SELECT USING (true);

CREATE POLICY "Users can read own calculations" ON public.calculations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calculations" ON public.calculations FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own diagnoses" ON public.diagnoses FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert diagnoses" ON public.diagnoses FOR INSERT WITH CHECK (true);

-- Automatic profile creation on sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, preferred_language)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Raitha'),
    'kn'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
