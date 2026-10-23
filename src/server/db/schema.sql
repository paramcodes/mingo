-- Supabase Postgres Schema & Row Level Security Policies

-- 1. Learners Profile Table
CREATE TABLE IF NOT EXISTS public.learners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  target_course TEXT DEFAULT 'es-en',
  daily_goal_minutes INTEGER DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES public.learners(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  accuracy INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(learner_id, lesson_id)
);

-- 3. Spaced Repetition Reviews Table
CREATE TABLE IF NOT EXISTS public.concept_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learner_id UUID NOT NULL REFERENCES public.learners(id) ON DELETE CASCADE,
  concept_id TEXT NOT NULL,
  repetitions INTEGER NOT NULL DEFAULT 0,
  interval_days REAL NOT NULL DEFAULT 1.0,
  ease_factor REAL NOT NULL DEFAULT 2.5,
  last_reviewed_at TIMESTAMPTZ DEFAULT NOW(),
  next_review_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 day',
  UNIQUE(learner_id, concept_id)
);

-- Enable Row Level Security
ALTER TABLE public.learners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.concept_reviews ENABLE ROW LEVEL SECURITY;

-- Policies: learners can only read/write their own records
CREATE POLICY "Learners can manage own profile" ON public.learners
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Learners can manage own progress" ON public.progress
  FOR ALL USING (auth.uid() = learner_id);

CREATE POLICY "Learners can manage own reviews" ON public.concept_reviews
  FOR ALL USING (auth.uid() = learner_id);
