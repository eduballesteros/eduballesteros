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

export function render(profile, date) {
  const collection = profile.contributionsCollection;
  const calendar = collection.contributionCalendar;
  const firstDate = collection.startedAt.slice(0, 10);
  const days = calendar.weeks.flatMap(week => week.contributionDays).filter(day => day.date >= firstDate && day.date <= date);
  const { current, longest } = streaks(days, date);
  const ink = '#2e3436', green = '#386b08', blue = '#245c91', orange = '#a45400';
  const text = (x, y, value, color = ink, extra = '') => `<text x="${x}" y="${y}" fill="${color}" xml:space="preserve" ${extra}>${escape(value)}</text>`;
  const prompt = (x, y, command = '') => `<text x="${x}" y="${y}" xml:space="preserve"><tspan fill="${green}" font-weight="700">edu@sevilla</tspan><tspan>:</tspan><tspan fill="${blue}" font-weight="700">~/github</tspan><tspan>$ ${escape(command)}</tspan></text>`;
  const field = (x, y, label, value) => `<text x="${x}" y="${y}" xml:space="preserve"><tspan fill="${orange}" font-weight="700">${escape(label)}</tspan><tspan>: ${escape(value)}</tspan></text>`;
  const label = `${username}: ${format(calendar.totalContributions)} contribuciones en los últimos 12 meses, racha actual de ${current} días y mejor racha del periodo de ${longest} días. ${profile.repositoryCount} repositorios públicos originales y ${profile.stars} estrellas.`;
  const tux = ['    .--.', '   |o_o |', '   |:_/ |', '  //   \\ \\', ' (|     | )', "/'\\_   _/`\\", '\\___)=(___/'];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360" role="img" aria-labelledby="title description">
<title id="title">Terminal Linux de actividad de ${username}</title>
<desc id="description">${escape(label)} Actualizado el ${date}, UTC.</desc>
<defs><clipPath id="win"><rect width="1200" height="360" rx="12"/></clipPath></defs>
<style>.cursor{animation:blink 1.1s step-end infinite}@keyframes blink{50%{opacity:0}}@media(prefers-reduced-motion:reduce){.cursor{animation:none}}</style>
<g clip-path="url(#win)">
<rect width="1200" height="360" fill="#ffffff"/>
<rect width="1200" height="34" fill="#f1f1f1"/>
<path d="M0 34.5h1200" stroke="#d3d7cf"/>
<g stroke="#555753" stroke-width="1.6" stroke-linecap="round"><path d="M16 12h14m-14 5h14m-14 5h14"/></g>
<text x="600" y="22" text-anchor="middle" font-family="'Ubuntu','Cantarell','Segoe UI',Helvetica,Arial,sans-serif" font-size="13" font-weight="700" fill="#2e3436">edu@sevilla: ~/github</text>
<circle cx="1120" cy="17" r="10" fill="#e2e2e2"/><path d="M1115 21h10" stroke="#555753" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="1148" cy="17" r="10" fill="#e2e2e2"/><rect x="1143.5" y="12.5" width="9" height="9" rx="1" fill="none" stroke="#555753" stroke-width="1.5"/>
<circle cx="1176" cy="17" r="10" fill="#e95420"/><path d="m1172 13 8 8m0-8-8 8" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>
<path d="M640.5 35v303" stroke="#c8d4be"/>
<g font-family="Menlo,'DejaVu Sans Mono','Liberation Mono','Courier New',monospace" font-size="14" fill="${ink}">
${prompt(28, 62, 'gh stats --last-year')}
${tux.map((line, i) => text(28, 104 + i * 21, line, orange, 'font-weight="700"')).join('')}
${text(190, 104, username, green, 'font-weight="700"')}
${text(190, 125, '--------------')}
${field(190, 146, 'Contribuciones', format(calendar.totalContributions))}
${field(190, 167, 'Pull requests', format(collection.totalPullRequestContributions))}
${field(190, 188, 'Repos públicos', format(profile.repositoryCount))}
${field(190, 209, 'Estrellas', format(profile.stars))}
${field(190, 251, 'Periodo', 'últimos 12 meses')}
${field(190, 272, 'Fuente', 'GitHub API')}
${prompt(28, 314)}<rect class="cursor" x="213" y="301" width="8" height="16" fill="${ink}"/>
${prompt(664, 62, 'gh streak --last-year')}
${text(664, 104, 'RACHAS DE CONTRIBUCIONES', green, 'font-weight="700"')}
${text(664, 125, '-----------------------')}
${field(664, 146, 'Actual', `${current} ${current === 1 ? 'día' : 'días'}`)}
${field(664, 167, 'Mejor del periodo', `${longest} ${longest === 1 ? 'día' : 'días'}`)}
${field(664, 209, 'Desde', days[0].date)}
${field(664, 230, 'Hasta', date)}
${text(664, 272, '# actualización automática diaria', '#666b68')}
${prompt(664, 314)}<rect class="cursor" x="849" y="301" width="8" height="16" fill="${ink}"/>
</g>
<rect y="338" width="1200" height="22" fill="#e6eddc"/>
<g font-family="Menlo,'DejaVu Sans Mono','Liberation Mono','Courier New',monospace" font-size="12" fill="#344326">
${text(12, 353, '[edu] 0:stats*  1:streaks-', '#344326')}
${text(1188, 353, `"sevilla" · ${date} UTC`, '#344326', 'text-anchor="end"')}
</g></g><rect x="0.5" y="0.5" width="1199" height="359" rx="12" fill="none" stroke="#d3d7cf"/>
</svg>\n`;
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
