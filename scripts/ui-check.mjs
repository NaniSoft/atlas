#!/usr/bin/env node
/**
 * UI compliance gate — mission §11 (`npm run ui:check`).
 *
 * AST-based (parsed with the Babel parser bundled in Next, so no new
 * dependency is introduced for the gate), stylesheet-parsing, and
 * manifest/lockfile aware. It is the one place the mission's UI001–012 /
 * ASSET001–014 codes are asserted for this repository. Run
 * `node scripts/ui-check.mjs --help` for the fixes each code demands.
 *
 * Data consumed, never restated as rules:
 * - DS variants/budgets: `@nanisoft/prism-ui/dist/assets/manifest.json`
 * - DS-published classes: `@nanisoft/prism-ui/styles.css`
 * - Site assets: `assets/manifest.json`
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_ROOTS = ['app', 'components', 'lib', 'content'];
const ROOT_FILES = ['next.config.ts', 'vitest.config.mts', 'playwright.config.ts'];
const DS_CSS_IMPORT = '@nanisoft/prism-ui/styles.css';

const requireFromGate = createRequire(import.meta.url);
// Next bundles its Babel parser; reusing it keeps the gate off a new parser
// dependency. The bundle is CommonJS, loaded through require.
const babelParser = requireFromGate(path.join(ROOT, 'node_modules/next/dist/compiled/babel/parser.js'));

/** Production dependencies allowed to declare in package.json. */
const ALLOWED_PROD_DEPS = new Set([
  '@nanisoft/prism-ui',
  'fumadocs-core',
  'fumadocs-mdx',
  'next',
  'react',
  'react-dom',
  'zod',
]);

/** Any package that styles: direct or standalone-transitive presence is UI007. */
const STYLING_PACKAGES = [
  'tailwindcss',
  'styled-components',
  '@emotion/react',
  '@emotion/styled',
  'bootstrap',
  'jss',
  'stylis',
  'sass',
  'less',
  'stylus',
];

/** Direct icon/UI imports that must come through DSIcon / prism-ui. */
const DIRECT_UI_IMPORTS = [
  'lucide-react',
  '@radix-ui/',
  '@mui/',
  '@chakra-ui/',
  '@ant-design/',
  'antd',
  'react-icons',
  'font-awesome',
];

/** The fix each code prints with its finding. */
export const FIXES = {
  UI001: 'Delete the sheet. The only permitted styling entry point is the DS entry required by the framework.',
  UI002: 'Remove the style prop. Use an approved DS component/prop — the design system owns presentation.',
  UI003: 'Use an approved semantic token or request a new token from the design system team.',
  UI004: 'Ban site and arbitrary classes. Compose with DS primitives (DSStack, DSGrid, Diagram, ListPanel); DS layout passthrough is allowed only with DS-published classes.',
  UI005: 'Import from the approved public package API of @nanisoft/prism-ui only.',
  UI006: 'Remove the custom property. Request the token centrally; do not declare --* in the application.',
  UI007: 'Remove the styling dependency. The DS package owns all visual presentation.',
  UI008: 'Remove the override. A DS surface is restyled centrally, never overridden by a consumer value.',
  UI009: 'Remove the font declaration or import. The DS typeface arrives from the DS stylesheet.',
  UI010: 'Remove the DOM mutation. Style through DS components and tokens, never by writing to the DOM.',
  UI011: 'Remove the custom breakpoint/variant. Use DS layout primitives and let the DS own responsive behaviour.',
  UI012: 'Replace with the DS equivalent (Button, Input, Select, Dialog, Table, Card, …). Native primitives are a local design system.',
  ASSET001: 'Use DSImage (or the DS media component for the content kind) with an approved variant.',
  ASSET002: 'Use an approved variant in the DS manifest. Arbitrary rendered sizes are prohibited.',
  ASSET003: 'Replace the asset with one matching the variant ratio, or declare the correct variant centrally.',
  ASSET004: 'Register the asset in assets/manifest.json, or serve it from the DS asset distribution.',
  ASSET005: 'Replace with an approved format for the variant (see assets/manifest.json).',
  ASSET006: 'Re-export or compress the asset to the variant budget in assets/manifest.json.',
  ASSET007: 'Remove the active content (script, handler, foreignObject). SVG assets must be static drawings.',
  ASSET008: 'Use DSIcon by registry name; SVGs are consumed as registered assets, never imported or drawn inline.',
  ASSET009: 'Remove the font or register it in assets/manifest.json as woff2 under the font budget.',
  ASSET010: 'Remove object-fit/object-position. Use DSImage with an approved variant; the DS owns fit and position.',
  ASSET011: 'Express responsive choice through the DS asset component and its governed sources.',
  ASSET012: 'Supply intrinsic width and height (DSImage width/height) so layout can reserve the frame.',
  ASSET013: 'Replace with a source at least 2x the maximum rendered size in assets/manifest.json.',
  ASSET014: 'Remove the override. The application supplies content and selects a variant; the DS owns presentation.',
};

const STYLE_FILE_RE = /\.(css|scss|sass|less|styl|stylus)$/i;
const HEX_RE = /#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/;
const COLOR_FN_RE = /\b(?:rgb|rgba|hsl|hsla|oklab|oklch|color-mix)\s*\(/;
const CSS_VAR_RE = /--[a-zA-Z0-9-]+/;
const VARIANTS_RE = /(?:sm:|md:|lg:|xl:|2xl:)/;
const OBJECT_FIT_RE = /object-[a-z-]+/;
const HEX_EXEMPT_FILES = new Set(['app/icon.svg'])

export function dsPublishedClasses() {
  const css = readFileSync(
    path.join(ROOT, 'node_modules/@nanisoft/prism-ui/dist/styles.css'),
    'utf8',
  );
  const set = new Set();
  // Variant selectors are escaped in the sheet (`sm\:inline-flex`), so the
  // plain identifier read missed every responsive class the design system
  // publishes and the variant rule below failed classes the sheet carries.
  // The escape is read and converted to the form a className writes.
  for (const m of css.matchAll(/\.([a-zA-Z_][a-zA-Z0-9_-]*(?:\\:[a-zA-Z0-9_-]+)*)/g)) {
    set.add(m[1].replaceAll('\\:', ':'));
  }
  return set;
}

function rel(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function walkFiles(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

export function sourceFiles() {
  const files = SOURCE_ROOTS.flatMap((r) => walkFiles(path.join(ROOT, r)));
  return files
    .filter((f) => /\.(ts|tsx)$/.test(f))
    .concat(ROOT_FILES.map((f) => path.join(ROOT, f)).filter((f) => existsSync(f)));
}

export function styleSheetFiles() {
  const files = SOURCE_ROOTS.flatMap((r) => walkFiles(path.join(ROOT, r)));
  return files.filter((f) => STYLE_FILE_RE.test(f));
}

/** Attribute string value: literal text, or null when it is dynamic. */
function attrText(attr) {
  const value = attr.value;
  if (value == null) return null;
  if (value.type === 'StringLiteral') return value.value;
  if (value.type === 'JSXExpressionContainer') {
    const expr = value.expression;
    if (expr.type === 'StringLiteral') return expr.value;
    if (expr.type === 'TemplateLiteral') return null; // dynamic
    return null;
  }
  return null;
}

function classTokens(text) {
  return text.split(/\s+/).filter(Boolean);
}

/** Walk a Babel AST with a visitor; `loc` gives the finding's line. */
export function checkFile(file, published) {
  const findings = [];
  const source = readFileSync(file, 'utf8');
  const display = rel(file);
  const add = (code, line, detail) => findings.push({ code, file: display, line: line ?? 1, detail });

  let ast;
  try {
    ast = babelParser.parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx'],
      errorRecovery: true,
      ranges: true,
    });
  } catch {
    return findings;
  }

  const visit = (node) => {
    if (!node || typeof node !== 'object') return;
    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }
    if (typeof node.type === 'string') {
      const line = node.loc?.start?.line;

      if (node.type === 'ImportDeclaration') {
        const spec = node.source?.value ?? '';
        if (STYLE_FILE_RE.test(spec) && spec !== DS_CSS_IMPORT) {
          add('UI001', line, `Custom stylesheet import detected: ${spec}.`);
        }
        if (STYLING_PACKAGES.some((p) => spec === p || spec.startsWith(`${p}/`))) {
          add('UI007', line, `Unapproved styling dependency import detected: ${spec}.`);
        }
        for (const pkg of DIRECT_UI_IMPORTS) {
          if (spec === pkg || spec.startsWith(pkg)) {
            add('UI005', line, `Unapproved UI import detected: ${spec}.`);
          }
        }
        if (spec.endsWith('.svg')) {
          add('ASSET008', line, `Unapproved SVG import detected: ${spec}. Use DSIcon by name or a registered asset.`);
        }
        if (spec.startsWith('next/font') || /font.*css$/i.test(spec)) {
          add('UI009', line, `Unapproved font import detected: ${spec}.`);
        }
        if (/^fumadocs-(core|mdx)\/(ui|.*ui.*)/.test(spec) || spec === 'fumadocs-ui') {
          add('UI007', line, `Unapproved docs-UI import detected: ${spec}. Docs render through Prism DocsShell.`);
        }
      }

      if (node.type === 'StringLiteral') {
        const text = node.value;
        if (!HEX_EXEMPT_FILES.has(display)) {
          if (HEX_RE.test(text) || COLOR_FN_RE.test(text)) {
            add('UI003', line, 'Hardcoded colour detected.');
          }
        }
        if (CSS_VAR_RE.test(text)) {
          add('UI006', line, 'Custom CSS variable detected.');
        }
      }

      if (node.type === 'JSXOpeningElement' || node.type === 'JSXSelfClosingElement') {
        const tag = node.name?.name ?? '';
        const isNative = /^[a-z]/.test(tag);

        if (tag === 'img' || tag === 'Image') {
          add('ASSET001', line, `Raw image rendering detected: <${tag}>.`);
        }
        if (tag === 'svg') {
          add('ASSET008', line, 'Inline SVG creation detected. Use DSIcon, DSLogo, DSIllustration, or Diagram.');
        }
        if (/^(button|input|textarea|select|dialog)$/.test(tag)) {
          add('UI012', line, `Locally implemented visual primitive detected: <${tag}>. Use the DS equivalent.`);
        }

        const attrMap = {};
        for (const attr of node.attributes ?? []) {
          if (attr.type !== 'JSXAttribute') continue;
          const name = attr.name?.name ?? '';
          attrMap[name] = attr;
          const apos = attr.loc?.start?.line ?? line;

          if (name === 'style') {
            add('UI002', apos, 'Inline styles detected.');
            const initText = attr.value?.type === 'JSXExpressionContainer' ? JSON.stringify(attr.value.expression) : '';
            if (/objectFit|objectPosition/.test(initText)) {
              add('ASSET010', apos, 'Arbitrary object-fit or object-position is prohibited. Use DSImage with an approved variant.');
            }
            if (/aspectRatio/.test(initText)) {
              add('ASSET014', apos, 'Asset presentation bypass detected: aspectRatio is a DS presentation property.');
            }
          }

          if (name === 'className') {
            const text = attrText(attr);
            if (text === null) {
              add('UI004', apos, 'Dynamic class generation detected.');
            } else {
              const flat = classTokens(text);
              if (flat.some((t) => /\[.*\]/.test(t))) {
                add('UI004', apos, 'Arbitrary styling classes detected.');
              }
              if (isNative) {
                if (flat.length > 0) {
                  const nonPrism = flat.filter((t) => !t.startsWith('prism-'));
                  if (nonPrism.length > 0) {
                    add('UI004', apos, `Class "${flat.join(' ')}" on native <${tag}>. Compose with DS primitives.`);
                  }
                }
              } else {
                for (const t of flat) {
                  if (!published.has(t)) {
                    add('UI008', apos, `Design-system component override detected: class "${t}" is not DS-published.`);
                  }
                  if (OBJECT_FIT_RE.test(t)) {
                    add('ASSET014', apos, `Asset presentation bypass detected: class "${t}".`);
                  }
                }
              }
              // A responsive variant is the design system's own behaviour when
              // the sheet publishes it (Prism 1.9 emits the pair the site-navbar
              // documentation prescribes) and a finding when it does not: a
              // variant no rule in the sheet answers is dead at every width.
              const unapprovedVariant = flat.find((t) => VARIANTS_RE.test(t) && !published.has(t));
              if (unapprovedVariant) {
                add('UI011', line, `Unapproved responsive styling detected: class "${unapprovedVariant}" is not DS-published.`);
              }
              if (flat.some((t) => OBJECT_FIT_RE.test(t))) {
                add('ASSET010', line, 'Arbitrary object-fit or object-position is prohibited. Use DSImage with an approved variant.');
              }
            }
          }
        }

        if (tag === 'DSImage') {
          const props = new Set(Object.keys(attrMap));
          const variantAttr = attrMap.variant;
          const variantText = variantAttr ? attrText(variantAttr) : 'card';
          const variant = loadSiteManifest().variants[variantText ?? 'card'];
          if (!variant) {
            add('ASSET002', line, `Unapproved image variant "${variantText}". Use a variant in assets/manifest.json.`);
          }
          if (!props.has('width') || !props.has('height')) {
            add('ASSET012', line, 'Missing intrinsic dimensions on DSImage.');
          }
          if (props.has('objectFit') || props.has('aspectRatio')) {
            add('ASSET014', line, 'Asset presentation bypass detected on DSImage.');
          }
          if ((props.has('srcSet') && !props.has('sizes')) || (!props.has('srcSet') && props.has('sizes'))) {
            add('ASSET011', line, 'Responsive asset contract violation: srcSet and sizes must pair.');
          }
        }
        if (tag === 'DSLogo' || tag === 'DSIllustration' || tag === 'DSAvatar') {
          if ('objectFit' in attrMap || 'aspectRatio' in attrMap) {
            add('ASSET014', line, 'Asset presentation bypass detected on a DS media component.');
          }
        }
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'range' || key === 'start' || key === 'end') continue;
      visit(node[key]);
    }
  };
  visit(ast);

  // Line scans for bypasses the AST cannot see. Comments are stripped for the
  // colour/font scans; suppression scans read raw source.
  const rawLines = source.split('\n');
  rawLines.forEach((lineText, i) => {
    const line = i + 1;
    if (/eslint-disable|oxlint-disable|@ts-ignore|@ts-expect-error|@ts-nocheck/.test(lineText)) {
      findings.push({ code: 'UI008', file: display, line, detail: 'Gate suppression detected. Fix the violation or record an approved exception in UI-GOVERNANCE.md.' });
    }
    if (/\.style\s*\.|\.style\s*=|setProperty\s*\(|document\.[a-zA-Z]+\.style/.test(lineText)) {
      findings.push({ code: 'UI010', file: display, line, detail: 'Direct DOM styling detected.' });
    }
  });
  const noComments = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const countLines = (s, idx) => s.slice(0, idx).split('\n').length;
  for (const m of noComments.matchAll(/@font-face|next\/font|font-family\s*:|fontFamily\s*:/g)) {
    findings.push({ code: 'UI009', file: display, line: countLines(source, m.index), detail: 'Unapproved font declaration detected.' });
  }
  for (const m of noComments.matchAll(/@media[^{]*/g)) {
    findings.push({ code: 'UI011', file: display, line: countLines(source, m.index), detail: 'Custom media query detected.' });
  }

  return findings;
}

export function loadSiteManifest() {
  return JSON.parse(readFileSync(path.join(ROOT, 'assets/manifest.json'), 'utf8'));
}

export function loadDsManifest() {
  return JSON.parse(readFileSync(path.join(ROOT, 'node_modules/@nanisoft/prism-ui/dist/assets/manifest.json'), 'utf8'));
}

function pngSize(file) {
  const buf = readFileSync(file);
  if (buf.length < 33 || buf[0] !== 0x89 || buf[1] !== 0x50) return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function svgText(file) {
  return readFileSync(file, 'utf8');
}

function ratioOf(w, h) {
  if (!w || !h) return null;
  return Math.round((w / h) * 1000) / 1000;
}

function parseRatio(ratioStr) {
  if (!ratioStr) return null;
  const [a, b] = ratioStr.split('/').map((s) => Number(String(s).trim()));
  if (!a || !b) return null;
  return a / b;
}

export function checkAssets() {
  const findings = [];
  const add = (code, file, detail) => findings.push({ code, file, line: 1, detail });
  const site = loadSiteManifest();
  const budgets = { ...loadDsManifest().budgetsKiB, ...site.budgetsKiB };
  const variants = { ...loadDsManifest().variants, ...site.variants };

  for (const asset of site.assets ?? []) {
    const full = path.join(ROOT, asset.file);
    const gauge = asset.file;
    if (!existsSync(full)) {
      add('ASSET004', gauge, `Asset missing from manifest target: ${asset.file} does not exist.`);
      continue;
    }
    const size = statSync(full).size;
    const budget = budgets[asset.category] ?? asset.budgetKiB;
    if (budget != null && size > budget * 1024) {
      add('ASSET006', gauge, `${asset.id} exceeds the ${asset.category} budget (${Math.round(size / 1024)} KiB > ${budget} KiB).`);
    }
    const allowedFormats = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'woff2'];
    if (!allowedFormats.includes(String(asset.format).toLowerCase())) {
      add('ASSET005', gauge, `${asset.id} has unapproved format "${asset.format}".`);
    }

    if (asset.format === 'svg') {
      const text = svgText(full);
      if (/<\s*script|on\w+\s*=|foreignObject|<iframe/.test(text)) {
        add('ASSET007', gauge, `${asset.id} contains active content.`);
      }
    }

    if (['png', 'jpg', 'jpeg', 'webp'].includes(asset.format)) {
      let dims = null;
      if (asset.format === 'png') dims = pngSize(full);
      const iw = dims?.width ?? asset.intrinsicWidth;
      const ih = dims?.height ?? asset.intrinsicHeight;
      if (iw == null || ih == null) {
        add('ASSET012', gauge, `${asset.id} is missing intrinsic dimensions.`);
      } else {
        const variant = variants[asset.allowedVariants?.[0]];
        if (variant?.aspectRatio) {
          const want = parseRatio(variant.aspectRatio);
          const have = ratioOf(iw, ih);
          if (want && have && Math.abs(want - have) / want > 0.02) {
            add('ASSET003', gauge, `${asset.id} aspect ${have} does not satisfy variant ratio ${variant.aspectRatio}.`);
          }
        }
        const minW = asset.minSource?.widthPx ?? (variant ? variant.maxRendered.widthPx * 2 : 0);
        const minH = asset.minSource?.heightPx ?? (variant ? variant.maxRendered.heightPx * 2 : 0);
        if (variant && (iw < minW || ih < minH)) {
          add('ASSET013', gauge, `${asset.id} source ${iw}x${ih} is under 2x max rendered (${minW}x${minH}).`);
        }
      }
    }

    if (asset.category === 'font') {
      if (asset.format !== 'woff2') add('ASSET009', gauge, `${asset.id} is not woff2.`);
    }
  }

  // Source-owned image/font files in public/ and app/ must be manifested.
  const candidates = walkFiles(path.join(ROOT, 'public'))
    .concat(walkFiles(path.join(ROOT, 'app')))
    .filter((f) => /\.(png|jpg|jpeg|webp|svg|woff2|woff|ttf|otf)$/i.test(f) && !f.includes('.next'));
  const manifested = new Set((site.assets ?? []).map((a) => path.join(ROOT, a.file)));
  for (const file of candidates) {
    if (!manifested.has(file)) {
      add('ASSET004', rel(file), `${rel(file)} is not registered in assets/manifest.json.`);
    }
    if (/\.(woff|ttf|otf)$/i.test(file)) {
      add('ASSET009', rel(file), `Unapproved font file: ${rel(file)}.`);
    }
  }

  return findings;
}

export function checkManifestAndDeps() {
  const findings = [];
  const add = (code, file, detail) => findings.push({ code, file, line: 1, detail });
  const manifest = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));

  for (const section of ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']) {
    const block = manifest[section];
    if (!block) continue;
    for (const name of Object.keys(block)) {
      if (section === 'dependencies' && !ALLOWED_PROD_DEPS.has(name)) {
        add('UI007', 'package.json', `Unapproved production dependency "${name}". Only the documented set may be declared.`);
      }
      if (STYLING_PACKAGES.some((p) => name === p || name.startsWith(`${p}/`))) {
        add('UI007', 'package.json', `Unapproved styling dependency "${name}".`);
      }
      if (DIRECT_UI_IMPORTS.some((p) => name === p || name.startsWith(p))) {
        add('UI007', 'package.json', `Unapproved UI/icon dependency "${name}". Use the DS registry.`);
      }
    }
  }

  const lockPath = path.join(ROOT, 'pnpm-lock.yaml');
  if (existsSync(lockPath)) {
    const lock = readFileSync(lockPath, 'utf8');
    for (const pkg of ['styled-components', '@emotion/react', 'bootstrap', 'jss']) {
      if (new RegExp(`^\\s*${pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}@`, 'm').test(lock)) {
        add('UI007', 'pnpm-lock.yaml', `Unapproved styling engine resolved: ${pkg}.`);
      }
    }
    if (/^\s*tailwindcss@/m.test(lock)) {
      add('UI007', 'pnpm-lock.yaml', 'Unapproved styling engine resolved: tailwindcss.');
    }
  }

  const importers = sourceFiles().filter((f) => readFileSync(f, 'utf8').includes(DS_CSS_IMPORT));
  const expected = path.join(ROOT, 'app/layout.tsx');
  if (importers.length !== 1 || importers[0] !== expected) {
    add('UI001', 'app/layout.tsx', `DS stylesheet must be imported exactly once in app/layout.tsx (found: ${importers.map(rel).join(', ') || 'none'}).`);
  }

  return findings;
}

export function runUiCheck(files = sourceFiles()) {
  const published = dsPublishedClasses();
  const findings = [];
  findings.push(...checkManifestAndDeps());
  for (const file of files) findings.push(...checkFile(file, published));
  for (const file of styleSheetFiles()) {
    findings.push({ code: 'UI001', file: rel(file), line: 1, detail: 'Custom stylesheet detected. Delete it; the DS entry is the only permitted styling entry point.' });
  }
  findings.push(...checkAssets());
  return findings;
}

function formatFinding(f) {
  return `${f.code}: ${f.file}:${f.line} — ${f.detail}\n  Fix: ${FIXES[f.code] ?? 'See UI-GOVERNANCE.md.'}`;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('ui:check — Zero-Custom-UI gate (mission §11).\n\nCodes:\n' + Object.entries(FIXES).map(([k, v]) => `  ${k}: ${v}`).join('\n') + '\n\nUsage: node scripts/ui-check.mjs [--json]\n');
    process.exit(0);
  }
  const findings = runUiCheck();
  if (args.includes('--json')) {
    console.log(JSON.stringify(findings, null, 2));
  } else if (findings.length === 0) {
    console.log('ui:check: 0 findings — Zero-Custom-UI holds.');
  } else {
    for (const f of findings) console.log(formatFinding(f));
    console.log(`\nui:check: ${findings.length} finding(s).`);
  }
  process.exit(findings.length === 0 ? 0 : 1);
}
