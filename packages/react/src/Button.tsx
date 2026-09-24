import * as React from 'react';
import { cx, omit } from './internal.js';
import { Icon } from './Icon.js';
import { useLinkComponent } from './locale.js';
import type { ButtonLinkProps, ButtonProps } from './types.js';

/** Button with an `href` is a link; without, a button. Two call signatures so each gets the right props and ref. */
export interface ButtonComponent {
  (props: ButtonLinkProps & React.RefAttributes<HTMLAnchorElement>): React.ReactElement | null;
  (props: ButtonProps & React.RefAttributes<HTMLButtonElement>): React.ReactElement | null;
  displayName?: string;
}

function ButtonLink(props: ButtonLinkProps, ref: React.ForwardedRef<HTMLAnchorElement>, Link: React.ElementType) {
  const variant = props.variant || 'primary';
  const disabled = !!props.disabled;
  const rest = omit(props, [
    'variant',
    'className',
    'children',
    'icon',
    'iconRight',
    'disabled',
    'linkComponent',
    'href',
    'fullWidth',
  ]);
  const Tag: React.ElementType = disabled ? 'a' : Link;
  return (
    <Tag
      {...rest}
      ref={ref}
      href={disabled ? undefined : props.href}
      role={disabled ? 'link' : undefined}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : props.tabIndex}
      className={cx('aura-btn', 'aura-btn--' + variant, props.fullWidth && 'aura-btn--full', props.className)}
      onClick={disabled ? undefined : props.onClick}
    >
      {props.icon ? <Icon name={props.icon} /> : null}
      {props.children}
      {props.iconRight ? <Icon name={props.iconRight} /> : null}
    </Tag>
  );
}

/** AURA pill button. Enterprise (`primary`, `secondary`) for product UI; `creative` for marketing moments only.
 * With `href` it renders a link that looks the same (`<a>`, or your router's link via `linkComponent`). */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps | ButtonLinkProps>(
  function Button(all, ref) {
    /* Always called (hooks order), used only when this Button is a link. */
    const Link = useLinkComponent((all as ButtonLinkProps).linkComponent);
    if (typeof (all as ButtonLinkProps).href === 'string') {
      return ButtonLink(all as ButtonLinkProps, ref as React.ForwardedRef<HTMLAnchorElement>, Link);
    }
    const props = all as ButtonProps;
    const variant = props.variant || 'primary';
    const loading = !!props.loading;
    const rest = omit(props, [
      'variant',
      'className',
      'children',
      'type',
      'icon',
      'iconRight',
      'loading',
      'onClick',
      'fullWidth',
    ]);
    return (
      <button
        {...rest}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        type={props.type || 'button'}
        className={cx(
          'aura-btn',
          'aura-btn--' + variant,
          props.fullWidth && 'aura-btn--full',
          loading && 'is-loading',
          props.className,
        )}
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
  },
) as ButtonComponent;

/* Status — four tones, each a fill + word + icon (never colour alone). */
