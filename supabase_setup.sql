-- ========================================================
-- Japanlog Travel Map: Supabase Database Setup Script
-- Paste and run this script in your Supabase SQL Editor
-- ========================================================

-- 1. Create table for storing per-user travel records
create table if not exists public.user_travel_records (
  user_id uuid primary key references auth.users(id) on delete cascade,
  records jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS)
alter table public.user_travel_records enable row level security;

-- 3. Create RLS Policies for authenticated users
create policy "Users can view their own travel records"
  on public.user_travel_records
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own travel records"
  on public.user_travel_records
  for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own travel records"
  on public.user_travel_records
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- 4. Enable Realtime (Optional)
alter publication supabase_realtime add table public.user_travel_records;
