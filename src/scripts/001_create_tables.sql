-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  grade TEXT DEFAULT '12th',
  school TEXT,
  city TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quiz_results table to store quiz responses
CREATE TABLE IF NOT EXISTS public.quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  answer_score INTEGER NOT NULL CHECK (answer_score >= 1 AND answer_score <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create career_recommendations table
CREATE TABLE IF NOT EXISTS public.career_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  realistic_score INTEGER DEFAULT 0,
  investigative_score INTEGER DEFAULT 0,
  artistic_score INTEGER DEFAULT 0,
  social_score INTEGER DEFAULT 0,
  enterprising_score INTEGER DEFAULT 0,
  conventional_score INTEGER DEFAULT 0,
  primary_interest TEXT,
  secondary_interest TEXT,
  recommended_careers TEXT[],
  recommended_courses TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for quiz_results
CREATE POLICY "quiz_results_select_own" ON public.quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "quiz_results_insert_own" ON public.quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "quiz_results_update_own" ON public.quiz_results FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "quiz_results_delete_own" ON public.quiz_results FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for career_recommendations
CREATE POLICY "career_recommendations_select_own" ON public.career_recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "career_recommendations_insert_own" ON public.career_recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "career_recommendations_update_own" ON public.career_recommendations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "career_recommendations_delete_own" ON public.career_recommendations FOR DELETE USING (auth.uid() = user_id);
