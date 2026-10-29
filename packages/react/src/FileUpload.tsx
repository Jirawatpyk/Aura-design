import * as React from 'react';
import { cx, uid, useMaybeControlled, useMergedRef } from './internal.js';
import { useStrings } from './locale.js';
import type { AuraStrings } from './locale.js';
import type { FileUploadProps, UploadItem } from './types.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Field } from './Field.js';
import { Button } from './Button.js';
import { Progress } from './Progress.js';

import { formatBytes } from './text.js';
import { IconCircleAlert, IconCircleCheck, IconCloudUpload, IconFile, IconImage, IconUpload, IconX } from './icons.js';
export { formatBytes };
function matches(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  const name = (file.name || '').toLowerCase(),
    type = (file.type || '').toLowerCase();
  return accept.split(',').some(function (a: string) {
    a = a.trim().toLowerCase();
    if (!a) return false;
    if (a[0] === '.') return name.slice(-a.length) === a;
    if (a.slice(-2) === '/*') return type.indexOf(a.slice(0, -1)) === 0;
    return type === a;
  });
}
function describeAccept(accept: string | undefined, t: AuraStrings): string {
  if (!accept) return '';
  return accept
    .split(',')
    .map(function (a: string) {
      a = a.trim();
      if (a === 'image/*') return t.images;
      if (a === 'application/pdf') return 'PDF';
      return a.replace(/^\./, '').toUpperCase();
    })
    .filter(function (x: string, i: number, arr: string[]) {
      return arr.indexOf(x) === i;
    })
    .join(', ');
}
let seq = 0;

/* FileUpload — a drop zone plus a real file input. It checks type, size and count, lists the files with
 * a thumbnail for images, and shows per-file progress and errors. Sending the bytes is the app's job:
 * onChange gets items { id, file, name, size, type, status, progress?, error? }; update status/progress
 * through `value` while you upload. */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(props, ref) {
  const t = useStrings();
  const auto = uid(),
    id = props.id || auto;
  const st = useMaybeControlled<UploadItem[]>(props.value, props.defaultValue || [], props.onChange);
  const items = st[0] || [];
  const dragState = React.useState(false),
    over = dragState[0];
  const inputRef = React.useRef<HTMLInputElement | null>(null),
    inputMerged = useMergedRef(ref, inputRef);
  const urls = React.useRef<Record<string, string>>({});
  const maxFiles = props.multiple ? props.maxFiles : 1;
  const note = t.accepts(describeAccept(props.accept, t), props.maxSize ? formatBytes(props.maxSize) : '');
  /* 5.70: variant="button" — the refusal of the last pick (wrong type, too big), until the next pick. */
  const pickState = React.useState<string | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  /* 5.70: in button mode the forwarded ref is still the input (it carries the files), but its focus() goes to the
   * Button — a form library focusing an invalid field lands on the visible control. */
  const buttonMode = props.variant === 'button';
  React.useEffect(
    function () {
      const el = inputRef.current;
      if (!buttonMode || !el) return;
      el.focus = function (o?: FocusOptions) {
        if (buttonRef.current) buttonRef.current.focus(o);
      };
      return function () {
        delete (el as { focus?: unknown }).focus;
      };
    },
    [buttonMode],
  );

  React.useEffect(function () {
    return function () {
      Object.keys(urls.current).forEach(function (k) {
        URL.revokeObjectURL(urls.current[k]);
      });
    };
  }, []);
  /* 5.1.1: with a `name`, the real input carries the accepted files, so a native form post or a server action
   * receives them (the input was emptied after each pick, so the form sent an empty file and skipped `required`). */
  React.useEffect(
    function () {
      const el = inputRef.current;
      if (!el || !props.name || typeof DataTransfer === 'undefined') return;
      try {
        const dt = new DataTransfer();
        items.forEach(function (i: UploadItem) {
          if (i.file && !i.error) dt.items.add(i.file);
        });
        el.files = dt.files;
      } catch (e) {
        /* Older browsers can't set files; the app's onChange still has them. */
      }
    },
    [items, props.name],
  );
  function thumb(it: UploadItem): string | null {
    /* A file already stored (edit forms) shows from its url (5.2: url was documented but unused). */
    if (!it.file && it.url && /^image\//.test(it.type || '')) return it.url;
    if (!it.file || !/^image\//.test(it.type || '') || typeof URL === 'undefined' || !URL.createObjectURL) return null;
    if (!urls.current[it.id]) urls.current[it.id] = URL.createObjectURL(it.file);
    return urls.current[it.id];
  }
  function add(list: FileList | null | undefined) {
    const files: File[] = Array.prototype.slice.call(list || []);
    if (!files.length || props.disabled) return;
    const keep = props.multiple ? items.slice() : [];
    let room = maxFiles
      ? maxFiles -
        keep.filter(function (i: UploadItem) {
          return !i.error;
        }).length
      : Infinity;
    files.forEach(function (f) {
      let err: string | null = null;
      if (!matches(f, props.accept)) err = t.fileWrongType;
      else if (props.maxSize && f.size > props.maxSize) err = t.fileTooBig(formatBytes(props.maxSize));
      else if (room <= 0) err = t.tooManyFiles(maxFiles as number);
      else room--;
      keep.push({
        id: 'f' + ++seq,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type,
        status: err ? 'error' : 'ready',
        error: err || undefined,
      });
    });
    st[1](keep);
  }
  function remove(it: UploadItem) {
    if (urls.current[it.id]) {
      URL.revokeObjectURL(urls.current[it.id]);
      delete urls.current[it.id];
    }
    st[1](
      items.filter(function (x: UploadItem) {
        return x.id !== it.id;
      }),
    );
    if (props.onRemove) props.onRemove(it);
    if (inputRef.current) inputRef.current.focus();
  }
  const error = props.error;
  /* 5.70 (Chamber-OS 190): a Button that opens the picker; the app sends the file and owns the status. */
  if (props.variant === 'button') {
    const err = error || pickState[0];
    const desc =
      [err ? id + '-error' : props.hint ? id + '-hint' : null, note ? id + '-note' : null].filter(Boolean).join(' ') ||
      undefined;
    return (
      <Field
        id={id}
        label={props.label}
        labelAs="span"
        labelId={id + '-label'}
        hint={props.hint}
        error={err}
        required={props.required}
        optional={props.optional}
        disabled={props.disabled}
        className={cx('aura-upload-field', props.className)}
      >
        <div className="aura-upload-button">
          <Button
            ref={buttonRef}
            id={id + '-button'}
            variant="secondary"
            icon={<IconUpload />}
            touchHeight={props.touchHeight}
            disabled={props.disabled}
            aria-labelledby={props.label ? id + '-label ' + id + '-button' : undefined}
            aria-describedby={desc}
            onClick={function () {
              if (inputRef.current) inputRef.current.click();
            }}
          >
            {props.buttonLabel != null ? props.buttonLabel : props.multiple ? t.browse : t.browseOne}
          </Button>
          {/* The real input, out of reach: the Button is the control. With a `name` it still carries the files. */}
          <input
            ref={inputMerged}
            id={id}
            type="file"
            className="aura-upload__input"
            tabIndex={-1}
            aria-hidden={true}
            accept={props.accept}
            multiple={!!props.multiple}
            disabled={props.disabled}
            name={props.name}
            /* With a name the browser checks it on submit (its message points at the Button's box). */
            required={props.name ? props.required : undefined}
            /* The browser's own check would focus this hidden input and show its bubble: show the Field's error and
             * move focus to the Button instead. */
            onInvalid={function (e: React.FormEvent<HTMLInputElement>) {
              e.preventDefault();
              pickState[1](props.multiple ? t.browse : t.browseOne);
              if (buttonRef.current) buttonRef.current.focus();
            }}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
              const files: File[] = Array.prototype.slice.call(e.target.files || []);
              if (!files.length) return;
              let refused: string | null = null;
              const ok = files.filter(function (f: File) {
                const why = !matches(f, props.accept)
                  ? t.fileWrongType
                  : props.maxSize && f.size > props.maxSize
                    ? t.fileTooBig(formatBytes(props.maxSize))
                    : null;
                if (why && !refused) refused = why;
                return !why;
              });
              pickState[1](refused);
              /* Without a name nothing reads the input, so the same file can be picked again. With one, a refused file
               * must not be posted: the input keeps only the accepted files. */
              if (!props.name) e.target.value = '';
              else if (refused) {
                try {
                  const dt = new DataTransfer();
                  ok.forEach(function (f: File) {
                    dt.items.add(f);
                  });
                  e.target.files = dt.files;
                } catch (x) {
                  e.target.value = '';
                }
              }
              if (ok.length && props.onSelect) props.onSelect(ok);
            }}
          />
          {note ? (
            <span className="aura-upload__note" id={id + '-note'}>
              {note}
            </span>
          ) : null}
        </div>
        {props.progress !== undefined ? (
          <Progress
            className="aura-upload-button__progress"
            size="sm"
            value={props.progress == null ? undefined : props.progress}
            label={t.uploading}
          />
        ) : null}
      </Field>
    );
  }
  return (
    <Field
      id={id}
      label={props.label}
      hint={props.hint}
      error={error}
      required={props.required}
      optional={props.optional}
      disabled={props.disabled}
      className={props.className}
    >
      <div
        className={cx('aura-upload', over && 'is-over', props.disabled && 'is-disabled', error && 'is-invalid')}
        onClick={function (e: React.MouseEvent) {
          if (!props.disabled && e.target !== inputRef.current && inputRef.current) inputRef.current.click();
        }}
        onDragOver={function (e: React.DragEvent) {
          if (props.disabled) return;
          e.preventDefault();
          if (!over) dragState[1](true);
        }}
        onDragLeave={function (e: React.DragEvent) {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) dragState[1](false);
        }}
        onDrop={function (e: React.DragEvent) {
          e.preventDefault();
          dragState[1](false);
          add(e.dataTransfer && e.dataTransfer.files);
        }}
      >
        <Icon name={<IconCloudUpload />} size="lg" className="aura-upload__icon" />
        <span className="aura-upload__text">{t.dropFiles} </span>
        {/* The real input: visually hidden, still the labelled, focusable control (keyboard and screen readers use it). */}
        <input
          ref={inputMerged}
          id={id}
          type="file"
          className="aura-upload__input"
          accept={props.accept}
          multiple={!!props.multiple}
          disabled={props.disabled}
          name={props.name}
          required={
            props.required &&
            !items.some(function (i: UploadItem) {
              return !i.error;
            })
          }
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [error ? id + '-error' : props.hint ? id + '-hint' : null, note ? id + '-note' : null]
              .filter(Boolean)
              .join(' ') || undefined
          }
          onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
            add(e.target.files);
            e.target.value = '';
          }}
        />
        <span className="aura-upload__browse" aria-hidden={true}>
          {props.multiple ? t.browse : t.browseOne}
        </span>
        {note ? (
          <span className="aura-upload__note" id={id + '-note'}>
            {note}
          </span>
        ) : null}
      </div>
      {items.length ? (
        <ul className="aura-upload__list" aria-live="polite">
          {items.map(function (it: UploadItem) {
            const src = thumb(it);
            return (
              <li key={it.id} className={cx('aura-upload__item', it.error && 'is-error')}>
                {src ? (
                  <img className="aura-upload__thumb" src={src} alt="" />
                ) : (
                  <span className="aura-upload__thumb is-icon" aria-hidden={true}>
                    <Icon name={/^image\//.test(it.type || '') ? <IconImage /> : <IconFile />} size="md" />
                  </span>
                )}
                <span className="aura-upload__meta">
                  {it.url && !it.error ? (
                    <a className="aura-upload__name" href={it.url} target="_blank" rel="noreferrer">
                      {it.name}
                    </a>
                  ) : (
                    <span className="aura-upload__name">{it.name}</span>
                  )}
                  <span className="aura-upload__sub">
                    {it.error ? (
                      <React.Fragment>
                        <Icon name={<IconCircleAlert />} size={12} />
                        {it.error}
                      </React.Fragment>
                    ) : it.status === 'uploading' ? (
                      t.uploading + (it.progress != null ? ' ' + Math.round(it.progress) + '%' : '')
                    ) : it.status === 'done' ? (
                      <React.Fragment>
                        <Icon name={<IconCircleCheck />} size={12} />
                        {formatBytes(it.size)}
                      </React.Fragment>
                    ) : (
                      formatBytes(it.size)
                    )}
                  </span>
                  {it.status === 'uploading' ? (
                    <span
                      className="aura-upload__bar"
                      role="progressbar"
                      aria-label={it.name}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={it.progress != null ? Math.round(it.progress) : undefined}
                    >
                      <span style={{ width: (it.progress || 0) + '%' }} />
                    </span>
                  ) : null}
                </span>
                <IconButton
                  icon={<IconX />}
                  label={t.remove(it.name)}
                  onClick={function () {
                    remove(it);
                  }}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </Field>
  );
});
