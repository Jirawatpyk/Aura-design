import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMaybeControlled, useMounted, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { Field } from './Field.js';
import type { ComboboxMultipleProps, ComboboxOption, ComboboxProps } from './types.js';

/** One value, or with `multiple` any number (chips). Two call signatures so value/onChange are typed for each. */
export interface ComboboxComponent {
  (props: ComboboxMultipleProps & React.RefAttributes<HTMLInputElement>): React.ReactElement | null;
  (props: ComboboxProps & React.RefAttributes<HTMLInputElement>): React.ReactElement | null;
  displayName?: string;
}

type PopoverPos = { left: number; width: number; top?: number; bottom?: number; maxHeight: number };

function norm(s: unknown): string {
  return String(s == null ? '' : s)
    .normalize('NFC')
    .toLocaleLowerCase('th');
}
function toOpt(o: ComboboxOption | string): ComboboxOption {
  return typeof o === 'object' ? o : { value: String(o), label: String(o) };
}
/** The Thai-aware default filter: label, description and keywords contain the query. */
export function defaultFilter(option: ComboboxOption, query: string): boolean {
  const q = norm(query).trim();
  if (!q) return true;
  return (
    norm(option.label).indexOf(q) >= 0 ||
    (!!option.description && norm(option.description).indexOf(q) >= 0) ||
    (option.keywords || []).some(function (k: string) {
      return norm(k).indexOf(q) >= 0;
    })
  );
}

/* Combobox — a text field that filters a list as you type (ARIA 1.2 combobox + listbox).
 * Pick one value; `onSearch` + `loading` for server-side results. */
/** Text field that filters a list as you type (ARIA 1.2 combobox). One value, or any number with `multiple`. */
export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps | ComboboxMultipleProps>(
  function Combobox(all, ref) {
    const props = all as ComboboxProps;
    const multi = (all as ComboboxMultipleProps).multiple === true;
    const mp = all as ComboboxMultipleProps;
    const t = useStrings();
    const auto = uid(),
      id = props.id || auto,
      listId = id + '-list';
    const options = (props.options || []).map(toOpt);
    /* One store for both modes: a single value is kept as a 0- or 1-item list. */
    const st = useMaybeControlled<string[]>(
      multi ? mp.value : props.value === undefined ? undefined : props.value == null ? [] : [props.value],
      multi ? mp.defaultValue || [] : props.defaultValue == null ? [] : [props.defaultValue],
      function (next: string[]) {
        if (multi) {
          if (mp.onChange) mp.onChange(next);
        } else if (props.onChange) props.onChange(next.length ? next[0] : null);
      },
    );
    const values = st[0],
      setValues = st[1];
    const value = values.length ? values[0] : null;
    function setValue(v: string | null) {
      setValues(v == null ? [] : [v]);
    }
    const isPicked = function (v: string) {
      return values.indexOf(v) >= 0;
    };
    const full = multi && mp.max != null && values.length >= mp.max;
    const selected = multi
      ? null
      : options.filter(function (o: ComboboxOption) {
          return o.value === value;
        })[0] || null;
    const picked = multi
      ? values
          .map(function (v: string) {
            return options.filter(function (o: ComboboxOption) {
              return o.value === v;
            })[0];
          })
          .filter(Boolean)
      : [];
    const openState = React.useState(false),
      open = openState[0],
      setOpen = openState[1];
    const qState = React.useState<string | null>(null),
      query = qState[0],
      setQuery = qState[1]; /* null = show the selected label */
    const aState = React.useState(0),
      active = aState[0],
      setActive = aState[1];
    const posState = React.useState<PopoverPos | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null),
      inputMerged = useMergedRef(ref, inputRef),
      boxRef = React.useRef<HTMLDivElement | null>(null),
      listRef = React.useRef<HTMLDivElement | null>(null);
    const mounted = useMounted();
    const limit = props.limit || 200;

    const filter = props.filter || defaultFilter;
    let shown =
      props.onSearch || query == null
        ? options
        : options.filter(function (o: ComboboxOption) {
            return filter(o, query as string);
          });
    const more = shown.length > limit;
    shown = shown.slice(0, limit);
    const activeIdx = Math.min(active, shown.length - 1);

    function place() {
      if (!boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect();
      const maxH = 320,
        below = window.innerHeight - r.bottom - 8,
        up = below < 200 && r.top > below;
      posState[1]({
        left: r.left,
        width: r.width,
        top: up ? undefined : r.bottom + 4,
        bottom: up ? window.innerHeight - r.top + 4 : undefined,
        maxHeight: Math.min(maxH, (up ? r.top : below) - 8),
      });
    }
    useIsoLayoutEffect(
      function () {
        if (open) place();
      },
      [open, shown.length],
    );
    React.useEffect(
      function () {
        if (!open) return;
        function outside(e: Event) {
          if (boxRef.current && boxRef.current.contains(e.target as Node)) return;
          if (listRef.current && listRef.current.contains(e.target as Node)) return;
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
        if (!open || !listRef.current) return;
        const el = listRef.current.querySelector<HTMLElement>('[data-idx="' + activeIdx + '"]');
        if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
      },
      [activeIdx, open],
    );

    function openList() {
      if (!open && !props.disabled && !props.readOnly) {
        setOpen(true);
        const i = selected ? shown.indexOf(selected) : 0;
        setActive(i < 0 ? 0 : i);
      }
    }
    function close(restoreLabel?: boolean) {
      setOpen(false);
      setQuery(null);
    }
    function choose(o: ComboboxOption | undefined) {
      if (!o || o.disabled) return;
      if (multi) {
        /* Toggle; the list stays open for the next pick and the typed filter is cleared. */
        if (isPicked(o.value))
          setValues(
            values.filter(function (v: string) {
              return v !== o.value;
            }),
          );
        else if (!full) setValues(values.concat([o.value]));
        setQuery(null);
        if (inputRef.current) inputRef.current.focus();
        return;
      }
      setValue(o.value);
      setQuery(null);
      setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      const k = e.key;
      if (k === 'ArrowDown') {
        e.preventDefault();
        if (!open) openList();
        else setActive(Math.min(activeIdx + 1, shown.length - 1));
      } else if (k === 'ArrowUp') {
        e.preventDefault();
        if (!open) openList();
        else setActive(Math.max(activeIdx - 1, 0));
      } else if (k === 'Home' && open) {
        e.preventDefault();
        setActive(0);
      } else if (k === 'End' && open) {
        e.preventDefault();
        setActive(shown.length - 1);
      } else if (k === 'Enter') {
        if (open && shown[activeIdx]) {
          e.preventDefault();
          choose(shown[activeIdx]);
        }
      } else if (k === 'Escape') {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          close();
        } else if (!multi && props.clearable !== false && value != null && query == null) {
          setValue(null);
        }
      } else if (k === 'Backspace' && multi && !text && values.length) {
        /* Backspace in an empty field removes the last pick. */
        setValues(values.slice(0, -1));
      } else if (k === 'Tab') {
        if (open) close();
      }
    }
    const text = query != null ? query : selected ? selected.label : '';
    const summaryId = id + '-picked';
    const optId = function (i: number) {
      return id + '-opt-' + i;
    };
    const list =
      open && mounted && posState[0]
        ? createPortal(
            <div ref={listRef} className="aura-combo__popover" style={posState[0]}>
              <ul
                id={listId}
                role="listbox"
                aria-label={props.label}
                aria-multiselectable={multi || undefined}
                className="aura-combo__list"
              >
                {props.loading ? (
                  <li className="aura-combo__note" role="presentation">
                    <Icon name="loader-circle" className="aura-spin" />
                    {props.loadingText || t.searching}
                  </li>
                ) : !shown.length ? (
                  <li className="aura-combo__note" role="presentation">
                    {props.emptyText || t.noMatches}
                  </li>
                ) : (
                  shown.map(function (o: ComboboxOption, i: number) {
                    const isSel = multi ? isPicked(o.value) : !!selected && o.value === selected.value;
                    const blocked = o.disabled || (multi && full && !isSel);
                    return (
                      <li
                        key={o.value}
                        id={optId(i)}
                        role="option"
                        data-idx={i}
                        aria-selected={isSel}
                        aria-disabled={blocked || undefined}
                        className={cx(
                          'aura-combo__option',
                          i === activeIdx && 'is-active',
                          isSel && 'is-selected',
                          blocked && 'is-disabled',
                        )}
                        onPointerDown={function (e: React.PointerEvent) {
                          e.preventDefault();
                        }}
                        onClick={function () {
                          if (!blocked || isSel) choose(o);
                        }}
                        onPointerMove={function () {
                          if (activeIdx !== i) setActive(i);
                        }}
                      >
                        {o.icon ? <Icon name={o.icon} /> : null}
                        <span className="aura-combo__text">
                          <span className="aura-combo__label">{o.label}</span>
                          {o.description ? <span className="aura-combo__desc">{o.description}</span> : null}
                        </span>
                        {isSel ? <Icon name="check" className="aura-combo__check" /> : null}
                      </li>
                    );
                  })
                )}
                {more && !props.loading ? (
                  <li className="aura-combo__note" role="presentation">
                    {t.keepTyping((props.options || []).length)}
                  </li>
                ) : null}
              </ul>
            </div>,
            document.body,
          )
        : null;

    return (
      <Field
        id={id}
        label={props.label}
        hint={props.hint}
        error={props.error}
        required={props.required}
        optional={props.optional}
        disabled={props.disabled}
        className={props.className}
      >
        <div ref={boxRef} className={cx('aura-input aura-combo has-icon', open && 'is-open', multi && 'is-multi')}>
          <Icon name={props.icon || 'search'} className="aura-input__icon" />
          {multi && picked.length ? (
            <span className="aura-combo__chips">
              {picked.map(function (o: ComboboxOption) {
                return (
                  <span key={o.value} className="aura-combo__chip">
                    <span className="aura-combo__chip-label">{o.label}</span>
                    {props.disabled || props.readOnly ? null : (
                      <button
                        type="button"
                        tabIndex={-1}
                        className="aura-combo__chip-remove"
                        aria-label={t.remove(o.label)}
                        onPointerDown={function (e: React.PointerEvent) {
                          e.preventDefault();
                        }}
                        onClick={function () {
                          setValues(
                            values.filter(function (v: string) {
                              return v !== o.value;
                            }),
                          );
                          if (inputRef.current) inputRef.current.focus();
                        }}
                      >
                        <Icon name="x" />
                      </button>
                    )}
                  </span>
                );
              })}
            </span>
          ) : null}
          {multi ? (
            <span id={summaryId} className="aura-sr-only">
              {picked.length
                ? t.selectedCount(picked.length) +
                  ': ' +
                  picked
                    .map(function (o: ComboboxOption) {
                      return o.label;
                    })
                    .join(', ')
                : ''}
            </span>
          ) : null}
          {multi && props.name
            ? values.map(function (v: string) {
                return <input key={v} type="hidden" name={props.name} value={v} />;
              })
            : null}
          <input
            ref={inputMerged}
            id={id}
            type="text"
            role="combobox"
            className="aura-input__control"
            autoComplete="off"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={open && shown[activeIdx] ? optId(activeIdx) : undefined}
            aria-invalid={props.error ? true : undefined}
            aria-describedby={
              [props.error ? id + '-error' : props.hint ? id + '-hint' : '', multi && picked.length ? summaryId : '']
                .filter(Boolean)
                .join(' ') || undefined
            }
            placeholder={multi && values.length ? undefined : props.placeholder}
            disabled={props.disabled}
            readOnly={props.readOnly}
            required={props.required && (!multi || !values.length)}
            name={multi ? undefined : props.name}
            value={text}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
              setQuery(e.target.value);
              setActive(0);
              if (!open) setOpen(true);
              if (props.onSearch) props.onSearch(e.target.value);
            }}
            onClick={openList}
            onKeyDown={onKeyDown}
            onBlur={function () {
              setTimeout(function () {
                if (listRef.current && listRef.current.contains(document.activeElement)) return;
                setOpen(false);
                setQuery(null);
              }, 0);
            }}
          />
          {props.clearable !== false && values.length && !props.disabled ? (
            <button
              type="button"
              className="aura-combo__clear"
              aria-label={t.clear(props.label)}
              tabIndex={-1}
              onClick={function () {
                setValues([]);
                setQuery(null);
                if (inputRef.current) inputRef.current.focus();
              }}
            >
              <Icon name="x" />
            </button>
          ) : null}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden={true}
            className="aura-combo__toggle"
            onPointerDown={function (e: React.PointerEvent) {
              e.preventDefault();
            }}
            onClick={function () {
              if (open) close();
              else {
                openList();
                inputRef.current && inputRef.current.focus();
              }
            }}
          >
            <Icon name="chevron-down" />
          </button>
        </div>
        {list}
      </Field>
    );
  },
) as ComboboxComponent;
