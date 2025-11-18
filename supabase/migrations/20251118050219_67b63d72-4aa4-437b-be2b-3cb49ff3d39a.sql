-- Create enum for comment status
CREATE TYPE comment_status AS ENUM ('approved', 'pending', 'removed');

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  message TEXT NOT NULL,
  status comment_status NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read approved comments
CREATE POLICY "Anyone can read approved comments"
  ON public.comments
  FOR SELECT
  USING (status = 'approved');

-- Allow anyone to insert comments (will be approved by default for now)
CREATE POLICY "Anyone can insert comments"
  ON public.comments
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster queries by item_id
CREATE INDEX idx_comments_item_id ON public.comments(item_id);

-- Create index for status filtering
CREATE INDEX idx_comments_status ON public.comments(status);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create data sources configuration table for caching
CREATE TABLE public.data_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  last_fetch_success TIMESTAMPTZ,
  last_fetch_error TEXT,
  item_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS for data sources
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read data sources status
CREATE POLICY "Anyone can read data sources"
  ON public.data_sources
  FOR SELECT
  USING (true);

-- Create trigger for data_sources updated_at
CREATE TRIGGER update_data_sources_updated_at
  BEFORE UPDATE ON public.data_sources
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();