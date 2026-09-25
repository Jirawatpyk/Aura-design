import * as React from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon.js';
import { defaultFilter } from './Combobox.js';
import { cx, uid } from './internal.js';
import { useDensity, useStrings } from './locale.js';
import { useModal } from './useModal.js';
import type { CommandItem, CommandProps } from './types.js';

function isMac(): boolean {
  return typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
}

/* Command — a command palette (⌘K). A modal with one combobox input over a grouped listbox (WAI-ARIA combobox
 * pattern, like Combobox): focus stays in the input, arrows move the active option (aria-activedescendant),
 * Enter runs it, Escape closes and returns focus. Opens above a Dialog too. No dependency. */
export function Command(props: CommandProps): React.ReactElement | null {
  const t = useStrings();
  const density = useDensity();
  const id = uid(),
    listId = id + '-list';
  const box = React.useRef<HTMLDivElement | null>(null);
  const input = React.useRef<HTMLInputElement | null>(null);
  const qState = React.useState(''),
    act = React.useState<string | null>(null);
  /* Controlled (query + onQueryChange, for server search) or not. */
  const query = props.query !== undefined ? props.query : qState[0];
  function setQuery(v: string) {
    if (props.query === undefined) qState[1](v);
    if (props.onQueryChange) props.onQueryChange(v);
  }
  const openRef = React.useRef(props.open);
  openRef.current = props.open;
  const close = function () {
    props.onOpenChange(false);
  };
  const modal = useModal(props.open, box, { onEscape: close });

  /* ⌘K / Ctrl+K from anywhere toggles it. */
  React.useEffect(
    function () {
      if (props.hotkey === false) return;
      function onKey(e: KeyboardEvent) {
        if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.key === 'k' || e.key === 'K')) {
          e.preventDefault();
          props.onOpenChange(!openRef.current);
        }
      }
      document.addEventListener('keydown', onKey, true);
      return function () {
        document.removeEventListener('keydown', onKey, true);
      };
    },
    [props.hotkey, props.onOpenChange],
  );
  /* Fresh query each time it opens: reset on close, so the first keys after opening are never undone. */
  React.useEffect(
    function () {
      if (!props.open) {
        if (query) setQuery('');
        act[1](null);
      }
    },
    [props.open],
  );

  const filter = props.filter === false ? null : props.filter || defaultFilter;
  const shown = (props.items || []).filter(function (it: CommandItem) {
    return !filter || filter(it as any, query);
  });
  /* Group in first-seen order; the flat order is what the arrows walk. */
  const groups: Array<{ name: string; items: CommandItem[] }> = [];
  shown.forEach(function (it: CommandItem) {
    const name = it.group || '';
    let g = groups.filter(function (x) {
      return x.name === name;
    })[0];
    if (!g) groups.push((g = { name: name, items: [] }));
    g.items.push(it);
  });
  const flat: CommandItem[] = [];
  groups.forEach(function (g) {
    g.items.forEach(function (it) {
      flat.push(it);
    });
  });
  const enabled = flat
    .map(function (it, i) {
      return it.disabled ? -1 : i;
    })
    .filter(function (i) {
      return i >= 0;
    });
  /* The active item is remembered by id, so it stays put while async results change around it; if it's gone, the
   * first enabled item takes over. */
  const byId =
    act[0] == null
      ? -1
      : flat.findIndex(function (it) {
          return it.id === act[0];
        });
  const active = enabled.indexOf(byId) >= 0 ? byId : enabled.length ? enabled[0] : -1;
  const optId = function (i: number) {
    return id + '-o' + i;
  };
  React.useEffect(
    function () {
      if (!box.current || active < 0) return;
      const el = box.current.querySelector<HTMLElement>('#' + CSS.escape(optId(active)));
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'nearest' });
    },
    [active],
  );

  function run(it: CommandItem) {
    if (it.disabled) return;
    close();
    if (it.onSelect) it.onSelect();
    if (props.onSelect) props.onSelect(it);
  }
  function move(dir: number | 'first' | 'last') {
    if (!enabled.length) return;
    const at = enabled.indexOf(active);
    let n: number;
    if (dir === 'first') n = 0;
    else if (dir === 'last') n = enabled.length - 1;
    else n = (at + dir + enabled.length) % enabled.length;
    act[1](flat[enabled[n]].id);
  }
  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1);
    } else if (e.key === 'Home' && e.ctrlKey) {
      e.preventDefault();
      move('first');
    } else if (e.key === 'End' && e.ctrlKey) {
      e.preventDefault();
      move('last');
    } else if (e.key === 'Enter') {
      if (e.nativeEvent.isComposing || e.keyCode === 229) return; /* IME confirm, not a pick (5.1.1) */
      e.preventDefault();
      if (active >= 0) run(flat[active]);
    }
  }

  if (!modal.ready) return null;
  let i = -1;
  return createPortal(
    <div
      className="aura-dialog-layer aura-command-layer"
      data-density={density}
      onKeyDown={function (e: React.KeyboardEvent) {
        modal.onKeyDown(e);
        /* Keys handled here never reach a Dialog this palette was opened from. */
        e.stopPropagation();
      }}
    >
      <div className="aura-scrim" onClick={close} aria-hidden={true} />
      <div
        ref={box}
        role="dialog"
        aria-modal={true}
        aria-label={props.label || t.commandMenu}
        tabIndex={-1}
        className={cx('aura-command', props.className)}
      >
        <div className="aura-command__search">
          <Icon name="search" className="aura-command__search-icon" />
          <input
            ref={input}
            data-autofocus=""
            type="text"
            role="combobox"
            aria-expanded={flat.length > 0}
            aria-controls={flat.length ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={active >= 0 ? optId(active) : undefined}
            aria-label={props.label || t.commandMenu}
            placeholder={props.placeholder || t.commandPlaceholder}
            className="aura-command__input"
            value={query}
            autoComplete="off"
            spellCheck={false}
            onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
              setQuery(e.target.value);
              act[1](null);
            }}
            onKeyDown={onKey}
          />
          <kbd className="aura-command__kbd">Esc</kbd>
        </div>
        {/* The listbox exists only while there are options: an empty listbox fails axe (aria-required-children), so the
         * loading row and the empty state sit beside it and the live region below announces them (4.18). */}
        <div className="aura-command__list" aria-busy={props.loading || undefined}>
          {props.loading ? (
            <div className="aura-command__loading">
              <Icon name="loader-circle" className="aura-spin" />
              {t.searching}
            </div>
          ) : null}
          {!flat.length ? (
            props.loading ? null : (
              <div className="aura-command__empty">
                {props.empty != null ? props.empty : props.emptyText || t.noMatches}
              </div>
            )
          ) : (
            <div
              id={listId}
              role="listbox"
              aria-label={props.label || t.commandMenu}
              aria-busy={props.loading || undefined}
            >
              {groups.map(function (g, gi) {
                const gid = id + '-g' + gi;
                return (
                  <div
                    key={g.name || gi}
                    role="group"
                    aria-labelledby={g.name ? gid : undefined}
                    className="aura-command__group"
                  >
                    {g.name ? (
                      <div className="aura-command__heading" id={gid} role="presentation">
                        {g.name}
                      </div>
                    ) : null}
                    {g.items.map(function (it: CommandItem) {
                      i++;
                      const n = i;
                      return (
                        <div
                          key={it.id}
                          id={optId(n)}
                          role="option"
                          aria-selected={n === active}
                          aria-disabled={it.disabled || undefined}
                          className={cx(
                            'aura-command__item',
                            n === active && 'is-active',
                            it.disabled && 'is-disabled',
                          )}
                          onPointerDown={function (e: React.PointerEvent) {
                            e.preventDefault();
                          }}
                          onPointerMove={function () {
                            if (!it.disabled && act[0] !== it.id) act[1](it.id);
                          }}
                          onClick={function () {
                            run(it);
                          }}
                        >
                          {it.icon ? <Icon name={it.icon} /> : null}
                          <span className="aura-command__text">
                            <span className="aura-command__label">{it.label}</span>
                            {it.description ? <span className="aura-command__desc">{it.description}</span> : null}
                          </span>
                          {it.shortcut ? <kbd className="aura-command__kbd">{it.shortcut}</kbd> : null}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        {/* Polite status: "Searching…", then the result count (async search), or "No matches". */}
        <span className="aura-sr-only" role="status">
          {props.loading
            ? t.searching
            : query && !flat.length
              ? t.noMatches
              : props.loading === false && query
                ? t.results(flat.length)
                : ''}
        </span>
        <div className="aura-command__foot" aria-hidden={true}>
          {t.commandHint}
          <span className="aura-command__mod">{isMac() ? '⌘K' : 'Ctrl K'}</span>
        </div>
      </div>
    </div>,
    document.body,
  );
}
