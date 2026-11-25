// A macOS Terminal window drawn as SVG, with commands that type themselves out.
//
// The animation uses SMIL, which GitHub plays inside <img>. Every element is drawn in its
// final state and the animations only hide things until their moment, so a viewer that
// does not animate still shows the finished terminal.

export const escape = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

const SIZE = 18;        // monospace font size
const CH = SIZE * 0.6;  // advance of one character; textLength pins every font to it
const X = 28;
const mono = "'SF Mono',Menlo,Monaco,'DejaVu Sans Mono','Liberation Mono',Consolas,monospace";
const ui = "-apple-system,BlinkMacSystemFont,'SF Pro Text','Segoe UI','Helvetica Neue',Arial,sans-serif";
const C = { text: '#e5e5e7', faint: '#8e8e93', user: '#30d158', path: '#64d2ff', head: '#ff9f0a', cursor: '#d1d1d6' };
const TYPE = 0.065;     // seconds per typed character

const s = n => `${n.toFixed(2)}s`;
const fixed = text => `textLength="${(text.length * CH).toFixed(1)}" lengthAdjust="spacing"`;
// Hidden until `at`, then shown for good.
const showAt = at => `<animate attributeName="opacity" values="0;1" keyTimes="0;1" calcMode="discrete" dur="${s(at)}" fill="freeze"/>`;

export function line(y, parts, at) {
  const plain = parts.map(p => p.text).join('');
  const spans = parts.map(p => `<tspan${p.color ? ` fill="${p.color}"` : ''}${p.bold ? ' font-weight="700"' : ''}>${escape(p.text)}</tspan>`).join('');
  return `<text x="${X}" y="${y}" xml:space="preserve" ${fixed(plain)}>${at ? showAt(at) : ''}${spans}</text>`;
}

export function terminal({ title, height, user = 'edu@macbook', dir = '~', steps, lastLogin }) {
  const promptText = `${user} ${dir} % `;
  const cmdX = X + promptText.length * CH;
  const prompt = (y, at) => line(y, [
    { text: user, color: C.user, bold: true }, { text: ' ' }, { text: dir, color: C.path, bold: true }, { text: ' % ' },
  ], at);
  let t = 0.5, body = [], defs = [], id = 0;
  if (lastLogin) body.push(line(54, [{ text: lastLogin, color: C.faint }]));

  for (const step of steps) {
    const { y, command } = step;
    // Prompt appears, then the command is revealed one character at a time behind a clip.
    body.push(prompt(y, t > 0.5 ? t : 0));
    const start = t + 0.45, n = command.length, end = start + n * TYPE, total = end + 0.35;
    const times = [0, start / total], widths = [0, 0], xs = [cmdX, cmdX];
    for (let i = 1; i <= n; i++) { times.push((start + i * TYPE) / total); widths.push(i * CH); xs.push(cmdX + i * CH); }
    times.push(1); widths.push(n * CH + 4); xs.push(cmdX + n * CH);
    const kt = times.map(v => v.toFixed(4)).join(';');
    const clip = `type${id++}`;
    defs.push(`<clipPath id="${clip}"><rect x="${cmdX}" y="${y - SIZE}" width="${n * CH + 4}" height="${SIZE + 8}"><animate attributeName="width" values="${widths.map(w => w.toFixed(1)).join(';')}" keyTimes="${kt}" calcMode="discrete" dur="${s(total)}" fill="freeze"/></rect></clipPath>`);
    body.push(`<g clip-path="url(#${clip})"><text x="${cmdX}" y="${y}" xml:space="preserve" ${fixed(command)}>${escape(command)}</text></g>`);
    // The typing cursor walks with the text and disappears when the command runs.
    body.push(`<rect x="${cmdX + n * CH}" y="${y - SIZE + 3}" width="${CH}" height="${SIZE + 3}" fill="${C.cursor}" opacity="0"><animate attributeName="x" values="${xs.map(v => v.toFixed(1)).join(';')}" keyTimes="${kt}" calcMode="discrete" dur="${s(total)}" fill="freeze"/><animate attributeName="opacity" values="1;0" keyTimes="0;1" calcMode="discrete" dur="${s(total)}" fill="freeze"/></rect>`);
    t = total;
    // Output arrives line by line, a little faster than typing.
    for (const out of step.output) body.push(out(t += 0.07));
    t += 0.35;
  }

  // Final prompt with a blinking cursor.
  const lastY = steps.at(-1).finalY;
  body.push(prompt(lastY, t));
  body.push(`<rect x="${cmdX}" y="${lastY - SIZE + 3}" width="${CH}" height="${SIZE + 3}" fill="${C.cursor}">${showAt(t)}<animate attributeName="opacity" values="1;0" calcMode="discrete" dur="1.1s" begin="${s(t)}" repeatCount="indefinite"/></rect>`);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="900" height="${height}" viewBox="0 0 900 ${height}" role="img" aria-labelledby="title description">
<title id="title">${escape(title.text)}</title><desc id="description">${escape(title.description)}</desc>
<defs><clipPath id="win"><rect width="900" height="${height}" rx="12"/></clipPath>
<linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a3c"/><stop offset="1" stop-color="#2c2c2e"/></linearGradient>
${defs.join('\n')}</defs>
<g clip-path="url(#win)"><rect width="900" height="${height}" fill="#1c1c1e"/>
<rect width="900" height="30" fill="url(#bar)"/><path d="M0 30.5h900" stroke="#000" stroke-opacity=".6"/>
<circle cx="20" cy="15" r="6.5" fill="#ff5f57"/><circle cx="41" cy="15" r="6.5" fill="#febc2e"/><circle cx="62" cy="15" r="6.5" fill="#28c840"/>
<text x="450" y="20" text-anchor="middle" font-family="${ui}" font-size="13" font-weight="600" fill="#a1a1a6">${escape(title.bar)}</text>
<g font-family="${mono}" font-size="${SIZE}" fill="${C.text}">
${body.join('\n')}
</g></g><rect x=".5" y=".5" width="899" height="${height - 1}" rx="12" fill="none" stroke="#48484a"/></svg>\n`;
}

// A free-form line (any size or weight) that appears at `at`.
export const raw = (y, attrs, content, at) => `<text x="${X}" y="${y}" xml:space="preserve" ${attrs}>${showAt(at)}${content}</text>`;
export const colors = C;
export const charWidth = CH;
