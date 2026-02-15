
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS: users can read their own roles
CREATE POLICY "Users can read own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Admins can read all roles
CREATE POLICY "Admins can read all roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Desserts table
CREATE TABLE public.desserts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image_url TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 200,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.desserts ENABLE ROW LEVEL SECURITY;

-- Anyone can read desserts
CREATE POLICY "Anyone can read desserts" ON public.desserts
  FOR SELECT USING (true);

-- Only admins can update desserts
CREATE POLICY "Admins can update desserts" ON public.desserts
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert desserts" ON public.desserts
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  dessert_id UUID REFERENCES public.desserts(id) NOT NULL,
  dessert_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_amount NUMERIC NOT NULL,
  transaction_id TEXT NOT NULL,
  transaction_status TEXT NOT NULL DEFAULT 'pending',
  serving_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (public ordering)
CREATE POLICY "Anyone can insert orders" ON public.orders
  FOR INSERT WITH CHECK (true);

-- Anyone can read their own order by order_id (we'll handle this via edge function)
-- Admins can read all orders
CREATE POLICY "Admins can read all orders" ON public.orders
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can update orders
CREATE POLICY "Admins can update orders" ON public.orders
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Function to generate unique 4-digit order ID
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN;
BEGIN
  done := FALSE;
  WHILE NOT done LOOP
    new_id := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    done := NOT EXISTS (SELECT 1 FROM public.orders WHERE order_id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$;

-- Trigger to auto-generate order_id
CREATE OR REPLACE FUNCTION public.set_order_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
    NEW.order_id := public.generate_order_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_order_id
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_id();

-- Function to reduce stock on order
CREATE OR REPLACE FUNCTION public.reduce_stock_on_order()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.desserts
  SET stock = stock - NEW.quantity
  WHERE id = NEW.dessert_id AND stock >= NEW.quantity;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_reduce_stock
  AFTER INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.reduce_stock_on_order();

-- Seed desserts
INSERT INTO public.desserts (name, description, price, image_url, stock) VALUES
('Basundi', 'Soft, from karimnagar. Melt-in-your-mouth perfection.', 39, '/placeholder.svg', 200),
('Khaddukakheer', 'Delicate cottage cheese patties in saffron-infused creamy milk.', 69, '/placeholder.svg', 200),
('Double Kameta', 'A perfect Hyderabad desert.', 59, '/placeholder.svg', 200);
