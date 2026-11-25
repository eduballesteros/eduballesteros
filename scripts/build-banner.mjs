// Builds assets/banner.svg, the macOS terminal at the top of the profile: `node scripts/build-banner.mjs`.
// A real shell session in one font size: `whoami`, then `neofetch` with an ASCII logo and the profile.
import { writeFile } from 'node:fs/promises';
import { charWidth, colors as C, line, showAt, terminal } from './terminal.mjs';

// The logo is drawn as character-sized blocks, the way █ fills a terminal cell, so it stays solid
// in any font (glyphs like █ and ╗ come out with gaps when the font is stretched).
const ART = [
  '█████  ██████ ',
  '██     ██   ██',
  '████   ██████ ',
  '██     ██   ██',
  '█████  ██████ ',
];
const ART_COLORS = ['#ffb340', '#ff9f0a', '#ff7f3a', '#ff6458', '#ff4f78'];
const block = (row, color, y, dx = 0) => [...row].map((c, i) => c === '█' ? `<rect x="${(28 + dx + i * charWidth).toFixed(1)}" y="${y + dx}" width="${(charWidth + 0.4).toFixed(1)}" height="25" fill="${color}"/>` : '').join('');
const INFO = [
  [{ text: 'edu', color: C.user, bold: true }, { text: '@' }, { text: 'macbook', color: C.user, bold: true }],
  [{ text: '-----------' }],
  ...[
    ['Nombre', 'Edu Ballesteros'],
    ['Rol', 'Backend Java · APIs · IA aplicada'],
    ['Empresa', 'NTT DATA / Unicaja · Integración bancaria'],
    ['Stack', 'Java 21 · Spring Boot · PostgreSQL'],
    ['Ubicación', 'Sevilla, España'],
  ].map(([label, value]) => [{ text: `${label}: `, color: C.head, bold: true }, { text: value }]),
];
const PALETTE = ['#1c1c1e', '#ff453a', '#30d158', '#ffd60a', '#0a84ff', '#bf5af2', '#64d2ff', '#e5e5e7'];

export function renderBanner() {
  const top = 172, infoStep = 25, infoX = 28 + 19 * charWidth;
  const rows = [];
  // neofetch prints row by row: the logo row and the info row beside it arrive together.
  for (let i = 0; i < INFO.length; i++) {
    rows.push(at => [
      i < ART.length ? `<g shape-rendering="crispEdges">${showAt(at)}${block(ART[i], '#3a3a3c', top - 18 + i * 25, 3)}${block(ART[i], ART_COLORS[i], top - 18 + i * 25)}</g>` : '',
      line(top + i * infoStep, INFO[i], at, infoX),
    ].join(''));
  }
  const blocksY = top + INFO.length * infoStep - 8;
  rows.push(at => `<g>${showAt(at)}${PALETTE.map((c, i) => `<rect x="${(infoX + i * 3 * charWidth).toFixed(1)}" y="${blocksY}" width="${(3 * charWidth).toFixed(1)}" height="20" fill="${c}"${i === 0 ? ' stroke="#48484a"' : ''}/>`).join('')}</g>`);

  return terminal({
    title: {
      text: 'Edu Ballesteros · Backend Java',
      description: 'Desarrollador backend en NTT DATA para Unicaja. Java, Spring Boot e integración bancaria. Sevilla, España.',
      bar: 'edu — neofetch — zsh — 90×16',
    },
    height: 430,
    lastLogin: 'Last login: Wed Nov 25 06:23 on ttys000',
    steps: [
      { y: 86, command: 'whoami', output: [at => line(111, [{ text: 'edu' }], at)] },
      { y: 142, command: 'neofetch', output: rows, finalY: blocksY + 54 },
    ],
  });
}

await writeFile(new URL('../assets/banner.svg', import.meta.url), renderBanner());
console.log('Updated banner.svg');
