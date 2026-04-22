-- Migration to save store layouts
CREATE TABLE IF NOT EXISTS store_layouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    layout_json JSONB NOT NULL,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS for store owners
ALTER TABLE store_layouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their layouts" 
ON store_layouts 
FOR ALL 
TO authenticated 
USING (
    EXISTS (
        SELECT 1 FROM stores 
        WHERE id = store_layouts.store_id 
        AND owner_id = auth.uid()
    )
);

-- Handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_store_layouts_updated_at
    BEFORE UPDATE ON store_layouts
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
