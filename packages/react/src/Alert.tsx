import * as React from 'react';
import { IconButton } from './IconButton.js';
import { alertElement } from './display.js';
import { useStrings } from './locale.js';
import type { AlertProps } from './types.js';

export { ALERT_ICON } from './display.js';

/* The markup lives in display.tsx (5.8), shared with the server entry's Alert; this adds the dismiss button. */
export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  const t = useStrings();
  return alertElement(
    props,
    ref,
    props.onDismiss ? (
      <IconButton icon="x" label={t.dismiss} className="aura-alert__close" onClick={props.onDismiss} />
    ) : null,
  );
});
