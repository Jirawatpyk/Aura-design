import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, devWarnOnce, omit, tone as badgeTone } from './classes.js';
import { toneFor } from './status.js';
import type { AuraIcon } from './iconSvg.js';
import type {
  AlertProps,
  AvatarProps,
  BadgeProps,
  ButtonProps,
  CardProps,
  EmptyStateProps,
  FeedbackTone,
  StatProps,
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
  IconMinus,
  IconTrendingDown,
  IconTrendingUp,
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
  /* 5.14 (Chamber-OS 86): headingLevel={false} keeps the title out of the page outline — a <p>. */
  const HT = (props.headingLevel === false ? 'p' : 'h' + (props.headingLevel || 3)) as React.ElementType;
  /* 5.13 (Chamber-OS 82): id, data-*, aria-*, role and style reach the root, like Card and Alert. */
  const rest = omit(props, [
    'title',
    'description',
    'icon',
    'action',
    'size',
    'bordered',
    'headingLevel',
    'tone',
    'className',
    'children',
  ]);
  return (
    <div
      {...rest}
      ref={ref}
      className={cx(
        'aura-empty',
        props.size === 'sm' && 'is-sm',
        props.bordered && 'is-bordered',
        props.tone === 'danger' && 'is-danger',
        props.className,
      )}
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

/* 5.14 (Chamber-OS 88): Stat's markup, for the root component and /server. `Link` is the resolved link component
 * (the root reads AuraProvider's; /server takes the prop or `<a>`). `headingLevel` makes the label a heading — a
 * dashboard tile's label is often its section's title. A heading can't sit in a button, so a clickable Stat keeps a
 * span there. */
export function statElement(
  props: StatProps,
  ref: React.Ref<HTMLElement> | undefined,
  Link: React.ElementType,
): React.ReactElement {
  const ch = props.change;
  const dir = ch && (ch.direction || 'flat');
  const tone = ch && (ch.tone || (dir === 'up' ? 'positive' : dir === 'down' ? 'negative' : 'neutral'));
  /* Tabular figures only when the value is a number or a formatted amount ("฿31,900", "38,520.00 THB", "4.2k", "12%"):
   * on words they widen hyphens and spaces ("under-used"). A three-letter currency code is allowed. */
  const v = props.value;
  const numeric =
    typeof v === 'number' ||
    (typeof v === 'string' &&
      /\d/.test(v) &&
      /^[\s\d.,:+\-\u2212%()\u0E3F$\u20AC\u00A3\u00A5kKmMbB]+$/.test(v.replace(/\b[A-Z]{3}\b/g, '')));
  const Tag = (props.href ? Link : props.onClick ? 'button' : 'div') as React.ElementType;
  const interactive = !!(props.href || props.onClick);
  if (props.headingLevel && Tag === 'button')
    devWarnOnce(
      'stat-heading-button',
      'Stat `headingLevel` is ignored with `onClick`: a heading can’t sit in a button. Use `href`, or put the heading outside.',
    );
  const LabelTag = (props.headingLevel && Tag !== 'button' ? 'h' + props.headingLevel : 'span') as React.ElementType;
  /* A heading can't sit in a span: its row becomes a div. */
  const HeadTag = (LabelTag === 'span' ? 'span' : 'div') as React.ElementType;
  return (
    <Tag
      ref={ref}
      className={cx('aura-stat', interactive && 'is-interactive', props.loading && 'is-loading', props.className)}
      href={props.href}
      onClick={props.onClick}
      type={Tag === 'button' ? 'button' : undefined}
      aria-busy={props.loading || undefined}
    >
      <HeadTag className="aura-stat__head">
        <LabelTag className="aura-stat__label">{props.label}</LabelTag>
        {props.icon ? (
          <span className="aura-stat__icon">
            <Icon name={props.icon} />
          </span>
        ) : null}
      </HeadTag>
      {props.loading ? (
        <span className="aura-stat__value">
          <span className="aura-skel aura-stat__skel" />
        </span>
      ) : (
        <span className={cx('aura-stat__value', numeric && 'is-numeric')}>
          {props.value}
          {props.unit ? <span className="aura-stat__unit">{props.unit}</span> : null}
        </span>
      )}
      {(ch && !props.loading) || props.caption ? (
        <span className="aura-stat__foot">
          {ch && !props.loading ? (
            <span className={cx('aura-stat__change', 'is-' + tone)}>
              <Icon
                name={dir === 'up' ? <IconTrendingUp /> : dir === 'down' ? <IconTrendingDown /> : <IconMinus />}
                size={14}
              />
              <span>{ch.value}</span>
            </span>
          ) : null}
          {ch && ch.label && !props.loading ? <span className="aura-stat__caption">{ch.label}</span> : null}
          {props.caption ? <span className="aura-stat__caption">{props.caption}</span> : null}
        </span>
      ) : null}
    </Tag>
  );
}

/* 5.14 (Chamber-OS 103): Avatar's markup. `broken` is the src whose image failed (the root component tracks it; on
 * the server nothing has failed yet). */
const AVATAR_TONES = ['progress', 'ready', 'neutral', 'warning'];
function initials(name: string): string {
  const parts = String(name || '?')
    .trim()
    .split(/\s+/);
  return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || '')).toUpperCase();
}
export function avatarElement(
  props: AvatarProps,
  ref: React.Ref<HTMLSpanElement> | undefined,
  broken: string | null,
  onError: (() => void) | undefined,
): React.ReactElement {
  const size = props.size || 'md';
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
      {props.src && broken !== props.src ? (
        <img key={props.src /* a new src gets a fresh try (5.1.1) */} src={props.src} alt="" onError={onError} />
      ) : (
        <span aria-hidden={true}>{initials(props.name)}</span>
      )}
      {props.status === 'online' ? <span className="aura-avatar__status" aria-hidden={true} /> : null}
    </span>
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
/** Stat for Server Components (5.14): no `onClick` (a button needs the client); `href` renders `linkComponent`, else `<a>`. */
export function ServerStat(props: Omit<StatProps, 'onClick'>): React.ReactElement {
  /* A /server Stat can't take a click handler (it's not a client component): drop one passed anyway. */
  return statElement(omit(props as StatProps, ['onClick']) as StatProps, undefined, props.linkComponent || 'a');
}
/** Avatar for Server Components (5.14): initials and colour. Falling back to the initials when an image fails needs the
 * client, so give a server avatar a `src` you know loads, or none. */
export function ServerAvatar(props: AvatarProps): React.ReactElement {
  return avatarElement(props, undefined, null, undefined);
}
