-- Remove stock column from desserts table and related stock management functions

-- Drop the trigger first
DROP TRIGGER IF EXISTS trigger_reduce_stock ON public.orders;

-- Drop the function used by the trigger
DROP FUNCTION IF EXISTS public.reduce_stock_on_order();

-- Remove the stock column from desserts table
ALTER TABLE public.desserts DROP COLUMN IF EXISTS stock;
