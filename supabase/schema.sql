-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL DEFAULT '',
  cover_image_url TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  reading_time_minutes INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL
);

-- Article <-> Tags join table
CREATE TABLE IF NOT EXISTS article_tags (
  article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Newsletter subscribers
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  confirmed BOOLEAN NOT NULL DEFAULT false,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ
);

-- Auto-update updated_at on articles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Public can read published articles and all tags
CREATE POLICY "Public read published articles" ON articles
  FOR SELECT USING (published = true);

CREATE POLICY "Public read tags" ON tags
  FOR SELECT USING (true);

CREATE POLICY "Public read article_tags" ON article_tags
  FOR SELECT USING (true);

-- Service role can do everything (for admin API routes)
CREATE POLICY "Service role full access articles" ON articles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access tags" ON tags
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access article_tags" ON article_tags
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access subscribers" ON subscribers
  FOR ALL USING (auth.role() = 'service_role');

-- Seed: insert default tags
INSERT INTO tags (name, slug) VALUES
  ('System Design', 'system-design'),
  ('Database Internals', 'database-internals'),
  ('DSA', 'dsa'),
  ('Backend', 'backend'),
  ('Distributed Systems', 'distributed-systems'),
  ('Architecture', 'architecture')
ON CONFLICT (slug) DO NOTHING;
