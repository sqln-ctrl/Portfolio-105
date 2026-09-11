# Manual Supabase setup

Nothing in this folder runs automatically during install, development, or deployment. No hosted database was created or modified. You will run these files yourself.

## Apply in this order

1. Create your Supabase project. Keep its database password private.
2. Open SQL Editor and run `migrations/202609100001_studio_cms.sql` once. It creates tables, row level security, contact submission protection, and audit triggers.
3. Run `migrations/202609100002_seed_content.sql`. It imports the six recovered projects and default copy. Three projects are published and three remain drafts. Existing matching rows are preserved.
4. Run `migrations/202609110001_super_admin.sql` once. It adds server-only helpers for the super-admin screen.
5. Create your own email/password account in Authentication → Users. Create the account without sending an invitation if you are managing credentials yourself.
6. Open `bootstrap-super-admin.sql`, replace its email placeholder, and run it. This grants that user the `owner` role, labelled **Super admin** in the site.
7. Optionally run `verify-permissions.sql`. All reported permission-check booleans should be true. Review the listed policies too.
8. Copy `.env.example` to the ignored `.env.local` and fill in the project URL, publishable key, and server secret key. Restart Next.js.
9. Visit `/admin` and sign in. Submit a synthetic enquiry from `/contact`, confirm it appears, and test saving a draft, publishing it, changing order, changing homepage count, and editing copy.

The schema and role migrations are versioned migrations, not scripts to run repeatedly: existing policy/trigger names will produce errors if reapplied. The seed is safe to rerun because it does not overwrite existing rows. For an existing populated schema, review and reconcile it before applying these files.

## Roles

| Site label | Database role | Permissions |
| --- | --- | --- |
| Super admin | `owner` | All content and enquiry tools; add admins; disable/restore admin access |
| Admin | `editor` | All content, project, case-study, site-copy, enquiry, and activity tools; no team-access endpoint |

Super admins are created only through the manual bootstrap query. The site cannot create, disable, or demote super admins. A regular admin cannot self-promote through the API or direct Supabase access. Disabling an admin leaves their records intact and prevents subsequent authorised requests.

In **Team access**, a super admin can create a new admin using an email and password of at least 12 characters, or add an existing Auth user by email without changing their password. No invitation email is sent. Share login details privately. If account creation succeeds but the membership write fails, retry with the same email to complete membership creation.

## Environment

| Variable | Where it belongs |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL; safe to be public |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key; safe to be public with RLS enabled |
| `SUPABASE_SECRET_KEY` | Server secret key, or legacy service-role key; server only |

Do not paste secret keys into chat, SQL files, source control, or screenshots. The server secret is used for guarded enquiry submission and super-admin operations. Browser content editing uses the signed-in user's RLS permissions.

Configure email/password authentication and disable public sign-ups for this private workspace. The site has no public registration page. Account recovery and password changes are managed in your Supabase dashboard. Prefer separate Supabase projects for development and production.

## Data and operations

- `projects`: JSON content plus searchable publication, featured, and ordering fields.
- `site_settings`: singleton copy and homepage count.
- `enquiries`: project briefs, workflow status, and private notes.
- `admin_members`: explicit access allowlist.
- `enquiry_limits`: hashed request-source buckets, automatically pruned during submissions after one day. Raw IP addresses are not saved by this application.
- `admin_activity`: change metadata, without passwords or enquiry message bodies. Server-admin membership changes may have a null actor.

Review backup/export options in the Supabase dashboard before launch. Decide how long your studio needs to retain enquiries and remove old records manually under that policy. There is no automatic deletion job.

Official references: [API keys](https://supabase.com/docs/guides/getting-started/api-keys), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [server-side auth](https://supabase.com/docs/guides/auth/server-side/creating-a-client), [Vercel request headers](https://vercel.com/docs/headers/request-headers).
