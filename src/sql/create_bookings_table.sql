
-- Create bookings table
CREATE TABLE IF NOT EXISTS public.asset_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES public.assets(id) ON DELETE CASCADE NOT NULL,
  employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  purpose TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  return_info JSONB,
  
  -- Ensure start date is before end date
  CONSTRAINT start_before_end CHECK (start_date < end_date)
);

-- Add index on asset_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_asset_bookings_asset_id ON public.asset_bookings(asset_id);

-- Add index on employee_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_asset_bookings_employee_id ON public.asset_bookings(employee_id);

-- Add index on start_date for faster queries
CREATE INDEX IF NOT EXISTS idx_asset_bookings_start_date ON public.asset_bookings(start_date);

-- Add index on end_date for faster queries
CREATE INDEX IF NOT EXISTS idx_asset_bookings_end_date ON public.asset_bookings(end_date);

-- Add index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_asset_bookings_status ON public.asset_bookings(status);

-- Add isPoolDevice column to assets table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'assets' AND column_name = 'is_pool_device'
  ) THEN
    ALTER TABLE public.assets ADD COLUMN is_pool_device BOOLEAN DEFAULT false;
  END IF;
END
$$;
