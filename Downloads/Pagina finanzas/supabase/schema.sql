-- ═══════════════════════════════════════════════════════════
--  Saldo – Finanzas personales  ·  Supabase schema
--  Ejecutar en: Supabase Dashboard → SQL Editor → New query
-- ═══════════════════════════════════════════════════════════

-- ── Profiles (extends auth.users) ──────────────────────────
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  name       text,
  email      text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_own" on public.profiles
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ── Categories ──────────────────────────────────────────────
create table if not exists public.categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  name       text not null,
  icon       text not null default 'cart',
  color      text not null default '#888888',
  type       text not null check (type in ('expense', 'income')),
  budget     numeric default 0,
  position   integer default 0,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "cats_select" on public.categories for select using (auth.uid() = user_id);
create policy "cats_insert" on public.categories for insert with check (auth.uid() = user_id);
create policy "cats_update" on public.categories for update using (auth.uid() = user_id);
create policy "cats_delete" on public.categories for delete using (auth.uid() = user_id);

-- ── Transactions ─────────────────────────────────────────────
create table if not exists public.transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  type        text not null check (type in ('expense', 'income')),
  amount      numeric not null check (amount > 0),
  category_id uuid references public.categories(id) on delete set null,
  name        text not null,
  note        text,
  date        date not null,
  created_at  timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "txs_select" on public.transactions for select using (auth.uid() = user_id);
create policy "txs_insert" on public.transactions for insert with check (auth.uid() = user_id);
create policy "txs_update" on public.transactions for update using (auth.uid() = user_id);
create policy "txs_delete" on public.transactions for delete using (auth.uid() = user_id);

-- ── Default categories for new users ─────────────────────────
create or replace function public.create_default_categories(uid uuid)
returns void language plpgsql security definer as $$
begin
  insert into public.categories (user_id, name, icon, color, type, budget, position) values
    (uid, 'Supermercado',   'cart',      '#2f9e6f', 'expense', 350, 1),
    (uid, 'Restaurantes',   'utensils',  '#f0883e', 'expense', 200, 2),
    (uid, 'Transporte',     'car',       '#4b8df0', 'expense', 130, 3),
    (uid, 'Vivienda',       'house',     '#7c6cf0', 'expense', 900, 4),
    (uid, 'Ocio',           'film',      '#e85ca0', 'expense', 100, 5),
    (uid, 'Salud',          'heart',     '#ef5b6b', 'expense',  80, 6),
    (uid, 'Compras',        'bag',       '#d4a23a', 'expense', 200, 7),
    (uid, 'Suscripciones',  'repeat',    '#00b3c4', 'expense',  60, 8),
    (uid, 'Café',           'coffee',    '#b07a4f', 'expense',  50, 9),
    (uid, 'Servicios',      'bolt',      '#6aa84f', 'expense', 160, 10),
    (uid, 'Nómina',         'wallet',    '#11a36b', 'income',    0, 11),
    (uid, 'Freelance',      'briefcase', '#4b8df0', 'income',    0, 12),
    (uid, 'Otros ingresos', 'gift',      '#7c6cf0', 'income',    0, 13);
end;
$$;

-- ── Trigger: on new user → create profile + default categories ──
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name, email) values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name',
      split_part(new.email, '@', 1)
    ),
    new.email
  );
  perform public.create_default_categories(new.id);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
