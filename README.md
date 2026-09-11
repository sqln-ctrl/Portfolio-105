# Loopcodez

An independent design and development studio by Umer and Saqlain. The Open Loop identity combines a glass infinity mark, floating crystals, editorial typography, and connected motion.

## Run

Use **Node.js 24** (see `.nvmrc`). The current Supabase SDK requires Node 22 or newer.

```sh
npm ci
npm run dev
```

The public site works with the curated seed content before Supabase is connected. `/admin?preview=1` gives a development-only interface preview with saves disabled. It is never an authentication bypass in production.

## Database setup is manual

All SQL, initial content, role setup, and verification queries are in [supabase/](supabase/README.md). Nothing applies them automatically. After you run them and add credentials to the ignored `.env.local`, `/admin` uses Supabase authentication and the contact form saves to the private enquiry inbox. Without configuration, submissions return a clear unavailable message and preserve the brief.

## Checks

```sh
npm run lint
npx tsc --noEmit
npm test
npm run build
```

With an unconfigured local app running, `npm run check:api` checks unauthorised access and enquiry failure behaviour. It intentionally refuses configured projects and non-local targets.

## Documentation

- [Design](design.md) and [reference review](docs/references.md)
- [Architecture](docs/architecture.md) and [motion](docs/motion.md)
- [Admin guide](docs/admin.md) and [content rules](docs/content.md)
- [Manual database setup](supabase/README.md)
- [Vercel deployment](deployment.md)
- [Git investigation](docs/git-sync.md)
- [QA evidence](docs/qa.md)
- [Agent instructions](AGENTS.md) and [changelog](CHANGELOG.md)

The confirmed studio contact is **loopcodez@gmail.com**. Project submission does not open an email app. No production domain is assumed.

Older uppercase planning documents and `docs/source/` are historical reference material; the documents above supersede their identity and design instructions.
