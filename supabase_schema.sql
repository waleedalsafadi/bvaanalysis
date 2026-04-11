-- Create a table for Actuals
CREATE TABLE actuals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    month VARCHAR(20),
    department VARCHAR(100),
    account VARCHAR(255),
    amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a table for Budgets
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),
    month VARCHAR(20),
    department VARCHAR(100),
    account VARCHAR(255),
    amount NUMERIC,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) if you plan to use authentication
ALTER TABLE actuals ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

-- Create policies to allow standard anonymous read/write (For testing purposes)
-- NOTE: In production, you should restrict this to authenticated users only.
CREATE POLICY "Allow anonymous read access on actuals" ON actuals FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on actuals" ON actuals FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous read access on budgets" ON budgets FOR SELECT USING (true);
CREATE POLICY "Allow anonymous insert access on budgets" ON budgets FOR INSERT WITH CHECK (true);
