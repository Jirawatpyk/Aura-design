import * as React from 'react';
import { cx, omit } from './internal.js';
const h = React.createElement;

export const Surface = React.forwardRef(function Surface(props, ref) {
  var t = props.texture || 'mesh';
  var rest = omit(props, ['texture', 'className', 'children', 'as']);
  return h(props.as || 'div', Object.assign({}, rest, {
    ref: ref,
    /* Textures stay light in every theme, so everything on them uses the light tokens. */
    'data-theme': 'light',
    className: cx('aura-surface',
      (t === 'mesh' || t === 'mesh-grain') && 'aura-mesh',
      (t === 'grain' || t === 'mesh-grain') && 'aura-grain',
      props.className)
  }), props.children);
});

/* ---------- Forms ---------- */
