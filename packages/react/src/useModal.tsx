import * as React from 'react';
import { devWarnOnce, focusFirst, inClosedDetails, TAB_STOPS, useMounted } from './internal.js';
import { useModalKeepOutside } from './locale.js';

/* Shared modal behaviour for Dialog and Drawer: mount after hydration, move focus in, lock page scroll,
 * trap Tab, close on Escape, and hand focus back to whatever opened it. */
export interface ModalOptions {
  /** Selector of the body part that should receive focus first. */
  bodySelector?: string | undefined;
  /** Selector of the footer, focused when the body has nothing focusable. */
  footSelector?: string | undefined;
  autoFocus?: boolean | undefined;
  onEscape?: (() => void) | undefined;
  /** Where focus goes on close instead of the opener (5.16). */
  finalFocus?: React.RefObject<HTMLElement | null> | (() => HTMLElement | null) | undefined;
  /** Once the modal has closed and left the page (5.16). */
  onCloseComplete?: (() => void) | undefined;
  /** 5.89: a selector for nodes outside the modal that stay live (with AuraProvider's modalKeepOutside). */
  keepOutside?: string | undefined;
}
/* 5.1.1: one page-scroll lock shared by every open modal. Each modal used to save and restore body overflow on its
 * own, so two dialogs closing out of order left the page locked. */
let locks = 0,
  savedOverflow = '';
function lockScroll(): () => void {
  const body = document.body;
  if (locks === 0) savedOverflow = body.style.overflow;
  locks++;
  body.style.overflow = 'hidden';
  let done = false;
  return function () {
    if (done) return;
    done = true;
    locks--;
    if (locks === 0) body.style.overflow = savedOverflow;
  };
}
/* 5.88 (Chamber-OS 206): while a modal is open everything outside it is `inert` — out of the accessibility tree and
 * unclickable, for screen readers that ignore aria-modal in browse mode (and axe). The walk keeps the modal's own
 * <body> child and every live region outside it (the Toaster, aria-live, role status / alert / log, or an element
 * marked data-aura-modal-keep) and makes the rest inert: each sibling on the way down to a kept element, so a status
 * line inside the page still announces while the buttons around it are inert. Counted per element, so stacked modals
 * closing in any order restore only what they set; an element the app made inert itself is left alone. A menu,
 * popover or toast opened while the modal is open is added after this ran, so it stays live. */
const KEEP_LIVE =
  '.aura-toaster, [data-aura-modal-keep], [aria-live]:not([aria-live="off"]), [role="status"], [role="alert"], [role="log"], next-route-announcer';
/* 5.89 (Chamber-OS addendum 109): third-party challenge frames that may already sit in the page when a modal opens
 * (Stripe's 3-D Secure and Elements frames, reCAPTCHA, hCaptcha, Cloudflare Turnstile; 5.90, Chamber-OS 210: React Aria's
 * top layer, which Chamber-OS measured on Stripe's 3-D Secure layer) are never made inert — a
 * payment or a sign-in started from the modal must be finishable. Nodes appended to <body> after the modal opened
 * are already left live (<body> isn't watched). Apps add their own with keepOutside / modalKeepOutside. */
const KEEP_THIRD_PARTY =
  '[data-react-aria-top-layer], iframe[name^="__privateStripeFrame"], iframe[src*="js.stripe.com"], iframe[src*="hooks.stripe.com"], iframe[src*="/recaptcha/"], iframe[src*="hcaptcha.com"], iframe[src*="challenges.cloudflare.com"]';
const NOT_CONTENT: Record<string, true> = {
  SCRIPT: true,
  STYLE: true,
  LINK: true,
  META: true,
  TEMPLATE: true,
  NOSCRIPT: true,
};
const inertBy = new Map<Element, number>();
/* Open modals, each with its <body>-level layer and the order it rendered open in (render runs parent before child,
 * effects child before parent, so the render order is the one that holds when both open in one commit). One opened
 * after this one — a confirm from inside it, before this one's idle walk ran, or a nested Dialog open on first
 * render — is kept live, never made inert by it. */
let renderSeq = 0;
const openModals: { el: HTMLElement; layer: Element | null; order: number }[] = [];
function topOf(el: Element): Element | null {
  let top: Element = el;
  while (top.parentElement && top.parentElement !== document.body) top = top.parentElement;
  return top.parentElement === document.body ? top : null;
}
function inertOthers(el: HTMLElement, later: Element[], extra: string | null): () => void {
  const body = document.body;
  const modal = topOf(el);
  if (!modal) return function () {};
  /* Kept elements, and (as a Set) every ancestor of one: the walk goes into those. */
  const keep = new Set<Element>([modal]),
    path = new Set<Element>();
  const addKeep = function (k: Element) {
    keep.add(k);
    for (let p = k.parentElement; p && p !== body && !path.has(p); p = p.parentElement) path.add(p);
  };
  let sel = KEEP_LIVE + ', ' + KEEP_THIRD_PARTY;
  if (extra) {
    try {
      document.createDocumentFragment().querySelector(extra); // syntax only, no page walk
      sel += ', ' + extra;
    } catch (e) {
      devWarnOnce(
        'modal-keep-outside',
        'keepOutside / modalKeepOutside "' + extra + '" is not a valid selector; ignored.',
      );
    }
  }
  const scanLive = function (root: Element) {
    const live = root.querySelectorAll(sel);
    for (let i = 0; i < live.length; i++) if (!modal.contains(live[i])) addKeep(live[i]);
  };
  scanLive(body);
  for (let i = 0; i < later.length; i++) if (later[i].parentElement === body) addKeep(later[i]);
  const marked: Element[] = [];
  /* React may replace an element behind the modal while it is open (a list that finished loading, a branch that
   * flipped) inside one of the walked containers; the new one is made inert too, or walked into when it holds a live
   * region. <body> itself isn't watched: portals opened from the modal (menus, popovers, toasts) land there. Content
   * added inside an element that is already inert stays inert, live regions included. */
  const mo: MutationObserver | null =
    typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(function (records: MutationRecord[]) {
          for (let r = 0; r < records.length; r++) {
            const added = records[r].addedNodes;
            for (let i = 0; i < added.length; i++) {
              const c = added[i];
              if (c.nodeType !== 1 || !(c as Element).isConnected) continue;
              if ((c as Element).matches(sel)) addKeep(c as Element);
              scanLive(c as Element);
              mark(c as Element);
            }
          }
        });
  const mark = function (c: Element) {
    if (NOT_CONTENT[c.tagName] || keep.has(c)) return;
    /* Next.js's route announcer and dev overlay, and any element whose open shadow root holds a live region the scan
     * can't see, are kept whole; another web component is made inert as usual. */
    if (c.tagName === 'NEXT-ROUTE-ANNOUNCER' || c.tagName === 'NEXTJS-PORTAL') return;
    if (c.shadowRoot && c.shadowRoot.querySelector(sel)) return;
    if (path.has(c)) return walk(c);
    if (marked.indexOf(c) >= 0) return;
    const n = inertBy.get(c) || 0;
    if (n === 0) {
      if (c.hasAttribute('inert')) return; // the app's own
      c.setAttribute('inert', '');
    }
    inertBy.set(c, n + 1);
    marked.push(c);
  };
  const walk = function (parent: Element) {
    if (parent !== body && mo) mo.observe(parent, { childList: true });
    const kids = parent.children;
    for (let i = 0; i < kids.length; i++) mark(kids[i]);
  };
  walk(body);
  let done = false;
  return function () {
    if (done) return;
    done = true;
    if (mo) mo.disconnect();
    for (let i = 0; i < marked.length; i++) {
      const c = marked[i],
        n = (inertBy.get(c) || 1) - 1;
      if (n > 0) inertBy.set(c, n);
      else {
        inertBy.delete(c);
        c.removeAttribute('inert');
      }
    }
  };
}
/* The controls Tab can actually reach: not tabindex=-1 (roving tabs, closed groups' children), not hidden, and not
 * inside a closed <details> (5.57). */
function tabbable(el: HTMLElement): HTMLElement[] {
  const all = Array.prototype.filter.call(el.querySelectorAll<HTMLElement>(TAB_STOPS), function (c: HTMLElement) {
    return c.tabIndex >= 0 && !inClosedDetails(c);
  }) as HTMLElement[];
  const shown = all.filter(function (c: HTMLElement) {
    return c.getClientRects().length > 0;
  });
  /* No layout at all (jsdom in unit tests): don't treat every control as hidden. */
  return shown.length ? shown : all;
}
export function useModal(
  open: boolean | undefined,
  ref: React.RefObject<HTMLElement | null>,
  opts?: ModalOptions,
): { ready: boolean; onKeyDown: (e: React.KeyboardEvent) => void } {
  const mounted = useMounted();
  const providerKeep = useModalKeepOutside();
  const keepRef = React.useRef<string | null>(null);
  keepRef.current = [opts && opts.keepOutside, providerKeep].filter(Boolean).join(', ') || null;
  const order = React.useMemo(
    function () {
      return open ? ++renderSeq : 0;
    },
    [open],
  );
  const prev = React.useRef<HTMLElement | null>(null);
  const o = opts || {};
  /* Read at close, not when it opened: the element to focus (a row just saved) usually exists only by then. */
  const latest = React.useRef(o);
  latest.current = o;
  React.useEffect(
    function () {
      if (!open || !mounted) return;
      prev.current = document.activeElement as HTMLElement | null;
      const unlock = lockScroll();
      const el = ref.current;
      /* Deferred to the next idle moment: a page still hydrating other roots (or Suspense boundaries) would find inert
       * on server HTML it hasn't hydrated yet and warn in development (fewer such warnings, not none: a Suspense
       * boundary hydrating later still can). aria-modal and the Tab trap hold until then. */
      let release = function () {};
      const w = window as unknown as {
        requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
        cancelIdleCallback?: (h: number) => void;
      };
      const entry = { el: el as HTMLElement, layer: el ? topOf(el) : null, order: order };
      if (el) openModals.push(entry);
      const apply = function () {
        if (!el || !el.isConnected) return;
        const later: Element[] = [];
        for (let i = 0; i < openModals.length; i++) {
          const m = openModals[i];
          if (m !== entry && m.order > entry.order) later.push(m.layer || m.el);
        }
        release = inertOthers(el, later, keepRef.current);
      };
      const idle = w.requestIdleCallback ? w.requestIdleCallback(apply, { timeout: 200 }) : 0,
        timer = w.requestIdleCallback ? 0 : window.setTimeout(apply, 50); // Safari before 18.2
      let raf = 0;
      /* The Tab stops inside a part. TAB_STOPS is a selector list, so every part is scoped (5.1: before, `button`
       * alone matched the header's close button). focusFirst skips tabindex=-1 (roving tabs, segments), anything
       * hidden and (5.57) anything in a closed <details>, and stops at the first that takes focus; else the panel
       * itself (tabIndex -1), so focus is always inside the modal and Escape and the Tab trap work. */
      const inPart = function (scope: string | undefined): ArrayLike<HTMLElement> {
        if (!scope || !el) return [];
        const sel = TAB_STOPS.split(',')
          .map(function (s: string) {
            return scope + ' ' + s;
          })
          .join(',');
        return el.querySelectorAll<HTMLElement>(sel);
      };
      if (el && o.autoFocus !== false) {
        const auto = el.querySelector<HTMLElement>('[data-autofocus]');
        if (!focusFirst(el, auto, [inPart(o.bodySelector), inPart(o.footSelector)])) el.focus();
        /* 5.77 (Chamber-OS 194): on a short screen the Dialog scrolls as one box (5.76), and focusing a footer button
         * (data-autofocus on Cancel, or a dialog with nothing to fill in) scrolled it to its end — the title and what
         * is being confirmed started out of view. Open at the top instead; Tab or a scroll reaches the button. A
         * field in the body keeps the browser's scroll: it is what the person types in next, and it is shown. Only
         * when the person can scroll the panel (not a clipped overflow: hidden one, where the focused button must stay
         * where the browser put it) and only when the head has actually left view. WebKit scrolls to the focused
         * element a frame later, so it is checked again over the next two frames — while that element still has focus. */
        const foot = o.footSelector ? el.querySelector(o.footSelector) : null,
          head = el.firstElementChild,
          first = document.activeElement,
          panel = el;
        const toTop = function () {
          if (
            foot &&
            foot.contains(first) &&
            document.activeElement === first &&
            panel.scrollTop > 0 &&
            /auto|scroll/.test(getComputedStyle(panel).overflowY) &&
            head &&
            head.getBoundingClientRect().top < panel.getBoundingClientRect().top
          )
            panel.scrollTop = 0;
        };
        toTop();
        if (foot && foot.contains(first))
          raf = requestAnimationFrame(function () {
            toTop();
            raf = requestAnimationFrame(toTop); // reassigned, so the cleanup cancels whichever frame is pending
          });
      }
      return function () {
        cancelAnimationFrame(raf);
        unlock();
        if (idle && w.cancelIdleCallback) w.cancelIdleCallback(idle);
        clearTimeout(timer);
        if (openModals.indexOf(entry) >= 0) openModals.splice(openModals.indexOf(entry), 1);
        release(); // before focus goes back to the opener, which was inert
        const l = latest.current;
        const ff = l.finalFocus;
        const to = ff ? (typeof ff === 'function' ? ff() : ff.current) : null;
        const back = to && to.isConnected ? to : prev.current;
        if (back && back.focus) back.focus();
        if (l.onCloseComplete) l.onCloseComplete();
      };
    },
    [open, mounted],
  );
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.stopPropagation();
      if (o.onEscape) o.onEscape();
      return;
    }
    if (e.key !== 'Tab' || !ref.current || e.defaultPrevented) return;
    /* A panel portaled out of the dialog (Popover, a date picker's calendar) keeps its own Tab order; its key presses
     * still bubble here through React. */
    if (!ref.current.contains(e.target as Node)) return;
    /* 5.1.1: wrap between the first and last *reachable* controls; the raw list ended on a tabindex=-1 or hidden
     * control, so Tab from the real last one left the dialog. */
    const list = tabbable(ref.current);
    if (!list.length) {
      e.preventDefault();
      return;
    }
    const first = list[0],
      last = list[list.length - 1],
      active = document.activeElement as HTMLElement | null,
      stray = active === ref.current;
    if (e.shiftKey && (active === first || stray)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && (active === last || stray)) {
      e.preventDefault();
      first.focus();
    }
  }
  return { ready: !!open && mounted, onKeyDown: onKeyDown };
}
