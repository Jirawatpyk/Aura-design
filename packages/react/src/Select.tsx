import * as React from 'react';
import { createPortal } from 'react-dom';
import { FIELD_KEYS, Field, describedBy } from './Field.js';
import { Icon } from './Icon.js';
import { useDensity } from './locale.js';
import { cx, devWarnOnce, omit, uid, useIsoLayoutEffect, useMergedRef, useMounted } from './internal.js';
import type { SelectOption, SelectProps } from './types.js';

const h = React.createElement;

type Item = { value: string; label: string; disabled: boolean; group: string | null; index: number };
type Pos = { left: number; width: number; top?: number | undefined; bottom?: number | undefined; maxHeight: number };

/* What stays on the hidden <select> (the form's view of the field); everything else a caller passes — style, data-*,
 * title, pointer and key handlers — goes to the button people see and use. onFocus/onKeyDown/onClick are composed
 * on the button; onBlur fires from the button's blur (on the <select>, so react-hook-form finds the field by name). */
const FORM_KEYS = ['name', 'form', 'value', 'defaultValue', 'disabled', 'autoComplete', 'onInput', 'onInvalid'];
const HANDLED_KEYS = FORM_KEYS.concat([
  'onChange',
  'onBlur',
  'onFocus',
  'onKeyDown',
  'onClick',
  'autoFocus',
  'tabIndex',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'multiple',
  'size',
]);
function pick(o: Record<string, unknown>, keys: string[]): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const k of keys) if (k in o) r[k] = o[k];
  return r;
}

/* The options as the browser has them: from `options` and from any <option>/<optgroup> children alike. */
function readItems(el: HTMLSelectElement | null): Item[] {
  if (!el) return [];
  return Array.prototype.map.call(el.options, function (o: HTMLOptionElement, i: number): Item {
    const g =
      o.parentElement && o.parentElement.tagName === 'OPTGROUP' ? (o.parentElement as HTMLOptGroupElement) : null;
    return {
      value: o.value,
      label: o.textContent || '',
      disabled: o.disabled || !!(g && g.disabled),
      group: g ? g.label : null,
      index: i,
    };
  }) as Item[];
}
/* What the closed field shows before the browser has rendered the <select> (server HTML, first paint). */
function initialLabel(props: SelectProps): { label: string; empty: boolean } {
  const opts = (props.options || []).map(function (o: SelectOption) {
    return typeof o === 'object' ? o : { value: o, label: o };
  });
  const v =
    props.value !== undefined && props.value !== null
      ? String(props.value)
      : props.defaultValue !== undefined && props.defaultValue !== null
        ? String(props.defaultValue)
        : props.placeholder
          ? ''
          : opts[0]
            ? opts[0].value
            : '';
  const hit = opts.filter(function (o) {
    return o.value === v;
  })[0];
  if (hit) return { label: hit.label, empty: false };
  return { label: props.placeholder || '', empty: true };
}

/** A select field: a button that opens an AURA list (5.3), over a real <select> that keeps forms, refs and events. */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(props, ref) {
  const auto = uid(),
    id = props.id || auto;
  const rest = omit(props, FIELD_KEYS.concat(['children'])) as Record<string, unknown>;
  const opts = (props.options || []).map(function (o: SelectOption) {
    const v: Exclude<SelectOption, string> = typeof o === 'object' ? o : { value: o, label: o };
    return (
      <option key={v.value} value={v.value} disabled={v.disabled}>
        {v.label}
      </option>
    );
  });
  if (props.placeholder)
    opts.unshift(
      <option key="__ph" value="" disabled={true}>
        {props.placeholder}
      </option>,
    );
  const extra: Record<string, unknown> =
    props.value === undefined && props.defaultValue === undefined && props.placeholder ? { defaultValue: '' } : {};
  /* A list box (multiple / size > 1) is already on the page: keep the native control for it. */
  const native = !!props.multiple || (props.size != null && props.size > 1);
  const mounted = useMounted();
  /* Server HTML and the first paint before hydration show the real <select> (it works with JavaScript off);
   * the button and AURA's list take over once React runs. */
  const live = !native && mounted;
  const density = useDensity();
  /* Dev only, after mount: a label elsewhere pointing at the id, or a title, names it too. */
  React.useEffect(function () {
    if (props.label || props['aria-label'] || props['aria-labelledby'] || props.title) return;
    if (document.querySelector('label[for="' + id.replace(/["\\]/g, '\\$&') + '"]')) return;
    devWarnOnce(
      'select-name',
      'Select needs a label, aria-label or aria-labelledby: screen readers announce it with no name.',
    );
  }, []);

  const selRef = React.useRef<HTMLSelectElement | null>(null),
    trigRef = React.useRef<HTMLButtonElement | null>(null),
    listRef = React.useRef<HTMLDivElement | null>(null);
  const shown = React.useState(function () {
    return initialLabel(props);
  });
  const openState = React.useState(false),
    open = openState[0];
  const activeState = React.useState(-1),
    active = activeState[0];
  const items = React.useState<Item[]>([]);
  const pos = React.useState<Pos | null>(null);
  const typed = React.useRef({ text: '', at: 0 });

  /* Keep the closed field in step with the <select> however its value changes: a pick, React (controlled value),
   * react-hook-form's reset()/setValue() (which set .value with no event), or a test's selectOption(). */
  const sync = React.useCallback(function () {
    const el = selRef.current;
    if (!el) return;
    const o = el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null;
    const next = o ? { label: o.textContent || '', empty: o.value === '' } : { label: '', empty: true };
    shown[1](function (cur) {
      return cur.label === next.label && cur.empty === next.empty ? cur : next;
    });
  }, []);
  const hook = React.useCallback(
    function (el: HTMLSelectElement | null) {
      selRef.current = el;
      if (!el || native || (el as unknown as { __auraHooked?: boolean }).__auraHooked) return;
      (el as unknown as { __auraHooked?: boolean }).__auraHooked = true;
      const proto = HTMLSelectElement.prototype;
      const pv = Object.getOwnPropertyDescriptor(proto, 'value'),
        pi = Object.getOwnPropertyDescriptor(proto, 'selectedIndex');
      if (pv && pv.set && pv.get)
        Object.defineProperty(el, 'value', {
          configurable: true,
          get: function () {
            return pv.get!.call(el);
          },
          set: function (v: string) {
            pv.set!.call(el, v);
            sync();
          },
        });
      if (pi && pi.set && pi.get)
        Object.defineProperty(el, 'selectedIndex', {
          configurable: true,
          get: function () {
            return pi.get!.call(el);
          },
          set: function (v: number) {
            pi.set!.call(el, v);
            sync();
          },
        });
      /* ref.focus() (react-hook-form setFocus, focus-on-error, FormErrorSummary) lands on the button people use. */
      el.focus = function (o?: FocusOptions) {
        if (trigRef.current) trigRef.current.focus(o);
        else proto.focus.call(el, o);
      };
    },
    [native, sync],
  );
  const selMerged = useMergedRef(ref, hook);
  /* A form's reset button restores the <select> without an event. */
  React.useEffect(
    function () {
      const f = selRef.current && selRef.current.form;
      if (!f || native) return;
      function onReset() {
        setTimeout(sync, 0);
      }
      f.addEventListener('reset', onReset);
      return function () {
        f.removeEventListener('reset', onReset);
      };
    },
    [native, sync],
  );
  /* The button appears: autoFocus, or focus someone gave the <select> before hydration, moves to it. */
  const focusedOnce = React.useRef(false);
  React.useEffect(
    function () {
      if (!live || focusedOnce.current || !trigRef.current) return;
      focusedOnce.current = true;
      if (props.autoFocus || (selRef.current && document.activeElement === selRef.current)) trigRef.current.focus();
    },
    [live],
  );
  /* After every render: options from children, a controlled value React just wrote; an open list follows options
   * that change under it (loaded late, filtered). */
  useIsoLayoutEffect(function () {
    if (!live) return;
    sync();
    if (!open) return;
    const now = readItems(selRef.current),
      was = items[0];
    const same =
      now.length === was.length &&
      now.every(function (it, i) {
        const w = was[i];
        return w.value === it.value && w.label === it.label && w.disabled === it.disabled && w.group === it.group;
      });
    if (same) return;
    items[1](now);
    if (!choices(now).length) {
      close(false);
      return;
    }
    /* Keep the highlight on the same option (by value), wherever it moved; else the chosen one, else the first. */
    const hv = was[active] ? was[active].value : null;
    const again = now.filter(function (it) {
      return !it.disabled && it.value === hv;
    })[0];
    const cur = selRef.current ? selRef.current.selectedIndex : -1;
    activeState[1](again ? again.index : now[cur] && !now[cur].disabled ? cur : choices(now)[0].index);
  });

  /* Options someone can pick: not disabled, and not the placeholder. */
  function choices(list: Item[]): Item[] {
    return list.filter(function (i) {
      return !i.disabled;
    });
  }
  function choose(it: Item) {
    const el = selRef.current;
    if (!el || it.disabled) return;
    if (el.value !== it.value) {
      /* The native setter, then a real change event: React's onChange, register(), form listeners all see it. */
      el.value = it.value;
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
    sync();
    close(true);
  }
  function openList(at?: 'first' | 'last' | number) {
    if (props.disabled || (trigRef.current && trigRef.current.disabled)) return;
    const list = readItems(selRef.current);
    const ok = choices(list);
    /* Nothing to choose (no options yet, or only the placeholder): an empty listbox helps no one. */
    if (!ok.length) return;
    items[1](list);
    const cur = selRef.current ? selRef.current.selectedIndex : -1;
    let a = at === 'first' ? ok[0].index : at === 'last' ? ok[ok.length - 1].index : cur;
    if (typeof at === 'number') a = at;
    if (a < 0 || !list[a] || list[a].disabled) a = ok[0].index;
    activeState[1](a);
    openState[1](true);
  }
  function close(focus: boolean) {
    openState[1](false);
    pos[1](null);
    if (focus && trigRef.current) trigRef.current.focus();
  }
  function step(from: number, dir: number, list: Item[]): number {
    for (let i = from + dir; i >= 0 && i < list.length; i += dir) if (!list[i].disabled) return i;
    return from;
  }
  /* Type to jump: letters typed within half a second build one search (Thai and English alike). */
  function typing(): boolean {
    return !!typed.current.text && Date.now() - typed.current.at < 500;
  }
  function typeahead(ch: string, list: Item[], from: number): number {
    const now = Date.now(),
      t = typed.current;
    t.text = now - t.at < 500 ? t.text + ch : ch;
    t.at = now;
    const q = t.text.toLocaleLowerCase();
    for (let k = 1; k <= list.length; k++) {
      const i = (from + (t.text.length > 1 ? 0 : 1) + k - 1 + list.length) % list.length;
      if (!list[i].disabled && list[i].label.toLocaleLowerCase().indexOf(q) === 0) return i;
    }
    /* No match: start over, so a Space right after opens the list instead of extending a dead search. */
    t.text = '';
    return -1;
  }
  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const k = e.key;
    const printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
    /* A space in the middle of typing ("new d") is part of the search, not a pick. */
    const search = printable && (k !== ' ' || typing());
    if (!open) {
      if (search) {
        const list = readItems(selRef.current);
        const i = typeahead(k, list, selRef.current ? selRef.current.selectedIndex : -1);
        e.preventDefault();
        if (i >= 0) openList(i);
      } else if (k === 'ArrowDown' || k === 'ArrowUp' || k === 'Enter' || k === ' ') {
        e.preventDefault();
        openList(k === 'ArrowUp' && !(selRef.current && selRef.current.value) ? 'last' : undefined);
      }
      return;
    }
    const list = items[0];
    if (search) {
      e.preventDefault();
      const i = typeahead(k, list, active);
      if (i >= 0) activeState[1](i);
    } else if (k === 'ArrowDown') {
      e.preventDefault();
      activeState[1](step(active, 1, list));
    } else if (k === 'ArrowUp') {
      e.preventDefault();
      activeState[1](step(active, -1, list));
    } else if (k === 'Home' || k === 'PageUp') {
      e.preventDefault();
      activeState[1](k === 'Home' ? step(-1, 1, list) : Math.max(step(-1, 1, list), step(active - 9, 1, list)));
    } else if (k === 'End' || k === 'PageDown') {
      e.preventDefault();
      activeState[1](
        k === 'End' ? step(list.length, -1, list) : Math.min(step(list.length, -1, list), step(active + 9, -1, list)),
      );
    } else if (k === 'Enter' || k === ' ') {
      e.preventDefault();
      if (list[active]) choose(list[active]);
    } else if (k === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      close(true);
    } else if (k === 'Tab') {
      close(false);
    }
  }

  /* Place the list under the field (above when there's no room), as wide as the field. */
  useIsoLayoutEffect(
    function () {
      if (!open) return;
      function place() {
        const t = trigRef.current && trigRef.current.parentElement;
        if (!t) return;
        const r = t.getBoundingClientRect(),
          below = window.innerHeight - r.bottom - 8,
          above = r.top - 8,
          want = listRef.current ? listRef.current.scrollHeight : 320,
          up = below < Math.min(want, 200) && above > below;
        pos[1]({
          left: r.left,
          width: r.width,
          top: up ? undefined : r.bottom + 4,
          bottom: up ? window.innerHeight - r.top + 4 : undefined,
          maxHeight: Math.min(320, (up ? above : below) - 4),
        });
      }
      place();
      function outside(e: Event) {
        const n = e.target as Node;
        if (listRef.current && listRef.current.contains(n)) return;
        if (trigRef.current && trigRef.current.contains(n)) return;
        close(false);
      }
      function onScroll(e: Event) {
        if (!listRef.current || !listRef.current.contains(e.target as Node)) place();
      }
      document.addEventListener('pointerdown', outside, true);
      window.addEventListener('scroll', onScroll, true);
      window.addEventListener('resize', place);
      return function () {
        document.removeEventListener('pointerdown', outside, true);
        window.removeEventListener('scroll', onScroll, true);
        window.removeEventListener('resize', place);
      };
    },
    [open],
  );
  React.useEffect(
    function () {
      if (!open || !listRef.current || active < 0) return;
      const el = listRef.current.querySelector<HTMLElement>('[data-idx="' + active + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    },
    [open, active, pos[0] != null],
  );

  const described =
    [describedBy(id, props), rest['aria-describedby'] as string | undefined].filter(Boolean).join(' ') || undefined;
  const field = (child: React.ReactNode) => (
    <Field
      id={id}
      labelId={native ? undefined : id + '-label' /* the label points at the button (id); the <select> is id-select */}
      label={props.label}
      hint={props.hint}
      error={props.error}
      required={props.required}
      optional={props.optional}
      disabled={props.disabled}
      className={props.className}
    >
      {child}
    </Field>
  );

  /* Before hydration, and for a list box: the real <select> as the control (what 5.2 rendered). */
  if (!live)
    return field(
      <div className={cx('aura-input aura-select', props.icon && 'has-icon')}>
        {props.icon ? <Icon name={props.icon} className="aura-input__icon" /> : null}
        {h(
          'select',
          Object.assign(extra, rest, {
            ref: native ? ref : selMerged,
            id: id,
            className: 'aura-input__control',
            required: props.required,
            'aria-invalid': props.error ? true : undefined,
            'aria-describedby': described,
          }),
          opts,
          props.children,
        )}
        <Icon name="chevron-down" className="aura-select__chevron" />
      </div>,
    );

  const listId = id + '-list',
    labelId = id + '-label';
  const optId = function (i: number) {
    return id + '-opt-' + i;
  };
  const labelledBy = (rest['aria-labelledby'] as string | undefined) || (props.label ? labelId : undefined);
  const selIndex = selRef.current ? selRef.current.selectedIndex : -1;
  const option = function (it: Item) {
    const sel = selIndex === it.index;
    return (
      <div
        key={it.index}
        id={optId(it.index)}
        role="option"
        data-idx={it.index}
        aria-selected={sel}
        aria-disabled={it.disabled || undefined}
        className={cx(
          'aura-combo__option',
          it.index === active && 'is-active',
          sel && 'is-selected',
          it.disabled && 'is-disabled',
        )}
        onPointerDown={function (e: React.PointerEvent) {
          e.preventDefault();
        }}
        onPointerMove={function () {
          if (!it.disabled && active !== it.index) activeState[1](it.index);
        }}
        onClick={function () {
          choose(it);
        }}
      >
        <span className="aura-combo__text">
          <span className="aura-combo__label">{it.label}</span>
        </span>
        {sel ? <Icon name="check" className="aura-combo__check" /> : null}
      </div>
    );
  };
  /* Options in runs: an <optgroup>'s options sit in a role="group" named by its heading. The placeholder is the
   * closed field's prompt, not a choice (as in shadcn): it is left out. */
  const runs: { group: string | null; items: Item[] }[] = [];
  items[0].forEach(function (it: Item) {
    if (it.value === '' && it.disabled) return;
    const last = runs[runs.length - 1];
    if (last && last.group === it.group) last.items.push(it);
    else runs.push({ group: it.group, items: [it] });
  });
  const popup = open
    ? createPortal(
        <div
          ref={listRef}
          data-density={density}
          className="aura-combo__popover aura-select__popover"
          style={
            pos[0]
              ? {
                  left: pos[0].left,
                  minWidth: pos[0].width,
                  top: pos[0].top,
                  bottom: pos[0].bottom,
                  maxHeight: pos[0].maxHeight,
                }
              : { left: -9999, top: -9999 }
          }
        >
          <div
            id={listId}
            role="listbox"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : (rest['aria-label'] as string | undefined)}
            className="aura-combo__list"
          >
            {runs.map(function (r, n) {
              if (r.group === null) return <React.Fragment key={'r' + n}>{r.items.map(option)}</React.Fragment>;
              const gid = id + '-group-' + n;
              return (
                <div key={'r' + n} role="group" aria-labelledby={gid}>
                  <div id={gid} className="aura-select__group">
                    {r.group}
                  </div>
                  {r.items.map(option)}
                </div>
              );
            })}
          </div>
        </div>,
        document.body,
      )
    : null;

  const userFocus = rest.onFocus as ((e: React.FocusEvent<HTMLElement>) => void) | undefined,
    userBlur = rest.onBlur as ((e: React.FocusEvent<HTMLSelectElement>) => void) | undefined,
    userKey = rest.onKeyDown as ((e: React.KeyboardEvent<HTMLElement>) => void) | undefined,
    userClick = rest.onClick as ((e: React.MouseEvent<HTMLElement>) => void) | undefined;
  return field(
    <div
      className={cx('aura-input aura-select aura-select--custom', props.icon && 'has-icon', open && 'is-open')}
      data-invalid={props.error ? '' : undefined}
    >
      {props.icon ? <Icon name={props.icon} className="aura-input__icon" /> : null}
      {/* The real <select>: form value, name, required, ref, onChange, react-hook-form register and test helpers
       * (selectOption) all work on it. Invisible, out of the Tab order and hidden from screen readers — the button
       * below is the control people use. It sits over the button so a browser's "please select" bubble points there. */}
      {h(
        'select',
        Object.assign(extra, pick(rest, FORM_KEYS), {
          ref: selMerged,
          id: id + '-select',
          className: 'aura-select__native',
          tabIndex: -1,
          'aria-hidden': true,
          required: props.required,
          onChange: function (e: React.ChangeEvent<HTMLSelectElement>) {
            sync();
            if (props.onChange) props.onChange(e);
          },
          /* A browser focusing the <select> (the required bubble, a label click) hands focus to the button. */
          onFocus: function () {
            if (trigRef.current) trigRef.current.focus();
          },
          /* Only the blur the button reports (below): the <select>'s own, while it hands focus over, is not one. */
          onBlur: function (e: React.FocusEvent<HTMLSelectElement>) {
            if (!e.nativeEvent.isTrusted && userBlur) userBlur(e);
          },
        }),
        opts,
        props.children,
      )}
      <button
        {...(omit(rest, HANDLED_KEYS) as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        ref={trigRef}
        type="button"
        role="combobox"
        /* Not a form control of its own: form.elements.namedItem(name or id) still finds only the <select>. */
        form={id + '-no-form'}
        className="aura-input__control aura-select__trigger"
        disabled={props.disabled}
        tabIndex={rest.tabIndex as number | undefined}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-activedescendant={open && active >= 0 ? optId(active) : undefined}
        id={id}
        aria-label={rest['aria-label'] as string | undefined}
        aria-labelledby={rest['aria-labelledby'] as string | undefined}
        aria-required={props.required || undefined}
        aria-invalid={props.error ? true : undefined}
        aria-describedby={described}
        onFocus={function (e: React.FocusEvent<HTMLButtonElement>) {
          if (userFocus) userFocus(e);
        }}
        onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
          if (userClick) userClick(e);
          if (e.defaultPrevented) return;
          if (open) close(true);
          else openList();
        }}
        onKeyDown={function (e: React.KeyboardEvent<HTMLButtonElement>) {
          if (userKey) userKey(e);
          if (!e.defaultPrevented) onKeyDown(e);
        }}
        onBlur={function (e: React.FocusEvent) {
          if (listRef.current && e.relatedTarget && listRef.current.contains(e.relatedTarget as Node)) return;
          if (open) close(false);
          /* react-hook-form's onBlur (mode: 'onBlur') listens on the <select> and finds the field by its name. */
          if (selRef.current) selRef.current.dispatchEvent(new FocusEvent('focusout', { bubbles: true }));
        }}
      >
        <span id={id + '-value'} className={cx('aura-select__value', shown[0].empty && 'is-placeholder')}>
          {shown[0].label || ' '}
        </span>
      </button>
      <Icon name="chevron-down" className="aura-select__chevron" />
      {popup}
    </div>,
  );
});
