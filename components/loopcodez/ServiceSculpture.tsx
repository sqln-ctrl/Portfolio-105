import { LoopMark } from "./LoopMark";
export function ServiceSculpture({ index }: {index:number}) {
  return <div className={`service-sculpture sculpture-${index}`} aria-hidden="true"><div className="sculpture-core"><LoopMark/><i/><i/><i/></div><span className="sculpture-dot"/><span className="sculpture-dot"/></div>;
}
