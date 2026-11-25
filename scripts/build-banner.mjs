// Builds assets/banner.svg, the macOS terminal at the top of the profile: `node scripts/build-banner.mjs`.
import { writeFile } from 'node:fs/promises';
import { colors as C, escape, line, raw, terminal } from './terminal.mjs';

export function renderBanner() {
  return terminal({
    title: {
      text: 'Edu Ballesteros · Backend Java',
      description: 'Desarrollador backend en NTT DATA para Unicaja. Java, Spring Boot e integración bancaria. Sevilla, España.',
      bar: 'edu — whoami — zsh — 90×16',
    },
    height: 330,
    steps: [{
      y: 60, command: 'whoami', finalY: 288,
      output: [
        at => raw(124, 'font-size="40" font-weight="700"', `${escape('Edu Ballesteros')}<tspan fill="${C.head}">.</tspan>`, at),
        at => raw(166, `font-size="22" font-weight="700" fill="${C.head}"`, escape('Backend Java · APIs · IA aplicada'), at),
        at => line(204, [{ text: 'NTT DATA / Unicaja · Integración bancaria' }], at),
        at => line(236, [{ text: 'Sevilla, España · Java & Spring Boot', color: C.faint }], at),
      ],
    }],
  });
}

await writeFile(new URL('../assets/banner.svg', import.meta.url), renderBanner());
console.log('Updated banner.svg');
