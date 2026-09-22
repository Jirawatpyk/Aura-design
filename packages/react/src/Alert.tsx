import * as React from 'react';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { cx } from './internal.js';
import { useStrings } from './locale.js';
import type { AlertProps, FeedbackTone, IconName } from './types.js';

export const ALERT_ICON: Record<FeedbackTone, IconName> = {
  info: 'info',
  success: 'circle-check',
  warning: 'triangle-alert',
  danger: 'circle-alert',
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const t = useStrings();
  const tone = props.tone || 'info';
  return (
    <div
      ref={ref}
      className={cx('aura-alert', 'aura-alert--' + tone, props.className)}
      role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'}
    >
      <Icon name={ALERT_ICON[tone]} className="aura-alert__icon" />
      <div className="aura-alert__body">
        {props.title ? <p className="aura-alert__title">{props.title}</p> : null}
        {props.children ? <div className="aura-alert__text">{props.children}</div> : null}
        {props.action ? <div className="aura-alert__action">{props.action}</div> : null}
      </div>
      {props.onDismiss ? (
        <IconButton icon="x" label={t.dismiss} className="aura-alert__close" onClick={props.onDismiss} />
      ) : null}
    </div>
  );
});
