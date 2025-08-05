-- Enable RLS on chat_usage table that was missing RLS
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_usage
CREATE POLICY "Users can view their own usage" 
ON public.chat_usage 
FOR SELECT 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update their own usage" 
ON public.chat_usage 
FOR UPDATE 
USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert their own usage" 
ON public.chat_usage 
FOR INSERT 
WITH CHECK (auth.uid()::text = user_id);