import * as React from 'react';
import { Icon } from './Icon.js';
import { cx, uid, useMaybeControlled } from './internal.js';
import type { AccordionItem, AccordionProps } from './types.js';

const h = React.createElement;

/* ---------- Accordion: stacked sections that open and close ---------- */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(props, ref) {
  const auto = uid(),
    base = props.id || auto;
  const multiple = props.type === 'multiple';
  const st = useMaybeControlled<string | null | string[]>(
    props.value,
    props.defaultValue != null ? props.defaultValue : multiple ? [] : null,
    props.onChange,
  );
  const open: string[] = multiple ? (st[0] as string[]) || [] : st[0] ? [st[0] as string] : [];
  const HT = ('h' + (props.headingLevel || 3)) as React.ElementType;
  const items = props.items || [];
  function toggle(id: string) {
    const isOpen = open.indexOf(id) >= 0;
    if (multiple)
      st[1](
        isOpen
          ? open.filter(function (x: string) {
              return x !== id;
            })
          : open.concat([id]),
      );
    else st[1](isOpen ? (props.collapsible === false ? id : null) : id);
  }
  function onKey(e: React.KeyboardEvent<HTMLDivElement>) {
    const btns: HTMLElement[] = Array.prototype.slice.call(
      e.currentTarget.querySelectorAll(
        ':scope > .aura-accordion__item > .aura-accordion__heading > button:not([disabled])',
      ),
    );
    let i = btns.indexOf(document.activeElement as HTMLElement),
      k = e.key,
      n: HTMLElement | null = null;
    if (i < 0) return;
    if (k === 'ArrowDown') n = btns[(i + 1) % btns.length];
    else if (k === 'ArrowUp') n = btns[(i - 1 + btns.length) % btns.length];
    else if (k === 'Home') n = btns[0];
    else if (k === 'End') n = btns[btns.length - 1];
    if (n) {
      e.preventDefault();
      n.focus();
    }
  }
  return (
    <div ref={ref} className={cx('aura-accordion', props.className)} onKeyDown={onKey}>
      {items.map(function (it: AccordionItem) {
        const on = open.indexOf(it.id) >= 0,
          bid = base + '-btn-' + it.id,
          pid = base + '-panel-' + it.id;
        return (
          <div key={it.id} className={cx('aura-accordion__item', on && 'is-open')}>
            <HT className="aura-accordion__heading">
              <button
                type="button"
                id={bid}
                aria-expanded={on}
                aria-controls={pid}
                disabled={it.disabled}
                onClick={function () {
                  toggle(it.id);
                }}
              >
                {it.icon ? <Icon name={it.icon} className="aura-accordion__lead" /> : null}
                <span className="aura-accordion__title">
                  {it.title}
                  {it.description ? <span className="aura-accordion__desc">{it.description}</span> : null}
                </span>
                <Icon name="chevron-down" className="aura-accordion__chevron" />
              </button>
            </HT>
            <div id={pid} role="region" aria-labelledby={bid} className="aura-accordion__panel" hidden={!on}>
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
});
