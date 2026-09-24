import * as React from 'react';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Tag } from './Tag.js';
import { cx, uid } from './internal.js';
import { useStrings } from './locale.js';
import type { ActiveFilter, FilterBarProps } from './types.js';

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
  const anything = filters.length > 0 || !!(props.search || draft[0]);
  const count =
    props.resultCount == null
      ? null
      : typeof props.resultCount === 'number'
        ? t.results(props.resultCount)
        : props.resultCount;
  return (
    <div
      ref={ref}
      role="region"
      aria-label={props.label || t.filters}
      className={cx('aura-filterbar', props.className)}
    >
      <div className="aura-filterbar__row">
        {hasSearch ? (
          <div className="aura-input has-icon aura-filterbar__search">
            <Icon name="search" className="aura-input__icon" />
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
                icon="x"
                label={t.clear((props.searchLabel || t.search).toLowerCase())}
                className="aura-filterbar__clear-search"
                onClick={function () {
                  draft[1]('');
                  send('');
                }}
              />
            ) : null}
          </div>
        ) : null}
        {props.children ? <div className="aura-filterbar__controls">{props.children}</div> : null}
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
            <button
              type="button"
              className="aura-filterbar__clear"
              onClick={function () {
                draft[1]('');
                sent.current = '';
                if (timer.current) clearTimeout(timer.current);
                props.onClearAll!();
              }}
            >
              {t.clearFilters}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
});
