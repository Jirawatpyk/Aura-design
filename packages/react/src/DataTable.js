import * as React from 'react';
import { useStrings, useAuraLocale } from './locale.js';
import { cx, omit, useMaybeControlled, compare , useIsoLayoutEffect, useMergedRef } from './internal.js';
import { Icon } from './Icon.js';
import { IconButton } from './IconButton.js';
import { Checkbox } from './Checkbox.js';
import { Menu } from './Menu.js';
import { StatusPill, toneFor, TONE_ORDER } from './StatusPill.js';
const h = React.createElement;
var BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };

var DEFAULT_COLUMNS = [
  { key: 'id', label: 'ID', width: 96, mono: true },
  { key: 'name', label: 'NAME', width: 160 },
  { key: 'status', label: 'STATUS', width: 112, pill: true },
  { key: 'owner', label: 'OWNER' }
];

var SKELETON_WIDTHS = ['72%', '56%', '84%', '44%', '64%'];
var ROW_H = 48, OVERSCAN = 8, FLEX_MIN = 160;

export const DataTable = React.forwardRef(function DataTable(props, ref) {
  var t = useStrings();
  var columns = props.columns || DEFAULT_COLUMNS;
  var byKey = {};
  columns.forEach(function (c) { byKey[c.key] = c; });
  var rows = props.rows || [];
  var rowKey = props.rowKey || columns[0].key;
  var loading = !!props.loading;
  var selectable = !!props.selectable;
  var reorderable = props.reorderable !== false && !!props.columnControls;
  var controls = !!props.columnControls;

  var sortState = useMaybeControlled(props.sort, props.defaultSort || null, props.onSortChange);
  var sort = sortState[0], setSort = sortState[1];
  var selState = useMaybeControlled(props.selected, props.defaultSelected || [], props.onSelectionChange);
  var selected = selState[0], setSelected = selState[1];
  var pageState = useMaybeControlled(props.page, props.defaultPage || 1, props.onPageChange);
  var orderState = useMaybeControlled(props.columnOrder, columns.map(function (c) { return c.key; }), props.onColumnOrderChange);
  var hiddenState = useMaybeControlled(props.hiddenColumns, columns.filter(function (c) { return c.hidden; }).map(function (c) { return c.key; }), props.onHiddenColumnsChange);
  var pinState = useMaybeControlled(props.pinnedColumns, columns.filter(function (c) { return c.pinned; }).map(function (c) { return c.key; }), props.onPinnedColumnsChange);
  var widthState = React.useState({});
  var widths = widthState[0], setWidths = widthState[1];
  var activeState = React.useState({ r: 1, c: 0 });
  var scrollState = React.useState(0);
  var scrollTop = scrollState[0], setScrollTop = scrollState[1];
  var scrolledX = React.useState(false);
  var menuState = React.useState(null);
  var menu = menuState[0], setMenu = menuState[1];
  var dragState = React.useState(null);
  var drag = dragState[0], setDrag = dragState[1];
  var gridRef = React.useRef(null);
  var wrapRef = React.useRef(null), wrapMerged = useMergedRef(ref, wrapRef);
  /* The table's own width: drives stackBelow (cards) and per-column hideBelow. */
  var boxWidth = React.useState(null);
  var measure = !!props.stackBelow || columns.some(function (c) { return c.hideBelow != null; });
  React.useEffect(function () {
    if (!measure || !wrapRef.current || typeof ResizeObserver === 'undefined') return;
    var ro = new ResizeObserver(function (en) { boxWidth[1](en[0].contentRect.width); });
    ro.observe(wrapRef.current);
    return function () { ro.disconnect(); };
  }, [measure]);
  var stacked = !!props.stackBelow && boxWidth[0] != null && boxWidth[0] < props.stackBelow;
  function tooNarrow(c) {
    if (c.hideBelow == null || boxWidth[0] == null || stacked) return false;
    var px = typeof c.hideBelow === 'number' ? c.hideBelow : BP[c.hideBelow];
    return px != null && boxWidth[0] < px;
  }
  var scrollRef = React.useRef(null);
  var pending = React.useRef(null);
  var resizing = React.useRef(false);

  /* Buttons and links inside cells are reached with Enter (APG grid), not Tab: the grid stays one tab stop. */
  useIsoLayoutEffect(function () {
    if (stacked || !gridRef.current) return;
    var els = gridRef.current.querySelectorAll('.aura-table__td button, .aura-table__td a[href], .aura-table__td input, .aura-table__td select, .aura-table__td textarea, .aura-table__td [tabindex="0"]');
    for (var i = 0; i < els.length; i++) if (els[i].tabIndex !== -1) els[i].tabIndex = -1;
  });
  function widthOf(c) { return widths[c.key] != null ? widths[c.key] : c.width; }

  /* columns: order → hide → pinned first. Only sized columns can pin. */
  var order = orderState[0].filter(function (k) { return byKey[k]; });
  columns.forEach(function (c) { if (order.indexOf(c.key) < 0) order.push(c.key); });
  var hidden = hiddenState[0], pinnedKeys = pinState[0];
  var shown = order.filter(function (k) { return hidden.indexOf(k) < 0; }).map(function (k) { return byKey[k]; }).filter(function (c) { return !tooNarrow(c); });
  function isPinned(c) { return pinnedKeys.indexOf(c.key) >= 0 && c.width != null; }
  var vis = shown.filter(isPinned).concat(shown.filter(function (c) { return !isPinned(c); }));
  var nPinned = vis.filter(isPinned).length;
  var hasFlex = vis.some(function (c) { return widthOf(c) == null; });
  var fixedSum = 0;
  vis.forEach(function (c) { fixedSum += widthOf(c) != null ? widthOf(c) : FLEX_MIN; });
  var pinOffsets = {}, acc = 0;
  vis.forEach(function (c) { if (isPinned(c)) { pinOffsets[c.key] = acc; acc += widthOf(c); } });
  var selW = selectable ? ' + var(--aura-table-select-width)' : '';
  var gutterR = controls ? 'var(--aura-space-12)' : 'var(--aura-space-6)';
  var rowMinWidth = 'calc(' + fixedSum + 'px + var(--aura-space-6) + ' + gutterR + selW + ')';

  function cellStyle(c, i) {
    var w = widthOf(c), s;
    if (w == null) s = { flex: '1 1 0', minWidth: (c.minWidth || FLEX_MIN) + 'px' };
    else if (!hasFlex && i === vis.length - 1) s = { flex: '1 0 auto', width: w + 'px' };
    else s = { width: w + 'px', flex: 'none' };
    if (isPinned(c)) s.left = 'calc(var(--aura-space-6)' + selW + ' + ' + pinOffsets[c.key] + 'px)';
    return s;
  }

  /* sort (memoised: thousands of rows) */
  var view = React.useMemo(function () {
    if (!sort || !sort.key || !byKey[sort.key]) return rows;
    var col = byKey[sort.key];
    var val = col.sortValue || (col.pill
      ? function (r) { return TONE_ORDER[(col.tones && col.tones[r[col.key]]) || toneFor(r[col.key])]; }
      : function (r) { return r[col.key]; });
    var dir = sort.dir === 'desc' ? -1 : 1;
    return rows.map(function (r, i) { return [r, i]; })
      .sort(function (a, b) { return compare(val(a[0]), val(b[0])) * dir || a[1] - b[1]; })
      .map(function (p) { return p[0]; });
  }, [rows, sort && sort.key, sort && sort.dir]);
  function nextSort(key) {
    if (!sort || sort.key !== key) return { key: key, dir: 'asc' };
    if (sort.dir === 'asc') return { key: key, dir: 'desc' };
    return null;
  }

  /* page */
  var pageSize = props.pageSize || 0;
  var pageCount = pageSize ? Math.max(1, Math.ceil(view.length / pageSize)) : 1;
  var page = Math.min(Math.max(1, pageState[0] || 1), pageCount);
  var first = pageSize ? (page - 1) * pageSize : 0;
  var pageRows = pageSize ? view.slice(first, first + pageSize) : view;
  function goPage(p, focus) {
    var next = Math.min(Math.max(1, p), pageCount);
    if (next === page) return false;
    if (focus) pending.current = focus;
    pageState[1](next);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    return true;
  }

  /* virtual window */
  var height = props.height || 0;
  var virtual = !!height && !loading && pageRows.length > 0;
  var bodyH = Math.max(ROW_H, height - ROW_H);
  var start = 0, end = pageRows.length;
  if (virtual) {
    start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
    end = Math.min(pageRows.length, Math.ceil((scrollTop + bodyH) / ROW_H) + OVERSCAN);
  }
  var visibleRows = Math.max(1, Math.floor(bodyH / ROW_H));

  /* grid geometry: r 0 = header, 1..N = rows; c 0.. = [select?] + vis */
  var nCols = vis.length + (selectable ? 1 : 0);
  var nRows = loading ? 0 : pageRows.length;
  var active = activeState[0];
  var ar = Math.min(active.r, nRows), ac = Math.min(active.c, nCols - 1);
  var activeRendered = ar === 0 || (ar - 1 >= start && ar - 1 < end);
  function colAt(ci) { return selectable ? (ci === 0 ? null : vis[ci - 1]) : vis[ci]; }
  function tabFor(r, c) {
    if (!activeRendered) return r === 0 && c === ac ? 0 : -1;
    return r === ar && c === ac ? 0 : -1;
  }

  React.useEffect(function () {
    var p = pending.current;
    if (!p || !gridRef.current) return;
    var c = p.c;
    if (p.key) {
      var at = -1;
      vis.forEach(function (x, i) { if (x.key === p.key) at = i; });
      c = at >= 0 ? at + (selectable ? 1 : 0) : Math.min(p.c || 0, nCols - 1);
    }
    var el = gridRef.current.querySelector('[data-rc="' + p.r + ':' + c + '"]');
    if (el) { pending.current = null; el.focus(); }
  });
  function focusCell(r, c) {
    r = Math.max(0, Math.min(r, nRows)); c = Math.max(0, Math.min(c, nCols - 1));
    activeState[1]({ r: r, c: c });
    pending.current = { r: r, c: c };
    if (virtual && r > 0) {
      var sc = scrollRef.current, top = (r - 1) * ROW_H;
      if (top < sc.scrollTop) sc.scrollTop = top;
      else if (top + ROW_H > sc.scrollTop + bodyH) sc.scrollTop = top + ROW_H - bodyH;
      setScrollTop(sc.scrollTop);
    }
    var el = gridRef.current && gridRef.current.querySelector('[data-rc="' + r + ':' + c + '"]');
    if (el) { pending.current = null; el.focus(); }
  }

  /* select */
  var pageKeys = pageRows.map(function (r) { return r[rowKey]; });
  var selSet = {};
  selected.forEach(function (k) { selSet[k] = true; });
  var nSel = pageKeys.filter(function (k) { return selSet[k]; }).length;
  var all = nSel > 0 && nSel === pageKeys.length;
  function toggle(k, on) { setSelected(on ? selected.concat([k]) : selected.filter(function (x) { return x !== k; })); }
  function toggleAll() {
    setSelected(all ? selected.filter(function (k) { return pageKeys.indexOf(k) < 0; })
      : selected.concat(pageKeys.filter(function (k) { return !selSet[k]; })));
  }

  /* resize */
  function canResize(c) { return props.resizable && c.resizable !== false && c.width != null; }
  function clampW(c, w) { return Math.round(Math.min(c.maxWidth || 480, Math.max(c.minWidth || 64, w))); }
  function setW(c, w, done) {
    var nw = clampW(c, w);
    setWidths(function (prev) { var o = Object.assign({}, prev); o[c.key] = nw; return o; });
    if (done && props.onColumnResize) props.onColumnResize(c.key, nw);
  }
  function startResize(c, e) {
    e.preventDefault(); e.stopPropagation();
    resizing.current = true;
    var x0 = e.clientX, w0 = widthOf(c), last = w0;
    var el = e.currentTarget; el.classList.add('is-dragging');
    document.body.style.cursor = 'col-resize';
    function move(ev) { last = clampW(c, w0 + ev.clientX - x0); setW(c, last); }
    function up() {
      window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
      el.classList.remove('is-dragging'); document.body.style.cursor = '';
      setTimeout(function () { resizing.current = false; }, 0);
      if (props.onColumnResize) props.onColumnResize(c.key, last);
    }
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up);
  }

  /* reorder / pin / hide */
  function moveCol(key, delta) {
    var c = byKey[key], group = vis.filter(function (x) { return isPinned(x) === isPinned(c); });
    var gi = group.indexOf(c), target = group[gi + delta];
    if (!target) return false;
    var o = order.slice(), from = o.indexOf(key), to = o.indexOf(target.key);
    o.splice(from, 1); o.splice(to, 0, key);
    orderState[1](o);
    return true;
  }
  function dropCol(key, targetKey, after) {
    if (key === targetKey) return;
    var a = byKey[key], b = byKey[targetKey];
    if (isPinned(a) !== isPinned(b)) return;
    var o = order.slice();
    o.splice(o.indexOf(key), 1);
    var to = o.indexOf(targetKey) + (after ? 1 : 0);
    o.splice(to, 0, key);
    orderState[1](o);
  }
  function togglePin(key) {
    pinState[1](pinnedKeys.indexOf(key) >= 0 ? pinnedKeys.filter(function (k) { return k !== key; }) : pinnedKeys.concat([key]));
  }
  function setHidden(key, hide) {
    if (hide && shown.length <= 1) return;
    hiddenState[1](hide ? hidden.concat([key]) : hidden.filter(function (k) { return k !== key; }));
  }
  function resetColumns() {
    orderState[1](columns.map(function (c) { return c.key; }));
    hiddenState[1](columns.filter(function (c) { return c.hidden; }).map(function (c) { return c.key; }));
    pinState[1](columns.filter(function (c) { return c.pinned; }).map(function (c) { return c.key; }));
    setWidths({});
  }

  function columnMenuItems(c) {
    var group = vis.filter(function (x) { return isPinned(x) === isPinned(c); }), gi = group.indexOf(c);
    var items = [];
    if (c.sortable) items.push(
      { label: t.sortAsc, icon: 'arrow-up', onSelect: function () { setSort({ key: c.key, dir: 'asc' }); goPage(1); } },
      { label: t.sortDesc, icon: 'arrow-down', onSelect: function () { setSort({ key: c.key, dir: 'desc' }); goPage(1); } },
      { separator: true });
    if (c.width != null) items.push({ label: isPinned(c) ? t.unpin : t.pin, icon: isPinned(c) ? 'pin-off' : 'pin', onSelect: function () { togglePin(c.key); } });
    if (reorderable) items.push(
      { label: t.moveLeft, icon: 'arrow-left', disabled: gi <= 0, onSelect: function () { moveCol(c.key, -1); } },
      { label: t.moveRight, icon: 'arrow-right', disabled: gi >= group.length - 1, onSelect: function () { moveCol(c.key, 1); } });
    items.push({ separator: true }, { label: t.hideColumn, icon: 'eye-off', disabled: shown.length <= 1, onSelect: function () { setHidden(c.key, true); } });
    return items;
  }
  function pickerItems() {
    return order.map(function (k) {
      var c = byKey[k], on = hidden.indexOf(k) < 0;
      return { label: c.label || (c.actions ? t.actions : c.key), checked: on, keepOpen: true, disabled: on && shown.length <= 1, onSelect: function () { setHidden(k, on); } };
    }).concat([{ separator: true }, { label: t.resetColumns, icon: 'rotate-ccw', onSelect: resetColumns }]);
  }
  function openMenu(kind, key, anchor, rc) { setMenu({ kind: kind, key: key, anchor: anchor, rc: rc }); }
  function closeMenu(restore) {
    var m = menu; setMenu(null);
    if (restore && m) {
      if (m.kind === 'col') pending.current = { r: 0, key: m.key, c: m.rc ? m.rc.c : 0 };
      else if (m.anchor) m.anchor.focus();
    }
  }

  /* keyboard: the grid is one tab stop; arrows move a cell at a time */
  function onGridKey(e) {
    if (!gridRef.current || !gridRef.current.contains(e.target)) return;
    var rc = e.target.getAttribute && e.target.getAttribute('data-rc');
    if (!rc) {
      /* Escape from a control inside a cell (row-action button, link) goes back to the cell. */
      var cell = e.key === 'Escape' && e.target.closest && e.target.closest('[data-rc]');
      if (cell) { e.preventDefault(); cell.focus(); }
      return;
    }
    var p = rc.split(':'), r = +p[0], c = +p[1], k = e.key, col = colAt(c);
    var row = r > 0 ? pageRows[r - 1] : null;
    var handled = true;
    if (r === 0 && col && e.altKey && (k === 'ArrowLeft' || k === 'ArrowRight') && canResize(col)) setW(col, widthOf(col) + (k === 'ArrowLeft' ? -1 : 1) * (e.shiftKey ? 48 : 16), true);
    else if (r === 0 && col && e.ctrlKey && e.shiftKey && (k === 'ArrowLeft' || k === 'ArrowRight') && reorderable) {
      if (moveCol(col.key, k === 'ArrowLeft' ? -1 : 1)) pending.current = { r: 0, key: col.key, c: c };
    }
    else if (r === 0 && col && ((e.altKey && k === 'ArrowDown') || k === 'ContextMenu' || (e.shiftKey && k === 'F10')) && controls) openMenu('col', col.key, e.target, { r: 0, c: c });
    else if (k === 'ArrowRight') focusCell(r, c + 1);
    else if (k === 'ArrowLeft') focusCell(r, c - 1);
    else if (k === 'ArrowDown') {
      if (r < nRows) focusCell(r + 1, c); else if (pageSize && page < pageCount && goPage(page + 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c });
    }
    else if (k === 'ArrowUp') {
      if (r > 1 || (r === 1 && !(pageSize && page > 1))) focusCell(r - 1, c);
      else if (r === 1 && goPage(page - 1, { r: pageSize, c: c })) activeState[1]({ r: pageSize, c: c });
    }
    else if (k === 'Home') focusCell(e.ctrlKey ? 1 : r, 0);
    else if (k === 'End') focusCell(e.ctrlKey ? nRows : r, nCols - 1);
    else if (k === 'PageDown') { if (pageSize) { if (goPage(page + 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c }); } else focusCell(Math.min(nRows, r + visibleRows), c); }
    else if (k === 'PageUp') { if (pageSize) { if (goPage(page - 1, { r: 1, c: c })) activeState[1]({ r: 1, c: c }); } else focusCell(Math.max(1, r - visibleRows), c); }
    else if (k === ' ' || k === 'Enter') {
      if (r === 0 && !col && selectable && nRows) toggleAll();
      else if (r === 0 && col && col.sortable && nRows > 1) { setSort(nextSort(col.key)); goPage(1); }
      else if (r > 0 && k === ' ' && selectable) toggle(row[rowKey], !selSet[row[rowKey]]);
      else if (r > 0 && (k === 'Enter' || k === 'F2') && e.target.querySelector('button, a[href], input, select, textarea')) e.target.querySelector('button, a[href], input, select, textarea').focus();
      else if (r > 0 && k === 'Enter' && props.onRowActivate) props.onRowActivate(row);
      else handled = false;
    }
    else handled = false;
    if (handled) { e.preventDefault(); e.stopPropagation(); }
  }

  /* header */
  var head = [h('span', { key: '__gl', className: 'aura-table__gutter', 'aria-hidden': true })];
  if (selectable) head.push(h('span', {
    key: '__sel', role: 'columnheader', 'aria-colindex': 1, className: cx('aura-table__sel', nPinned && 'is-pinned'),
    tabIndex: tabFor(0, 0), 'data-rc': '0:0', 'aria-label': t.selectRows,
    onFocus: function () { activeState[1]({ r: 0, c: 0 }); }
  }, nRows ? h(Checkbox, { checked: all, indeterminate: nSel > 0 && !all, tabIndex: -1,
    label: all ? t.deselectAllRows : t.selectAllRows, onChange: toggleAll }) : null));
  vis.forEach(function (c, i) {
    var ci = i + (selectable ? 1 : 0);
    var isSorted = sort && sort.key === c.key;
    var canSort = c.sortable && rows.length > 1 && !loading;
    var ariaSort = isSorted && canSort ? (sort.dir === 'desc' ? 'descending' : 'ascending') : (canSort ? 'none' : undefined);
    var pin = isPinned(c), edge = pin && i === nPinned - 1;
    head.push(h('span', {
      key: c.key, role: 'columnheader', 'aria-sort': ariaSort, 'aria-colindex': ci + 1,
      style: cellStyle(c, i), tabIndex: tabFor(0, ci), 'data-rc': '0:' + ci,
      className: cx('aura-table__th', pin && 'is-pinned', edge && 'is-pin-edge',
        drag && drag.over === c.key && (drag.after ? 'is-drop-after' : 'is-drop-before'), drag && drag.key === c.key && 'is-dragging'),
      draggable: reorderable && !loading ? true : undefined,
      onFocus: function (e) { if (e.target === e.currentTarget) activeState[1]({ r: 0, c: ci }); },
      onDragStart: function (e) {
        if (resizing.current) { e.preventDefault(); return; }
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', c.key); } catch (x) {}
        setDrag({ key: c.key });
      },
      onDragOver: function (e) {
        if (!drag || drag.key === c.key || isPinned(byKey[drag.key]) !== pin) return;
        e.preventDefault();
        var b = e.currentTarget.getBoundingClientRect(), after = e.clientX > b.left + b.width / 2;
        if (drag.over !== c.key || drag.after !== after) setDrag({ key: drag.key, over: c.key, after: after });
      },
      onDrop: function (e) { e.preventDefault(); if (drag && drag.over) dropCol(drag.key, drag.over, drag.after); setDrag(null); },
      onDragEnd: function () { setDrag(null); }
    },
      h('span', { className: 'aura-table__th-inner' },
        canSort
          ? h('button', { type: 'button', tabIndex: -1, className: cx('aura-table__sort', isSorted && 'is-active'),
              onClick: function () { setSort(nextSort(c.key)); goPage(1); activeState[1]({ r: 0, c: ci }); } },
              c.label,
              h(Icon, { name: isSorted ? (sort.dir === 'desc' ? 'arrow-down' : 'arrow-up') : 'arrow-up-down', size: 12 }))
          : h('span', { className: cx('aura-table__th-label', !c.label && 'aura-sr-only') }, c.label || (c.actions ? t.actions : c.key)),
        pin ? h(Icon, { name: 'pin', size: 12, className: 'aura-table__pin-icon', label: t.pinned }) : null,
        controls ? h('button', { type: 'button', tabIndex: -1, className: 'aura-table__menu-btn', 'aria-label': t.columnOptions(c.label),
          'aria-haspopup': 'menu', 'aria-expanded': menu && menu.key === c.key ? true : undefined,
          onClick: function (e) { e.stopPropagation(); openMenu('col', c.key, e.currentTarget, { r: 0, c: ci }); } },
          h(Icon, { name: 'ellipsis' })) : null),
      canResize(c) ? h('span', {
        className: 'aura-table__resize', role: 'separator', 'aria-orientation': 'vertical', 'aria-hidden': true,
        onPointerDown: function (e) { startResize(c, e); },
        onClick: function (e) { e.stopPropagation(); },
        onDoubleClick: function () { setW(c, c.width, true); }
      }) : null));
  });
  head.push(h('span', { key: '__gr', className: cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker'), 'aria-hidden': true }));

  /* body */
  function rowCells(r, i, k, isSel) {
    var ri = i + 1;
    var cells = [h('span', { key: '__gl', className: 'aura-table__gutter', 'aria-hidden': true })];
    if (selectable) cells.push(h('span', {
      key: '__sel', role: 'gridcell', 'aria-colindex': 1, className: cx('aura-table__sel', nPinned && 'is-pinned'),
      tabIndex: tabFor(ri, 0), 'data-rc': ri + ':0', 'aria-label': t.selectRow(k),
      onFocus: function (e) { if (e.target === e.currentTarget) activeState[1]({ r: ri, c: 0 }); }
    }, h(Checkbox, { checked: isSel, tabIndex: -1, label: t.selectRow(k), onChange: function (on) { toggle(k, on); } })));
    vis.forEach(function (c, j) {
      var ci = j + (selectable ? 1 : 0), v = r[c.key], pin = isPinned(c);
      cells.push(h('span', {
        key: c.key, role: 'gridcell', 'aria-colindex': ci + 1, tabIndex: tabFor(ri, ci), 'data-rc': ri + ':' + ci,
        className: cx('aura-table__td', c.mono && 'aura-table__mono', pin && 'is-pinned', pin && j === nPinned - 1 && 'is-pin-edge'),
        style: cellStyle(c, j),
        onFocus: function () { if (activeState[0].r !== ri || activeState[0].c !== ci) activeState[1]({ r: ri, c: ci }); }
      }, c.render ? c.render(r) : c.pill ? h(StatusPill, { tone: c.tones && c.tones[v] }, v) : v));
    });
    cells.push(h('span', { key: '__gr', className: cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker'), 'aria-hidden': true }));
    return cells;
  }

  var body;
  var rowStyle = { minWidth: rowMinWidth };
  if (loading) {
    var n = pageSize || props.skeletonRows || 5;
    body = [];
    for (var i = 0; i < n; i++) {
      var sk = [h('span', { key: '__gl', className: 'aura-table__gutter' })];
      if (selectable) sk.push(h('span', { key: '__sel', className: cx('aura-table__sel', nPinned && 'is-pinned') }, h('span', { className: 'aura-skel aura-skel--box' })));
      vis.forEach(function (c, j) {
        sk.push(h('span', { key: c.key, className: cx('aura-table__td', isPinned(c) && 'is-pinned'), style: cellStyle(c, j) },
          h('span', { className: cx('aura-skel', c.pill && 'aura-skel--pill'), style: c.pill ? null : { width: SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length] } })));
      });
      sk.push(h('span', { key: '__gr', className: cx('aura-table__gutter aura-table__gutter--end', controls && 'has-picker') }));
      body.push(h('div', { key: 'sk' + i, className: 'aura-table__row aura-table__row--skeleton', 'aria-hidden': true, style: rowStyle }, sk));
    }
  } else if (!rows.length) {
    var em = props.empty || {};
    body = h('div', { className: 'aura-table__empty', role: 'row' },
      h('div', { role: 'gridcell' },
        h('span', { className: 'aura-table__empty-icon' }, h(Icon, { name: em.icon || 'inbox', size: 'lg' })),
        h('p', { className: 'aura-table__empty-title' }, em.title || t.empty),
        em.description ? h('p', { className: 'aura-table__empty-text' }, em.description) : null,
        em.action ? h('div', { className: 'aura-table__empty-action' }, em.action) : null));
  } else {
    body = [];
    if (virtual && start > 0) body.push(h('div', { key: '__top', style: { height: start * ROW_H + 'px' }, 'aria-hidden': true }));
    for (var ri = start; ri < end; ri++) {
      (function (r, i) {
        var k = r[rowKey], isSel = !!selSet[k];
        body.push(h('div', {
          key: k, role: 'row', 'aria-rowindex': first + i + 2, 'aria-selected': selectable ? isSel : undefined,
          className: cx('aura-table__row', isSel && 'is-selected', props.onRowActivate && 'is-actionable'), style: rowStyle,
          onClick: function (e) {
            if (e.target.closest && e.target.closest('.aura-check, button, a, input')) return;
            if (props.onRowActivate) props.onRowActivate(r);
          }
        }, rowCells(r, i, k, isSel)));
      })(pageRows[ri], ri);
    }
    if (virtual && end < pageRows.length) body.push(h('div', { key: '__bot', style: { height: (pageRows.length - end) * ROW_H + 'px' }, 'aria-hidden': true }));
  }

  /* footer */
  var foot = null;
  if (pageSize && (rows.length || loading)) {
    var from = rows.length ? first + 1 : 0, to = Math.min(first + pageSize, view.length);
    foot = h('div', { className: 'aura-table__foot' },
      h('span', { 'aria-live': 'polite' }, loading ? t.loading : t.range(from, to, view.length)),
      h('span', { className: 'aura-table__pager' },
        h('span', null, t.page(page, pageCount)),
        h(IconButton, { icon: 'chevron-left', label: t.prevPage, disabled: loading || page <= 1, onClick: function () { goPage(page - 1); } }),
        h(IconButton, { icon: 'chevron-right', label: t.nextPage, disabled: loading || page >= pageCount, onClick: function () { goPage(page + 1); } })));
  } else if (height && rows.length && !loading) {
    foot = h('div', { className: 'aura-table__foot' },
      h('span', null, t.rowCount(view.length)),
      selectable && selected.length ? h('span', null, t.selectedCount(selected.length)) : h('span', null));
  }

  /* stacked: below `stackBelow` px the rows become cards (first column = title, a pill column sits beside it, the rest as label/value pairs) */
  if (stacked) {
    var titleCol = vis[0], pillCol = vis.filter(function (c) { return c.pill && c !== titleCol; })[0];
    var actionCols = vis.filter(function (c) { return c.actions && c !== titleCol; });
    var rest = vis.filter(function (c) { return c !== titleCol && c !== pillCol && !c.actions; });
    var cardBody;
    if (loading) {
      cardBody = h('ul', { className: 'aura-table__cards', 'aria-busy': true }, [0, 1, 2].map(function (i) {
        return h('li', { key: i, className: 'aura-table__card', 'aria-hidden': true },
          h('span', { className: 'aura-skel', style: { width: '50%', height: '14px' } }),
          h('span', { className: 'aura-skel', style: { width: '80%' } }), h('span', { className: 'aura-skel', style: { width: '64%' } }));
      }));
    } else if (!rows.length) {
      var em2 = props.empty || {};
      cardBody = h('div', { className: 'aura-table__empty' }, h('div', null,
        h('span', { className: 'aura-table__empty-icon' }, h(Icon, { name: em2.icon || 'inbox', size: 'lg' })),
        h('p', { className: 'aura-table__empty-title' }, em2.title || t.empty),
        em2.description ? h('p', { className: 'aura-table__empty-text' }, em2.description) : null,
        em2.action ? h('div', { className: 'aura-table__empty-action' }, em2.action) : null));
    } else {
      var cellVal = function (c, r) { var v = r[c.key]; return c.render ? c.render(r) : c.pill ? h(StatusPill, { tone: c.tones && c.tones[v] }, v) : v; };
      cardBody = h('ul', { className: 'aura-table__cards', 'aria-label': props.label }, pageRows.map(function (r) {
        var k = r[rowKey], isSel = !!selSet[k];
        return h('li', { key: k, className: cx('aura-table__card', isSel && 'is-selected', props.onRowActivate && 'is-actionable'),
            tabIndex: props.onRowActivate ? 0 : undefined,
            onClick: function (e) { if (e.target.closest && e.target.closest('.aura-check, button, a, input')) return; if (props.onRowActivate) props.onRowActivate(r); },
            onKeyDown: function (e) { if (e.target === e.currentTarget && e.key === 'Enter' && props.onRowActivate) props.onRowActivate(r); } },
          h('div', { className: 'aura-table__card-head' },
            selectable ? h(Checkbox, { checked: isSel, label: t.selectRow(k), onChange: function (on) { toggle(k, on); } }) : null,
            h('span', { className: cx('aura-table__card-title', titleCol.mono && 'aura-table__mono') }, cellVal(titleCol, r)),
            pillCol ? cellVal(pillCol, r) : null,
            actionCols.map(function (c) { return h('span', { key: c.key, className: 'aura-table__card-actions' }, cellVal(c, r)); })),
          rest.length ? h('dl', { className: 'aura-table__card-fields' }, rest.map(function (c) {
            return h('div', { key: c.key }, h('dt', null, c.label), h('dd', { className: c.mono ? 'aura-table__mono' : undefined }, cellVal(c, r)));
          })) : null);
      }));
    }
    return h('div', { ref: wrapMerged, className: cx('aura-table aura-table--stacked', props.className), role: 'region', 'aria-label': props.label, 'aria-busy': loading || undefined },
      selectable && pageRows.length && !loading ? h('div', { className: 'aura-table__stack-bar' },
        h(Checkbox, { checked: all, indeterminate: nSel > 0 && !all, label: all ? t.deselectAllRows : t.selectAllRows, onChange: toggleAll }),
        h('span', null, nSel ? t.selectedCount(nSel) : t.selectAll)) : null,
      cardBody, foot);
  }

  var scrollStyle = { scrollPaddingLeft: 'calc(var(--aura-space-6)' + selW + ' + ' + acc + 'px)', scrollPaddingTop: ROW_H + 'px' };
  if (height) scrollStyle.height = height + 'px';

  return h('div', { ref: wrapMerged, className: cx('aura-table', scrolledX[0] && 'is-scrolled-x', props.className) },
    h('div', {
      ref: function (el) { scrollRef.current = el; gridRef.current = el; },
      className: 'aura-table__scroll', style: scrollStyle,
      role: 'grid', 'aria-label': props.label, 'aria-busy': loading || undefined,
      'aria-rowcount': loading ? -1 : view.length + 1, 'aria-colcount': nCols,
      'aria-multiselectable': selectable || undefined,
      onKeyDown: onGridKey,
      onScroll: function (e) {
        var t = e.currentTarget;
        if (virtual && Math.abs(t.scrollTop - scrollTop) >= ROW_H / 2) setScrollTop(t.scrollTop);
        else if (virtual && (t.scrollTop === 0 || t.scrollTop + t.clientHeight >= t.scrollHeight - 1)) setScrollTop(t.scrollTop);
        var sx = t.scrollLeft > 0;
        if (sx !== scrolledX[0]) scrolledX[1](sx);
      }
    },
      h('div', { className: 'aura-table__head', role: 'row', 'aria-rowindex': 1, style: rowStyle }, head),
      body),
    loading ? h('span', { className: 'aura-sr-only', role: 'status' }, t.loadingRows) : null,
    controls ? h('div', { className: 'aura-table__picker' },
      h(IconButton, { icon: 'columns-3', label: t.showHideColumns, 'aria-haspopup': 'menu',
        onClick: function (e) { openMenu('picker', null, e.currentTarget); } })) : null,
    foot,
    menu ? h(Menu, {
      anchor: menu.anchor, onClose: closeMenu,
      label: menu.kind === 'picker' ? t.columns : t.column(byKey[menu.key] && byKey[menu.key].label),
      items: menu.kind === 'picker' ? pickerItems() : (byKey[menu.key] ? columnMenuItems(byKey[menu.key]) : [])
    }) : null);
});
