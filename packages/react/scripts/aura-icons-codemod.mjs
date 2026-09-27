#!/usr/bin/env node
// @ts-check
/* aura-icons-codemod (5.9) — moves icon names as strings to the per-icon components, ready for 6.0.
 *   npx aura-icons-codemod src [more paths…] [--dry]
 * In .tsx and .jsx files that import from @jirawatpyk/aura-react (or /server), for names in AURA's set, it rewrites
 *   <Icon name="users" size={20} />               →  <IconUsers size={20} />
 *   <Button icon="plus"> (icon / iconRight on an AURA component)  →  <Button icon={<IconPlus />}>
 *   { id: 'home', label: 'Home', icon: 'house' }  →  { id: 'home', label: 'Home', icon: <IconHouse /> }
 *     (an object literal with a `label` or `title`: nav, menu, tab and option items)
 * and adds `import { IconHouse, IconPlus, IconUsers } from '@jirawatpyk/aura-react/icons'`. It reads the code with
 * the TypeScript parser (your project's `typescript`), so types, strings and comments are never touched. Everything
 * it leaves — names chosen at run time, items in .ts files, objects it isn't sure are AURA's, a name already taken by
 * another import — is listed at the end: convert those by hand, or keep names with registerIcons(allIcons).
 * --dry prints what would change and writes nothing. */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const iconsSrc = fs.readFileSync(path.join(here, '../dist/esm/icons.js'), 'utf8');
const NAMES = new Set(Array.from(iconsSrc.matchAll(/defineIcon\d*\("([a-z0-9-]+)"/g), (m) => m[1]));
/** @param {string} n */
export const pascal = (n) =>
  'Icon' +
  n
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

/** TypeScript from the project being migrated, else from next to this package. */
function loadTs() {
  for (const from of [path.join(process.cwd(), 'package.json'), fileURLToPath(import.meta.url)]) {
    try {
      return createRequire(from)('typescript');
    } catch (e) {
      /* try the next */
    }
  }
  return null;
}
/** @type {any} */
let ts = null;

const ROOT = '@jirawatpyk/aura-react';
const ICONS = '@jirawatpyk/aura-react/icons';
const ICON_PROPS = ['icon', 'iconRight'];

/**
 * Rewrites one file. Returns the new text, the icon names it imported, and notes on what it left.
 * @param {string} src
 * @param {string} [file]
 */
export function transform(src, file = 'file.tsx') {
  if (!ts) ts = loadTs();
  if (!ts) throw new Error('aura-icons-codemod needs TypeScript to read your code: npm i -D typescript');
  /** @type {Set<string>} */
  const used = new Set();
  /** @type {string[]} */
  const left = [];
  const none = { code: src, used, left };
  if (!/@jirawatpyk\/aura-react/.test(src)) return none;
  const ext = path.extname(file).toLowerCase();
  /** @type {Record<string, number>} */
  const kinds = { '.tsx': ts.ScriptKind.TSX, '.ts': ts.ScriptKind.TS };
  /* .js / .jsx / .mjs are read as JSX (plain JavaScript parses the same). */
  const kind = kinds[ext] || ts.ScriptKind.JSX;
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, kind);
  /* An element can go where the file already allows JSX: .tsx/.jsx, or a .js file that has some. */
  let jsx = ext === '.tsx' || ext === '.jsx';
  if (!jsx && kind === ts.ScriptKind.JSX) {
    const find = (/** @type {any} */ n) => {
      if (jsx) return;
      if (ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n)) jsx = true;
      else ts.forEachChild(n, find);
    };
    find(sf);
  }
  const nl = src.indexOf('\r\n') >= 0 ? '\r\n' : '\n';
  const line = (/** @type {any} */ node) => sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;

  /* AURA's components by local name, the namespace (`import * as Aura`), Icon's local name, the icons import. */
  /** @type {Set<string>} */
  const aura = new Set();
  /** @type {string[]} */
  const nsNames = [];
  let iconLocal = '';
  /** @type {any} */
  let iconsImport = null;
  /** @type {any} */
  let lastImport = null;
  /** Names bound by imports from anywhere else and top-level declarations — a new IconX must not collide. */
  /** @type {Set<string>} */
  const taken = new Set();
  for (const st of sf.statements) {
    if (!ts.isImportDeclaration(st)) continue;
    lastImport = st;
    const from = st.moduleSpecifier.text;
    const cl = st.importClause;
    if (from === ICONS) {
      /* Merge into a value import only: names added to `import type { … }` couldn't be used as JSX. */
      if (cl && !cl.isTypeOnly) iconsImport = st;
      continue;
    }
    const mine = from === ROOT || from === ROOT + '/server';
    if (!cl) continue;
    if (cl.name) (mine ? aura : taken).add(cl.name.text);
    const nb = cl.namedBindings;
    if (nb && ts.isNamespaceImport(nb)) {
      if (mine) nsNames.push(nb.name.text);
      else taken.add(nb.name.text);
    }
    if (nb && ts.isNamedImports(nb))
      for (const el of nb.elements) {
        if (!mine) {
          taken.add(el.name.text);
          continue;
        }
        aura.add(el.name.text);
        if ((el.propertyName || el.name).text === 'Icon') iconLocal = el.name.text;
      }
  }
  if (!aura.size && !nsNames.length) return none;
  /* Every name declared anywhere in the file (a local `const IconUsers` inside a component too): a new IconX that
   * matches one would silently render the local thing. */
  const declared = (/** @type {any} */ n) => {
    if (
      (ts.isVariableDeclaration(n) ||
        ts.isParameter(n) ||
        ts.isFunctionDeclaration(n) ||
        ts.isClassDeclaration(n) ||
        ts.isBindingElement(n)) &&
      n.name &&
      ts.isIdentifier(n.name)
    )
      taken.add(n.name.text);
    ts.forEachChild(n, declared);
  };
  declared(sf);

  const isAura = (/** @type {string} */ t) => aura.has(t) || nsNames.some((n) => t.startsWith(n + '.'));
  const isIconTag = (/** @type {string} */ t) =>
    (!!iconLocal && t === iconLocal) || nsNames.some((n) => t === n + '.Icon');
  /** @type {Array<{ start: number, end: number, text: string }>} */
  const edits = [];
  /** A literal icon name in an attribute initializer or a property value, else null.
   * @param {any} init @returns {string | null} */
  const literal = (init) => {
    if (!init) return null;
    if (ts.isStringLiteral(init) || ts.isNoSubstitutionTemplateLiteral(init)) return init.text;
    if (ts.isJsxExpression(init) && init.expression) return literal(init.expression);
    if (ts.isParenthesizedExpression(init)) return literal(init.expression);
    return null;
  };
  /** Can this name be imported as its component here? */
  const usable = (/** @type {string} */ n, /** @type {any} */ node) => {
    if (!NAMES.has(n)) return false;
    if (taken.has(pascal(n))) {
      left.push(line(node) + ': ' + pascal(n) + ' is already a name in this file — "' + n + '" left as a string');
      return false;
    }
    return true;
  };
  const isElement = (/** @type {any} */ e) => !!e && (ts.isJsxElement(e) || ts.isJsxSelfClosingElement(e));

  /** @param {any} node */
  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tag = node.tagName.getText(sf);
      if (isAura(tag)) {
        for (const attr of node.attributes.properties) {
          if (!ts.isJsxAttribute(attr)) continue;
          const prop = attr.name.getText(sf);
          const isName = prop === 'name' && isIconTag(tag);
          if (!isName && ICON_PROPS.indexOf(prop) < 0) continue;
          const init = attr.initializer;
          const n = literal(init);
          if (n == null) {
            if (init && !(ts.isJsxExpression(init) && isElement(init.expression)))
              left.push(line(attr) + ': ' + attr.getText(sf) + ' (chosen at run time)');
            continue;
          }
          if (!usable(n, attr)) continue;
          used.add(n);
          if (isName) {
            /* <Icon name="users" …> → <IconUsers …>: rename the tag (and a closing tag), drop `name`. */
            edits.push({ start: node.tagName.getStart(sf), end: node.tagName.end, text: pascal(n) });
            edits.push({ start: attr.getFullStart(), end: attr.end, text: '' });
            if (ts.isJsxOpeningElement(node)) {
              const close = node.parent.closingElement;
              edits.push({ start: close.tagName.getStart(sf), end: close.tagName.end, text: pascal(n) });
            }
          } else edits.push({ start: init.getStart(sf), end: init.end, text: '{<' + pascal(n) + ' />}' });
        }
      }
    }
    if (ts.isPropertyAssignment(node) && ts.isObjectLiteralExpression(node.parent)) {
      const key = ts.isIdentifier(node.name) || ts.isStringLiteral(node.name) ? node.name.text : '';
      if (ICON_PROPS.indexOf(key) >= 0) {
        const n = literal(node.initializer);
        /* An item has a label or title that is text (a string, template or JSX), not a config object. */
        const item = node.parent.properties.some(
          (/** @type {any} */ p) =>
            ts.isPropertyAssignment(p) &&
            (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) &&
            (p.name.text === 'label' || p.name.text === 'title') &&
            (ts.isStringLiteral(p.initializer) ||
              ts.isNoSubstitutionTemplateLiteral(p.initializer) ||
              ts.isTemplateExpression(p.initializer) ||
              ts.isJsxElement(p.initializer) ||
              ts.isJsxSelfClosingElement(p.initializer) ||
              ts.isJsxFragment(p.initializer) ||
              ts.isIdentifier(p.initializer) ||
              ts.isPropertyAccessExpression(p.initializer) ||
              ts.isCallExpression(p.initializer)),
        );
        if (n != null && NAMES.has(n)) {
          if (!item)
            left.push(
              line(node) + ': ' + node.getText(sf) + " (an object with no label or title — AURA's? convert by hand)",
            );
          else if (!jsx)
            left.push(line(node) + ': ' + node.getText(sf) + ' (in a ' + ext + ' file: an element needs JSX)');
          else if (usable(n, node)) {
            used.add(n);
            edits.push({
              start: node.initializer.getStart(sf),
              end: node.initializer.end,
              text: '<' + pascal(n) + ' />',
            });
          }
        } else if (
          n == null &&
          item &&
          (ts.isIdentifier(node.initializer) || ts.isPropertyAccessExpression(node.initializer))
        )
          left.push(line(node) + ': ' + node.getText(sf) + ' (chosen at run time)');
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  if (!edits.length) return { code: src, used, left };

  /* The import: merged into an existing icons import, else after the last import (or after the directives). */
  const names = Array.from(used, pascal);
  const nbIcons =
    iconsImport &&
    iconsImport.importClause &&
    !iconsImport.importClause.isTypeOnly &&
    iconsImport.importClause.namedBindings;
  if (nbIcons && ts.isNamedImports(nbIcons)) {
    const have = nbIcons.elements.map((/** @type {any} */ e) => e.getText(sf));
    const add = names.filter((x) => have.indexOf(x) < 0);
    if (add.length)
      edits.push({
        start: nbIcons.getStart(sf),
        end: nbIcons.end,
        text: '{ ' + have.concat(add).sort().join(', ') + ' }',
      });
  } else {
    let at = 0;
    if (lastImport) {
      /* After the import's line, so a trailing comment stays with it. */
      const eol = src.indexOf('\n', lastImport.end);
      at = eol < 0 ? src.length : src[eol - 1] === '\r' ? eol - 1 : eol;
    } else
      for (const st of sf.statements) {
        if (ts.isExpressionStatement(st) && ts.isStringLiteral(st.expression)) at = st.end;
        else break;
      }
    const text = 'import { ' + names.sort().join(', ') + " } from '" + ICONS + "';";
    edits.push({ start: at, end: at, text: at ? nl + text : text + nl });
  }
  edits.sort((a, b) => b.start - a.start || b.end - a.end);
  let code = src;
  for (const e of edits) code = code.slice(0, e.start) + e.text + code.slice(e.end);

  /* Drop AURA's Icon from its import when nothing uses it any more (not when it is the only name there). */
  if (iconLocal) {
    const again = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, kind);
    let refs = 0;
    /** @type {any} */
    let spec = null;
    const count = (/** @type {any} */ n) => {
      if (ts.isImportSpecifier(n) && n.name.text === iconLocal) spec = n;
      else if (ts.isIdentifier(n) && n.text === iconLocal && !ts.isImportSpecifier(n.parent)) refs++;
      ts.forEachChild(n, count);
    };
    count(again);
    if (!refs && spec && spec.parent.elements.length > 1) {
      const list = spec.parent.elements
        .filter((/** @type {any} */ e) => e !== spec)
        .map((/** @type {any} */ e) => e.getText(again));
      code = code.slice(0, spec.parent.getStart(again)) + '{ ' + list.join(', ') + ' }' + code.slice(spec.parent.end);
    }
  }
  return { code, used, left };
}

/** @param {string} p @param {string[]} out */
function walk(p, out) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const f of fs.readdirSync(p))
      if (!/^(node_modules|dist|build|\.next|\.git)$/.test(f)) walk(path.join(p, f), out);
  } else if (/\.(tsx|jsx|ts|js|mjs)$/.test(p) && !/\.d\.ts$/.test(p)) out.push(p);
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1])) {
  const argv = process.argv.slice(2);
  const dry = argv.includes('--dry');
  const roots = argv.filter((a) => !a.startsWith('--'));
  if (!roots.length || argv.includes('--help')) {
    console.log('Usage: aura-icons-codemod <files or folders…> [--dry]');
    process.exit(roots.length ? 0 : 2);
  }
  if (!NAMES.size) {
    console.error('aura-icons-codemod: no icons found in dist/esm/icons.js — is the package built?');
    process.exit(2);
  }
  ts = loadTs();
  if (!ts) {
    console.error('aura-icons-codemod: needs TypeScript to read your code (it only parses): npm i -D typescript');
    process.exit(2);
  }
  let changed = 0;
  /** @type {string[]} */
  const todo = [];
  for (const f of roots.flatMap((r) => walk(r, []))) {
    const src = fs.readFileSync(f, 'utf8');
    const r = transform(src, f);
    for (const l of r.left) todo.push(f + ':' + l);
    if (r.code === src) continue;
    changed++;
    console.log((dry ? 'would change ' : 'changed ') + f + '  (' + Array.from(r.used, pascal).join(', ') + ')');
    if (!dry) fs.writeFileSync(f, r.code);
  }
  console.log('\n' + changed + (changed === 1 ? ' file' : ' files') + (dry ? ' would change.' : ' changed.'));
  if (todo.length) {
    console.log('\nLeft as names — convert by hand, or keep them with registerIcons(allIcons):');
    for (const t of todo) console.log('  ' + t);
  }
}
