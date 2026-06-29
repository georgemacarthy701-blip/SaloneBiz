-- Add verification columns to businesses table
ALTER TABLE public.businesses
ADD COLUMN IF NOT EXISTS verification_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (verification_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.users(id);

-- Update status constraint
ALTER TABLE public.businesses
DROP CONSTRAINT IF EXISTS businesses_status_check;

ALTER TABLE public.businesses
ADD CONSTRAINT businesses_status_check
  CHECK (status IN ('active', 'inactive', 'pending'));

-- Create indexes for admin filtering
CREATE INDEX IF NOT EXISTS idx_businesses_verification_status ON public.businesses(verification_status);
CREATE INDEX IF NOT EXISTS idx_businesses_verified_at ON public.businesses(verified_at);

-- Update RLS policies to restrict pending businesses
DROP POLICY IF EXISTS "Everyone can read active businesses" ON public.businesses;

CREATE POLICY "Read public businesses" ON public.businesses FOR SELECT
  USING (
    verification_status = 'approved' OR
    auth.uid() = owner_id OR
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );

-- Admin can approve/reject businesses
CREATE POLICY "Admins can update verification" ON public.businesses FOR UPDATE
  USING (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
  );
