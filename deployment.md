# Deploying Loopcodez to Vercel

The site remains a Next.js/Vercel project. Database setup is manual, using [supabase/README.md](supabase/README.md). No Supabase project, production deployment, DNS record, or production setting has been changed by this work.

## Prerequisites

Use Node.js **24** as declared in `package.json` and `.nvmrc`. Apply all three SQL migrations and the super-admin bootstrap to your intended Supabase project before connecting the site. Use separate development and production databases where possible.

## Environment variables

| Variable | Value / handling |
| --- | --- |
| NEXT_PUBLIC_SITE_URL | Verified production origin, without trailing slash |
| NEXT_PUBLIC_CONTACT_EMAIL | Optional public studio-email override; default loopcodez@gmail.com |
| NEXT_PUBLIC_SUPABASE_URL | Supabase project URL |
| NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY | Public project key |
| SUPABASE_SECRET_KEY | Server-only secret key or legacy service-role key |

Use ignored `.env.local` locally and Vercel's environment settings for deployment. Never put the secret in a NEXT_PUBLIC variable. Public variables are compiled at build time; redeploy after changing them.

## Deploy

1. Run `npm ci`, `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build` with Node 24.
2. Connect the intended repository to Vercel with the Next.js preset and Node 24 runtime. Keep the normal build command and package lock.
3. Set environment variables in the correct Preview/Production scopes. Do not point test previews at customer data.
4. Create a preview through your normal Git/Vercel workflow.
5. Review desktop and phone pages, transitions, project previews, and the contact form.
6. Sign in as super admin, add a test admin, and verify that the regular admin cannot access Team access or its API.
7. Publish a test draft, reorder/feature it, change the homepage count, and submit a synthetic enquiry. Confirm it appears only in the private inbox.
8. Verify canonical URLs, sitemap, robots, and the intended public domain before production promotion.

## Operations and rollback

Vercel's filesystem is not the content database. Projects, copy, enquiries, and roles persist in Supabase. Do not revive the friend's local `.data/*.json` admin storage.

Use Vercel deployment history to restore a known good application deployment. Database changes are separate: take a backup before schema changes, preserve content, and review compatibility before rollback. These initial migrations do not include destructive rollback scripts.

The form has no email-delivery integration; it stores the brief in the admin inbox. Check that inbox regularly. External iframe previews depend on each project's frame policy; provide a cover URL when needed. Review Supabase backups, retention, authentication settings, and account recovery before launch.

Official references: [Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [environment variables](https://vercel.com/docs/environment-variables).
