import * as React from 'react';
import { cx, uid, useMaybeControlled, useMergedRef } from './internal.js';
import { useStrings } from './locale.js';
import type { AuraStrings } from './locale.js';
import type { FileUploadProps, UploadItem } from './types.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Field } from './forms.js';
const h = React.createElement;

/** 1536 → "1.5 KB". */
export function formatBytes(n: number | null | undefined): string {
  if (n == null) return '';
  if (n < 1024) return n + ' B';
  var u = ['KB', 'MB', 'GB'], i = -1;
  do { n /= 1024; i++; } while (n >= 1024 && i < u.length - 1);
  return (n >= 10 || Math.round(n) === n ? Math.round(n) : n.toFixed(1)) + ' ' + u[i];
}
function matches(file: File, accept: string | undefined): boolean {
  if (!accept) return true;
  var name = (file.name || '').toLowerCase(), type = (file.type || '').toLowerCase();
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
  return accept.split(',').map(function (a: string) {
    a = a.trim();
    if (a === 'image/*') return t.images;
    if (a === 'application/pdf') return 'PDF';
    return a.replace(/^\./, '').toUpperCase();
  }).filter(function (x: string, i: number, arr: string[]) { return arr.indexOf(x) === i; }).join(', ');
}
var seq = 0;

/* FileUpload — a drop zone plus a real file input. It checks type, size and count, lists the files with
 * a thumbnail for images, and shows per-file progress and errors. Sending the bytes is the app's job:
 * onChange gets items { id, file, name, size, type, status, progress?, error? }; update status/progress
 * through `value` while you upload. */
export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(function FileUpload(props, ref) {
  var t = useStrings();
  var auto = uid(), id = props.id || auto;
  var st = useMaybeControlled<UploadItem[]>(props.value, props.defaultValue || [], props.onChange);
  var items = st[0] || [];
  var dragState = React.useState(false), over = dragState[0];
  var inputRef = React.useRef<HTMLInputElement | null>(null), inputMerged = useMergedRef(ref, inputRef);
  var urls = React.useRef<Record<string, string>>({});
  var maxFiles = props.multiple ? props.maxFiles : 1;
  var note = t.accepts(describeAccept(props.accept, t), props.maxSize ? formatBytes(props.maxSize) : '');

  React.useEffect(function () { return function () { Object.keys(urls.current).forEach(function (k) { URL.revokeObjectURL(urls.current[k]); }); }; }, []);
  function thumb(it: UploadItem): string | null {
    if (!it.file || !/^image\//.test(it.type || '') || typeof URL === 'undefined' || !URL.createObjectURL) return null;
    if (!urls.current[it.id]) urls.current[it.id] = URL.createObjectURL(it.file);
    return urls.current[it.id];
  }
  function add(list: FileList | null | undefined) {
    var files: File[] = Array.prototype.slice.call(list || []);
    if (!files.length || props.disabled) return;
    var keep = props.multiple ? items.slice() : [];
    var room = maxFiles ? maxFiles - keep.filter(function (i: UploadItem) { return !i.error; }).length : Infinity;
    files.forEach(function (f) {
      var err: string | null = null;
      if (!matches(f, props.accept)) err = t.fileWrongType;
      else if (props.maxSize && f.size > props.maxSize) err = t.fileTooBig(formatBytes(props.maxSize));
      else if (room <= 0) err = t.tooManyFiles(maxFiles as number);
      else room--;
      keep.push({ id: 'f' + (++seq), file: f, name: f.name, size: f.size, type: f.type, status: err ? 'error' : 'ready', error: err || undefined });
    });
    st[1](keep);
  }
  function remove(it: UploadItem) {
    if (urls.current[it.id]) { URL.revokeObjectURL(urls.current[it.id]); delete urls.current[it.id]; }
    st[1](items.filter(function (x: UploadItem) { return x.id !== it.id; }));
    if (props.onRemove) props.onRemove(it);
    if (inputRef.current) inputRef.current.focus();
  }
  var error = props.error;
  return h(Field, { id: id, label: props.label, hint: props.hint, error: error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
    h('div', {
        className: cx('aura-upload', over && 'is-over', props.disabled && 'is-disabled', error && 'is-invalid'),
        onClick: function (e: React.MouseEvent) { if (!props.disabled && e.target !== inputRef.current && inputRef.current) inputRef.current.click(); },
        onDragOver: function (e: React.DragEvent) { if (props.disabled) return; e.preventDefault(); if (!over) dragState[1](true); },
        onDragLeave: function (e: React.DragEvent) { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) dragState[1](false); },
        onDrop: function (e: React.DragEvent) { e.preventDefault(); dragState[1](false); add(e.dataTransfer && e.dataTransfer.files); } },
      h(Icon, { name: 'cloud-upload', size: 'lg', className: 'aura-upload__icon' }),
      h('span', { className: 'aura-upload__text' }, t.dropFiles, ' '),
      /* The real input: visually hidden, still the labelled, focusable control (keyboard and screen readers use it). */
      h('input', { ref: inputMerged, id: id, type: 'file', className: 'aura-upload__input', accept: props.accept, multiple: !!props.multiple, disabled: props.disabled,
        name: props.name, required: props.required && !items.some(function (i: UploadItem) { return !i.error; }),
        'aria-invalid': error ? true : undefined, 'aria-describedby': [error ? id + '-error' : props.hint ? id + '-hint' : null, note ? id + '-note' : null].filter(Boolean).join(' ') || undefined,
        onChange: function (e: React.ChangeEvent<HTMLInputElement>) { add(e.target.files); e.target.value = ''; } }),
      h('span', { className: 'aura-upload__browse', 'aria-hidden': true }, props.multiple ? t.browse : t.browseOne),
      note ? h('span', { className: 'aura-upload__note', id: id + '-note' }, note) : null),
    items.length ? h('ul', { className: 'aura-upload__list', 'aria-live': 'polite' }, items.map(function (it: UploadItem) {
      var src = thumb(it);
      return h('li', { key: it.id, className: cx('aura-upload__item', it.error && 'is-error') },
        src ? h('img', { className: 'aura-upload__thumb', src: src, alt: '' })
            : h('span', { className: 'aura-upload__thumb is-icon', 'aria-hidden': true }, h(Icon, { name: /^image\//.test(it.type || '') ? 'image' : 'file', size: 'md' })),
        h('span', { className: 'aura-upload__meta' },
          h('span', { className: 'aura-upload__name' }, it.name),
          h('span', { className: 'aura-upload__sub' },
            it.error ? h(React.Fragment, null, h(Icon, { name: 'circle-alert', size: 12 }), it.error)
            : it.status === 'uploading' ? (t.uploading + (it.progress != null ? ' ' + Math.round(it.progress) + '%' : ''))
            : it.status === 'done' ? h(React.Fragment, null, h(Icon, { name: 'circle-check', size: 12 }), formatBytes(it.size))
            : formatBytes(it.size)),
          it.status === 'uploading' ? h('span', { className: 'aura-upload__bar', role: 'progressbar', 'aria-label': it.name, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': it.progress != null ? Math.round(it.progress) : undefined },
            h('span', { style: { width: (it.progress || 0) + '%' } })) : null),
        h(IconButton, { icon: 'x', label: t.remove(it.name), onClick: function () { remove(it); } }));
    })) : null);
});
