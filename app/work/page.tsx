import { WorkArchive } from "@/components/work/WorkArchive";
import { InnerHero } from "@/components/loopcodez/InnerHero";
import { getProjectsForSite } from "@/lib/content/project-store";
import { createPageMetadata } from "@/lib/seo/metadata";
export const dynamic = "force-dynamic";
export const metadata=createPageMetadata({title:"Work",description:"Selected Loopcodez projects in web development, ecommerce, AI, and automation.",path:"/work"});
export default async function WorkPage(){return <div className="inner-page work-page"><InnerHero eyebrow="Selected work" title="Ideas that" accent="made it out." description="Different challenges. One shared ambition: make something useful, memorable, and a pleasure to use."/><WorkArchive projects={await getProjectsForSite()}/></div>}
