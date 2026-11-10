import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const git=(...args)=>execFileSync('git',args,{encoding:'utf8'}).trim();
const escape=text=>text.replace(/[\r\n]+/g,' ').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/[\\`*_[\]#!|]/g,'\\$&');
export function isGeneratedCommit(c){return c.author==='github-actions[bot]'&&c.email==='41898282+github-actions[bot]@users.noreply.github.com'&&/^chore\(changelog\): record [a-f0-9]+ \[generated-changelog\]$/.test(c.subject)&&c.files.length===1&&c.files[0]==='CHANGELOG.md';}
export function summarize(commits,prs,repo){
 const groups=new Map(['Added','Fixed','Changed','Documentation','Maintenance'].map(k=>[k,[]]));
 const items=[...prs.map(p=>({title:p.title,url:p.url,label:`#${p.number}`})),...commits.filter(c=>!c.pr&&!c.generated&&!/^Merge (branch|remote-tracking)/.test(c.subject)).map(c=>({title:c.subject,url:`https://github.com/${repo}/commit/${c.sha}`,label:c.sha.slice(0,7)}))];
 for(const item of items){
  const m=item.title.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.*)$/);
  const category=new Map(Object.entries({feat:'Added',fix:'Fixed',docs:'Documentation',ci:'Maintenance',build:'Maintenance',test:'Maintenance',chore:'Maintenance',deps:'Maintenance'})).get(m?.[1])||'Changed';
  const title=m?`${m[2]?`${m[2]}: `:''}${m[4]}`:item.title;
  groups.get(category).push(`- ${m?.[3]?'**Breaking change:** ':''}${escape(title)} ([${item.label}](${item.url}))`);
 }
 return [...groups].filter(([,v])=>v.length).map(([k,v])=>`### ${k}\n\n${v.join('\n')}`).join('\n\n');
}
export function insertEntry(text,entry){
 if(text.includes(`<!-- push:${entry.sha} `))return text;
 const stamp=new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(entry.date));
 const block=`<!-- push:${entry.sha} ${entry.date} -->\n## ${stamp} +08:00 — ${entry.sha.slice(0,7)}\n\n[Compare changes](https://github.com/${entry.repo}/compare/${entry.before}...${entry.sha})\n\n${entry.body||'No additional changes beyond merge synchronization.'}\n\n`;
 const start=text.indexOf('<!-- push:'); const historical=text.indexOf('## Historical summary'); const boundary=start<0?historical:start;
 const intro=boundary<0?text:text.slice(0,boundary); const rest=boundary<0?'':text.slice(boundary);
 const historyIndex=rest.indexOf('## Historical summary'); const history=historyIndex<0?'':rest.slice(historyIndex); const sections=(historyIndex<0?rest:rest.slice(0,historyIndex)).split(/(?=<!-- push:)/).filter(s=>s.trim());
 sections.push(block); sections.sort((a,b)=>b.match(/<!-- push:\S+ (\S+) -->/)[1].localeCompare(a.match(/<!-- push:\S+ (\S+) -->/)[1]));
 return intro+sections.join('')+history;
}
async function api(path){
 const response=await fetch(`https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/${path}`,{headers:{Authorization:`Bearer ${process.env.GH_TOKEN}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'}});
 if(!response.ok)throw new Error(`GitHub API ${response.status} for ${path}`);return response.json();
}
async function pages(path){const out=[];for(let page=1;;page++){const rows=await api(`${path}${path.includes('?')?'&':'?'}per_page=100&page=${page}`);out.push(...rows);if(rows.length<100)return out;}}
function details(sha){const [subject,author,email]=git('show','-s','--format=%s%n%an%n%ae',sha).split('\n');return {sha,subject,author,email,files:git('diff-tree','--no-commit-id','--name-only','-r',sha).split('\n').filter(Boolean)};}
export function deploymentCurrent(source,latest){
 try{git('merge-base','--is-ancestor',source,latest);}catch{return false;}
 return git('rev-list',`${source}..${latest}`).split('\n').filter(Boolean).every(sha=>isGeneratedCommit(details(sha)));
}
async function main(){
 if(process.argv[2]==='check-current'){
  git('fetch','origin','master'); const ok=deploymentCurrent(process.env.GITHUB_SHA,'origin/master');appendFileSync(process.env.GITHUB_OUTPUT,`deploy=${ok}\n`);return;
 }
 const event=JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH,'utf8')); const before=event.before,after=event.after;
 if(!/^[a-f0-9]{40}$/.test(before)||!/[1-9a-f]/.test(before)||! /^[a-f0-9]{40}$/.test(after))throw new Error('Expected an existing master branch push with before/after SHAs');
 git('merge-base','--is-ancestor',before,after);
 const commits=git('rev-list','--reverse',`${before}..${after}`).split('\n').filter(Boolean).map(details);
 const prs=new Map();
 for(const c of commits){c.generated=isGeneratedCommit(c);if(c.generated)continue; const associated=await pages(`commits/${c.sha}/pulls`);for(const p of associated){if(p.merged_at&&p.base.ref==='master'&&commits.some(x=>x.sha===p.merge_commit_sha)){c.pr=p.number;prs.set(p.number,{number:p.number,title:p.title,url:p.html_url});break;}}}
 const body=summarize(commits,[...prs.values()],process.env.GITHUB_REPOSITORY);
 if(!body&&commits.every(c=>c.generated))return;
 const run=await api(`actions/runs/${process.env.GITHUB_RUN_ID}`);
 git('config','user.name','github-actions[bot]');git('config','user.email','41898282+github-actions[bot]@users.noreply.github.com');
 for(let attempt=0;attempt<3;attempt++){
  git('fetch','origin','master');git('checkout','--detach','origin/master');
  const old=readFileSync('CHANGELOG.md','utf8');const next=insertEntry(old,{sha:after,before,date:run.created_at,body,repo:process.env.GITHUB_REPOSITORY});if(old===next)return;
  writeFileSync('CHANGELOG.md',next);git('add','--','CHANGELOG.md');git('commit','-m',`chore(changelog): record ${after} [generated-changelog]`);
  try{git('push','origin','HEAD:master');return;}catch{if(attempt===2)throw new Error('Unable to publish CHANGELOG.md after 3 attempts. Verify Actions write permission and master branch rules, then rerun this workflow.');}
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(error=>{console.error(error.message);process.exitCode=1;});
