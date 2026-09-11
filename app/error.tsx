"use client";
import Link from "next/link";
import { LoopMark } from "@/components/loopcodez/LoopMark";
export default function ErrorPage({reset}:{error:Error & {digest?:string};reset:()=>void}){return <div className="route-error"><LoopMark/><span className="loop-eyebrow">A small interruption</span><h1>Let’s reconnect.</h1><p>This page could not finish loading. Your next idea is still worth exploring.</p><div><button className="loop-pill" onClick={reset}>Try again <span>↗</span></button><Link href="/" className="loop-text-link">Back to the studio</Link></div></div>}
