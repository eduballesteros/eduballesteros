import { execFileSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { colors as C, line, terminal } from './terminal.mjs';

const root = new URL('../', import.meta.url);
const username = 'eduballesteros';
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

const COL = 42; // the right column starts at this character
const days = n => `${n} ${n === 1 ? 'día' : 'días'}`;
// One output row holding both columns: "label:  value" padded to the column.
function row(left, right) {
  const cell = ([label, value], width) => [
    { text: `${label}:`.padEnd(width), color: C.faint }, { text: value, bold: true },
  ];
  const l = cell(left, 16), used = l.reduce((n, p) => n + p.text.length, 0);
  return [...l, { text: ' '.repeat(Math.max(1, COL - used)) }, ...cell(right, 8)];
}
const heads = (left, right) => [{ text: left.padEnd(COL), color: C.head, bold: true }, { text: right, color: C.head, bold: true }];

export function render(profile, date) {
  const collection = profile.contributionsCollection;
  const calendar = collection.contributionCalendar;
  const firstDate = collection.startedAt.slice(0, 10);
  const dayList = calendar.weeks.flatMap(week => week.contributionDays).filter(day => day.date >= firstDate && day.date <= date);
  const { current, longest } = streaks(dayList, date);
  const description = `${username}: ${format(calendar.totalContributions)} contribuciones en los últimos 12 meses. Racha actual: ${current} días. Mejor racha del periodo: ${longest} días.`;
  const login = new Date(`${date}T06:23:00Z`).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: '2-digit', timeZone: 'UTC' }).replace(',', '');
  const rows = [
    heads('GITHUB · ÚLTIMOS 12 MESES', 'RACHAS'),
    row(['Contribuciones', format(calendar.totalContributions)], ['Actual', days(current)]),
    row(['Pull requests', format(collection.totalPullRequestContributions)], ['Mejor', days(longest)]),
    row(['Repos públicos', format(profile.repositoryCount)], ['Desde', dayList[0].date]),
    row(['Estrellas', format(profile.stars)], ['Hasta', date]),
  ];
  const ys = [136, 172, 202, 232, 262];
  return terminal({
    title: { text: 'Terminal · Actividad de GitHub', description, bar: 'edu — gh stats — zsh — 90×18' },
    height: 360,
    dir: '~/github',
    lastLogin: `Last login: ${login} 06:23 on ttys001`,
    steps: [{
      y: 92, command: 'gh stats --last-year', finalY: 318,
      output: rows.map((parts, i) => at => line(ys[i], parts, at)),
    }],
  });
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
