import * as React from 'react';
import { cx } from './internal.js';
import type { AvatarProps } from './types.js';

const AVATAR_TONES = ['progress', 'ready', 'neutral', 'warning'];

function initials(name: string): string {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/);
  return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || '')).toUpperCase();
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  const size = props.size || 'md',
    errState = React.useState<string | null>(null);
  let hash = 0;
  String(props.name || '')
    .split('')
    .forEach(function (ch) {
      hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
    });
  const tone = AVATAR_TONES[hash % AVATAR_TONES.length];
  return (
    <span
      ref={ref}
      className={cx('aura-avatar', 'aura-avatar--' + size, 'aura-avatar--' + tone, props.className)}
      role="img"
      aria-label={props.name + (props.status ? ', ' + props.status : '')}
    >
      {props.src && errState[0] !== props.src ? (
        <img
          key={props.src /* a new src gets a fresh try (5.1.1) */}
          src={props.src}
          alt=""
          onError={function () {
            errState[1](props.src || null);
          }}
        />
      ) : (
        <span aria-hidden={true}>{initials(props.name)}</span>
      )}
      {props.status === 'online' ? <span className="aura-avatar__status" aria-hidden={true} /> : null}
    </span>
  );
});
