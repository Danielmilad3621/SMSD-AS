-- Add RLS policy for allowed_users table
-- Only allow reading via the security definer function, not direct table access
-- This policy allows no direct access - all checks go through is_user_allowed function
CREATE POLICY "No direct access to allowed_users"
ON public.allowed_users
FOR SELECT
TO authenticated
USING (false);