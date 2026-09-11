-- Loopcodez CMS. Apply to the intended Supabase project using the SQL editor/CLI.
create table if not exists public.admin_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('owner', 'editor')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.admin_members enable row level security;
revoke all on public.admin_members from anon, authenticated;
grant select on public.admin_members to authenticated;
create policy "Members can read their own role" on public.admin_members for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_studio_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from public.admin_members where user_id = (select auth.uid()) and active);
$$;
revoke all on function public.is_studio_admin() from public, anon;
grant execute on function public.is_studio_admin() to authenticated;

create table if not exists public.projects (
  slug text primary key check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  payload jsonb not null check (jsonb_typeof(payload) = 'object'),
  published boolean not null default false,
  featured boolean not null default false,
  sort_order integer not null default 0 check (sort_order between 0 and 9999),
  updated_at timestamptz not null default now(),
  constraint payload_slug_matches check (payload->>'slug' = slug)
);
alter table public.projects enable row level security;
revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon;
grant select, insert, update, delete on public.projects to authenticated;
create policy "Read published projects" on public.projects for select to anon, authenticated using (published);
create policy "Studio manages projects" on public.projects for all to authenticated using ((select public.is_studio_admin())) with check ((select public.is_studio_admin()));
create index if not exists projects_published_order on public.projects(published, sort_order);

create table if not exists public.site_settings (
  id text primary key check (id = 'main'),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
revoke all on public.site_settings from anon, authenticated;
grant select on public.site_settings to anon;
grant select, insert, update on public.site_settings to authenticated;
create policy "Read public site copy" on public.site_settings for select to anon, authenticated using (true);
create policy "Studio inserts settings" on public.site_settings for insert to authenticated with check ((select public.is_studio_admin()));
create policy "Studio edits settings" on public.site_settings for update to authenticated using ((select public.is_studio_admin())) with check ((select public.is_studio_admin()));

create table if not exists public.enquiries (
  id uuid primary key,
  name text not null check (length(name) between 2 and 120),
  email text not null check (length(email) between 3 and 254),
  company text not null default '' check (length(company) <= 160),
  service text not null default '' check (length(service) <= 100),
  budget text not null default '' check (length(budget) <= 100),
  message text not null check (length(message) between 20 and 10000),
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'closed', 'archived')),
  notes text not null default '' check (length(notes) <= 10000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.enquiries enable row level security;
revoke all on public.enquiries from anon, authenticated;
grant select on public.enquiries to authenticated;
grant update (status, notes) on public.enquiries to authenticated;
create policy "Studio reads enquiries" on public.enquiries for select to authenticated using ((select public.is_studio_admin()));
create policy "Studio updates enquiry workflow" on public.enquiries for update to authenticated using ((select public.is_studio_admin())) with check ((select public.is_studio_admin()));
create index if not exists enquiries_created on public.enquiries(created_at desc);

-- Durable, atomic abuse control. Only the server can invoke the submission RPC.
create table if not exists public.enquiry_limits (
  key_hash text not null,
  window_start timestamptz not null,
  count integer not null default 1,
  primary key(key_hash, window_start)
);
alter table public.enquiry_limits enable row level security;
revoke all on public.enquiry_limits from anon, authenticated;

create or replace function public.submit_enquiry(p_id uuid, p_name text, p_email text, p_company text, p_service text, p_budget text, p_message text, p_rate_key text)
returns uuid language plpgsql security definer set search_path = '' as $$
declare current_count integer; bucket timestamptz := date_trunc('hour', now());
begin
  -- A retry after a lost HTTP response must not create duplicate enquiries.
  if exists(select 1 from public.enquiries where id = p_id) then return p_id; end if;
  delete from public.enquiry_limits where window_start < now() - interval '1 day';
  insert into public.enquiry_limits(key_hash, window_start, count) values(p_rate_key, bucket, 1)
  on conflict (key_hash, window_start) do update set count = public.enquiry_limits.count + 1
  returning count into current_count;
  if current_count > 5 then raise exception 'RATE_LIMITED'; end if;
  insert into public.enquiries(id, name, email, company, service, budget, message)
    values(p_id, p_name, lower(p_email), p_company, p_service, p_budget, p_message)
    on conflict (id) do nothing;
  return p_id;
end;
$$;
revoke all on function public.submit_enquiry(uuid,text,text,text,text,text,text,text) from public, anon, authenticated;
grant execute on function public.submit_enquiry(uuid,text,text,text,text,text,text,text) to service_role;

create table if not exists public.admin_activity (
  id bigint generated always as identity primary key,
  actor uuid,
  resource text not null,
  action text not null,
  record_id text,
  created_at timestamptz not null default now()
);
alter table public.admin_activity enable row level security;
revoke all on public.admin_activity from anon, authenticated;
grant select on public.admin_activity to authenticated;
create policy "Studio reads activity" on public.admin_activity for select to authenticated using ((select public.is_studio_admin()));

create or replace function public.studio_updated_at() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = clock_timestamp(); return new; end;
$$;
create trigger projects_updated before update on public.projects for each row execute function public.studio_updated_at();
create trigger settings_updated before update on public.site_settings for each row execute function public.studio_updated_at();
create trigger enquiries_updated before update on public.enquiries for each row execute function public.studio_updated_at();

create or replace function public.studio_audit() returns trigger language plpgsql security definer set search_path = '' as $$
declare record jsonb;
begin
  record := case when TG_OP = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  insert into public.admin_activity(actor,resource,action,record_id) values(auth.uid(),TG_TABLE_NAME,TG_OP,coalesce(record->>'slug',record->>'id',record->>'user_id'));
  if TG_OP = 'DELETE' then return old; end if;
  return new;
end;
$$;
create trigger projects_audit after insert or update or delete on public.projects for each row execute function public.studio_audit();
create trigger settings_audit after insert or update on public.site_settings for each row execute function public.studio_audit();
create trigger enquiries_audit after update on public.enquiries for each row execute function public.studio_audit();

-- First admin: create a user in Supabase Auth, then run the separate bootstrap guide.
-- Membership cannot be self-granted through the browser or the public API.
