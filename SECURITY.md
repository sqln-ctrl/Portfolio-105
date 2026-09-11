# Security and access

Project setup is manual. Read [supabase/README.md](supabase/README.md) before connecting credentials or applying SQL. Do not disable RLS to fix an access error.

Private routes require verified Supabase authentication and active membership. Super-admin team operations additionally require the owner role. Regular admins cannot grant membership through the browser, API, or table privileges.

Keep `.env.local`, server keys, account passwords, tokens, and personal enquiry exports out of source control, logs, and screenshots. Public keys are safe only with the supplied RLS policies in place. The service key is imported only by server code.

Contact writes validate input, enforce body limits, check origin, and use a service-only idempotent database function with rate buckets. Enquiry data is private. Case-study content is rendered as plain text rather than injected HTML.

Before launch, manually test both roles, anonymous access, draft visibility, enquiry submission, session logout, and disabled membership. Permission queries in `supabase/verify-permissions.sql` check configuration; they do not replace these signed-in tests.

Report a suspected issue privately to loopcodez@gmail.com. Do not include production credentials or customer messages in public issues. If a key is exposed, rotate it through Supabase and replace the corresponding Vercel environment variable before redeploying.
