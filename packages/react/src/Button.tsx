import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
import type { ButtonProps } from './types.js';

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const variant = props.variant || 'primary';
  const loading = !!props.loading;
  const rest = omit(props, ['variant', 'className', 'children', 'type', 'icon', 'iconRight', 'loading', 'onClick']);
  return (
    <button
      {...rest}
      ref={ref}
      type={props.type || 'button'}
      className={cx('aura-btn', 'aura-btn--' + variant, loading && 'is-loading', props.className)}
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={
        loading
          ? function (e: React.MouseEvent<HTMLButtonElement>) {
              e.preventDefault();
            }
          : props.onClick
      }
    >
      {loading ? <Icon name="loader-circle" className="aura-spin" /> : props.icon ? <Icon name={props.icon} /> : null}
      {props.children}
      {props.iconRight && !loading ? <Icon name={props.iconRight} /> : null}
    </button>
  );
});

/* Status — four tones, each a fill + word + icon (never colour alone). */
