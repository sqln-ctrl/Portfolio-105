import { LoopMark } from "./LoopMark";
export function InnerHero({ eyebrow, title, accent, description, variant="loop" }: {eyebrow:string;title:string;accent:string;description:string;variant?:"loop"|"crystal"|"type"}) {
  return <header className="inner-hero"><div><span className="loop-eyebrow">{eyebrow}</span><h1>{title}<br/><em>{accent}</em></h1><p className="body-lg">{description}</p></div><div className={`inner-hero-art art-${variant}`} aria-hidden="true"><LoopMark/><i/><i/><i/><span>Ideas in continuous motion</span></div></header>;
}
