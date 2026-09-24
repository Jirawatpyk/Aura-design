import * as React from 'react';
import { useStrings, useAuraLocale, useLinkComponent } from './locale.js';
import { cx, omit, useMaybeControlled, compare, useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Checkbox } from './Checkbox.js';
import { Menu } from './Menu.js';
import { StatusPill, toneFor, TONE_ORDER } from './StatusPill.js';
import type {
  DataTableColumn,
  DataTableEmpty,
  DataTableProps,
  DataTableSort,
  MenuItem,
  StatusPillProps,
} from './types.js';

type Col = DataTableColumn;
type Row = Record<string, any>;
type RowKey = string | number;
/* A cell to focus after the next render: row, column index, or a column key (after reordering). */
type PendingFocus = { r: number; c?: number; key?: string | null };
type MenuState = { kind: 'col' | 'picker'; key: string | null; anchor: HTMLElement; rc?: { r: number; c: number } };
type DragState = { key: string; over?: string; after?: boolean };
const BP: Record<string, number> = { sm: 640, md: 768, lg: 1024, xl: 1280 };

const DEFAULT_COLUMNS: Col[] = [
  { key: 'id', label: 'ID', width: 96, mono: true },
  { key: 'name', label: 'NAME', width: 160 },
  { key: 'status', label: 'STATUS', width: 112, pill: true },
  { key: 'owner', label: 'OWNER' },
];

const SKELETON_WIDTHS = ['72%', '56%', '84%', '44%', '64%'];
const ROW_H_DEFAULT = 48,
  OVERSCAN = 8,
  FLEX_MIN = 160;

/** Enterprise data table: 48px rows, hairline dividers, mono header band. */
export const DataTable = React.forwardRef<HTMLDivElement, DataTableProps>(function DataTable(props, ref) {
  const t = useStrings();
  const columns = props.columns || DEFAULT_COLUMNS;
  const byKey: Record<string, Col> = {};
  columns.forEach(function (c: Col) {
    byKey[c.key] = c;
  });
  const rows: Row[] = props.rows || [];
  const rowKey = props.rowKey || columns[0].key;
  const manual = !!props.manual;
  const Link = useLinkComponent(props.linkComponent);
  /* busy: a load is under way. manual + rows already shown → keep them (refreshing); otherwise skeleton rows (loading). */
  const busy = !!props.loading;
  const refreshing = busy && manual && rows.length > 0;
  const loading = busy && !refreshing;
  const selectable = !!props.selectable;
  const reorderable = props.reorderable !== false && !!props.columnControls;
  const controls = !!props.columnControls;

  const sortState = useMaybeControlled<DataTableSort | null>(props.sort, props.defaultSort || null, props.onSortChange);
  const sort = sortState[0],
    setSort = sortState[1];
  const selState = useMaybeControlled<RowKey[]>(props.selected, props.defaultSelected || [], props.onSelectionChange);
  const selected = selState[0],
    setSelected = selState[1];
  const pageState = useMaybeControlled<number>(props.page, props.defaultPage || 1, props.onPageChange);
  const orderState = useMaybeControlled<string[]>(
    props.columnOrder,
    columns.map(function (c: Col) {
      return c.key;
    }),
    props.onColumnOrderChange,
  );
  const hiddenState = useMaybeControlled<string[]>(
    props.hiddenColumns,
    columns
      .filter(function (c: Col) {
        return c.hidden;
      })
      .map(function (c: Col) {
        return c.key;
      }),
    props.onHiddenColumnsChange,
  );
  const pinState = useMaybeControlled<string[]>(
    props.pinnedColumns,
    columns
      .filter(function (c: Col) {
        return c.pinned;
      })
      .map(function (c: Col) {
        return c.key;
      }),
    props.onPinnedColumnsChange,
  );
  const widthState = React.useState<Record<string, number>>({});
  const widths = widthState[0],
    setWidths = widthState[1];
  const activeState = React.useState({ r: 1, c: 0 });
  const scrollState = React.useState(0);
  const scrollTop = scrollState[0],
    setScrollTop = scrollState[1];
  const scrolledX = React.useState(false);
  const menuState = React.useState<MenuState | null>(null);
  const menu = menuState[0],
    setMenu = menuState[1];
  const dragState = React.useState<DragState | null>(null);
  const drag = dragState[0],
    setDrag = dragState[1];
  const gridRef = React.useRef<HTMLDivElement | null>(null);
  const wrapRef = React.useRef<HTMLDivElement | null>(null),
    wrapMerged = useMergedRef(ref, wrapRef);
  /* The table's own width: drives stackBelow (cards) and per-column hideBelow. */
  const boxWidth = React.useState<number | null>(null);
  const measure =
    !!props.stackBelow ||
    columns.some(function (c: Col) {
      return c.hideBelow != null;
    });
  React.useEffect(
    function () {
      if (!measure || !wrapRef.current || typeof ResizeObserver === 'undefined') return;
      const ro = new ResizeObserver(function (en: ResizeObserverEntry[]) {
        boxWidth[1](en[0].contentRect.width);
      });
      ro.observe(wrapRef.current);
      return function () {
        ro.disconnect();
      };
    },
    [measure],
  );
  const stacked = !!props.stackBelow && boxWidth[0] != null && boxWidth[0] < props.stackBelow;
  function tooNarrow(c: Col): boolean {
    if (c.hideBelow == null || boxWidth[0] == null || stacked) return false;
    const px = typeof c.hideBelow === 'number' ? c.hideBelow : BP[c.hideBelow];
    return px != null && boxWidth[0] < px;
  }
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  /* Row height comes from CSS (--aura-table-row-height: 48, 40 in compact density, 48 again on touch), so the
   * virtual window always matches what the browser draws. Server render assumes 48. */
  const rowH = React.useState(ROW_H_DEFAULT);
  const ROW_H = rowH[0];
  useIsoLayoutEffect(function () {
    const el = wrapRef.current;
    if (!el || typeof getComputedStyle === 'undefined') return;
    const v = parseFloat(getComputedStyle(el).getPropertyValue('--aura-table-row-height'));
    if (v > 0 && v !== rowH[0]) rowH[1](v);
  });
  const pending = React.useRef<PendingFocus | null>(null);
  const resizing = React.useRef(false);

  /* Buttons and links inside cells are reached with Enter (APG grid), not Tab: the grid stays one tab stop. */
  useIsoLayoutEffect(function () {
    if (stacked || !gridRef.current) return;
    const els = gridRef.current.querySelectorAll<HTMLElement>(
      '.aura-table__td button, .aura-table__td a[href], .aura-table__td input, .aura-table__td select, .aura-table__td textarea, .aura-table__td [tabindex="0"]',
    );
    for (let i = 0; i < els.length; i++) if (els[i].tabIndex !== -1) els[i].tabIndex = -1;
  });
  function widthOf(c: Col): number | undefined {
    return widths[c.key] != null ? widths[c.key] : c.width;
  }

  /* columns: order → hide → pinned first. Only sized columns can pin. */
  const order = orderState[0].filter(function (k: string) {
    return byKey[k];
  });
  columns.forEach(function (c: Col) {
    if (order.indexOf(c.key) < 0) order.push(c.key);
  });
  const hidden = hiddenState[0],
    pinnedKeys = pinState[0];
  const shown = order
    .filter(function (k: string) {
      return hidden.indexOf(k) < 0;
    })
    .map(function (k: string) {
      return byKey[k];
    })
    .filter(function (c: Col) {
      return !tooNarrow(c);
    });
  function isPinned(c: Col): boolean {
    return pinnedKeys.indexOf(c.key) >= 0 && c.width != null;
  }
  const vis = shown.filter(isPinned).concat(
    shown.filter(function (c: Col) {
      return !isPinned(c);
    }),
  );
  const nPinned = vis.filter(isPinned).length;
  const hasFlex = vis.some(function (c: Col) {
    return widthOf(c) == null;
  });
  let fixedSum = 0;
  vis.forEach(function (c: Col) {
    fixedSum += widthOf(c) != null ? widthOf(c)! : FLEX_MIN;
  });
  let pinOffsets: Record<string, number> = {},
    acc = 0;
  vis.forEach(function (c: Col) {
    if (isPinned(c)) {
      pinOffsets[c.key] = acc;
      acc += widthOf(c)!;
    }
  });
  const selW = selectable ? ' + var(--aura-table-select-width)' : '';
  const gutterR = controls ? 'var(--aura-space-12)' : 'var(--aura-space-6)';
  const rowMinWidth = 'calc(' + fixedSum + 'px + var(--aura-space-6) + ' + gutterR + selW + ')';

  function cellStyle(c: Col, i: number): React.CSSProperties {
    let w = widthOf(c),
      s: React.CSSProperties;
    if (w == null) s = { flex: '1 1 0', minWidth: (c.minWidth || FLEX_MIN) + 'px' };
    else if (!hasFlex && i === vis.length - 1) s = { flex: '1 0 auto', width: w + 'px' };
    else s = { width: w + 'px', flex: 'none' };
    if (isPinned(c)) s.left = 'calc(var(--aura-space-6)' + selW + ' + ' + pinOffsets[c.key] + 'px)';
    return s;
  }

  /* sort (memoised: thousands of rows) */
  const view = React.useMemo(
    function () {
      if (manual || !sort || !sort.key || !byKey[sort.key]) return rows;
      const col = byKey[sort.key];
      const val =
        col.sortValue ||
        (col.pill
          ? function (r: Row) {
              return TONE_ORDER[(col.tones && col.tones[r[col.key]]) || toneFor(r[col.key])];
            }
          : function (r: Row) {
              return r[col.key];
            });
      const dir = sort.dir === 'desc' ? -1 : 1;
      return rows
        .map(function (r: Row, i: number): [Row, number] {
          return [r, i];
        })
        .sort(function (a: [Row, number], b: [Row, number]) {
          return compare(val(a[0]), val(b[0])) * dir || a[1] - b[1];
        })
        .map(function (p: [Row, number]) {
          return p[0];
        });
    },
    [rows, manual, sort && sort.key, sort && sort.dir],
  );
  function nextSort(key: string): DataTableSort | null {
    if (!sort || sort.key !== key) return { key: key, dir: 'asc' };
    if (sort.dir === 'asc') return { key: key, dir: 'desc' };
    return null;
  }

  /* page */
  const pageSize = props.pageSize || 0;
  /* manual: the server pages. Without totalRows, assume one more page while a page comes back full. */
  const total = manual
    ? props.totalRows != null
      ? props.totalRows
      : (Math.max(1, pageState[0] || 1) - 1) * pageSize + rows.length + (pageSize && rows.length >= pageSize ? 1 : 0)
    : view.length;
  const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
  const page = Math.min(Math.max(1, pageState[0] || 1), pageCount);
  const first = pageSize ? (page - 1) * pageSize : 0;
  const pageRows = pageSize && !manual ? view.slice(first, first + pageSize) : view;
  const canSortAny = !busy && (manual ? total > 1 : rows.length > 1);
  const shownTotal = manual && props.totalRows == null ? first + rows.length : total;
  /* Pager links (getPageHref) with no onPageChange: the URL is the page state, so keyboard paging follows the link. */
  const linkPaging = !!props.getPageHref && !props.onPageChange;
  const prevLink = React.useRef<HTMLElement | null>(null),
    nextLink = React.useRef<HTMLElement | null>(null);
  function goPage(p: number, focus?: PendingFocus): boolean {
    const next = Math.min(Math.max(1, p), pageCount);
    if (next === page) return false;
    if (linkPaging) {
      const a = next === page - 1 ? prevLink.current : next === page + 1 ? nextLink.current : null;
      if (a) a.click();
      return false;
    }
    if (focus) pending.current = focus;
    pageState[1](next);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    return true;
  }
  function sortBy(key: string) {
    setSort(nextSort(key));
    if (!(manual && linkPaging)) goPage(1);
  }
  /* Row links: the first column's content is the link; a click or Enter elsewhere on the row follows it. */
  const rowHref = props.getRowHref;
  function followRow(el: HTMLElement | null, e?: React.MouseEvent | React.KeyboardEvent) {
    const a = el && el.querySelector<HTMLElement>('.aura-table__row-link');
    if (!a) return;
    a.dispatchEvent(
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window,
        ctrlKey: !!(e && e.ctrlKey),
        metaKey: !!(e && e.metaKey),
        shiftKey: !!(e && e.shiftKey),
        altKey: !!(e && e.altKey),
      }),
    );
  }
  function rowLinkWrap(r: Row, content: React.ReactNode): React.ReactNode {
    return rowHref ? (
      <Link href={rowHref(r)} className="aura-table__row-link">
        {content}
      </Link>
    ) : (
      content
    );
  }

  /* virtual window */
  const height = props.height || 0;
  const virtual = !!height && !loading && pageRows.length > 0;
  const bodyH = Math.max(ROW_H, height - ROW_H);
  let start = 0,
    end = pageRows.length;
  if (virtual) {
    start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
    end = Math.min(pageRows.length, Math.ceil((scrollTop + bodyH) / ROW_H) + OVERSCAN);
  }
  const visibleRows = Math.max(1, Math.floor(bodyH / ROW_H));

  /* grid geometry: r 0 = header, 1..N = rows; c 0.. = [select?] + vis */
  const nCols = vis.length + (selectable ? 1 : 0);
  const nRows = loading ? 0 : pageRows.length;
  const active = activeState[0];
  const ar = Math.min(active.r, nRows),
    ac = Math.min(active.c, nCols - 1);
  const activeRendered = ar === 0 || (ar - 1 >= start && ar - 1 < end);
  function colAt(ci: number): Col | null {
    return selectable ? (ci === 0 ? null : vis[ci - 1]) : vis[ci];
  }
  function tabFor(r: number, c: number): number {
    if (!activeRendered) return r === 0 && c === ac ? 0 : -1;
    return r === ar && c === ac ? 0 : -1;
  }

  React.useEffect(function () {
    const p = pending.current;
    if (!p || !gridRef.current) return;
    let c = p.c;
    if (p.key) {
      let at = -1;
      vis.forEach(function (x: Col, i: number) {
        if (x.key === p!.key) at = i;
      });
      c = at >= 0 ? at + (selectable ? 1 : 0) : Math.min(p.c || 0, nCols - 1);
    }
    const el = gridRef.current.querySelector<HTMLElement>('[data-rc="' + p.r + ':' + c + '"]');
    if (el) {
      pending.current = null;
      el.focus();
    }
  });
  function focusCell(r: number, c: number) {
    r = Math.max(0, Math.min(r, nRows));
    c = Math.max(0, Math.min(c, nCols - 1));
    activeState[1]({ r: r, c: c });
    pending.current = { r: r, c: c };
    if (virtual && r > 0) {
      const sc = scrollRef.current!,
        top = (r - 1) * ROW_H;
      if (top < sc.scrollTop) sc.scrollTop = top;
      else if (top + ROW_H > sc.scrollTop + bodyH) sc.scrollTop = top + ROW_H - bodyH;
      setScrollTop(sc.scrollTop);
    }
    const el = gridRef.current && gridRef.current.querySelector<HTMLElement>('[data-rc="' + r + ':' + c + '"]');
    if (el) {
      pending.current = null;
      el.focus();
    }
  }

  /* select */
  const pageKeys = pageRows.map(function (r: Row): RowKey {
    return r[rowKey];
  });
  const selSet: Record<string, boolean> = {};
  selected.forEach(function (k: RowKey) {
    selSet[k] = true;
  });
  const nSel = pageKeys.filter(function (k: RowKey) {
    return selSet[k];
  }).length;
  const all = nSel > 0 && nSel === pageKeys.length;
  function toggle(k: RowKey, on: boolean) {
    setSelected(
      on
        ? selected.concat([k])
        : selected.filter(function (x: RowKey) {
            return x !== k;
          }),
    );
  }
  function toggleAll() {
    setSelected(
      all
        ? selected.filter(function (k: RowKey) {
            return pageKeys.indexOf(k) < 0;
          })
        : selected.concat(
            pageKeys.filter(function (k: RowKey) {
              return !selSet[k];
            }),
          ),
    );
  }

  /* resize */
  function canResize(c: Col): boolean {
    return !!props.resizable && c.resizable !== false && c.width != null;
  }
  function clampW(c: Col, w: number): number {
    return Math.round(Math.min(c.maxWidth || 480, Math.max(c.minWidth || 64, w)));
  }
  function setW(c: Col, w: number, done?: boolean) {
    const nw = clampW(c, w);
    setWidths(function (prev: Record<string, number>) {
      const o = Object.assign({}, prev);
      o[c.key] = nw;
      return o;
    });
    if (done && props.onColumnResize) props.onColumnResize(c.key, nw);
  }
  function startResize(c: Col, e: React.PointerEvent<HTMLElement>) {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    let x0 = e.clientX,
      w0 = widthOf(c) as number,
      last = w0;
    const el = e.currentTarget;
    el.classList.add('is-dragging');
    document.body.style.cursor = 'col-resize';
    function move(ev: PointerEvent) {
      last = clampW(c, w0 + ev.clientX - x0);
      setW(c, last);
    }
    function up() {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      el.classList.remove('is-dragging');
      document.body.style.cursor = '';
      setTimeout(function () {
        resizing.current = false;
      }, 0);
      if (props.onColumnResize) props.onColumnResize(c.key, last);
    }
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  }

  /* reorder / pin / hide */
  function moveCol(key: string, delta: number): boolean {
    const c = byKey[key],
      group = vis.filter(function (x: Col) {
        return isPinned(x) === isPinned(c);
      });
    const gi = group.indexOf(c),
      target = group[gi + delta];
    if (!target) return false;
    const o = order.slice(),
      from = o.indexOf(key),
      to = o.indexOf(target.key);
    o.splice(from, 1);
    o.splice(to, 0, key);
    orderState[1](o);
    return true;
  }
  function dropCol(key: string, targetKey: string, after?: boolean) {
    if (key === targetKey) return;
    const a = byKey[key],
      b = byKey[targetKey];
    if (isPinned(a) !== isPinned(b)) return;
    const o = order.slice();
    o.splice(o.indexOf(key), 1);
    const to = o.indexOf(targetKey) + (after ? 1 : 0);
    o.splice(to, 0, key);
    orderState[1](o);
  }
  function togglePin(key: string) {
    pinState[1](
      pinnedKeys.indexOf(key) >= 0
        ? pinnedKeys.filter(function (k: string) {
            return k !== key;
          })
        : pinnedKeys.concat([key]),
    );
  }
  function setHidden(key: string, hide: boolean) {
    if (hide && shown.length <= 1) return;
    hiddenState[1](
      hide
        ? hidden.concat([key])
        : hidden.filter(function (k: string) {
            return k !== key;
          }),
    );
  }
  function resetColumns() {
    orderState[1](
      columns.map(function (c: Col) {
        return c.key;
      }),
    );
    hiddenState[1](
      columns
        .filter(function (c: Col) {
          return c.hidden;
        })
        .map(function (c: Col) {
          return c.key;
        }),
    );
    pinState[1](
      columns
        .filter(function (c: Col) {
          return c.pinned;
        })
        .map(function (c: Col) {
          return c.key;
        }),
    );
    setWidths({});
  }

  function columnMenuItems(c: Col): MenuItem[] {
    const group = vis.filter(function (x: Col) {
        return isPinned(x) === isPinned(c);
      }),
      gi = group.indexOf(c);
    const items: MenuItem[] = [];
    if (c.sortable)
      items.push(
        {
          label: t.sortAsc,
          icon: 'arrow-up',
          onSelect: function () {
            setSort({ key: c.key, dir: 'asc' });
            goPage(1);
          },
        },
        {
          label: t.sortDesc,
          icon: 'arrow-down',
          onSelect: function () {
            setSort({ key: c.key, dir: 'desc' });
            goPage(1);
          },
        },
        { separator: true },
      );
    if (c.width != null)
      items.push({
        label: isPinned(c) ? t.unpin : t.pin,
        icon: isPinned(c) ? 'pin-off' : 'pin',
        onSelect: function () {
          togglePin(c.key);
        },
      });
    if (reorderable)
      items.push(
        {
          label: t.moveLeft,
          icon: 'arrow-left',
          disabled: gi <= 0,
          onSelect: function () {
            moveCol(c.key, -1);
          },
        },
        {
          label: t.moveRight,
          icon: 'arrow-right',
          disabled: gi >= group.length - 1,
          onSelect: function () {
            moveCol(c.key, 1);
          },
        },
      );
    items.push(
      { separator: true },
      {
        label: t.hideColumn,
        icon: 'eye-off',
        disabled: shown.length <= 1,
        onSelect: function () {
          setHidden(c.key, true);
        },
      },
    );
    return items;
  }
  function pickerItems(): MenuItem[] {
    return order
      .map(function (k: string): MenuItem {
        const c = byKey[k],
          on = hidden.indexOf(k) < 0;
        return {
          label: c.label || (c.actions ? t.actions : c.key),
          checked: on,
          keepOpen: true,
          disabled: on && shown.length <= 1,
          onSelect: function () {
            setHidden(k, on);
          },
        };
      })
      .concat([{ separator: true }, { label: t.resetColumns, icon: 'rotate-ccw', onSelect: resetColumns }]);
  }
  function openMenu(kind: MenuState['kind'], key: string | null, anchor: HTMLElement, rc?: MenuState['rc']) {
    setMenu({ kind: kind, key: key, anchor: anchor, rc: rc });
  }
  function closeMenu(restore: boolean) {
    const m = menu;
    setMenu(null);
    if (restore && m) {
      if (m.kind === 'col') pending.current = { r: 0, key: m.key, c: m.rc ? m.rc.c : 0 };
      else if (m.anchor) m.anchor.focus();
    }
  }

  /* keyboard: the grid is one tab stop; arrows move a cell at a time */
  function onGridKey(e: React.KeyboardEvent) {
    const target = e.target as HTMLElement;
    if (!gridRef.current || !gridRef.current.contains(target)) return;
    const rc = target.getAttribute && target.getAttribute('data-rc');
    if (!rc) {
      /* Escape from a control inside a cell (row-action button, link) goes back to the cell. */
      const cell = e.key === 'Escape' && target.closest && target.closest<HTMLElement>('[data-rc]');
      if (cell) {
        e.preventDefault();
        cell.focus();
      }
      return;
    }
    const p = rc.split(':'),
      r = +p[0],
      c = +p[1],
      k = e.key,
      col = colAt(c);
    const row = r > 0 ? pageRows[r - 1] : null;
    let handled = true;
    if (r === 0 && col && e.altKey && (k === 'ArrowLeft' || k === 'ArrowRight') && canResize(col))
      setW(col, widthOf(col)! + (k === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 48 : 16), true);
    else if (r === 0 && col && e.ctrlKey && e.shiftKey && (k === 'ArrowLeft' || k === 'ArrowRight') && reorderable) {
      if (moveCol(col.key, k === 'ArrowLeft' ? -1 : 1)) pending.current = { r: 0, key: col.key, c: c };
    } else if (
      r === 0 &&
      col &&
      ((e.altKey && k === 'ArrowDown') || k === 'ContextMenu' || (e.shiftKey && k === 'F10')) &&
      controls
    )
      openMenu('col', col.key, target, { r: 0, c: c });
    else if (k === 'ArrowRight') focusCell(r, c + 1);
    else if (k === 'ArrowLeft') focusCell(r, c - 1);
    else if (k === 'ArrowDown') {
      if (r < nRows) focusCell(r + 1, c);
      else if (pageSize && page < pageCount && goPage(page + 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
    } else if (k === 'ArrowUp') {
      if (r > 1 || (r === 1 && !(pageSize && page > 1))) focusCell(r - 1, c);
      else if (r === 1 && goPage(page - 1, { r: pageSize, c: c })) activeState[1]({ r: pageSize, c: c });
    } else if (k === 'Home') focusCell(e.ctrlKey ? 1 : r, 0);
    else if (k === 'End') focusCell(e.ctrlKey ? nRows : r, nCols - 1);
    else if (k === 'PageDown') {
      if (pageSize) {
        if (goPage(page + 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
      } else focusCell(Math.min(nRows, r + visibleRows), c);
    } else if (k === 'PageUp') {
      if (pageSize) {
        if (goPage(page - 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
      } else focusCell(Math.max(1, r - visibleRows), c);
    } else if (k === 'F2' && r > 0) {
      /* F2 (like Enter) moves into a control inside the cell; Escape brings focus back to the cell. */
      const inner = target.querySelector<HTMLElement>('button, a[href], input, select, textarea');
      if (inner) inner.focus();
      else handled = false;
    } else if (k === ' ' || k === 'Enter') {
      if (r === 0 && !col && selectable && nRows) toggleAll();
      else if (r === 0 && col && col.sortable && canSortAny) sortBy(col.key);
      else if (r > 0 && k === ' ' && selectable) toggle(row![rowKey], !selSet[row![rowKey]]);
      else if (
        r > 0 &&
        k === 'Enter' &&
        rowHref &&
        !target.querySelector('button, a[href]:not(.aura-table__row-link), input, select, textarea')
      )
        followRow(target.closest<HTMLElement>('[role="row"]'), e);
      else if (r > 0 && k === 'Enter' && target.querySelector('button, a[href], input, select, textarea'))
        target.querySelector<HTMLElement>('button, a[href], input, select, textarea')!.focus();
      else if (r > 0 && k === 'Enter' && props.onRowActivate) props.onRowActivate(row!);
      else handled = false;
    } else handled = false;
    if (handled) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  /* header */
  const head: React.ReactElement[] = [<span key="__gl" className="aura-table__gutter" aria-hidden={true} />];
  if (selectable)
    head.push(
      <span
        key="__sel"
        role="columnheader"
        aria-colindex={1}
        className={cx('aura-table__sel', nPinned && 'is-pinned')}
        tabIndex={tabFor(0, 0)}
        data-rc="0:0"
        aria-label={t.selectRows}
        onFocus={function () {
          activeState[1]({ r: 0, c: 0 });
        }}
      >
        {nRows ? (
          <Checkbox
            checked={all}
            indeterminate={nSel > 0 && !all}
            tabIndex={-1}
            label={all ? t.deselectAllRows : t.selectAllRows}
            onChange={toggleAll}
          />
        ) : null}
      </span>,
    );
  vis.forEach(function (c: Col, i: number) {
    const ci = i + (selectable ? 1 : 0);
    const isSorted = sort && sort.key === c.key;
    const canSort = c.sortable && canSortAny;
    const ariaSort: React.AriaAttributes['aria-sort'] =
      isSorted && canSort ? (sort!.dir === 'desc' ? 'descending' : 'ascending') : canSort ? 'none' : undefined;
    const pin = isPinned(c),
      edge = pin && i === nPinned - 1;
    head.push(
      <span
        key={c.key}
        role="columnheader"
        aria-sort={ariaSort}
        aria-colindex={ci + 1}
        style={cellStyle(c, i)}
        tabIndex={tabFor(0, ci)}
        data-rc={'0:' + ci}
        className={cx(
          'aura-table__th',
          c.align === 'end' && 'is-end',
          pin && 'is-pinned',
          edge && 'is-pin-edge',
          drag && drag.over === c.key && (drag.after ? 'is-drop-after' : 'is-drop-before'),
          drag && drag.key === c.key && 'is-dragging',
        )}
        draggable={reorderable && !busy ? true : undefined}
        onFocus={function (e: React.FocusEvent) {
          if (e.target === e.currentTarget) activeState[1]({ r: 0, c: ci });
        }}
        onDragStart={function (e: React.DragEvent) {
          if (resizing.current) {
            e.preventDefault();
            return;
          }
          e.dataTransfer.effectAllowed = 'move';
          try {
            e.dataTransfer.setData('text/plain', c.key);
          } catch (x) {}
          setDrag({ key: c.key });
        }}
        onDragOver={function (e: React.DragEvent<HTMLElement>) {
          if (!drag || drag.key === c.key || isPinned(byKey[drag.key]) !== pin) return;
          e.preventDefault();
          const b = e.currentTarget.getBoundingClientRect(),
            after = e.clientX > b.left + b.width / 2;
          if (drag.over !== c.key || drag.after !== after) setDrag({ key: drag.key, over: c.key, after: after });
        }}
        onDrop={function (e: React.DragEvent) {
          e.preventDefault();
          if (drag && drag.over) dropCol(drag.key, drag.over, drag.after);
          setDrag(null);
        }}
        onDragEnd={function () {
          setDrag(null);
        }}
      >
        <span className="aura-table__th-inner">
          {canSort ? (
            <button
              type="button"
              tabIndex={-1}
              className={cx('aura-table__sort', isSorted && 'is-active')}
              onClick={function () {
                sortBy(c.key);
                activeState[1]({ r: 0, c: ci });
              }}
            >
              {c.label}
              <Icon name={isSorted ? (sort!.dir === 'desc' ? 'arrow-down' : 'arrow-up') : 'arrow-up-down'} size={12} />
            </button>
          ) : (
            <span className={cx('aura-table__th-label', !c.label && 'aura-sr-only')}>
              {c.label || (c.actions ? t.actions : c.key)}
            </span>
          )}
          {pin ? <Icon name="pin" size={12} className="aura-table__pin-icon" label={t.pinned} /> : null}
          {controls ? (
            <button
              type="button"
              tabIndex={-1}
              className="aura-table__menu-btn"
              aria-label={t.columnOptions(c.label)}
              aria-haspopup="menu"
              aria-expanded={menu && menu.key === c.key ? true : undefined}
              onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
                e.stopPropagation();
                openMenu('col', c.key, e.currentTarget, { r: 0, c: ci });
              }}
            >
              <Icon name="ellipsis" />
            </button>
          ) : null}
        </span>
        {canResize(c) ? (
          <span
            className="aura-table__resize"
            role="separator"
            aria-orientation="vertical"
            aria-hidden={true}
            onPointerDown={function (e: React.PointerEvent<HTMLElement>) {
              startResize(c, e);
            }}
            onClick={function (e: React.MouseEvent) {
              e.stopPropagation();
            }}
            onDoubleClick={function () {
              setW(c, c.width as number, true);
            }}
          />
        ) : null}
      </span>,
    );
  });
  head.push(
    <span
      key="__gr"
      className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')}
      aria-hidden={true}
    />,
  );

  /* body */
  function cellContent(c: Col, r: Row): React.ReactNode {
    const v = r[c.key];
    return c.render ? (
      c.render(r)
    ) : c.pill ? (
      <StatusPill {...({ tone: c.tones && c.tones[v] } as StatusPillProps)}>{v}</StatusPill>
    ) : (
      v
    );
  }
  function rowCells(r: Row, i: number, k: RowKey, isSel: boolean): React.ReactElement[] {
    const ri = i + 1;
    const cells: React.ReactElement[] = [<span key="__gl" className="aura-table__gutter" aria-hidden={true} />];
    if (selectable)
      cells.push(
        <span
          key="__sel"
          role="gridcell"
          aria-colindex={1}
          className={cx('aura-table__sel', nPinned && 'is-pinned')}
          tabIndex={tabFor(ri, 0)}
          data-rc={ri + ':0'}
          aria-label={t.selectRow(k)}
          onFocus={function (e: React.FocusEvent) {
            if (e.target === e.currentTarget) activeState[1]({ r: ri, c: 0 });
          }}
        >
          <Checkbox
            checked={isSel}
            tabIndex={-1}
            label={t.selectRow(k)}
            onChange={function (on: boolean) {
              toggle(k, on);
            }}
          />
        </span>,
      );
    vis.forEach(function (c: Col, j: number) {
      const ci = j + (selectable ? 1 : 0),
        v = r[c.key],
        pin = isPinned(c);
      cells.push(
        <span
          key={c.key}
          role="gridcell"
          aria-colindex={ci + 1}
          tabIndex={tabFor(ri, ci)}
          data-rc={ri + ':' + ci}
          className={cx(
            'aura-table__td',
            c.mono && 'aura-table__mono',
            c.align === 'end' && 'is-end',
            pin && 'is-pinned',
            pin && j === nPinned - 1 && 'is-pin-edge',
          )}
          style={cellStyle(c, j)}
          onFocus={function () {
            if (activeState[0].r !== ri || activeState[0].c !== ci) activeState[1]({ r: ri, c: ci });
          }}
        >
          {j === 0 ? rowLinkWrap(r, cellContent(c, r)) : cellContent(c, r)}
        </span>,
      );
    });
    cells.push(
      <span
        key="__gr"
        className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')}
        aria-hidden={true}
      />,
    );
    return cells;
  }

  let body: React.ReactNode;
  const rowStyle = { minWidth: rowMinWidth };
  if (loading) {
    const n = pageSize || props.skeletonRows || 5;
    const skRows: React.ReactElement[] = (body = []);
    for (let i = 0; i < n; i++) {
      const sk: React.ReactElement[] = [<span key="__gl" className="aura-table__gutter" />];
      if (selectable)
        sk.push(
          <span key="__sel" className={cx('aura-table__sel', nPinned && 'is-pinned')}>
            <span className="aura-skel aura-skel--box" />
          </span>,
        );
      vis.forEach(function (c: Col, j: number) {
        sk.push(
          <span
            key={c.key}
            className={cx('aura-table__td', c.align === 'end' && 'is-end', isPinned(c) && 'is-pinned')}
            style={cellStyle(c, j)}
          >
            <span
              className={cx('aura-skel', c.pill && 'aura-skel--pill')}
              style={c.pill ? undefined : { width: SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length] }}
            />
          </span>,
        );
      });
      sk.push(
        <span key="__gr" className={cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker')} />,
      );
      skRows.push(
        <div key={'sk' + i} className="aura-table__row aura-table__row--skeleton" aria-hidden={true} style={rowStyle}>
          {sk}
        </div>,
      );
    }
  } else if (!rows.length) {
    const em: DataTableEmpty = props.empty || {};
    body = (
      <div className="aura-table__empty" role="row">
        <div role="gridcell">
          <span className="aura-table__empty-icon">
            <Icon name={em.icon || 'inbox'} size="lg" />
          </span>
          <p className="aura-table__empty-title">{em.title || t.empty}</p>
          {em.description ? <p className="aura-table__empty-text">{em.description}</p> : null}
          {em.action ? <div className="aura-table__empty-action">{em.action}</div> : null}
        </div>
      </div>
    );
  } else {
    const bodyRows: React.ReactElement[] = (body = []);
    if (virtual && start > 0)
      bodyRows.push(<div key="__top" style={{ height: start * ROW_H + 'px' }} aria-hidden={true} />);
    for (let ri = start; ri < end; ri++) {
      (function (r: Row, i: number) {
        const k = r[rowKey],
          isSel = !!selSet[k];
        bodyRows.push(
          <div
            key={k}
            role="row"
            aria-rowindex={first + i + 2}
            aria-selected={selectable ? isSel : undefined}
            className={cx(
              'aura-table__row',
              isSel && 'is-selected',
              (props.onRowActivate || rowHref) && 'is-actionable',
            )}
            style={rowStyle}
            onClick={function (e: React.MouseEvent<HTMLElement>) {
              const el = e.target as HTMLElement;
              if (el.closest && el.closest('.aura-check, button, a, input')) return;
              if (rowHref) followRow(e.currentTarget, e);
              else if (props.onRowActivate) props.onRowActivate(r);
            }}
          >
            {rowCells(r, i, k, isSel)}
          </div>,
        );
      })(pageRows[ri], ri);
    }
    if (virtual && end < pageRows.length)
      bodyRows.push(<div key="__bot" style={{ height: (pageRows.length - end) * ROW_H + 'px' }} aria-hidden={true} />);
  }

  /* footer */
  let foot: React.ReactElement | null = null;
  function pagerButton(dir: -1 | 1): React.ReactElement {
    const p = page + dir,
      off = busy || (dir < 0 ? page <= 1 : page >= pageCount),
      label = dir < 0 ? t.prevPage : t.nextPage,
      icon = dir < 0 ? 'chevron-left' : 'chevron-right';
    if (props.getPageHref && !off)
      return (
        <Link
          ref={dir < 0 ? prevLink : nextLink}
          href={props.getPageHref(p)}
          className="aura-icon-btn"
          aria-label={label}
          onClick={function (e: React.MouseEvent) {
            if (props.onPageChange) {
              e.preventDefault();
              pageState[1](p);
            }
          }}
        >
          <Icon name={icon} />
        </Link>
      );
    return (
      <IconButton
        icon={icon}
        label={label}
        disabled={off}
        onClick={function () {
          goPage(p);
        }}
      />
    );
  }
  if (pageSize && (rows.length || busy)) {
    const from = rows.length ? first + 1 : 0,
      to = manual ? first + rows.length : Math.min(first + pageSize, view.length);
    foot = (
      <div className="aura-table__foot">
        <span aria-live="polite">{busy ? t.loading : t.range(from, to, shownTotal)}</span>
        <span className="aura-table__pager">
          <span>{t.page(page, pageCount)}</span>
          {pagerButton(-1)}
          {pagerButton(1)}
        </span>
      </div>
    );
  } else if (height && rows.length && !loading) {
    foot = (
      <div className="aura-table__foot">
        <span>{t.rowCount(shownTotal)}</span>
        {selectable && selected.length ? <span>{t.selectedCount(selected.length)}</span> : <span />}
      </div>
    );
  }

  /* stacked: below `stackBelow` px the rows become cards (first column = title, a pill column sits beside it, the rest as label/value pairs) */
  if (stacked) {
    const titleCol = vis[0],
      pillCol = vis.filter(function (c: Col) {
        return c.pill && c !== titleCol;
      })[0];
    const actionCols = vis.filter(function (c: Col) {
      return c.actions && c !== titleCol;
    });
    const rest = vis.filter(function (c: Col) {
      return c !== titleCol && c !== pillCol && !c.actions;
    });
    let cardBody: React.ReactElement;
    if (loading) {
      cardBody = (
        <ul className="aura-table__cards" aria-busy={true}>
          {[0, 1, 2].map(function (i: number) {
            return (
              <li key={i} className="aura-table__card" aria-hidden={true}>
                <span className="aura-skel" style={{ width: '50%', height: '14px' }} />
                <span className="aura-skel" style={{ width: '80%' }} />
                <span className="aura-skel" style={{ width: '64%' }} />
              </li>
            );
          })}
        </ul>
      );
    } else if (!rows.length) {
      const em2: DataTableEmpty = props.empty || {};
      cardBody = (
        <div className="aura-table__empty">
          <div>
            <span className="aura-table__empty-icon">
              <Icon name={em2.icon || 'inbox'} size="lg" />
            </span>
            <p className="aura-table__empty-title">{em2.title || t.empty}</p>
            {em2.description ? <p className="aura-table__empty-text">{em2.description}</p> : null}
            {em2.action ? <div className="aura-table__empty-action">{em2.action}</div> : null}
          </div>
        </div>
      );
    } else {
      const cellVal = cellContent;
      cardBody = (
        <ul className="aura-table__cards" aria-label={props.label}>
          {pageRows.map(function (r: Row) {
            const k = r[rowKey],
              isSel = !!selSet[k];
            return (
              <li
                key={k}
                className={cx(
                  'aura-table__card',
                  isSel && 'is-selected',
                  (props.onRowActivate || rowHref) && 'is-actionable',
                )}
                tabIndex={props.onRowActivate && !rowHref ? 0 : undefined}
                onClick={function (e: React.MouseEvent<HTMLElement>) {
                  const el = e.target as HTMLElement;
                  if (el.closest && el.closest('.aura-check, button, a, input')) return;
                  if (rowHref) followRow(e.currentTarget, e);
                  else if (props.onRowActivate) props.onRowActivate(r);
                }}
                onKeyDown={function (e: React.KeyboardEvent) {
                  if (e.target === e.currentTarget && e.key === 'Enter' && props.onRowActivate && !rowHref)
                    props.onRowActivate(r);
                }}
              >
                <div className="aura-table__card-head">
                  {selectable ? (
                    <Checkbox
                      checked={isSel}
                      label={t.selectRow(k)}
                      onChange={function (on: boolean) {
                        toggle(k, on);
                      }}
                    />
                  ) : null}
                  <span className={cx('aura-table__card-title', titleCol.mono && 'aura-table__mono')}>
                    {rowLinkWrap(r, cellVal(titleCol, r))}
                  </span>
                  {pillCol ? cellVal(pillCol, r) : null}
                  {actionCols.map(function (c: Col) {
                    return (
                      <span key={c.key} className="aura-table__card-actions">
                        {cellVal(c, r)}
                      </span>
                    );
                  })}
                </div>
                {rest.length ? (
                  <dl className="aura-table__card-fields">
                    {rest.map(function (c: Col) {
                      return (
                        <div key={c.key}>
                          <dt>{c.label}</dt>
                          <dd className={c.mono ? 'aura-table__mono' : undefined}>{cellVal(c, r)}</dd>
                        </div>
                      );
                    })}
                  </dl>
                ) : null}
              </li>
            );
          })}
        </ul>
      );
    }
    return (
      <div
        ref={wrapMerged}
        data-density={props.density}
        className={cx('aura-table aura-table--stacked', refreshing && 'is-refreshing', props.className)}
        role="region"
        aria-label={props.label}
        aria-busy={busy || undefined}
      >
        {refreshing ? <span className="aura-table__busy-bar" aria-hidden={true} /> : null}
        {selectable && pageRows.length && !busy ? (
          <div className="aura-table__stack-bar">
            <Checkbox
              checked={all}
              indeterminate={nSel > 0 && !all}
              label={all ? t.deselectAllRows : t.selectAllRows}
              onChange={toggleAll}
            />
            <span>{nSel ? t.selectedCount(nSel) : t.selectAll}</span>
          </div>
        ) : null}
        {cardBody}
        {foot}
      </div>
    );
  }

  const scrollStyle: React.CSSProperties = {
    scrollPaddingLeft: 'calc(var(--aura-space-6)' + selW + ' + ' + acc + 'px)',
    scrollPaddingTop: ROW_H + 'px',
  };
  if (height) scrollStyle.height = height + 'px';

  return (
    <div
      ref={wrapMerged}
      data-density={props.density}
      className={cx('aura-table', scrolledX[0] && 'is-scrolled-x', refreshing && 'is-refreshing', props.className)}
    >
      {refreshing ? <span className="aura-table__busy-bar" aria-hidden={true} /> : null}
      <div
        ref={function (el: HTMLDivElement | null): void {
          scrollRef.current = el;
          gridRef.current = el;
        }}
        className="aura-table__scroll"
        style={scrollStyle}
        role="grid"
        aria-label={props.label}
        aria-busy={busy || undefined}
        aria-rowcount={loading ? -1 : shownTotal + 1}
        aria-colcount={nCols}
        aria-multiselectable={selectable || undefined}
        onKeyDown={onGridKey}
        onScroll={function (e: React.UIEvent<HTMLDivElement>) {
          const t = e.currentTarget;
          if (virtual && Math.abs(t.scrollTop - scrollTop) >= ROW_H / 2) setScrollTop(t.scrollTop);
          else if (virtual && (t.scrollTop === 0 || t.scrollTop + t.clientHeight >= t.scrollHeight - 1))
            setScrollTop(t.scrollTop);
          const sx = t.scrollLeft > 0;
          if (sx !== scrolledX[0]) scrolledX[1](sx);
        }}
      >
        <div className="aura-table__head" role="row" aria-rowindex={1} style={rowStyle}>
          {head}
        </div>
        {body}
      </div>
      {busy ? (
        <span className="aura-sr-only" role="status">
          {t.loadingRows}
        </span>
      ) : null}
      {controls ? (
        <div className="aura-table__picker">
          <IconButton
            icon="columns-3"
            label={t.showHideColumns}
            aria-haspopup="menu"
            onClick={function (e: React.MouseEvent<HTMLButtonElement>) {
              openMenu('picker', null, e.currentTarget);
            }}
          />
        </div>
      ) : null}
      {foot}
      {menu ? (
        <Menu
          anchor={menu.anchor}
          onClose={closeMenu}
          label={menu.kind === 'picker' ? t.columns : t.column(byKey[menu.key!] && byKey[menu.key!].label)}
          items={menu.kind === 'picker' ? pickerItems() : byKey[menu.key!] ? columnMenuItems(byKey[menu.key!]) : []}
        />
      ) : null}
    </div>
  );
});
