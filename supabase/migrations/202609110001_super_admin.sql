-- Apply manually after the two initial migrations. Never expose these RPCs to the browser.
create or replace function public.studio_member_directory()
returns table(user_id uuid, email text, role text, active boolean)
language sql security definer set search_path = '' as $$
  select m.user_id, u.email::text, m.role, m.active
  from public.admin_members m join auth.users u on u.id=m.user_id order by m.created_at;
$$;
create or replace function public.studio_find_auth_user(p_email text)
returns uuid language sql security definer set search_path = '' as $$
  select id from auth.users where lower(email)=lower(p_email) limit 1;
$$;
revoke all on function public.studio_member_directory() from public, anon, authenticated;
revoke all on function public.studio_find_auth_user(text) from public, anon, authenticated;
grant execute on function public.studio_member_directory() to service_role;
grant execute on function public.studio_find_auth_user(text) to service_role;

-- Audit access changes without recording credentials.
create trigger membership_audit after insert or update or delete on public.admin_members
for each row execute function public.studio_audit();
