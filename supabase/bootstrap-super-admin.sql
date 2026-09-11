-- Run manually in Supabase SQL Editor after the migrations.
-- First create your account in Authentication > Users > Add user.
-- Replace this placeholder with that account's email. Never put a password in SQL.
do $$
declare owner_email text := 'replace-with-your-email@example.com'; owner_id uuid;
begin
  if owner_email = 'replace-with-your-email@example.com' then
    raise exception 'Replace the placeholder email before running this query.';
  end if;
  select id into owner_id from auth.users where lower(email)=lower(owner_email);
  if owner_id is null then raise exception 'Create this user in Supabase Authentication first.'; end if;
  insert into public.admin_members(user_id,role,active) values(owner_id,'owner',true)
  on conflict(user_id) do update set role='owner',active=true;
end $$;
