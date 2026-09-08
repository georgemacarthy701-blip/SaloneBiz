-- ============================================================================
-- SALONEBIZ CATEGORY FILTERING & STATUS COMPOSITE INDEXES
-- ============================================================================
-- These indexes accelerate category browsing, status filtering, and sorting,
-- preventing sequential table scans when users filter by industry category.
-- ============================================================================

-- 1. Index on category alone
CREATE INDEX IF NOT EXISTS idx_businesses_category 
  ON public.businesses(category);

-- 2. Composite index on category and status for active listings
CREATE INDEX IF NOT EXISTS idx_businesses_category_status 
  ON public.businesses(category, status);

-- 3. Composite index on category, status, and verification_status
CREATE INDEX IF NOT EXISTS idx_businesses_cat_status_verif 
  ON public.businesses(category, status, verification_status);

-- 4. Composite index covering status and sorting order (featured DESC, created_at DESC)
CREATE INDEX IF NOT EXISTS idx_businesses_status_featured_created 
  ON public.businesses(status, featured DESC, created_at DESC);

-- 5. Full-text search / trigram index for name lookups
CREATE INDEX IF NOT EXISTS idx_businesses_name_trgm 
  ON public.businesses USING gin (name gin_trgm_ops);
