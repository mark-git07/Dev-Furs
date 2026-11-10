import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarize, insertEntry, isGeneratedCommit } from './changelog.mjs';
test('groups PRs once, omits their commits and escapes titles', () => {
 const commits = [{sha:'a',subject:'feat: duplicate',pr:1},{sha:'b',subject:'fix: [bug]'},{sha:'c',subject:"Merge branch 'master' into feature"}];
 const result=summarize(commits,[{number:1,title:'feat(ui)!: add <panel>',url:'https://example.com/1'}],'x/y');
 assert.match(result,/### Added/); assert.match(result,/Breaking change/); assert.match(result,/ui: add &lt;panel&gt;/); assert.doesNotMatch(result,/duplicate|Merge branch/); assert.match(result,/\\\[bug\\\]/);
});
test('inserts sorted entries and reruns are unchanged',()=>{
 const initial='# Changelog\n\n## Historical summary\n\nOld\n';
 const a=insertEntry(initial,{sha:'a',date:'2026-01-01T00:00:00Z',body:'A',before:'0',repo:'x/y'});
 const b=insertEntry(a,{sha:'b',date:'2026-01-02T00:00:00Z',body:'B',before:'a',repo:'x/y'});
 assert.ok(b.indexOf('— b')<b.indexOf('— a')); assert.equal(insertEntry(b,{sha:'a'}),b); assert.match(b,/Historical summary/);
});
test('only recognizes strictly generated commits',()=>{
 const c={subject:'chore(changelog): record a [generated-changelog]',author:'github-actions[bot]',email:'41898282+github-actions[bot]@users.noreply.github.com',files:['CHANGELOG.md']};
 assert.equal(isGeneratedCommit(c),true); assert.equal(isGeneratedCommit({...c,files:['src/App.tsx']}),false); assert.equal(isGeneratedCommit({...c,author:'human'}),false);
});

import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { deploymentCurrent } from './changelog.mjs';
test('deployment tolerates only generated changelog descendants',()=>{
 const old=process.cwd(),dir=mkdtempSync(join(tmpdir(),'changelog-test-'));
 const g=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
 try{
 process.chdir(dir);g('init');g('config','user.name','human');g('config','user.email','human@example.com');
 execFileSync('sh',['-c','echo source > source.txt']);g('add','.');g('commit','-m','initial');const source=g('rev-parse','HEAD');
 assert.equal(deploymentCurrent(source,source),true);
 g('config','user.name','github-actions[bot]');g('config','user.email','41898282+github-actions[bot]@users.noreply.github.com');
 execFileSync('sh',['-c','echo changes > CHANGELOG.md']);g('add','.');g('commit','-m',`chore(changelog): record ${source} [generated-changelog]`);
 assert.equal(deploymentCurrent(source,'HEAD'),true);
 execFileSync('sh',['-c','echo next >> source.txt']);g('add','.');g('commit','-m','feat: next source');
 assert.equal(deploymentCurrent(source,'HEAD'),false);assert.equal(deploymentCurrent('HEAD',source),false);
 }finally{process.chdir(old);rmSync(dir,{recursive:true,force:true});}
});
test('out of order entries remain chronological and categories remain distinct',()=>{
 const base='# Changelog\n\n## Historical summary\nOld\n';
 const newer=insertEntry(base,{sha:'b',date:'2026-01-02T00:00:00Z',body:'New',before:'a',repo:'x/y'});
 const older=insertEntry(newer,{sha:'a',date:'2026-01-01T00:00:00Z',body:'Old',before:'0',repo:'x/y'});
 assert.ok(older.indexOf('— b')<older.indexOf('— a'));
 const result=summarize([{sha:'1',subject:'docs: explain'},{sha:'2',subject:'ci: automate'},{sha:'3',subject:'plain change'}],[],'x/y');
 assert.match(result,/### Documentation/);assert.match(result,/### Maintenance/);assert.match(result,/### Changed/);assert.doesNotMatch(result,/### Added/);
});
test('unknown conventional types cannot access inherited category keys',()=>{
 const result=summarize([{sha:'a',subject:'constructor: update'},{sha:'b',subject:'__proto__: update'}],[],'x/y');
 assert.match(result,/### Changed/);assert.equal((result.match(/- update/g)||[]).length,2);
});
