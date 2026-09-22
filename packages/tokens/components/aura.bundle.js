/* @ds-bundle: {"format":4,"namespace":"Aura","components":[{"name":"Icon"},{"name":"Button"},{"name":"IconButton"},{"name":"Menu"},{"name":"DropdownMenu"},{"name":"Checkbox"},{"name":"StatusPill"},{"name":"TextField"},{"name":"Textarea"},{"name":"Select"},{"name":"RadioGroup"},{"name":"Switch"},{"name":"Combobox"},{"name":"DatePicker"},{"name":"DateRangePicker"},{"name":"Calendar"},{"name":"Alert"},{"name":"Toaster"},{"name":"Tooltip"},{"name":"Dialog"},{"name":"Drawer"},{"name":"DataTable"},{"name":"Card"},{"name":"Tabs"},{"name":"SideNav"},{"name":"Breadcrumb"},{"name":"Avatar"},{"name":"Stack"},{"name":"Grid"},{"name":"Container"},{"name":"AppShell"},{"name":"Surface"},{"name":"Stat"},{"name":"TimePicker"},{"name":"FileUpload"},{"name":"Badge"},{"name":"Tag"},{"name":"Progress"},{"name":"Skeleton"},{"name":"EmptyState"},{"name":"Pagination"},{"name":"Accordion"},{"name":"Popover"}]} */
window.Aura = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // g:react
  var require_react = __commonJS({
    "g:react"(exports, module) {
      module.exports = window.React;
    }
  });

  // g:react-dom
  var require_react_dom = __commonJS({
    "g:react-dom"(exports, module) {
      module.exports = window.ReactDOM;
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Accordion: () => Accordion,
    Alert: () => Alert,
    AppShell: () => AppShell,
    AuraProvider: () => AuraProvider,
    Avatar: () => Avatar,
    Badge: () => Badge,
    Breadcrumb: () => Breadcrumb,
    Button: () => Button,
    Calendar: () => Calendar,
    Card: () => Card,
    Checkbox: () => Checkbox,
    Combobox: () => Combobox,
    Container: () => Container,
    DataTable: () => DataTable,
    DatePicker: () => DatePicker,
    DateRangePicker: () => DateRangePicker,
    Dialog: () => Dialog,
    Drawer: () => Drawer,
    DropdownMenu: () => DropdownMenu,
    EmptyState: () => EmptyState,
    Field: () => Field,
    FileUpload: () => FileUpload,
    Grid: () => Grid,
    ICONS: () => ICONS,
    Icon: () => Icon,
    IconButton: () => IconButton,
    Menu: () => Menu,
    Pagination: () => Pagination,
    Popover: () => Popover,
    Progress: () => Progress,
    RadioGroup: () => RadioGroup,
    STRINGS: () => STRINGS,
    Select: () => Select,
    SideNav: () => SideNav,
    Skeleton: () => Skeleton,
    Stack: () => Stack,
    Stat: () => Stat,
    StatusPill: () => StatusPill,
    Surface: () => Surface,
    Switch: () => Switch,
    Tabs: () => Tabs,
    Tag: () => Tag,
    TextField: () => TextField,
    Textarea: () => Textarea,
    ThemeStyle: () => ThemeStyle,
    TimePicker: () => TimePicker,
    Toaster: () => Toaster,
    Tooltip: () => Tooltip,
    brandScale: () => scale,
    breakpoints: () => breakpoints,
    comboboxFilter: () => defaultFilter,
    contrast: () => contrast,
    createTheme: () => createTheme,
    formatBytes: () => formatBytes,
    formatDate: () => formatDate,
    iconNames: () => iconNames,
    parseDate: () => parseDate,
    parseTime: () => parseTime,
    statusTone: () => toneFor,
    toast: () => toast,
    useAuraLocale: () => useAuraLocale,
    useBreakpoint: () => useBreakpoint,
    useResponsive: () => useResponsive
  });

  // src/Icon.tsx
  var React2 = __toESM(require_react(), 1);

  // src/internal.tsx
  var React = __toESM(require_react(), 1);
  function cx() {
    return Array.prototype.filter.call(arguments, Boolean).join(" ");
  }
  function omit(src, keys) {
    var out = {};
    for (var k in src) if (Object.prototype.hasOwnProperty.call(src, k) && keys.indexOf(k) < 0) out[k] = src[k];
    return out;
  }
  function useMaybeControlled(value, initial, onChange) {
    var s = React.useState(initial);
    var controlled = value !== void 0;
    return [controlled ? value : s[0], function(next) {
      if (!controlled) s[1](next);
      if (onChange) onChange(next);
    }];
  }
  var collator = typeof Intl !== "undefined" ? new Intl.Collator(["th", "en"], { numeric: true, sensitivity: "base" }) : null;
  function compare(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
  }
  var uid = React.useId || function() {
    const r = React.useRef(null);
    if (!r.current) r.current = "aura-" + Math.random().toString(36).slice(2, 9);
    return r.current;
  };
  var FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  function noopSubscribe() {
    return function() {
    };
  }
  function yes() {
    return true;
  }
  function no() {
    return false;
  }
  function useMounted() {
    return React.useSyncExternalStore(noopSubscribe, yes, no);
  }
  var useIsoLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
  function trapTab(e, container) {
    if (e.key !== "Tab" || !container) return;
    var list = Array.prototype.filter.call(container.querySelectorAll(FOCUSABLE), function(el) {
      return el.tabIndex >= 0 && el.offsetParent !== null;
    });
    if (!list.length) return;
    var first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  function useMergedRef(a, b) {
    return React.useCallback(function(node) {
      [a, b].forEach(function(r) {
        if (!r) return;
        if (typeof r === "function") r(node);
        else r.current = node;
      });
    }, [a, b]);
  }

  // src/Icon.tsx
  var h = React2.createElement;
  var ICONS = { "check": [["path", { "d": "M20 6 9 17l-5-5" }]], "x": [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]], "plus": [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]], "minus": [["path", { "d": "M5 12h14" }]], "search": [["path", { "d": "m21 21-4.34-4.34" }], ["circle", { "cx": "11", "cy": "11", "r": "8" }]], "chevron-down": [["path", { "d": "m6 9 6 6 6-6" }]], "chevron-up": [["path", { "d": "m18 15-6-6-6 6" }]], "chevron-left": [["path", { "d": "m15 18-6-6 6-6" }]], "chevron-right": [["path", { "d": "m9 18 6-6-6-6" }]], "arrow-right": [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]], "arrow-up-right": [["path", { "d": "M7 7h10v10" }], ["path", { "d": "M7 17 17 7" }]], "arrow-up-down": [["path", { "d": "m21 16-4 4-4-4" }], ["path", { "d": "M17 20V4" }], ["path", { "d": "m3 8 4-4 4 4" }], ["path", { "d": "M7 4v16" }]], "loader-circle": [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]], "circle-alert": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }], ["line", { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }]], "circle-check": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "m16 9-5.5 5.5L8 12" }]], "info": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 16v-4" }], ["path", { "d": "M12 8h.01" }]], "triangle-alert": [["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { "d": "M12 9v4" }], ["path", { "d": "M12 17h.01" }]], "settings": [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]], "user": [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", { "cx": "12", "cy": "7", "r": "4" }]], "users": [["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }], ["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }], ["circle", { "cx": "9", "cy": "7", "r": "4" }]], "filter": [["path", { "d": "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" }]], "ellipsis": [["circle", { "cx": "12", "cy": "12", "r": "1" }], ["circle", { "cx": "19", "cy": "12", "r": "1" }], ["circle", { "cx": "5", "cy": "12", "r": "1" }]], "external-link": [["path", { "d": "M15 3h6v6" }], ["path", { "d": "M10 14 21 3" }], ["path", { "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]], "copy": [["rect", { "width": "14", "height": "14", "x": "8", "y": "8", "rx": "2", "ry": "2" }], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]], "trash-2": [["path", { "d": "M10 11v6" }], ["path", { "d": "M14 11v6" }], ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { "d": "M3 6h18" }], ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]], "pencil": [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]], "download": [["path", { "d": "M12 15V3" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }], ["path", { "d": "m7 10 5 5 5-5" }]], "upload": [["path", { "d": "M12 3v12" }], ["path", { "d": "m17 8-5-5-5 5" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]], "calendar": [["path", { "d": "M8 2v3" }], ["path", { "d": "M16 2v3" }], ["rect", { "x": "3", "y": "3", "width": "18", "height": "18", "rx": "2" }], ["path", { "d": "M3 9h18" }]], "bell": [["path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }], ["path", { "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" }]], "menu": [["path", { "d": "M4 5h16" }], ["path", { "d": "M4 12h16" }], ["path", { "d": "M4 19h16" }]], "eye": [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]], "log-out": [["path", { "d": "m16 17 5-5-5-5" }], ["path", { "d": "M21 12H9" }], ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]], "circle": [["circle", { "cx": "12", "cy": "12", "r": "10" }]], "circle-dot-dashed": [["path", { "d": "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }], ["path", { "d": "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }], ["path", { "d": "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }], ["path", { "d": "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }], ["path", { "d": "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }], ["path", { "d": "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }], ["path", { "d": "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }], ["path", { "d": "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }], ["circle", { "cx": "12", "cy": "12", "r": "1" }]], "ban": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M4.929 4.929 19.07 19.071" }]], "arrow-up": [["path", { "d": "m5 12 7-7 7 7" }], ["path", { "d": "M12 19V5" }]], "arrow-down": [["path", { "d": "M12 5v14" }], ["path", { "d": "m19 12-7 7-7-7" }]], "inbox": [["polyline", { "points": "22 12 16 12 14 15 10 15 8 12 2 12" }], ["path", { "d": "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }]], "pin": [["path", { "d": "M12 17v5" }], ["path", { "d": "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" }]], "pin-off": [["path", { "d": "M12 17v5" }], ["path", { "d": "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }], ["path", { "d": "m2 2 20 20" }], ["path", { "d": "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" }]], "eye-off": [["path", { "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }], ["path", { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }], ["path", { "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }], ["path", { "d": "m2 2 20 20" }]], "columns-3": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "M15 3v18" }]], "arrow-left": [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]], "rotate-ccw": [["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }], ["path", { "d": "M3 3v5h5" }]], "house": [["path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]], "layout-dashboard": [["rect", { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }], ["rect", { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }]], "folder": [["path", { "d": "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" }]], "chart-column": [["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }], ["path", { "d": "M18 17V9" }], ["path", { "d": "M13 17V5" }], ["path", { "d": "M8 17v-3" }]], "file-text": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }], ["path", { "d": "M10 9H8" }], ["path", { "d": "M16 13H8" }], ["path", { "d": "M16 17H8" }]], "mail": [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }]], "lock": [["rect", { "width": "18", "height": "11", "x": "3", "y": "11", "rx": "2", "ry": "2" }], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]], "clock": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 6v6l4 2" }]], "trending-up": [["path", { "d": "M16 7h6v6" }], ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]], "trending-down": [["path", { "d": "M16 17h6v-6" }], ["path", { "d": "m22 17-8.5-8.5-5 5L2 7" }]], "image": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2", "ry": "2" }], ["circle", { "cx": "9", "cy": "9", "r": "2" }], ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]], "paperclip": [["path", { "d": "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" }]], "cloud-upload": [["path", { "d": "M12 13v8" }], ["path", { "d": "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }], ["path", { "d": "m8 17 4-4 4 4" }]], "file": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }]] };
  var SIZES = { sm: 16, md: 20, lg: 24 };
  var Icon = React2.forwardRef(function Icon2(props, ref) {
    var shapes = ICONS[props.name];
    if (!shapes) return null;
    var size = SIZES[props.size] || props.size || 16;
    var a11y = props.label ? { role: "img", "aria-label": props.label } : { "aria-hidden": true, focusable: "false" };
    return h("svg", Object.assign({
      ref,
      xmlns: "http://www.w3.org/2000/svg",
      width: size,
      height: size,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: props.strokeWidth || 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      className: cx("aura-icon", props.className)
    }, a11y), shapes.map(function(s, i) {
      var attrs = { key: i };
      for (var k in s[1]) attrs[k === "stroke-width" ? "strokeWidth" : k] = s[1][k];
      return h(s[0], attrs);
    }));
  });
  var iconNames = Object.keys(ICONS);

  // src/Button.tsx
  var React3 = __toESM(require_react(), 1);
  var h2 = React3.createElement;
  var Button = React3.forwardRef(function Button2(props, ref) {
    var variant = props.variant || "primary";
    var loading = !!props.loading;
    var rest = omit(props, ["variant", "className", "children", "type", "icon", "iconRight", "loading", "onClick"]);
    return h2(
      "button",
      Object.assign({}, rest, {
        ref,
        type: props.type || "button",
        className: cx("aura-btn", "aura-btn--" + variant, loading && "is-loading", props.className),
        "aria-busy": loading || void 0,
        "aria-disabled": loading || void 0,
        onClick: loading ? function(e) {
          e.preventDefault();
        } : props.onClick
      }),
      loading ? h2(Icon, { name: "loader-circle", className: "aura-spin" }) : props.icon ? h2(Icon, { name: props.icon }) : null,
      props.children,
      props.iconRight && !loading ? h2(Icon, { name: props.iconRight }) : null
    );
  });

  // src/IconButton.tsx
  var React4 = __toESM(require_react(), 1);
  var h3 = React4.createElement;
  var IconButton = React4.forwardRef(function IconButton2(props, ref) {
    var rest = omit(props, ["icon", "label", "className", "size"]);
    return h3("button", Object.assign({}, rest, {
      ref,
      type: props.type || "button",
      "aria-label": props.label,
      title: props.label,
      className: cx("aura-icon-btn", props.className)
    }), h3(Icon, { name: props.icon, size: props.size || "sm" }));
  });

  // src/Menu.tsx
  var React5 = __toESM(require_react(), 1);
  var import_react_dom = __toESM(require_react_dom(), 1);
  var h4 = React5.createElement;
  var Menu = React5.forwardRef(function Menu2(props, ref) {
    var own = React5.useRef(null), merged = useMergedRef(ref, own);
    var posState = React5.useState(null);
    var pos = posState[0], setPos = posState[1];
    var items = props.items || [];
    var mounted = useMounted();
    useIsoLayoutEffect(function() {
      var a = props.anchor, m = own.current;
      if (!a || !m) return;
      var r = a.getBoundingClientRect(), mh = m.offsetHeight, mw = m.offsetWidth;
      var top = r.bottom + 4;
      if (top + mh > window.innerHeight - 8 && r.top - mh - 4 > 8) top = r.top - mh - 4;
      var left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
      setPos({ top, left });
    }, [props.anchor, mounted]);
    React5.useEffect(function() {
      if (!mounted) return;
      var first = own.current && own.current.querySelector('[role^="menuitem"]:not([disabled])');
      if (first && props.autoFocus !== false) first.focus();
      function outside(e) {
        if (own.current && !own.current.contains(e.target) && !(props.anchor && props.anchor.contains(e.target))) props.onClose(false);
      }
      function onScroll(e) {
        if (own.current && !own.current.contains(e.target)) props.onClose(false);
      }
      document.addEventListener("pointerdown", outside, true);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return function() {
        document.removeEventListener("pointerdown", outside, true);
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }, [mounted]);
    function onKeyDown(e) {
      var list = Array.prototype.slice.call(own.current.querySelectorAll('[role^="menuitem"]:not([disabled])'));
      var i = list.indexOf(document.activeElement);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        list[(i + 1) % list.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        list[(i - 1 + list.length) % list.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        list[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        list[list.length - 1].focus();
      } else if (e.key === "Escape") {
        e.preventDefault();
        props.onClose(true);
      } else if (e.key === "Tab") {
        props.onClose(true);
      }
      e.stopPropagation();
    }
    var el = h4("div", {
      ref: merged,
      role: "menu",
      "aria-label": props.label,
      className: "aura-menu",
      onKeyDown,
      style: { top: pos ? pos.top : -9999, left: pos ? pos.left : -9999 }
    }, items.map(function(it, i) {
      if (it.separator) return h4("div", { key: "s" + i, role: "separator", className: "aura-menu__sep" });
      var isCheck = it.checked !== void 0;
      return h4(
        "button",
        {
          key: i,
          type: "button",
          tabIndex: -1,
          disabled: it.disabled,
          role: isCheck ? "menuitemcheckbox" : "menuitem",
          "aria-checked": isCheck ? !!it.checked : void 0,
          className: "aura-menu__item",
          onClick: function() {
            it.onSelect();
            if (!it.keepOpen) props.onClose(true);
          }
        },
        isCheck ? h4("span", { className: cx("aura-menu__check", it.checked && "is-on") }, it.checked ? h4(Icon, { name: "check", size: 12, strokeWidth: 3 }) : null) : it.icon ? h4(Icon, { name: it.icon }) : h4("span", { className: "aura-menu__blank" }),
        h4("span", { className: "aura-menu__label" }, it.label),
        it.hint ? h4("span", { className: "aura-menu__hint" }, it.hint) : null
      );
    }));
    return mounted ? (0, import_react_dom.createPortal)(el, document.body) : null;
  });

  // src/DropdownMenu.tsx
  var React6 = __toESM(require_react(), 1);
  var h5 = React6.createElement;
  var DropdownMenu = React6.forwardRef(function DropdownMenu2(props, ref) {
    var st = React6.useState(null), anchor = st[0], setAnchor = st[1];
    var wrap = React6.useRef(null), wrapMerged = useMergedRef(ref, wrap);
    var child = React6.Children.only(props.trigger);
    function toggle(e) {
      if (child.props.onClick) child.props.onClick(e);
      var el = wrap.current && (wrap.current.querySelector('button, [role="button"], a') || wrap.current);
      setAnchor(anchor ? null : el);
    }
    function onKeyDown(e) {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !anchor) {
        e.preventDefault();
        setAnchor(wrap.current.querySelector('button, [role="button"], a') || wrap.current);
      }
    }
    return h5(
      "span",
      { ref: wrapMerged, className: "aura-dropdown", onKeyDown },
      React6.cloneElement(child, { onClick: toggle, "aria-haspopup": "menu", "aria-expanded": anchor ? true : false }),
      anchor ? h5(Menu, {
        anchor,
        label: props.label,
        items: props.items,
        onClose: function(restore) {
          setAnchor(null);
          if (restore && typeof anchor.focus === "function") anchor.focus();
        }
      }) : null
    );
  });

  // src/Checkbox.tsx
  var React7 = __toESM(require_react(), 1);
  var h6 = React7.createElement;
  var Checkbox = React7.forwardRef(function Checkbox2(props, ref) {
    var own = React7.useRef(null), merged = useMergedRef(ref, own);
    var st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
    var on = !!st[0];
    React7.useEffect(function() {
      if (own.current) own.current.indeterminate = !!props.indeterminate;
    });
    var rest = omit(props, ["checked", "defaultChecked", "onChange", "indeterminate", "label", "children", "description", "className", "tabIndex", "disabled"]);
    var labelled = props.children != null;
    var descId = props.description && props.id ? props.id + "-desc" : void 0;
    return h6(
      "label",
      { className: cx("aura-check", labelled && "aura-check--labelled", props.disabled && "is-disabled", props.className), onClick: function(e) {
        e.stopPropagation();
      } },
      h6("input", Object.assign({}, rest, {
        ref: merged,
        type: "checkbox",
        className: "aura-check__input",
        checked: on,
        tabIndex: props.tabIndex,
        disabled: props.disabled,
        "aria-describedby": descId,
        "aria-label": labelled ? void 0 : props.label,
        onChange: function(e) {
          st[1](e.target.checked);
        }
      })),
      h6(
        "span",
        { className: "aura-check__box", "aria-hidden": true },
        props.indeterminate ? h6(Icon, { name: "minus", size: 12, strokeWidth: 3 }) : on ? h6(Icon, { name: "check", size: 12, strokeWidth: 3 }) : null
      ),
      labelled ? h6(
        "span",
        { className: "aura-check__text" },
        h6("span", { className: "aura-check__label" }, props.children),
        props.description ? h6("span", { className: "aura-check__desc", id: descId }, props.description) : null
      ) : null
    );
  });

  // src/StatusPill.tsx
  var React8 = __toESM(require_react(), 1);
  var h7 = React8.createElement;
  var TONE_ICON = { neutral: "circle", progress: "circle-dot-dashed", ready: "circle-check", blocked: "ban" };
  var TONE_WORDS = {
    ready: ["ready", "done", "complete", "completed", "approved", "live", "passed"],
    progress: ["in progress", "in review", "review", "syncing", "running", "pending"],
    blocked: ["blocked", "failed", "error", "rejected", "on hold", "cancelled"]
  };
  function toneFor(status) {
    var s = String(status == null ? "" : status).trim().toLowerCase();
    for (var t in TONE_WORDS) if (TONE_WORDS[t].indexOf(s) >= 0) return t;
    return "neutral";
  }
  var TONE_ORDER = { neutral: 0, progress: 1, ready: 2, blocked: 3 };
  var StatusPill = React8.forwardRef(function StatusPill2(props, ref) {
    var tone2 = props.tone || toneFor(props.children);
    return h7(
      "span",
      { ref, className: cx("aura-pill", "aura-pill--" + tone2, props.className) },
      h7(Icon, { name: TONE_ICON[tone2] || "circle", size: 12 }),
      props.children
    );
  });

  // src/forms.tsx
  var React10 = __toESM(require_react(), 1);

  // src/locale.tsx
  var React9 = __toESM(require_react(), 1);
  var h8 = React9.createElement;
  var n = function(x) {
    return Number(x).toLocaleString("en");
  };
  var STRINGS = {
    en: {
      close: "Close",
      dismiss: "Dismiss",
      dismissToast: "Dismiss notification",
      notifications: "Notifications",
      mainNav: "Main",
      breadcrumb: "Breadcrumb",
      navigation: "Navigation",
      openNav: "Open navigation",
      searching: "Searching\u2026",
      noMatches: "No matches",
      clear: function(what) {
        return "Clear " + (what || "selection");
      },
      keepTyping: function(total) {
        return "Keep typing to narrow " + n(total) + " options";
      },
      sortAsc: "Sort ascending",
      sortDesc: "Sort descending",
      pin: "Pin to left",
      unpin: "Unpin column",
      moveLeft: "Move left",
      moveRight: "Move right",
      hideColumn: "Hide column",
      resetColumns: "Reset columns",
      selectRows: "Select rows",
      selectAllRows: "Select all rows",
      deselectAllRows: "Deselect all rows",
      selectAll: "Select all",
      selectRow: function(k) {
        return "Select " + k;
      },
      selectedCount: function(c) {
        return n(c) + " selected";
      },
      pinned: "Pinned",
      columnOptions: function(label) {
        return label + " column options";
      },
      column: function(label) {
        return label ? label + " column" : "Column";
      },
      columns: "Columns",
      showHideColumns: "Show or hide columns",
      empty: "Nothing here yet",
      loading: "Loading\u2026",
      loadingRows: "Loading rows",
      range: function(a, b, total) {
        return a + "\u2013" + b + " of " + n(total);
      },
      page: function(p, total) {
        return "Page " + p + " of " + total;
      },
      prevPage: "Previous page",
      nextPage: "Next page",
      rowCount: function(c) {
        return n(c) + " rows";
      },
      actions: "Actions",
      optional: "optional",
      timePlaceholder: "hh:mm",
      timeInvalid: "Type a time like 09:30",
      timeOutOfRange: function(a, b) {
        return "Choose a time between " + a + " and " + b;
      },
      dropFiles: "Drag files here or",
      browse: "Choose files",
      browseOne: "Choose a file",
      remove: function(n2) {
        return "Remove " + n2;
      },
      fileTooBig: function(max) {
        return "Larger than " + max;
      },
      fileWrongType: "This file type isn\u2019t accepted",
      tooManyFiles: function(n2) {
        return "Up to " + n2 + " files";
      },
      uploading: "Uploading\u2026",
      images: "Images",
      pagination: "Pagination",
      pageN: function(p) {
        return "Page " + p;
      },
      accepts: function(list, max) {
        return [list, max && "up to " + max + " each"].filter(Boolean).join(", ");
      }
    },
    th: {
      close: "\u0E1B\u0E34\u0E14",
      dismiss: "\u0E1B\u0E34\u0E14",
      dismissToast: "\u0E1B\u0E34\u0E14\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19",
      notifications: "\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19",
      mainNav: "\u0E40\u0E21\u0E19\u0E39\u0E2B\u0E25\u0E31\u0E01",
      breadcrumb: "\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07",
      navigation: "\u0E40\u0E21\u0E19\u0E39",
      openNav: "\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E21\u0E19\u0E39",
      searching: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E04\u0E49\u0E19\u0E2B\u0E32\u2026",
      noMatches: "\u0E44\u0E21\u0E48\u0E1E\u0E1A\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23\u0E17\u0E35\u0E48\u0E15\u0E23\u0E07\u0E01\u0E31\u0E19",
      clear: function(what) {
        return "\u0E25\u0E49\u0E32\u0E07" + (what || "\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01");
      },
      keepTyping: function(total) {
        return "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E2D\u0E07\u0E08\u0E32\u0E01 " + n(total) + " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23";
      },
      sortAsc: "\u0E40\u0E23\u0E35\u0E22\u0E07\u0E08\u0E32\u0E01\u0E19\u0E49\u0E2D\u0E22\u0E44\u0E1B\u0E21\u0E32\u0E01",
      sortDesc: "\u0E40\u0E23\u0E35\u0E22\u0E07\u0E08\u0E32\u0E01\u0E21\u0E32\u0E01\u0E44\u0E1B\u0E19\u0E49\u0E2D\u0E22",
      pin: "\u0E15\u0E23\u0E36\u0E07\u0E44\u0E27\u0E49\u0E0B\u0E49\u0E32\u0E22",
      unpin: "\u0E40\u0E25\u0E34\u0E01\u0E15\u0E23\u0E36\u0E07\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C",
      moveLeft: "\u0E22\u0E49\u0E32\u0E22\u0E44\u0E1B\u0E0B\u0E49\u0E32\u0E22",
      moveRight: "\u0E22\u0E49\u0E32\u0E22\u0E44\u0E1B\u0E02\u0E27\u0E32",
      hideColumn: "\u0E0B\u0E48\u0E2D\u0E19\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C",
      resetColumns: "\u0E04\u0E37\u0E19\u0E04\u0E48\u0E32\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C",
      selectRows: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E41\u0E16\u0E27",
      selectAllRows: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E17\u0E38\u0E01\u0E41\u0E16\u0E27",
      deselectAllRows: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01\u0E01\u0E32\u0E23\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E17\u0E38\u0E01\u0E41\u0E16\u0E27",
      selectAll: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",
      selectRow: function(k) {
        return "\u0E40\u0E25\u0E37\u0E2D\u0E01 " + k;
      },
      selectedCount: function(c) {
        return "\u0E40\u0E25\u0E37\u0E2D\u0E01 " + n(c) + " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23";
      },
      pinned: "\u0E15\u0E23\u0E36\u0E07\u0E2D\u0E22\u0E39\u0E48",
      columnOptions: function(label) {
        return "\u0E15\u0E31\u0E27\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C " + label;
      },
      column: function(label) {
        return label ? "\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C " + label : "\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C";
      },
      columns: "\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C",
      showHideColumns: "\u0E41\u0E2A\u0E14\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E0B\u0E48\u0E2D\u0E19\u0E04\u0E2D\u0E25\u0E31\u0E21\u0E19\u0E4C",
      empty: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
      loading: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u2026",
      loadingRows: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25",
      range: function(a, b, total) {
        return a + "\u2013" + b + " \u0E08\u0E32\u0E01 " + n(total);
      },
      page: function(p, total) {
        return "\u0E2B\u0E19\u0E49\u0E32 " + p + " / " + total;
      },
      prevPage: "\u0E2B\u0E19\u0E49\u0E32\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32",
      nextPage: "\u0E2B\u0E19\u0E49\u0E32\u0E16\u0E31\u0E14\u0E44\u0E1B",
      rowCount: function(c) {
        return n(c) + " \u0E41\u0E16\u0E27";
      },
      actions: "\u0E01\u0E32\u0E23\u0E08\u0E31\u0E14\u0E01\u0E32\u0E23",
      optional: "\u0E44\u0E21\u0E48\u0E1A\u0E31\u0E07\u0E04\u0E31\u0E1A",
      timePlaceholder: "\u0E0A\u0E0A:\u0E19\u0E19",
      timeInvalid: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E40\u0E27\u0E25\u0E32\u0E41\u0E1A\u0E1A 09:30",
      timeOutOfRange: function(a, b) {
        return "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E27\u0E25\u0E32\u0E23\u0E30\u0E2B\u0E27\u0E48\u0E32\u0E07 " + a + "\u2013" + b + " \u0E19.";
      },
      dropFiles: "\u0E25\u0E32\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E21\u0E32\u0E27\u0E32\u0E07 \u0E2B\u0E23\u0E37\u0E2D",
      browse: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C",
      browseOne: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C",
      remove: function(n2) {
        return "\u0E25\u0E1A " + n2;
      },
      fileTooBig: function(max) {
        return "\u0E44\u0E1F\u0E25\u0E4C\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E01\u0E34\u0E19 " + max;
      },
      fileWrongType: "\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E44\u0E1F\u0E25\u0E4C\u0E0A\u0E19\u0E34\u0E14\u0E19\u0E35\u0E49",
      tooManyFiles: function(n2) {
        return "\u0E41\u0E19\u0E1A\u0E44\u0E14\u0E49\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n2 + " \u0E44\u0E1F\u0E25\u0E4C";
      },
      uploading: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u2026",
      images: "\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E",
      pagination: "\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32",
      pageN: function(p) {
        return "\u0E2B\u0E19\u0E49\u0E32 " + p;
      },
      accepts: function(list, max) {
        return [list, max && "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + max + " \u0E15\u0E48\u0E2D\u0E44\u0E1F\u0E25\u0E4C"].filter(Boolean).join(" \xB7 ");
      }
    }
  };
  var LocaleContext = React9.createContext(null);
  function AuraProvider(props) {
    var value = React9.useMemo(function() {
      var base = props.locale && STRINGS[props.locale] || STRINGS.en;
      return { locale: props.locale || "en", calendar: props.calendar || null, strings: props.strings ? Object.assign({}, base, props.strings) : base };
    }, [props.locale, props.calendar, props.strings]);
    return h8(LocaleContext.Provider, { value }, props.children);
  }
  function useAuraLocale() {
    return React9.useContext(LocaleContext) || { locale: null, calendar: null, strings: STRINGS.en };
  }
  function useStrings() {
    return useAuraLocale().strings;
  }

  // src/forms.tsx
  var h9 = React10.createElement;
  var Field = React10.forwardRef(function Field2(props, ref) {
    var t = useStrings();
    return h9(
      "div",
      { ref, className: cx("aura-field", props.error && "is-invalid", props.disabled && "is-disabled", props.className) },
      props.label ? h9(
        props.labelAs || "label",
        { className: "aura-field__label", htmlFor: props.labelAs ? void 0 : props.id, id: props.labelId },
        props.label,
        props.required ? h9("span", { className: "aura-field__req", "aria-hidden": true }, " *") : null,
        props.optional ? h9("span", { className: "aura-field__opt" }, " (" + t.optional + ")") : null
      ) : null,
      props.children,
      props.error ? h9("p", { className: "aura-field__error", id: props.id + "-error" }, h9(Icon, { name: "circle-alert", size: 14 }), props.error) : props.hint ? h9("p", { className: "aura-field__hint", id: props.id + "-hint" }, props.hint) : null
    );
  });
  function describedBy(id, p) {
    return p.error ? id + "-error" : p.hint ? id + "-hint" : void 0;
  }
  var FIELD_KEYS = ["label", "hint", "error", "required", "optional", "icon", "className", "id", "suffix", "options", "placeholder"];
  var TextField = React10.forwardRef(function TextField2(props, ref) {
    var auto = uid(), id = props.id || auto;
    var rest = omit(props, FIELD_KEYS);
    return h9(
      Field,
      { id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h9(
        "div",
        { className: cx("aura-input", props.icon && "has-icon", props.suffix && "has-suffix") },
        props.icon ? h9(Icon, { name: props.icon, className: "aura-input__icon" }) : null,
        h9("input", Object.assign({ type: "text" }, rest, {
          ref,
          id,
          className: "aura-input__control",
          placeholder: props.placeholder,
          required: props.required,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": describedBy(id, props)
        })),
        props.suffix ? h9("span", { className: "aura-input__suffix" }, props.suffix) : null
      )
    );
  });
  var Textarea = React10.forwardRef(function Textarea2(props, ref) {
    var auto = uid(), id = props.id || auto;
    var rest = omit(props, FIELD_KEYS);
    return h9(
      Field,
      { id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h9("textarea", Object.assign({ rows: 4 }, rest, {
        ref,
        id,
        className: "aura-input aura-textarea",
        placeholder: props.placeholder,
        required: props.required,
        "aria-invalid": props.error ? true : void 0,
        "aria-describedby": describedBy(id, props)
      }))
    );
  });
  var Select = React10.forwardRef(function Select2(props, ref) {
    var auto = uid(), id = props.id || auto;
    var rest = omit(props, FIELD_KEYS.concat(["children"]));
    var opts = (props.options || []).map(function(o) {
      var v = typeof o === "object" ? o : { value: o, label: o };
      return h9("option", { key: v.value, value: v.value, disabled: v.disabled }, v.label);
    });
    if (props.placeholder) opts.unshift(h9("option", { key: "__ph", value: "", disabled: true }, props.placeholder));
    var extra = props.value === void 0 && props.defaultValue === void 0 && props.placeholder ? { defaultValue: "" } : {};
    return h9(
      Field,
      { id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h9(
        "div",
        { className: cx("aura-input aura-select", props.icon && "has-icon") },
        props.icon ? h9(Icon, { name: props.icon, className: "aura-input__icon" }) : null,
        h9("select", Object.assign(extra, rest, {
          ref,
          id,
          className: "aura-input__control",
          required: props.required,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": describedBy(id, props)
        }), opts, props.children),
        h9(Icon, { name: "chevron-down", className: "aura-select__chevron" })
      )
    );
  });
  var RadioGroup = React10.forwardRef(function RadioGroup2(props, ref) {
    var auto = uid(), id = props.id || auto;
    var st = useMaybeControlled(props.value, props.defaultValue, props.onChange);
    var name = props.name || id;
    return h9(
      "fieldset",
      {
        ref,
        className: cx("aura-field aura-radio-group", props.error && "is-invalid", props.className),
        "aria-describedby": describedBy(id, props),
        "aria-invalid": props.error ? true : void 0,
        disabled: props.disabled
      },
      props.label ? h9("legend", { className: "aura-field__label" }, props.label, props.required ? h9("span", { className: "aura-field__req", "aria-hidden": true }, " *") : null) : null,
      h9(
        "div",
        { className: cx("aura-radio-group__list", props.orientation === "horizontal" && "is-horizontal") },
        (props.options || []).map(function(o) {
          var v = typeof o === "object" ? o : { value: o, label: o };
          return h9(
            "label",
            { key: v.value, className: cx("aura-choice", v.disabled && "is-disabled") },
            h9("input", {
              type: "radio",
              className: "aura-radio",
              name,
              value: v.value,
              disabled: v.disabled,
              checked: st[0] === v.value,
              onChange: function() {
                st[1](v.value);
              }
            }),
            h9(
              "span",
              { className: "aura-choice__text" },
              h9("span", { className: "aura-choice__label" }, v.label),
              v.description ? h9("span", { className: "aura-choice__desc" }, v.description) : null
            )
          );
        })
      ),
      props.error ? h9("p", { className: "aura-field__error", id: id + "-error" }, h9(Icon, { name: "circle-alert", size: 14 }), props.error) : props.hint ? h9("p", { className: "aura-field__hint", id: id + "-hint" }, props.hint) : null
    );
  });
  var Switch = React10.forwardRef(function Switch2(props, ref) {
    var auto = uid(), id = props.id || auto;
    var st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
    var on = !!st[0];
    return h9(
      "div",
      { className: cx("aura-switch-row", props.disabled && "is-disabled", props.className) },
      h9(
        "button",
        {
          ref,
          type: "button",
          role: "switch",
          id,
          "aria-checked": on,
          disabled: props.disabled,
          "aria-labelledby": props.label ? id + "-label" : void 0,
          "aria-label": props.label ? void 0 : props["aria-label"],
          "aria-describedby": props.description ? id + "-desc" : void 0,
          className: cx("aura-switch", on && "is-on"),
          onClick: function() {
            st[1](!on);
          }
        },
        h9("span", { className: "aura-switch__thumb" })
      ),
      props.label ? h9(
        "span",
        { className: "aura-choice__text" },
        h9("label", { className: "aura-choice__label", id: id + "-label", htmlFor: id }, props.label),
        props.description ? h9("span", { className: "aura-choice__desc", id: id + "-desc" }, props.description) : null
      ) : null
    );
  });

  // src/Combobox.tsx
  var React11 = __toESM(require_react(), 1);
  var import_react_dom2 = __toESM(require_react_dom(), 1);
  var h10 = React11.createElement;
  function norm(s) {
    return String(s == null ? "" : s).normalize("NFC").toLocaleLowerCase("th");
  }
  function toOpt(o) {
    return typeof o === "object" ? o : { value: String(o), label: String(o) };
  }
  function defaultFilter(option, query) {
    var q = norm(query).trim();
    if (!q) return true;
    return norm(option.label).indexOf(q) >= 0 || !!option.description && norm(option.description).indexOf(q) >= 0 || (option.keywords || []).some(function(k) {
      return norm(k).indexOf(q) >= 0;
    });
  }
  var Combobox = React11.forwardRef(function Combobox2(props, ref) {
    var t = useStrings();
    var auto = uid(), id = props.id || auto, listId = id + "-list";
    var options = (props.options || []).map(toOpt);
    var st = useMaybeControlled(props.value, props.defaultValue == null ? null : props.defaultValue, props.onChange);
    var value = st[0], setValue = st[1];
    var selected = options.filter(function(o) {
      return o.value === value;
    })[0] || null;
    var openState = React11.useState(false), open = openState[0], setOpen = openState[1];
    var qState = React11.useState(null), query = qState[0], setQuery = qState[1];
    var aState = React11.useState(0), active = aState[0], setActive = aState[1];
    var posState = React11.useState(null);
    var inputRef = React11.useRef(null), inputMerged = useMergedRef(ref, inputRef), boxRef = React11.useRef(null), listRef = React11.useRef(null);
    var mounted = useMounted();
    var limit = props.limit || 200;
    var filter = props.filter || defaultFilter;
    var shown = props.onSearch || query == null ? options : options.filter(function(o) {
      return filter(o, query);
    });
    var more = shown.length > limit;
    shown = shown.slice(0, limit);
    var activeIdx = Math.min(active, shown.length - 1);
    function place() {
      if (!boxRef.current) return;
      var r = boxRef.current.getBoundingClientRect();
      var maxH = 320, below = window.innerHeight - r.bottom - 8, up = below < 200 && r.top > below;
      posState[1]({ left: r.left, width: r.width, top: up ? void 0 : r.bottom + 4, bottom: up ? window.innerHeight - r.top + 4 : void 0, maxHeight: Math.min(maxH, (up ? r.top : below) - 8) });
    }
    useIsoLayoutEffect(function() {
      if (open) place();
    }, [open, shown.length]);
    React11.useEffect(function() {
      if (!open) return;
      function outside(e) {
        if (boxRef.current && boxRef.current.contains(e.target)) return;
        if (listRef.current && listRef.current.contains(e.target)) return;
        close(false);
      }
      function onScroll(e) {
        if (!listRef.current || !listRef.current.contains(e.target)) place();
      }
      document.addEventListener("pointerdown", outside, true);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", place);
      return function() {
        document.removeEventListener("pointerdown", outside, true);
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", place);
      };
    }, [open]);
    React11.useEffect(function() {
      if (!open || !listRef.current) return;
      var el = listRef.current.querySelector('[data-idx="' + activeIdx + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }, [activeIdx, open]);
    function openList() {
      if (!open && !props.disabled && !props.readOnly) {
        setOpen(true);
        var i = selected ? shown.indexOf(selected) : 0;
        setActive(i < 0 ? 0 : i);
      }
    }
    function close(restoreLabel) {
      setOpen(false);
      setQuery(null);
    }
    function choose(o) {
      if (!o || o.disabled) return;
      setValue(o.value);
      setQuery(null);
      setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    function onKeyDown(e) {
      var k = e.key;
      if (k === "ArrowDown") {
        e.preventDefault();
        if (!open) openList();
        else setActive(Math.min(activeIdx + 1, shown.length - 1));
      } else if (k === "ArrowUp") {
        e.preventDefault();
        if (!open) openList();
        else setActive(Math.max(activeIdx - 1, 0));
      } else if (k === "Home" && open) {
        e.preventDefault();
        setActive(0);
      } else if (k === "End" && open) {
        e.preventDefault();
        setActive(shown.length - 1);
      } else if (k === "Enter") {
        if (open && shown[activeIdx]) {
          e.preventDefault();
          choose(shown[activeIdx]);
        }
      } else if (k === "Escape") {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          close();
        } else if (props.clearable !== false && value != null && query == null) {
          setValue(null);
        }
      } else if (k === "Tab") {
        if (open) close();
      }
    }
    var text = query != null ? query : selected ? selected.label : "";
    var optId = function(i) {
      return id + "-opt-" + i;
    };
    var list = open && mounted && posState[0] ? (0, import_react_dom2.createPortal)(
      h10(
        "div",
        { ref: listRef, className: "aura-combo__popover", style: posState[0] },
        h10(
          "ul",
          { id: listId, role: "listbox", "aria-label": props.label, className: "aura-combo__list" },
          props.loading ? h10("li", { className: "aura-combo__note", role: "presentation" }, h10(Icon, { name: "loader-circle", className: "aura-spin" }), props.loadingText || t.searching) : !shown.length ? h10("li", { className: "aura-combo__note", role: "presentation" }, props.emptyText || t.noMatches) : shown.map(function(o, i) {
            var isSel = selected && o.value === selected.value;
            return h10(
              "li",
              {
                key: o.value,
                id: optId(i),
                role: "option",
                "data-idx": i,
                "aria-selected": isSel,
                "aria-disabled": o.disabled || void 0,
                className: cx("aura-combo__option", i === activeIdx && "is-active", isSel && "is-selected", o.disabled && "is-disabled"),
                onPointerDown: function(e) {
                  e.preventDefault();
                },
                onClick: function() {
                  choose(o);
                },
                onPointerMove: function() {
                  if (activeIdx !== i) setActive(i);
                }
              },
              o.icon ? h10(Icon, { name: o.icon }) : null,
              h10(
                "span",
                { className: "aura-combo__text" },
                h10("span", { className: "aura-combo__label" }, o.label),
                o.description ? h10("span", { className: "aura-combo__desc" }, o.description) : null
              ),
              isSel ? h10(Icon, { name: "check", className: "aura-combo__check" }) : null
            );
          }),
          more && !props.loading ? h10("li", { className: "aura-combo__note", role: "presentation" }, t.keepTyping((props.options || []).length)) : null
        )
      ),
      document.body
    ) : null;
    return h10(
      Field,
      { id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h10(
        "div",
        { ref: boxRef, className: cx("aura-input aura-combo has-icon", open && "is-open") },
        h10(Icon, { name: props.icon || "search", className: "aura-input__icon" }),
        h10("input", {
          ref: inputMerged,
          id,
          type: "text",
          role: "combobox",
          className: "aura-input__control",
          autoComplete: "off",
          "aria-expanded": open,
          "aria-controls": listId,
          "aria-autocomplete": "list",
          "aria-activedescendant": open && shown[activeIdx] ? optId(activeIdx) : void 0,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": props.error ? id + "-error" : props.hint ? id + "-hint" : void 0,
          placeholder: props.placeholder,
          disabled: props.disabled,
          readOnly: props.readOnly,
          required: props.required,
          name: props.name,
          value: text,
          onChange: function(e) {
            setQuery(e.target.value);
            setActive(0);
            if (!open) setOpen(true);
            if (props.onSearch) props.onSearch(e.target.value);
          },
          onClick: openList,
          onKeyDown,
          onBlur: function() {
            setTimeout(function() {
              if (listRef.current && listRef.current.contains(document.activeElement)) return;
              setOpen(false);
              setQuery(null);
            }, 0);
          }
        }),
        props.clearable !== false && value != null && !props.disabled ? h10("button", {
          type: "button",
          className: "aura-combo__clear",
          "aria-label": t.clear(props.label),
          tabIndex: -1,
          onClick: function() {
            setValue(null);
            setQuery(null);
            if (inputRef.current) inputRef.current.focus();
          }
        }, h10(Icon, { name: "x" })) : null,
        h10(
          "button",
          {
            type: "button",
            tabIndex: -1,
            "aria-hidden": true,
            className: "aura-combo__toggle",
            onPointerDown: function(e) {
              e.preventDefault();
            },
            onClick: function() {
              if (open) close();
              else {
                openList();
                inputRef.current && inputRef.current.focus();
              }
            }
          },
          h10(Icon, { name: "chevron-down" })
        )
      ),
      list
    );
  });

  // src/DatePicker.tsx
  var React12 = __toESM(require_react(), 1);
  var import_react_dom3 = __toESM(require_react_dom(), 1);
  var h11 = React12.createElement;
  var ERA = /^พ\.ศ\.\s?|\s?(BE|พ\.ศ\.)$/g;
  var pad = function(n2) {
    return (n2 < 10 ? "0" : "") + n2;
  };
  function toISO(d) {
    return d ? d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) : null;
  }
  function fromISO(s) {
    if (!s) return null;
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function addDays(d, n2) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n2);
  }
  function addMonths(d, n2) {
    var t = new Date(d.getFullYear(), d.getMonth() + n2, 1);
    var last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
  }
  function same(a, b) {
    return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  function localeTag(locale, calendar) {
    return (locale === "en" ? "en-GB" : "th-TH") + "-u-ca-" + (calendar === "gregory" ? "gregory" : "buddhist");
  }
  var fmtCache = {};
  var PRESETS = { short: { day: "numeric", month: "short", year: "numeric" }, long: { day: "numeric", month: "long", year: "numeric" }, numeric: { day: "2-digit", month: "2-digit", year: "numeric" } };
  function fmt(tag, opts, d) {
    var k = tag + JSON.stringify(opts);
    if (!fmtCache[k]) fmtCache[k] = new Intl.DateTimeFormat(tag, opts);
    return fmtCache[k].format(d);
  }
  function formatDate(iso, opts) {
    var o = opts || {}, d = fromISO(iso);
    if (!d) return "";
    var f = typeof o.format === "object" ? o.format : PRESETS[o.format || "short"];
    return fmt(localeTag(o.locale, o.calendar), f, d).replace(ERA, "");
  }
  var MONTHS = null;
  function monthIndex(word) {
    if (!MONTHS) {
      MONTHS = {};
      ["th-TH", "en-GB"].forEach(function(tag) {
        ["short", "long"].forEach(function(w) {
          for (var i = 0; i < 12; i++) {
            var n2 = new Intl.DateTimeFormat(tag, { month: w }).format(new Date(2020, i, 1)).toLowerCase().replace(/\.$/, "");
            MONTHS[n2] = i;
            if (/^[a-z]/.test(n2)) MONTHS[n2.slice(0, 3)] = i;
          }
        });
      });
    }
    var k = word.toLowerCase().replace(/\.$/, "");
    return MONTHS[k] != null ? MONTHS[k] : -1;
  }
  function parseDate(text) {
    var s = String(text || "").trim();
    var m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s), y, mo, d;
    if (m) {
      y = +m[1];
      mo = +m[2];
      d = +m[3];
    } else if (m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s)) {
      d = +m[1];
      mo = +m[2];
      y = +m[3];
    } else if ((m = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(s.replace(ERA, "").trim())) && monthIndex(m[2]) >= 0) {
      d = +m[1];
      mo = monthIndex(m[2]) + 1;
      y = +m[3];
    } else return null;
    if (y >= 2400) y -= 543;
    var dt = new Date(y, mo - 1, d);
    return dt.getMonth() === mo - 1 && dt.getDate() === d ? toISO(dt) : null;
  }
  var Calendar = React12.forwardRef(function Calendar2(props, ref) {
    var ctx = useAuraLocale(), locale = props.locale || ctx.locale || "th", calendar = props.calendar || ctx.calendar || "buddhist", tag = localeTag(locale, calendar);
    var weekStart = props.weekStartsOn == null ? 0 : props.weekStartsOn;
    var today = /* @__PURE__ */ new Date();
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    var min = fromISO(props.min), max = fromISO(props.max);
    var start = fromISO(props.start), end = fromISO(props.end);
    var focusState = React12.useState(fromISO(props.focus) || start || today);
    var focusDate = focusState[0], setFocus = focusState[1];
    var viewState = React12.useState("days"), view = viewState[0], setView = viewState[1];
    var hoverState = React12.useState(null);
    var gridRef = React12.useRef(null), gridMerged = useMergedRef(ref, gridRef), moved = React12.useRef(false);
    var th = locale !== "en";
    function disabled(d) {
      return !!(min && d < min || max && d > max || props.isDateDisabled && props.isDateDisabled(toISO(d)));
    }
    React12.useEffect(function() {
      if (!moved.current) return;
      moved.current = false;
      var el = gridRef.current && gridRef.current.querySelector('[data-date="' + toISO(focusDate) + '"]');
      if (el) el.focus();
    });
    React12.useEffect(function() {
      if (props.autoFocus === false) return;
      var el = gridRef.current && gridRef.current.querySelector('[tabindex="0"]');
      if (el) el.focus();
    }, []);
    function move(d) {
      moved.current = true;
      setFocus(d);
    }
    var first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    var lead = (first.getDay() - weekStart + 7) % 7;
    var gridStart = addDays(first, -lead);
    var days = [];
    for (var i = 0; i < 42; i++) days.push(addDays(gridStart, i));
    var weeks = [];
    for (var w = 0; w < 6; w++) weeks.push(days.slice(w * 7, w * 7 + 7));
    if (weeks[5][0].getMonth() !== focusDate.getMonth()) weeks.pop();
    function onKey(e, d) {
      var k = e.key, n2 = null;
      if (k === "ArrowLeft") n2 = addDays(d, -1);
      else if (k === "ArrowRight") n2 = addDays(d, 1);
      else if (k === "ArrowUp") n2 = addDays(d, -7);
      else if (k === "ArrowDown") n2 = addDays(d, 7);
      else if (k === "Home") n2 = addDays(d, -((d.getDay() - weekStart + 7) % 7));
      else if (k === "End") n2 = addDays(d, 6 - (d.getDay() - weekStart + 7) % 7);
      else if (k === "PageUp") n2 = addMonths(d, e.shiftKey ? -12 : -1);
      else if (k === "PageDown") n2 = addMonths(d, e.shiftKey ? 12 : 1);
      else if (k === "Enter" || k === " ") {
        e.preventDefault();
        if (!disabled(d)) props.onSelect(toISO(d));
        return;
      }
      if (n2) {
        e.preventDefault();
        move(n2);
      }
    }
    var hover = hoverState[0];
    var rangeEnd = end || (props.range && start && hover ? hover : null);
    function inRange(d) {
      if (!props.range || !start || !rangeEnd) return false;
      var a = start < rangeEnd ? start : rangeEnd, b = start < rangeEnd ? rangeEnd : start;
      return d > a && d < b;
    }
    var monthTitle = fmt(tag, { month: "long", year: "numeric" }, focusDate).replace(ERA, "");
    var weekdayNames = weeks[0].map(function(d) {
      return { short: fmt(tag, { weekday: th ? "narrow" : "short" }, d), long: fmt(tag, { weekday: "long" }, d) };
    });
    if (view === "years") {
      var yr = focusDate.getFullYear(), base = yr - yr % 12;
      var years = [];
      for (var y = base; y < base + 12; y++) years.push(y);
      return h11(
        "div",
        { className: "aura-cal", ref: gridMerged },
        h11(
          "div",
          { className: "aura-cal__head" },
          h11(IconButton, { icon: "chevron-left", label: th ? "\u0E0A\u0E48\u0E27\u0E07\u0E1B\u0E35\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32" : "Previous years", onClick: function() {
            setFocus(new Date(yr - 12, focusDate.getMonth(), 1));
          } }),
          h11(
            "button",
            { type: "button", className: "aura-cal__title", onClick: function() {
              setView("days");
            } },
            fmt(tag, { year: "numeric" }, new Date(base, 0, 1)).replace(ERA, "") + " \u2013 " + fmt(tag, { year: "numeric" }, new Date(base + 11, 0, 1)).replace(ERA, "")
          ),
          h11(IconButton, { icon: "chevron-right", label: th ? "\u0E0A\u0E48\u0E27\u0E07\u0E1B\u0E35\u0E16\u0E31\u0E14\u0E44\u0E1B" : "Next years", onClick: function() {
            setFocus(new Date(yr + 12, focusDate.getMonth(), 1));
          } })
        ),
        h11("div", { className: "aura-cal__years" }, years.map(function(y2) {
          var d = new Date(y2, focusDate.getMonth(), 1);
          return h11(
            "button",
            {
              key: y2,
              type: "button",
              tabIndex: y2 === yr ? 0 : -1,
              className: cx("aura-cal__year", y2 === yr && "is-selected"),
              onClick: function() {
                setFocus(new Date(y2, focusDate.getMonth(), Math.min(focusDate.getDate(), 28)));
                setView("days");
                moved.current = true;
              }
            },
            fmt(tag, { year: "numeric" }, d).replace(ERA, "")
          );
        }))
      );
    }
    return h11(
      "div",
      { className: "aura-cal", ref: gridMerged },
      h11(
        "div",
        { className: "aura-cal__head" },
        h11(IconButton, { icon: "chevron-left", label: th ? "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32" : "Previous month", onClick: function() {
          setFocus(addMonths(focusDate, -1));
        } }),
        h11(
          "button",
          { type: "button", className: "aura-cal__title", "aria-live": "polite", onClick: function() {
            setView("years");
          } },
          monthTitle,
          h11(Icon, { name: "chevron-down", size: 14 })
        ),
        h11(IconButton, { icon: "chevron-right", label: th ? "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E16\u0E31\u0E14\u0E44\u0E1B" : "Next month", onClick: function() {
          setFocus(addMonths(focusDate, 1));
        } })
      ),
      h11(
        "table",
        { role: "grid", className: "aura-cal__grid", "aria-label": monthTitle },
        h11("thead", null, h11("tr", null, weekdayNames.map(function(n2, i2) {
          return h11("th", { key: i2, scope: "col", abbr: n2.long }, h11("span", { "aria-hidden": true }, n2.short));
        }))),
        h11("tbody", { onMouseLeave: function() {
          hoverState[1](null);
        } }, weeks.map(function(wk, wi) {
          return h11("tr", { key: wi }, wk.map(function(d) {
            var iso = toISO(d), out = d.getMonth() !== focusDate.getMonth(), dis = disabled(d);
            var isStart = same(d, start), isEnd = same(d, end) || !end && props.range && same(d, hover) && start;
            var sel = isStart || same(d, end);
            return h11(
              "td",
              {
                key: iso,
                role: "gridcell",
                "aria-selected": sel || void 0,
                className: cx(inRange(d) && "is-in-range", props.range && isStart && rangeEnd && "is-range-start", props.range && isEnd && start && "is-range-end")
              },
              h11("button", {
                type: "button",
                "data-date": iso,
                tabIndex: same(d, focusDate) ? 0 : -1,
                disabled: dis,
                "aria-label": fmt(tag, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, d),
                "aria-current": same(d, today) ? "date" : void 0,
                "aria-pressed": sel || void 0,
                className: cx("aura-cal__day", out && "is-outside", sel && "is-selected", same(d, today) && "is-today"),
                onClick: function() {
                  setFocus(d);
                  props.onSelect(iso);
                },
                onKeyDown: function(e) {
                  onKey(e, d);
                },
                onMouseEnter: function() {
                  if (props.range) hoverState[1](d);
                }
              }, d.getDate())
            );
          }));
        }))
      ),
      props.footer === false ? null : h11(
        "div",
        { className: "aura-cal__foot" },
        h11("button", { type: "button", className: "aura-cal__link", disabled: disabled(today), onClick: function() {
          move(today);
          props.onSelect(toISO(today));
        } }, th ? "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49" : "Today"),
        props.onClear ? h11("button", { type: "button", className: "aura-cal__link", onClick: props.onClear }, th ? "\u0E25\u0E49\u0E32\u0E07" : "Clear") : null
      )
    );
  });
  function useCalendarPopover(boxRef) {
    var openState = React12.useState(false), open = openState[0], setOpen = openState[1];
    var pos = React12.useState(null), popRef = React12.useRef(null), mounted = useMounted();
    function place() {
      if (!boxRef.current) return;
      var r = boxRef.current.getBoundingClientRect(), H = 380;
      var up = window.innerHeight - r.bottom < H && r.top > H;
      var left = Math.max(8, Math.min(r.left, window.innerWidth - 320 - 8));
      pos[1](up ? { left, bottom: window.innerHeight - r.top + 4 } : { left, top: r.bottom + 4 });
    }
    useIsoLayoutEffect(function() {
      if (open) place();
    }, [open]);
    React12.useEffect(function() {
      if (!open) return;
      function outside(e) {
        if (boxRef.current && boxRef.current.contains(e.target)) return;
        if (popRef.current && popRef.current.contains(e.target)) return;
        setOpen(false);
      }
      document.addEventListener("pointerdown", outside, true);
      window.addEventListener("resize", place);
      window.addEventListener("scroll", place, true);
      return function() {
        document.removeEventListener("pointerdown", outside, true);
        window.removeEventListener("resize", place);
        window.removeEventListener("scroll", place, true);
      };
    }, [open]);
    return { open, setOpen, pos: pos[0], popRef, mounted };
  }
  function DateField(props) {
    var editState = React12.useState(null), editing = editState[0], setEditing = editState[1];
    return h11(
      Field,
      { id: props.id, label: props.label, hint: props.hint, error: props.error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h11(
        "div",
        { ref: props.boxRef, className: cx("aura-input aura-date", props.open && "is-open") },
        h11("input", {
          ref: props.inputRef,
          id: props.id,
          type: "text",
          inputMode: "numeric",
          autoComplete: "off",
          className: "aura-input__control",
          value: editing != null ? editing : props.display,
          placeholder: props.placeholder,
          disabled: props.disabled,
          required: props.required,
          name: props.name,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": props.error ? props.id + "-error" : props.hint ? props.id + "-hint" : void 0,
          onChange: function(e) {
            setEditing(e.target.value);
          },
          onBlur: function() {
            if (editing != null) {
              props.onCommit(editing);
              setEditing(null);
            }
          },
          onKeyDown: function(e) {
            if (e.key === "Enter" && editing != null) {
              e.preventDefault();
              props.onCommit(editing);
              setEditing(null);
            } else if (e.key === "ArrowDown" && (e.altKey || editing == null)) {
              e.preventDefault();
              props.onToggle(true);
            } else if (e.key === "Escape" && props.open) {
              e.preventDefault();
              props.onToggle(false);
            }
          }
        }),
        props.clearable !== false && props.hasValue && !props.disabled ? h11("button", { type: "button", tabIndex: -1, className: "aura-combo__clear", "aria-label": props.clearLabel, onClick: props.onClear }, h11(Icon, { name: "x" })) : null,
        h11("button", {
          type: "button",
          className: "aura-date__toggle",
          disabled: props.disabled,
          "aria-label": props.toggleLabel,
          "aria-haspopup": "dialog",
          "aria-expanded": props.open,
          "aria-controls": props.open ? props.dialogId : void 0,
          onClick: function() {
            props.onToggle(!props.open);
          }
        }, h11(Icon, { name: "calendar" }))
      )
    );
  }
  var DatePicker = React12.forwardRef(function DatePicker2(props, ref) {
    var auto = uid(), id = props.id || auto, dialogId = id + "-cal";
    var ctx = useAuraLocale(), locale = props.locale || ctx.locale || "th", calendar = props.calendar || ctx.calendar || "buddhist", th = locale !== "en";
    var st = useMaybeControlled(props.value, props.defaultValue == null ? null : props.defaultValue, props.onChange);
    var boxRef = React12.useRef(null), inputRef = React12.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    var pop = useCalendarPopover(boxRef);
    function commit(text) {
      if (!text.trim()) {
        st[1](null);
        return;
      }
      var iso = parseDate(text);
      if (iso) st[1](iso);
    }
    function close() {
      pop.setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    var cal = pop.open && pop.mounted && pop.pos ? (0, import_react_dom3.createPortal)(
      h11(
        "div",
        {
          ref: pop.popRef,
          id: dialogId,
          role: "dialog",
          "aria-modal": false,
          "aria-label": props.label || (th ? "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48" : "Choose date"),
          className: "aura-cal__popover",
          style: pop.pos,
          onKeyDown: function(e) {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            } else trapTab(e, pop.popRef.current);
          }
        },
        h11(Calendar, {
          locale,
          calendar,
          weekStartsOn: props.weekStartsOn,
          min: props.min,
          max: props.max,
          isDateDisabled: props.isDateDisabled,
          start: st[0],
          focus: st[0],
          onSelect: function(iso) {
            st[1](iso);
            close();
          }
        })
      ),
      document.body
    ) : null;
    return h11(
      React12.Fragment,
      null,
      h11(DateField, {
        id,
        dialogId,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className,
        name: props.name,
        boxRef,
        inputRef: inputMerged,
        open: pop.open,
        display: formatDate(st[0], { locale, calendar }),
        placeholder: props.placeholder || (th ? "\u0E27\u0E27/\u0E14\u0E14/\u0E1B\u0E1B\u0E1B\u0E1B" : "dd/mm/yyyy"),
        hasValue: st[0] != null,
        clearable: props.clearable,
        onClear: function() {
          st[1](null);
          inputRef.current && inputRef.current.focus();
        },
        clearLabel: th ? "\u0E25\u0E49\u0E32\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48" : "Clear date",
        toggleLabel: th ? "\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19" : "Open calendar",
        onCommit: commit,
        onToggle: function(o) {
          pop.setOpen(o);
          if (!o && inputRef.current) inputRef.current.focus();
        }
      }),
      cal
    );
  });
  var DateRangePicker = React12.forwardRef(function DateRangePicker2(props, ref) {
    var auto = uid(), id = props.id || auto, dialogId = id + "-cal";
    var ctx = useAuraLocale(), locale = props.locale || ctx.locale || "th", calendar = props.calendar || ctx.calendar || "buddhist", th = locale !== "en";
    var st = useMaybeControlled(props.value, props.defaultValue || { start: null, end: null }, props.onChange);
    var v = st[0] || { start: null, end: null };
    var draft = React12.useState(null);
    var boxRef = React12.useRef(null), inputRef = React12.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    var pop = useCalendarPopover(boxRef);
    var o = { locale, calendar };
    function show(r) {
      if (!r.start) return "";
      if (!r.end) return formatDate(r.start, o) + " \u2013";
      return formatDate(r.start, o) + " \u2013 " + formatDate(r.end, o);
    }
    function commit(text) {
      var parts = String(text).split(/\s[–-]\s|\s*–\s*/);
      if (!text.trim()) {
        st[1]({ start: null, end: null });
        return;
      }
      var a = parseDate(parts[0]), b = parseDate(parts[1] || "");
      if (a && b) st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
    }
    function close() {
      pop.setOpen(false);
      draft[1](null);
      if (inputRef.current) inputRef.current.focus();
    }
    function pick(iso) {
      if (!draft[0]) {
        draft[1](iso);
        return;
      }
      var a = draft[0], b = iso;
      st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
      close();
    }
    var cal = pop.open && pop.mounted && pop.pos ? (0, import_react_dom3.createPortal)(
      h11(
        "div",
        {
          ref: pop.popRef,
          id: dialogId,
          role: "dialog",
          "aria-modal": false,
          "aria-label": props.label || (th ? "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48" : "Choose dates"),
          className: "aura-cal__popover",
          style: pop.pos,
          onKeyDown: function(e) {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            } else trapTab(e, pop.popRef.current);
          }
        },
        h11("p", { className: "aura-cal__hint", "aria-live": "polite" }, draft[0] ? th ? "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14" : "Choose the end date" : th ? "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19" : "Choose the start date"),
        h11(Calendar, {
          range: true,
          locale,
          calendar,
          weekStartsOn: props.weekStartsOn,
          min: props.min,
          max: props.max,
          isDateDisabled: props.isDateDisabled,
          start: draft[0] || v.start,
          end: draft[0] ? null : v.end,
          focus: draft[0] || v.start,
          onSelect: pick
        })
      ),
      document.body
    ) : null;
    return h11(
      React12.Fragment,
      null,
      h11(DateField, {
        id,
        dialogId,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className,
        name: props.name,
        boxRef,
        inputRef: inputMerged,
        open: pop.open,
        display: show(v),
        placeholder: props.placeholder || (th ? "\u0E27\u0E27/\u0E14\u0E14/\u0E1B\u0E1B\u0E1B\u0E1B \u2013 \u0E27\u0E27/\u0E14\u0E14/\u0E1B\u0E1B\u0E1B\u0E1B" : "dd/mm/yyyy \u2013 dd/mm/yyyy"),
        hasValue: v.start != null,
        clearable: props.clearable,
        onClear: function() {
          st[1]({ start: null, end: null });
          inputRef.current && inputRef.current.focus();
        },
        clearLabel: th ? "\u0E25\u0E49\u0E32\u0E07\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48" : "Clear dates",
        toggleLabel: th ? "\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19" : "Open calendar",
        onCommit: commit,
        onToggle: function(op) {
          pop.setOpen(op);
          draft[1](null);
          if (!op && inputRef.current) inputRef.current.focus();
        }
      }),
      cal
    );
  });

  // src/feedback.tsx
  var React13 = __toESM(require_react(), 1);
  var import_react_dom4 = __toESM(require_react_dom(), 1);
  var h12 = React13.createElement;
  var ALERT_ICON = { info: "info", success: "circle-check", warning: "triangle-alert", danger: "circle-alert" };
  var Alert = React13.forwardRef(function Alert2(props, ref) {
    var t = useStrings();
    var tone2 = props.tone || "info";
    return h12(
      "div",
      {
        ref,
        className: cx("aura-alert", "aura-alert--" + tone2, props.className),
        role: tone2 === "danger" || tone2 === "warning" ? "alert" : "status"
      },
      h12(Icon, { name: ALERT_ICON[tone2], className: "aura-alert__icon" }),
      h12(
        "div",
        { className: "aura-alert__body" },
        props.title ? h12("p", { className: "aura-alert__title" }, props.title) : null,
        props.children ? h12("div", { className: "aura-alert__text" }, props.children) : null,
        props.action ? h12("div", { className: "aura-alert__action" }, props.action) : null
      ),
      props.onDismiss ? h12(IconButton, { icon: "x", label: t.dismiss, className: "aura-alert__close", onClick: props.onDismiss }) : null
    );
  });
  var toastState = { list: [], subs: [], n: 0 };
  function emitToasts() {
    toastState.subs.forEach(function(f) {
      f(toastState.list.slice());
    });
  }
  function toast(opts) {
    if (typeof opts === "string") opts = { title: opts };
    var id = opts.id || "t" + ++toastState.n;
    toastState.list = toastState.list.filter(function(t) {
      return t.id !== id;
    }).concat([Object.assign({ tone: "info" }, opts, { id })]).slice(-3);
    emitToasts();
    return id;
  }
  toast.dismiss = function(id) {
    toastState.list = toastState.list.filter(function(t) {
      return t.id !== id;
    });
    emitToasts();
  };
  function ToastItem(props) {
    var str = useStrings();
    var t = props.toast, timer = React13.useRef(null), left = React13.useRef(t.duration || 5e3), since = React13.useRef(0);
    function start() {
      if (left.current === Infinity) return;
      since.current = Date.now();
      timer.current = setTimeout(function() {
        toast.dismiss(t.id);
      }, left.current);
    }
    function pause() {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        left.current -= Date.now() - since.current;
      }
    }
    React13.useEffect(function() {
      start();
      return pause;
    }, []);
    return h12(
      "div",
      {
        className: cx("aura-toast", "aura-toast--" + t.tone),
        role: t.tone === "danger" ? "alert" : "status",
        onMouseEnter: pause,
        onMouseLeave: start,
        onFocus: pause,
        onBlur: start
      },
      h12(Icon, { name: ALERT_ICON[t.tone] || "info", className: "aura-toast__icon" }),
      h12(
        "div",
        { className: "aura-toast__body" },
        h12("p", { className: "aura-toast__title" }, t.title),
        t.description ? h12("p", { className: "aura-toast__text" }, t.description) : null
      ),
      t.action ? h12("button", {
        type: "button",
        className: "aura-toast__action",
        onClick: function() {
          t.action.onClick && t.action.onClick();
          toast.dismiss(t.id);
        }
      }, t.action.label) : null,
      h12(IconButton, { icon: "x", label: str.dismissToast, className: "aura-toast__close", onClick: function() {
        toast.dismiss(t.id);
      } })
    );
  }
  function Toaster(props) {
    var t = useStrings();
    var mounted = useMounted();
    var s = React13.useState(toastState.list);
    React13.useEffect(function() {
      toastState.subs.push(s[1]);
      return function() {
        toastState.subs = toastState.subs.filter(function(f) {
          return f !== s[1];
        });
      };
    }, []);
    if (!mounted) return null;
    return (0, import_react_dom4.createPortal)(h12(
      "div",
      { className: cx("aura-toaster", props && props.position === "top" && "is-top"), role: "region", "aria-live": "polite", "aria-label": t.notifications },
      s[0].map(function(t2) {
        return h12(ToastItem, { key: t2.id, toast: t2 });
      })
    ), document.body);
  }
  var Tooltip = React13.forwardRef(function Tooltip2(props, ref) {
    var id = uid(), st = React13.useState(false), open = props.open !== void 0 ? props.open : st[0], set = st[1];
    var anchor = React13.useRef(null), anchorMerged = useMergedRef(ref, anchor), tip = React13.useRef(null), timer = React13.useRef(void 0);
    var pos = React13.useState(null);
    function show(now) {
      clearTimeout(timer.current);
      timer.current = setTimeout(function() {
        set(true);
      }, now ? 0 : props.delay == null ? 400 : props.delay);
    }
    function hide() {
      clearTimeout(timer.current);
      set(false);
    }
    useIsoLayoutEffect(function() {
      if (!open || !anchor.current || !tip.current) return;
      var r = anchor.current.getBoundingClientRect(), t = tip.current.getBoundingClientRect();
      var side = props.side || "top", top = side === "top" ? r.top - t.height - 8 : r.bottom + 8;
      if (side === "top" && top < 8) top = r.bottom + 8;
      var left = Math.max(8, Math.min(r.left + r.width / 2 - t.width / 2, window.innerWidth - t.width - 8));
      pos[1]({ top, left });
    }, [open]);
    React13.useEffect(function() {
      if (!open) return;
      function esc(e) {
        if (e.key === "Escape") hide();
      }
      document.addEventListener("keydown", esc);
      return function() {
        document.removeEventListener("keydown", esc);
      };
    }, [open]);
    var child = React13.Children.only(props.children);
    var trigger = h12(
      "span",
      {
        ref: anchorMerged,
        className: "aura-tooltip-anchor",
        onMouseEnter: function() {
          show(false);
        },
        onMouseLeave: hide,
        onFocus: function() {
          show(true);
        },
        onBlur: hide
      },
      React13.cloneElement(child, { "aria-describedby": open ? id : child.props["aria-describedby"] })
    );
    return h12(
      React13.Fragment,
      null,
      trigger,
      open ? (0, import_react_dom4.createPortal)(h12("div", {
        ref: tip,
        id,
        role: "tooltip",
        className: "aura-tooltip",
        style: { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }
      }, props.content), document.body) : null
    );
  });

  // src/Dialog.tsx
  var React15 = __toESM(require_react(), 1);
  var import_react_dom5 = __toESM(require_react_dom(), 1);

  // src/overlay.tsx
  var React14 = __toESM(require_react(), 1);
  function useModal(open, ref, opts) {
    var mounted = useMounted();
    var prev = React14.useRef(null);
    var o = opts || {};
    React14.useEffect(function() {
      if (!open || !mounted) return;
      prev.current = document.activeElement;
      var body = document.body, overflow = body.style.overflow;
      body.style.overflow = "hidden";
      var el = ref.current;
      var target = el && (el.querySelector("[data-autofocus]") || el.querySelector(o.bodySelector + " " + FOCUSABLE) || el.querySelector(o.footSelector + " " + FOCUSABLE) || el);
      if (target && o.autoFocus !== false) target.focus();
      return function() {
        body.style.overflow = overflow;
        if (prev.current && prev.current.focus) prev.current.focus();
      };
    }, [open, mounted]);
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (o.onEscape) o.onEscape();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      var list = Array.prototype.slice.call(ref.current.querySelectorAll(FOCUSABLE));
      if (!list.length) {
        e.preventDefault();
        return;
      }
      var first = list[0], last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    return { ready: !!open && mounted, onKeyDown };
  }

  // src/Dialog.tsx
  var h13 = React15.createElement;
  var Dialog = React15.forwardRef(function Dialog2(props, ref) {
    var t = useStrings();
    var own = React15.useRef(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
    function close() {
      if (props.dismissible !== false && props.onClose) props.onClose();
    }
    var modal = useModal(props.open, own, { autoFocus: props.autoFocus, onEscape: close, bodySelector: ".aura-dialog__body", footSelector: ".aura-dialog__foot" });
    if (!modal.ready) return null;
    return (0, import_react_dom5.createPortal)(
      h13(
        "div",
        { className: "aura-dialog-layer", onKeyDown: modal.onKeyDown },
        h13("div", { className: "aura-scrim", onClick: close, "aria-hidden": true }),
        h13(
          "div",
          {
            ref: merged,
            role: props.role || "dialog",
            "aria-modal": true,
            "aria-labelledby": titleId,
            "aria-describedby": props.description ? descId : void 0,
            tabIndex: -1,
            className: cx("aura-dialog", "aura-dialog--" + (props.size || "md"), props.className)
          },
          h13(
            "div",
            { className: "aura-dialog__head" },
            h13("h2", { className: "aura-dialog__title", id: titleId }, props.title),
            props.dismissible !== false ? h13(IconButton, { icon: "x", label: t.close, className: "aura-dialog__close", onClick: close }) : null
          ),
          props.description ? h13("p", { className: "aura-dialog__desc", id: descId }, props.description) : null,
          props.children ? h13("div", { className: "aura-dialog__body" }, props.children) : null,
          props.footer ? h13("div", { className: "aura-dialog__foot" }, props.footer) : null
        )
      ),
      document.body
    );
  });
  var Drawer = React15.forwardRef(function Drawer2(props, ref) {
    var t = useStrings();
    var own = React15.useRef(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
    function close() {
      if (props.dismissible !== false && props.onClose) props.onClose();
    }
    var modal = useModal(props.open, own, { autoFocus: props.autoFocus, onEscape: close, bodySelector: ".aura-drawer__body", footSelector: ".aura-drawer__foot" });
    if (!modal.ready) return null;
    var side = props.side === "left" ? "left" : "right";
    return (0, import_react_dom5.createPortal)(
      h13(
        "div",
        { className: "aura-dialog-layer aura-drawer-layer", onKeyDown: modal.onKeyDown },
        h13("div", { className: "aura-scrim", onClick: close, "aria-hidden": true }),
        h13(
          "div",
          {
            ref: merged,
            role: "dialog",
            "aria-modal": true,
            "aria-labelledby": props.title ? titleId : void 0,
            "aria-label": props.title ? void 0 : props["aria-label"],
            "aria-describedby": props.description ? descId : void 0,
            tabIndex: -1,
            className: cx("aura-drawer", "aura-drawer--" + side, "aura-drawer--" + (props.size || "md"), props.className)
          },
          props.title || props.dismissible !== false ? h13(
            "div",
            { className: "aura-drawer__head" },
            props.title ? h13("h2", { className: "aura-drawer__title", id: titleId }, props.title) : h13("span", { style: { flex: 1 } }),
            props.dismissible !== false ? h13(IconButton, { icon: "x", label: t.close, onClick: close }) : null
          ) : null,
          props.description ? h13("p", { className: "aura-drawer__desc", id: descId }, props.description) : null,
          h13("div", { className: "aura-drawer__body" }, props.children),
          props.footer ? h13("div", { className: "aura-drawer__foot" }, props.footer) : null
        )
      ),
      document.body
    );
  });

  // src/DataTable.tsx
  var React16 = __toESM(require_react(), 1);
  var h14 = React16.createElement;
  var BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };
  var DEFAULT_COLUMNS = [
    { key: "id", label: "ID", width: 96, mono: true },
    { key: "name", label: "NAME", width: 160 },
    { key: "status", label: "STATUS", width: 112, pill: true },
    { key: "owner", label: "OWNER" }
  ];
  var SKELETON_WIDTHS = ["72%", "56%", "84%", "44%", "64%"];
  var ROW_H = 48;
  var OVERSCAN = 8;
  var FLEX_MIN = 160;
  var DataTable = React16.forwardRef(function DataTable2(props, ref) {
    var t = useStrings();
    var columns = props.columns || DEFAULT_COLUMNS;
    var byKey = {};
    columns.forEach(function(c) {
      byKey[c.key] = c;
    });
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
    var orderState = useMaybeControlled(props.columnOrder, columns.map(function(c) {
      return c.key;
    }), props.onColumnOrderChange);
    var hiddenState = useMaybeControlled(props.hiddenColumns, columns.filter(function(c) {
      return c.hidden;
    }).map(function(c) {
      return c.key;
    }), props.onHiddenColumnsChange);
    var pinState = useMaybeControlled(props.pinnedColumns, columns.filter(function(c) {
      return c.pinned;
    }).map(function(c) {
      return c.key;
    }), props.onPinnedColumnsChange);
    var widthState = React16.useState({});
    var widths = widthState[0], setWidths = widthState[1];
    var activeState = React16.useState({ r: 1, c: 0 });
    var scrollState = React16.useState(0);
    var scrollTop = scrollState[0], setScrollTop = scrollState[1];
    var scrolledX = React16.useState(false);
    var menuState = React16.useState(null);
    var menu = menuState[0], setMenu = menuState[1];
    var dragState = React16.useState(null);
    var drag = dragState[0], setDrag = dragState[1];
    var gridRef = React16.useRef(null);
    var wrapRef = React16.useRef(null), wrapMerged = useMergedRef(ref, wrapRef);
    var boxWidth = React16.useState(null);
    var measure = !!props.stackBelow || columns.some(function(c) {
      return c.hideBelow != null;
    });
    React16.useEffect(function() {
      if (!measure || !wrapRef.current || typeof ResizeObserver === "undefined") return;
      var ro = new ResizeObserver(function(en) {
        boxWidth[1](en[0].contentRect.width);
      });
      ro.observe(wrapRef.current);
      return function() {
        ro.disconnect();
      };
    }, [measure]);
    var stacked = !!props.stackBelow && boxWidth[0] != null && boxWidth[0] < props.stackBelow;
    function tooNarrow(c) {
      if (c.hideBelow == null || boxWidth[0] == null || stacked) return false;
      var px = typeof c.hideBelow === "number" ? c.hideBelow : BP[c.hideBelow];
      return px != null && boxWidth[0] < px;
    }
    var scrollRef = React16.useRef(null);
    var pending = React16.useRef(null);
    var resizing = React16.useRef(false);
    useIsoLayoutEffect(function() {
      if (stacked || !gridRef.current) return;
      var els = gridRef.current.querySelectorAll('.aura-table__td button, .aura-table__td a[href], .aura-table__td input, .aura-table__td select, .aura-table__td textarea, .aura-table__td [tabindex="0"]');
      for (var i2 = 0; i2 < els.length; i2++) if (els[i2].tabIndex !== -1) els[i2].tabIndex = -1;
    });
    function widthOf(c) {
      return widths[c.key] != null ? widths[c.key] : c.width;
    }
    var order = orderState[0].filter(function(k) {
      return byKey[k];
    });
    columns.forEach(function(c) {
      if (order.indexOf(c.key) < 0) order.push(c.key);
    });
    var hidden = hiddenState[0], pinnedKeys = pinState[0];
    var shown = order.filter(function(k) {
      return hidden.indexOf(k) < 0;
    }).map(function(k) {
      return byKey[k];
    }).filter(function(c) {
      return !tooNarrow(c);
    });
    function isPinned(c) {
      return pinnedKeys.indexOf(c.key) >= 0 && c.width != null;
    }
    var vis = shown.filter(isPinned).concat(shown.filter(function(c) {
      return !isPinned(c);
    }));
    var nPinned = vis.filter(isPinned).length;
    var hasFlex = vis.some(function(c) {
      return widthOf(c) == null;
    });
    var fixedSum = 0;
    vis.forEach(function(c) {
      fixedSum += widthOf(c) != null ? widthOf(c) : FLEX_MIN;
    });
    var pinOffsets = {}, acc = 0;
    vis.forEach(function(c) {
      if (isPinned(c)) {
        pinOffsets[c.key] = acc;
        acc += widthOf(c);
      }
    });
    var selW = selectable ? " + var(--aura-table-select-width)" : "";
    var gutterR = controls ? "var(--aura-space-12)" : "var(--aura-space-6)";
    var rowMinWidth = "calc(" + fixedSum + "px + var(--aura-space-6) + " + gutterR + selW + ")";
    function cellStyle(c, i2) {
      var w = widthOf(c), s;
      if (w == null) s = { flex: "1 1 0", minWidth: (c.minWidth || FLEX_MIN) + "px" };
      else if (!hasFlex && i2 === vis.length - 1) s = { flex: "1 0 auto", width: w + "px" };
      else s = { width: w + "px", flex: "none" };
      if (isPinned(c)) s.left = "calc(var(--aura-space-6)" + selW + " + " + pinOffsets[c.key] + "px)";
      return s;
    }
    var view = React16.useMemo(function() {
      if (!sort || !sort.key || !byKey[sort.key]) return rows;
      var col = byKey[sort.key];
      var val = col.sortValue || (col.pill ? function(r) {
        return TONE_ORDER[col.tones && col.tones[r[col.key]] || toneFor(r[col.key])];
      } : function(r) {
        return r[col.key];
      });
      var dir = sort.dir === "desc" ? -1 : 1;
      return rows.map(function(r, i2) {
        return [r, i2];
      }).sort(function(a, b) {
        return compare(val(a[0]), val(b[0])) * dir || a[1] - b[1];
      }).map(function(p) {
        return p[0];
      });
    }, [rows, sort && sort.key, sort && sort.dir]);
    function nextSort(key) {
      if (!sort || sort.key !== key) return { key, dir: "asc" };
      if (sort.dir === "asc") return { key, dir: "desc" };
      return null;
    }
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
    var height = props.height || 0;
    var virtual = !!height && !loading && pageRows.length > 0;
    var bodyH = Math.max(ROW_H, height - ROW_H);
    var start = 0, end = pageRows.length;
    if (virtual) {
      start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
      end = Math.min(pageRows.length, Math.ceil((scrollTop + bodyH) / ROW_H) + OVERSCAN);
    }
    var visibleRows = Math.max(1, Math.floor(bodyH / ROW_H));
    var nCols = vis.length + (selectable ? 1 : 0);
    var nRows = loading ? 0 : pageRows.length;
    var active = activeState[0];
    var ar = Math.min(active.r, nRows), ac = Math.min(active.c, nCols - 1);
    var activeRendered = ar === 0 || ar - 1 >= start && ar - 1 < end;
    function colAt(ci) {
      return selectable ? ci === 0 ? null : vis[ci - 1] : vis[ci];
    }
    function tabFor(r, c) {
      if (!activeRendered) return r === 0 && c === ac ? 0 : -1;
      return r === ar && c === ac ? 0 : -1;
    }
    React16.useEffect(function() {
      var p = pending.current;
      if (!p || !gridRef.current) return;
      var c = p.c;
      if (p.key) {
        var at = -1;
        vis.forEach(function(x, i2) {
          if (x.key === p.key) at = i2;
        });
        c = at >= 0 ? at + (selectable ? 1 : 0) : Math.min(p.c || 0, nCols - 1);
      }
      var el = gridRef.current.querySelector('[data-rc="' + p.r + ":" + c + '"]');
      if (el) {
        pending.current = null;
        el.focus();
      }
    });
    function focusCell(r, c) {
      r = Math.max(0, Math.min(r, nRows));
      c = Math.max(0, Math.min(c, nCols - 1));
      activeState[1]({ r, c });
      pending.current = { r, c };
      if (virtual && r > 0) {
        var sc = scrollRef.current, top = (r - 1) * ROW_H;
        if (top < sc.scrollTop) sc.scrollTop = top;
        else if (top + ROW_H > sc.scrollTop + bodyH) sc.scrollTop = top + ROW_H - bodyH;
        setScrollTop(sc.scrollTop);
      }
      var el = gridRef.current && gridRef.current.querySelector('[data-rc="' + r + ":" + c + '"]');
      if (el) {
        pending.current = null;
        el.focus();
      }
    }
    var pageKeys = pageRows.map(function(r) {
      return r[rowKey];
    });
    var selSet = {};
    selected.forEach(function(k) {
      selSet[k] = true;
    });
    var nSel = pageKeys.filter(function(k) {
      return selSet[k];
    }).length;
    var all = nSel > 0 && nSel === pageKeys.length;
    function toggle(k, on) {
      setSelected(on ? selected.concat([k]) : selected.filter(function(x) {
        return x !== k;
      }));
    }
    function toggleAll() {
      setSelected(all ? selected.filter(function(k) {
        return pageKeys.indexOf(k) < 0;
      }) : selected.concat(pageKeys.filter(function(k) {
        return !selSet[k];
      })));
    }
    function canResize(c) {
      return !!props.resizable && c.resizable !== false && c.width != null;
    }
    function clampW(c, w) {
      return Math.round(Math.min(c.maxWidth || 480, Math.max(c.minWidth || 64, w)));
    }
    function setW(c, w, done) {
      var nw = clampW(c, w);
      setWidths(function(prev) {
        var o = Object.assign({}, prev);
        o[c.key] = nw;
        return o;
      });
      if (done && props.onColumnResize) props.onColumnResize(c.key, nw);
    }
    function startResize(c, e) {
      e.preventDefault();
      e.stopPropagation();
      resizing.current = true;
      var x0 = e.clientX, w0 = widthOf(c), last = w0;
      var el = e.currentTarget;
      el.classList.add("is-dragging");
      document.body.style.cursor = "col-resize";
      function move(ev) {
        last = clampW(c, w0 + ev.clientX - x0);
        setW(c, last);
      }
      function up() {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        el.classList.remove("is-dragging");
        document.body.style.cursor = "";
        setTimeout(function() {
          resizing.current = false;
        }, 0);
        if (props.onColumnResize) props.onColumnResize(c.key, last);
      }
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
    }
    function moveCol(key, delta) {
      var c = byKey[key], group = vis.filter(function(x) {
        return isPinned(x) === isPinned(c);
      });
      var gi = group.indexOf(c), target = group[gi + delta];
      if (!target) return false;
      var o = order.slice(), from2 = o.indexOf(key), to2 = o.indexOf(target.key);
      o.splice(from2, 1);
      o.splice(to2, 0, key);
      orderState[1](o);
      return true;
    }
    function dropCol(key, targetKey, after) {
      if (key === targetKey) return;
      var a = byKey[key], b = byKey[targetKey];
      if (isPinned(a) !== isPinned(b)) return;
      var o = order.slice();
      o.splice(o.indexOf(key), 1);
      var to2 = o.indexOf(targetKey) + (after ? 1 : 0);
      o.splice(to2, 0, key);
      orderState[1](o);
    }
    function togglePin(key) {
      pinState[1](pinnedKeys.indexOf(key) >= 0 ? pinnedKeys.filter(function(k) {
        return k !== key;
      }) : pinnedKeys.concat([key]));
    }
    function setHidden(key, hide) {
      if (hide && shown.length <= 1) return;
      hiddenState[1](hide ? hidden.concat([key]) : hidden.filter(function(k) {
        return k !== key;
      }));
    }
    function resetColumns() {
      orderState[1](columns.map(function(c) {
        return c.key;
      }));
      hiddenState[1](columns.filter(function(c) {
        return c.hidden;
      }).map(function(c) {
        return c.key;
      }));
      pinState[1](columns.filter(function(c) {
        return c.pinned;
      }).map(function(c) {
        return c.key;
      }));
      setWidths({});
    }
    function columnMenuItems(c) {
      var group = vis.filter(function(x) {
        return isPinned(x) === isPinned(c);
      }), gi = group.indexOf(c);
      var items = [];
      if (c.sortable) items.push(
        { label: t.sortAsc, icon: "arrow-up", onSelect: function() {
          setSort({ key: c.key, dir: "asc" });
          goPage(1);
        } },
        { label: t.sortDesc, icon: "arrow-down", onSelect: function() {
          setSort({ key: c.key, dir: "desc" });
          goPage(1);
        } },
        { separator: true }
      );
      if (c.width != null) items.push({ label: isPinned(c) ? t.unpin : t.pin, icon: isPinned(c) ? "pin-off" : "pin", onSelect: function() {
        togglePin(c.key);
      } });
      if (reorderable) items.push(
        { label: t.moveLeft, icon: "arrow-left", disabled: gi <= 0, onSelect: function() {
          moveCol(c.key, -1);
        } },
        { label: t.moveRight, icon: "arrow-right", disabled: gi >= group.length - 1, onSelect: function() {
          moveCol(c.key, 1);
        } }
      );
      items.push({ separator: true }, { label: t.hideColumn, icon: "eye-off", disabled: shown.length <= 1, onSelect: function() {
        setHidden(c.key, true);
      } });
      return items;
    }
    function pickerItems() {
      return order.map(function(k) {
        var c = byKey[k], on = hidden.indexOf(k) < 0;
        return { label: c.label || (c.actions ? t.actions : c.key), checked: on, keepOpen: true, disabled: on && shown.length <= 1, onSelect: function() {
          setHidden(k, on);
        } };
      }).concat([{ separator: true }, { label: t.resetColumns, icon: "rotate-ccw", onSelect: resetColumns }]);
    }
    function openMenu(kind, key, anchor, rc) {
      setMenu({ kind, key, anchor, rc });
    }
    function closeMenu(restore) {
      var m = menu;
      setMenu(null);
      if (restore && m) {
        if (m.kind === "col") pending.current = { r: 0, key: m.key, c: m.rc ? m.rc.c : 0 };
        else if (m.anchor) m.anchor.focus();
      }
    }
    function onGridKey(e) {
      var target = e.target;
      if (!gridRef.current || !gridRef.current.contains(target)) return;
      var rc = target.getAttribute && target.getAttribute("data-rc");
      if (!rc) {
        var cell = e.key === "Escape" && target.closest && target.closest("[data-rc]");
        if (cell) {
          e.preventDefault();
          cell.focus();
        }
        return;
      }
      var p = rc.split(":"), r = +p[0], c = +p[1], k = e.key, col = colAt(c);
      var row = r > 0 ? pageRows[r - 1] : null;
      var handled = true;
      if (r === 0 && col && e.altKey && (k === "ArrowLeft" || k === "ArrowRight") && canResize(col)) setW(col, widthOf(col) + (k === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 48 : 16), true);
      else if (r === 0 && col && e.ctrlKey && e.shiftKey && (k === "ArrowLeft" || k === "ArrowRight") && reorderable) {
        if (moveCol(col.key, k === "ArrowLeft" ? -1 : 1)) pending.current = { r: 0, key: col.key, c };
      } else if (r === 0 && col && (e.altKey && k === "ArrowDown" || k === "ContextMenu" || e.shiftKey && k === "F10") && controls) openMenu("col", col.key, target, { r: 0, c });
      else if (k === "ArrowRight") focusCell(r, c + 1);
      else if (k === "ArrowLeft") focusCell(r, c - 1);
      else if (k === "ArrowDown") {
        if (r < nRows) focusCell(r + 1, c);
        else if (pageSize && page < pageCount && goPage(page + 1, { r: 1, c })) activeState[1]({ r: 1, c });
      } else if (k === "ArrowUp") {
        if (r > 1 || r === 1 && !(pageSize && page > 1)) focusCell(r - 1, c);
        else if (r === 1 && goPage(page - 1, { r: pageSize, c })) activeState[1]({ r: pageSize, c });
      } else if (k === "Home") focusCell(e.ctrlKey ? 1 : r, 0);
      else if (k === "End") focusCell(e.ctrlKey ? nRows : r, nCols - 1);
      else if (k === "PageDown") {
        if (pageSize) {
          if (goPage(page + 1, { r: 1, c })) activeState[1]({ r: 1, c });
        } else focusCell(Math.min(nRows, r + visibleRows), c);
      } else if (k === "PageUp") {
        if (pageSize) {
          if (goPage(page - 1, { r: 1, c })) activeState[1]({ r: 1, c });
        } else focusCell(Math.max(1, r - visibleRows), c);
      } else if (k === "F2" && r > 0) {
        var inner = target.querySelector("button, a[href], input, select, textarea");
        if (inner) inner.focus();
        else handled = false;
      } else if (k === " " || k === "Enter") {
        if (r === 0 && !col && selectable && nRows) toggleAll();
        else if (r === 0 && col && col.sortable && nRows > 1) {
          setSort(nextSort(col.key));
          goPage(1);
        } else if (r > 0 && k === " " && selectable) toggle(row[rowKey], !selSet[row[rowKey]]);
        else if (r > 0 && k === "Enter" && target.querySelector("button, a[href], input, select, textarea")) target.querySelector("button, a[href], input, select, textarea").focus();
        else if (r > 0 && k === "Enter" && props.onRowActivate) props.onRowActivate(row);
        else handled = false;
      } else handled = false;
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    var head = [h14("span", { key: "__gl", className: "aura-table__gutter", "aria-hidden": true })];
    if (selectable) head.push(h14("span", {
      key: "__sel",
      role: "columnheader",
      "aria-colindex": 1,
      className: cx("aura-table__sel", nPinned && "is-pinned"),
      tabIndex: tabFor(0, 0),
      "data-rc": "0:0",
      "aria-label": t.selectRows,
      onFocus: function() {
        activeState[1]({ r: 0, c: 0 });
      }
    }, nRows ? h14(Checkbox, {
      checked: all,
      indeterminate: nSel > 0 && !all,
      tabIndex: -1,
      label: all ? t.deselectAllRows : t.selectAllRows,
      onChange: toggleAll
    }) : null));
    vis.forEach(function(c, i2) {
      var ci = i2 + (selectable ? 1 : 0);
      var isSorted = sort && sort.key === c.key;
      var canSort = c.sortable && rows.length > 1 && !loading;
      var ariaSort = isSorted && canSort ? sort.dir === "desc" ? "descending" : "ascending" : canSort ? "none" : void 0;
      var pin = isPinned(c), edge = pin && i2 === nPinned - 1;
      head.push(h14(
        "span",
        {
          key: c.key,
          role: "columnheader",
          "aria-sort": ariaSort,
          "aria-colindex": ci + 1,
          style: cellStyle(c, i2),
          tabIndex: tabFor(0, ci),
          "data-rc": "0:" + ci,
          className: cx(
            "aura-table__th",
            pin && "is-pinned",
            edge && "is-pin-edge",
            drag && drag.over === c.key && (drag.after ? "is-drop-after" : "is-drop-before"),
            drag && drag.key === c.key && "is-dragging"
          ),
          draggable: reorderable && !loading ? true : void 0,
          onFocus: function(e) {
            if (e.target === e.currentTarget) activeState[1]({ r: 0, c: ci });
          },
          onDragStart: function(e) {
            if (resizing.current) {
              e.preventDefault();
              return;
            }
            e.dataTransfer.effectAllowed = "move";
            try {
              e.dataTransfer.setData("text/plain", c.key);
            } catch (x) {
            }
            setDrag({ key: c.key });
          },
          onDragOver: function(e) {
            if (!drag || drag.key === c.key || isPinned(byKey[drag.key]) !== pin) return;
            e.preventDefault();
            var b = e.currentTarget.getBoundingClientRect(), after = e.clientX > b.left + b.width / 2;
            if (drag.over !== c.key || drag.after !== after) setDrag({ key: drag.key, over: c.key, after });
          },
          onDrop: function(e) {
            e.preventDefault();
            if (drag && drag.over) dropCol(drag.key, drag.over, drag.after);
            setDrag(null);
          },
          onDragEnd: function() {
            setDrag(null);
          }
        },
        h14(
          "span",
          { className: "aura-table__th-inner" },
          canSort ? h14(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: cx("aura-table__sort", isSorted && "is-active"),
              onClick: function() {
                setSort(nextSort(c.key));
                goPage(1);
                activeState[1]({ r: 0, c: ci });
              }
            },
            c.label,
            h14(Icon, { name: isSorted ? sort.dir === "desc" ? "arrow-down" : "arrow-up" : "arrow-up-down", size: 12 })
          ) : h14("span", { className: cx("aura-table__th-label", !c.label && "aura-sr-only") }, c.label || (c.actions ? t.actions : c.key)),
          pin ? h14(Icon, { name: "pin", size: 12, className: "aura-table__pin-icon", label: t.pinned }) : null,
          controls ? h14(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: "aura-table__menu-btn",
              "aria-label": t.columnOptions(c.label),
              "aria-haspopup": "menu",
              "aria-expanded": menu && menu.key === c.key ? true : void 0,
              onClick: function(e) {
                e.stopPropagation();
                openMenu("col", c.key, e.currentTarget, { r: 0, c: ci });
              }
            },
            h14(Icon, { name: "ellipsis" })
          ) : null
        ),
        canResize(c) ? h14("span", {
          className: "aura-table__resize",
          role: "separator",
          "aria-orientation": "vertical",
          "aria-hidden": true,
          onPointerDown: function(e) {
            startResize(c, e);
          },
          onClick: function(e) {
            e.stopPropagation();
          },
          onDoubleClick: function() {
            setW(c, c.width, true);
          }
        }) : null
      ));
    });
    head.push(h14("span", { key: "__gr", className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker"), "aria-hidden": true }));
    function rowCells(r, i2, k, isSel) {
      var ri2 = i2 + 1;
      var cells = [h14("span", { key: "__gl", className: "aura-table__gutter", "aria-hidden": true })];
      if (selectable) cells.push(h14("span", {
        key: "__sel",
        role: "gridcell",
        "aria-colindex": 1,
        className: cx("aura-table__sel", nPinned && "is-pinned"),
        tabIndex: tabFor(ri2, 0),
        "data-rc": ri2 + ":0",
        "aria-label": t.selectRow(k),
        onFocus: function(e) {
          if (e.target === e.currentTarget) activeState[1]({ r: ri2, c: 0 });
        }
      }, h14(Checkbox, { checked: isSel, tabIndex: -1, label: t.selectRow(k), onChange: function(on) {
        toggle(k, on);
      } })));
      vis.forEach(function(c, j) {
        var ci = j + (selectable ? 1 : 0), v = r[c.key], pin = isPinned(c);
        cells.push(h14("span", {
          key: c.key,
          role: "gridcell",
          "aria-colindex": ci + 1,
          tabIndex: tabFor(ri2, ci),
          "data-rc": ri2 + ":" + ci,
          className: cx("aura-table__td", c.mono && "aura-table__mono", pin && "is-pinned", pin && j === nPinned - 1 && "is-pin-edge"),
          style: cellStyle(c, j),
          onFocus: function() {
            if (activeState[0].r !== ri2 || activeState[0].c !== ci) activeState[1]({ r: ri2, c: ci });
          }
        }, c.render ? c.render(r) : c.pill ? h14(StatusPill, { tone: c.tones && c.tones[v] }, v) : v));
      });
      cells.push(h14("span", { key: "__gr", className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker"), "aria-hidden": true }));
      return cells;
    }
    var body;
    var rowStyle = { minWidth: rowMinWidth };
    if (loading) {
      var n2 = pageSize || props.skeletonRows || 5;
      var skRows = body = [];
      for (var i = 0; i < n2; i++) {
        var sk = [h14("span", { key: "__gl", className: "aura-table__gutter" })];
        if (selectable) sk.push(h14("span", { key: "__sel", className: cx("aura-table__sel", nPinned && "is-pinned") }, h14("span", { className: "aura-skel aura-skel--box" })));
        vis.forEach(function(c, j) {
          sk.push(h14(
            "span",
            { key: c.key, className: cx("aura-table__td", isPinned(c) && "is-pinned"), style: cellStyle(c, j) },
            h14("span", { className: cx("aura-skel", c.pill && "aura-skel--pill"), style: c.pill ? null : { width: SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length] } })
          ));
        });
        sk.push(h14("span", { key: "__gr", className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker") }));
        skRows.push(h14("div", { key: "sk" + i, className: "aura-table__row aura-table__row--skeleton", "aria-hidden": true, style: rowStyle }, sk));
      }
    } else if (!rows.length) {
      var em = props.empty || {};
      body = h14(
        "div",
        { className: "aura-table__empty", role: "row" },
        h14(
          "div",
          { role: "gridcell" },
          h14("span", { className: "aura-table__empty-icon" }, h14(Icon, { name: em.icon || "inbox", size: "lg" })),
          h14("p", { className: "aura-table__empty-title" }, em.title || t.empty),
          em.description ? h14("p", { className: "aura-table__empty-text" }, em.description) : null,
          em.action ? h14("div", { className: "aura-table__empty-action" }, em.action) : null
        )
      );
    } else {
      var bodyRows = body = [];
      if (virtual && start > 0) bodyRows.push(h14("div", { key: "__top", style: { height: start * ROW_H + "px" }, "aria-hidden": true }));
      for (var ri = start; ri < end; ri++) {
        (function(r, i2) {
          var k = r[rowKey], isSel = !!selSet[k];
          bodyRows.push(h14("div", {
            key: k,
            role: "row",
            "aria-rowindex": first + i2 + 2,
            "aria-selected": selectable ? isSel : void 0,
            className: cx("aura-table__row", isSel && "is-selected", props.onRowActivate && "is-actionable"),
            style: rowStyle,
            onClick: function(e) {
              var el = e.target;
              if (el.closest && el.closest(".aura-check, button, a, input")) return;
              if (props.onRowActivate) props.onRowActivate(r);
            }
          }, rowCells(r, i2, k, isSel)));
        })(pageRows[ri], ri);
      }
      if (virtual && end < pageRows.length) bodyRows.push(h14("div", { key: "__bot", style: { height: (pageRows.length - end) * ROW_H + "px" }, "aria-hidden": true }));
    }
    var foot = null;
    if (pageSize && (rows.length || loading)) {
      var from = rows.length ? first + 1 : 0, to = Math.min(first + pageSize, view.length);
      foot = h14(
        "div",
        { className: "aura-table__foot" },
        h14("span", { "aria-live": "polite" }, loading ? t.loading : t.range(from, to, view.length)),
        h14(
          "span",
          { className: "aura-table__pager" },
          h14("span", null, t.page(page, pageCount)),
          h14(IconButton, { icon: "chevron-left", label: t.prevPage, disabled: loading || page <= 1, onClick: function() {
            goPage(page - 1);
          } }),
          h14(IconButton, { icon: "chevron-right", label: t.nextPage, disabled: loading || page >= pageCount, onClick: function() {
            goPage(page + 1);
          } })
        )
      );
    } else if (height && rows.length && !loading) {
      foot = h14(
        "div",
        { className: "aura-table__foot" },
        h14("span", null, t.rowCount(view.length)),
        selectable && selected.length ? h14("span", null, t.selectedCount(selected.length)) : h14("span", null)
      );
    }
    if (stacked) {
      var titleCol = vis[0], pillCol = vis.filter(function(c) {
        return c.pill && c !== titleCol;
      })[0];
      var actionCols = vis.filter(function(c) {
        return c.actions && c !== titleCol;
      });
      var rest = vis.filter(function(c) {
        return c !== titleCol && c !== pillCol && !c.actions;
      });
      var cardBody;
      if (loading) {
        cardBody = h14("ul", { className: "aura-table__cards", "aria-busy": true }, [0, 1, 2].map(function(i2) {
          return h14(
            "li",
            { key: i2, className: "aura-table__card", "aria-hidden": true },
            h14("span", { className: "aura-skel", style: { width: "50%", height: "14px" } }),
            h14("span", { className: "aura-skel", style: { width: "80%" } }),
            h14("span", { className: "aura-skel", style: { width: "64%" } })
          );
        }));
      } else if (!rows.length) {
        var em2 = props.empty || {};
        cardBody = h14("div", { className: "aura-table__empty" }, h14(
          "div",
          null,
          h14("span", { className: "aura-table__empty-icon" }, h14(Icon, { name: em2.icon || "inbox", size: "lg" })),
          h14("p", { className: "aura-table__empty-title" }, em2.title || t.empty),
          em2.description ? h14("p", { className: "aura-table__empty-text" }, em2.description) : null,
          em2.action ? h14("div", { className: "aura-table__empty-action" }, em2.action) : null
        ));
      } else {
        var cellVal = function(c, r) {
          var v = r[c.key];
          return c.render ? c.render(r) : c.pill ? h14(StatusPill, { tone: c.tones && c.tones[v] }, v) : v;
        };
        cardBody = h14("ul", { className: "aura-table__cards", "aria-label": props.label }, pageRows.map(function(r) {
          var k = r[rowKey], isSel = !!selSet[k];
          return h14(
            "li",
            {
              key: k,
              className: cx("aura-table__card", isSel && "is-selected", props.onRowActivate && "is-actionable"),
              tabIndex: props.onRowActivate ? 0 : void 0,
              onClick: function(e) {
                var el = e.target;
                if (el.closest && el.closest(".aura-check, button, a, input")) return;
                if (props.onRowActivate) props.onRowActivate(r);
              },
              onKeyDown: function(e) {
                if (e.target === e.currentTarget && e.key === "Enter" && props.onRowActivate) props.onRowActivate(r);
              }
            },
            h14(
              "div",
              { className: "aura-table__card-head" },
              selectable ? h14(Checkbox, { checked: isSel, label: t.selectRow(k), onChange: function(on) {
                toggle(k, on);
              } }) : null,
              h14("span", { className: cx("aura-table__card-title", titleCol.mono && "aura-table__mono") }, cellVal(titleCol, r)),
              pillCol ? cellVal(pillCol, r) : null,
              actionCols.map(function(c) {
                return h14("span", { key: c.key, className: "aura-table__card-actions" }, cellVal(c, r));
              })
            ),
            rest.length ? h14("dl", { className: "aura-table__card-fields" }, rest.map(function(c) {
              return h14("div", { key: c.key }, h14("dt", null, c.label), h14("dd", { className: c.mono ? "aura-table__mono" : void 0 }, cellVal(c, r)));
            })) : null
          );
        }));
      }
      return h14(
        "div",
        { ref: wrapMerged, className: cx("aura-table aura-table--stacked", props.className), role: "region", "aria-label": props.label, "aria-busy": loading || void 0 },
        selectable && pageRows.length && !loading ? h14(
          "div",
          { className: "aura-table__stack-bar" },
          h14(Checkbox, { checked: all, indeterminate: nSel > 0 && !all, label: all ? t.deselectAllRows : t.selectAllRows, onChange: toggleAll }),
          h14("span", null, nSel ? t.selectedCount(nSel) : t.selectAll)
        ) : null,
        cardBody,
        foot
      );
    }
    var scrollStyle = { scrollPaddingLeft: "calc(var(--aura-space-6)" + selW + " + " + acc + "px)", scrollPaddingTop: ROW_H + "px" };
    if (height) scrollStyle.height = height + "px";
    return h14(
      "div",
      { ref: wrapMerged, className: cx("aura-table", scrolledX[0] && "is-scrolled-x", props.className) },
      h14(
        "div",
        {
          ref: function(el) {
            scrollRef.current = el;
            gridRef.current = el;
          },
          className: "aura-table__scroll",
          style: scrollStyle,
          role: "grid",
          "aria-label": props.label,
          "aria-busy": loading || void 0,
          "aria-rowcount": loading ? -1 : view.length + 1,
          "aria-colcount": nCols,
          "aria-multiselectable": selectable || void 0,
          onKeyDown: onGridKey,
          onScroll: function(e) {
            var t2 = e.currentTarget;
            if (virtual && Math.abs(t2.scrollTop - scrollTop) >= ROW_H / 2) setScrollTop(t2.scrollTop);
            else if (virtual && (t2.scrollTop === 0 || t2.scrollTop + t2.clientHeight >= t2.scrollHeight - 1)) setScrollTop(t2.scrollTop);
            var sx = t2.scrollLeft > 0;
            if (sx !== scrolledX[0]) scrolledX[1](sx);
          }
        },
        h14("div", { className: "aura-table__head", role: "row", "aria-rowindex": 1, style: rowStyle }, head),
        body
      ),
      loading ? h14("span", { className: "aura-sr-only", role: "status" }, t.loadingRows) : null,
      controls ? h14(
        "div",
        { className: "aura-table__picker" },
        h14(IconButton, {
          icon: "columns-3",
          label: t.showHideColumns,
          "aria-haspopup": "menu",
          onClick: function(e) {
            openMenu("picker", null, e.currentTarget);
          }
        })
      ) : null,
      foot,
      menu ? h14(Menu, {
        anchor: menu.anchor,
        onClose: closeMenu,
        label: menu.kind === "picker" ? t.columns : t.column(byKey[menu.key] && byKey[menu.key].label),
        items: menu.kind === "picker" ? pickerItems() : byKey[menu.key] ? columnMenuItems(byKey[menu.key]) : []
      }) : null
    );
  });

  // src/layout.tsx
  var React17 = __toESM(require_react(), 1);
  var h15 = React17.createElement;
  var Card = React17.forwardRef(function Card2(props, ref) {
    var creative = props.variant === "creative";
    return h15(
      props.as || "section",
      {
        ref,
        className: cx("aura-card", creative && "aura-card--creative", props.interactive && "is-interactive", props.className),
        "aria-labelledby": props.title && props.titleId ? props.titleId : void 0
      },
      props.title || props.actions ? h15(
        "div",
        { className: "aura-card__head" },
        h15(
          "div",
          { className: "aura-card__heading" },
          props.title ? h15("h" + (props.headingLevel || 3), { className: "aura-card__title", id: props.titleId }, props.title) : null,
          props.description ? h15("p", { className: "aura-card__desc" }, props.description) : null
        ),
        props.actions ? h15("div", { className: "aura-card__actions" }, props.actions) : null
      ) : null,
      props.children ? h15("div", { className: "aura-card__body" }, props.children) : null,
      props.footer ? h15("div", { className: "aura-card__foot" }, props.footer) : null
    );
  });
  var Tabs = React17.forwardRef(function Tabs2(props, ref) {
    var items = props.tabs || [], base = uid();
    var st = useMaybeControlled(props.value, props.defaultValue || items[0] && items[0].id, props.onChange);
    var refs = React17.useRef({});
    var current2 = items.filter(function(t) {
      return t.id === st[0];
    })[0] || items[0];
    function go(i) {
      var enabled = items.filter(function(t2) {
        return !t2.disabled;
      });
      var t = enabled[(i + enabled.length) % enabled.length];
      st[1](t.id);
      if (refs.current[t.id]) refs.current[t.id].focus();
    }
    return h15(
      "div",
      { ref, className: cx("aura-tabs", props.className) },
      h15(
        "div",
        {
          role: "tablist",
          "aria-label": props.label,
          className: "aura-tabs__list",
          onKeyDown: function(e) {
            var enabled = items.filter(function(t) {
              return !t.disabled;
            }), i = enabled.indexOf(current2);
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(i + 1);
            } else if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(i - 1);
            } else if (e.key === "Home") {
              e.preventDefault();
              go(0);
            } else if (e.key === "End") {
              e.preventDefault();
              go(enabled.length - 1);
            }
          }
        },
        items.map(function(t) {
          var on = current2 && t.id === current2.id;
          return h15(
            "button",
            {
              key: t.id,
              type: "button",
              role: "tab",
              id: base + "-tab-" + t.id,
              "aria-selected": on,
              "aria-controls": base + "-panel-" + t.id,
              tabIndex: on ? 0 : -1,
              disabled: t.disabled,
              ref: function(el) {
                refs.current[t.id] = el;
              },
              className: cx("aura-tab", on && "is-active"),
              onClick: function() {
                st[1](t.id);
              }
            },
            t.icon ? h15(Icon, { name: t.icon }) : null,
            t.label,
            t.count != null ? h15("span", { className: "aura-tab__count" }, t.count) : null
          );
        })
      ),
      current2 && current2.content !== void 0 ? h15("div", {
        role: "tabpanel",
        id: base + "-panel-" + current2.id,
        "aria-labelledby": base + "-tab-" + current2.id,
        tabIndex: 0,
        className: "aura-tabs__panel"
      }, current2.content) : null
    );
  });
  var SideNav = React17.forwardRef(function SideNav2(props, ref) {
    var t = useStrings();
    var st = useMaybeControlled(props.value, props.defaultValue, props.onChange);
    function item(it) {
      var on = st[0] === it.id;
      var inner = [
        it.icon ? h15(Icon, { key: "i", name: it.icon }) : null,
        h15("span", { key: "l", className: "aura-nav__label" }, it.label),
        it.count != null ? h15("span", { key: "c", className: "aura-nav__count" }, it.count) : null
      ];
      var common = {
        className: cx("aura-nav__item", on && "is-active"),
        "aria-current": on ? "page" : void 0,
        onClick: function(e) {
          if (!it.href) e.preventDefault();
          st[1](it.id);
        }
      };
      return h15("li", { key: it.id }, it.href ? h15("a", Object.assign({ href: it.href }, common), inner) : h15("button", Object.assign({ type: "button" }, common), inner));
    }
    return h15(
      "nav",
      { ref, className: cx("aura-nav", props.className), "aria-label": props.label || t.mainNav },
      props.header ? h15("div", { className: "aura-nav__header" }, props.header) : null,
      h15(
        "div",
        { className: "aura-nav__scroll" },
        (props.sections || [{ items: props.items || [] }]).map(function(s, i) {
          return h15(
            "div",
            { key: i, className: "aura-nav__section" },
            s.title ? h15("p", { className: "aura-nav__title" }, s.title) : null,
            h15("ul", { className: "aura-nav__list" }, s.items.map(item))
          );
        })
      ),
      props.footer ? h15("div", { className: "aura-nav__footer" }, props.footer) : null
    );
  });
  var Breadcrumb = React17.forwardRef(function Breadcrumb2(props, ref) {
    var t = useStrings();
    var items = props.items || [];
    return h15(
      "nav",
      { ref, "aria-label": props.label || t.breadcrumb, className: cx("aura-crumbs", props.className) },
      h15("ol", null, items.map(function(it, i) {
        var last = i === items.length - 1;
        return h15(
          "li",
          { key: i },
          last ? h15("span", { "aria-current": "page", className: "aura-crumbs__current" }, it.label) : it.href ? h15("a", { href: it.href, onClick: it.onClick }, it.label) : h15("button", { type: "button", onClick: it.onClick }, it.label),
          last ? null : h15(Icon, { name: "chevron-right", size: 12, className: "aura-crumbs__sep" })
        );
      }))
    );
  });
  var AVATAR_TONES = ["progress", "ready", "neutral", "warning"];
  function initials(name) {
    var parts = String(name || "?").trim().split(/\s+/);
    return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "")).toUpperCase();
  }
  var Avatar = React17.forwardRef(function Avatar2(props, ref) {
    var size = props.size || "md", errState = React17.useState(false);
    var hash = 0;
    String(props.name || "").split("").forEach(function(ch) {
      hash = hash * 31 + ch.charCodeAt(0) >>> 0;
    });
    var tone2 = AVATAR_TONES[hash % AVATAR_TONES.length];
    return h15(
      "span",
      {
        ref,
        className: cx("aura-avatar", "aura-avatar--" + size, "aura-avatar--" + tone2, props.className),
        role: "img",
        "aria-label": props.name + (props.status ? ", " + props.status : "")
      },
      props.src && !errState[0] ? h15("img", { src: props.src, alt: "", onError: function() {
        errState[1](true);
      } }) : h15("span", { "aria-hidden": true }, initials(props.name)),
      props.status === "online" ? h15("span", { className: "aura-avatar__status", "aria-hidden": true }) : null
    );
  });

  // src/layout2.tsx
  var React18 = __toESM(require_react(), 1);
  var h16 = React18.createElement;
  var breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };
  var ORDER = ["base", "sm", "md", "lg", "xl"];
  function useBreakpoint() {
    return React18.useSyncExternalStore(subscribe, current, function() {
      return "lg";
    });
  }
  function current() {
    var w = window.innerWidth, bp = "base";
    ORDER.slice(1).forEach(function(k) {
      if (w >= breakpoints[k]) bp = k;
    });
    return bp;
  }
  function subscribe(cb) {
    window.addEventListener("resize", cb);
    return function() {
      window.removeEventListener("resize", cb);
    };
  }
  function useResponsive(value) {
    var bp = useBreakpoint();
    if (value == null || typeof value !== "object") return value;
    var map = value;
    for (var i = ORDER.indexOf(bp); i >= 0; i--) if (map[ORDER[i]] !== void 0) return map[ORDER[i]];
    return void 0;
  }
  function respVars(prefix, value, map) {
    var style = {};
    if (value == null) return style;
    if (typeof value !== "object") value = { base: value };
    var byBp = value, cur;
    ORDER.forEach(function(k) {
      if (byBp[k] !== void 0) cur = map ? map(byBp[k]) : byBp[k];
      if (cur !== void 0) style["--" + prefix + "-" + k] = cur;
    });
    return style;
  }
  var space = function(v) {
    return typeof v === "number" ? "var(--aura-space-" + v + ")" : v;
  };
  var Stack = React18.forwardRef(function Stack2(props, ref) {
    var style = Object.assign(
      {},
      respVars("aura-stack-dir", props.direction || "column"),
      respVars("aura-stack-gap", props.gap == null ? 4 : props.gap, space),
      respVars("aura-stack-align", props.align || "stretch"),
      props.justify ? { justifyContent: props.justify } : null,
      props.wrap ? { flexWrap: "wrap" } : null,
      props.style
    );
    return h16(props.as || "div", { ref, className: cx("aura-stack", props.className), style }, props.children);
  });
  var Grid = React18.forwardRef(function Grid2(props, ref) {
    var style = Object.assign(
      {},
      respVars("aura-grid-gap", props.gap == null ? 6 : props.gap, space),
      props.minItemWidth ? { gridTemplateColumns: "repeat(auto-fill, minmax(min(" + props.minItemWidth + "px, 100%), 1fr))" } : respVars("aura-grid-cols", props.columns || 1),
      props.style
    );
    return h16(props.as || "div", { ref, className: cx("aura-grid-layout", props.minItemWidth && "is-auto", props.className), style }, props.children);
  });
  var Container = React18.forwardRef(function Container2(props, ref) {
    return h16(props.as || "div", { ref, className: cx("aura-container", props.size === "narrow" && "is-narrow", props.className), style: props.style }, props.children);
  });
  var AppShell = React18.forwardRef(function AppShell2(props, ref) {
    var t = useStrings();
    var bp = useBreakpoint();
    var compact = bp === "base" || bp === "sm" || bp === "md";
    var st = React18.useState(false), open = st[0], setOpen = st[1];
    React18.useEffect(function() {
      if (!compact) setOpen(false);
    }, [compact]);
    var navEl = props.nav;
    var nav = props.nav && React18.isValidElement(props.nav) && compact ? React18.cloneElement(navEl, { onChange: function(id) {
      if (navEl.props.onChange) navEl.props.onChange(id);
      setOpen(false);
    }, className: cx(navEl.props.className, "is-in-drawer") }) : props.nav;
    return h16(
      "div",
      { ref, className: cx("aura-shell", compact && "is-compact", props.className) },
      !compact ? h16("div", { className: "aura-shell__nav" }, nav) : null,
      compact ? h16(Drawer, { open, onClose: function() {
        setOpen(false);
      }, side: "left", size: "nav", "aria-label": props.navLabel || t.navigation, dismissible: true }, nav) : null,
      h16(
        "div",
        { className: "aura-shell__main" },
        props.header || compact ? h16(
          "header",
          { className: "aura-shell__bar" },
          compact ? h16(IconButton, { icon: "menu", label: props.menuLabel || t.openNav, size: "md", onClick: function() {
            setOpen(true);
          }, "aria-expanded": open }) : null,
          h16("div", { className: "aura-shell__bar-content" }, props.header)
        ) : null,
        h16("main", { className: "aura-shell__content", id: props.mainId || "main" }, props.children)
      )
    );
  });

  // src/Surface.tsx
  var React19 = __toESM(require_react(), 1);
  var h17 = React19.createElement;
  var Surface = React19.forwardRef(function Surface2(props, ref) {
    var t = props.texture || "mesh";
    var rest = omit(props, ["texture", "className", "children", "as"]);
    return h17(props.as || "div", Object.assign({}, rest, {
      ref,
      /* Textures stay light in every theme, so everything on them uses the light tokens. */
      "data-theme": "light",
      className: cx(
        "aura-surface",
        (t === "mesh" || t === "mesh-grain") && "aura-mesh",
        (t === "grain" || t === "mesh-grain") && "aura-grain",
        props.className
      )
    }), props.children);
  });

  // src/Stat.tsx
  var React20 = __toESM(require_react(), 1);
  var h18 = React20.createElement;
  var Stat = React20.forwardRef(function Stat2(props, ref) {
    var ch = props.change;
    var dir = ch && (ch.direction || "flat");
    var tone2 = ch && (ch.tone || (dir === "up" ? "positive" : dir === "down" ? "negative" : "neutral"));
    var Tag3 = props.href ? "a" : props.onClick ? "button" : "div";
    var interactive = Tag3 !== "div";
    return h18(
      Tag3,
      {
        ref,
        className: cx("aura-stat", interactive && "is-interactive", props.loading && "is-loading", props.className),
        href: props.href,
        onClick: props.onClick,
        type: Tag3 === "button" ? "button" : void 0,
        "aria-busy": props.loading || void 0
      },
      h18(
        "span",
        { className: "aura-stat__head" },
        h18("span", { className: "aura-stat__label" }, props.label),
        props.icon ? h18("span", { className: "aura-stat__icon" }, h18(Icon, { name: props.icon })) : null
      ),
      props.loading ? h18("span", { className: "aura-stat__value" }, h18("span", { className: "aura-skel aura-stat__skel" })) : h18("span", { className: "aura-stat__value" }, props.value, props.unit ? h18("span", { className: "aura-stat__unit" }, props.unit) : null),
      ch && !props.loading || props.caption ? h18(
        "span",
        { className: "aura-stat__foot" },
        ch && !props.loading ? h18(
          "span",
          { className: cx("aura-stat__change", "is-" + tone2) },
          h18(Icon, { name: dir === "up" ? "trending-up" : dir === "down" ? "trending-down" : "minus", size: 14 }),
          h18("span", null, ch.value)
        ) : null,
        ch && ch.label && !props.loading ? h18("span", { className: "aura-stat__caption" }, ch.label) : null,
        props.caption ? h18("span", { className: "aura-stat__caption" }, props.caption) : null
      ) : null
    );
  });

  // src/TimePicker.tsx
  var React21 = __toESM(require_react(), 1);
  var import_react_dom6 = __toESM(require_react_dom(), 1);
  var h19 = React21.createElement;
  function pad2(n2) {
    return (n2 < 10 ? "0" : "") + n2;
  }
  function toMin(t) {
    var m = /^(\d{2}):(\d{2})$/.exec(t || "");
    return m ? +m[1] * 60 + +m[2] : null;
  }
  function fromMin(n2) {
    return pad2(Math.floor(n2 / 60)) + ":" + pad2(n2 % 60);
  }
  function parseTime(text) {
    var s = String(text || "").trim().toLowerCase().replace(/\s*(น\.?|นาฬิกา)$/, "").trim();
    var pm = /\s*(pm|p\.m\.)$/.test(s), am = /\s*(am|a\.m\.)$/.test(s);
    s = s.replace(/\s*(am|pm|a\.m\.|p\.m\.)$/, "");
    var m = /^(\d{1,2})(?:[:.](\d{2}))?$/.exec(s) || /^(\d{1,2})(\d{2})$/.exec(s);
    if (!m) return null;
    var hh = +m[1], mm = m[2] ? +m[2] : 0;
    if (pm && hh < 12) hh += 12;
    if (am && hh === 12) hh = 0;
    if (hh > 23 || mm > 59) return null;
    return pad2(hh) + ":" + pad2(mm);
  }
  var TimePicker = React21.forwardRef(function TimePicker2(props, ref) {
    var t = useStrings();
    var auto = uid(), id = props.id || auto, listId = id + "-list";
    var st = useMaybeControlled(props.value, props.defaultValue == null ? null : props.defaultValue, props.onChange);
    var value = st[0];
    var step = props.step || 30, lo = toMin(props.min) != null ? toMin(props.min) : 0, hi = toMin(props.max) != null ? toMin(props.max) : 24 * 60 - 1;
    var slots = React21.useMemo(function() {
      var out = [];
      for (var m = lo; m <= hi; m += step) out.push(fromMin(m));
      return out;
    }, [lo, hi, step]);
    function blocked(v) {
      var n2 = toMin(v);
      return n2 == null || n2 < lo || n2 > hi || props.isTimeDisabled && props.isTimeDisabled(v);
    }
    var openState = React21.useState(false), open = openState[0], setOpen = openState[1];
    var editState = React21.useState(null), editing = editState[0], setEditing = editState[1];
    var aState = React21.useState(0), active = aState[0], setActive = aState[1];
    var errState = React21.useState(null);
    var pos = React21.useState(null);
    var boxRef = React21.useRef(null), inputRef = React21.useRef(null), listRef = React21.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    var mounted = useMounted();
    function nearest(v) {
      var n2 = toMin(v);
      if (n2 == null) return 0;
      var best = 0;
      slots.forEach(function(s, i) {
        if (Math.abs(toMin(s) - n2) < Math.abs(toMin(slots[best]) - n2)) best = i;
      });
      return best;
    }
    function place() {
      if (!boxRef.current) return;
      var r = boxRef.current.getBoundingClientRect(), below = window.innerHeight - r.bottom - 8, up = below < 200 && r.top > below;
      pos[1]({ left: r.left, width: Math.max(r.width, 160), top: up ? void 0 : r.bottom + 4, bottom: up ? window.innerHeight - r.top + 4 : void 0, maxHeight: Math.min(280, (up ? r.top : below) - 8) });
    }
    useIsoLayoutEffect(function() {
      if (open) place();
    }, [open]);
    React21.useEffect(function() {
      if (!open) return;
      function outside(e) {
        if (boxRef.current && boxRef.current.contains(e.target) || listRef.current && listRef.current.contains(e.target)) return;
        setOpen(false);
      }
      function onScroll(e) {
        if (!listRef.current || !listRef.current.contains(e.target)) place();
      }
      document.addEventListener("pointerdown", outside, true);
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", place);
      return function() {
        document.removeEventListener("pointerdown", outside, true);
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", place);
      };
    }, [open]);
    React21.useEffect(function() {
      if (!open || !listRef.current) return;
      var el = listRef.current.querySelector('[data-idx="' + active + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
    }, [active, open]);
    function show() {
      if (open || props.disabled || props.readOnly) return;
      setActive(nearest(value || props.suggest || fromMin(lo)));
      setOpen(true);
    }
    function commit(v) {
      if (v == null) {
        errState[1](null);
        st[1](null);
        return true;
      }
      if (blocked(v)) {
        errState[1](t.timeOutOfRange(fromMin(lo), fromMin(hi)));
        return false;
      }
      errState[1](null);
      st[1](v);
      return true;
    }
    function choose(i) {
      var v = slots[i];
      if (!v || blocked(v)) return;
      commit(v);
      setEditing(null);
      setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    function commitTyped() {
      if (editing == null) return;
      var txt = editing.trim();
      if (!txt) commit(null);
      else {
        var v = parseTime(txt);
        if (v) commit(v);
        else errState[1](t.timeInvalid);
      }
      setEditing(null);
    }
    function move(d) {
      var i = active;
      for (var k = 0; k < slots.length; k++) {
        i = Math.min(slots.length - 1, Math.max(0, i + d));
        if (!blocked(slots[i])) break;
      }
      setActive(i);
    }
    function onKeyDown(e) {
      var k = e.key;
      if (k === "ArrowDown") {
        e.preventDefault();
        if (!open) show();
        else move(1);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        if (!open) show();
        else move(-1);
      } else if (k === "Home" && open) {
        e.preventDefault();
        setActive(0);
      } else if (k === "End" && open) {
        e.preventDefault();
        setActive(slots.length - 1);
      } else if (k === "PageDown" && open) {
        e.preventDefault();
        move(Math.max(1, Math.round(60 / step)));
      } else if (k === "PageUp" && open) {
        e.preventDefault();
        move(-Math.max(1, Math.round(60 / step)));
      } else if (k === "Enter") {
        if (editing != null) {
          e.preventDefault();
          commitTyped();
          setOpen(false);
        } else if (open) {
          e.preventDefault();
          choose(active);
        }
      } else if (k === "Escape") {
        if (open) {
          e.preventDefault();
          e.stopPropagation();
          setOpen(false);
          setEditing(null);
        }
      } else if (k === "Tab") {
        if (open) setOpen(false);
      }
    }
    var error = errState[0] || props.error;
    var list = open && mounted && pos[0] ? (0, import_react_dom6.createPortal)(
      h19(
        "div",
        { ref: listRef, className: "aura-combo__popover aura-time__popover", style: pos[0] },
        h19(
          "ul",
          { id: listId, role: "listbox", "aria-label": props.label, className: "aura-combo__list" },
          slots.map(function(s, i) {
            var dis = blocked(s), sel = s === value;
            return h19(
              "li",
              {
                key: s,
                id: id + "-opt-" + i,
                role: "option",
                "data-idx": i,
                "aria-selected": sel,
                "aria-disabled": dis || void 0,
                className: cx("aura-combo__option aura-time__option", i === active && "is-active", sel && "is-selected", dis && "is-disabled"),
                onPointerDown: function(e) {
                  e.preventDefault();
                },
                onClick: function() {
                  choose(i);
                },
                onPointerMove: function() {
                  if (active !== i) setActive(i);
                }
              },
              h19("span", { className: "aura-combo__label" }, s),
              sel ? h19(Icon, { name: "check", className: "aura-combo__check" }) : null
            );
          })
        )
      ),
      document.body
    ) : null;
    return h19(
      Field,
      { id, label: props.label, hint: props.hint, error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h19(
        "div",
        { ref: boxRef, className: cx("aura-input aura-combo aura-time has-icon", open && "is-open") },
        h19(Icon, { name: "clock", className: "aura-input__icon" }),
        h19("input", {
          ref: inputMerged,
          id,
          type: "text",
          role: "combobox",
          inputMode: "numeric",
          autoComplete: "off",
          className: "aura-input__control",
          "aria-expanded": open,
          "aria-controls": listId,
          "aria-autocomplete": "none",
          "aria-activedescendant": open && editing == null ? id + "-opt-" + active : void 0,
          "aria-invalid": error ? true : void 0,
          "aria-describedby": error ? id + "-error" : props.hint ? id + "-hint" : void 0,
          placeholder: props.placeholder || t.timePlaceholder,
          disabled: props.disabled,
          readOnly: props.readOnly,
          required: props.required,
          name: props.name,
          value: editing != null ? editing : value || "",
          onChange: function(e) {
            setEditing(e.target.value);
            var v = parseTime(e.target.value);
            if (v) {
              if (!open) show();
              setActive(nearest(v));
            }
          },
          onClick: show,
          onKeyDown,
          onBlur: function() {
            setTimeout(function() {
              if (listRef.current && listRef.current.contains(document.activeElement)) return;
              commitTyped();
              setOpen(false);
            }, 0);
          }
        }),
        props.clearable !== false && value != null && !props.disabled ? h19("button", {
          type: "button",
          className: "aura-combo__clear",
          "aria-label": t.clear(props.label),
          tabIndex: -1,
          onClick: function() {
            commit(null);
            setEditing(null);
            if (inputRef.current) inputRef.current.focus();
          }
        }, h19(Icon, { name: "x" })) : null,
        h19(
          "button",
          {
            type: "button",
            tabIndex: -1,
            "aria-hidden": true,
            className: "aura-combo__toggle",
            onPointerDown: function(e) {
              e.preventDefault();
            },
            onClick: function() {
              if (open) setOpen(false);
              else {
                show();
                inputRef.current && inputRef.current.focus();
              }
            }
          },
          h19(Icon, { name: "chevron-down" })
        )
      ),
      list
    );
  });

  // src/FileUpload.tsx
  var React22 = __toESM(require_react(), 1);
  var h20 = React22.createElement;
  function formatBytes(n2) {
    if (n2 == null) return "";
    if (n2 < 1024) return n2 + " B";
    var u = ["KB", "MB", "GB"], i = -1;
    do {
      n2 /= 1024;
      i++;
    } while (n2 >= 1024 && i < u.length - 1);
    return (n2 >= 10 || Math.round(n2) === n2 ? Math.round(n2) : n2.toFixed(1)) + " " + u[i];
  }
  function matches(file, accept) {
    if (!accept) return true;
    var name = (file.name || "").toLowerCase(), type = (file.type || "").toLowerCase();
    return accept.split(",").some(function(a) {
      a = a.trim().toLowerCase();
      if (!a) return false;
      if (a[0] === ".") return name.slice(-a.length) === a;
      if (a.slice(-2) === "/*") return type.indexOf(a.slice(0, -1)) === 0;
      return type === a;
    });
  }
  function describeAccept(accept, t) {
    if (!accept) return "";
    return accept.split(",").map(function(a) {
      a = a.trim();
      if (a === "image/*") return t.images;
      if (a === "application/pdf") return "PDF";
      return a.replace(/^\./, "").toUpperCase();
    }).filter(function(x, i, arr) {
      return arr.indexOf(x) === i;
    }).join(", ");
  }
  var seq = 0;
  var FileUpload = React22.forwardRef(function FileUpload2(props, ref) {
    var t = useStrings();
    var auto = uid(), id = props.id || auto;
    var st = useMaybeControlled(props.value, props.defaultValue || [], props.onChange);
    var items = st[0] || [];
    var dragState = React22.useState(false), over = dragState[0];
    var inputRef = React22.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    var urls = React22.useRef({});
    var maxFiles = props.multiple ? props.maxFiles : 1;
    var note = t.accepts(describeAccept(props.accept, t), props.maxSize ? formatBytes(props.maxSize) : "");
    React22.useEffect(function() {
      return function() {
        Object.keys(urls.current).forEach(function(k) {
          URL.revokeObjectURL(urls.current[k]);
        });
      };
    }, []);
    function thumb(it) {
      if (!it.file || !/^image\//.test(it.type || "") || typeof URL === "undefined" || !URL.createObjectURL) return null;
      if (!urls.current[it.id]) urls.current[it.id] = URL.createObjectURL(it.file);
      return urls.current[it.id];
    }
    function add(list) {
      var files = Array.prototype.slice.call(list || []);
      if (!files.length || props.disabled) return;
      var keep = props.multiple ? items.slice() : [];
      var room = maxFiles ? maxFiles - keep.filter(function(i) {
        return !i.error;
      }).length : Infinity;
      files.forEach(function(f) {
        var err = null;
        if (!matches(f, props.accept)) err = t.fileWrongType;
        else if (props.maxSize && f.size > props.maxSize) err = t.fileTooBig(formatBytes(props.maxSize));
        else if (room <= 0) err = t.tooManyFiles(maxFiles);
        else room--;
        keep.push({ id: "f" + ++seq, file: f, name: f.name, size: f.size, type: f.type, status: err ? "error" : "ready", error: err || void 0 });
      });
      st[1](keep);
    }
    function remove(it) {
      if (urls.current[it.id]) {
        URL.revokeObjectURL(urls.current[it.id]);
        delete urls.current[it.id];
      }
      st[1](items.filter(function(x) {
        return x.id !== it.id;
      }));
      if (props.onRemove) props.onRemove(it);
      if (inputRef.current) inputRef.current.focus();
    }
    var error = props.error;
    return h20(
      Field,
      { id, label: props.label, hint: props.hint, error, required: props.required, optional: props.optional, disabled: props.disabled, className: props.className },
      h20(
        "div",
        {
          className: cx("aura-upload", over && "is-over", props.disabled && "is-disabled", error && "is-invalid"),
          onClick: function(e) {
            if (!props.disabled && e.target !== inputRef.current && inputRef.current) inputRef.current.click();
          },
          onDragOver: function(e) {
            if (props.disabled) return;
            e.preventDefault();
            if (!over) dragState[1](true);
          },
          onDragLeave: function(e) {
            if (!e.currentTarget.contains(e.relatedTarget)) dragState[1](false);
          },
          onDrop: function(e) {
            e.preventDefault();
            dragState[1](false);
            add(e.dataTransfer && e.dataTransfer.files);
          }
        },
        h20(Icon, { name: "cloud-upload", size: "lg", className: "aura-upload__icon" }),
        h20("span", { className: "aura-upload__text" }, t.dropFiles, " "),
        /* The real input: visually hidden, still the labelled, focusable control (keyboard and screen readers use it). */
        h20("input", {
          ref: inputMerged,
          id,
          type: "file",
          className: "aura-upload__input",
          accept: props.accept,
          multiple: !!props.multiple,
          disabled: props.disabled,
          name: props.name,
          required: props.required && !items.some(function(i) {
            return !i.error;
          }),
          "aria-invalid": error ? true : void 0,
          "aria-describedby": [error ? id + "-error" : props.hint ? id + "-hint" : null, note ? id + "-note" : null].filter(Boolean).join(" ") || void 0,
          onChange: function(e) {
            add(e.target.files);
            e.target.value = "";
          }
        }),
        h20("span", { className: "aura-upload__browse", "aria-hidden": true }, props.multiple ? t.browse : t.browseOne),
        note ? h20("span", { className: "aura-upload__note", id: id + "-note" }, note) : null
      ),
      items.length ? h20("ul", { className: "aura-upload__list", "aria-live": "polite" }, items.map(function(it) {
        var src = thumb(it);
        return h20(
          "li",
          { key: it.id, className: cx("aura-upload__item", it.error && "is-error") },
          src ? h20("img", { className: "aura-upload__thumb", src, alt: "" }) : h20("span", { className: "aura-upload__thumb is-icon", "aria-hidden": true }, h20(Icon, { name: /^image\//.test(it.type || "") ? "image" : "file", size: "md" })),
          h20(
            "span",
            { className: "aura-upload__meta" },
            h20("span", { className: "aura-upload__name" }, it.name),
            h20(
              "span",
              { className: "aura-upload__sub" },
              it.error ? h20(React22.Fragment, null, h20(Icon, { name: "circle-alert", size: 12 }), it.error) : it.status === "uploading" ? t.uploading + (it.progress != null ? " " + Math.round(it.progress) + "%" : "") : it.status === "done" ? h20(React22.Fragment, null, h20(Icon, { name: "circle-check", size: 12 }), formatBytes(it.size)) : formatBytes(it.size)
            ),
            it.status === "uploading" ? h20(
              "span",
              { className: "aura-upload__bar", role: "progressbar", "aria-label": it.name, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": it.progress != null ? Math.round(it.progress) : void 0 },
              h20("span", { style: { width: (it.progress || 0) + "%" } })
            ) : null
          ),
          h20(IconButton, { icon: "x", label: t.remove(it.name), onClick: function() {
            remove(it);
          } })
        );
      })) : null
    );
  });

  // src/theme.ts
  function hexToRgb(hex) {
    var h23 = String(hex).trim().replace("#", "");
    if (h23.length === 3) h23 = h23.split("").map(function(c) {
      return c + c;
    }).join("");
    if (!/^[0-9a-f]{6}$/i.test(h23)) throw new Error('createTheme: "' + hex + '" is not a #rgb or #rrggbb colour');
    return [0, 2, 4].map(function(i) {
      return parseInt(h23.slice(i, i + 2), 16) / 255;
    });
  }
  function rgbToHex(rgb) {
    return "#" + rgb.map(function(v) {
      var n2 = Math.round(Math.min(1, Math.max(0, v)) * 255);
      return (n2 < 16 ? "0" : "") + n2.toString(16);
    }).join("");
  }
  function lin(c) {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function delin(c) {
    return c <= 31308e-7 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  }
  function rgbToOklch(rgb) {
    var r = lin(rgb[0]), g = lin(rgb[1]), b = lin(rgb[2]);
    var l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    var m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    var s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    var L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    var A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    var B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.sqrt(A * A + B * B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
  }
  function oklchToRgbRaw(L, C, H) {
    var a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
    var l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    var m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    var s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
    return [
      4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
      -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
      -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s
    ].map(delin);
  }
  function inGamut(rgb) {
    return rgb.every(function(v) {
      return v >= -5e-4 && v <= 1.0005;
    });
  }
  function oklchToHex(L, C, H) {
    var lo = 0, hi = C, rgb = oklchToRgbRaw(L, C, H);
    if (inGamut(rgb)) return rgbToHex(rgb);
    for (var i = 0; i < 24; i++) {
      var mid = (lo + hi) / 2;
      if (inGamut(oklchToRgbRaw(L, mid, H))) lo = mid;
      else hi = mid;
    }
    return rgbToHex(oklchToRgbRaw(L, lo, H));
  }
  function luminance(hex) {
    var c = hexToRgb(hex).map(lin);
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function mix(a, b, t) {
    var x = hexToRgb(a), y = hexToRgb(b);
    return rgbToHex(x.map(function(v, i) {
      return v + (y[i] - v) * t;
    }));
  }
  var STEPS = { 50: [0.975, 0.18], 100: [0.945, 0.3], 200: [0.895, 0.5], 300: [0.81, 0.72], 400: [0.715, 0.9], 500: [0.635, 1], 600: [0.555, 1], 700: [0.49, 0.95], 800: [0.43, 0.85], 900: [0.38, 0.72] };
  function scale(hex) {
    var o = rgbToOklch(hexToRgb(hex)), C = Math.max(o[1], 0.02), out = {};
    Object.keys(STEPS).forEach(function(k) {
      out[k] = oklchToHex(STEPS[k][0], C * STEPS[k][1] / 0.95 * (o[1] < 0.03 ? 0.4 : 1), o[2]);
    });
    return out;
  }
  function fit(hex, grounds, target, dir) {
    var o = rgbToOklch(hexToRgb(hex)), L = o[0], c = hex;
    for (var i = 0; i < 80; i++) {
      if (grounds.every(function(g) {
        return contrast(c, g) >= target;
      })) return c;
      L = Math.min(1, Math.max(0, L + dir * 0.01));
      c = oklchToHex(L, o[1], o[2]);
    }
    return c;
  }
  var ZINC = { 0: "#ffffff", 50: "#fafafa", 100: "#f4f4f5", 800: "#27272a", 900: "#18181b", 950: "#09090b" };
  var INK = "#18181b";
  function createTheme(opts) {
    var o = opts || {};
    if (!o.brand) throw new Error('createTheme: pass { brand: "#rrggbb" }');
    var b = scale(o.brand), s = o.signal ? scale(o.signal) : null;
    var lightGrounds = [ZINC[0], ZINC[50]], darkGrounds = [ZINC[900], ZINC[950]];
    var L = {}, D = {};
    L["fg-accent"] = fit(b[700], lightGrounds, 4.5, -1);
    L["accent-violet"] = L["fg-accent"];
    L["focus-ring"] = fit(b[700], lightGrounds.concat([b[50]]), 3, -1);
    L["bg-selected"] = b[50];
    L["status-progress-bg"] = b[100];
    L["status-progress-fg"] = fit(b[800], [b[100]], 4.5, -1);
    L["alert-info-bg"] = b[50];
    L["alert-info-fg"] = fit(b[800], [b[50]], 4.5, -1);
    L["alert-info-border"] = b[200];
    L["mesh-from"] = b[400];
    D["fg-accent"] = fit(b[300], darkGrounds, 4.5, 1);
    D["accent-violet"] = fit(b[400], darkGrounds, 3, 1);
    D["focus-ring"] = fit(b[400], darkGrounds, 3, 1);
    D["bg-selected"] = mix(ZINC[900], b[500], 0.16);
    D["alert-info-bg"] = D["bg-selected"];
    D["alert-info-fg"] = fit(b[300], [D["alert-info-bg"]], 4.5, 1);
    D["alert-info-border"] = mix(ZINC[900], b[400], 0.4);
    D["status-progress-bg"] = b[100];
    D["status-progress-fg"] = L["status-progress-fg"];
    if (s) {
      L["accent-dot"] = s[200];
      L["accent-lime"] = s[200];
      L["mesh-to"] = s[200];
      D["accent-dot"] = s[200];
      D["accent-lime"] = s[200];
      D["mesh-to"] = s[200];
    }
    var shadowLight = INK, shadowDark = D["accent-violet"];
    if (o.primary === "brand") {
      L["button-primary-bg"] = fit(b[600], [ZINC[0]], 4.5, -1);
      L["button-primary-fg"] = ZINC[0];
      L["button-primary-bg-hover"] = fit(b[700], [ZINC[0]], 4.5, -1);
      D["button-primary-bg"] = fit(b[400], [ZINC[900]], 4.5, 1);
      D["button-primary-fg"] = ZINC[900];
      D["button-primary-bg-hover"] = fit(b[300], [ZINC[900]], 4.5, 1);
    }
    L["shadow-creative"] = "4px 4px 0px " + shadowLight;
    L["shadow-creative-hover"] = "6px 6px 0px " + shadowLight;
    L["card-shadow-creative"] = "8px 8px 0px " + shadowLight;
    D["shadow-creative"] = "4px 4px 0px " + shadowDark;
    D["shadow-creative-hover"] = "6px 6px 0px " + shadowDark;
    D["card-shadow-creative"] = "8px 8px 0px " + shadowDark;
    var checks = [];
    function check(theme, fg, bg, target, fgHex, bgHex) {
      var r = contrast(fgHex, bgHex);
      checks.push({ theme, pair: fg + " on " + bg, ratio: Math.round(r * 100) / 100, target, pass: r >= target - 5e-3 });
    }
    [["bg-surface", ZINC[0]], ["bg-canvas", ZINC[50]], ["bg-selected", L["bg-selected"]]].forEach(function(g) {
      check("light", "fg-accent", g[0], 4.5, L["fg-accent"], g[1]);
      check("light", "focus-ring", g[0], 3, L["focus-ring"], g[1]);
    });
    [["bg-surface", ZINC[900]], ["bg-canvas", ZINC[950]], ["bg-selected", D["bg-selected"]]].forEach(function(g) {
      check("dark", "fg-accent", g[0], 4.5, D["fg-accent"], g[1]);
      check("dark", "focus-ring", g[0], 3, D["focus-ring"], g[1]);
    });
    check("light", "fg-primary", "bg-selected", 4.5, INK, L["bg-selected"]);
    check("dark", "fg-primary", "bg-selected", 4.5, "#ffffff", D["bg-selected"]);
    check("light", "status-progress-fg", "status-progress-bg", 4.5, L["status-progress-fg"], L["status-progress-bg"]);
    check("light", "alert-info-fg", "alert-info-bg", 4.5, L["alert-info-fg"], L["alert-info-bg"]);
    check("dark", "alert-info-fg", "alert-info-bg", 4.5, D["alert-info-fg"], D["alert-info-bg"]);
    if (o.primary === "brand") {
      check("light", "button-primary-fg", "button-primary-bg", 4.5, L["button-primary-fg"], L["button-primary-bg"]);
      check("light", "button-primary-fg", "button-primary-bg-hover", 4.5, L["button-primary-fg"], L["button-primary-bg-hover"]);
      check("dark", "button-primary-fg", "button-primary-bg", 4.5, D["button-primary-fg"], D["button-primary-bg"]);
      check("dark", "button-primary-fg", "button-primary-bg-hover", 4.5, D["button-primary-fg"], D["button-primary-bg-hover"]);
    }
    if (s) check("light", "ink", "accent-lime (signal)", 4.5, INK, s[200]);
    function css(selector) {
      var light = selector ? selector : ':root, [data-theme="light"]';
      var dark = selector ? selector + ".dark, .dark " + selector + ", " + selector + '[data-theme="dark"], [data-theme="dark"] ' + selector : '.dark, [data-theme="dark"]';
      function block(sel, m) {
        return sel + " {\n" + Object.keys(m).map(function(k) {
          return "  --aura-" + k + ": " + m[k] + ";";
        }).join("\n") + "\n}";
      }
      return "/* AURA theme" + (o.name ? ' "' + o.name + '"' : "") + ": brand " + o.brand + (o.signal ? ", signal " + o.signal : "") + (o.primary === "brand" ? ", brand primary buttons" : "") + ". Load after aura.css. Generated by createTheme. */\n" + block(light, L) + "\n" + block(dark, D) + "\n";
    }
    return { name: o.name || null, brand: b, signal: s, light: L, dark: D, checks, ok: checks.every(function(c) {
      return c.pass;
    }), css };
  }

  // src/ThemeStyle.tsx
  var React23 = __toESM(require_react(), 1);
  var h21 = React23.createElement;
  function ThemeStyle(props) {
    var css = React23.useMemo(function() {
      return createTheme({ brand: props.brand, signal: props.signal, primary: props.primary, name: props.name }).css(props.selector);
    }, [props.brand, props.signal, props.primary, props.name, props.selector]);
    return h21("style", { "data-aura-theme": props.name || props.brand, dangerouslySetInnerHTML: { __html: css } });
  }

  // src/extra.tsx
  var React24 = __toESM(require_react(), 1);
  var import_react_dom7 = __toESM(require_react_dom(), 1);
  var h22 = React24.createElement;
  var TONES = ["neutral", "accent", "success", "warning", "danger"];
  function tone(t) {
    return TONES.indexOf(t) >= 0 ? t : "neutral";
  }
  var Badge = React24.forwardRef(function Badge2(props, ref) {
    var rest = omit(props, ["tone", "variant", "icon", "className", "children"]);
    return h22(
      "span",
      Object.assign({}, rest, { ref, className: cx("aura-badge", "aura-badge--" + tone(props.tone), props.variant === "solid" && "is-solid", props.variant === "outline" && "is-outline", props.className) }),
      props.icon ? h22(Icon, { name: props.icon, size: 12 }) : null,
      props.children
    );
  });
  var Tag = React24.forwardRef(function Tag2(props, ref) {
    var t = useStrings();
    var selectable = props.onClick != null || props.selected != null;
    var rest = omit(props, ["onRemove", "selected", "icon", "className", "children", "disabled", "removeLabel"]);
    var inner = [props.icon ? h22(Icon, { key: "i", name: props.icon, size: 14 }) : null, h22("span", { key: "t", className: "aura-tag__text" }, props.children)];
    if (selectable) {
      return h22(
        "button",
        Object.assign({}, rest, {
          ref,
          type: "button",
          "aria-pressed": !!props.selected,
          disabled: props.disabled,
          className: cx("aura-tag is-selectable", props.selected && "is-selected", props.className)
        }),
        props.selected ? h22(Icon, { name: "check", size: 14 }) : inner[0],
        inner[1]
      );
    }
    return h22(
      "span",
      Object.assign({}, rest, { ref, className: cx("aura-tag", props.disabled && "is-disabled", props.className) }),
      inner,
      props.onRemove && !props.disabled ? h22(
        "button",
        { type: "button", className: "aura-tag__remove", "aria-label": props.removeLabel || t.remove(typeof props.children === "string" ? props.children : ""), onClick: props.onRemove },
        h22(Icon, { name: "x", size: 12 })
      ) : null
    );
  });
  var Progress = React24.forwardRef(function Progress2(props, ref) {
    var auto = uid(), id = props.id || auto;
    var max = props.max || 100, det = props.value != null;
    var pct = det ? Math.max(0, Math.min(100, props.value / max * 100)) : 0;
    var shown = props.valueLabel != null ? props.valueLabel : det ? Math.round(pct) + "%" : null;
    return h22(
      "div",
      { ref, className: cx("aura-progress", "aura-progress--" + tone(props.tone || "accent"), props.size === "sm" && "is-sm", props.className) },
      props.label || props.showValue && shown ? h22(
        "div",
        { className: "aura-progress__head" },
        props.label ? h22("span", { className: "aura-progress__label", id: id + "-label" }, props.label) : h22("span"),
        props.showValue && shown ? h22("span", { className: "aura-progress__value" }, shown) : null
      ) : null,
      h22(
        "div",
        {
          className: cx("aura-progress__track", !det && "is-indeterminate"),
          role: "progressbar",
          "aria-labelledby": props.label ? id + "-label" : void 0,
          "aria-label": props.label ? void 0 : props["aria-label"],
          "aria-valuemin": det ? 0 : void 0,
          "aria-valuemax": det ? max : void 0,
          "aria-valuenow": det ? props.value : void 0,
          "aria-valuetext": det && props.valueLabel != null ? String(props.valueLabel) : void 0
        },
        h22("span", { className: "aura-progress__bar", style: det ? { width: pct + "%" } : void 0 })
      ),
      props.hint ? h22("p", { className: "aura-progress__hint" }, props.hint) : null
    );
  });
  var Skeleton = React24.forwardRef(function Skeleton2(props, ref) {
    var v = props.variant || "text";
    if (v === "text" && (props.lines || 1) > 1) {
      var n2 = props.lines, rows = [];
      for (var i = 0; i < n2; i++) rows.push(h22("span", { key: i, className: "aura-skel aura-skel--text", style: { width: i === n2 - 1 ? "60%" : "100%" } }));
      return h22("span", { ref, className: cx("aura-skel-lines", props.className), "aria-hidden": true, style: props.width ? { width: props.width } : void 0 }, rows);
    }
    var style = { width: props.width, height: props.height };
    if (v === "circle") {
      style.width = style.height = props.size || props.width || 40;
    }
    return h22("span", { ref, "aria-hidden": true, className: cx("aura-skel", "aura-skel--" + v, props.className), style });
  });
  var EmptyState = React24.forwardRef(function EmptyState2(props, ref) {
    var HT = "h" + (props.headingLevel || 3);
    return h22(
      "div",
      { ref, className: cx("aura-empty", props.size === "sm" && "is-sm", props.bordered && "is-bordered", props.className) },
      h22("span", { className: "aura-empty__icon", "aria-hidden": true }, h22(Icon, { name: props.icon || "inbox", size: props.size === "sm" ? "md" : "lg" })),
      h22(HT, { className: "aura-empty__title" }, props.title),
      props.description ? h22("p", { className: "aura-empty__text" }, props.description) : null,
      props.action ? h22("div", { className: "aura-empty__action" }, props.action) : null
    );
  });
  function pageList(page, count, sib) {
    var out = [], lo = Math.max(2, page - sib), hi = Math.min(count - 1, page + sib);
    if (page - sib <= 3) {
      lo = 2;
      hi = Math.min(count - 1, Math.max(hi, 3 + 2 * sib));
    }
    if (page + sib >= count - 2) {
      hi = count - 1;
      lo = Math.max(2, Math.min(lo, count - 2 - 2 * sib));
    }
    out.push(1);
    if (lo === 3) out.push(2);
    else if (lo > 3) out.push("\u2026a");
    for (var i = lo; i <= hi; i++) out.push(i);
    if (hi === count - 2) out.push(count - 1);
    else if (hi < count - 2) out.push("\u2026b");
    if (count > 1) out.push(count);
    return out;
  }
  var Pagination = React24.forwardRef(function Pagination2(props, ref) {
    var t = useStrings();
    var count = Math.max(1, props.pageCount || 1);
    var st = useMaybeControlled(props.page, props.defaultPage || 1, props.onChange);
    var page = Math.min(count, Math.max(1, st[0]));
    function go(p) {
      if (p >= 1 && p <= count && p !== page) st[1](p);
    }
    var link = props.getHref;
    function item(p, label, extra) {
      var common = Object.assign({ className: cx("aura-page", p === page && "is-current"), "aria-current": p === page ? "page" : void 0, "aria-label": t.pageN(p) }, extra);
      return link ? h22("a", Object.assign({ href: link(p), onClick: function(e) {
        if (props.onChange) {
          e.preventDefault();
          go(p);
        }
      } }, common), label) : h22("button", Object.assign({ type: "button", onClick: function() {
        go(p);
      } }, common), label);
    }
    return h22(
      "nav",
      { ref, className: cx("aura-pagination", props.className), "aria-label": props.label || t.pagination },
      h22(IconButton, { icon: "chevron-left", label: t.prevPage, disabled: page <= 1, onClick: function() {
        go(page - 1);
      } }),
      h22("ol", { className: "aura-pagination__list" }, pageList(page, count, props.siblingCount == null ? 1 : props.siblingCount).map(function(p) {
        return typeof p === "number" ? h22("li", { key: p }, item(p, p)) : h22("li", { key: p, className: "aura-pagination__gap", "aria-hidden": true }, "\u2026");
      })),
      h22("span", { className: "aura-pagination__compact", "aria-hidden": true }, t.page(page, count)),
      h22(IconButton, { icon: "chevron-right", label: t.nextPage, disabled: page >= count, onClick: function() {
        go(page + 1);
      } })
    );
  });
  var Accordion = React24.forwardRef(function Accordion2(props, ref) {
    var auto = uid(), base = props.id || auto;
    var multiple = props.type === "multiple";
    var st = useMaybeControlled(props.value, props.defaultValue != null ? props.defaultValue : multiple ? [] : null, props.onChange);
    var open = multiple ? st[0] || [] : st[0] ? [st[0]] : [];
    var HT = "h" + (props.headingLevel || 3);
    var items = props.items || [];
    function toggle(id) {
      var isOpen = open.indexOf(id) >= 0;
      if (multiple) st[1](isOpen ? open.filter(function(x) {
        return x !== id;
      }) : open.concat([id]));
      else st[1](isOpen ? props.collapsible === false ? id : null : id);
    }
    function onKey(e) {
      var btns = Array.prototype.slice.call(e.currentTarget.querySelectorAll(":scope > .aura-accordion__item > .aura-accordion__heading > button:not([disabled])"));
      var i = btns.indexOf(document.activeElement), k = e.key, n2 = null;
      if (i < 0) return;
      if (k === "ArrowDown") n2 = btns[(i + 1) % btns.length];
      else if (k === "ArrowUp") n2 = btns[(i - 1 + btns.length) % btns.length];
      else if (k === "Home") n2 = btns[0];
      else if (k === "End") n2 = btns[btns.length - 1];
      if (n2) {
        e.preventDefault();
        n2.focus();
      }
    }
    return h22(
      "div",
      { ref, className: cx("aura-accordion", props.className), onKeyDown: onKey },
      items.map(function(it) {
        var on = open.indexOf(it.id) >= 0, bid = base + "-btn-" + it.id, pid = base + "-panel-" + it.id;
        return h22(
          "div",
          { key: it.id, className: cx("aura-accordion__item", on && "is-open") },
          h22(
            HT,
            { className: "aura-accordion__heading" },
            h22(
              "button",
              { type: "button", id: bid, "aria-expanded": on, "aria-controls": pid, disabled: it.disabled, onClick: function() {
                toggle(it.id);
              } },
              it.icon ? h22(Icon, { name: it.icon, className: "aura-accordion__lead" }) : null,
              h22(
                "span",
                { className: "aura-accordion__title" },
                it.title,
                it.description ? h22("span", { className: "aura-accordion__desc" }, it.description) : null
              ),
              h22(Icon, { name: "chevron-down", className: "aura-accordion__chevron" })
            )
          ),
          h22("div", { id: pid, role: "region", "aria-labelledby": bid, className: "aura-accordion__panel", hidden: !on }, it.content)
        );
      })
    );
  });
  function position(anchor, pop, placement) {
    var r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 6;
    var side = (placement || "bottom-start").split("-")[0], align = (placement || "bottom-start").split("-")[1] || "start";
    if (side === "bottom" && r.bottom + gap + ph > vh - 8 && r.top - gap - ph > 8) side = "top";
    else if (side === "top" && r.top - gap - ph < 8 && r.bottom + gap + ph < vh - 8) side = "bottom";
    var top = side === "top" ? r.top - gap - ph : r.bottom + gap;
    var left = align === "end" ? r.right - pw : align === "center" ? r.left + r.width / 2 - pw / 2 : r.left;
    return { top: Math.max(8, top), left: Math.max(8, Math.min(left, vw - pw - 8)), side };
  }
  var Popover = React24.forwardRef(function Popover2(props, ref) {
    var t = useStrings();
    var auto = uid(), id = props.id || auto;
    var st = useMaybeControlled(props.open, !!props.defaultOpen, props.onOpenChange);
    var open = !!st[0];
    var wrap = React24.useRef(null), pop = React24.useRef(null), popMerged = useMergedRef(ref, pop);
    var pos = React24.useState(null), mounted = useMounted();
    function trigger() {
      return wrap.current && (wrap.current.querySelector('button, [role="button"], a, input') || wrap.current.firstElementChild);
    }
    function close(restore) {
      st[1](false);
      if (restore) {
        var tr = trigger();
        if (tr && tr.focus) tr.focus();
      }
    }
    useIsoLayoutEffect(function() {
      if (!open || !pop.current || !trigger()) return;
      function place() {
        if (pop.current && trigger()) pos[1](position(trigger(), pop.current, props.placement));
      }
      place();
      window.addEventListener("resize", place);
      window.addEventListener("scroll", place, true);
      return function() {
        window.removeEventListener("resize", place);
        window.removeEventListener("scroll", place, true);
      };
    }, [open, mounted, props.placement]);
    React24.useEffect(function() {
      if (!open || !mounted) return;
      if (props.autoFocus !== false && pop.current) {
        var f = pop.current.querySelector("[data-autofocus]") || pop.current.querySelector(FOCUSABLE);
        (f || pop.current).focus();
      }
      function outside(e) {
        if (pop.current && pop.current.contains(e.target)) return;
        if (wrap.current && wrap.current.contains(e.target)) return;
        close(false);
      }
      document.addEventListener("pointerdown", outside, true);
      return function() {
        document.removeEventListener("pointerdown", outside, true);
      };
    }, [open, mounted]);
    var child = React24.Children.only(props.trigger);
    var panel = open && mounted ? (0, import_react_dom7.createPortal)(
      h22(
        "div",
        {
          ref: popMerged,
          id,
          role: "dialog",
          "aria-modal": false,
          "aria-label": props.title ? void 0 : props.label,
          "aria-labelledby": props.title ? id + "-title" : void 0,
          tabIndex: -1,
          className: cx("aura-popover", pos[0] && "is-" + pos[0].side, props.className),
          style: Object.assign({ top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }, props.width ? { width: props.width } : null),
          onKeyDown: function(e) {
            if (e.key === "Escape") {
              e.stopPropagation();
              close(true);
            } else trapTab(e, pop.current);
          }
        },
        props.title ? h22(
          "div",
          { className: "aura-popover__head" },
          h22("p", { className: "aura-popover__title", id: id + "-title" }, props.title),
          h22(IconButton, { icon: "x", label: t.close, onClick: function() {
            close(true);
          } })
        ) : null,
        h22("div", { className: "aura-popover__body" }, typeof props.children === "function" ? props.children({ close: function() {
          close(true);
        } }) : props.children)
      ),
      document.body
    ) : null;
    return h22(
      "span",
      { ref: wrap, className: "aura-popover-anchor" },
      React24.cloneElement(child, { onClick: function(e) {
        if (child.props.onClick) child.props.onClick(e);
        st[1](!open);
      }, "aria-haspopup": "dialog", "aria-expanded": open, "aria-controls": open ? id : void 0 }),
      panel
    );
  });
  return __toCommonJS(index_exports);
})();
