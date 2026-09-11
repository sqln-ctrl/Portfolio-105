import Link from "next/link";
import { InnerHero } from "@/components/loopcodez/InnerHero";
import { ServiceSculpture } from "@/components/loopcodez/ServiceSculpture";
import { services } from "@/lib/content/site";
import { createPageMetadata } from "@/lib/seo/metadata";
export const metadata=createPageMetadata({title:"Services",description:"Design, development, AI, and automation. Six connected capabilities from Loopcodez.",path:"/services"});
export default function ServicesPage(){return <div className="inner-page expertise-page"><InnerHero eyebrow="Our expertise" title="Good thinking." accent="Made tangible." description="From the first idea to the systems that keep it moving. Six connected capabilities, built around what you need." variant="crystal"/><div className="expertise-chapters">{services.map((service,index)=><section className="expertise-chapter" id={service.slug} key={service.slug}><ServiceSculpture index={index}/><div className="expertise-copy"><span className="loop-eyebrow">{service.tagline}</span><h2>{service.title}</h2><p>{service.description}</p><div className="loop-service-tags">{service.capabilities.map(capability=><span key={capability}>{capability}</span>)}</div><p className="expertise-proof">{service.proof}</p><Link href="/contact" className="loop-text-link">Let’s make it happen <span>↗</span></Link></div></section>)}</div></div>}
