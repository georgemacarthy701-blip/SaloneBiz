-- ============================================================================
-- SALONEBIZ RLS POLICY PERFORMANCE OPTIMIZATION
-- ============================================================================
-- This migration optimizes the performance of the Row-Level Security (RLS)
-- policies on the 'businesses' table.
--
-- The previous RLS policies queried the 'public.users' table for every single
-- row scanned by executing a subquery (SELECT role FROM public.users...).
-- This causes O(N) database scans on every fetch, drastically slowing down
-- listings retrieval.
--
-- Solution:
-- 1. Create a STABLE security definer helper function 'get_user_role()'
--    to look up the user's role. Marking it STABLE caches the results within
--    a query transaction so it is only evaluated once (O(1)) instead of per-row.
-- 2. Restructure the RLS policies to use short-circuit logic:
--    An anonymous visitor (auth.uid() IS NULL) will never execute the role check.
-- ============================================================================

-- 1. Create the STABLE role checking helper function
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Perform a cached lookup of the role
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- 2. Optimize the "Read public businesses" policy
DROP POLICY IF EXISTS "Read public businesses" ON public.businesses;

CREATE POLICY "Read public businesses" ON public.businesses FOR SELECT
  USING (
    verification_status = 'approved' OR
    (auth.uid() IS NOT NULL AND (
      auth.uid() = owner_id OR
      public.get_user_role() = 'admin'
    ))
  );

-- 3. Optimize the "Admins can update verification" policy
DROP POLICY IF EXISTS "Admins can update verification" ON public.businesses;

CREATE POLICY "Admins can update verification" ON public.businesses FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND public.get_user_role() = 'admin'
  )
  WITH CHECK (
    auth.uid() IS NOT NULL AND public.get_user_role() = 'admin'
  );
