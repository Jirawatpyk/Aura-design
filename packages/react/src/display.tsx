import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, omit, tone as badgeTone } from './classes.js';
import { toneFor } from './status.js';
import type { AuraIcon } from './iconSvg.js';
import type {
  AlertProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  EmptyStateProps,
  FeedbackTone,
  StatusPillProps,
  StatusTone,
} from './types.js';
import {
  IconBan,
  IconCircle,
  IconCircleAlert,
  IconCircleCheck,
  IconCircleDotDashed,
  IconInbox,
  IconInfo,
  IconTriangleAlert,
} from './icons.js';

/* Display components with no state and no hooks (5.8, Chamber-OS 68). Each renders from one function here, used by
 * the root component (with its ref) and by the one in `@jirawatpyk/aura-react/server` (a plain function a Server
 * Component can render), so the two give the same HTML for the same props. Nothing here may use a hook or context. */

const h = React.createElement;

export const ALERT_ICON: Record<FeedbackTone, AuraIcon> = {
  info: IconInfo,
  success: IconCircleCheck,
  warning: IconTriangleAlert,
  danger: IconCircleAlert,
};

export function alertElement(
  props: AlertProps,
  ref: React.Ref<HTMLDivElement> | undefined,
  close: React.ReactNode,
): React.ReactElement {
  const tone = props.tone || 'info';
  const rest = omit(props, ['tone', 'title', 'children', 'action', 'onDismiss', 'className', 'role', 'icon']);
  return (
    <div
      {...rest}
      ref={ref}
      className={cx('aura-alert', 'aura-alert--' + tone, props.className)}
      role={props.role || (tone === 'danger' || tone === 'warning' ? 'alert' : 'status')}
    >
      <Icon name={props.icon || h(ALERT_ICON[tone])} className="aura-alert__icon" />
      <div className="aura-alert__body">
        {props.title ? <p className="aura-alert__title">{props.title}</p> : null}
        {props.children ? <div className="aura-alert__text">{props.children}</div> : null}
        {props.action ? <div className="aura-alert__action">{props.action}</div> : null}
      </div>
      {close}
    </div>
  );
}

export function cardElement(props: CardProps, ref: React.Ref<HTMLElement> | undefined): React.ReactElement {
  const creative = props.variant === 'creative';
  const rest = omit(props, [
    'title',
    'description',
    'actions',
    'footer',
    'children',
    'variant',
    'headingLevel',
    'interactive',
    'as',
    'className',
    'titleId',
  ]);
  return h(
    props.as || 'section',
    Object.assign({}, rest, {
      ref: ref,
      className: cx(
        'aura-card',
        creative && 'aura-card--creative',
        props.interactive && 'is-interactive',
        props.className,
      ),
      /* A titled card is labelled by its title; otherwise the caller's aria-labelledby stays (5.8). */
      'aria-labelledby': props.title && props.titleId ? props.titleId : props['aria-labelledby'],
    }),
    props.title || props.actions ? (
      <div className="aura-card__head">
        <div className="aura-card__heading">
          {props.title
            ? h('h' + (props.headingLevel || 3), { className: 'aura-card__title', id: props.titleId }, props.title)
            : null}
          {props.description ? <p className="aura-card__desc">{props.description}</p> : null}
        </div>
        {props.actions ? <div className="aura-card__actions">{props.actions}</div> : null}
      </div>
    ) : null,
    props.children ? <div className="aura-card__body">{props.children}</div> : null,
    props.footer ? <div className="aura-card__foot">{props.footer}</div> : null,
  );
}

const PILL_ICON: Record<StatusTone, AuraIcon> = {
  neutral: IconCircle,
  progress: IconCircleDotDashed,
  ready: IconCircleCheck,
  warning: IconTriangleAlert,
  blocked: IconBan,
};

export function statusPillElement(
  props: StatusPillProps,
  ref: React.Ref<HTMLSpanElement> | undefined,
): React.ReactElement {
  const tone = props.tone || toneFor(props.children);
  const rest = omit(props, ['tone', 'className', 'children']);
  return (
    <span {...rest} ref={ref} className={cx('aura-pill', 'aura-pill--' + tone, props.className)}>
      <Icon name={h(PILL_ICON[tone] || IconCircle)} size={12} />
      {props.children}
    </span>
  );
}

export function badgeElement(props: BadgeProps, ref: React.Ref<HTMLSpanElement> | undefined): React.ReactElement {
  const rest = omit(props, ['tone', 'variant', 'icon', 'className', 'children']);
  return (
    <span
      {...rest}
      ref={ref}
      className={cx(
        'aura-badge',
        'aura-badge--' + badgeTone(props.tone),
        props.variant === 'solid' && 'is-solid',
        props.variant === 'outline' && 'is-outline',
        props.className,
      )}
    >
      {props.icon ? <Icon name={props.icon} size={12} /> : null}
      {props.children}
    </span>
  );
}

export function emptyStateElement(
  props: EmptyStateProps,
  ref: React.Ref<HTMLDivElement> | undefined,
): React.ReactElement {
  const HT = ('h' + (props.headingLevel || 3)) as React.ElementType;
  return (
    <div
      ref={ref}
      className={cx('aura-empty', props.size === 'sm' && 'is-sm', props.bordered && 'is-bordered', props.className)}
    >
      <span className="aura-empty__icon" aria-hidden={true}>
        <Icon name={props.icon || <IconInbox />} size={props.size === 'sm' ? 'md' : 'lg'} />
      </span>
      <HT className="aura-empty__title">{props.title}</HT>
      {props.description ? <p className="aura-empty__text">{props.description}</p> : null}
      {props.action ? <div className="aura-empty__action">{props.action}</div> : null}
    </div>
  );
}

/** The class list of a Button (5.8): put it on your own link or `<Link>` to make it look like one, e.g. in a Server
 * Component — `<Link href="/renew" className={buttonClass({ variant: 'secondary' })}>Renew</Link>`. */
export function buttonClass(
  opts: {
    variant?: ButtonProps['variant'];
    size?: ButtonProps['size'];
    fullWidth?: boolean | undefined;
    loading?: boolean | undefined;
    className?: string | undefined;
  } = {},
): string {
  return cx(
    'aura-btn',
    'aura-btn--' + (opts.variant || 'primary'),
    opts.size === 'sm' && 'aura-btn--sm',
    opts.fullWidth && 'aura-btn--full',
    opts.loading && 'is-loading',
    opts.className,
  );
}

/* The server entry's versions: plain functions (a Server Component can't pass a ref) with the same markup. */
export function ServerAlert(props: Omit<AlertProps, 'onDismiss'>): React.ReactElement {
  return alertElement(props, undefined, null);
}
export function ServerCard(props: CardProps): React.ReactElement {
  return cardElement(props, undefined);
}
export function ServerStatusPill(props: StatusPillProps): React.ReactElement {
  return statusPillElement(props, undefined);
}
export function ServerBadge(props: BadgeProps): React.ReactElement {
  return badgeElement(props, undefined);
}
export function ServerEmptyState(props: EmptyStateProps): React.ReactElement {
  return emptyStateElement(props, undefined);
}
