-- Optional liquidity beyond operating cash (planning-only fields).

alter table public.user_finance
  add column if not exists accounts_receivable numeric not null default 0;

alter table public.user_finance
  add column if not exists monthly_debt_service numeric not null default 0;

alter table public.user_finance
  add column if not exists ar_collectibility_pct numeric not null default 50;
