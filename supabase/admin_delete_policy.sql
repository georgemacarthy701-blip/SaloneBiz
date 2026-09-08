-- ============================================================================
-- SALONEBIZ ADMIN & OWNER BUSINESS DELETION POLICY
-- ============================================================================
-- Ensures only users with the 'admin' role or the listing owner can delete
-- business listings from the database.
-- ============================================================================

-- Ensure the get_user_role() helper exists
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role FROM public.users WHERE id = auth.uid();
  RETURN user_role;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public;

-- Drop old delete policies if present
DROP POLICY IF EXISTS "Business owners can delete their own businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admins and owners can delete businesses" ON public.businesses;

-- Create unified delete policy for Admins and Listing Owners
CREATE POLICY "Admins and owners can delete businesses" 
  ON public.businesses FOR DELETE
  USING (
    (auth.uid() IS NOT NULL AND auth.uid() = owner_id) OR
    (auth.uid() IS NOT NULL AND public.get_user_role() = 'admin')
  );
