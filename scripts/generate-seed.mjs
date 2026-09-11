import { writeFile } from 'node:fs/promises';
import { projects } from '../lib/content/projects.ts';
import { defaultSettings } from '../lib/content/settings.ts';
import { projectSchema, settingsSchema } from '../lib/admin/validation.ts';

// Generate SQL only; never connects to a database or overwrites existing rows.
const literal = value => "'" + JSON.stringify(value).replaceAll("'", "''") + "'::jsonb";
const rows = projects.map(project => {
  const p = projectSchema.parse(project);
  return `('${p.slug}', ${literal(p)}, ${p.approved && p.status === 'live'}, ${p.featured}, ${p.displayIndex})`;
});
const sql = `-- Loopcodez initial content. Existing CMS edits are preserved.\ninsert into public.projects(slug,payload,published,featured,sort_order) values\n${rows.join(',\n')}\non conflict (slug) do nothing;\n\ninsert into public.site_settings(id,content) values ('main',${literal(settingsSchema.parse(defaultSettings))}) on conflict (id) do nothing;\n`;
await writeFile(new URL('../supabase/migrations/202609100002_seed_content.sql', import.meta.url), sql);
console.log(`Generated initial content for ${rows.length} projects. No database was changed.`);
