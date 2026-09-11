import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import ts from 'typescript';
const require=createRequire(import.meta.url);
const source=await readFile(new URL('../app/api/admin/members/route.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;

function loadRoute(role){
  let privilegedCalls=0;
  const exports={};
  const dependencies={
    '@/lib/admin/auth':{requireAdmin:async()=>{if(!role)throw new Error('UNAUTHORIZED');return {session:{role}}}},
    '@/lib/supabase/server':{createServiceClient:()=>{privilegedCalls++;return {rpc:async()=>({data:[],error:null})}}},
    '@/lib/admin/http':{checkOrigin:()=>{},readBody:async request=>request.json(),apiError:error=>Response.json({error:error.message},{status:error.message==='UNAUTHORIZED'?401:403})},
  };
  new Function('require','exports',compiled)(name=>dependencies[name]??require(name),exports);
  return {route:exports,calls:()=>privilegedCalls};
}
test('regular admin cannot invoke any team-access operation or reach the secret client',async()=>{
  const {route,calls}=loadRoute('editor');
  for(const method of ['GET','POST','PATCH']){
    const response=await route[method](new Request('http://localhost:3000/api/admin/members',{method, ...(method!=='GET'?{body:JSON.stringify({email:'test@example.com'})}: {})}));
    assert.equal(response.status,403,method);
  }
  assert.equal(calls(),0);
});
test('anonymous requests cannot reach the privileged client',async()=>{
  const {route,calls}=loadRoute(null);assert.equal((await route.GET()).status,401);assert.equal(calls(),0);
});
test('a verified super admin can retrieve the member directory',async()=>{
  const {route,calls}=loadRoute('owner');assert.equal((await route.GET()).status,200);assert.equal(calls(),1);
});
