-- Add rating (1-10) and optional tags to hangouts
ALTER TABLE hangouts ADD COLUMN IF NOT EXISTS rating integer CHECK (rating >= 1 AND rating <= 10);
ALTER TABLE hangouts ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';
