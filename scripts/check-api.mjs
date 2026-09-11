import assert from 'node:assert/strict';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd(), true);
const origin = process.env.TEST_ORIGIN || 'http://localhost:3000';
assert.equal(new URL(origin).hostname,'localhost','This suite must only target localhost.');
assert.ok(!process.env.NEXT_PUBLIC_SUPABASE_URL,'This suite must only target an unconfigured local app.');
const payload = {id:crypto.randomUUID(),name:'Loopcodez QA',email:'qa@example.com',company:'Synthetic test',service:'Web Development',budget:'',message:'Synthetic validation request. No real customer data.',website:''};
// This suite is only for an unconfigured local app. Valid requests must return 503.
for (const route of ['projects','settings','enquiries','activity','members']) {
  const response = await fetch(`${origin}/api/admin/${route}`);
  assert.equal(response.status,401,`${route} must require authentication`);
}
const post = (body,requestOrigin=origin) => fetch(`${origin}/api/enquiries`,{method:'POST',headers:{'Content-Type':'application/json',Origin:requestOrigin},body:JSON.stringify(body)});
assert.equal((await post(payload,'https://untrusted.example')).status,403);
assert.equal((await post({...payload,website:'bot.example'})).status,400);
assert.equal((await post({...payload,message:'x'.repeat(20000)})).status,413);
assert.equal((await post(payload)).status,503,'Run only without configured Supabase credentials');
console.log('9 API checks passed: protected admin and members, origin check, honeypot, bounded input, honest unavailable response.');
