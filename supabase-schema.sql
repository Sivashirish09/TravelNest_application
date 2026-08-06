-- =========================================================================
-- TRAVELNEST AI TRIP PLANNER - COMPLETE SUPABASE POSTGRESQL SCHEMA
-- =========================================================================
-- Instructions: 
-- 1. Open your Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Go to the "SQL Editor" tab from the left sidebar
-- 3. Click "New Query", paste this entire script, and click "Run"
-- =========================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -------------------------------------------------------------------------
-- 1. PROFILES TABLE (Linked with Supabase Auth users)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT DEFAULT 'Travel Explorer',
  display_name TEXT DEFAULT 'Travel Explorer',
  photo_url TEXT,
  phone_number TEXT,
  travel_style TEXT DEFAULT 'Balanced Explorer',
  currency TEXT DEFAULT 'INR (₹)',
  language TEXT DEFAULT 'English',
  role TEXT DEFAULT 'User',
  bio TEXT,
  dietary_preference TEXT,
  preferred_transport TEXT,
  emergency_contact JSONB DEFAULT '{}'::jsonb,
  total_trips INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  total_logins INTEGER DEFAULT 1,
  account_status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all public profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- -------------------------------------------------------------------------
-- 2. BOOKINGS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  booking_reference TEXT NOT NULL UNIQUE,
  destination_id TEXT,
  destination_name TEXT NOT NULL,
  source_city TEXT,
  hotel_name TEXT,
  hotel_or_resort_name TEXT,
  check_in_date DATE,
  check_out_date DATE,
  booking_date DATE DEFAULT CURRENT_DATE,
  nights INTEGER DEFAULT 1,
  guests INTEGER DEFAULT 1,
  room_type TEXT,
  total_amount_inr NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'CONFIRMED', -- CONFIRMED, COMPLETED, CANCELLED
  payment_status TEXT DEFAULT 'PAID',
  payment_method TEXT DEFAULT 'UPI / Card',
  qr_code_url TEXT,
  cancellation_date DATE,
  cancellation_reason TEXT,
  refund_status TEXT,
  special_requests TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS for bookings
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- -------------------------------------------------------------------------
-- 3. TRAVEL MEMORIES TABLE (Journal & Photo log)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memories (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  image_url TEXT NOT NULL,
  journal TEXT,
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all memories" ON public.memories
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their memories" ON public.memories
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

CREATE POLICY "Users can delete their memories" ON public.memories
  FOR DELETE USING (auth.uid() = user_id);

-- -------------------------------------------------------------------------
-- 4. REVIEWS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  destination_id TEXT,
  destination_name TEXT,
  rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  review_text TEXT NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 5. NOTIFICATIONS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'general',
  category TEXT DEFAULT 'Notification',
  title TEXT NOT NULL,
  description TEXT,
  message TEXT,
  booking_id TEXT,
  is_read BOOLEAN DEFAULT false,
  date DATE DEFAULT CURRENT_DATE,
  time TEXT,
  time_category TEXT DEFAULT 'Today',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their notifications" ON public.notifications
  FOR ALL USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- -------------------------------------------------------------------------
-- 6. LOGIN & SESSION AUDIT HISTORY TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.login_history (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT,
  email TEXT NOT NULL,
  login_time TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()),
  logout_time TIMESTAMPTZ,
  device TEXT DEFAULT 'Desktop',
  browser TEXT DEFAULT 'Chrome',
  operating_system TEXT DEFAULT 'Windows',
  ip_address TEXT,
  location TEXT DEFAULT 'India',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users and admins can view login history" ON public.login_history
  FOR SELECT USING (true);

CREATE POLICY "System can record login history" ON public.login_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update login history" ON public.login_history
  FOR UPDATE USING (true);

-- -------------------------------------------------------------------------
-- 7. PAYMENTS TABLE
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_name TEXT,
  user_email TEXT,
  booking_id TEXT,
  amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'UPI / QR Code',
  transaction_id TEXT NOT NULL,
  payment_status TEXT DEFAULT 'SUCCESS',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their payments" ON public.payments
  FOR SELECT USING (true);

CREATE POLICY "Users can record payments" ON public.payments
  FOR INSERT WITH CHECK (true);

-- -------------------------------------------------------------------------
-- 8. AUTOMATIC PROFILE CREATION TRIGGER
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    display_name,
    photo_url,
    phone_number,
    travel_style,
    role,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'fullName', NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'displayName', NEW.raw_user_meta_data->>'fullName', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url',
    COALESCE(NEW.raw_user_meta_data->>'phoneNumber', NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'travelStyle', 'Balanced Explorer'),
    CASE WHEN NEW.email = 'sivashirish09@gmail.com' THEN 'Admin' ELSE COALESCE(NEW.raw_user_meta_data->>'role', 'User') END,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    updated_at = NOW(),
    email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent duplication
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -------------------------------------------------------------------------
-- 9. STORAGE BUCKET FOR MEMORIES
-- -------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memories', 'memories', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for memories bucket
CREATE POLICY "Public Access for memories bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'memories');

CREATE POLICY "Authenticated Upload for memories bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'memories');

-- =========================================================================
-- Schema setup complete!
-- =========================================================================
