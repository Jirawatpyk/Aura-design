import * as React from 'react';
import { useStrings, useAuraLocale, useDensity } from './locale.js';
import { createPortal } from 'react-dom';
import { cx, uid, useMaybeControlled, useMounted, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { Field } from './Field.js';
import type { ComboboxMultipleProps, ComboboxOption, ComboboxProps } from './types.js';
import { IconCheck, IconChevronDown, IconLoaderCircle, IconSearch, IconX } from './icons.js';

/** One value, or with `multiple` any number (chips). Two call signatures so value/onChange are typed for each. */
export interface ComboboxComponent {
  (props: ComboboxMultipleProps & React.RefAttributes<HTMLInputElement>): React.ReactElement | null;
  (props: ComboboxProps & React.RefAttributes<HTMLInputElement>): React.ReactElement | null;
  displayName?: string | undefined;
}

type PopoverPos = {
  left: number;
  width: number;
  top?: number | undefined;
  bottom?: number | undefined;
  maxHeight: number;
};

function norm(s: unknown): string {
  return String(s == null ? '' : s)
    .normalize('NFC')
    .toLocaleLowerCase('th');
}
function toOpt(o: ComboboxOption | string): ComboboxOption {
  return typeof o === 'object' ? o : { value: String(o), label: String(o) };
}
/* 5.16: an option under a heading (`groups`) carries its group's index. */
type GroupedOption = ComboboxOption & { __g?: number };
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
    const density = useDensity();
    const auto = uid(),
      id = props.id || auto,
      listId = id + '-list';
    const options: GroupedOption[] = (props.options || []).map(toOpt);
    const groups = props.groups || [];
    groups.forEach(function (g: { label: string; options: Array<ComboboxOption | string> }, gi: number) {
      g.options.forEach(function (o: ComboboxOption | string) {
        options.push(Object.assign({}, toOpt(o), { __g: gi }));
      });
    });
    const custom = !multi && !!props.allowCustomValue;
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
    /* 5.16: with allowCustomValue typing highlights nothing (-1) unless the text is an option's label, so Enter and
     * Tab keep what was typed; the arrow keys still reach the options. */
    const activeIdx =
      active < 0
        ? query
          ? shown.findIndex(function (o: ComboboxOption) {
              return !o.disabled && norm(o.label) === norm(query.trim());
            })
          : -1
        : Math.min(active, shown.length - 1);

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
      [open, shown.length, values.length],
    );
    React.useEffect(
      function () {
        if (!open) return;
        function outside(e: Event) {
          if (boxRef.current && boxRef.current.contains(e.target as Node)) return;
          if (listRef.current && listRef.current.contains(e.target as Node)) return;
          /* A click elsewhere commits typed text too (allowCustomValue); this listener outlives the render. */
          if (commitRef.current()) return;
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

    /* While a search is loading the old matches are hidden, so nothing in them can be chosen (5.1.1). */
    const live = props.loading ? [] : shown;
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
    /* 5.16 (Chamber-OS 105): with allowCustomValue, typed text becomes the value — an option whose label it matches,
     * else the text itself; empty text clears it. Returns whether there was typed text to commit. */
    const committed = React.useRef(false);
    const commitRef = React.useRef(function (): boolean {
      return false;
    });
    function commitTyped(): boolean {
      if (!custom || query == null || committed.current) return false;
      committed.current = true;
      const q = query.trim();
      if (!q) {
        if (props.clearable !== false) setValue(null);
      } else {
        const hit = options.filter(function (o: ComboboxOption) {
          return !o.disabled && norm(o.label) === norm(q);
        })[0];
        setValue(hit ? hit.value : q);
      }
      setQuery(null);
      setOpen(false);
      return true;
    }
    commitRef.current = commitTyped;
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
        else setActive(Math.max(0, Math.min(activeIdx + 1, live.length - 1)));
      } else if (k === 'ArrowUp') {
        e.preventDefault();
        if (!open) openList();
        else setActive(Math.max(activeIdx - 1, 0));
      } else if (k === 'Home' && open) {
        e.preventDefault();
        setActive(0);
      } else if (k === 'End' && open) {
        e.preventDefault();
        setActive(Math.max(0, live.length - 1));
      } else if (k === 'Enter') {
        /* Enter that confirms an IME composition isn't a pick. */
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        if (open && live[activeIdx]) {
          e.preventDefault();
          choose(live[activeIdx]);
        } else if (commitTyped()) e.preventDefault();
      } else if (k === 'Escape') {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          close();
        } else if (!multi && !props.readOnly && props.clearable !== false && value != null && query == null) {
          setValue(null);
        }
      } else if (k === 'Backspace' && multi && !props.readOnly && !text && values.length) {
        /* Backspace in an empty field removes the last pick. */
        setValues(values.slice(0, -1));
      } else if (k === 'Tab') {
        /* An option reached with the arrow keys is the pick, as with Enter; otherwise the typed text. */
        if (custom && open && query != null && live[activeIdx]) {
          choose(live[activeIdx]);
          return;
        }
        if (commitTyped()) return;
        if (open) close();
      }
    }
    /* A custom value (not an option) shows as itself. */
    const text = query != null ? query : selected ? selected.label : custom && value != null ? value : '';
    const summaryId = id + '-picked';
    const optId = function (i: number) {
      return id + '-opt-' + i;
    };
    function renderOpt(o: GroupedOption, i: number) {
      const isSel = multi ? isPicked(o.value) : !!selected && o.value === selected.value;
      const blocked = o.disabled || (multi && full && !isSel);
      return (
        <li
          key={o.value}
          id={optId(i)}
          role="option"
          data-idx={i}
          /* 5.28: a description is read after the option's name, not as part of it. */
          aria-labelledby={o.description ? optId(i) + '-label' : undefined}
          aria-describedby={o.description ? optId(i) + '-desc' : undefined}
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
            <span className="aura-combo__label" id={o.description ? optId(i) + '-label' : undefined}>
              {o.label}
            </span>
            {o.description ? (
              <span className="aura-combo__desc" id={optId(i) + '-desc'}>
                {o.description}
              </span>
            ) : null}
          </span>
          {isSel ? <Icon name={<IconCheck />} className="aura-combo__check" /> : null}
        </li>
      );
    }
    /* Consecutive options of one group form a segment; ungrouped ones stand alone. */
    function grouped(list: GroupedOption[]) {
      const out: Array<{ g: number | undefined; items: Array<[GroupedOption, number]> }> = [];
      list.forEach(function (o: GroupedOption, i: number) {
        const last = out[out.length - 1];
        if (last && last.g === o.__g) last.items.push([o, i]);
        else out.push({ g: o.__g, items: [[o, i]] });
      });
      return out;
    }
    const list =
      open && mounted && posState[0]
        ? createPortal(
            <div
              ref={listRef}
              data-density={density}
              className="aura-combo__popover"
              style={posState[0]}
              /* A press anywhere in the list (a group heading, the gaps) keeps focus in the field. */
              onPointerDown={function (e: React.PointerEvent) {
                e.preventDefault();
              }}
            >
              {/* 5.1.1: the listbox exists only while it has options (an empty one fails axe, aria-required-children);
               * "Searching…", "No matches" and "keep typing" sit beside it as a status line. */}
              {live.length ? (
                <ul
                  id={listId}
                  role="listbox"
                  aria-label={props.label}
                  aria-multiselectable={multi || undefined}
                  className="aura-combo__list"
                >
                  {grouped(live).map(function (seg: { g: number | undefined; items: Array<[GroupedOption, number]> }) {
                    if (seg.g == null)
                      return (
                        <React.Fragment key={'u' + seg.items[0]![1]}>
                          {seg.items.map(function (p: [GroupedOption, number]) {
                            return renderOpt(p[0], p[1]);
                          })}
                        </React.Fragment>
                      );
                    const gid = id + '-group-' + seg.g + '-' + seg.items[0]![1];
                    return (
                      <li key={gid} role="group" aria-labelledby={gid} className="aura-combo__group">
                        <span id={gid} role="presentation" className="aura-combo__group-label">
                          {groups[seg.g]!.label}
                        </span>
                        <ul role="none" className="aura-combo__grouplist">
                          {seg.items.map(function (p: [GroupedOption, number]) {
                            return renderOpt(p[0], p[1]);
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
              {props.loading || !live.length || more ? (
                <div className="aura-combo__list" role="status">
                  {props.loading ? (
                    <div className="aura-combo__note">
                      <Icon name={<IconLoaderCircle />} className="aura-spin" />
                      {props.loadingText || t.searching}
                    </div>
                  ) : !live.length ? (
                    <div className="aura-combo__note">{props.emptyText || t.noMatches}</div>
                  ) : (
                    <div className="aura-combo__note">{t.keepTyping(options.length)}</div>
                  )}
                </div>
              ) : null}
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
          <Icon name={props.icon || <IconSearch />} className="aura-input__icon" />
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
                        <Icon name={<IconX />} />
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
          {/* The form gets the option values, not the visible labels (5.1.1: single mode submitted the label). */}
          {props.name ? (
            multi ? (
              values.map(function (v: string) {
                return <input key={v} type="hidden" name={props.name} value={v} />;
              })
            ) : (
              <input type="hidden" name={props.name} value={value == null ? '' : value} />
            )
          ) : null}
          <input
            ref={inputMerged}
            id={id}
            type="text"
            role="combobox"
            className="aura-input__control"
            autoComplete="off"
            aria-expanded={open && live.length > 0}
            aria-controls={open && live.length ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && live[activeIdx] ? optId(activeIdx) : undefined}
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

            value={text}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
              committed.current = false;
              setQuery(e.target.value);
              setActive(custom ? -1 : 0);
              if (!open) setOpen(true);
              if (props.onSearch) props.onSearch(e.target.value);
            }}
            onClick={openList}
            onKeyDown={onKeyDown}
            onBlur={function () {
              setTimeout(function () {
                if (listRef.current && listRef.current.contains(document.activeElement)) return;
                /* Focus came back to the field before this ran: nothing to finish (allowCustomValue only). */
                if (custom && document.activeElement === inputRef.current) return;
                if (commitRef.current()) return;
                setOpen(false);
                setQuery(null);
              }, 0);
            }}
          />
          {props.clearable !== false && values.length && !props.disabled && !props.readOnly ? (
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
              <Icon name={<IconX />} />
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
            <Icon name={<IconChevronDown />} />
          </button>
        </div>
        {list}
      </Field>
    );
  },
) as ComboboxComponent;
