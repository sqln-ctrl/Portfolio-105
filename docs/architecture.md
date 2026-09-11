# Architecture

## Marketing

Next.js App Router renders meaningful copy in HTML. `SiteShell` owns the shared header, footer, loader, navigation curtain, and Lenis. Admin routes use a separate shell. `PageEnter` animates headings and chapters without transforming the page wrapper, so sticky elements continue to work.

`LoopHome` composes the homepage. `LoopHero` owns intro/scroll copy animation; its dynamically loaded `LoopScene` owns Three.js resources. Inner pages use `InnerHero`, service sculptures, an editorial work archive, founder monograms, and a split contact layout. No decorative grid or numerical section labels are used.

Public routes: `/`, `/work`, `/work/[slug]`, `/services`, `/about`, `/lab`, `/contact`. `/notes` redirects to the lab. Unknown and unpublished case studies return 404.

## Content flow

`lib/content/project-store.ts` queries Supabase using the publishable client and RLS. Published work is sorted by display order and slug. Homepage selection additionally requires Featured and obeys the configurable maximum count. Zero hides the work chapter without leaving an empty block.

When Supabase is unconfigured, curated local seeds are used. Once configured, a query failure returns no projects instead of resurrecting hidden content from seed data. Public copy can fall back to validated defaults. React cache deduplicates reads within a request; database fetches use no-store so admin changes are visible on the next page load.

Project cover URLs use browser image loading. Live previews embed public HTTPS project URLs in sandboxed iframes; third-party frame restrictions can require a cover image instead. Live-site and case-study actions occupy separate positions.

## Admin and authentication

`/admin` uses Supabase Auth and an explicit active `admin_members` allowlist. `proxy.ts` refreshes session cookies; every admin route handler independently verifies the user and membership. Middleware is not the security boundary.

Regular admin data calls use the user's session client and RLS. Super-admin membership operations also require role `owner`, then use a server-only secret client. The UI labels database role `editor` as Admin and `owner` as Super admin.

An unconfigured development build can expose the read-only interface preview. Production cannot enable it, even with the query parameter.

## API contracts

| Route | Access | Purpose |
| --- | --- | --- |
| POST /api/enquiries | Public, guarded | Validate and save one project enquiry |
| POST /api/admin/login, /logout | Same origin | Start/end the studio session |
| /api/admin/projects | Active admin | Draft/publish project payloads; version conflict protection |
| /api/admin/settings | Active admin | Site copy and homepage maximum; version conflict protection |
| /api/admin/enquiries | Active admin | Paginated inbox; status/private notes |
| /api/admin/activity | Active admin | Recent change metadata |
| /api/admin/members | Super admin | List, add, disable, restore regular admins |

Mutations check browser origin, bounded JSON bodies, and Zod schemas. Errors omit credentials and provider details. Project and settings updates use timestamps to reject stale edits with a conflict instead of silently overwriting newer work.

Contact submission uses a service-only database function with UUID idempotency and an atomic five-per-hour rate bucket. Vercel's trusted request-source header is HMAC-hashed; raw addresses are not stored. Outside Vercel, the local development bucket is shared. Retargeting to another host requires adapting that trusted source.

## Retained code

Some unused components and historical 3D code remain because the checkout contained uncommitted founder work before this task. The current homepage does not import the old hero/grid/number object. Avoid treating retained files as the active design system.
