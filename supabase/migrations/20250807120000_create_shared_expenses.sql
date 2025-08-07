CREATE TABLE shared_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    description TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    date DATE NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    participants JSONB, -- Store array of participant user IDs or emails
    user_share NUMERIC(10, 2)
);

ALTER TABLE shared_expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own shared expenses" ON shared_expenses
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own shared expenses" ON shared_expenses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own shared expenses" ON shared_expenses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own shared expenses" ON shared_expenses
FOR DELETE USING (auth.uid() = user_id);
