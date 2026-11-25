// Builds assets/banner.svg, the macOS terminal at the top of the profile: `node scripts/build-banner.mjs`.
// A real shell session: one font size, each command typed and then its output printed.
import { writeFile } from 'node:fs/promises';
import { colors as C, line, terminal } from './terminal.mjs';

const field = (label, value) => [{ text: `${label}:`.padEnd(11), color: C.faint }, { text: value }];
const dirs = names => names.flatMap(name => [{ text: `${name}/`, color: C.path, bold: true }, { text: '   ' }]);

export function renderBanner() {
  const out = (y, parts) => at => line(y, parts, at);
  return terminal({
    title: {
      text: 'Edu Ballesteros · Backend Java',
      description: 'Desarrollador backend en NTT DATA para Unicaja. Java, Spring Boot e integración bancaria. Sevilla, España.',
      bar: 'edu — zsh — 90×12',
    },
    height: 336,
    steps: [
      { y: 56, command: 'whoami', output: [out(84, [{ text: 'Edu Ballesteros', bold: true }])] },
      {
        y: 116, command: 'cat perfil.txt', output: [
          out(144, field('Rol', 'Backend Java · APIs · IA aplicada')),
          out(172, field('Empresa', 'NTT DATA / Unicaja · Integración bancaria')),
          out(200, field('Stack', 'Java 21 · Spring Boot · PostgreSQL')),
          out(228, field('Ubicación', 'Sevilla, España')),
        ],
      },
      { y: 260, command: 'ls proyectos/', output: [out(288, dirs(['open-engine', 'extrude', 'rhythmos', 'free-my-tv']))], finalY: 318 },
    ],
  });
}

await writeFile(new URL('../assets/banner.svg', import.meta.url), renderBanner());
console.log('Updated banner.svg');
