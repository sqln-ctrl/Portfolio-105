-- Optional read-only verification. Run manually after all migrations.
-- This checks grants and RLS configuration; it does not replace signed-in workflow testing.
select tablename, rowsecurity
from pg_tables where schemaname='public'
and tablename in ('projects','site_settings','enquiries','enquiry_limits','admin_members','admin_activity');

select
  has_table_privilege('anon','public.projects','SELECT') as public_can_read_published_projects,
  not has_table_privilege('anon','public.enquiries','SELECT') as public_cannot_read_enquiries,
  not has_table_privilege('anon','public.enquiries','INSERT') as public_cannot_bypass_submission_api,
  not has_table_privilege('authenticated','public.admin_members','INSERT') as members_cannot_grant_access,
  not has_table_privilege('authenticated','public.admin_members','UPDATE') as members_cannot_change_roles,
  not has_function_privilege('authenticated','public.studio_member_directory()','EXECUTE') as directory_requires_server,
  not has_function_privilege('anon','public.submit_enquiry(uuid,text,text,text,text,text,text,text)','EXECUTE') as submission_requires_server;
-- Every boolean above should be true. All six tables should show rowsecurity=true.

select policyname, tablename, roles, cmd, qual, with_check
from pg_policies where schemaname='public' order by tablename,policyname;
