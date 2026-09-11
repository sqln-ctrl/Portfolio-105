# Studio workspace

Open `/admin` after the [manual Supabase setup](../supabase/README.md).

## Roles

Admins can manage all website content, projects, case studies, enquiries, and activity. Super admins have the same tools plus **Team access**. Only super admins can add or disable regular admins; the backend enforces this even if someone manually calls the endpoint.

Create the first super admin using the supplied bootstrap query. Team access creates regular admins only. Existing Auth accounts keep their passwords; new accounts need a password of at least 12 characters. Credentials are shared privately, without an automatic invitation email.

## Projects

Create a project with a stable URL slug, title, service/category, role, year, and short description. Add any public HTTPS live URL, including Vercel or another host. Add a cover-image URL if embedding is blocked or if a curated still better represents the work.

A project becomes public only when its status is Live **and** content approval is checked. Draft hides a project without deleting it. Slugs are locked after creation to preserve links.

Feature selects a homepage candidate. Display order controls its position (lower first); Site content's maximum controls how many candidates are shown. Public pages never display the ordering number.

## Case studies

Use the default problem/insight/approach/design/results chapters, or add your own chapters. Custom chapters replace the default chapters and can be renamed, moved up/down, or removed. Choose text, title beside text, or large-statement layout. Content is plain text; blank lines separate paragraphs. Arbitrary HTML and scripts are not accepted.

## Site content

Edit the studio tagline, hero overline, hero lines and description, work heading, studio statement, footer invitation, and homepage project count. Save explicitly. Unsaved changes warn before leaving; stale saves are rejected if another admin saved a newer version.

## Enquiries

Briefs submitted on the site appear here only after the database confirms saving them. Search/filter the current page of 50 records, paginate, and refresh. Open a brief, update its status, and add private notes. Archive removes it from an active workflow without deleting its history. The reply link can open your own email app; the visitor's submission never does.

There is no automatic email notification service, file upload, arbitrary CSS editor, or analytics dashboard. The activity log records saved changes; it does not expose passwords or enquiry bodies.
