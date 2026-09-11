import Link from "next/link";
import { InnerHero } from "@/components/loopcodez/InnerHero";
import { ServiceSculpture } from "@/components/loopcodez/ServiceSculpture";
import { labExperiments } from "@/lib/content/lab";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata=createPageMetadata({title:"Lab",description:"The Loopcodez playground for creative coding, WebGL, motion, and new possibilities.",path:"/lab"});
export default function LabPage(){return <div className="inner-page lab-page"><InnerHero eyebrow="The studio playground" title="A little curiosity." accent="A lot of what if." description="Small experiments, unfinished thoughts, and new interactions. The space where we discover what could come next." variant="type"/><div className="lab-collection">{labExperiments.map((item,index)=><article className="lab-card" key={item.id}><div className="lab-art"><ServiceSculpture index={index}/><span className="lab-status">{item.status==="live"?"In the wild":item.status==="wip"?"In progress":"An open idea"}</span></div><div className="lab-copy"><span className="loop-eyebrow">{item.category}</span><h2>{item.title}</h2><p>{item.description}</p>{item.status==="live"&&<Link href="/" className="loop-text-link">Experience on the homepage <span>↗</span></Link>}</div></article>)}</div></div>}
