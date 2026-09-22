import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { cx, useMaybeControlled, uid } from './internal.js';
import { Icon } from './Icon.js';
import type { AvatarProps, BreadcrumbProps, CardProps, NavItem, SideNavProps, TabItem, TabsProps } from './types.js';
const h = React.createElement;

export const Card = React.forwardRef<HTMLElement, CardProps>(function Card(props, ref) {
  var creative = props.variant === 'creative';
  return h(props.as || 'section', { ref: ref, className: cx('aura-card', creative && 'aura-card--creative', props.interactive && 'is-interactive', props.className),
      'aria-labelledby': props.title && props.titleId ? props.titleId : undefined },
    props.title || props.actions ? h('div', { className: 'aura-card__head' },
      h('div', { className: 'aura-card__heading' },
        props.title ? h('h' + (props.headingLevel || 3), { className: 'aura-card__title', id: props.titleId }, props.title) : null,
        props.description ? h('p', { className: 'aura-card__desc' }, props.description) : null),
      props.actions ? h('div', { className: 'aura-card__actions' }, props.actions) : null) : null,
    props.children ? h('div', { className: 'aura-card__body' }, props.children) : null,
    props.footer ? h('div', { className: 'aura-card__foot' }, props.footer) : null);
});

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(props, ref) {
  var items = props.tabs || [], base = uid();
  var st = useMaybeControlled<string | undefined>(props.value, props.defaultValue || (items[0] && items[0].id), props.onChange as ((id: string | undefined) => void) | undefined);
  var refs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  var current = items.filter(function (t: TabItem) { return t.id === st[0]; })[0] || items[0];
  function go(i: number) {
    var enabled = items.filter(function (t: TabItem) { return !t.disabled; });
    var t = enabled[(i + enabled.length) % enabled.length];
    st[1](t.id); if (refs.current[t.id]) refs.current[t.id]!.focus();
  }
  return h('div', { ref: ref, className: cx('aura-tabs', props.className) },
    h('div', { role: 'tablist', 'aria-label': props.label, className: 'aura-tabs__list',
      onKeyDown: function (e: React.KeyboardEvent) {
        var enabled = items.filter(function (t: TabItem) { return !t.disabled; }), i = enabled.indexOf(current);
        if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
        else if (e.key === 'Home') { e.preventDefault(); go(0); }
        else if (e.key === 'End') { e.preventDefault(); go(enabled.length - 1); }
      } },
      items.map(function (t: TabItem) {
        var on = current && t.id === current.id;
        return h('button', { key: t.id, type: 'button', role: 'tab', id: base + '-tab-' + t.id, 'aria-selected': on,
            'aria-controls': base + '-panel-' + t.id, tabIndex: on ? 0 : -1, disabled: t.disabled,
            ref: function (el: HTMLButtonElement | null): void { refs.current[t.id] = el; },
            className: cx('aura-tab', on && 'is-active'), onClick: function () { st[1](t.id); } },
          t.icon ? h(Icon, { name: t.icon }) : null, t.label,
          t.count != null ? h('span', { className: 'aura-tab__count' }, t.count) : null);
      })),
    current && current.content !== undefined ? h('div', { role: 'tabpanel', id: base + '-panel-' + current.id,
      'aria-labelledby': base + '-tab-' + current.id, tabIndex: 0, className: 'aura-tabs__panel' }, current.content) : null);
});

export const SideNav = React.forwardRef<HTMLElement, SideNavProps>(function SideNav(props, ref) {
  var t = useStrings();
  var st = useMaybeControlled<string | undefined>(props.value, props.defaultValue, props.onChange as ((id: string | undefined) => void) | undefined);
  function item(it: NavItem) {
    var on = st[0] === it.id;
    var inner = [it.icon ? h(Icon, { key: 'i', name: it.icon }) : null, h('span', { key: 'l', className: 'aura-nav__label' }, it.label),
      it.count != null ? h('span', { key: 'c', className: 'aura-nav__count' }, it.count) : null];
    var common = { className: cx('aura-nav__item', on && 'is-active'), 'aria-current': on ? 'page' : undefined,
      onClick: function (e: React.MouseEvent) { if (!it.href) e.preventDefault(); st[1](it.id); } };
    return h('li', { key: it.id }, it.href ? h('a', Object.assign({ href: it.href }, common), inner) : h('button', Object.assign({ type: 'button' }, common), inner));
  }
  return h('nav', { ref: ref, className: cx('aura-nav', props.className), 'aria-label': props.label || t.mainNav },
    props.header ? h('div', { className: 'aura-nav__header' }, props.header) : null,
    h('div', { className: 'aura-nav__scroll' },
      (props.sections || [{ items: props.items || [] }]).map(function (s: { title?: string; items: NavItem[] }, i: number) {
        return h('div', { key: i, className: 'aura-nav__section' },
          s.title ? h('p', { className: 'aura-nav__title' }, s.title) : null,
          h('ul', { className: 'aura-nav__list' }, s.items.map(item)));
      })),
    props.footer ? h('div', { className: 'aura-nav__footer' }, props.footer) : null);
});

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(props, ref) {
  var t = useStrings();
  var items = props.items || [];
  return h('nav', { ref: ref, 'aria-label': props.label || t.breadcrumb, className: cx('aura-crumbs', props.className) },
    h('ol', null, items.map(function (it: BreadcrumbProps['items'][number], i: number) {
      var last = i === items.length - 1;
      return h('li', { key: i },
        last ? h('span', { 'aria-current': 'page', className: 'aura-crumbs__current' }, it.label)
          : it.href ? h('a', { href: it.href, onClick: it.onClick }, it.label)
          : h('button', { type: 'button', onClick: it.onClick }, it.label),
        last ? null : h(Icon, { name: 'chevron-right', size: 12, className: 'aura-crumbs__sep' }));
    })));
});

var AVATAR_TONES = ['progress', 'ready', 'neutral', 'warning'];
function initials(name: string): string {
  var parts = String(name || '?').trim().split(/\s+/);
  return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : (parts[0][1] || ''))).toUpperCase();
}
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(props, ref) {
  var size = props.size || 'md', errState = React.useState(false);
  var hash = 0; String(props.name || '').split('').forEach(function (ch) { hash = (hash * 31 + ch.charCodeAt(0)) >>> 0; });
  var tone = AVATAR_TONES[hash % AVATAR_TONES.length];
  return h('span', { ref: ref, className: cx('aura-avatar', 'aura-avatar--' + size, 'aura-avatar--' + tone, props.className),
      role: 'img', 'aria-label': props.name + (props.status ? ', ' + props.status : '') },
    props.src && !errState[0] ? h('img', { src: props.src, alt: '', onError: function () { errState[1](true); } }) : h('span', { 'aria-hidden': true }, initials(props.name)),
    props.status === 'online' ? h('span', { className: 'aura-avatar__status', 'aria-hidden': true }) : null);
});
