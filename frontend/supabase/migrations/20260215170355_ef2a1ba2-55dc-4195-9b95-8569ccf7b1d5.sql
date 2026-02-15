
-- Drop the overly permissive insert policy and replace with a more specific one
DROP POLICY "Anyone can insert orders" ON public.orders;

-- Allow anonymous and authenticated users to insert orders, but only with valid data
CREATE POLICY "Public can place orders" ON public.orders
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND
    phone IS NOT NULL AND
    transaction_id IS NOT NULL AND
    dessert_id IS NOT NULL
  );
