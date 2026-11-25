import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const username = 'eduballesteros';
const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);
const format = value => new Intl.NumberFormat('es-ES').format(value);
const today = new Date().toISOString().slice(0, 10);
const query = `query($login: String!, $after: String) {
  user(login: $login) {
    repositories(first: 100, after: $after, ownerAffiliations: OWNER, privacy: PUBLIC, isFork: false) {
      totalCount nodes { stargazerCount } pageInfo { hasNextPage endCursor }
    }
    contributionsCollection {
      startedAt totalPullRequestContributions
      contributionCalendar { totalContributions weeks { contributionDays { date contributionCount weekday } } }
    }
  }
}`;

export function streaks(days, date) {
  let run = 0, longest = 0;
  for (const day of days) {
    run = day.contributionCount > 0 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  let end = days.findIndex(day => day.date === date);
  if (end < 0) throw new Error('Calendar does not include the current UTC date');
  if (days[end].contributionCount === 0) end--;
  let current = 0;
  while (end >= 0 && days[end--].contributionCount > 0) current++;
  return { current, longest };
}

function graphql(after) {
  const response = JSON.parse(execFileSync('gh', ['api', 'graphql', '--input', '-'], {
    input: JSON.stringify({ query, variables: { login: username, after } }),
    encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'],
  }));
  if (response.errors?.length || !response.data?.user) throw new Error('GitHub did not return a valid profile');
  return response.data.user;
}

const text = (x,y,value,color='#2e3436',extra='') => `<text x="${x}" y="${y}" fill="${color}" xml:space="preserve" ${extra}>${escape(value)}</text>`;
const prompt = (x,y,command='') => `<text x="${x}" y="${y}" xml:space="preserve"><tspan fill="#386b08" font-weight="700">edu@sevilla</tspan><tspan>:</tspan><tspan fill="#245c91" font-weight="700">~/github</tspan><tspan>$ ${escape(command)}</tspan></text>`;
const field = (x,y,label,value) => `<text x="${x}" y="${y}" xml:space="preserve"><tspan fill="#a45400" font-weight="700">${escape(label)}</tspan><tspan>: ${escape(value)}</tspan></text>`;
const frame = function frame(height,title,description,body,status) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${height}" viewBox="0 0 900 ${height}" role="img" aria-labelledby="title description">
<title id="title">${escape(title)}</title><desc id="description">${escape(description)}</desc>
<defs><clipPath id="win"><rect width="900" height="${height}" rx="12"/></clipPath></defs>
<style>.cursor{animation:blink 1.1s step-end infinite}@keyframes blink{50%{opacity:0}}@media(prefers-reduced-motion:reduce){.cursor{animation:none}}</style>
<g clip-path="url(#win)"><rect width="900" height="${height}" fill="#fff"/>
<rect width="900" height="40" fill="#f1f1f1"/><path d="M0 40h900" stroke="#d3d7cf"/>
<path d="M16 14h14m-14 6h14m-14 6h14" stroke="#555753" stroke-width="1.6" stroke-linecap="round"/>
<text x="450" y="26" text-anchor="middle" font-family="'Ubuntu','Cantarell','Segoe UI',Arial,sans-serif" font-size="16" font-weight="700" fill="#2e3436">edu@sevilla: ~/github</text>
<circle cx="816" cy="20" r="11" fill="#e2e2e2"/><path d="M811 24h10" stroke="#555753" stroke-width="1.6"/>
<circle cx="847" cy="20" r="11" fill="#e2e2e2"/><rect x="842.5" y="15.5" width="9" height="9" rx="1" fill="none" stroke="#555753" stroke-width="1.5"/>
<circle cx="878" cy="20" r="11" fill="#e95420"/><path d="m874 16 8 8m0-8-8 8" stroke="#fff" stroke-width="1.6"/>
<g font-family="Menlo,'DejaVu Sans Mono','Liberation Mono','Courier New',monospace" font-size="20" fill="#2e3436">${body}</g>
<rect y="${height-30}" width="900" height="30" fill="#e6eddc"/>
<text x="16" y="${height-10}" font-family="Menlo,'DejaVu Sans Mono',monospace" font-size="16" fill="#344326">${escape(status)}</text>
</g><rect x=".5" y=".5" width="899" height="${height-1}" rx="12" fill="none" stroke="#d3d7cf"/></svg>\n`;
};
export function render(profile, date) {
  const collection = profile.contributionsCollection;
  const calendar = collection.contributionCalendar;
  const firstDate = collection.startedAt.slice(0, 10);
  const days = calendar.weeks.flatMap(week => week.contributionDays).filter(day => day.date >= firstDate && day.date <= date);
  const { current, longest } = streaks(days, date);
  const description = `${username}: ${format(calendar.totalContributions)} contribuciones en los últimos 12 meses. Racha actual: ${current} días. Mejor racha del periodo: ${longest} días.`;
  const body = [
    prompt(28,84,'gh stats --last-year'),
    text(28,132,'GITHUB · ÚLTIMOS 12 MESES','#386b08','font-weight="700"'),
    field(28,174,'Contribuciones',format(calendar.totalContributions)),
    field(28,210,'Pull requests',format(collection.totalPullRequestContributions)),
    field(28,246,'Repos públicos',format(profile.repositoryCount)),
    field(28,282,'Estrellas',format(profile.stars)),
    text(490,132,'RACHAS DE CONTRIBUCIONES','#386b08','font-weight="700"'),
    field(490,174,'Actual',`${current} ${current === 1 ? 'día' : 'días'}`),
    field(490,210,'Mejor',`${longest} ${longest === 1 ? 'día' : 'días'}`),
    field(490,246,'Desde',days[0].date),
    field(490,282,'Hasta',date),
    prompt(28,340),'<rect class="cursor" x="292" y="322" width="11" height="23" fill="#2e3436"/>',
  ].join('\n');
  return frame(398,'Terminal Linux · Actividad de GitHub',description,body,`[edu] stats · actualizado ${date} UTC · cada día`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  let profile;
  if (process.argv[2]) {
    profile = JSON.parse(await readFile(process.argv[2], 'utf8'));
  } else {
    profile = graphql(null);
    let repos = profile.repositories;
    profile.repositoryCount = repos.totalCount;
    profile.stars = 0;
    while (true) {
      profile.stars += repos.nodes.reduce((sum, repo) => sum + repo.stargazerCount, 0);
      if (!repos.pageInfo.hasNextPage) break;
      repos = graphql(repos.pageInfo.endCursor).repositories;
    }
  }
  const svg = render(profile, today);
  await mkdir(new URL('assets/', root), { recursive: true });
  await writeFile(new URL('assets/activity-terminal.svg', root), svg);
  console.log(`Updated activity-terminal.svg from real GitHub data (${today})`);
}
