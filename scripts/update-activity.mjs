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
  const weeks = calendar.weeks;
  const firstDate = collection.startedAt.slice(0, 10);
  const days = weeks.flatMap(week => week.contributionDays).filter(day => day.date >= firstDate && day.date <= date);
  const { current, longest } = streaks(days, date);
  const max = Math.max(1, ...days.map(day => day.contributionCount));
  const colors = ['#202a38', '#174b43', '#207861', '#35ad80', '#79e2ad'];
  const text = (x, y, content, fill = '#c9d1d9', size = 16, extra = '') => `<text x="${x}" y="${y}" fill="${fill}" font-size="${size}" ${extra}>${escape(content)}</text>`;
  const prompt = (y, command) => text(28, y, 'edu@github', '#79e2ad') + text(128, y, ':', '#c9d1d9') + text(140, y, '~/activity', '#7dcfff') + text(245, y, '$', '#c9d1d9') + text(267, y, command);
  const metric = (x, value, label) => text(x, 140, format(value), '#f0f6fc', 34, 'font-weight="700"') + text(x, 168, label, '#9ba9bc', 14);
  const cells = weeks.map((week, col) => week.contributionDays.filter(day => day.date >= firstDate && day.date <= date).map(day => {
    const level = day.contributionCount === 0 ? 0 : Math.min(4, Math.ceil(day.contributionCount / max * 4));
    return `<rect x="${80 + col * 14}" y="${287 + day.weekday * 14}" width="10" height="10" rx="2" fill="${colors[level]}"><title>${escape(day.date)}: ${day.contributionCount} contribuciones</title></rect>`;
  }).join('')).join('');
  const months = weeks.map((week, col) => {
    const day = week.contributionDays.find(day => day.date.slice(-2) === '01');
    if (!day || col > weeks.length - 3) return '';
    return text(80 + col * 14, 274, new Intl.DateTimeFormat('es', { month: 'short', timeZone: 'UTC' }).format(new Date(day.date)), '#9ba9bc', 12);
  }).join('');
  const label = `${username}: ${format(calendar.totalContributions)} contribuciones en los últimos 12 meses, racha actual de ${current} días y mejor racha del periodo de ${longest} días. ${profile.repositoryCount} repositorios públicos originales y ${profile.stars} estrellas.`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="496" viewBox="0 0 900 496" role="img" aria-labelledby="title description">
<title id="title">Terminal de actividad de ${username}</title>
<desc id="description">${escape(label)} Actualizado el ${date}, UTC.</desc>
<defs><clipPath id="window"><rect x=".5" y=".5" width="899" height="495" rx="12"/></clipPath></defs>
<style>text{font-family:'DejaVu Sans Mono','Liberation Mono',Consolas,monospace}.cursor{animation:blink 1.2s step-end infinite}@keyframes blink{50%{opacity:0}}@media(prefers-reduced-motion:reduce){.cursor{animation:none}}</style>
<g clip-path="url(#window)">
<rect width="900" height="496" fill="#0d1117"/>
<rect width="900" height="38" fill="#21262d"/>
<path d="M17 14h14m-14 5h14m-14 5h14" stroke="#9ba9bc" stroke-width="1.5"/>
${text(450, 24, 'edu@github: ~/activity', '#c9d1d9', 13, 'text-anchor="middle"')}
<path d="M805 20h10m28-5h9v9h-9m25-9 9 9m0-9-9 9" stroke="#9ba9bc" fill="none" stroke-width="1.3"/>
${prompt(79, 'gh stats --last-year')}
${metric(28, calendar.totalContributions, 'CONTRIBUCIONES · 12 MESES')}
${metric(338, current, 'RACHA ACTUAL · DÍAS')}
${metric(638, longest, 'MEJOR RACHA · 12 MESES')}
${text(28, 204, `repos públicos  ${format(profile.repositoryCount)}    estrellas  ${format(profile.stars)}    PRs · 12 meses  ${format(collection.totalPullRequestContributions)}`, '#9ba9bc', 15)}
<path d="M28 225h844" stroke="#21262d"/>
${prompt(252, 'gh contributions --graph')}
${months}
${text(28, 312, 'lun', '#9ba9bc', 12)}${text(28, 340, 'mié', '#9ba9bc', 12)}${text(28, 368, 'vie', '#9ba9bc', 12)}
${cells}
${text(80, 411, `${days[0].date} → ${date} · calendario de GitHub · UTC`, '#9ba9bc', 12)}
${text(708, 411, '−', '#9ba9bc', 13)}${colors.map((color, i) => `<rect x="${727 + i * 16}" y="401" width="10" height="10" rx="2" fill="${color}"/>`).join('')}${text(815, 411, '+', '#9ba9bc', 13)}
<path d="M28 432h844" stroke="#21262d"/>
${text(28, 454, `# actualizado ${date} · GitHub Actions · cada día`, '#9ba9bc', 12)}
${prompt(481, '')}<rect class="cursor" x="267" y="467" width="9" height="17" fill="#79e2ad"/>
</g><rect x=".5" y=".5" width="899" height="495" rx="12" fill="none" stroke="#30363d"/>
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
