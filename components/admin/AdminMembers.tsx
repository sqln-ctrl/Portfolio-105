"use client";
import { useEffect, useState, type FormEvent } from "react";
type Member = { user_id: string; email: string; role: "owner" | "editor"; active: boolean };
export function AdminMembers({ preview }: { preview: boolean }) {
  const [members,setMembers] = useState<Member[]>([]);
  const [busy,setBusy] = useState(false);
  const [notice,setNotice] = useState("");
  const [error,setError] = useState("");
  async function request(method = "GET", body?: unknown) {
    const response = await fetch("/api/admin/members",{method,cache:"no-store",headers:body?{"Content-Type":"application/json"}:undefined,body:body?JSON.stringify(body):undefined});
    const result = await response.json();
    if(!response.ok) throw new Error(result.error || "Could not update access.");
    return result;
  }
  useEffect(() => {
    if(preview) return;
    let cancelled=false;
    request().then(result=>{if(!cancelled)setMembers(result.members)}).catch(reason=>{if(!cancelled)setError(reason.message)});
    return()=>{cancelled=true};
  },[preview]);
  async function add(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); if(preview)return;
    const form=event.currentTarget; const data=new FormData(form);
    setBusy(true);setError("");setNotice("");
    try { const result=await request("POST",{email:data.get("email"),...(data.get("password")?{password:data.get("password")}: {})});form.reset();setNotice(result.message);setMembers((await request()).members); }
    catch(reason){setError((reason as Error).message)}finally{setBusy(false)}
  }
  async function toggle(member:Member) {
    if(preview)return;setBusy(true);setError("");
    try {await request("PATCH",{userId:member.user_id,active:!member.active});setMembers((await request()).members);setNotice(member.active?"Admin access disabled. Existing sessions can no longer manage the site.":"Admin access restored.");}
    catch(reason){setError((reason as Error).message)}finally{setBusy(false)}
  }
  return <><div className="admin-page-title"><div><span className="admin-kicker">Super admin only</span><h1>Good people.<br/><em>Shared possibilities.</em></h1><p>Admins manage all site content and enquiries. Only a super admin can manage access.</p></div></div>{error&&<p role="alert" className="admin-error">{error}</p>}{notice&&<p role="status" className="admin-success">{notice}</p>}<div className="admin-overview-grid"><section className="admin-panel"><h2>Studio members</h2>{members.map(member=><div className="admin-member-row" key={member.user_id}><div><strong>{member.email}</strong><small>{member.role==="owner"?"Super admin":member.active?"Admin · Active":"Admin · Disabled"}</small></div>{member.role!=="owner"&&<button className="admin-button secondary" disabled={busy} onClick={()=>toggle(member)}>{member.active?"Disable access":"Restore access"}</button>}</div>)}{!members.length&&<p className="admin-hint">{preview?"Your studio members will appear here after you connect Supabase.":"No members loaded."}</p>}</section><form className="admin-panel" onSubmit={add}><h2>Add an admin</h2><label className="admin-field"><span>Email address</span><input name="email" type="email" required maxLength={254} autoComplete="off"/></label><label className="admin-field"><span>Password for a new account</span><input name="password" type="password" minLength={12} maxLength={128} autoComplete="new-password"/><small>At least 12 characters. Leave blank for an existing Supabase Auth user; their password stays unchanged.</small></label><p className="admin-hint">New admins can publish work, edit copy, and read enquiries. They cannot add or disable admins. Login details must be shared privately.</p><button className="admin-button" disabled={busy||preview}>{busy?"Saving access…":"Add admin +"}</button></form></div></>;
}
