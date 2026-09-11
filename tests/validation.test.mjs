import test from 'node:test';
import assert from 'node:assert/strict';
import { projectSchema, settingsSchema, enquirySchema, enquiryUpdateSchema } from '../lib/admin/validation.ts';
import { projects } from '../lib/content/projects.ts';
import { defaultSettings } from '../lib/content/settings.ts';

test('recovered project content and default settings pass the CMS contract', () => {
  projects.forEach(p => assert.equal(projectSchema.safeParse(p).success, true, p.slug));
  assert.equal(settingsSchema.safeParse(defaultSettings).success, true);
});
test('project URLs reject executable schemes, credentials, local and private targets', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://example.com', 'https://user:secret@example.com', 'https://localhost', 'https://127.0.0.1', 'https://192.168.0.1', 'https://[::1]', 'https://2130706433', 'https://169.254.169.254']) {
    assert.equal(projectSchema.safeParse({...projects[0], liveUrl:url}).success, false, url);
  }
  for (const url of ['', 'https://project.vercel.app', 'https://example.com/work?theme=dark']) {
    assert.equal(projectSchema.safeParse({...projects[0], liveUrl:url}).success, true, url);
  }
});
test('publication and ordering reject malformed or unexpected input', () => {
  for (const change of [{slug:'../admin'}, {displayIndex:-1}, {displayIndex:1.5}, {approved:'true'}, {owner:true}, {sections:[{id:crypto.randomUUID(), title:'Story', body:'Text', layout:'html'}]}]) {
    assert.equal(projectSchema.safeParse({...projects[0], ...change}).success, false);
  }
  assert.equal(settingsSchema.safeParse({...defaultSettings,homepageCount:0}).success, true);
  assert.equal(settingsSchema.safeParse({...defaultSettings,homepageCount:13}).success, false);
});
const enquiry = {id:crypto.randomUUID(),name:'Test Person',email:'test@example.com',company:'',service:'Web Development',budget:'',message:'This is a synthetic project brief for validation.',website:''};
test('enquiry validation rejects spam and privileged fields', () => {
  assert.equal(enquirySchema.safeParse(enquiry).success, true);
  for (const change of [{website:'spam.example'}, {message:'short'}, {email:'invalid'}, {status:'closed'}, {notes:'injected'}, {id:'invalid'}, {message:'x'.repeat(10001)}]) {
    assert.equal(enquirySchema.safeParse({...enquiry,...change}).success, false);
  }
  assert.equal(enquiryUpdateSchema.safeParse({id:enquiry.id,status:'contacted',notes:'Follow up tomorrow'}).success, true);
  assert.equal(enquiryUpdateSchema.safeParse({id:enquiry.id,status:'contacted',notes:'',email:'changed@example.com'}).success, false);
});
