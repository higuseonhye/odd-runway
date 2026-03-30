-- Enable Supabase Auth → Anonymous sign-in before using client sync.

create table if not exists public.user_finance (
  user_id uuid primary key references auth.users (id) on delete cascade,
  cash_on_hand numeric not null,
  monthly_burn numeric not null,
  monthly_revenue numeric not null,
  mom_growth_pct numeric not null,
  updated_at timestamptz not null default now()
);

alter table public.user_finance enable row level security;

create policy "user_finance_select_own"
  on public.user_finance for select
  using (auth.uid() = user_id);

create policy "user_finance_insert_own"
  on public.user_finance for insert
  with check (auth.uid() = user_id);

create policy "user_finance_update_own"
  on public.user_finance for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
