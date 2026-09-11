# Content rules

Use **Loopcodez** in prose and metadata; the visual wordmark is lowercase **loopcodez**. The infinity symbol stands for automation, consistency, and ongoing support. Founders are Umer and Saqlain. Do not invent awards, registrations, clients, or outcome metrics.

The six service names remain AI Agents, Automations, Web Development, App Development, Ecommerce Solutions, and Content Management. Static service/founder copy is in `lib/content/site.ts`; experiments are in `lab.ts`.

Before database setup, `lib/content/projects.ts` supplies approved live work. After setup, the CMS is the source of truth. Seed migrations preserve existing CMS edits. Horizon Hostel was recovered from the friend's merged content; LeadForge remains a draft because no deployed URL was supplied.

Projects need both Live and approval to appear publicly. Featured and display order curate the homepage; the maximum count is configurable. Draft case-study routes are 404 and excluded from the sitemap.

The confirmed contact is **loopcodez@gmail.com**. The footer offers manual email contact. The project form saves through the API and displays success only after a confirmed database response. It must never fall back silently to a mail draft or falsely claim a save.

Set `NEXT_PUBLIC_SITE_URL` to the verified owned production origin before launch. No unconfirmed custom domain or missing social-preview image is assumed.
