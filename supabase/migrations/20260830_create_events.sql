-- ==============================================================================
-- GREViX Database Architecture: Events & Opportunity Catalog
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    organizer VARCHAR(255) DEFAULT 'GREViX Community',
    event_type VARCHAR(50) NOT NULL DEFAULT 'hackathon',
    status VARCHAR(50) NOT NULL DEFAULT 'upcoming',
    theme VARCHAR(255),
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    registration_open BOOLEAN DEFAULT true,
    registration_deadline TIMESTAMPTZ,
    submission_deadline TIMESTAMPTZ,
    mode VARCHAR(50) DEFAULT 'online',
    location VARCHAR(255) DEFAULT 'Online (Global)',
    eligibility TEXT DEFAULT 'Open to all students',
    team_min INT DEFAULT 1,
    team_max INT DEFAULT 4,
    skills TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    prizes JSONB DEFAULT '{"totalValue": "Certificates & Badges", "currency": "N/A"}'::jsonb,
    registration_url TEXT NOT NULL,
    source_name VARCHAR(100) DEFAULT 'verified_admin',
    source_url TEXT,
    image_url TEXT,
    last_verified_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for high-performance filtering & sorting
CREATE INDEX IF NOT EXISTS idx_events_slug ON public.events(slug);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_mode ON public.events(mode);
CREATE INDEX IF NOT EXISTS idx_events_registration_deadline ON public.events(registration_deadline);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.events(start_date);

-- Row Level Security (RLS)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Public can read all published events
CREATE POLICY "Allow public read-only access to published events"
    ON public.events
    FOR SELECT
    USING (true);

-- Only authenticated Admins can insert, update, or delete
CREATE POLICY "Allow admin write access to events"
    ON public.events
    FOR ALL
    TO authenticated
    USING (
        auth.jwt() ->> 'role' IN ('admin', 'super_admin')
    );
