"use client";
import Link from "next/link";
import { useMemo,useState } from "react";
import type { CaseStudy } from "@/lib/content/projects";
import { ProjectCardVisual } from "./ProjectCardVisual";
export function WorkArchive({projects}:{projects:CaseStudy[]}){
const [category,setCategory]=useState<string|null>(null);
const categories=useMemo(()=>[...new Set(projects.map(p=>p.category))],[projects]);
const filtered=category?projects.filter(p=>p.category===category):projects;
return <><div className="archive-toolbar"><span>Explore the collection</span><div role="group" aria-label="Filter projects">{[null,...categories].map(item=><button key={item??"all"} aria-pressed={category===item} onClick={()=>setCategory(item)}>{item??"All work"}</button>)}</div></div><div key={category??"all"} className="archive-collection">{filtered.map(project=><article className="archive-project" key={project.slug}><div className="archive-image"><ProjectCardVisual slug={project.slug} title={project.title} liveUrl={project.liveUrl} coverUrl={project.coverUrl} approved={project.approved} className="archive-preview"/></div><div className="archive-copy"><span className="loop-eyebrow">{project.category} / {project.year}</span><h2><Link href={`/work/${project.slug}`}>{project.title}</Link></h2><p>{project.outcome}</p><div className="loop-service-tags">{project.typeTags.map(tag=><span key={tag}>{tag}</span>)}</div><Link className="loop-text-link" href={`/work/${project.slug}`}>Explore case study <span>↗</span></Link></div></article>)}</div>{!filtered.length&&<p className="archive-empty">New work is on the way. Let’s build the next story together.</p>}</>;}
