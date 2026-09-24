import * as React from 'react';
import { TextField } from './TextField.js';
import { IconButton } from './IconButton.js';
import { cx, omit } from './internal.js';
import { useStrings } from './locale.js';
import type { PasswordFieldProps } from './types.js';

/* PasswordField — a TextField whose trailing button shows or hides the password. The button keeps one name
 * ("Show password") and reports its state with aria-pressed, so screen readers hear "Show password, pressed". */
export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(function PasswordField(props, ref) {
  const t = useStrings();
  const shown = React.useState(false);
  const rest = omit(props, ['toggle', 'className']);
  return (
    <TextField
      autoComplete="current-password"
      {...rest}
      ref={ref}
      type={shown[0] ? 'text' : 'password'}
      spellCheck={false}
      autoCapitalize="none"
      className={cx('aura-password', props.className)}
      suffix={
        props.toggle === false ? undefined : (
          <IconButton
            icon={shown[0] ? 'eye-off' : 'eye'}
            label={t.showPassword}
            aria-pressed={shown[0]}
            disabled={props.disabled}
            onClick={function () {
              shown[1](!shown[0]);
            }}
          />
        )
      }
    />
  );
});
