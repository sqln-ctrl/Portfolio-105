"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminMembers } from "./AdminMembers";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { LoopMark } from "@/components/loopcodez/LoopMark";
import { type CaseStudy } from "@/lib/content/projects";
import { defaultSettings, type SiteSettings } from "@/lib/content/settings";
import { services } from "@/lib/content/site";

type ProjectRow = { slug: string; payload: CaseStudy; updated_at: string | null; published: boolean };
type Enquiry = { id: string; name: string; email: string; company: string; service: string; budget: string; message: string; status: string; notes: string; created_at: string };
type Activity = { id: number; resource: string; action: string; record_id: string; created_at: string };
type Tab = "overview" | "projects" | "inbox" | "content" | "activity" | "members";

const newProject = (): CaseStudy => ({ slug: "", title: "", category: "Web Development", serviceSlug: "web-development", role: "", timeline: "", year: String(new Date().getFullYear()), displayIndex: 0, featured: false, primaryFeatured: false, approved: false, status: "draft", typeTags: [], outcome: "", problem: "", insight: "", approach: [], designDecisions: [], technologies: [], results: [], reflection: "", liveUrl: "", githubUrl: "", coverUrl: "", sections: [] });

async function request<T>(url: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(url, { method, headers: body ? { "Content-Type": "application/json" } : undefined, body: body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "This request could not be completed.");
  return data as T;
}

export function AdminConsole({ configured, initialAuthenticated, account, role, previewProjects }: { role?: "owner" | "editor"; configured: boolean; initialAuthenticated: boolean; account: string; previewProjects?: CaseStudy[] }) {
  const preview = Boolean(previewProjects);
  const router = useRouter();
  const isOwner = role === "owner" || preview;
  const [authenticated, setAuthenticated] = useState(initialAuthenticated || preview);
  const [tab, setTab] = useState<Tab>("overview");
  const [rows, setRows] = useState<ProjectRow[]>(() => (previewProjects ?? []).map((p) => ({ slug: p.slug, payload: p, updated_at: null, published: p.approved && p.status === "live" })));
  const [inbox, setInbox] = useState<Enquiry[]>([]);
  const [inboxCount, setInboxCount] = useState(0);
  const [inboxPage, setInboxPage] = useState(0);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [savedSettings, setSavedSettings] = useState<SiteSettings>(defaultSettings);
  const [settingsVersion, setSettingsVersion] = useState<string | null>(null);
  const [editor, setEditor] = useState<CaseStudy | null>(null);
  const [editorVersion, setEditorVersion] = useState<string | null>(null);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!authenticated || preview) return;
    let cancelled = false;
    Promise.all([
      request<{ projects: ProjectRow[] }>("/api/admin/projects"),
      request<{ enquiries: Enquiry[]; count: number }>("/api/admin/enquiries"),
      request<{ content: SiteSettings; updatedAt: string | null }>("/api/admin/settings"),
      request<{ activity: Activity[] }>("/api/admin/activity"),
    ]).then(([projects, enquiries, copy, audit]) => {
      if (cancelled) return;
      setRows(projects.projects); setInbox(enquiries.enquiries); setInboxCount(enquiries.count); setSettings(copy.content); setSavedSettings(copy.content); setSettingsVersion(copy.updatedAt); setActivity(audit.activity);
    }).catch((reason) => { if (!cancelled) setError(reason.message); });
    return () => { cancelled = true; };
  }, [authenticated, preview]);

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const notify = (text: string) => { setMessage(text); setError(""); };
  const navigate = (next: Tab) => {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setSettings(savedSettings);
    setTab(next); setEditor(null); setActiveEnquiry(null); setDirty(false); setQuery(""); setMessage(""); setError("");
  };
  const edit = (project: CaseStudy, version: string | null) => {
    if (dirty && !window.confirm("Discard your unsaved changes?")) return;
    setEditor(structuredClone(project)); setEditorVersion(version); setDirty(false); setTab("projects"); setMessage(""); setError("");
  };

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const data = new FormData(event.currentTarget);
    try { await request("/api/admin/login", "POST", { email: data.get("email"), password: data.get("password") }); setAuthenticated(true); router.refresh(); }
    catch (reason) { setError((reason as Error).message); }
    finally { setBusy(false); }
  }
  async function logout() {
    if (dirty && !window.confirm("Discard your unsaved changes and sign out?")) return;
    try { if (!preview) await request("/api/admin/logout", "POST"); setAuthenticated(false); setRows([]); setInbox([]); setActivity([]); setEditor(null); setActiveEnquiry(null); setDirty(false); }
    catch (reason) { setError((reason as Error).message); }
  }
  async function saveProject(event: FormEvent) {
    event.preventDefault(); if (preview || !editor) return; setBusy(true); setError("");
    try {
      const result = await request<{ project: ProjectRow }>("/api/admin/projects", "POST", { project: editor, expectedUpdatedAt: editorVersion });
      setRows((items) => [...items.filter((p) => p.slug !== result.project.slug), result.project].sort((a, b) => a.payload.displayIndex - b.payload.displayIndex));
      setEditorVersion(result.project.updated_at); setDirty(false); notify(result.project.published ? "Project published. It is now visible on the website." : "Draft saved. It is hidden from public pages.");
    } catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  async function saveSettings(event: FormEvent) {
    event.preventDefault(); if (preview) return; setBusy(true); setError("");
    try { const result = await request<{ updatedAt: string }>("/api/admin/settings", "POST", { content: settings, expectedUpdatedAt: settingsVersion }); setSettingsVersion(result.updatedAt); setSavedSettings(settings); setDirty(false); notify("Website copy and homepage selection saved."); }
    catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  async function saveEnquiry(event: FormEvent) {
    event.preventDefault(); if (preview || !activeEnquiry) return; setBusy(true); setError("");
    try { const result = await request<{ enquiry: Enquiry }>("/api/admin/enquiries", "PATCH", { id: activeEnquiry.id, status: activeEnquiry.status, notes: activeEnquiry.notes }); setInbox((items) => items.map((item) => item.id === result.enquiry.id ? result.enquiry : item)); setActiveEnquiry(result.enquiry); setDirty(false); notify("Enquiry updated."); }
    catch (reason) { setError((reason as Error).message); } finally { setBusy(false); }
  }
  async function loadInbox(page: number) {
    if (preview) return;
    if (dirty && !window.confirm("Discard unsaved enquiry notes?")) return;
    setLoading(true); setActiveEnquiry(null); setDirty(false);
    try { const result = await request<{ enquiries: Enquiry[]; count: number }>(`/api/admin/enquiries?page=${page}`); setInbox(result.enquiries); setInboxCount(result.count); setInboxPage(page); }
    catch (reason) { setError((reason as Error).message); } finally { setLoading(false); }
  }

  if (!authenticated) return <div className="admin-login"><Link href="/" className="loop-brand"><LoopMark /><span>loopcodez</span></Link><div className="admin-login-card"><span className="admin-kicker">Studio workspace</span><h1>A little order.<br /><em>More possibilities.</em></h1><p>Manage your work, conversations, and the words that tell your story.</p>{!configured ? <div className="admin-setup"><h2>Connect your studio database</h2><p>Supabase setup is needed before sign-in and saved changes become available. Follow the project’s database setup guide.</p>{process.env.NODE_ENV === "development" && <><Link href="/admin?preview=1" className="admin-button">Preview the workspace ↗</Link><small>Local development preview. No records are saved.</small></>}</div> : <form onSubmit={login}><Field label="Email"><input name="email" type="email" autoComplete="username" required /></Field><Field label="Password"><input name="password" type="password" autoComplete="current-password" required /></Field><button className="admin-button" disabled={busy}>{busy ? "Signing in…" : "Sign in →"}</button></form>}{error && <p role="alert" className="admin-error">{error}</p>}<Link className="admin-back" href="/">← Back to the website</Link></div><LoopMark className="admin-login-mark" /></div>;

  const filteredRows = rows.filter((r) => `${r.payload.title} ${r.payload.category}`.toLowerCase().includes(query.toLowerCase()));
  const filteredInbox = inbox.filter((r) => (statusFilter === "all" || r.status === statusFilter) && `${r.name} ${r.email} ${r.company} ${r.message}`.toLowerCase().includes(query.toLowerCase()));
  const published = rows.filter((p) => p.published);
  const featured = published.filter((p) => p.payload.featured);
  const field = <K extends keyof CaseStudy>(key: K, value: CaseStudy[K]) => { if (editor) setEditor({ ...editor, [key]: value }); setDirty(true); };

  return <div className="admin-workspace"><aside className="admin-sidebar"><Link href="/" className="loop-brand"><LoopMark /><span>loopcodez</span></Link><span className="admin-kicker">Studio workspace</span><nav aria-label="Workspace">{([['overview','Overview','◉'],['projects','Projects','◇'],['inbox','Enquiries','↗'],['content','Site content','Aa'],['activity','Activity','◷']] as const).map(([key,label,icon]) => <button key={key} onClick={() => navigate(key)} aria-current={tab === key ? "page" : undefined}><span>{icon}</span>{label}{key === "inbox" && inboxCount > 0 && <b>{inboxCount}</b>}</button>)}{isOwner && <button onClick={() => navigate("members")} aria-current={tab === "members" ? "page" : undefined}><span>♧</span>Team access</button>}</nav><div className="admin-sidebar-bottom"><Link href="/" target="_blank">View website ↗</Link><small>{preview ? "Read-only design preview" : account || "Studio member"}</small><button onClick={logout}>Sign out</button></div></aside>
    <div className="admin-main"><header className="admin-topbar"><span>Workspace / <strong>{tab === "content" ? "Site content" : tab.charAt(0).toUpperCase() + tab.slice(1)}</strong></span><div><span className="admin-connection">{preview ? "Preview mode" : "Connected to Supabase"}</span><Link href="/" target="_blank" className="admin-view-site">Visit site ↗</Link></div></header>
    {preview && <div className="admin-preview-banner">Read-only interface preview · Connect Supabase to save projects, receive enquiries, and publish changes.</div>}
    <div className="admin-content">{message && <p role="status" className="admin-success">{message}</p>}{error && <p role="alert" className="admin-error">{error}</p>}
      {tab === "overview" && <><div className="admin-page-title"><div><span className="admin-kicker">Your studio, in focus</span><h1>Make room for<br /><em>what’s next.</em></h1><p>Everything you need to keep Loopcodez moving.</p></div><button className="admin-button" onClick={() => edit(newProject(), null)}>Add a project +</button></div><div className="admin-stats"><Stat label="Published projects" value={published.length} /><Stat label="On the homepage" value={Math.min(featured.length, settings.homepageCount)} /><Stat label="Enquiries" value={inboxCount} /><Stat label="Draft projects" value={rows.length - published.length} /></div><div className="admin-overview-grid"><section className="admin-panel"><div className="admin-panel-title"><h2>Your latest work</h2><button onClick={() => navigate("projects")}>Manage all ↗</button></div>{rows.slice(0,4).map((row) => <button className="admin-project-row" key={row.slug} onClick={() => edit(row.payload,row.updated_at)}><span className="admin-project-glyph"><LoopMark /></span><span><strong>{row.payload.title.split(" — ")[0]}</strong><small>{row.payload.category}</small></span><span className={`admin-badge ${row.published ? "is-live" : ""}`}>{row.published ? "Published" : "Draft"}</span><span>↗</span></button>)}{rows.length === 0 && <Empty title="Your first project starts here" text="Add a project, then choose whether to publish it and feature it on the homepage." />}</section><section className="admin-panel admin-note"><LoopMark /><span className="admin-kicker">Keep the loop going</span><h2>Automate.<br />Stay consistent.<br /><em>Keep supporting.</em></h2><p>Your homepage is curated by featured projects, their display order, and the count in Site content.</p><button className="admin-text-button" onClick={() => navigate("content")}>Shape your homepage ↗</button></section></div></>}
      {tab === "projects" && !editor && <><div className="admin-page-title"><div><h1>Selected by <em>you.</em></h1><p>Draft, publish, and decide what leads the story.</p></div><button className="admin-button" onClick={() => edit(newProject(),null)}>New project +</button></div><input className="admin-search" aria-label="Search projects" placeholder="Search by project or category…" value={query} onChange={(e) => setQuery(e.target.value)} /><div className="admin-panel">{filteredRows.map((row) => <button className="admin-project-row" key={row.slug} onClick={() => edit(row.payload,row.updated_at)}><span className="admin-order">{row.payload.displayIndex}</span><span><strong>{row.payload.title}</strong><small>{row.payload.category}{row.payload.featured ? " · Featured on homepage" : ""}</small></span><span className={`admin-badge ${row.published ? "is-live" : ""}`}>{row.published ? "Published" : "Draft"}</span><span>Edit ↗</span></button>)}{filteredRows.length === 0 && <Empty title="No projects here yet" text="Create a project or try a different search." />}</div></>}
      {tab === "projects" && editor && <form onSubmit={saveProject}><div className="admin-page-title"><div><button type="button" className="admin-text-button" onClick={() => navigate("projects")}>← All projects</button><h1>{editorVersion ? "Edit your" : "Make something"} <em>{editorVersion ? "work." : "visible."}</em></h1></div><button className="admin-button" disabled={busy || preview}>{busy ? "Saving…" : "Save project"}</button></div><div className="admin-editor-grid"><div><section className="admin-panel"><h2>Project essentials</h2><div className="admin-form-grid"><Field label="Project title"><input required value={editor.title} onChange={(e) => field("title",e.target.value)} maxLength={160} /></Field><Field label="URL slug" hint="Keep a published slug stable to preserve existing links."><input required readOnly={Boolean(editorVersion)} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={editor.slug} onChange={(e) => field("slug",e.target.value)} /></Field><Field label="Category"><input required value={editor.category} onChange={(e) => field("category",e.target.value)} /></Field><Field label="Service"><select value={editor.serviceSlug} onChange={(e) => field("serviceSlug",e.target.value)}>{services.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}</select></Field><Field label="Our role"><input value={editor.role} onChange={(e) => field("role",e.target.value)} /></Field><Field label="Timeline"><input value={editor.timeline} onChange={(e) => field("timeline",e.target.value)} /></Field><Field label="Year"><input required pattern="[0-9]{4}" value={editor.year} onChange={(e) => field("year",e.target.value)} /></Field><Field label="Tags (comma separated)"><input value={editor.typeTags.join(", ")} onChange={(e) => field("typeTags",e.target.value.split(",").map((s) => s.trim()))} /></Field></div><Field label="Short project description"><textarea rows={3} value={editor.outcome} onChange={(e) => field("outcome",e.target.value)} maxLength={1500} /></Field></section><section className="admin-panel"><h2>Project preview</h2><Field label="Live site URL" hint="Any public HTTPS deployment URL. The site must allow embedding for a live preview."><input type="url" value={editor.liveUrl ?? ""} placeholder="https://your-project.vercel.app" onChange={(e) => field("liveUrl",e.target.value)} /></Field><Field label="Cover image URL" hint="Optional public HTTPS image. Use this if a site blocks embedding."><input type="url" value={editor.coverUrl ?? ""} onChange={(e) => field("coverUrl",e.target.value)} /></Field><Field label="Source code URL (optional)"><input type="url" value={editor.githubUrl ?? ""} onChange={(e) => field("githubUrl",e.target.value)} /></Field></section><section className="admin-panel"><div className="admin-panel-title"><h2>Case study sections</h2><button type="button" className="admin-text-button" onClick={() => field("sections",[...(editor.sections ?? []),{id:crypto.randomUUID(),title:"New section",body:"",layout:"text"}])}>Add section +</button></div><p className="admin-hint">Name and arrange your own chapters. Custom chapters replace the default case-study sections.</p>{(editor.sections ?? []).map((section,index) => <div className="admin-section-editor" key={section.id}><div className="admin-section-tools"><strong>{section.title || "Untitled section"}</strong><button type="button" disabled={index === 0} aria-label={`Move ${section.title} up`} onClick={() => { const sections = [...editor.sections!]; [sections[index-1],sections[index]] = [sections[index],sections[index-1]]; field("sections",sections); }}>↑</button><button type="button" disabled={index === editor.sections!.length-1} aria-label={`Move ${section.title} down`} onClick={() => { const sections = [...editor.sections!]; [sections[index+1],sections[index]] = [sections[index],sections[index+1]]; field("sections",sections); }}>↓</button><button type="button" aria-label={`Remove ${section.title}`} onClick={() => field("sections",editor.sections!.filter((s) => s.id !== section.id))}>Remove</button></div><Field label="Section title"><input required value={section.title} onChange={(e) => field("sections",editor.sections!.map((s) => s.id === section.id ? {...s,title:e.target.value} : s))} /></Field><Field label="Layout"><select value={section.layout} onChange={(e) => field("sections",editor.sections!.map((s) => s.id === section.id ? {...s,layout:e.target.value as "text"|"split"|"quote"} : s))}><option value="text">Text chapter</option><option value="split">Title beside text</option><option value="quote">Large statement</option></select></Field><Field label="Content" hint="Plain text. Blank lines separate paragraphs."><textarea rows={6} value={section.body} onChange={(e) => field("sections",editor.sections!.map((s) => s.id === section.id ? {...s,body:e.target.value} : s))} /></Field></div>)}{!editor.sections?.length && <><Field label="The problem"><textarea rows={4} value={editor.problem} onChange={(e) => field("problem",e.target.value)} /></Field><Field label="The insight"><textarea rows={3} value={editor.insight} onChange={(e) => field("insight",e.target.value)} /></Field>{([['approach','Approach'],['designDecisions','Design decisions'],['technologies','Technology'],['results','Results']] as const).map(([key,label]) => <Field key={key} label={label} hint="One item per line."><textarea rows={4} value={editor[key].join("\n")} onChange={(e) => field(key,e.target.value.split("\n"))} /></Field>)}<Field label="Interaction detail"><textarea rows={3} value={editor.interactionDetail ?? ""} onChange={(e) => field("interactionDetail",e.target.value)} /></Field><Field label="What we learned"><textarea rows={3} value={editor.reflection} onChange={(e) => field("reflection",e.target.value)} /></Field></>}</section></div><aside><section className="admin-panel admin-publish-panel"><span className="admin-kicker">Visibility</span><h2>Ready for the world?</h2><Field label="Publication status"><select value={editor.status} onChange={(e) => field("status",e.target.value as "draft"|"live")}><option value="draft">Draft — hidden</option><option value="live">Live — ready to publish</option></select></Field><label className="admin-checkbox"><input type="checkbox" checked={editor.approved} onChange={(e) => field("approved",e.target.checked)} />Content approved for publishing</label><label className="admin-checkbox"><input type="checkbox" checked={editor.featured} onChange={(e) => field("featured",e.target.checked)} />Feature on homepage</label><Field label="Display order" hint="Lower values appear first. This number is never shown on the public site."><input type="number" min={0} max={9999} value={editor.displayIndex} onChange={(e) => field("displayIndex",Number(e.target.value))} /></Field><p className="admin-hint">Both Live status and approval are required to publish. Set a project to Draft to hide it without deleting its content.</p>{editorVersion && <Link href={`/work/${editor.slug}`} target="_blank" className="admin-text-button">View published page ↗</Link>}<button className="admin-button" disabled={busy || preview}>{busy ? "Saving…" : "Save project"}</button>{dirty && <small>Unsaved changes</small>}</section></aside></div></form>}
      {tab === "inbox" && <><div className="admin-page-title"><div><h1>New <em>possibilities.</em></h1><p>Project enquiries sent directly through your site.</p></div><button className="admin-button secondary" disabled={loading || preview} onClick={() => loadInbox(inboxPage)}>Refresh ↻</button></div><div className="admin-inbox-tools"><input aria-label="Search current enquiry page" placeholder="Search this page of enquiries…" value={query} onChange={(e) => setQuery(e.target.value)} /><select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option value="all">All statuses</option>{['new','reviewing','contacted','closed','archived'].map((s) => <option key={s}>{s}</option>)}</select></div><div className="admin-inbox-layout"><section className="admin-panel">{filteredInbox.map((item) => <button className="admin-enquiry-row" key={item.id} onClick={() => { if (!dirty || window.confirm("Discard unsaved enquiry notes?")) { setActiveEnquiry({...item}); setDirty(false); } }}><span><strong>{item.name}</strong><small>{item.company || item.email}</small></span><span className="admin-badge">{item.status}</span><p>{item.message.slice(0,100)}</p><small>{new Date(item.created_at).toLocaleDateString()}</small></button>)}{filteredInbox.length === 0 && <Empty title="A clear inbox" text="When someone sends a project enquiry, it will appear here after it has been saved to Supabase." />}<div className="admin-pagination"><button disabled={inboxPage === 0 || loading} onClick={() => loadInbox(inboxPage-1)}>← Previous</button><span>{inboxCount} total enquiries</span><button disabled={(inboxPage+1)*50 >= inboxCount || loading} onClick={() => loadInbox(inboxPage+1)}>Next →</button></div></section>{activeEnquiry && <form className="admin-panel" onSubmit={saveEnquiry}><span className="admin-kicker">Project enquiry</span><h2>{activeEnquiry.name}</h2><a href={`mailto:${activeEnquiry.email}`}>{activeEnquiry.email} ↗</a><p className="admin-hint">{[activeEnquiry.company,activeEnquiry.service,activeEnquiry.budget].filter(Boolean).join(" · ")}</p><p className="admin-enquiry-message">{activeEnquiry.message}</p><Field label="Status"><select value={activeEnquiry.status} onChange={(e) => { setActiveEnquiry({...activeEnquiry,status:e.target.value}); setDirty(true); }}>{['new','reviewing','contacted','closed','archived'].map((s) => <option key={s}>{s}</option>)}</select></Field><Field label="Private studio notes"><textarea rows={5} value={activeEnquiry.notes} onChange={(e) => { setActiveEnquiry({...activeEnquiry,notes:e.target.value}); setDirty(true); }} /></Field><button className="admin-button" disabled={busy || preview}>{busy ? "Saving…" : "Save enquiry"}</button></form>}</div></>}
      {tab === "content" && <form onSubmit={saveSettings}><div className="admin-page-title"><div><h1>Words with <em>purpose.</em></h1><p>Keep the studio’s voice current. Changes appear across the live site.</p></div><button className="admin-button" disabled={busy || preview}>{busy ? "Saving…" : "Save site content"}</button></div><section className="admin-panel"><h2>Homepage curation</h2><Field label="Maximum featured projects" hint="Choose 0–12. Only published projects marked Featured are shown, sorted by display order."><input type="number" min={0} max={12} value={settings.homepageCount} onChange={(e) => { setSettings({...settings,homepageCount:Number(e.target.value)}); setDirty(true); }} /></Field><p className="admin-hint">{featured.length} published projects are currently marked as featured.</p></section><section className="admin-panel"><h2>Studio voice</h2><div className="admin-form-grid">{([['studioTagline','Studio tagline'],['heroEyebrow','Hero overline'],['heroLineOne','Hero first line'],['heroLineTwo','Hero italic line'],['workHeading','Work heading'],['workSubtitle','Work italic heading'],['footerHeading','Footer invitation']] as const).map(([key,label]) => <Field label={label} key={key}><input required value={settings[key]} onChange={(e) => { setSettings({...settings,[key]:e.target.value}); setDirty(true); }} /></Field>)}</div><Field label="Hero description"><textarea required rows={3} value={settings.heroDescription} onChange={(e) => { setSettings({...settings,heroDescription:e.target.value}); setDirty(true); }} /></Field><Field label="Studio statement"><textarea required rows={5} value={settings.aboutStatement} onChange={(e) => { setSettings({...settings,aboutStatement:e.target.value}); setDirty(true); }} /></Field></section></form>}
      {tab === "members" && isOwner && <AdminMembers preview={preview} />}
      {tab === "activity" && <><div className="admin-page-title"><div><h1>The studio <em>log.</em></h1><p>A record of saved project, content, and enquiry changes.</p></div><button className="admin-button secondary" disabled={preview} onClick={async () => { try { const result = await request<{activity:Activity[]}>("/api/admin/activity"); setActivity(result.activity); } catch(reason) { setError((reason as Error).message); } }}>Refresh ↻</button></div><section className="admin-panel">{activity.map((item) => <div className="admin-activity-row" key={item.id}><span className="admin-badge">{item.action.toLowerCase()}</span><strong>{item.resource.replaceAll("_"," ")}</strong><span>{item.record_id}</span><time>{new Date(item.created_at).toLocaleString()}</time></div>)}{activity.length === 0 && <Empty title="Ready for your first change" text="The database records each saved change without logging passwords or enquiry messages." />}</section></>}
    </div></div></div>;
}

function Field({label,hint,children}:{label:string;hint?:string;children:ReactNode}) { return <label className="admin-field"><span>{label}</span>{children}{hint && <small>{hint}</small>}</label>; }
function Stat({label,value}:{label:string;value:number}) { return <div className="admin-stat"><span>{label}</span><strong>{value}</strong><span aria-hidden="true">↗</span></div>; }
function Empty({title,text}:{title:string;text:string}) { return <div className="admin-empty"><LoopMark /><h3>{title}</h3><p>{text}</p></div>; }
