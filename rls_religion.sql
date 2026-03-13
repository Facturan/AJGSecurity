-- Enable Row Level Security on the table
ALTER TABLE "RELIGION" ENABLE ROW LEVEL SECURITY;

-- Allow read access for all users (or authenticated users)
CREATE POLICY "Allow select for all users" ON "RELIGION"
    FOR SELECT
    USING (true);

-- Allow insert access for all users (or authenticated users)
CREATE POLICY "Allow insert for all users" ON "RELIGION"
    FOR INSERT
    WITH CHECK (true);

-- Allow update access for all users (or authenticated users)
CREATE POLICY "Allow update for all users" ON "RELIGION"
    FOR UPDATE
    USING (true)
    WITH CHECK (true);

-- Allow delete access for all users (or authenticated users)
CREATE POLICY "Allow delete for all users" ON "RELIGION"
    FOR DELETE
    USING (true);

-- Reload schema cache just in case
NOTIFY pgrst, 'reload schema';
