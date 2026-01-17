-- Address Book for Buyers
CREATE TABLE IF NOT EXISTS public.user_addresses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    label TEXT, -- Home, Work, etc
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    country TEXT DEFAULT 'MX',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users view own addresses" ON public.user_addresses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own addresses" ON public.user_addresses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own addresses" ON public.user_addresses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users delete own addresses" ON public.user_addresses
FOR DELETE USING (auth.uid() = user_id);

-- Trigger to handle 'is_default' logic (Ensure only one true per user)
CREATE OR REPLACE FUNCTION public.handle_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default THEN
        UPDATE public.user_addresses
        SET is_default = FALSE
        WHERE user_id = NEW.user_id AND id <> NEW.id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_default_address
BEFORE INSERT OR UPDATE ON public.user_addresses
FOR EACH ROW
WHEN (NEW.is_default = TRUE)
EXECUTE FUNCTION public.handle_default_address();
