import * as React from 'react';
import { Icon } from './Icon.js';
import { Button } from './Button.js';
import { Dialog } from './Dialog.js';
import { IconButton } from './IconButton.js';
import { Tag } from './Tag.js';
import { cx, devWarnOnce, FilterSheet, touchClass, uid, useMergedRef } from './internal.js';
import { breakpoints } from './breakpoints.js';
import { useStrings } from './locale.js';
import type { ActiveFilter, FilterBarProps } from './types.js';
import { IconSearch, IconSlidersHorizontal, IconX } from './icons.js';

/* FilterBar — the row above a list or table: search, filter controls, applied-filter chips, result count and
 * actions. State stays with the page (URL search params in server mode); the bar only reports changes. */
export const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(function FilterBar(props, ref) {
  const t = useStrings();
  const id = uid();
  const hasSearch = !!props.onSearchChange;
  const draft = React.useState(props.search || '');
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const sent = React.useRef(props.search || '');
  /* The latest callback, so a debounced call never uses the handler (and page state) from an older render. */
  const onChange = React.useRef(props.onSearchChange);
  onChange.current = props.onSearchChange;
  /* The page's value wins when it changes from outside (back button, Clear all). */
  React.useEffect(
    function () {
      if ((props.search || '') !== sent.current) {
        sent.current = props.search || '';
        draft[1](props.search || '');
      }
    },
    [props.search],
  );
  React.useEffect(function () {
    return function () {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);
  function send(v: string) {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    if (v === sent.current) return;
    sent.current = v;
    if (onChange.current) onChange.current(v);
  }
  function type(v: string) {
    draft[1](v);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      function () {
        send(v);
      },
      props.searchDelay == null ? 300 : props.searchDelay,
    );
  }
  const filters = props.filters || [];
  /* 5.42 (Chamber-OS 146): below `collapseBelow` the children move into a "Filters" sheet behind one button. They
   * render in one place only — the bar (hidden by CSS below the breakpoint) or, while the sheet is open, the sheet —
   * so a controlled filter's state is never doubled. */
  const hasChildren = React.Children.toArray(props.children).length > 0;
  const collapse = props.collapseBelow && hasChildren ? props.collapseBelow : null;
  const sheet = React.useState(false),
    open = !!collapse && sheet[0];
  const sheetId = id + '-filters';
  const doneRef = React.useRef<HTMLButtonElement | null>(null),
    moreRef = React.useRef<HTMLButtonElement | null>(null),
    own = React.useRef<HTMLDivElement | null>(null),
    rootRef = useMergedRef(ref, own);
  /* Children remount when they move between bar and sheet: one holding its own state would reset. */
  if (collapse)
    React.Children.forEach(props.children, function (c) {
      /* Buttons take a label but hold no state. */
      if (!React.isValidElement(c) || c.type === Button || c.type === IconButton) return;
      const p = c.props as Record<string, unknown>;
      if (
        p.defaultValue !== undefined ||
        p.defaultChecked !== undefined ||
        ('label' in p && !('value' in p) && !('selected' in p) && !('checked' in p))
      )
        devWarnOnce(
          'filterbar-uncontrolled',
          "FilterBar collapseBelow: a filter without `value` resets when the Filters sheet opens or closes (its children move there and back). Keep each filter's value with the page: `value` + `onChange`.",
        );
    });
  /* Back to the button (also where a tap doesn't focus it: Safari); if the bar widened past the breakpoint while
   * open, the button is hidden: the first control back in the bar, or the search. */
  function backTo(): HTMLElement | null {
    const m = moreRef.current;
    if (m && m.getClientRects().length) return m;
    const bar = own.current;
    if (!bar) return null;
    return (
      bar.querySelector<HTMLElement>(
        '.aura-filterbar__controls :is(button, input, select, [tabindex]):not([disabled]):not([tabindex="-1"])',
      ) || bar.querySelector<HTMLElement>('.aura-filterbar__search input')
    );
  }
  const applied = props.filterCount != null ? props.filterCount : filters.length;
  /* Wider than the breakpoint (a rotated tablet, a resized window) the bar shows its filters again: close the sheet. */
  React.useEffect(
    function () {
      if (!open || !collapse || typeof window.matchMedia !== 'function') return;
      const mq = window.matchMedia('(min-width: ' + breakpoints[collapse] + 'px)');
      function check() {
        if (mq.matches) sheet[1](false);
      }
      check();
      if (mq.addEventListener) mq.addEventListener('change', check);
      else mq.addListener(check);
      return function () {
        if (mq.removeEventListener) mq.removeEventListener('change', check);
        else mq.removeListener(check);
      };
    },
    [open, collapse],
  );
  function clearAll() {
    draft[1]('');
    sent.current = '';
    if (timer.current) clearTimeout(timer.current);
    props.onClearAll!();
  }
  const anything = filters.length > 0 || !!(props.search || draft[0]);
  const count =
    props.resultCount == null
      ? null
      : typeof props.resultCount === 'number'
        ? t.results(props.resultCount)
        : props.resultCount;
  const searchBox = hasSearch ? (
    <div className="aura-input has-icon aura-filterbar__search">
      <Icon name={<IconSearch />} className="aura-input__icon" />
      <input
        id={id}
        type="search"
        className="aura-input__control"
        aria-label={props.searchLabel || t.search}
        placeholder={props.searchPlaceholder || props.searchLabel || t.search}
        value={draft[0]}
        onChange={function (e: React.ChangeEvent<HTMLInputElement>) {
          type(e.target.value);
        }}
        onKeyDown={function (e: React.KeyboardEvent<HTMLInputElement>) {
          if (e.key === 'Enter') send(draft[0]);
          if (e.key === 'Escape' && draft[0]) {
            e.preventDefault();
            draft[1]('');
            send('');
          }
        }}
      />
      {draft[0] ? (
        <IconButton
          icon={<IconX />}
          label={t.clear((props.searchLabel || t.search).toLowerCase())}
          className="aura-filterbar__clear-search"
          onClick={function () {
            draft[1]('');
            send('');
          }}
        />
      ) : null}
    </div>
  ) : null;
  const more = collapse ? (
    <Button
      ref={moreRef}
      variant="secondary"
      icon={<IconSlidersHorizontal />}
      className="aura-filterbar__more"
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-controls={open ? sheetId : undefined}
      onClick={function () {
        sheet[1](true);
      }}
    >
      {/* Named from content (WCAG 2.5.3, as FilterDateRange): "Filters, 2 applied" for screen readers, "Filters (2)"
       * on screen. */}
      {applied > 0 ? (
        <>
          <span className="aura-sr-only">{t.filtersApplied(applied)}</span>
          <span aria-hidden={true}>{t.filters + ' (' + applied + ')'}</span>
        </>
      ) : (
        t.filters
      )}
    </Button>
  ) : null;
  return (
    <div
      ref={rootRef}
      role="region"
      aria-label={props.label || t.filters}
      className={cx(
        'aura-filterbar',
        props.searchGrow && 'aura-filterbar--grow',
        props.controlsLayout === 'fill' && 'aura-filterbar--fill',
        props.stackBelow === 'lg' && 'aura-filterbar--stack-lg',
        collapse && 'aura-filterbar--collapse-' + collapse,
        touchClass(props.touchHeight),
        props.className,
      )}
    >
      <div className="aura-filterbar__row">
        {collapse ? (
          /* 5.42: the search and the Filters button share a row of their own below the breakpoint (count and actions
           * wrap under them); from the breakpoint up this box is display: contents and the bar is as before. */
          <div className={cx('aura-filterbar__lead', !hasSearch && 'is-alone')}>
            {searchBox}
            {more}
          </div>
        ) : (
          searchBox
        )}
        {hasChildren && !open ? <div className="aura-filterbar__controls">{props.children}</div> : null}
        <span className="aura-filterbar__spacer" />
        {count != null ? (
          <span className="aura-filterbar__count" aria-live="polite">
            {count}
          </span>
        ) : null}
        {props.actions ? <div className="aura-filterbar__actions">{props.actions}</div> : null}
      </div>
      {filters.length || (props.onClearAll && anything) ? (
        <div className="aura-filterbar__chips">
          {filters.map(function (f: ActiveFilter) {
            return (
              <Tag key={f.id} onRemove={f.onRemove}>
                {f.label}
              </Tag>
            );
          })}
          {props.onClearAll && anything ? (
            <button type="button" className="aura-filterbar__clear" onClick={clearAll}>
              {t.clearFilters}
            </button>
          ) : null}
        </div>
      ) : null}
      {collapse ? (
        <Dialog
          open={open}
          onClose={function () {
            sheet[1](false);
          }}
          id={sheetId}
          finalFocus={backTo}
          title={t.filters}
          size="sm"
          className="aura-filterbar__sheet"
          footer={
            <>
              {props.onClearAll && filters.length ? (
                <Button
                  variant="secondary"
                  touchHeight
                  onClick={function () {
                    clearAll();
                    /* The button goes with the chips: keep focus in the sheet, on Done. */
                    if (doneRef.current) doneRef.current.focus();
                  }}
                >
                  {t.clearFilters}
                </Button>
              ) : null}
              <Button
                ref={doneRef}
                touchHeight
                onClick={function () {
                  sheet[1](false);
                }}
              >
                {t.done}
              </Button>
            </>
          }
        >
          <FilterSheet.Provider value={true}>
            <div className="aura-filterbar aura-filterbar--sheet is-touch-always">{props.children}</div>
          </FilterSheet.Provider>
        </Dialog>
      ) : null}
    </div>
  );
});
