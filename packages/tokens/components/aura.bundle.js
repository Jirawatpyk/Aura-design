/* @ds-bundle: {"format":4,"namespace":"Aura","components":[{"name":"Icon"},{"name":"Button"},{"name":"IconButton"},{"name":"Menu"},{"name":"DropdownMenu"},{"name":"Checkbox"},{"name":"StatusPill"},{"name":"TextField"},{"name":"Textarea"},{"name":"Select"},{"name":"RadioGroup"},{"name":"Switch"},{"name":"Combobox"},{"name":"DatePicker"},{"name":"DateRangePicker"},{"name":"Calendar"},{"name":"Alert"},{"name":"Toaster"},{"name":"PasswordField"},{"name":"FormErrorSummary"},{"name":"FilterBar"},{"name":"Command"},{"name":"Tooltip"},{"name":"Dialog"},{"name":"Drawer"},{"name":"DataTable"},{"name":"Card"},{"name":"Tabs"},{"name":"SideNav"},{"name":"Breadcrumb"},{"name":"Avatar"},{"name":"Stack"},{"name":"Grid"},{"name":"Container"},{"name":"AppShell"},{"name":"ActionBar"},{"name":"BottomNav"},{"name":"Surface"},{"name":"Stat"},{"name":"TimePicker"},{"name":"FileUpload"},{"name":"ColorSchemeScript"},{"name":"ColorSchemeToggle"},{"name":"Badge"},{"name":"Tag"},{"name":"Progress"},{"name":"Skeleton"},{"name":"EmptyState"},{"name":"Pagination"},{"name":"Accordion"},{"name":"Popover"},{"name":"NumberField"},{"name":"Stepper"},{"name":"SegmentedControl"}]} */
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
      "use strict";
      module.exports = window.React;
    }
  });

  // g:react-dom
  var require_react_dom = __commonJS({
    "g:react-dom"(exports, module) {
      "use strict";
      module.exports = window.ReactDOM;
    }
  });

  // src/index.ts
  var index_exports = {};
  __export(index_exports, {
    Accordion: () => Accordion,
    ActionBar: () => ActionBar,
    Alert: () => Alert,
    AppShell: () => AppShell,
    AuraProvider: () => AuraProvider,
    Avatar: () => Avatar,
    Badge: () => Badge,
    BottomNav: () => BottomNav,
    Breadcrumb: () => Breadcrumb,
    Button: () => Button,
    Calendar: () => Calendar,
    Card: () => Card,
    Checkbox: () => Checkbox,
    ColorSchemeScript: () => ColorSchemeScript,
    ColorSchemeToggle: () => ColorSchemeToggle,
    Combobox: () => Combobox,
    Command: () => Command,
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
    FilterBar: () => FilterBar,
    FormErrorSummary: () => FormErrorSummary,
    Grid: () => Grid,
    ICONS: () => ICONS,
    Icon: () => Icon,
    IconButton: () => IconButton,
    Menu: () => Menu,
    NumberField: () => NumberField,
    Pagination: () => Pagination,
    PasswordField: () => PasswordField,
    Popover: () => Popover,
    Progress: () => Progress,
    RadioGroup: () => RadioGroup,
    STRINGS: () => STRINGS,
    SegmentedControl: () => SegmentedControl,
    Select: () => Select,
    SideNav: () => SideNav,
    Skeleton: () => Skeleton,
    Stack: () => Stack,
    Stat: () => Stat,
    StatusPill: () => StatusPill,
    Stepper: () => Stepper,
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
    colorSchemeScript: () => colorSchemeScript,
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
    todayIn: () => todayIn,
    useAuraLocale: () => useAuraLocale,
    useBreakpoint: () => useBreakpoint,
    useColorScheme: () => useColorScheme,
    useDensity: () => useDensity,
    useFormatDate: () => useFormatDate,
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
    const out = {};
    for (const k in src)
      if (Object.prototype.hasOwnProperty.call(src, k) && keys.indexOf(k) < 0)
        out[k] = src[k];
    return out;
  }
  function useMaybeControlled(value, initial, onChange) {
    const s = React.useState(initial);
    const controlled = value !== void 0;
    return [
      controlled ? value : s[0],
      function(next) {
        if (!controlled) s[1](next);
        if (onChange) onChange(next);
      }
    ];
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
    const list = Array.prototype.filter.call(
      container.querySelectorAll(FOCUSABLE),
      function(el) {
        return el.tabIndex >= 0 && el.offsetParent !== null;
      }
    );
    if (!list.length) return;
    const first = list[0], last = list[list.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  function useMergedRef(a, b) {
    return React.useCallback(
      function(node) {
        [a, b].forEach(function(r) {
          if (!r) return;
          if (typeof r === "function") r(node);
          else r.current = node;
        });
      },
      [a, b]
    );
  }
  var TONES = ["neutral", "accent", "success", "warning", "danger"];
  function tone(t) {
    return TONES.indexOf(t) >= 0 ? t : "neutral";
  }

  // src/Icon.tsx
  var h = React2.createElement;
  var ICONS = { "check": [["path", { "d": "M20 6 9 17l-5-5" }]], "x": [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]], "plus": [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]], "minus": [["path", { "d": "M5 12h14" }]], "search": [["path", { "d": "m21 21-4.34-4.34" }], ["circle", { "cx": "11", "cy": "11", "r": "8" }]], "chevron-down": [["path", { "d": "m6 9 6 6 6-6" }]], "chevron-up": [["path", { "d": "m18 15-6-6-6 6" }]], "chevron-left": [["path", { "d": "m15 18-6-6 6-6" }]], "chevron-right": [["path", { "d": "m9 18 6-6-6-6" }]], "arrow-right": [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]], "arrow-up-right": [["path", { "d": "M7 7h10v10" }], ["path", { "d": "M7 17 17 7" }]], "arrow-up-down": [["path", { "d": "m21 16-4 4-4-4" }], ["path", { "d": "M17 20V4" }], ["path", { "d": "m3 8 4-4 4 4" }], ["path", { "d": "M7 4v16" }]], "loader-circle": [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]], "circle-alert": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }], ["line", { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }]], "circle-check": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "m16 9-5.5 5.5L8 12" }]], "info": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 16v-4" }], ["path", { "d": "M12 8h.01" }]], "triangle-alert": [["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { "d": "M12 9v4" }], ["path", { "d": "M12 17h.01" }]], "settings": [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]], "user": [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", { "cx": "12", "cy": "7", "r": "4" }]], "users": [["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }], ["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }], ["circle", { "cx": "9", "cy": "7", "r": "4" }]], "filter": [["path", { "d": "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" }]], "ellipsis": [["circle", { "cx": "12", "cy": "12", "r": "1" }], ["circle", { "cx": "19", "cy": "12", "r": "1" }], ["circle", { "cx": "5", "cy": "12", "r": "1" }]], "external-link": [["path", { "d": "M15 3h6v6" }], ["path", { "d": "M10 14 21 3" }], ["path", { "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]], "copy": [["rect", { "width": "14", "height": "14", "x": "8", "y": "8", "rx": "2", "ry": "2" }], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]], "trash-2": [["path", { "d": "M10 11v6" }], ["path", { "d": "M14 11v6" }], ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { "d": "M3 6h18" }], ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]], "pencil": [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]], "download": [["path", { "d": "M12 15V3" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }], ["path", { "d": "m7 10 5 5 5-5" }]], "upload": [["path", { "d": "M12 3v12" }], ["path", { "d": "m17 8-5-5-5 5" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]], "calendar": [["path", { "d": "M8 2v3" }], ["path", { "d": "M16 2v3" }], ["rect", { "x": "3", "y": "3", "width": "18", "height": "18", "rx": "2" }], ["path", { "d": "M3 9h18" }]], "bell": [["path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }], ["path", { "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" }]], "menu": [["path", { "d": "M4 5h16" }], ["path", { "d": "M4 12h16" }], ["path", { "d": "M4 19h16" }]], "eye": [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]], "log-out": [["path", { "d": "m16 17 5-5-5-5" }], ["path", { "d": "M21 12H9" }], ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]], "circle": [["circle", { "cx": "12", "cy": "12", "r": "10" }]], "circle-dot-dashed": [["path", { "d": "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }], ["path", { "d": "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }], ["path", { "d": "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }], ["path", { "d": "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }], ["path", { "d": "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }], ["path", { "d": "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }], ["path", { "d": "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }], ["path", { "d": "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }], ["circle", { "cx": "12", "cy": "12", "r": "1" }]], "ban": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M4.929 4.929 19.07 19.071" }]], "arrow-up": [["path", { "d": "m5 12 7-7 7 7" }], ["path", { "d": "M12 19V5" }]], "arrow-down": [["path", { "d": "M12 5v14" }], ["path", { "d": "m19 12-7 7-7-7" }]], "inbox": [["polyline", { "points": "22 12 16 12 14 15 10 15 8 12 2 12" }], ["path", { "d": "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }]], "pin": [["path", { "d": "M12 17v5" }], ["path", { "d": "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" }]], "pin-off": [["path", { "d": "M12 17v5" }], ["path", { "d": "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }], ["path", { "d": "m2 2 20 20" }], ["path", { "d": "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" }]], "eye-off": [["path", { "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }], ["path", { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }], ["path", { "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }], ["path", { "d": "m2 2 20 20" }]], "columns-3": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "M15 3v18" }]], "arrow-left": [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]], "rotate-ccw": [["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }], ["path", { "d": "M3 3v5h5" }]], "house": [["path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]], "layout-dashboard": [["rect", { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }], ["rect", { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }]], "folder": [["path", { "d": "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" }]], "chart-column": [["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }], ["path", { "d": "M18 17V9" }], ["path", { "d": "M13 17V5" }], ["path", { "d": "M8 17v-3" }]], "file-text": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }], ["path", { "d": "M10 9H8" }], ["path", { "d": "M16 13H8" }], ["path", { "d": "M16 17H8" }]], "mail": [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }]], "lock": [["rect", { "width": "18", "height": "11", "x": "3", "y": "11", "rx": "2", "ry": "2" }], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]], "clock": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 6v6l4 2" }]], "trending-up": [["path", { "d": "M16 7h6v6" }], ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]], "trending-down": [["path", { "d": "M16 17h6v-6" }], ["path", { "d": "m22 17-8.5-8.5-5 5L2 7" }]], "image": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2", "ry": "2" }], ["circle", { "cx": "9", "cy": "9", "r": "2" }], ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]], "paperclip": [["path", { "d": "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" }]], "cloud-upload": [["path", { "d": "M12 13v8" }], ["path", { "d": "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }], ["path", { "d": "m8 17 4-4 4 4" }]], "file": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }]], "sun": [["circle", { "cx": "12", "cy": "12", "r": "4" }], ["path", { "d": "M12 2v2" }], ["path", { "d": "M12 20v2" }], ["path", { "d": "m4.93 4.93 1.41 1.41" }], ["path", { "d": "m17.66 17.66 1.41 1.41" }], ["path", { "d": "M2 12h2" }], ["path", { "d": "M20 12h2" }], ["path", { "d": "m6.34 17.66-1.41 1.41" }], ["path", { "d": "m19.07 4.93-1.41 1.41" }]], "moon": [["path", { "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]], "monitor": [["rect", { "width": "20", "height": "14", "x": "2", "y": "3", "rx": "2" }], ["line", { "x1": "8", "x2": "16", "y1": "21", "y2": "21" }], ["line", { "x1": "12", "x2": "12", "y1": "17", "y2": "21" }]], "panel-left-close": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "m16 15-3-3 3-3" }]], "panel-left-open": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "m14 9 3 3-3 3" }]] };
  var SIZES = { sm: 16, md: 20, lg: 24 };
  var Icon = React2.forwardRef(function Icon2(props, ref) {
    const size = SIZES[props.size] || props.size || 16;
    if (React2.isValidElement(props.name)) {
      return /* @__PURE__ */ React2.createElement(
        "span",
        {
          className: cx("aura-icon", "aura-icon--custom", props.className),
          style: { width: size, height: size, ["--aura-icon-stroke"]: props.strokeWidth || 2 },
          ...props.label ? { role: "img", "aria-label": props.label } : { "aria-hidden": true }
        },
        props.name
      );
    }
    const shapes = ICONS[props.name];
    if (!shapes) return null;
    const a11y = props.label ? { role: "img", "aria-label": props.label } : { "aria-hidden": true, focusable: "false" };
    return /* @__PURE__ */ React2.createElement(
      "svg",
      {
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
        className: cx("aura-icon", props.className),
        ...a11y
      },
      shapes.map(function(s, i) {
        const attrs = { key: i };
        for (const k in s[1]) attrs[k === "stroke-width" ? "strokeWidth" : k] = s[1][k];
        return h(s[0], attrs);
      })
    );
  });
  var iconNames = Object.keys(ICONS);

  // src/Button.tsx
  var React4 = __toESM(require_react(), 1);

  // src/locale.tsx
  var React3 = __toESM(require_react(), 1);

  // src/strings.ts
  var n = function(x) {
    return Number(x).toLocaleString("en");
  };
  var nsv = function(x) {
    return Number(x).toLocaleString("sv-SE");
  };
  var STRINGS = {
    en: {
      close: "Close",
      dismiss: "Dismiss",
      dismissToast: "Dismiss notification",
      showPassword: "Show password",
      filters: "Filters",
      search: "Search",
      clearFilters: "Clear all",
      results: function(n2) {
        return n2 === 1 ? "1 result" : n2.toLocaleString("en") + " results";
      },
      commandMenu: "Command menu",
      commandPlaceholder: "Type a command or search\u2026",
      commandHint: "\u2191\u2193 to move \xB7 Enter to open \xB7 Esc to close",
      errorSummary: function(n2) {
        return n2 === 1 ? "Fix 1 field to continue" : "Fix " + n2 + " fields to continue";
      },
      notifications: "Notifications",
      mainNav: "Main",
      breadcrumb: "Breadcrumb",
      navigation: "Navigation",
      openNav: "Open navigation",
      collapseNav: "Collapse sidebar",
      expandNav: "Expand sidebar",
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
      totals: "Totals",
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
      colorScheme: "Colour scheme",
      increase: "Increase",
      decrease: "Decrease",
      stepDone: "completed",
      stepOf: function(i, total) {
        return "Step " + i + " of " + total;
      },
      schemeLight: "Light",
      schemeDark: "Dark",
      schemeSystem: "System",
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
      showPassword: "\u0E41\u0E2A\u0E14\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19",
      filters: "\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07",
      search: "\u0E04\u0E49\u0E19\u0E2B\u0E32",
      clearFilters: "\u0E25\u0E49\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",
      results: function(n2) {
        return n2.toLocaleString("en") + " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23";
      },
      commandMenu: "\u0E40\u0E21\u0E19\u0E39\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07",
      commandPlaceholder: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E04\u0E49\u0E19\u0E2B\u0E32\u2026",
      commandHint: "\u2191\u2193 \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19 \xB7 Enter \u0E40\u0E1B\u0E34\u0E14 \xB7 Esc \u0E1B\u0E34\u0E14",
      errorSummary: function(n2) {
        return "\u0E41\u0E01\u0E49\u0E44\u0E02 " + n2 + " \u0E0A\u0E48\u0E2D\u0E07\u0E01\u0E48\u0E2D\u0E19\u0E44\u0E1B\u0E15\u0E48\u0E2D";
      },
      notifications: "\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19",
      mainNav: "\u0E40\u0E21\u0E19\u0E39\u0E2B\u0E25\u0E31\u0E01",
      breadcrumb: "\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07",
      navigation: "\u0E40\u0E21\u0E19\u0E39",
      openNav: "\u0E40\u0E1B\u0E34\u0E14\u0E40\u0E21\u0E19\u0E39",
      collapseNav: "\u0E22\u0E48\u0E2D\u0E41\u0E16\u0E1A\u0E40\u0E21\u0E19\u0E39",
      expandNav: "\u0E02\u0E22\u0E32\u0E22\u0E41\u0E16\u0E1A\u0E40\u0E21\u0E19\u0E39",
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
      totals: "\u0E23\u0E27\u0E21",
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
      colorScheme: "\u0E42\u0E2B\u0E21\u0E14\u0E2A\u0E35",
      increase: "\u0E40\u0E1E\u0E34\u0E48\u0E21",
      decrease: "\u0E25\u0E14",
      stepDone: "\u0E40\u0E2A\u0E23\u0E47\u0E08\u0E41\u0E25\u0E49\u0E27",
      stepOf: function(i, total) {
        return "\u0E02\u0E31\u0E49\u0E19\u0E17\u0E35\u0E48 " + i + " \u0E08\u0E32\u0E01 " + total;
      },
      schemeLight: "\u0E2A\u0E27\u0E48\u0E32\u0E07",
      schemeDark: "\u0E21\u0E37\u0E14",
      schemeSystem: "\u0E15\u0E32\u0E21\u0E23\u0E30\u0E1A\u0E1A",
      uploading: "\u0E01\u0E33\u0E25\u0E31\u0E07\u0E2D\u0E31\u0E1B\u0E42\u0E2B\u0E25\u0E14\u2026",
      images: "\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E",
      pagination: "\u0E40\u0E25\u0E02\u0E2B\u0E19\u0E49\u0E32",
      pageN: function(p) {
        return "\u0E2B\u0E19\u0E49\u0E32 " + p;
      },
      accepts: function(list, max) {
        return [list, max && "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + max + " \u0E15\u0E48\u0E2D\u0E44\u0E1F\u0E25\u0E4C"].filter(Boolean).join(" \xB7 ");
      }
    },
    sv: {
      close: "St\xE4ng",
      dismiss: "St\xE4ng",
      dismissToast: "St\xE4ng aviseringen",
      showPassword: "Visa l\xF6senord",
      filters: "Filter",
      search: "S\xF6k",
      clearFilters: "Rensa alla",
      results: function(n2) {
        return n2 === 1 ? "1 tr\xE4ff" : n2.toLocaleString("sv-SE") + " tr\xE4ffar";
      },
      commandMenu: "Kommandomeny",
      commandPlaceholder: "Skriv ett kommando eller s\xF6k\u2026",
      commandHint: "\u2191\u2193 flytta \xB7 Enter \xF6ppna \xB7 Esc st\xE4ng",
      errorSummary: function(n2) {
        return n2 === 1 ? "R\xE4tta 1 f\xE4lt f\xF6r att forts\xE4tta" : "R\xE4tta " + n2 + " f\xE4lt f\xF6r att forts\xE4tta";
      },
      notifications: "Aviseringar",
      mainNav: "Huvudmeny",
      breadcrumb: "Br\xF6dsmulor",
      navigation: "Navigering",
      openNav: "\xD6ppna menyn",
      collapseNav: "F\xE4ll ihop sidof\xE4ltet",
      expandNav: "F\xE4ll ut sidof\xE4ltet",
      searching: "S\xF6ker\u2026",
      noMatches: "Inga tr\xE4ffar",
      clear: function(what) {
        return "Rensa " + (what || "urvalet");
      },
      keepTyping: function(total) {
        return "Skriv mer f\xF6r att begr\xE4nsa " + nsv(total) + " alternativ";
      },
      sortAsc: "Sortera stigande",
      sortDesc: "Sortera fallande",
      pin: "F\xE4st till v\xE4nster",
      unpin: "Lossa kolumnen",
      moveLeft: "Flytta v\xE4nster",
      moveRight: "Flytta h\xF6ger",
      hideColumn: "D\xF6lj kolumnen",
      resetColumns: "\xC5terst\xE4ll kolumner",
      selectRows: "V\xE4lj rader",
      selectAllRows: "V\xE4lj alla rader",
      deselectAllRows: "Avmarkera alla rader",
      selectAll: "V\xE4lj alla",
      selectRow: function(k) {
        return "V\xE4lj " + k;
      },
      selectedCount: function(c) {
        return nsv(c) + " valda";
      },
      pinned: "F\xE4st",
      columnOptions: function(label) {
        return "Alternativ f\xF6r kolumnen " + label;
      },
      column: function(label) {
        return label ? "Kolumnen " + label : "Kolumn";
      },
      columns: "Kolumner",
      showHideColumns: "Visa eller d\xF6lj kolumner",
      empty: "Inget h\xE4r \xE4nnu",
      loading: "Laddar\u2026",
      loadingRows: "Laddar rader",
      range: function(a, b, total) {
        return a + "\u2013" + b + " av " + nsv(total);
      },
      page: function(p, total) {
        return "Sida " + p + " av " + total;
      },
      prevPage: "F\xF6reg\xE5ende sida",
      nextPage: "N\xE4sta sida",
      totals: "Summa",
      rowCount: function(c) {
        return nsv(c) + " rader";
      },
      actions: "\xC5tg\xE4rder",
      optional: "valfritt",
      timePlaceholder: "tt:mm",
      timeInvalid: "Skriv en tid som 09:30",
      timeOutOfRange: function(a, b) {
        return "V\xE4lj en tid mellan " + a + " och " + b;
      },
      dropFiles: "Dra filer hit eller",
      browse: "V\xE4lj filer",
      browseOne: "V\xE4lj en fil",
      remove: function(n2) {
        return "Ta bort " + n2;
      },
      fileTooBig: function(max) {
        return "St\xF6rre \xE4n " + max;
      },
      fileWrongType: "Den h\xE4r filtypen godtas inte",
      tooManyFiles: function(n2) {
        return "H\xF6gst " + n2 + " filer";
      },
      colorScheme: "F\xE4rgl\xE4ge",
      increase: "\xD6ka",
      decrease: "Minska",
      stepDone: "klart",
      stepOf: function(i, total) {
        return "Steg " + i + " av " + total;
      },
      schemeLight: "Ljust",
      schemeDark: "M\xF6rkt",
      schemeSystem: "System",
      uploading: "Laddar upp\u2026",
      images: "Bilder",
      pagination: "Sidnumrering",
      pageN: function(p) {
        return "Sida " + p;
      },
      accepts: function(list, max) {
        return [list, max && "h\xF6gst " + max + " per fil"].filter(Boolean).join(", ");
      }
    }
  };

  // src/locale.tsx
  var LocaleContext = React3.createContext(null);
  function AuraProvider(props) {
    const outer = React3.useContext(LocaleContext);
    const density = props.density || outer && outer.density || null;
    const timeZone = props.timeZone || outer && outer.timeZone || null;
    const value = React3.useMemo(
      function() {
        const base = props.locale && STRINGS[props.locale] || STRINGS.en;
        return {
          locale: props.locale || "en",
          calendar: props.calendar || null,
          strings: props.strings ? Object.assign({}, base, props.strings) : base,
          linkComponent: props.linkComponent || null,
          density,
          timeZone
        };
      },
      [props.locale, props.calendar, props.strings, props.linkComponent, density, timeZone]
    );
    return /* @__PURE__ */ React3.createElement(LocaleContext.Provider, { value }, props.density ? /* @__PURE__ */ React3.createElement("div", { className: "aura-density", "data-density": props.density }, props.children) : props.children);
  }
  function useAuraLocale() {
    return React3.useContext(LocaleContext) || { locale: null, calendar: null, strings: STRINGS.en };
  }
  function useLinkComponent(own) {
    const ctx = React3.useContext(LocaleContext);
    return own || ctx && ctx.linkComponent || "a";
  }
  function useDensity() {
    const ctx = React3.useContext(LocaleContext);
    return ctx && ctx.density || void 0;
  }
  function useStrings() {
    return useAuraLocale().strings;
  }

  // src/Button.tsx
  function ButtonLink(props, ref, Link) {
    const variant = props.variant || "primary";
    const disabled = !!props.disabled;
    const rest = omit(props, [
      "variant",
      "className",
      "children",
      "icon",
      "iconRight",
      "disabled",
      "linkComponent",
      "href",
      "fullWidth",
      "size"
    ]);
    const Tag3 = disabled ? "a" : Link;
    return /* @__PURE__ */ React4.createElement(
      Tag3,
      {
        ...rest,
        ref,
        href: disabled ? void 0 : props.href,
        role: disabled ? "link" : void 0,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : props.tabIndex,
        className: cx(
          "aura-btn",
          "aura-btn--" + variant,
          props.size === "sm" && "aura-btn--sm",
          props.fullWidth && "aura-btn--full",
          props.className
        ),
        onClick: disabled ? void 0 : props.onClick
      },
      props.icon ? /* @__PURE__ */ React4.createElement(Icon, { name: props.icon }) : null,
      props.children,
      props.iconRight ? /* @__PURE__ */ React4.createElement(Icon, { name: props.iconRight }) : null
    );
  }
  var Button = React4.forwardRef(
    function Button2(all, ref) {
      const Link = useLinkComponent(all.linkComponent);
      if (typeof all.href === "string") {
        return ButtonLink(all, ref, Link);
      }
      const props = all;
      const variant = props.variant || "primary";
      const loading = !!props.loading;
      const rest = omit(props, [
        "variant",
        "className",
        "children",
        "type",
        "icon",
        "iconRight",
        "loading",
        "onClick",
        "fullWidth",
        "size"
      ]);
      return /* @__PURE__ */ React4.createElement(
        "button",
        {
          ...rest,
          ref,
          type: props.type || "button",
          className: cx(
            "aura-btn",
            "aura-btn--" + variant,
            props.size === "sm" && "aura-btn--sm",
            props.fullWidth && "aura-btn--full",
            loading && "is-loading",
            props.className
          ),
          "aria-busy": loading || void 0,
          "aria-disabled": loading || void 0,
          onClick: loading ? function(e) {
            e.preventDefault();
          } : props.onClick
        },
        loading ? /* @__PURE__ */ React4.createElement(Icon, { name: "loader-circle", className: "aura-spin" }) : props.icon ? /* @__PURE__ */ React4.createElement(Icon, { name: props.icon }) : null,
        props.children,
        props.iconRight && !loading ? /* @__PURE__ */ React4.createElement(Icon, { name: props.iconRight }) : null
      );
    }
  );

  // src/IconButton.tsx
  var React5 = __toESM(require_react(), 1);
  var IconButton = React5.forwardRef(function IconButton2(props, ref) {
    const rest = omit(props, ["icon", "label", "className", "size", "tone"]);
    return /* @__PURE__ */ React5.createElement(
      "button",
      {
        ...rest,
        ref,
        type: props.type || "button",
        "aria-label": props.label,
        title: props.label,
        className: cx("aura-icon-btn", props.tone === "danger" && "aura-icon-btn--danger", props.className)
      },
      /* @__PURE__ */ React5.createElement(Icon, { name: props.icon, size: props.size || "sm" })
    );
  });

  // src/Menu.tsx
  var React6 = __toESM(require_react(), 1);
  var import_react_dom = __toESM(require_react_dom(), 1);
  var Menu = React6.forwardRef(function Menu2(props, ref) {
    const own = React6.useRef(null), merged = useMergedRef(ref, own);
    const posState = React6.useState(null);
    const pos = posState[0], setPos = posState[1];
    const items2 = props.items || [];
    const mounted = useMounted();
    const Link = useLinkComponent(props.linkComponent);
    useIsoLayoutEffect(
      function() {
        const a = props.anchor, m = own.current;
        if (!a || !m) return;
        const r = a.getBoundingClientRect(), mh = m.offsetHeight, mw = m.offsetWidth;
        let top = r.bottom + 4;
        if (top + mh > window.innerHeight - 8 && r.top - mh - 4 > 8) top = r.top - mh - 4;
        const left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
        setPos({ top, left });
      },
      [props.anchor, mounted]
    );
    React6.useEffect(
      function() {
        if (!mounted) return;
        const first = own.current && own.current.querySelector('[role^="menuitem"]:not([disabled])');
        if (first && props.autoFocus !== false) first.focus();
        function outside(e) {
          if (own.current && !own.current.contains(e.target) && !(props.anchor && props.anchor.contains(e.target)))
            props.onClose(false);
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
      },
      [mounted]
    );
    function onKeyDown(e) {
      const list = Array.prototype.slice.call(
        own.current.querySelectorAll('[role^="menuitem"]:not([disabled])')
      );
      const i = list.indexOf(document.activeElement);
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
    function groupItems(list) {
      const out = [];
      list.forEach(function(it, i) {
        const g = it.type === "radio" && it.group ? it.group : null;
        const last = out[out.length - 1];
        if (last && last.group === g && g !== null) last.items.push({ it, i });
        else out.push({ group: g, items: [{ it, i }] });
      });
      return out;
    }
    function renderItem(it, i) {
      if (it.separator) return /* @__PURE__ */ React6.createElement("div", { key: "s" + i, role: "separator", className: "aura-menu__sep" });
      const isRadio = it.type === "radio";
      const isCheck = !isRadio && it.checked !== void 0;
      const lead = isRadio ? /* @__PURE__ */ React6.createElement("span", { className: cx("aura-menu__radio", it.checked && "is-on") }) : isCheck ? /* @__PURE__ */ React6.createElement("span", { className: cx("aura-menu__check", it.checked && "is-on") }, it.checked ? /* @__PURE__ */ React6.createElement(Icon, { name: "check", size: 12, strokeWidth: 3 }) : null) : it.icon ? /* @__PURE__ */ React6.createElement(Icon, { name: it.icon }) : /* @__PURE__ */ React6.createElement("span", { className: "aura-menu__blank" });
      const body = [
        /* @__PURE__ */ React6.createElement(React6.Fragment, { key: "l" }, lead),
        /* @__PURE__ */ React6.createElement("span", { key: "t", className: "aura-menu__label" }, it.label),
        it.hint ? /* @__PURE__ */ React6.createElement("span", { key: "h", className: "aura-menu__hint" }, it.hint) : null
      ];
      const cls = cx("aura-menu__item", it.tone === "danger" && "aura-menu__item--danger");
      if (it.href && !it.disabled)
        return /* @__PURE__ */ React6.createElement(
          Link,
          {
            key: i,
            href: it.href,
            target: it.target,
            rel: it.target === "_blank" ? "noreferrer" : void 0,
            tabIndex: -1,
            role: "menuitem",
            className: cls,
            onClick: function() {
              if (it.onSelect) it.onSelect();
              props.onClose(false);
            }
          },
          body
        );
      return /* @__PURE__ */ React6.createElement(
        "button",
        {
          key: i,
          type: "button",
          tabIndex: -1,
          disabled: it.disabled,
          role: isRadio ? "menuitemradio" : isCheck ? "menuitemcheckbox" : "menuitem",
          "aria-checked": isRadio || isCheck ? !!it.checked : void 0,
          className: cls,
          onClick: function() {
            if (it.onSelect) it.onSelect();
            if (!it.keepOpen) props.onClose(true);
          }
        },
        body
      );
    }
    const el = /* @__PURE__ */ React6.createElement(
      "div",
      {
        ref: merged,
        role: "menu",
        "aria-label": props.label,
        className: "aura-menu",
        onKeyDown,
        style: { top: pos ? pos.top : -9999, left: pos ? pos.left : -9999 }
      },
      groupItems(items2).map(function(block, bi) {
        const rendered = block.items.map(function(x) {
          return renderItem(x.it, x.i);
        });
        return block.group ? /* @__PURE__ */ React6.createElement("div", { key: "g" + bi, role: "group", "aria-label": block.group, className: "aura-menu__group" }, rendered) : /* @__PURE__ */ React6.createElement(React6.Fragment, { key: "f" + bi }, rendered);
      })
    );
    return mounted ? (0, import_react_dom.createPortal)(el, document.body) : null;
  });

  // src/DropdownMenu.tsx
  var React7 = __toESM(require_react(), 1);
  var DropdownMenu = React7.forwardRef(function DropdownMenu2(props, ref) {
    const st = React7.useState(null), anchor = st[0], setAnchor = st[1];
    const wrap = React7.useRef(null), wrapMerged = useMergedRef(ref, wrap);
    const child = React7.Children.only(props.trigger);
    function toggle(e) {
      if (child.props.onClick) child.props.onClick(e);
      const el = wrap.current && (wrap.current.querySelector('button, [role="button"], a') || wrap.current);
      setAnchor(anchor ? null : el);
    }
    function onKeyDown(e) {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !anchor) {
        e.preventDefault();
        setAnchor(wrap.current.querySelector('button, [role="button"], a') || wrap.current);
      }
    }
    return /* @__PURE__ */ React7.createElement("span", { ref: wrapMerged, className: "aura-dropdown", onKeyDown }, React7.cloneElement(child, { onClick: toggle, "aria-haspopup": "menu", "aria-expanded": anchor ? true : false }), anchor ? /* @__PURE__ */ React7.createElement(
      Menu,
      {
        anchor,
        label: props.label,
        items: props.items,
        linkComponent: props.linkComponent,
        onClose: function(restore) {
          setAnchor(null);
          if (restore && typeof anchor.focus === "function") anchor.focus();
        }
      }
    ) : null);
  });

  // src/Checkbox.tsx
  var React8 = __toESM(require_react(), 1);
  var Checkbox = React8.forwardRef(function Checkbox2(props, ref) {
    const own = React8.useRef(null), merged = useMergedRef(ref, own);
    const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
    const on = !!st[0];
    React8.useEffect(function() {
      if (own.current) own.current.indeterminate = !!props.indeterminate;
    });
    const rest = omit(props, [
      "checked",
      "defaultChecked",
      "onChange",
      "indeterminate",
      "label",
      "children",
      "description",
      "className",
      "tabIndex",
      "disabled"
    ]);
    const labelled = props.children != null;
    const descId = props.description && props.id ? props.id + "-desc" : void 0;
    return /* @__PURE__ */ React8.createElement(
      "label",
      {
        className: cx("aura-check", labelled && "aura-check--labelled", props.disabled && "is-disabled", props.className),
        onClick: function(e) {
          e.stopPropagation();
        }
      },
      /* @__PURE__ */ React8.createElement(
        "input",
        {
          ...rest,
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
        }
      ),
      /* @__PURE__ */ React8.createElement("span", { className: "aura-check__box", "aria-hidden": true }, props.indeterminate ? /* @__PURE__ */ React8.createElement(Icon, { name: "minus", size: 12, strokeWidth: 3 }) : on ? /* @__PURE__ */ React8.createElement(Icon, { name: "check", size: 12, strokeWidth: 3 }) : null),
      labelled ? /* @__PURE__ */ React8.createElement("span", { className: "aura-check__text" }, /* @__PURE__ */ React8.createElement("span", { className: "aura-check__label" }, props.children), props.description ? /* @__PURE__ */ React8.createElement("span", { className: "aura-check__desc", id: descId }, props.description) : null) : null
    );
  });

  // src/StatusPill.tsx
  var React9 = __toESM(require_react(), 1);

  // src/status.ts
  var TONE_WORDS = {
    ready: ["ready", "done", "complete", "completed", "approved", "live", "passed"],
    progress: ["in progress", "in review", "review", "syncing", "running", "pending"],
    blocked: ["blocked", "failed", "error", "rejected", "on hold", "cancelled"]
  };
  function toneFor(status) {
    const s = String(status == null ? "" : status).trim().toLowerCase();
    for (const t in TONE_WORDS) if (TONE_WORDS[t].indexOf(s) >= 0) return t;
    return "neutral";
  }
  var TONE_ORDER = { neutral: 0, progress: 1, ready: 2, blocked: 3 };

  // src/StatusPill.tsx
  var TONE_ICON = {
    neutral: "circle",
    progress: "circle-dot-dashed",
    ready: "circle-check",
    blocked: "ban"
  };
  var StatusPill = React9.forwardRef(function StatusPill2(props, ref) {
    const tone2 = props.tone || toneFor(props.children);
    return /* @__PURE__ */ React9.createElement("span", { ref, className: cx("aura-pill", "aura-pill--" + tone2, props.className) }, /* @__PURE__ */ React9.createElement(Icon, { name: TONE_ICON[tone2] || "circle", size: 12 }), props.children);
  });

  // src/Field.tsx
  var React10 = __toESM(require_react(), 1);
  var h2 = React10.createElement;
  var Field = React10.forwardRef(function Field2(props, ref) {
    const t = useStrings();
    return /* @__PURE__ */ React10.createElement(
      "div",
      {
        ref,
        className: cx("aura-field", props.error && "is-invalid", props.disabled && "is-disabled", props.className)
      },
      props.label ? h2(
        props.labelAs || "label",
        { className: "aura-field__label", htmlFor: props.labelAs ? void 0 : props.id, id: props.labelId },
        props.label,
        props.required ? /* @__PURE__ */ React10.createElement("span", { className: "aura-field__req", "aria-hidden": true }, " *") : null,
        props.optional ? /* @__PURE__ */ React10.createElement("span", { className: "aura-field__opt" }, " (" + t.optional + ")") : null
      ) : null,
      props.children,
      props.error ? /* @__PURE__ */ React10.createElement("p", { className: "aura-field__error", id: props.id + "-error" }, /* @__PURE__ */ React10.createElement(Icon, { name: "circle-alert", size: 14 }), props.error) : props.hint ? /* @__PURE__ */ React10.createElement("p", { className: "aura-field__hint", id: props.id + "-hint" }, props.hint) : null
    );
  });
  function describedBy(id, p) {
    return p.error ? id + "-error" : p.hint ? id + "-hint" : void 0;
  }
  var FIELD_KEYS = [
    "label",
    "hint",
    "error",
    "required",
    "optional",
    "icon",
    "className",
    "id",
    "suffix",
    "options",
    "placeholder"
  ];

  // src/TextField.tsx
  var React11 = __toESM(require_react(), 1);
  var TextField = React11.forwardRef(function TextField2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const rest = omit(props, FIELD_KEYS);
    return /* @__PURE__ */ React11.createElement(
      Field,
      {
        id,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React11.createElement("div", { className: cx("aura-input", props.icon && "has-icon", props.suffix && "has-suffix") }, props.icon ? /* @__PURE__ */ React11.createElement(Icon, { name: props.icon, className: "aura-input__icon" }) : null, /* @__PURE__ */ React11.createElement(
        "input",
        {
          type: "text",
          ...rest,
          ref,
          id,
          className: "aura-input__control",
          placeholder: props.placeholder,
          required: props.required,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": describedBy(id, props)
        }
      ), props.suffix ? /* @__PURE__ */ React11.createElement("span", { className: "aura-input__suffix" }, props.suffix) : null)
    );
  });

  // src/Textarea.tsx
  var React12 = __toESM(require_react(), 1);
  var Textarea = React12.forwardRef(function Textarea2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const rest = omit(props, FIELD_KEYS);
    return /* @__PURE__ */ React12.createElement(
      Field,
      {
        id,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React12.createElement(
        "textarea",
        {
          rows: 4,
          ...rest,
          ref,
          id,
          className: "aura-input aura-textarea",
          placeholder: props.placeholder,
          required: props.required,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": describedBy(id, props)
        }
      )
    );
  });

  // src/Select.tsx
  var React13 = __toESM(require_react(), 1);
  var h3 = React13.createElement;
  var Select = React13.forwardRef(function Select2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const rest = omit(props, FIELD_KEYS.concat(["children"]));
    const opts = (props.options || []).map(function(o) {
      const v = typeof o === "object" ? o : { value: o, label: o };
      return /* @__PURE__ */ React13.createElement("option", { key: v.value, value: v.value, disabled: v.disabled }, v.label);
    });
    if (props.placeholder)
      opts.unshift(
        /* @__PURE__ */ React13.createElement("option", { key: "__ph", value: "", disabled: true }, props.placeholder)
      );
    const extra = props.value === void 0 && props.defaultValue === void 0 && props.placeholder ? { defaultValue: "" } : {};
    return /* @__PURE__ */ React13.createElement(
      Field,
      {
        id,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React13.createElement("div", { className: cx("aura-input aura-select", props.icon && "has-icon") }, props.icon ? /* @__PURE__ */ React13.createElement(Icon, { name: props.icon, className: "aura-input__icon" }) : null, h3(
        "select",
        Object.assign(extra, rest, {
          ref,
          id,
          className: "aura-input__control",
          required: props.required,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": describedBy(id, props)
        }),
        opts,
        props.children
      ), /* @__PURE__ */ React13.createElement(Icon, { name: "chevron-down", className: "aura-select__chevron" }))
    );
  });

  // src/RadioGroup.tsx
  var React14 = __toESM(require_react(), 1);
  var RadioGroup = React14.forwardRef(function RadioGroup2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(
      props.value,
      props.defaultValue,
      props.onChange
    );
    const name = props.name || id;
    return /* @__PURE__ */ React14.createElement(
      "fieldset",
      {
        ref,
        className: cx("aura-field aura-radio-group", props.error && "is-invalid", props.className),
        "aria-describedby": describedBy(id, props),
        "aria-invalid": props.error ? true : void 0,
        disabled: props.disabled
      },
      props.label ? /* @__PURE__ */ React14.createElement("legend", { className: "aura-field__label" }, props.label, props.required ? /* @__PURE__ */ React14.createElement("span", { className: "aura-field__req", "aria-hidden": true }, " *") : null) : null,
      /* @__PURE__ */ React14.createElement("div", { className: cx("aura-radio-group__list", props.orientation === "horizontal" && "is-horizontal") }, (props.options || []).map(function(o) {
        const v = typeof o === "object" ? o : { value: o, label: o };
        return /* @__PURE__ */ React14.createElement("label", { key: v.value, className: cx("aura-choice", v.disabled && "is-disabled") }, /* @__PURE__ */ React14.createElement(
          "input",
          {
            type: "radio",
            className: "aura-radio",
            name,
            value: v.value,
            disabled: v.disabled,
            checked: st[0] === v.value,
            onChange: function() {
              st[1](v.value);
            }
          }
        ), /* @__PURE__ */ React14.createElement("span", { className: "aura-choice__text" }, /* @__PURE__ */ React14.createElement("span", { className: "aura-choice__label" }, v.label), v.description ? /* @__PURE__ */ React14.createElement("span", { className: "aura-choice__desc" }, v.description) : null));
      })),
      props.error ? /* @__PURE__ */ React14.createElement("p", { className: "aura-field__error", id: id + "-error" }, /* @__PURE__ */ React14.createElement(Icon, { name: "circle-alert", size: 14 }), props.error) : props.hint ? /* @__PURE__ */ React14.createElement("p", { className: "aura-field__hint", id: id + "-hint" }, props.hint) : null
    );
  });

  // src/Switch.tsx
  var React15 = __toESM(require_react(), 1);
  var Switch = React15.forwardRef(function Switch2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
    const on = !!st[0];
    return /* @__PURE__ */ React15.createElement(
      "div",
      {
        className: cx("aura-switch-row", props.disabled && "is-disabled", props.className),
        onClick: function(e) {
          const t = e.target;
          if (props.disabled || t.closest("button, label, a, input")) return;
          st[1](!on);
        }
      },
      /* @__PURE__ */ React15.createElement(
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
        /* @__PURE__ */ React15.createElement("span", { className: "aura-switch__thumb" })
      ),
      props.label ? /* @__PURE__ */ React15.createElement("span", { className: "aura-choice__text" }, /* @__PURE__ */ React15.createElement("label", { className: "aura-choice__label", id: id + "-label", htmlFor: id }, props.label), props.description ? /* @__PURE__ */ React15.createElement("span", { className: "aura-choice__desc", id: id + "-desc" }, props.description) : null) : null
    );
  });

  // src/Combobox.tsx
  var React16 = __toESM(require_react(), 1);
  var import_react_dom2 = __toESM(require_react_dom(), 1);
  function norm(s) {
    return String(s == null ? "" : s).normalize("NFC").toLocaleLowerCase("th");
  }
  function toOpt(o) {
    return typeof o === "object" ? o : { value: String(o), label: String(o) };
  }
  function defaultFilter(option, query) {
    const q = norm(query).trim();
    if (!q) return true;
    return norm(option.label).indexOf(q) >= 0 || !!option.description && norm(option.description).indexOf(q) >= 0 || (option.keywords || []).some(function(k) {
      return norm(k).indexOf(q) >= 0;
    });
  }
  var Combobox = React16.forwardRef(
    function Combobox2(all, ref) {
      const props = all;
      const multi = all.multiple === true;
      const mp = all;
      const t = useStrings();
      const auto = uid(), id = props.id || auto, listId = id + "-list";
      const options = (props.options || []).map(toOpt);
      const st = useMaybeControlled(
        multi ? mp.value : props.value === void 0 ? void 0 : props.value == null ? [] : [props.value],
        multi ? mp.defaultValue || [] : props.defaultValue == null ? [] : [props.defaultValue],
        function(next) {
          if (multi) {
            if (mp.onChange) mp.onChange(next);
          } else if (props.onChange) props.onChange(next.length ? next[0] : null);
        }
      );
      const values = st[0], setValues = st[1];
      const value = values.length ? values[0] : null;
      function setValue(v) {
        setValues(v == null ? [] : [v]);
      }
      const isPicked = function(v) {
        return values.indexOf(v) >= 0;
      };
      const full = multi && mp.max != null && values.length >= mp.max;
      const selected = multi ? null : options.filter(function(o) {
        return o.value === value;
      })[0] || null;
      const picked = multi ? values.map(function(v) {
        return options.filter(function(o) {
          return o.value === v;
        })[0];
      }).filter(Boolean) : [];
      const openState = React16.useState(false), open = openState[0], setOpen = openState[1];
      const qState = React16.useState(null), query = qState[0], setQuery = qState[1];
      const aState = React16.useState(0), active = aState[0], setActive = aState[1];
      const posState = React16.useState(null);
      const inputRef = React16.useRef(null), inputMerged = useMergedRef(ref, inputRef), boxRef = React16.useRef(null), listRef = React16.useRef(null);
      const mounted = useMounted();
      const limit = props.limit || 200;
      const filter = props.filter || defaultFilter;
      let shown = props.onSearch || query == null ? options : options.filter(function(o) {
        return filter(o, query);
      });
      const more = shown.length > limit;
      shown = shown.slice(0, limit);
      const activeIdx = Math.min(active, shown.length - 1);
      function place() {
        if (!boxRef.current) return;
        const r = boxRef.current.getBoundingClientRect();
        const maxH = 320, below = window.innerHeight - r.bottom - 8, up = below < 200 && r.top > below;
        posState[1]({
          left: r.left,
          width: r.width,
          top: up ? void 0 : r.bottom + 4,
          bottom: up ? window.innerHeight - r.top + 4 : void 0,
          maxHeight: Math.min(maxH, (up ? r.top : below) - 8)
        });
      }
      useIsoLayoutEffect(
        function() {
          if (open) place();
        },
        [open, shown.length]
      );
      React16.useEffect(
        function() {
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
        },
        [open]
      );
      React16.useEffect(
        function() {
          if (!open || !listRef.current) return;
          const el = listRef.current.querySelector('[data-idx="' + activeIdx + '"]');
          if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
        },
        [activeIdx, open]
      );
      function openList() {
        if (!open && !props.disabled && !props.readOnly) {
          setOpen(true);
          const i = selected ? shown.indexOf(selected) : 0;
          setActive(i < 0 ? 0 : i);
        }
      }
      function close(restoreLabel) {
        setOpen(false);
        setQuery(null);
      }
      function choose(o) {
        if (!o || o.disabled) return;
        if (multi) {
          if (isPicked(o.value))
            setValues(
              values.filter(function(v) {
                return v !== o.value;
              })
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
      function onKeyDown(e) {
        const k = e.key;
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
          } else if (!multi && props.clearable !== false && value != null && query == null) {
            setValue(null);
          }
        } else if (k === "Backspace" && multi && !text && values.length) {
          setValues(values.slice(0, -1));
        } else if (k === "Tab") {
          if (open) close();
        }
      }
      const text = query != null ? query : selected ? selected.label : "";
      const summaryId = id + "-picked";
      const optId = function(i) {
        return id + "-opt-" + i;
      };
      const list = open && mounted && posState[0] ? (0, import_react_dom2.createPortal)(
        /* @__PURE__ */ React16.createElement("div", { ref: listRef, className: "aura-combo__popover", style: posState[0] }, /* @__PURE__ */ React16.createElement(
          "ul",
          {
            id: listId,
            role: "listbox",
            "aria-label": props.label,
            "aria-multiselectable": multi || void 0,
            className: "aura-combo__list"
          },
          props.loading ? /* @__PURE__ */ React16.createElement("li", { className: "aura-combo__note", role: "presentation" }, /* @__PURE__ */ React16.createElement(Icon, { name: "loader-circle", className: "aura-spin" }), props.loadingText || t.searching) : !shown.length ? /* @__PURE__ */ React16.createElement("li", { className: "aura-combo__note", role: "presentation" }, props.emptyText || t.noMatches) : shown.map(function(o, i) {
            const isSel = multi ? isPicked(o.value) : !!selected && o.value === selected.value;
            const blocked = o.disabled || multi && full && !isSel;
            return /* @__PURE__ */ React16.createElement(
              "li",
              {
                key: o.value,
                id: optId(i),
                role: "option",
                "data-idx": i,
                "aria-selected": isSel,
                "aria-disabled": blocked || void 0,
                className: cx(
                  "aura-combo__option",
                  i === activeIdx && "is-active",
                  isSel && "is-selected",
                  blocked && "is-disabled"
                ),
                onPointerDown: function(e) {
                  e.preventDefault();
                },
                onClick: function() {
                  if (!blocked || isSel) choose(o);
                },
                onPointerMove: function() {
                  if (activeIdx !== i) setActive(i);
                }
              },
              o.icon ? /* @__PURE__ */ React16.createElement(Icon, { name: o.icon }) : null,
              /* @__PURE__ */ React16.createElement("span", { className: "aura-combo__text" }, /* @__PURE__ */ React16.createElement("span", { className: "aura-combo__label" }, o.label), o.description ? /* @__PURE__ */ React16.createElement("span", { className: "aura-combo__desc" }, o.description) : null),
              isSel ? /* @__PURE__ */ React16.createElement(Icon, { name: "check", className: "aura-combo__check" }) : null
            );
          }),
          more && !props.loading ? /* @__PURE__ */ React16.createElement("li", { className: "aura-combo__note", role: "presentation" }, t.keepTyping((props.options || []).length)) : null
        )),
        document.body
      ) : null;
      return /* @__PURE__ */ React16.createElement(
        Field,
        {
          id,
          label: props.label,
          hint: props.hint,
          error: props.error,
          required: props.required,
          optional: props.optional,
          disabled: props.disabled,
          className: props.className
        },
        /* @__PURE__ */ React16.createElement("div", { ref: boxRef, className: cx("aura-input aura-combo has-icon", open && "is-open", multi && "is-multi") }, /* @__PURE__ */ React16.createElement(Icon, { name: props.icon || "search", className: "aura-input__icon" }), multi && picked.length ? /* @__PURE__ */ React16.createElement("span", { className: "aura-combo__chips" }, picked.map(function(o) {
          return /* @__PURE__ */ React16.createElement("span", { key: o.value, className: "aura-combo__chip" }, /* @__PURE__ */ React16.createElement("span", { className: "aura-combo__chip-label" }, o.label), props.disabled || props.readOnly ? null : /* @__PURE__ */ React16.createElement(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: "aura-combo__chip-remove",
              "aria-label": t.remove(o.label),
              onPointerDown: function(e) {
                e.preventDefault();
              },
              onClick: function() {
                setValues(
                  values.filter(function(v) {
                    return v !== o.value;
                  })
                );
                if (inputRef.current) inputRef.current.focus();
              }
            },
            /* @__PURE__ */ React16.createElement(Icon, { name: "x" })
          ));
        })) : null, multi ? /* @__PURE__ */ React16.createElement("span", { id: summaryId, className: "aura-sr-only" }, picked.length ? t.selectedCount(picked.length) + ": " + picked.map(function(o) {
          return o.label;
        }).join(", ") : "") : null, multi && props.name ? values.map(function(v) {
          return /* @__PURE__ */ React16.createElement("input", { key: v, type: "hidden", name: props.name, value: v });
        }) : null, /* @__PURE__ */ React16.createElement(
          "input",
          {
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
            "aria-describedby": [props.error ? id + "-error" : props.hint ? id + "-hint" : "", multi && picked.length ? summaryId : ""].filter(Boolean).join(" ") || void 0,
            placeholder: multi && values.length ? void 0 : props.placeholder,
            disabled: props.disabled,
            readOnly: props.readOnly,
            required: props.required && (!multi || !values.length),
            name: multi ? void 0 : props.name,
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
          }
        ), props.clearable !== false && values.length && !props.disabled ? /* @__PURE__ */ React16.createElement(
          "button",
          {
            type: "button",
            className: "aura-combo__clear",
            "aria-label": t.clear(props.label),
            tabIndex: -1,
            onClick: function() {
              setValues([]);
              setQuery(null);
              if (inputRef.current) inputRef.current.focus();
            }
          },
          /* @__PURE__ */ React16.createElement(Icon, { name: "x" })
        ) : null, /* @__PURE__ */ React16.createElement(
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
          /* @__PURE__ */ React16.createElement(Icon, { name: "chevron-down" })
        )),
        list
      );
    }
  );

  // src/DatePicker.tsx
  var React17 = __toESM(require_react(), 1);
  var import_react_dom3 = __toESM(require_react_dom(), 1);

  // src/dates.ts
  var ERA = /^พ\.ศ\.\s?|\s?(BE|พ\.ศ\.)$/g;
  var pad = function(n2) {
    return (n2 < 10 ? "0" : "") + n2;
  };
  function toISO(d) {
    return d ? d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()) : null;
  }
  function fromISO(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  function addDays(d, n2) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n2);
  }
  function addMonths(d, n2) {
    const t = new Date(d.getFullYear(), d.getMonth() + n2, 1);
    const last = new Date(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    return new Date(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
  }
  function same(a, b) {
    return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }
  var TAGS = { th: "th-TH", en: "en-GB", sv: "sv-SE" };
  function defaultCalendar(locale) {
    return locale === "th" ? "buddhist" : "gregory";
  }
  function localeTag(locale, calendar) {
    const cal = calendar || defaultCalendar(locale);
    return (TAGS[locale || "en"] || "en-GB") + "-u-ca-" + (cal === "gregory" ? "gregory" : "buddhist");
  }
  var DATE_TEXT = {
    th: {
      prevYears: "\u0E0A\u0E48\u0E27\u0E07\u0E1B\u0E35\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32",
      nextYears: "\u0E0A\u0E48\u0E27\u0E07\u0E1B\u0E35\u0E16\u0E31\u0E14\u0E44\u0E1B",
      prevMonth: "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E01\u0E48\u0E2D\u0E19\u0E2B\u0E19\u0E49\u0E32",
      nextMonth: "\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E16\u0E31\u0E14\u0E44\u0E1B",
      today: "\u0E27\u0E31\u0E19\u0E19\u0E35\u0E49",
      clear: "\u0E25\u0E49\u0E32\u0E07",
      chooseDate: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48",
      datePlaceholder: "\u0E27\u0E27/\u0E14\u0E14/\u0E1B\u0E1B\u0E1B\u0E1B",
      clearDate: "\u0E25\u0E49\u0E32\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48",
      openCalendar: "\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19",
      chooseDates: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48",
      rangePlaceholder: "\u0E27\u0E27/\u0E14\u0E14/\u0E1B\u0E1B\u0E1B\u0E1B \u2013 \u0E27\u0E27/\u0E14\u0E14/\u0E1B\u0E1B\u0E1B\u0E1B",
      clearDates: "\u0E25\u0E49\u0E32\u0E07\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48",
      chooseStart: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E15\u0E49\u0E19",
      chooseEnd: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14"
    },
    en: {
      prevYears: "Previous years",
      nextYears: "Next years",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      today: "Today",
      clear: "Clear",
      chooseDate: "Choose date",
      datePlaceholder: "DD/MM/YYYY",
      clearDate: "Clear date",
      openCalendar: "Open calendar",
      chooseDates: "Choose dates",
      rangePlaceholder: "DD/MM/YYYY \u2013 DD/MM/YYYY",
      clearDates: "Clear dates",
      chooseStart: "Choose the start date",
      chooseEnd: "Choose the end date"
    },
    sv: {
      prevYears: "Tidigare \xE5r",
      nextYears: "Senare \xE5r",
      prevMonth: "F\xF6reg\xE5ende m\xE5nad",
      nextMonth: "N\xE4sta m\xE5nad",
      today: "Idag",
      clear: "Rensa",
      chooseDate: "V\xE4lj datum",
      datePlaceholder: "\xE5\xE5\xE5\xE5-mm-dd",
      clearDate: "Rensa datum",
      openCalendar: "\xD6ppna kalendern",
      chooseDates: "V\xE4lj datum",
      rangePlaceholder: "\xE5\xE5\xE5\xE5-mm-dd \u2013 \xE5\xE5\xE5\xE5-mm-dd",
      clearDates: "Rensa datumen",
      chooseStart: "V\xE4lj startdatum",
      chooseEnd: "V\xE4lj slutdatum"
    }
  };
  function dateText(locale) {
    return DATE_TEXT[locale || "en"] || DATE_TEXT.en;
  }
  var fmtCache = {};
  var PRESETS = {
    short: { day: "numeric", month: "short", year: "numeric" },
    long: { day: "numeric", month: "long", year: "numeric" },
    numeric: { day: "2-digit", month: "2-digit", year: "numeric" }
  };
  function fmt(tag, opts, d) {
    const k = tag + JSON.stringify(opts);
    if (!fmtCache[k]) fmtCache[k] = new Intl.DateTimeFormat(tag, opts);
    return fmtCache[k].format(d);
  }
  function formatDate(iso, opts) {
    const o = opts || {}, d = fromISO(iso);
    if (!d) return "";
    const f = typeof o.format === "object" ? o.format : PRESETS[o.format || "short"];
    const loc = o.locale || "th";
    return fmt(localeTag(loc, o.calendar || defaultCalendar(loc)), f, d).replace(ERA, "");
  }
  var MONTHS = null;
  function monthIndex(word) {
    if (!MONTHS) {
      MONTHS = {};
      ["th-TH", "en-GB", "sv-SE"].forEach(function(tag) {
        ["short", "long"].forEach(function(w) {
          for (let i = 0; i < 12; i++) {
            const n2 = new Intl.DateTimeFormat(tag, { month: w }).format(new Date(2020, i, 1)).toLowerCase().replace(/\.$/, "");
            MONTHS[n2] = i;
            if (/^[a-zåäö]/.test(n2)) MONTHS[n2.slice(0, 3)] = i;
          }
        });
      });
    }
    const k = word.toLowerCase().replace(/\.$/, "");
    return MONTHS[k] != null ? MONTHS[k] : -1;
  }
  function parseDate(text) {
    const s = String(text || "").trim();
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s), y, mo, d;
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
    const dt = new Date(y, mo - 1, d);
    return dt.getMonth() === mo - 1 && dt.getDate() === d ? toISO(dt) : null;
  }
  function todayIn(timeZone) {
    const now = /* @__PURE__ */ new Date();
    if (!timeZone) return toISO(now);
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);
  }

  // src/DatePicker.tsx
  function useFormatDate() {
    const ctx = useAuraLocale(), locale = ctx.locale || "en", calendar = ctx.calendar;
    return React17.useCallback(
      function(iso, opts) {
        const o = opts || {}, loc = o.locale || locale;
        return formatDate(
          iso,
          Object.assign({}, o, {
            locale: loc,
            calendar: o.calendar || (o.locale ? void 0 : calendar) || defaultCalendar(loc)
          })
        );
      },
      [locale, calendar]
    );
  }
  var Calendar = React17.forwardRef(function Calendar2(props, ref) {
    const ctx = useAuraLocale(), locale = props.locale || ctx.locale || "en", calendar = props.calendar || ctx.calendar || defaultCalendar(locale), tag = localeTag(locale, calendar);
    const weekStart = props.weekStartsOn == null ? locale === "sv" ? 1 : 0 : props.weekStartsOn;
    const todayISO = props.today || todayIn(props.timeZone || ctx.timeZone);
    const today = fromISO(todayISO);
    const min = fromISO(props.min === "today" ? todayISO : props.min), max = fromISO(props.max === "today" ? todayISO : props.max);
    const start = fromISO(props.start), end = fromISO(props.end);
    const focusState = React17.useState(fromISO(props.focus) || start || today);
    const focusDate = focusState[0], setFocus = focusState[1];
    const viewState = React17.useState("days"), view = viewState[0], setView = viewState[1];
    const hoverState = React17.useState(null);
    const gridRef = React17.useRef(null), gridMerged = useMergedRef(ref, gridRef), moved = React17.useRef(false);
    const th = locale === "th";
    const dt = dateText(locale);
    function disabled(d) {
      return !!(min && d < min || max && d > max || props.isDateDisabled && props.isDateDisabled(toISO(d)));
    }
    React17.useEffect(function() {
      if (!moved.current) return;
      moved.current = false;
      const el = gridRef.current && gridRef.current.querySelector('[data-date="' + toISO(focusDate) + '"]');
      if (el) el.focus();
    });
    React17.useEffect(function() {
      if (props.autoFocus === false) return;
      const el = gridRef.current && gridRef.current.querySelector('[tabindex="0"]');
      if (el) el.focus();
    }, []);
    function move(d) {
      moved.current = true;
      setFocus(d);
    }
    const first = new Date(focusDate.getFullYear(), focusDate.getMonth(), 1);
    const lead = (first.getDay() - weekStart + 7) % 7;
    const gridStart = addDays(first, -lead);
    const days = [];
    for (let i = 0; i < 42; i++) days.push(addDays(gridStart, i));
    const weeks = [];
    for (let w = 0; w < 6; w++) weeks.push(days.slice(w * 7, w * 7 + 7));
    if (weeks[5][0].getMonth() !== focusDate.getMonth()) weeks.pop();
    function onKey(e, d) {
      let k = e.key, n2 = null;
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
    const hover = hoverState[0];
    const rangeEnd = end || (props.range && start && hover ? hover : null);
    function inRange(d) {
      if (!props.range || !start || !rangeEnd) return false;
      const a = start < rangeEnd ? start : rangeEnd, b = start < rangeEnd ? rangeEnd : start;
      return d > a && d < b;
    }
    const monthTitle = fmt(tag, { month: "long", year: "numeric" }, focusDate).replace(ERA, "");
    const weekdayNames = weeks[0].map(function(d) {
      return { short: fmt(tag, { weekday: th ? "narrow" : "short" }, d), long: fmt(tag, { weekday: "long" }, d) };
    });
    if (view === "years") {
      const yr = focusDate.getFullYear(), base = yr - yr % 12;
      const years = [];
      for (let y = base; y < base + 12; y++) years.push(y);
      return /* @__PURE__ */ React17.createElement("div", { className: "aura-cal", ref: gridMerged }, /* @__PURE__ */ React17.createElement("div", { className: "aura-cal__head" }, /* @__PURE__ */ React17.createElement(
        IconButton,
        {
          icon: "chevron-left",
          label: dt.prevYears,
          onClick: function() {
            setFocus(new Date(yr - 12, focusDate.getMonth(), 1));
          }
        }
      ), /* @__PURE__ */ React17.createElement(
        "button",
        {
          type: "button",
          className: "aura-cal__title",
          onClick: function() {
            setView("days");
          }
        },
        fmt(tag, { year: "numeric" }, new Date(base, 0, 1)).replace(ERA, "") + " \u2013 " + fmt(tag, { year: "numeric" }, new Date(base + 11, 0, 1)).replace(ERA, "")
      ), /* @__PURE__ */ React17.createElement(
        IconButton,
        {
          icon: "chevron-right",
          label: dt.nextYears,
          onClick: function() {
            setFocus(new Date(yr + 12, focusDate.getMonth(), 1));
          }
        }
      )), /* @__PURE__ */ React17.createElement("div", { className: "aura-cal__years" }, years.map(function(y) {
        const d = new Date(y, focusDate.getMonth(), 1);
        return /* @__PURE__ */ React17.createElement(
          "button",
          {
            key: y,
            type: "button",
            tabIndex: y === yr ? 0 : -1,
            className: cx("aura-cal__year", y === yr && "is-selected"),
            onClick: function() {
              setFocus(new Date(y, focusDate.getMonth(), Math.min(focusDate.getDate(), 28)));
              setView("days");
              moved.current = true;
            }
          },
          fmt(tag, { year: "numeric" }, d).replace(ERA, "")
        );
      })));
    }
    return /* @__PURE__ */ React17.createElement("div", { className: "aura-cal", ref: gridMerged }, /* @__PURE__ */ React17.createElement("div", { className: "aura-cal__head" }, /* @__PURE__ */ React17.createElement(
      IconButton,
      {
        icon: "chevron-left",
        label: dt.prevMonth,
        onClick: function() {
          setFocus(addMonths(focusDate, -1));
        }
      }
    ), /* @__PURE__ */ React17.createElement(
      "button",
      {
        type: "button",
        className: "aura-cal__title",
        "aria-live": "polite",
        onClick: function() {
          setView("years");
        }
      },
      monthTitle,
      /* @__PURE__ */ React17.createElement(Icon, { name: "chevron-down", size: 14 })
    ), /* @__PURE__ */ React17.createElement(
      IconButton,
      {
        icon: "chevron-right",
        label: dt.nextMonth,
        onClick: function() {
          setFocus(addMonths(focusDate, 1));
        }
      }
    )), /* @__PURE__ */ React17.createElement("table", { role: "grid", className: "aura-cal__grid", "aria-label": monthTitle }, /* @__PURE__ */ React17.createElement("thead", null, /* @__PURE__ */ React17.createElement("tr", null, weekdayNames.map(function(n2, i) {
      return /* @__PURE__ */ React17.createElement("th", { key: i, scope: "col", abbr: n2.long }, /* @__PURE__ */ React17.createElement("span", { "aria-hidden": true }, n2.short));
    }))), /* @__PURE__ */ React17.createElement(
      "tbody",
      {
        onMouseLeave: function() {
          hoverState[1](null);
        }
      },
      weeks.map(function(wk, wi) {
        return /* @__PURE__ */ React17.createElement("tr", { key: wi }, wk.map(function(d) {
          const iso = toISO(d), out = d.getMonth() !== focusDate.getMonth(), dis = disabled(d);
          const isStart = same(d, start), isEnd = same(d, end) || !end && props.range && same(d, hover) && start;
          const sel = isStart || same(d, end);
          return /* @__PURE__ */ React17.createElement(
            "td",
            {
              key: iso,
              role: "gridcell",
              "aria-selected": sel || void 0,
              className: cx(
                inRange(d) && "is-in-range",
                props.range && isStart && rangeEnd && "is-range-start",
                props.range && isEnd && start && "is-range-end"
              )
            },
            /* @__PURE__ */ React17.createElement(
              "button",
              {
                type: "button",
                "data-date": iso,
                tabIndex: same(d, focusDate) ? 0 : -1,
                disabled: dis,
                "aria-label": fmt(tag, { weekday: "long", day: "numeric", month: "long", year: "numeric" }, d),
                suppressHydrationWarning: true,
                "aria-current": same(d, today) ? "date" : void 0,
                "aria-pressed": sel || void 0,
                className: cx(
                  "aura-cal__day",
                  out && "is-outside",
                  sel && "is-selected",
                  same(d, today) && "is-today"
                ),
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
              },
              d.getDate()
            )
          );
        }));
      })
    )), props.footer === false ? null : /* @__PURE__ */ React17.createElement("div", { className: "aura-cal__foot" }, /* @__PURE__ */ React17.createElement(
      "button",
      {
        type: "button",
        className: "aura-cal__link",
        disabled: disabled(today),
        onClick: function() {
          move(today);
          props.onSelect(toISO(today));
        }
      },
      dt.today
    ), props.onClear ? /* @__PURE__ */ React17.createElement("button", { type: "button", className: "aura-cal__link", onClick: props.onClear }, dt.clear) : null));
  });
  function useCalendarPopover(boxRef) {
    const openState = React17.useState(false), open = openState[0], setOpen = openState[1];
    const pos = React17.useState(null), popRef = React17.useRef(null), mounted = useMounted();
    function place() {
      if (!boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect(), H = 380;
      const up = window.innerHeight - r.bottom < H && r.top > H;
      const left = Math.max(8, Math.min(r.left, window.innerWidth - 320 - 8));
      pos[1](up ? { left, bottom: window.innerHeight - r.top + 4 } : { left, top: r.bottom + 4 });
    }
    useIsoLayoutEffect(
      function() {
        if (open) place();
      },
      [open]
    );
    React17.useEffect(
      function() {
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
      },
      [open]
    );
    return { open, setOpen, pos: pos[0], popRef, mounted };
  }
  function DateField(props) {
    const editState = React17.useState(null), editing = editState[0], setEditing = editState[1];
    return /* @__PURE__ */ React17.createElement(
      Field,
      {
        id: props.id,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React17.createElement("div", { ref: props.boxRef, className: cx("aura-input aura-date", props.open && "is-open") }, /* @__PURE__ */ React17.createElement(
        "input",
        {
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
        }
      ), props.clearable !== false && props.hasValue && !props.disabled ? /* @__PURE__ */ React17.createElement(
        "button",
        {
          type: "button",
          tabIndex: -1,
          className: "aura-combo__clear",
          "aria-label": props.clearLabel,
          onClick: props.onClear
        },
        /* @__PURE__ */ React17.createElement(Icon, { name: "x" })
      ) : null, /* @__PURE__ */ React17.createElement(
        "button",
        {
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
        },
        /* @__PURE__ */ React17.createElement(Icon, { name: "calendar" })
      ))
    );
  }
  var DatePicker = React17.forwardRef(function DatePicker2(props, ref) {
    const auto = uid(), id = props.id || auto, dialogId = id + "-cal";
    const ctx = useAuraLocale(), locale = props.locale || ctx.locale || "en", calendar = props.calendar || ctx.calendar || defaultCalendar(locale), dt = dateText(locale);
    const st = useMaybeControlled(
      props.value,
      props.defaultValue == null ? null : props.defaultValue,
      props.onChange
    );
    const boxRef = React17.useRef(null), inputRef = React17.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    const pop = useCalendarPopover(boxRef);
    function commit(text) {
      if (!text.trim()) {
        st[1](null);
        return;
      }
      const iso = parseDate(text);
      if (iso) st[1](iso);
    }
    function close() {
      pop.setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    const cal = pop.open && pop.mounted && pop.pos ? (0, import_react_dom3.createPortal)(
      /* @__PURE__ */ React17.createElement(
        "div",
        {
          ref: pop.popRef,
          id: dialogId,
          role: "dialog",
          "aria-modal": false,
          "aria-label": props.label || dt.chooseDate,
          className: "aura-cal__popover",
          style: pop.pos,
          onKeyDown: function(e) {
            if (e.key === "Escape") {
              e.stopPropagation();
              close();
            } else trapTab(e, pop.popRef.current);
          }
        },
        /* @__PURE__ */ React17.createElement(
          Calendar,
          {
            locale,
            calendar,
            weekStartsOn: props.weekStartsOn,
            min: props.min,
            max: props.max,
            timeZone: props.timeZone,
            today: props.today,
            isDateDisabled: props.isDateDisabled,
            start: st[0],
            focus: st[0],
            onSelect: function(iso) {
              st[1](iso);
              close();
            }
          }
        )
      ),
      document.body
    ) : null;
    return /* @__PURE__ */ React17.createElement(React17.Fragment, null, /* @__PURE__ */ React17.createElement(
      DateField,
      {
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
        placeholder: props.placeholder || dt.datePlaceholder,
        hasValue: st[0] != null,
        clearable: props.clearable,
        onClear: function() {
          st[1](null);
          inputRef.current && inputRef.current.focus();
        },
        clearLabel: dt.clearDate,
        toggleLabel: dt.openCalendar,
        onCommit: commit,
        onToggle: function(o) {
          pop.setOpen(o);
          if (!o && inputRef.current) inputRef.current.focus();
        }
      }
    ), cal);
  });
  var DateRangePicker = React17.forwardRef(
    function DateRangePicker2(props, ref) {
      const auto = uid(), id = props.id || auto, dialogId = id + "-cal";
      const ctx = useAuraLocale(), locale = props.locale || ctx.locale || "en", calendar = props.calendar || ctx.calendar || defaultCalendar(locale), dt = dateText(locale);
      const st = useMaybeControlled(
        props.value,
        props.defaultValue || { start: null, end: null },
        props.onChange
      );
      const v = st[0] || { start: null, end: null };
      const draft = React17.useState(null);
      const boxRef = React17.useRef(null), inputRef = React17.useRef(null), inputMerged = useMergedRef(ref, inputRef);
      const pop = useCalendarPopover(boxRef);
      const o = { locale, calendar };
      function show2(r) {
        if (!r.start) return "";
        if (!r.end) return formatDate(r.start, o) + " \u2013";
        return formatDate(r.start, o) + " \u2013 " + formatDate(r.end, o);
      }
      function commit(text) {
        const parts = String(text).split(/\s[–-]\s|\s*–\s*/);
        if (!text.trim()) {
          st[1]({ start: null, end: null });
          return;
        }
        const a = parseDate(parts[0]), b = parseDate(parts[1] || "");
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
        const a = draft[0], b = iso;
        st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
        close();
      }
      const cal = pop.open && pop.mounted && pop.pos ? (0, import_react_dom3.createPortal)(
        /* @__PURE__ */ React17.createElement(
          "div",
          {
            ref: pop.popRef,
            id: dialogId,
            role: "dialog",
            "aria-modal": false,
            "aria-label": props.label || dt.chooseDates,
            className: "aura-cal__popover",
            style: pop.pos,
            onKeyDown: function(e) {
              if (e.key === "Escape") {
                e.stopPropagation();
                close();
              } else trapTab(e, pop.popRef.current);
            }
          },
          /* @__PURE__ */ React17.createElement("p", { className: "aura-cal__hint", "aria-live": "polite" }, draft[0] ? dt.chooseEnd : dt.chooseStart),
          /* @__PURE__ */ React17.createElement(
            Calendar,
            {
              range: true,
              locale,
              calendar,
              weekStartsOn: props.weekStartsOn,
              min: props.min,
              max: props.max,
              timeZone: props.timeZone,
              today: props.today,
              isDateDisabled: props.isDateDisabled,
              start: draft[0] || v.start,
              end: draft[0] ? null : v.end,
              focus: draft[0] || v.start,
              onSelect: pick
            }
          )
        ),
        document.body
      ) : null;
      return /* @__PURE__ */ React17.createElement(React17.Fragment, null, /* @__PURE__ */ React17.createElement(
        DateField,
        {
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
          display: show2(v),
          placeholder: props.placeholder || dt.rangePlaceholder,
          hasValue: v.start != null,
          clearable: props.clearable,
          onClear: function() {
            st[1]({ start: null, end: null });
            inputRef.current && inputRef.current.focus();
          },
          clearLabel: dt.clearDates,
          toggleLabel: dt.openCalendar,
          onCommit: commit,
          onToggle: function(op) {
            pop.setOpen(op);
            draft[1](null);
            if (!op && inputRef.current) inputRef.current.focus();
          }
        }
      ), cal);
    }
  );

  // src/Alert.tsx
  var React18 = __toESM(require_react(), 1);
  var ALERT_ICON = {
    info: "info",
    success: "circle-check",
    warning: "triangle-alert",
    danger: "circle-alert"
  };
  var Alert = React18.forwardRef(function Alert2(props, ref) {
    const t = useStrings();
    const tone2 = props.tone || "info";
    return /* @__PURE__ */ React18.createElement(
      "div",
      {
        ref,
        className: cx("aura-alert", "aura-alert--" + tone2, props.className),
        role: tone2 === "danger" || tone2 === "warning" ? "alert" : "status"
      },
      /* @__PURE__ */ React18.createElement(Icon, { name: ALERT_ICON[tone2], className: "aura-alert__icon" }),
      /* @__PURE__ */ React18.createElement("div", { className: "aura-alert__body" }, props.title ? /* @__PURE__ */ React18.createElement("p", { className: "aura-alert__title" }, props.title) : null, props.children ? /* @__PURE__ */ React18.createElement("div", { className: "aura-alert__text" }, props.children) : null, props.action ? /* @__PURE__ */ React18.createElement("div", { className: "aura-alert__action" }, props.action) : null),
      props.onDismiss ? /* @__PURE__ */ React18.createElement(IconButton, { icon: "x", label: t.dismiss, className: "aura-alert__close", onClick: props.onDismiss }) : null
    );
  });

  // src/Toaster.tsx
  var React19 = __toESM(require_react(), 1);
  var import_react_dom4 = __toESM(require_react_dom(), 1);
  var MAX_VISIBLE = 3;
  var toastState = {
    list: [],
    queue: [],
    subs: [],
    n: 0
  };
  function promote() {
    while (toastState.list.length < MAX_VISIBLE && toastState.queue.length) {
      toastState.list = toastState.list.concat([toastState.queue[0]]);
      toastState.queue = toastState.queue.slice(1);
    }
  }
  function emitToasts() {
    toastState.subs.forEach(function(f) {
      f(toastState.list.slice());
    });
  }
  function show(opts) {
    const id = opts.id || "t" + ++toastState.n;
    const byId = function(t) {
      return t.id === id;
    };
    const at = toastState.list.findIndex(byId), queued = toastState.queue.findIndex(byId);
    const prev = at >= 0 ? toastState.list[at] : queued >= 0 ? toastState.queue[queued] : null;
    const entry = Object.assign({ tone: "info" }, opts, {
      id,
      loading: !!opts.loading,
      rev: prev ? prev.rev + 1 : 0
    });
    if (at >= 0) {
      toastState.list = toastState.list.slice();
      toastState.list[at] = entry;
    } else if (queued >= 0) {
      toastState.queue = toastState.queue.slice();
      toastState.queue[queued] = entry;
    } else if (toastState.list.length < MAX_VISIBLE) toastState.list = toastState.list.concat([entry]);
    else toastState.queue = toastState.queue.concat([entry]);
    emitToasts();
    return id;
  }
  function toast(opts) {
    return show(typeof opts === "string" ? { title: opts } : opts);
  }
  function shorthand(tone2) {
    return function(title, opts) {
      return show(Object.assign({}, opts, { title, tone: tone2 }));
    };
  }
  toast.success = shorthand("success");
  toast.error = shorthand("danger");
  toast.warning = shorthand("warning");
  toast.info = shorthand("info");
  toast.loading = function(title, opts) {
    return show(
      Object.assign({}, opts, { title, tone: "info", loading: true, duration: Infinity })
    );
  };
  toast.dismiss = function(id) {
    const keep = function(t) {
      return t.id !== id;
    };
    toastState.list = toastState.list.filter(keep);
    toastState.queue = toastState.queue.filter(keep);
    promote();
    emitToasts();
  };
  function ToastItem(props) {
    const str = useStrings();
    const t = props.toast, timer = React19.useRef(null), left = React19.useRef(t.duration || 5e3), since = React19.useRef(0);
    const hover = React19.useRef(false);
    function start() {
      if (left.current === Infinity || timer.current) return;
      since.current = Date.now();
      timer.current = setTimeout(function() {
        toast.dismiss(t.id);
      }, left.current);
    }
    function resume() {
      hover.current = false;
      start();
    }
    function pause() {
      hover.current = true;
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        left.current -= Date.now() - since.current;
      }
    }
    React19.useEffect(
      function() {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        left.current = t.duration || 5e3;
        if (!hover.current) start();
        return function() {
          if (timer.current) clearTimeout(timer.current);
        };
      },
      [t.rev]
    );
    return /* @__PURE__ */ React19.createElement(
      "div",
      {
        className: cx("aura-toast", "aura-toast--" + t.tone, t.loading && "is-loading"),
        role: t.tone === "danger" ? "alert" : "status",
        "aria-busy": t.loading || void 0,
        onMouseEnter: pause,
        onMouseLeave: resume,
        onFocus: pause,
        onBlur: resume
      },
      /* @__PURE__ */ React19.createElement(
        Icon,
        {
          name: t.loading ? "loader-circle" : ALERT_ICON[t.tone] || "info",
          className: cx("aura-toast__icon", t.loading && "aura-spin")
        }
      ),
      /* @__PURE__ */ React19.createElement("div", { className: "aura-toast__body" }, /* @__PURE__ */ React19.createElement("p", { className: "aura-toast__title" }, t.title), t.description ? /* @__PURE__ */ React19.createElement("p", { className: "aura-toast__text" }, t.description) : null),
      t.action ? /* @__PURE__ */ React19.createElement(
        "button",
        {
          type: "button",
          className: "aura-toast__action",
          onClick: function() {
            t.action.onClick && t.action.onClick();
            toast.dismiss(t.id);
          }
        },
        t.action.label
      ) : null,
      /* @__PURE__ */ React19.createElement(
        IconButton,
        {
          icon: "x",
          label: str.dismissToast,
          className: "aura-toast__close",
          onClick: function() {
            toast.dismiss(t.id);
          }
        }
      )
    );
  }
  function Toaster(props) {
    const t = useStrings();
    const mounted = useMounted();
    const s = React19.useState(toastState.list);
    React19.useEffect(function() {
      toastState.subs.push(s[1]);
      return function() {
        toastState.subs = toastState.subs.filter(function(f) {
          return f !== s[1];
        });
      };
    }, []);
    if (!mounted) return null;
    return (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ React19.createElement(
        "div",
        {
          className: cx("aura-toaster", props && props.position === "top" && "is-top"),
          role: "region",
          "aria-live": "polite",
          "aria-label": t.notifications
        },
        s[0].map(function(t2) {
          return /* @__PURE__ */ React19.createElement(ToastItem, { key: t2.id, toast: t2 });
        })
      ),
      document.body
    );
  }

  // src/PasswordField.tsx
  var React20 = __toESM(require_react(), 1);
  var PasswordField = React20.forwardRef(function PasswordField2(props, ref) {
    const t = useStrings();
    const shown = React20.useState(false);
    const rest = omit(props, ["toggle", "className"]);
    return /* @__PURE__ */ React20.createElement(
      TextField,
      {
        autoComplete: "current-password",
        ...rest,
        ref,
        type: shown[0] ? "text" : "password",
        spellCheck: false,
        autoCapitalize: "none",
        className: cx("aura-password", props.className),
        suffix: props.toggle === false ? void 0 : /* @__PURE__ */ React20.createElement(
          IconButton,
          {
            icon: shown[0] ? "eye-off" : "eye",
            label: t.showPassword,
            "aria-pressed": shown[0],
            disabled: props.disabled,
            onClick: function() {
              shown[1](!shown[0]);
            }
          }
        )
      }
    );
  });

  // src/FormErrorSummary.tsx
  var React21 = __toESM(require_react(), 1);
  function items(errors) {
    if (Array.isArray(errors)) return errors;
    const out = [];
    for (const k in errors || {}) {
      const e = errors[k];
      if (e && e.message) out.push({ field: k, message: e.message });
    }
    return out;
  }
  function fieldElement(field) {
    if (typeof document === "undefined") return null;
    return document.getElementById(field) || document.querySelector('[name="' + field.replace(/"/g, '\\"') + '"]');
  }
  var FormErrorSummary = React21.forwardRef(
    function FormErrorSummary2(props, ref) {
      const t = useStrings();
      const auto = uid(), id = props.id || auto;
      const list = items(props.errors);
      const box = React21.useRef(null);
      React21.useEffect(
        function() {
          const has = list.length > 0;
          if (has && box.current) box.current.focus();
        },
        /* focus when errors first appear, and again whenever focusKey changes (each submit) */
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [list.length > 0, props.focusKey]
      );
      if (!list.length) return null;
      return /* @__PURE__ */ React21.createElement(
        "div",
        {
          ref: function(el) {
            box.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          },
          id,
          tabIndex: -1,
          role: "alert",
          "aria-labelledby": id + "-title",
          className: cx("aura-alert aura-alert--danger aura-error-summary", props.className)
        },
        /* @__PURE__ */ React21.createElement(Icon, { name: "circle-alert", className: "aura-alert__icon" }),
        /* @__PURE__ */ React21.createElement("div", { className: "aura-alert__body" }, /* @__PURE__ */ React21.createElement("h2", { className: "aura-alert__title", id: id + "-title" }, props.title || t.errorSummary(list.length)), /* @__PURE__ */ React21.createElement("ul", { className: "aura-error-summary__list" }, list.map(function(e) {
          return /* @__PURE__ */ React21.createElement("li", { key: e.field }, /* @__PURE__ */ React21.createElement(
            "a",
            {
              href: "#" + e.field,
              onClick: function(ev) {
                ev.preventDefault();
                if (props.onSelect) {
                  props.onSelect(e.field);
                  return;
                }
                const el = fieldElement(e.field);
                if (el) {
                  el.scrollIntoView({ block: "center" });
                  el.focus();
                }
              }
            },
            e.message
          ));
        })))
      );
    }
  );

  // src/FilterBar.tsx
  var React23 = __toESM(require_react(), 1);

  // src/Tag.tsx
  var React22 = __toESM(require_react(), 1);
  var Tag = React22.forwardRef(function Tag2(props, ref) {
    const t = useStrings();
    const selectable = props.onClick != null || props.selected != null;
    const rest = omit(props, ["onRemove", "selected", "icon", "className", "children", "disabled", "removeLabel"]);
    const inner = [
      props.icon ? /* @__PURE__ */ React22.createElement(Icon, { key: "i", name: props.icon, size: 14 }) : null,
      /* @__PURE__ */ React22.createElement("span", { key: "t", className: "aura-tag__text" }, props.children)
    ];
    if (selectable) {
      return /* @__PURE__ */ React22.createElement(
        "button",
        {
          ...rest,
          ref,
          type: "button",
          "aria-pressed": !!props.selected,
          disabled: props.disabled,
          className: cx("aura-tag is-selectable", props.selected && "is-selected", props.className)
        },
        props.selected ? /* @__PURE__ */ React22.createElement(Icon, { name: "check", size: 14 }) : inner[0],
        inner[1]
      );
    }
    return /* @__PURE__ */ React22.createElement("span", { ...rest, ref, className: cx("aura-tag", props.disabled && "is-disabled", props.className) }, inner, props.onRemove && !props.disabled ? /* @__PURE__ */ React22.createElement(
      "button",
      {
        type: "button",
        className: "aura-tag__remove",
        "aria-label": props.removeLabel || t.remove(typeof props.children === "string" ? props.children : ""),
        onClick: props.onRemove
      },
      /* @__PURE__ */ React22.createElement(Icon, { name: "x", size: 12 })
    ) : null);
  });

  // src/FilterBar.tsx
  var FilterBar = React23.forwardRef(function FilterBar2(props, ref) {
    const t = useStrings();
    const id = uid();
    const hasSearch = !!props.onSearchChange;
    const draft = React23.useState(props.search || "");
    const timer = React23.useRef(null);
    const sent = React23.useRef(props.search || "");
    const onChange = React23.useRef(props.onSearchChange);
    onChange.current = props.onSearchChange;
    React23.useEffect(
      function() {
        if ((props.search || "") !== sent.current) {
          sent.current = props.search || "";
          draft[1](props.search || "");
        }
      },
      [props.search]
    );
    React23.useEffect(function() {
      return function() {
        if (timer.current) clearTimeout(timer.current);
      };
    }, []);
    function send(v) {
      if (timer.current) clearTimeout(timer.current);
      timer.current = null;
      if (v === sent.current) return;
      sent.current = v;
      if (onChange.current) onChange.current(v);
    }
    function type(v) {
      draft[1](v);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(
        function() {
          send(v);
        },
        props.searchDelay == null ? 300 : props.searchDelay
      );
    }
    const filters = props.filters || [];
    const anything = filters.length > 0 || !!(props.search || draft[0]);
    const count = props.resultCount == null ? null : typeof props.resultCount === "number" ? t.results(props.resultCount) : props.resultCount;
    return /* @__PURE__ */ React23.createElement(
      "div",
      {
        ref,
        role: "region",
        "aria-label": props.label || t.filters,
        className: cx("aura-filterbar", props.className)
      },
      /* @__PURE__ */ React23.createElement("div", { className: "aura-filterbar__row" }, hasSearch ? /* @__PURE__ */ React23.createElement("div", { className: "aura-input has-icon aura-filterbar__search" }, /* @__PURE__ */ React23.createElement(Icon, { name: "search", className: "aura-input__icon" }), /* @__PURE__ */ React23.createElement(
        "input",
        {
          id,
          type: "search",
          className: "aura-input__control",
          "aria-label": props.searchLabel || t.search,
          placeholder: props.searchPlaceholder || props.searchLabel || t.search,
          value: draft[0],
          onChange: function(e) {
            type(e.target.value);
          },
          onKeyDown: function(e) {
            if (e.key === "Enter") send(draft[0]);
            if (e.key === "Escape" && draft[0]) {
              e.preventDefault();
              draft[1]("");
              send("");
            }
          }
        }
      ), draft[0] ? /* @__PURE__ */ React23.createElement(
        IconButton,
        {
          icon: "x",
          label: t.clear((props.searchLabel || t.search).toLowerCase()),
          className: "aura-filterbar__clear-search",
          onClick: function() {
            draft[1]("");
            send("");
          }
        }
      ) : null) : null, props.children ? /* @__PURE__ */ React23.createElement("div", { className: "aura-filterbar__controls" }, props.children) : null, /* @__PURE__ */ React23.createElement("span", { className: "aura-filterbar__spacer" }), count != null ? /* @__PURE__ */ React23.createElement("span", { className: "aura-filterbar__count", "aria-live": "polite" }, count) : null, props.actions ? /* @__PURE__ */ React23.createElement("div", { className: "aura-filterbar__actions" }, props.actions) : null),
      filters.length || props.onClearAll && anything ? /* @__PURE__ */ React23.createElement("div", { className: "aura-filterbar__chips" }, filters.map(function(f) {
        return /* @__PURE__ */ React23.createElement(Tag, { key: f.id, onRemove: f.onRemove }, f.label);
      }), props.onClearAll && anything ? /* @__PURE__ */ React23.createElement(
        "button",
        {
          type: "button",
          className: "aura-filterbar__clear",
          onClick: function() {
            draft[1]("");
            sent.current = "";
            if (timer.current) clearTimeout(timer.current);
            props.onClearAll();
          }
        },
        t.clearFilters
      ) : null) : null
    );
  });

  // src/Command.tsx
  var React25 = __toESM(require_react(), 1);
  var import_react_dom5 = __toESM(require_react_dom(), 1);

  // src/useModal.tsx
  var React24 = __toESM(require_react(), 1);
  function useModal(open, ref, opts) {
    const mounted = useMounted();
    const prev = React24.useRef(null);
    const o = opts || {};
    React24.useEffect(
      function() {
        if (!open || !mounted) return;
        prev.current = document.activeElement;
        const body = document.body, overflow = body.style.overflow;
        body.style.overflow = "hidden";
        const el = ref.current;
        const target = el && (el.querySelector("[data-autofocus]") || el.querySelector(o.bodySelector + " " + FOCUSABLE) || el.querySelector(o.footSelector + " " + FOCUSABLE) || el);
        if (target && o.autoFocus !== false) target.focus();
        return function() {
          body.style.overflow = overflow;
          if (prev.current && prev.current.focus) prev.current.focus();
        };
      },
      [open, mounted]
    );
    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.stopPropagation();
        if (o.onEscape) o.onEscape();
        return;
      }
      if (e.key !== "Tab" || !ref.current) return;
      const list = Array.prototype.slice.call(ref.current.querySelectorAll(FOCUSABLE));
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0], last = list[list.length - 1];
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

  // src/Command.tsx
  function isMac() {
    return typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  }
  function Command(props) {
    const t = useStrings();
    const density = useDensity();
    const id = uid(), listId = id + "-list";
    const box = React25.useRef(null);
    const input = React25.useRef(null);
    const qState = React25.useState(""), act = React25.useState(null);
    const query = props.query !== void 0 ? props.query : qState[0];
    function setQuery(v) {
      if (props.query === void 0) qState[1](v);
      if (props.onQueryChange) props.onQueryChange(v);
    }
    const openRef = React25.useRef(props.open);
    openRef.current = props.open;
    const close = function() {
      props.onOpenChange(false);
    };
    const modal = useModal(props.open, box, { onEscape: close });
    React25.useEffect(
      function() {
        if (props.hotkey === false) return;
        function onKey2(e) {
          if ((e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey && (e.key === "k" || e.key === "K")) {
            e.preventDefault();
            props.onOpenChange(!openRef.current);
          }
        }
        document.addEventListener("keydown", onKey2, true);
        return function() {
          document.removeEventListener("keydown", onKey2, true);
        };
      },
      [props.hotkey, props.onOpenChange]
    );
    React25.useEffect(
      function() {
        if (!props.open) {
          if (query) setQuery("");
          act[1](null);
        }
      },
      [props.open]
    );
    const filter = props.filter === false ? null : props.filter || defaultFilter;
    const shown = (props.items || []).filter(function(it) {
      return !filter || filter(it, query);
    });
    const groups = [];
    shown.forEach(function(it) {
      const name = it.group || "";
      let g = groups.filter(function(x) {
        return x.name === name;
      })[0];
      if (!g) groups.push(g = { name, items: [] });
      g.items.push(it);
    });
    const flat = [];
    groups.forEach(function(g) {
      g.items.forEach(function(it) {
        flat.push(it);
      });
    });
    const enabled = flat.map(function(it, i2) {
      return it.disabled ? -1 : i2;
    }).filter(function(i2) {
      return i2 >= 0;
    });
    const byId = act[0] == null ? -1 : flat.findIndex(function(it) {
      return it.id === act[0];
    });
    const active = enabled.indexOf(byId) >= 0 ? byId : enabled.length ? enabled[0] : -1;
    const optId = function(i2) {
      return id + "-o" + i2;
    };
    React25.useEffect(
      function() {
        if (!box.current || active < 0) return;
        const el = box.current.querySelector("#" + CSS.escape(optId(active)));
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
      },
      [active]
    );
    function run(it) {
      if (it.disabled) return;
      close();
      if (it.onSelect) it.onSelect();
      if (props.onSelect) props.onSelect(it);
    }
    function move(dir) {
      if (!enabled.length) return;
      const at = enabled.indexOf(active);
      let n2;
      if (dir === "first") n2 = 0;
      else if (dir === "last") n2 = enabled.length - 1;
      else n2 = (at + dir + enabled.length) % enabled.length;
      act[1](flat[enabled[n2]].id);
    }
    function onKey(e) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        move(1);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        move(-1);
      } else if (e.key === "Home" && e.ctrlKey) {
        e.preventDefault();
        move("first");
      } else if (e.key === "End" && e.ctrlKey) {
        e.preventDefault();
        move("last");
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (active >= 0) run(flat[active]);
      }
    }
    if (!modal.ready) return null;
    let i = -1;
    return (0, import_react_dom5.createPortal)(
      /* @__PURE__ */ React25.createElement(
        "div",
        {
          className: "aura-dialog-layer aura-command-layer",
          "data-density": density,
          onKeyDown: function(e) {
            modal.onKeyDown(e);
            e.stopPropagation();
          }
        },
        /* @__PURE__ */ React25.createElement("div", { className: "aura-scrim", onClick: close, "aria-hidden": true }),
        /* @__PURE__ */ React25.createElement(
          "div",
          {
            ref: box,
            role: "dialog",
            "aria-modal": true,
            "aria-label": props.label || t.commandMenu,
            tabIndex: -1,
            className: cx("aura-command", props.className)
          },
          /* @__PURE__ */ React25.createElement("div", { className: "aura-command__search" }, /* @__PURE__ */ React25.createElement(Icon, { name: "search", className: "aura-command__search-icon" }), /* @__PURE__ */ React25.createElement(
            "input",
            {
              ref: input,
              "data-autofocus": "",
              type: "text",
              role: "combobox",
              "aria-expanded": flat.length > 0,
              "aria-controls": flat.length ? listId : void 0,
              "aria-autocomplete": "list",
              "aria-activedescendant": active >= 0 ? optId(active) : void 0,
              "aria-label": props.label || t.commandMenu,
              placeholder: props.placeholder || t.commandPlaceholder,
              className: "aura-command__input",
              value: query,
              autoComplete: "off",
              spellCheck: false,
              onChange: function(e) {
                setQuery(e.target.value);
                act[1](null);
              },
              onKeyDown: onKey
            }
          ), /* @__PURE__ */ React25.createElement("kbd", { className: "aura-command__kbd" }, "Esc")),
          /* @__PURE__ */ React25.createElement("div", { className: "aura-command__list", "aria-busy": props.loading || void 0 }, props.loading ? /* @__PURE__ */ React25.createElement("div", { className: "aura-command__loading" }, /* @__PURE__ */ React25.createElement(Icon, { name: "loader-circle", className: "aura-spin" }), t.searching) : null, !flat.length ? props.loading ? null : /* @__PURE__ */ React25.createElement("div", { className: "aura-command__empty" }, props.empty != null ? props.empty : props.emptyText || t.noMatches) : /* @__PURE__ */ React25.createElement(
            "div",
            {
              id: listId,
              role: "listbox",
              "aria-label": props.label || t.commandMenu,
              "aria-busy": props.loading || void 0
            },
            groups.map(function(g, gi) {
              const gid = id + "-g" + gi;
              return /* @__PURE__ */ React25.createElement(
                "div",
                {
                  key: g.name || gi,
                  role: "group",
                  "aria-labelledby": g.name ? gid : void 0,
                  className: "aura-command__group"
                },
                g.name ? /* @__PURE__ */ React25.createElement("div", { className: "aura-command__heading", id: gid, role: "presentation" }, g.name) : null,
                g.items.map(function(it) {
                  i++;
                  const n2 = i;
                  return /* @__PURE__ */ React25.createElement(
                    "div",
                    {
                      key: it.id,
                      id: optId(n2),
                      role: "option",
                      "aria-selected": n2 === active,
                      "aria-disabled": it.disabled || void 0,
                      className: cx(
                        "aura-command__item",
                        n2 === active && "is-active",
                        it.disabled && "is-disabled"
                      ),
                      onPointerDown: function(e) {
                        e.preventDefault();
                      },
                      onPointerMove: function() {
                        if (!it.disabled && act[0] !== it.id) act[1](it.id);
                      },
                      onClick: function() {
                        run(it);
                      }
                    },
                    it.icon ? /* @__PURE__ */ React25.createElement(Icon, { name: it.icon }) : null,
                    /* @__PURE__ */ React25.createElement("span", { className: "aura-command__text" }, /* @__PURE__ */ React25.createElement("span", { className: "aura-command__label" }, it.label), it.description ? /* @__PURE__ */ React25.createElement("span", { className: "aura-command__desc" }, it.description) : null),
                    it.shortcut ? /* @__PURE__ */ React25.createElement("kbd", { className: "aura-command__kbd" }, it.shortcut) : null
                  );
                })
              );
            })
          )),
          /* @__PURE__ */ React25.createElement("span", { className: "aura-sr-only", role: "status" }, props.loading ? t.searching : query && !flat.length ? t.noMatches : props.loading === false && query ? t.results(flat.length) : ""),
          /* @__PURE__ */ React25.createElement("div", { className: "aura-command__foot", "aria-hidden": true }, t.commandHint, /* @__PURE__ */ React25.createElement("span", { className: "aura-command__mod" }, isMac() ? "\u2318K" : "Ctrl K"))
        )
      ),
      document.body
    );
  }

  // src/Tooltip.tsx
  var React26 = __toESM(require_react(), 1);
  var import_react_dom6 = __toESM(require_react_dom(), 1);
  var Tooltip = React26.forwardRef(function Tooltip2(props, ref) {
    const id = uid(), st = React26.useState(false), open = props.open !== void 0 ? props.open : st[0], set = st[1];
    const anchor = React26.useRef(null), anchorMerged = useMergedRef(ref, anchor), tip = React26.useRef(null), timer = React26.useRef(void 0);
    const pos = React26.useState(null);
    function show2(now) {
      clearTimeout(timer.current);
      timer.current = setTimeout(
        function() {
          set(true);
        },
        now ? 0 : props.delay == null ? 400 : props.delay
      );
    }
    function hide() {
      clearTimeout(timer.current);
      set(false);
    }
    useIsoLayoutEffect(
      function() {
        if (!open || !anchor.current || !tip.current) return;
        const r = anchor.current.getBoundingClientRect(), t = tip.current.getBoundingClientRect();
        let side = props.side || "top", top = side === "top" ? r.top - t.height - 8 : r.bottom + 8;
        if (side === "top" && top < 8) top = r.bottom + 8;
        const left = Math.max(8, Math.min(r.left + r.width / 2 - t.width / 2, window.innerWidth - t.width - 8));
        pos[1]({ top, left });
      },
      [open]
    );
    React26.useEffect(
      function() {
        if (!open) return;
        function esc(e) {
          if (e.key === "Escape") hide();
        }
        document.addEventListener("keydown", esc);
        return function() {
          document.removeEventListener("keydown", esc);
        };
      },
      [open]
    );
    const child = React26.Children.only(props.children);
    const trigger = /* @__PURE__ */ React26.createElement(
      "span",
      {
        ref: anchorMerged,
        className: "aura-tooltip-anchor",
        onMouseEnter: function() {
          show2(false);
        },
        onMouseLeave: hide,
        onFocus: function() {
          show2(true);
        },
        onBlur: hide
      },
      React26.cloneElement(child, { "aria-describedby": open ? id : child.props["aria-describedby"] })
    );
    return /* @__PURE__ */ React26.createElement(React26.Fragment, null, trigger, open ? (0, import_react_dom6.createPortal)(
      /* @__PURE__ */ React26.createElement(
        "div",
        {
          ref: tip,
          id,
          role: "tooltip",
          className: "aura-tooltip",
          style: { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }
        },
        props.content
      ),
      document.body
    ) : null);
  });

  // src/Dialog.tsx
  var React27 = __toESM(require_react(), 1);
  var import_react_dom7 = __toESM(require_react_dom(), 1);
  var Dialog = React27.forwardRef(function Dialog2(props, ref) {
    const t = useStrings();
    const density = useDensity();
    const own = React27.useRef(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
    function close() {
      if (props.dismissible !== false && props.onClose) props.onClose();
    }
    const modal = useModal(props.open, own, {
      autoFocus: props.autoFocus,
      onEscape: close,
      bodySelector: ".aura-dialog__body",
      footSelector: ".aura-dialog__foot"
    });
    if (!modal.ready) return null;
    return (0, import_react_dom7.createPortal)(
      /* @__PURE__ */ React27.createElement("div", { className: "aura-dialog-layer", "data-density": density, onKeyDown: modal.onKeyDown }, /* @__PURE__ */ React27.createElement("div", { className: "aura-scrim", onClick: close, "aria-hidden": true }), /* @__PURE__ */ React27.createElement(
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
        /* @__PURE__ */ React27.createElement("div", { className: "aura-dialog__head" }, /* @__PURE__ */ React27.createElement("h2", { className: "aura-dialog__title", id: titleId }, props.title), props.dismissible !== false ? /* @__PURE__ */ React27.createElement(IconButton, { icon: "x", label: t.close, className: "aura-dialog__close", onClick: close }) : null),
        props.description ? /* @__PURE__ */ React27.createElement("p", { className: "aura-dialog__desc", id: descId }, props.description) : null,
        props.children ? /* @__PURE__ */ React27.createElement("div", { className: "aura-dialog__body" }, props.children) : null,
        props.footer ? /* @__PURE__ */ React27.createElement("div", { className: "aura-dialog__foot" }, props.footer) : null
      )),
      document.body
    );
  });
  var Drawer = React27.forwardRef(function Drawer2(props, ref) {
    const t = useStrings();
    const density = useDensity();
    const own = React27.useRef(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
    function close() {
      if (props.dismissible !== false && props.onClose) props.onClose();
    }
    const modal = useModal(props.open, own, {
      autoFocus: props.autoFocus,
      onEscape: close,
      bodySelector: ".aura-drawer__body",
      footSelector: ".aura-drawer__foot"
    });
    if (!modal.ready) return null;
    const side = props.side === "left" ? "left" : "right";
    return (0, import_react_dom7.createPortal)(
      /* @__PURE__ */ React27.createElement("div", { className: "aura-dialog-layer aura-drawer-layer", "data-density": density, onKeyDown: modal.onKeyDown }, /* @__PURE__ */ React27.createElement("div", { className: "aura-scrim", onClick: close, "aria-hidden": true }), /* @__PURE__ */ React27.createElement(
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
        props.title || props.dismissible !== false ? /* @__PURE__ */ React27.createElement("div", { className: "aura-drawer__head" }, props.title ? /* @__PURE__ */ React27.createElement("h2", { className: "aura-drawer__title", id: titleId }, props.title) : /* @__PURE__ */ React27.createElement("span", { style: { flex: 1 } }), props.dismissible !== false ? /* @__PURE__ */ React27.createElement(IconButton, { icon: "x", label: t.close, onClick: close }) : null) : null,
        props.description ? /* @__PURE__ */ React27.createElement("p", { className: "aura-drawer__desc", id: descId }, props.description) : null,
        /* @__PURE__ */ React27.createElement("div", { className: "aura-drawer__body" }, props.children),
        props.footer ? /* @__PURE__ */ React27.createElement("div", { className: "aura-drawer__foot" }, props.footer) : null
      )),
      document.body
    );
  });

  // src/DataTable.tsx
  var React28 = __toESM(require_react(), 1);
  var import_react_dom8 = __toESM(require_react_dom(), 1);
  var BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };
  var DEFAULT_COLUMNS = [
    { key: "id", label: "ID", width: 96, mono: true },
    { key: "name", label: "NAME", width: 160 },
    { key: "status", label: "STATUS", width: 112, pill: true },
    { key: "owner", label: "OWNER" }
  ];
  var SKELETON_WIDTHS = ["72%", "56%", "84%", "44%", "64%"];
  var STACK_WIDTHS = [360, 400, 480, 520, 560, 600, 640, 720, 768, 800, 900, 960, 1024];
  var ROW_H_DEFAULT = 48;
  var OVERSCAN = 8;
  var FLEX_MIN = 160;
  var DataTable = React28.forwardRef(function DataTable2(props, ref) {
    const t = useStrings();
    const columns = props.columns || DEFAULT_COLUMNS;
    const byKey = {};
    columns.forEach(function(c) {
      byKey[c.key] = c;
    });
    const rows = props.rows || [];
    const rowKey = props.rowKey || columns[0].key;
    const manual = !!props.manual;
    const Link = useLinkComponent(props.linkComponent);
    const busy = !!props.loading;
    const refreshing = busy && manual && rows.length > 0;
    const loading = busy && !refreshing;
    const selectable = !!props.selectable;
    const reorderable = props.reorderable !== false && !!props.columnControls;
    const controls = !!props.columnControls;
    const oneCallback = !!props.onStateChange;
    const sortState = useMaybeControlled(
      props.sort,
      props.defaultSort || null,
      oneCallback ? null : props.onSortChange
    );
    const sort = sortState[0], setSort = sortState[1];
    const selState = useMaybeControlled(props.selected, props.defaultSelected || [], props.onSelectionChange);
    const selected = selState[0], setSelected = selState[1];
    const pageState = useMaybeControlled(
      props.page,
      props.defaultPage || 1,
      oneCallback ? null : props.onPageChange
    );
    const orderState = useMaybeControlled(
      props.columnOrder,
      columns.map(function(c) {
        return c.key;
      }),
      props.onColumnOrderChange
    );
    const hiddenState = useMaybeControlled(
      props.hiddenColumns,
      columns.filter(function(c) {
        return c.hidden;
      }).map(function(c) {
        return c.key;
      }),
      props.onHiddenColumnsChange
    );
    const pinState = useMaybeControlled(
      props.pinnedColumns,
      columns.filter(function(c) {
        return c.pinned;
      }).map(function(c) {
        return c.key;
      }),
      props.onPinnedColumnsChange
    );
    const widthState = React28.useState({});
    const widths = widthState[0], setWidths = widthState[1];
    const activeState = React28.useState({ r: 1, c: 0 });
    const scrollState = React28.useState(0);
    const scrollTop = scrollState[0], setScrollTop = scrollState[1];
    const scrolledX = React28.useState(false);
    const menuState = React28.useState(null);
    const menu = menuState[0], setMenu = menuState[1];
    const dragState = React28.useState(null);
    const drag = dragState[0], setDrag = dragState[1];
    const gridRef = React28.useRef(null);
    const wrapRef = React28.useRef(null), wrapMerged = useMergedRef(ref, wrapRef);
    const boxWidth = React28.useState(null);
    const measure = !!props.stackBelow || columns.some(function(c) {
      return c.hideBelow != null;
    });
    const dual = !!props.stackBelow && boxWidth[0] == null && STACK_WIDTHS.indexOf(props.stackBelow) >= 0;
    React28.useEffect(
      function() {
        if (!measure || !wrapRef.current || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(function(en) {
          boxWidth[1](en[0].contentRect.width);
        });
        ro.observe(wrapRef.current);
        return function() {
          ro.disconnect();
        };
      },
      [measure, dual]
    );
    const stacked = !!props.stackBelow && boxWidth[0] != null && boxWidth[0] < props.stackBelow;
    useIsoLayoutEffect(
      function() {
        if (measure && boxWidth[0] == null && wrapRef.current) boxWidth[1](wrapRef.current.getBoundingClientRect().width);
      },
      [measure]
    );
    function tooNarrow(c) {
      if (c.hideBelow == null || boxWidth[0] == null || stacked) return false;
      const px = typeof c.hideBelow === "number" ? c.hideBelow : BP[c.hideBelow];
      return px != null && boxWidth[0] < px;
    }
    const scrollRef = React28.useRef(null);
    const tipState = React28.useState(null), tip = tipState[0], setTip = tipState[1];
    function showFull(e) {
      const el = e.target.closest ? e.target.closest(".aura-table__td, .aura-table__card-fields dd") : null;
      if (!el || el.scrollWidth <= el.clientWidth + 1 || el.querySelector("button, input, .aura-pill"))
        return setTip(null);
      const r = el.getBoundingClientRect();
      setTip({ text: (el.textContent || "").trim(), left: r.left, top: r.top });
    }
    function hideFull() {
      setTip(null);
    }
    const tipEl = tip && typeof document !== "undefined" ? (0, import_react_dom8.createPortal)(
      /* @__PURE__ */ React28.createElement(
        "div",
        {
          className: "aura-tooltip aura-tooltip--above",
          "aria-hidden": "true",
          style: { left: tip.left, top: tip.top - 6 }
        },
        tip.text
      ),
      document.body
    ) : null;
    const rowH = React28.useState(ROW_H_DEFAULT);
    const ROW_H = rowH[0];
    useIsoLayoutEffect(function() {
      const el = wrapRef.current;
      if (!el || typeof getComputedStyle === "undefined") return;
      const v = parseFloat(getComputedStyle(el).getPropertyValue("--aura-table-row-height"));
      if (v > 0 && v !== rowH[0]) rowH[1](v);
    });
    const pending = React28.useRef(null);
    const resizing = React28.useRef(false);
    useIsoLayoutEffect(function() {
      if (stacked || !gridRef.current) return;
      const els = gridRef.current.querySelectorAll(
        '.aura-table__td button, .aura-table__td a[href], .aura-table__td input, .aura-table__td select, .aura-table__td textarea, .aura-table__td [tabindex="0"]'
      );
      for (let i = 0; i < els.length; i++) if (els[i].tabIndex !== -1) els[i].tabIndex = -1;
    });
    function widthOf(c) {
      return widths[c.key] != null ? widths[c.key] : c.width;
    }
    const order = orderState[0].filter(function(k) {
      return byKey[k];
    });
    columns.forEach(function(c) {
      if (order.indexOf(c.key) < 0) order.push(c.key);
    });
    const hidden = hiddenState[0], pinnedKeys = pinState[0];
    const shown = order.filter(function(k) {
      return hidden.indexOf(k) < 0;
    }).map(function(k) {
      return byKey[k];
    }).filter(function(c) {
      return !tooNarrow(c);
    });
    function isPinned(c) {
      return pinnedKeys.indexOf(c.key) >= 0 && c.width != null;
    }
    const vis = shown.filter(isPinned).concat(
      shown.filter(function(c) {
        return !isPinned(c);
      })
    );
    const nPinned = vis.filter(isPinned).length;
    const hasFlex = vis.some(function(c) {
      return widthOf(c) == null;
    });
    let fixedSum = 0;
    vis.forEach(function(c) {
      fixedSum += widthOf(c) != null ? widthOf(c) : FLEX_MIN;
    });
    let pinOffsets = {}, acc = 0;
    vis.forEach(function(c) {
      if (isPinned(c)) {
        pinOffsets[c.key] = acc;
        acc += widthOf(c);
      }
    });
    const selW = selectable ? " + var(--aura-table-select-width)" : "";
    const gutterR = controls ? "var(--aura-space-12)" : "var(--aura-space-6)";
    const rowMinWidth = "calc(" + fixedSum + "px + var(--aura-space-6) + " + gutterR + selW + ")";
    function cellStyle(c, i) {
      let w = widthOf(c), s;
      if (w == null) s = { flex: "1 1 0", minWidth: (c.minWidth || FLEX_MIN) + "px" };
      else if (!hasFlex && i === vis.length - 1) s = { flex: "1 0 auto", width: w + "px" };
      else s = { width: w + "px", flex: "none" };
      if (isPinned(c)) s.left = "calc(var(--aura-space-6)" + selW + " + " + pinOffsets[c.key] + "px)";
      return s;
    }
    const view = React28.useMemo(
      function() {
        if (manual || !sort || !sort.key || !byKey[sort.key]) return rows;
        const col = byKey[sort.key];
        const val = col.sortValue || (col.pill ? function(r) {
          return TONE_ORDER[col.tones && col.tones[r[col.key]] || toneFor(r[col.key])];
        } : function(r) {
          return r[col.key];
        });
        const dir = sort.dir === "desc" ? -1 : 1;
        return rows.map(function(r, i) {
          return [r, i];
        }).sort(function(a, b) {
          return compare(val(a[0]), val(b[0])) * dir || a[1] - b[1];
        }).map(function(p) {
          return p[0];
        });
      },
      [rows, manual, sort && sort.key, sort && sort.dir]
    );
    function nextSort(key) {
      if (!sort || sort.key !== key) return { key, dir: "asc" };
      if (sort.dir === "asc") return { key, dir: "desc" };
      return null;
    }
    const pageSize = props.pageSize || 0;
    const total = manual ? props.totalRows != null ? props.totalRows : (Math.max(1, pageState[0] || 1) - 1) * pageSize + rows.length + (pageSize && rows.length >= pageSize ? 1 : 0) : view.length;
    const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize)) : 1;
    const page = Math.min(Math.max(1, pageState[0] || 1), pageCount);
    const first = pageSize ? (page - 1) * pageSize : 0;
    const pageRows = pageSize && !manual ? view.slice(first, first + pageSize) : view;
    const canSortAny = !busy && (manual ? total > 1 : rows.length > 1);
    const shownTotal = manual && props.totalRows == null ? first + rows.length : total;
    const linkPaging = !!props.getPageHref && !props.onPageChange && !oneCallback;
    const prevLink = React28.useRef(null), nextLink = React28.useRef(null);
    function emit(s, p) {
      if (props.onStateChange) props.onStateChange({ sort: s, page: p });
    }
    function goPage(p, focus, quiet) {
      const next = Math.min(Math.max(1, p), pageCount);
      if (next === page) return false;
      if (!quiet) emit(sort, next);
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
    function sortBy(key) {
      applySort(nextSort(key));
    }
    function applySort(s) {
      setSort(s);
      if (!(manual && linkPaging)) goPage(1, void 0, true);
      emit(s, 1);
    }
    const rowHref = props.getRowHref;
    function followRow(el, e) {
      const a = el && el.querySelector(".aura-table__row-link");
      if (!a) return;
      a.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
          ctrlKey: !!(e && e.ctrlKey),
          metaKey: !!(e && e.metaKey),
          shiftKey: !!(e && e.shiftKey),
          altKey: !!(e && e.altKey)
        })
      );
    }
    function rowLinkWrap(r, content) {
      return rowHref ? /* @__PURE__ */ React28.createElement(Link, { href: rowHref(r), className: "aura-table__row-link" }, content) : content;
    }
    const height = props.height || 0;
    const virtual = !!height && !loading && pageRows.length > 0;
    const bodyH = Math.max(ROW_H, height - ROW_H);
    let start = 0, end = pageRows.length;
    if (virtual) {
      start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
      end = Math.min(pageRows.length, Math.ceil((scrollTop + bodyH) / ROW_H) + OVERSCAN);
    }
    const visibleRows = Math.max(1, Math.floor(bodyH / ROW_H));
    const nCols = vis.length + (selectable ? 1 : 0);
    const nRows = loading ? 0 : pageRows.length;
    const active = activeState[0];
    const ar = Math.min(active.r, nRows), ac = Math.min(active.c, nCols - 1);
    const activeRendered = ar === 0 || ar - 1 >= start && ar - 1 < end;
    function colAt(ci) {
      return selectable ? ci === 0 ? null : vis[ci - 1] : vis[ci];
    }
    function tabFor(r, c) {
      if (!activeRendered) return r === 0 && c === ac ? 0 : -1;
      return r === ar && c === ac ? 0 : -1;
    }
    React28.useEffect(function() {
      const p = pending.current;
      if (!p || !gridRef.current) return;
      let c = p.c;
      if (p.key) {
        let at = -1;
        vis.forEach(function(x, i) {
          if (x.key === p.key) at = i;
        });
        c = at >= 0 ? at + (selectable ? 1 : 0) : Math.min(p.c || 0, nCols - 1);
      }
      const el = gridRef.current.querySelector('[data-rc="' + p.r + ":" + c + '"]');
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
        const sc = scrollRef.current, top = (r - 1) * ROW_H;
        if (top < sc.scrollTop) sc.scrollTop = top;
        else if (top + ROW_H > sc.scrollTop + bodyH) sc.scrollTop = top + ROW_H - bodyH;
        setScrollTop(sc.scrollTop);
      }
      const el = gridRef.current && gridRef.current.querySelector('[data-rc="' + r + ":" + c + '"]');
      if (el) {
        pending.current = null;
        el.focus();
      }
    }
    const pageKeys = pageRows.map(function(r) {
      return r[rowKey];
    });
    const selSet = {};
    selected.forEach(function(k) {
      selSet[k] = true;
    });
    const nSel = pageKeys.filter(function(k) {
      return selSet[k];
    }).length;
    const all = nSel > 0 && nSel === pageKeys.length;
    function toggle(k, on) {
      setSelected(
        on ? selected.concat([k]) : selected.filter(function(x) {
          return x !== k;
        })
      );
    }
    function toggleAll() {
      setSelected(
        all ? selected.filter(function(k) {
          return pageKeys.indexOf(k) < 0;
        }) : selected.concat(
          pageKeys.filter(function(k) {
            return !selSet[k];
          })
        )
      );
    }
    function canResize(c) {
      return !!props.resizable && c.resizable !== false && c.width != null;
    }
    function clampW(c, w) {
      return Math.round(Math.min(c.maxWidth || 480, Math.max(c.minWidth || 64, w)));
    }
    function setW(c, w, done) {
      const nw = clampW(c, w);
      setWidths(function(prev) {
        const o = Object.assign({}, prev);
        o[c.key] = nw;
        return o;
      });
      if (done && props.onColumnResize) props.onColumnResize(c.key, nw);
    }
    function startResize(c, e) {
      e.preventDefault();
      e.stopPropagation();
      resizing.current = true;
      let x0 = e.clientX, w0 = widthOf(c), last = w0;
      const el = e.currentTarget;
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
      const c = byKey[key], group = vis.filter(function(x) {
        return isPinned(x) === isPinned(c);
      });
      const gi = group.indexOf(c), target = group[gi + delta];
      if (!target) return false;
      const o = order.slice(), from = o.indexOf(key), to = o.indexOf(target.key);
      o.splice(from, 1);
      o.splice(to, 0, key);
      orderState[1](o);
      return true;
    }
    function dropCol(key, targetKey, after) {
      if (key === targetKey) return;
      const a = byKey[key], b = byKey[targetKey];
      if (isPinned(a) !== isPinned(b)) return;
      const o = order.slice();
      o.splice(o.indexOf(key), 1);
      const to = o.indexOf(targetKey) + (after ? 1 : 0);
      o.splice(to, 0, key);
      orderState[1](o);
    }
    function togglePin(key) {
      pinState[1](
        pinnedKeys.indexOf(key) >= 0 ? pinnedKeys.filter(function(k) {
          return k !== key;
        }) : pinnedKeys.concat([key])
      );
    }
    function setHidden(key, hide) {
      if (hide && shown.length <= 1) return;
      hiddenState[1](
        hide ? hidden.concat([key]) : hidden.filter(function(k) {
          return k !== key;
        })
      );
    }
    function resetColumns() {
      orderState[1](
        columns.map(function(c) {
          return c.key;
        })
      );
      hiddenState[1](
        columns.filter(function(c) {
          return c.hidden;
        }).map(function(c) {
          return c.key;
        })
      );
      pinState[1](
        columns.filter(function(c) {
          return c.pinned;
        }).map(function(c) {
          return c.key;
        })
      );
      setWidths({});
    }
    function columnMenuItems(c) {
      const group = vis.filter(function(x) {
        return isPinned(x) === isPinned(c);
      }), gi = group.indexOf(c);
      const items2 = [];
      if (c.sortable)
        items2.push(
          {
            label: t.sortAsc,
            icon: "arrow-up",
            onSelect: function() {
              applySort({ key: c.key, dir: "asc" });
            }
          },
          {
            label: t.sortDesc,
            icon: "arrow-down",
            onSelect: function() {
              applySort({ key: c.key, dir: "desc" });
            }
          },
          { separator: true }
        );
      if (c.width != null)
        items2.push({
          label: isPinned(c) ? t.unpin : t.pin,
          icon: isPinned(c) ? "pin-off" : "pin",
          onSelect: function() {
            togglePin(c.key);
          }
        });
      if (reorderable)
        items2.push(
          {
            label: t.moveLeft,
            icon: "arrow-left",
            disabled: gi <= 0,
            onSelect: function() {
              moveCol(c.key, -1);
            }
          },
          {
            label: t.moveRight,
            icon: "arrow-right",
            disabled: gi >= group.length - 1,
            onSelect: function() {
              moveCol(c.key, 1);
            }
          }
        );
      items2.push(
        { separator: true },
        {
          label: t.hideColumn,
          icon: "eye-off",
          disabled: shown.length <= 1,
          onSelect: function() {
            setHidden(c.key, true);
          }
        }
      );
      return items2;
    }
    function pickerItems() {
      return order.map(function(k) {
        const c = byKey[k], on = hidden.indexOf(k) < 0;
        return {
          label: c.label || (c.actions ? t.actions : c.key),
          checked: on,
          keepOpen: true,
          disabled: on && shown.length <= 1,
          onSelect: function() {
            setHidden(k, on);
          }
        };
      }).concat([{ separator: true }, { label: t.resetColumns, icon: "rotate-ccw", onSelect: resetColumns }]);
    }
    function openMenu(kind, key, anchor, rc) {
      setMenu({ kind, key, anchor, rc });
    }
    function closeMenu(restore) {
      const m = menu;
      setMenu(null);
      if (restore && m) {
        if (m.kind === "col") pending.current = { r: 0, key: m.key, c: m.rc ? m.rc.c : 0 };
        else if (m.anchor) m.anchor.focus();
      }
    }
    function onGridKey(e) {
      const target = e.target;
      if (!gridRef.current || !gridRef.current.contains(target)) return;
      const rc = target.getAttribute && target.getAttribute("data-rc");
      if (!rc) {
        const cell = e.key === "Escape" && target.closest && target.closest("[data-rc]");
        if (cell) {
          e.preventDefault();
          cell.focus();
        }
        return;
      }
      const p = rc.split(":"), r = +p[0], c = +p[1], k = e.key, col = colAt(c);
      const row = r > 0 ? pageRows[r - 1] : null;
      let handled = true;
      if (r === 0 && col && e.altKey && (k === "ArrowLeft" || k === "ArrowRight") && canResize(col))
        setW(col, widthOf(col) + (k === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 48 : 16), true);
      else if (r === 0 && col && e.ctrlKey && e.shiftKey && (k === "ArrowLeft" || k === "ArrowRight") && reorderable) {
        if (moveCol(col.key, k === "ArrowLeft" ? -1 : 1)) pending.current = { r: 0, key: col.key, c };
      } else if (r === 0 && col && (e.altKey && k === "ArrowDown" || k === "ContextMenu" || e.shiftKey && k === "F10") && controls)
        openMenu("col", col.key, target, { r: 0, c });
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
        const inner = target.querySelector("button, a[href], input, select, textarea");
        if (inner) inner.focus();
        else handled = false;
      } else if (k === " " || k === "Enter") {
        if (r === 0 && !col && selectable && nRows) toggleAll();
        else if (r === 0 && col && col.sortable && canSortAny) sortBy(col.key);
        else if (r > 0 && k === " " && selectable) toggle(row[rowKey], !selSet[row[rowKey]]);
        else if (r > 0 && k === "Enter" && rowHref && !target.querySelector("button, a[href]:not(.aura-table__row-link), input, select, textarea"))
          followRow(target.closest('[role="row"]'), e);
        else if (r > 0 && k === "Enter" && target.querySelector("button, a[href], input, select, textarea"))
          target.querySelector("button, a[href], input, select, textarea").focus();
        else if (r > 0 && k === "Enter" && props.onRowActivate) props.onRowActivate(row);
        else handled = false;
      } else handled = false;
      if (handled) {
        e.preventDefault();
        e.stopPropagation();
      }
    }
    const head = [/* @__PURE__ */ React28.createElement("span", { key: "__gl", className: "aura-table__gutter", "aria-hidden": true })];
    if (selectable)
      head.push(
        /* @__PURE__ */ React28.createElement(
          "span",
          {
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
          },
          nRows ? /* @__PURE__ */ React28.createElement(
            Checkbox,
            {
              checked: all,
              indeterminate: nSel > 0 && !all,
              tabIndex: -1,
              label: all ? t.deselectAllRows : t.selectAllRows,
              onChange: toggleAll
            }
          ) : null
        )
      );
    vis.forEach(function(c, i) {
      const ci = i + (selectable ? 1 : 0);
      const isSorted = sort && sort.key === c.key;
      const canSort = c.sortable && canSortAny;
      const ariaSort = isSorted && canSort ? sort.dir === "desc" ? "descending" : "ascending" : canSort ? "none" : void 0;
      const pin = isPinned(c), edge = pin && i === nPinned - 1;
      head.push(
        /* @__PURE__ */ React28.createElement(
          "span",
          {
            key: c.key,
            role: "columnheader",
            "aria-sort": ariaSort,
            "aria-colindex": ci + 1,
            style: cellStyle(c, i),
            tabIndex: tabFor(0, ci),
            "data-rc": "0:" + ci,
            className: cx(
              "aura-table__th",
              c.align === "end" && "is-end",
              pin && "is-pinned",
              edge && "is-pin-edge",
              drag && drag.over === c.key && (drag.after ? "is-drop-after" : "is-drop-before"),
              drag && drag.key === c.key && "is-dragging"
            ),
            draggable: reorderable && !busy ? true : void 0,
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
              const b = e.currentTarget.getBoundingClientRect(), after = e.clientX > b.left + b.width / 2;
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
          /* @__PURE__ */ React28.createElement("span", { className: "aura-table__th-inner" }, canSort ? /* @__PURE__ */ React28.createElement(
            "button",
            {
              type: "button",
              tabIndex: -1,
              className: cx("aura-table__sort", isSorted && "is-active"),
              onClick: function() {
                sortBy(c.key);
                activeState[1]({ r: 0, c: ci });
              }
            },
            c.label,
            /* @__PURE__ */ React28.createElement(Icon, { name: isSorted ? sort.dir === "desc" ? "arrow-down" : "arrow-up" : "arrow-up-down", size: 12 })
          ) : /* @__PURE__ */ React28.createElement("span", { className: cx("aura-table__th-label", !c.label && "aura-sr-only") }, c.label || (c.actions ? t.actions : c.key)), pin ? /* @__PURE__ */ React28.createElement(Icon, { name: "pin", size: 12, className: "aura-table__pin-icon", label: t.pinned }) : null, controls ? /* @__PURE__ */ React28.createElement(
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
            /* @__PURE__ */ React28.createElement(Icon, { name: "ellipsis" })
          ) : null),
          canResize(c) ? /* @__PURE__ */ React28.createElement(
            "span",
            {
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
            }
          ) : null
        )
      );
    });
    head.push(
      /* @__PURE__ */ React28.createElement(
        "span",
        {
          key: "__gr",
          className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker"),
          "aria-hidden": true
        }
      )
    );
    function cellContent(c, r) {
      const v = r[c.key];
      return c.render ? c.render(r) : c.pill ? /* @__PURE__ */ React28.createElement(StatusPill, { ...{ tone: c.tones && c.tones[v] } }, v) : v;
    }
    function rowCells(r, i, k, isSel) {
      const ri = i + 1;
      const cells = [/* @__PURE__ */ React28.createElement("span", { key: "__gl", className: "aura-table__gutter", "aria-hidden": true })];
      if (selectable)
        cells.push(
          /* @__PURE__ */ React28.createElement(
            "span",
            {
              key: "__sel",
              role: "gridcell",
              "aria-colindex": 1,
              className: cx("aura-table__sel", nPinned && "is-pinned"),
              tabIndex: tabFor(ri, 0),
              "data-rc": ri + ":0",
              "aria-label": t.selectRow(k),
              onFocus: function(e) {
                if (e.target === e.currentTarget) activeState[1]({ r: ri, c: 0 });
              }
            },
            /* @__PURE__ */ React28.createElement(
              Checkbox,
              {
                checked: isSel,
                tabIndex: -1,
                label: t.selectRow(k),
                onChange: function(on) {
                  toggle(k, on);
                }
              }
            )
          )
        );
      vis.forEach(function(c, j) {
        const ci = j + (selectable ? 1 : 0), v = r[c.key], pin = isPinned(c);
        cells.push(
          /* @__PURE__ */ React28.createElement(
            "span",
            {
              key: c.key,
              role: "gridcell",
              "aria-colindex": ci + 1,
              tabIndex: tabFor(ri, ci),
              "data-rc": ri + ":" + ci,
              className: cx(
                "aura-table__td",
                c.mono && "aura-table__mono",
                c.align === "end" && "is-end",
                pin && "is-pinned",
                pin && j === nPinned - 1 && "is-pin-edge"
              ),
              style: cellStyle(c, j),
              onFocus: function() {
                if (activeState[0].r !== ri || activeState[0].c !== ci) activeState[1]({ r: ri, c: ci });
              }
            },
            j === 0 ? rowLinkWrap(r, cellContent(c, r)) : cellContent(c, r)
          )
        );
      });
      cells.push(
        /* @__PURE__ */ React28.createElement(
          "span",
          {
            key: "__gr",
            className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker"),
            "aria-hidden": true
          }
        )
      );
      return cells;
    }
    let body;
    const rowStyle = { minWidth: rowMinWidth };
    if (loading) {
      const n2 = pageSize || props.skeletonRows || 5;
      const skRows = body = [];
      for (let i = 0; i < n2; i++) {
        const sk = [/* @__PURE__ */ React28.createElement("span", { key: "__gl", className: "aura-table__gutter" })];
        if (selectable)
          sk.push(
            /* @__PURE__ */ React28.createElement("span", { key: "__sel", className: cx("aura-table__sel", nPinned && "is-pinned") }, /* @__PURE__ */ React28.createElement("span", { className: "aura-skel aura-skel--box" }))
          );
        vis.forEach(function(c, j) {
          sk.push(
            /* @__PURE__ */ React28.createElement(
              "span",
              {
                key: c.key,
                className: cx("aura-table__td", c.align === "end" && "is-end", isPinned(c) && "is-pinned"),
                style: cellStyle(c, j)
              },
              /* @__PURE__ */ React28.createElement(
                "span",
                {
                  className: cx("aura-skel", c.pill && "aura-skel--pill"),
                  style: c.pill ? void 0 : { width: SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length] }
                }
              )
            )
          );
        });
        sk.push(
          /* @__PURE__ */ React28.createElement("span", { key: "__gr", className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker") })
        );
        skRows.push(
          /* @__PURE__ */ React28.createElement("div", { key: "sk" + i, className: "aura-table__row aura-table__row--skeleton", "aria-hidden": true, style: rowStyle }, sk)
        );
      }
    } else if (!rows.length) {
      const em = props.empty || {};
      body = /* @__PURE__ */ React28.createElement("div", { className: "aura-table__empty", role: "row" }, /* @__PURE__ */ React28.createElement("div", { role: "gridcell" }, /* @__PURE__ */ React28.createElement("span", { className: "aura-table__empty-icon" }, /* @__PURE__ */ React28.createElement(Icon, { name: em.icon || "inbox", size: "lg" })), /* @__PURE__ */ React28.createElement("p", { className: "aura-table__empty-title" }, em.title || t.empty), em.description ? /* @__PURE__ */ React28.createElement("p", { className: "aura-table__empty-text" }, em.description) : null, em.action ? /* @__PURE__ */ React28.createElement("div", { className: "aura-table__empty-action" }, em.action) : null));
    } else {
      const bodyRows = body = [];
      if (virtual && start > 0)
        bodyRows.push(/* @__PURE__ */ React28.createElement("div", { key: "__top", style: { height: start * ROW_H + "px" }, "aria-hidden": true }));
      for (let ri = start; ri < end; ri++) {
        (function(r, i) {
          const k = r[rowKey], isSel = !!selSet[k];
          bodyRows.push(
            /* @__PURE__ */ React28.createElement(
              "div",
              {
                key: k,
                role: "row",
                "aria-rowindex": first + i + 2,
                "aria-selected": selectable ? isSel : void 0,
                className: cx(
                  "aura-table__row",
                  isSel && "is-selected",
                  (props.onRowActivate || rowHref) && "is-actionable"
                ),
                style: rowStyle,
                onClick: function(e) {
                  const el = e.target;
                  if (el.closest && el.closest(".aura-check, button, a, input")) return;
                  if (rowHref) followRow(e.currentTarget, e);
                  else if (props.onRowActivate) props.onRowActivate(r);
                }
              },
              rowCells(r, i, k, isSel)
            )
          );
        })(pageRows[ri], ri);
      }
      if (virtual && end < pageRows.length)
        bodyRows.push(/* @__PURE__ */ React28.createElement("div", { key: "__bot", style: { height: (pageRows.length - end) * ROW_H + "px" }, "aria-hidden": true }));
    }
    let foot = null;
    function pagerButton(dir) {
      const p = page + dir, off = busy || (dir < 0 ? page <= 1 : page >= pageCount), label = dir < 0 ? t.prevPage : t.nextPage, icon = dir < 0 ? "chevron-left" : "chevron-right";
      if (props.getPageHref && !off)
        return /* @__PURE__ */ React28.createElement(
          Link,
          {
            ref: dir < 0 ? prevLink : nextLink,
            href: props.getPageHref(p),
            className: "aura-icon-btn",
            "aria-label": label,
            onClick: function(e) {
              if (props.onPageChange || oneCallback) {
                e.preventDefault();
                pageState[1](p);
                emit(sort, p);
              }
            }
          },
          /* @__PURE__ */ React28.createElement(Icon, { name: icon })
        );
      return /* @__PURE__ */ React28.createElement(
        IconButton,
        {
          icon,
          label,
          disabled: off,
          onClick: function() {
            goPage(p);
          }
        }
      );
    }
    if (pageSize && (rows.length || busy)) {
      const from = rows.length ? first + 1 : 0, to = manual ? first + rows.length : Math.min(first + pageSize, view.length);
      foot = /* @__PURE__ */ React28.createElement("div", { className: "aura-table__foot" }, /* @__PURE__ */ React28.createElement("span", { "aria-live": "polite" }, busy ? t.loading : t.range(from, to, shownTotal)), /* @__PURE__ */ React28.createElement("span", { className: "aura-table__pager" }, /* @__PURE__ */ React28.createElement("span", null, t.page(page, pageCount)), pagerButton(-1), pagerButton(1)));
    } else if (height && rows.length && !loading) {
      foot = /* @__PURE__ */ React28.createElement("div", { className: "aura-table__foot" }, /* @__PURE__ */ React28.createElement("span", null, t.rowCount(shownTotal)), selectable && selected.length ? /* @__PURE__ */ React28.createElement("span", null, t.selectedCount(selected.length)) : /* @__PURE__ */ React28.createElement("span", null));
    }
    function renderStacked(wrapRefArg) {
      const titleCol = vis[0], pillCol = vis.filter(function(c) {
        return c.pill && c !== titleCol;
      })[0];
      const actionCols = vis.filter(function(c) {
        return c.actions && c !== titleCol;
      });
      const rest = vis.filter(function(c) {
        return c !== titleCol && c !== pillCol && !c.actions;
      });
      let cardBody;
      if (loading) {
        cardBody = /* @__PURE__ */ React28.createElement("ul", { className: "aura-table__cards", "aria-busy": true }, [0, 1, 2].map(function(i) {
          return /* @__PURE__ */ React28.createElement("li", { key: i, className: "aura-table__card", "aria-hidden": true }, /* @__PURE__ */ React28.createElement("span", { className: "aura-skel", style: { width: "50%", height: "14px" } }), /* @__PURE__ */ React28.createElement("span", { className: "aura-skel", style: { width: "80%" } }), /* @__PURE__ */ React28.createElement("span", { className: "aura-skel", style: { width: "64%" } }));
        }));
      } else if (!rows.length) {
        const em2 = props.empty || {};
        cardBody = /* @__PURE__ */ React28.createElement("div", { className: "aura-table__empty" }, /* @__PURE__ */ React28.createElement("div", null, /* @__PURE__ */ React28.createElement("span", { className: "aura-table__empty-icon" }, /* @__PURE__ */ React28.createElement(Icon, { name: em2.icon || "inbox", size: "lg" })), /* @__PURE__ */ React28.createElement("p", { className: "aura-table__empty-title" }, em2.title || t.empty), em2.description ? /* @__PURE__ */ React28.createElement("p", { className: "aura-table__empty-text" }, em2.description) : null, em2.action ? /* @__PURE__ */ React28.createElement("div", { className: "aura-table__empty-action" }, em2.action) : null));
      } else {
        const cellVal = cellContent;
        cardBody = /* @__PURE__ */ React28.createElement("ul", { className: "aura-table__cards", "aria-label": props.label }, pageRows.map(function(r) {
          const k = r[rowKey], isSel = !!selSet[k];
          return /* @__PURE__ */ React28.createElement(
            "li",
            {
              key: k,
              className: cx(
                "aura-table__card",
                isSel && "is-selected",
                (props.onRowActivate || rowHref) && "is-actionable"
              ),
              tabIndex: props.onRowActivate && !rowHref ? 0 : void 0,
              onClick: function(e) {
                const el = e.target;
                if (el.closest && el.closest(".aura-check, button, a, input")) return;
                if (rowHref) followRow(e.currentTarget, e);
                else if (props.onRowActivate) props.onRowActivate(r);
              },
              onKeyDown: function(e) {
                if (e.target === e.currentTarget && e.key === "Enter" && props.onRowActivate && !rowHref)
                  props.onRowActivate(r);
              }
            },
            /* @__PURE__ */ React28.createElement("div", { className: "aura-table__card-head" }, selectable ? /* @__PURE__ */ React28.createElement(
              Checkbox,
              {
                checked: isSel,
                label: t.selectRow(k),
                onChange: function(on) {
                  toggle(k, on);
                }
              }
            ) : null, /* @__PURE__ */ React28.createElement("span", { className: cx("aura-table__card-title", titleCol.mono && "aura-table__mono") }, rowLinkWrap(r, cellVal(titleCol, r))), pillCol ? cellVal(pillCol, r) : null, actionCols.map(function(c) {
              return /* @__PURE__ */ React28.createElement("span", { key: c.key, className: "aura-table__card-actions" }, cellVal(c, r));
            })),
            rest.length ? /* @__PURE__ */ React28.createElement("dl", { className: "aura-table__card-fields" }, rest.map(function(c) {
              return /* @__PURE__ */ React28.createElement("div", { key: c.key }, /* @__PURE__ */ React28.createElement("dt", null, c.label), /* @__PURE__ */ React28.createElement("dd", { className: cx(c.mono && "aura-table__mono", c.align === "end" && "is-end") }, cellVal(c, r)));
            })) : null
          );
        }));
      }
      return /* @__PURE__ */ React28.createElement(
        "div",
        {
          ref: wrapRefArg,
          "data-density": props.density,
          className: cx("aura-table aura-table--stacked", refreshing && "is-refreshing", props.className),
          onMouseOver: showFull,
          onMouseLeave: hideFull,
          onFocus: showFull,
          onBlur: hideFull,
          role: "region",
          "aria-label": props.label,
          "aria-busy": busy || void 0
        },
        refreshing ? /* @__PURE__ */ React28.createElement("span", { className: "aura-table__busy-bar", "aria-hidden": true }) : null,
        selectable && pageRows.length && !busy ? /* @__PURE__ */ React28.createElement("div", { className: "aura-table__stack-bar" }, /* @__PURE__ */ React28.createElement(
          Checkbox,
          {
            checked: all,
            indeterminate: nSel > 0 && !all,
            label: all ? t.deselectAllRows : t.selectAllRows,
            onChange: toggleAll
          }
        ), /* @__PURE__ */ React28.createElement("span", null, nSel ? t.selectedCount(nSel) : t.selectAll)) : null,
        cardBody,
        props.footer && rows.length && !loading ? /* @__PURE__ */ React28.createElement("div", { className: "aura-table__card aura-table__card--total", role: "group", "aria-label": t.totals }, /* @__PURE__ */ React28.createElement("dl", { className: "aura-table__card-fields" }, vis.filter(function(c) {
          return props.footer[c.key] != null;
        }).map(function(c) {
          return /* @__PURE__ */ React28.createElement("div", { key: c.key }, /* @__PURE__ */ React28.createElement("dt", null, c.label || t.totals), /* @__PURE__ */ React28.createElement("dd", { className: cx(c.mono && "aura-table__mono", c.align === "end" && "is-end") }, props.footer[c.key]));
        }))) : null,
        foot,
        tipEl
      );
    }
    if (stacked) return renderStacked(wrapMerged);
    const totalRow = props.footer && rows.length && !loading ? /* @__PURE__ */ React28.createElement(
      "div",
      {
        role: "row",
        "aria-rowindex": shownTotal + 2,
        "aria-label": t.totals,
        className: cx("aura-table__row aura-table__total", props.stickyFooter && "is-sticky"),
        style: rowStyle
      },
      /* @__PURE__ */ React28.createElement("span", { className: "aura-table__gutter", "aria-hidden": true }),
      selectable ? /* @__PURE__ */ React28.createElement("span", { className: cx("aura-table__sel", nPinned && "is-pinned"), "aria-hidden": true }) : null,
      vis.map(function(c, j) {
        const pin = isPinned(c);
        return /* @__PURE__ */ React28.createElement(
          "span",
          {
            key: c.key,
            role: "gridcell",
            "aria-colindex": j + (selectable ? 2 : 1),
            className: cx(
              "aura-table__td",
              c.mono && "aura-table__mono",
              c.align === "end" && "is-end",
              pin && "is-pinned",
              pin && j === nPinned - 1 && "is-pin-edge"
            ),
            style: cellStyle(c, j)
          },
          props.footer[c.key]
        );
      }),
      /* @__PURE__ */ React28.createElement(
        "span",
        {
          className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker"),
          "aria-hidden": true
        }
      )
    ) : null;
    const scrollStyle = {
      scrollPaddingLeft: "calc(var(--aura-space-6)" + selW + " + " + acc + "px)",
      scrollPaddingTop: ROW_H + "px"
    };
    if (height) scrollStyle.height = height + "px";
    const gridEl = /* @__PURE__ */ React28.createElement(
      "div",
      {
        ref: dual ? void 0 : wrapMerged,
        "data-density": props.density,
        className: cx("aura-table", scrolledX[0] && "is-scrolled-x", refreshing && "is-refreshing", props.className)
      },
      refreshing ? /* @__PURE__ */ React28.createElement("span", { className: "aura-table__busy-bar", "aria-hidden": true }) : null,
      /* @__PURE__ */ React28.createElement(
        "div",
        {
          ref: function(el) {
            scrollRef.current = el;
            gridRef.current = el;
          },
          className: "aura-table__scroll",
          onMouseOver: showFull,
          onMouseLeave: hideFull,
          onFocus: showFull,
          onBlur: hideFull,
          style: scrollStyle,
          role: "grid",
          "aria-label": props.label,
          "aria-busy": busy || void 0,
          "aria-rowcount": loading ? -1 : shownTotal + 1 + (totalRow ? 1 : 0),
          "aria-colcount": nCols,
          "aria-multiselectable": selectable || void 0,
          onKeyDown: onGridKey,
          onScroll: function(e) {
            const t2 = e.currentTarget;
            if (virtual && Math.abs(t2.scrollTop - scrollTop) >= ROW_H / 2) setScrollTop(t2.scrollTop);
            else if (virtual && (t2.scrollTop === 0 || t2.scrollTop + t2.clientHeight >= t2.scrollHeight - 1))
              setScrollTop(t2.scrollTop);
            const sx = t2.scrollLeft > 0;
            if (sx !== scrolledX[0]) scrolledX[1](sx);
          }
        },
        /* @__PURE__ */ React28.createElement("div", { className: "aura-table__head", role: "row", "aria-rowindex": 1, style: rowStyle }, head),
        body,
        totalRow
      ),
      busy ? /* @__PURE__ */ React28.createElement("span", { className: "aura-sr-only", role: "status" }, t.loadingRows) : null,
      controls ? /* @__PURE__ */ React28.createElement("div", { className: "aura-table__picker" }, /* @__PURE__ */ React28.createElement(
        IconButton,
        {
          icon: "columns-3",
          label: t.showHideColumns,
          "aria-haspopup": "menu",
          onClick: function(e) {
            openMenu("picker", null, e.currentTarget);
          }
        }
      )) : null,
      foot,
      menu ? /* @__PURE__ */ React28.createElement(
        Menu,
        {
          anchor: menu.anchor,
          onClose: closeMenu,
          label: menu.kind === "picker" ? t.columns : t.column(byKey[menu.key] && byKey[menu.key].label),
          items: menu.kind === "picker" ? pickerItems() : byKey[menu.key] ? columnMenuItems(byKey[menu.key]) : []
        }
      ) : null,
      tipEl
    );
    if (!dual) return gridEl;
    return /* @__PURE__ */ React28.createElement("div", { ref: wrapMerged, className: "aura-table-dual", "data-stack-below": props.stackBelow }, renderStacked(void 0), gridEl);
  });

  // src/Card.tsx
  var React29 = __toESM(require_react(), 1);
  var h4 = React29.createElement;
  var Card = React29.forwardRef(function Card2(props, ref) {
    const creative = props.variant === "creative";
    return h4(
      props.as || "section",
      {
        ref,
        className: cx(
          "aura-card",
          creative && "aura-card--creative",
          props.interactive && "is-interactive",
          props.className
        ),
        "aria-labelledby": props.title && props.titleId ? props.titleId : void 0
      },
      props.title || props.actions ? /* @__PURE__ */ React29.createElement("div", { className: "aura-card__head" }, /* @__PURE__ */ React29.createElement("div", { className: "aura-card__heading" }, props.title ? h4("h" + (props.headingLevel || 3), { className: "aura-card__title", id: props.titleId }, props.title) : null, props.description ? /* @__PURE__ */ React29.createElement("p", { className: "aura-card__desc" }, props.description) : null), props.actions ? /* @__PURE__ */ React29.createElement("div", { className: "aura-card__actions" }, props.actions) : null) : null,
      props.children ? /* @__PURE__ */ React29.createElement("div", { className: "aura-card__body" }, props.children) : null,
      props.footer ? /* @__PURE__ */ React29.createElement("div", { className: "aura-card__foot" }, props.footer) : null
    );
  });

  // src/Tabs.tsx
  var React30 = __toESM(require_react(), 1);
  var Tabs = React30.forwardRef(function Tabs2(props, ref) {
    const items2 = props.tabs || [], base = uid();
    const st = useMaybeControlled(
      props.value,
      props.defaultValue || items2[0] && items2[0].id,
      props.onChange
    );
    const refs = React30.useRef({});
    const current2 = items2.filter(function(t) {
      return t.id === st[0];
    })[0] || items2[0];
    const Link = useLinkComponent(props.linkComponent);
    const asLinks = items2.length > 0 && items2.every(function(t) {
      return !!t.href;
    });
    if (asLinks)
      return /* @__PURE__ */ React30.createElement(
        "nav",
        {
          ref,
          "aria-label": props.label,
          className: cx("aura-tabs aura-tabs--links", props.className)
        },
        /* @__PURE__ */ React30.createElement("div", { className: "aura-tabs__list" }, items2.map(function(t) {
          const on = current2 && t.id === current2.id;
          const inner = [
            t.icon ? /* @__PURE__ */ React30.createElement(Icon, { key: "i", name: t.icon }) : null,
            t.label,
            t.count != null ? /* @__PURE__ */ React30.createElement("span", { key: "c", className: "aura-tab__count" }, t.count) : null
          ];
          return t.disabled ? /* @__PURE__ */ React30.createElement("span", { key: t.id, className: "aura-tab is-disabled", "aria-disabled": true }, inner) : /* @__PURE__ */ React30.createElement(
            Link,
            {
              key: t.id,
              href: t.href,
              className: cx("aura-tab", on && "is-active"),
              "aria-current": on ? "page" : void 0,
              onClick: function() {
                st[1](t.id);
              }
            },
            inner
          );
        }))
      );
    function go(i) {
      const enabled = items2.filter(function(t2) {
        return !t2.disabled;
      });
      const t = enabled[(i + enabled.length) % enabled.length];
      st[1](t.id);
      if (refs.current[t.id]) refs.current[t.id].focus();
    }
    return /* @__PURE__ */ React30.createElement("div", { ref, className: cx("aura-tabs", props.className) }, /* @__PURE__ */ React30.createElement(
      "div",
      {
        role: "tablist",
        "aria-label": props.label,
        className: "aura-tabs__list",
        onKeyDown: function(e) {
          const enabled = items2.filter(function(t) {
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
      items2.map(function(t) {
        const on = current2 && t.id === current2.id;
        return /* @__PURE__ */ React30.createElement(
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
          t.icon ? /* @__PURE__ */ React30.createElement(Icon, { name: t.icon }) : null,
          t.label,
          t.count != null ? /* @__PURE__ */ React30.createElement("span", { className: "aura-tab__count" }, t.count) : null
        );
      })
    ), current2 && current2.content !== void 0 ? /* @__PURE__ */ React30.createElement(
      "div",
      {
        role: "tabpanel",
        id: base + "-panel-" + current2.id,
        "aria-labelledby": base + "-tab-" + current2.id,
        tabIndex: 0,
        className: "aura-tabs__panel"
      },
      current2.content
    ) : null);
  });

  // src/SideNav.tsx
  var React31 = __toESM(require_react(), 1);
  var import_react_dom9 = __toESM(require_react_dom(), 1);
  function contains(it, id) {
    return !!id && !!it.children && it.children.some(function(c) {
      return c.id === id || contains(c, id);
    });
  }
  var SideNav = React31.forwardRef(function SideNav2(props, ref) {
    const t = useStrings();
    const Link = useLinkComponent(props.linkComponent);
    const base = uid();
    const st = useMaybeControlled(
      props.value,
      props.defaultValue,
      props.onChange
    );
    const active = st[0];
    const col = useMaybeControlled(props.collapsed, !!props.defaultCollapsed, props.onCollapsedChange);
    const collapsed = col[0];
    const tipState = React31.useState(null), tip = tipState[0], setTip = tipState[1];
    React31.useEffect(
      function() {
        if (!collapsed) setTip(null);
      },
      [collapsed]
    );
    React31.useEffect(
      function() {
        if (!tip) return;
        function esc(e) {
          if (e.key === "Escape") setTip(null);
        }
        document.addEventListener("keydown", esc);
        return function() {
          document.removeEventListener("keydown", esc);
        };
      },
      [tip]
    );
    function tipHandlers(label) {
      if (!collapsed) return {};
      function show2(e) {
        const r = e.currentTarget.getBoundingClientRect();
        setTip({ text: label, top: r.top + r.height / 2, left: r.right + 8 });
      }
      function hide() {
        setTip(null);
      }
      return { onMouseEnter: show2, onFocus: show2, onMouseLeave: hide, onBlur: hide };
    }
    const sections = props.sections || [{ items: props.items || [] }];
    const openState = React31.useState({}), toggled = openState[0], setToggled = openState[1];
    function isOpen(it) {
      if (toggled[it.id] != null) return toggled[it.id];
      return !!it.defaultOpen || contains(it, active);
    }
    React31.useEffect(
      function() {
        if (!active) return;
        const next = {};
        let changed = false;
        sections.forEach(function(s) {
          (function walk(list) {
            list.forEach(function(it) {
              if (it.children) {
                if (contains(it, active) && toggled[it.id] !== true) {
                  next[it.id] = true;
                  changed = true;
                }
                walk(it.children);
              }
            });
          })(s.items);
        });
        if (changed) setToggled(Object.assign({}, toggled, next));
      },
      [active]
    );
    const navRef = React31.useRef(null);
    function onKeyDown(e) {
      const k = e.key;
      if (k !== "ArrowDown" && k !== "ArrowUp" && k !== "Home" && k !== "End") return;
      const root = navRef.current;
      if (!root) return;
      const items2 = Array.prototype.slice.call(root.querySelectorAll(".aura-nav__item"));
      const visible = items2.filter(function(el) {
        return el.offsetParent !== null || el === document.activeElement;
      });
      const i = visible.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      const j = k === "Home" ? 0 : k === "End" ? visible.length - 1 : Math.max(0, Math.min(visible.length - 1, i + (k === "ArrowDown" ? 1 : -1)));
      visible[j].focus();
    }
    function inner(it, group, open) {
      const marked = it.count != null && it.count > 0 || it.badge != null;
      return [
        it.icon ? /* @__PURE__ */ React31.createElement(Icon, { key: "i", name: it.icon }) : collapsed ? /* @__PURE__ */ React31.createElement("span", { key: "i", className: "aura-nav__initial", "aria-hidden": "true" }, it.label.charAt(0)) : null,
        collapsed && marked ? /* @__PURE__ */ React31.createElement("span", { key: "d", className: "aura-nav__dot", "aria-hidden": "true" }) : null,
        /* @__PURE__ */ React31.createElement("span", { key: "l", className: "aura-nav__label" }, it.label),
        it.badge != null ? /* @__PURE__ */ React31.createElement("span", { key: "b", className: "aura-nav__badge" }, it.badge) : null,
        it.count != null ? /* @__PURE__ */ React31.createElement("span", { key: "c", className: "aura-nav__count" }, it.count) : null,
        group ? /* @__PURE__ */ React31.createElement(Icon, { key: "g", name: "chevron-down", className: cx("aura-nav__chevron", open && "is-open") }) : null
      ];
    }
    function item(it, depth) {
      if (it.children) {
        const open = !collapsed && isOpen(it);
        const listId = base + "-" + it.id;
        const holdsActive = contains(it, active);
        return /* @__PURE__ */ React31.createElement("li", { key: it.id, className: "aura-nav__group" }, /* @__PURE__ */ React31.createElement(
          "button",
          {
            type: "button",
            className: cx("aura-nav__item", "aura-nav__item--group", holdsActive && "has-active"),
            "aria-expanded": open,
            "aria-controls": listId,
            style: depth ? { ["--aura-nav-depth"]: depth } : void 0,
            ...tipHandlers(it.label),
            onClick: function() {
              const next = Object.assign({}, toggled);
              next[it.id] = !open;
              setToggled(next);
              if (collapsed) {
                setTip(null);
                col[1](false);
              }
            },
            onKeyDown: function(e) {
              if (e.key === "ArrowRight" && !open) {
                e.preventDefault();
                setToggled(Object.assign({}, toggled, { [it.id]: true }));
              } else if (e.key === "ArrowLeft" && open) {
                e.preventDefault();
                setToggled(Object.assign({}, toggled, { [it.id]: false }));
              }
            }
          },
          inner(it, true, open)
        ), /* @__PURE__ */ React31.createElement("ul", { id: listId, className: "aura-nav__list aura-nav__sub", hidden: !open }, it.children.map(function(c) {
          return item(c, depth + 1);
        })));
      }
      const on = active === it.id;
      const common = {
        ...tipHandlers(it.label),
        className: cx("aura-nav__item", on && "is-active"),
        "aria-current": on ? "page" : void 0,
        style: depth ? { ["--aura-nav-depth"]: depth } : void 0,
        onClick: function(e) {
          if (!it.href) e.preventDefault();
          st[1](it.id);
        }
      };
      return /* @__PURE__ */ React31.createElement("li", { key: it.id }, it.href ? /* @__PURE__ */ React31.createElement(Link, { href: it.href, ...common }, inner(it, false, false)) : /* @__PURE__ */ React31.createElement("button", { type: "button", ...common }, inner(it, false, false)));
    }
    return /* @__PURE__ */ React31.createElement(
      "nav",
      {
        ref: function(el) {
          navRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        },
        className: cx("aura-nav", collapsed && "aura-nav--collapsed", props.className),
        "data-collapsed": collapsed ? "" : void 0,
        "aria-label": props.label || t.mainNav,
        onKeyDown
      },
      props.header ? /* @__PURE__ */ React31.createElement("div", { className: "aura-nav__header" }, props.header) : null,
      /* @__PURE__ */ React31.createElement("div", { className: "aura-nav__scroll" }, sections.map(function(s, i) {
        return /* @__PURE__ */ React31.createElement("div", { key: i, className: "aura-nav__section" }, s.title ? /* @__PURE__ */ React31.createElement("p", { className: "aura-nav__title" }, s.title) : null, /* @__PURE__ */ React31.createElement("ul", { className: "aura-nav__list" }, s.items.map(function(it) {
          return item(it, 0);
        })));
      })),
      props.footer ? /* @__PURE__ */ React31.createElement("div", { className: "aura-nav__footer" }, props.footer) : null,
      props.collapsible ? /* @__PURE__ */ React31.createElement("div", { className: "aura-nav__toggle" }, /* @__PURE__ */ React31.createElement(
        IconButton,
        {
          icon: collapsed ? "panel-left-open" : "panel-left-close",
          label: collapsed ? t.expandNav : t.collapseNav,
          size: "md",
          onClick: function() {
            setTip(null);
            col[1](!collapsed);
          }
        }
      )) : null,
      tip && typeof document !== "undefined" ? (0, import_react_dom9.createPortal)(
        /* @__PURE__ */ React31.createElement(
          "div",
          {
            className: "aura-tooltip aura-tooltip--right",
            "aria-hidden": "true",
            style: { top: tip.top, left: tip.left }
          },
          tip.text
        ),
        document.body
      ) : null
    );
  });

  // src/Breadcrumb.tsx
  var React32 = __toESM(require_react(), 1);
  var Breadcrumb = React32.forwardRef(function Breadcrumb2(props, ref) {
    const t = useStrings();
    const Link = useLinkComponent(props.linkComponent);
    const items2 = props.items || [];
    return /* @__PURE__ */ React32.createElement("nav", { ref, "aria-label": props.label || t.breadcrumb, className: cx("aura-crumbs", props.className) }, /* @__PURE__ */ React32.createElement("ol", null, items2.map(function(it, i) {
      const last = i === items2.length - 1;
      return /* @__PURE__ */ React32.createElement("li", { key: i }, last ? /* @__PURE__ */ React32.createElement("span", { "aria-current": "page", className: "aura-crumbs__current" }, it.label) : it.href ? /* @__PURE__ */ React32.createElement(Link, { href: it.href, onClick: it.onClick }, it.label) : /* @__PURE__ */ React32.createElement("button", { type: "button", onClick: it.onClick }, it.label), last ? null : /* @__PURE__ */ React32.createElement(Icon, { name: "chevron-right", size: 12, className: "aura-crumbs__sep" }));
    })));
  });

  // src/Avatar.tsx
  var React33 = __toESM(require_react(), 1);
  var AVATAR_TONES = ["progress", "ready", "neutral", "warning"];
  function initials(name) {
    const parts = String(name || "?").trim().split(/\s+/);
    return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "")).toUpperCase();
  }
  var Avatar = React33.forwardRef(function Avatar2(props, ref) {
    const size = props.size || "md", errState = React33.useState(false);
    let hash = 0;
    String(props.name || "").split("").forEach(function(ch) {
      hash = hash * 31 + ch.charCodeAt(0) >>> 0;
    });
    const tone2 = AVATAR_TONES[hash % AVATAR_TONES.length];
    return /* @__PURE__ */ React33.createElement(
      "span",
      {
        ref,
        className: cx("aura-avatar", "aura-avatar--" + size, "aura-avatar--" + tone2, props.className),
        role: "img",
        "aria-label": props.name + (props.status ? ", " + props.status : "")
      },
      props.src && !errState[0] ? /* @__PURE__ */ React33.createElement(
        "img",
        {
          src: props.src,
          alt: "",
          onError: function() {
            errState[1](true);
          }
        }
      ) : /* @__PURE__ */ React33.createElement("span", { "aria-hidden": true }, initials(props.name)),
      props.status === "online" ? /* @__PURE__ */ React33.createElement("span", { className: "aura-avatar__status", "aria-hidden": true }) : null
    );
  });

  // src/Stack.tsx
  var React35 = __toESM(require_react(), 1);

  // src/responsive.tsx
  var React34 = __toESM(require_react(), 1);

  // src/breakpoints.ts
  var breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };

  // src/responsive.tsx
  var ORDER = ["base", "sm", "md", "lg", "xl"];
  function useBreakpoint() {
    return React34.useSyncExternalStore(subscribe, current, function() {
      return "lg";
    });
  }
  function current() {
    let w = window.innerWidth, bp = "base";
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
    const bp = useBreakpoint();
    if (value == null || typeof value !== "object") return value;
    const map = value;
    for (let i = ORDER.indexOf(bp); i >= 0; i--) if (map[ORDER[i]] !== void 0) return map[ORDER[i]];
    return void 0;
  }
  function respVars(prefix, value, map) {
    const style = {};
    if (value == null) return style;
    if (typeof value !== "object") value = { base: value };
    let byBp = value, cur;
    ORDER.forEach(function(k) {
      if (byBp[k] !== void 0) cur = map ? map(byBp[k]) : byBp[k];
      if (cur !== void 0) style["--" + prefix + "-" + k] = cur;
    });
    return style;
  }
  var space = function(v) {
    return typeof v === "number" ? "var(--aura-space-" + v + ")" : v;
  };

  // src/Stack.tsx
  var h5 = React35.createElement;
  var Stack = React35.forwardRef(function Stack2(props, ref) {
    const style = Object.assign(
      {},
      respVars("aura-stack-dir", props.direction || "column"),
      respVars("aura-stack-gap", props.gap == null ? 4 : props.gap, space),
      respVars("aura-stack-align", props.align || "stretch"),
      props.justify ? { justifyContent: props.justify } : null,
      props.wrap ? { flexWrap: "wrap" } : null,
      props.style
    );
    return h5(props.as || "div", { ref, className: cx("aura-stack", props.className), style }, props.children);
  });

  // src/Grid.tsx
  var React36 = __toESM(require_react(), 1);
  var h6 = React36.createElement;
  var Grid = React36.forwardRef(function Grid2(props, ref) {
    const style = Object.assign(
      {},
      respVars("aura-grid-gap", props.gap == null ? 6 : props.gap, space),
      props.minItemWidth ? { gridTemplateColumns: "repeat(auto-fill, minmax(min(" + props.minItemWidth + "px, 100%), 1fr))" } : respVars("aura-grid-cols", props.columns || 1),
      props.style
    );
    return h6(
      props.as || "div",
      { ref, className: cx("aura-grid-layout", props.minItemWidth && "is-auto", props.className), style },
      props.children
    );
  });

  // src/Container.tsx
  var React37 = __toESM(require_react(), 1);
  var h7 = React37.createElement;
  var Container = React37.forwardRef(function Container2(props, ref) {
    return h7(
      props.as || "div",
      {
        ref,
        className: cx("aura-container", props.size === "narrow" && "is-narrow", props.className),
        style: props.style
      },
      props.children
    );
  });

  // src/AppShell.tsx
  var React38 = __toESM(require_react(), 1);
  var AppShell = React38.forwardRef(function AppShell2(props, ref) {
    const t = useStrings();
    const bp = useBreakpoint();
    const wide = bp === "lg" || bp === "xl";
    const st = React38.useState(false), open = st[0], setOpen = st[1];
    React38.useEffect(
      function() {
        if (wide) setOpen(false);
      },
      [wide]
    );
    const navEl = props.nav && React38.isValidElement(props.nav) ? props.nav : null;
    const drawerNav = navEl ? React38.cloneElement(navEl, {
      onChange: function(id) {
        if (navEl.props.onChange) navEl.props.onChange(id);
        setOpen(false);
      },
      className: cx(navEl.props.className, "is-in-drawer"),
      collapsed: false,
      collapsible: false
    }) : props.nav;
    return /* @__PURE__ */ React38.createElement("div", { ref, className: cx("aura-shell", props.bottomNav && "aura-shell--bottomnav", props.className) }, props.nav ? /* @__PURE__ */ React38.createElement("div", { className: "aura-shell__nav" }, props.nav) : null, props.nav ? /* @__PURE__ */ React38.createElement(
      Drawer,
      {
        open,
        onClose: function() {
          setOpen(false);
        },
        side: "left",
        size: "nav",
        "aria-label": props.navLabel || t.navigation,
        dismissible: true
      },
      drawerNav
    ) : null, /* @__PURE__ */ React38.createElement("div", { className: "aura-shell__main" }, props.header || props.nav ? /* @__PURE__ */ React38.createElement("header", { className: cx("aura-shell__bar", !props.header && "aura-shell__bar--menu-only") }, props.nav ? /* @__PURE__ */ React38.createElement(
      IconButton,
      {
        className: "aura-shell__menu",
        icon: "menu",
        label: props.menuLabel || t.openNav,
        size: "md",
        onClick: function() {
          setOpen(true);
        },
        "aria-expanded": open
      }
    ) : null, /* @__PURE__ */ React38.createElement("div", { className: "aura-shell__bar-content" }, props.header)) : null, /* @__PURE__ */ React38.createElement("main", { className: "aura-shell__content", id: props.mainId || "main" }, props.children), props.bottomNav || null));
  });

  // src/ActionBar.tsx
  var React39 = __toESM(require_react(), 1);
  var ActionBar = React39.forwardRef(function ActionBar2(props, ref) {
    const t = useStrings();
    const bulk = props.selected != null;
    const idle = bulk && !props.selected;
    const count = bulk && props.selected ? t.selectedCount(props.selected) : null;
    const cameFrom = React39.useRef(null);
    const own = React39.useRef(null);
    function clear() {
      props.onClearSelection();
      setTimeout(function() {
        const back = cameFrom.current;
        const a = document.activeElement;
        if ((!a || a === document.body || !a.isConnected) && back && back.isConnected) back.focus();
      }, 0);
    }
    return /* @__PURE__ */ React39.createElement(
      "div",
      {
        ref: function(el) {
          own.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        },
        onFocus: function(e) {
          const from = e.relatedTarget;
          if (from && own.current && !own.current.contains(from)) cameFrom.current = from;
        },
        role: "region",
        "aria-label": props.label || t.actions,
        className: cx(
          "aura-actionbar",
          "aura-actionbar--" + (props.position || "viewport"),
          idle && "is-idle",
          props.className
        )
      },
      /* @__PURE__ */ React39.createElement("div", { className: "aura-actionbar__inner" }, /* @__PURE__ */ React39.createElement("div", { className: "aura-actionbar__status", role: "status" }, count, count && props.status ? " \xB7 " : null, props.status), !idle ? /* @__PURE__ */ React39.createElement("div", { className: "aura-actionbar__actions" }, count && props.onClearSelection ? /* @__PURE__ */ React39.createElement(Button, { variant: "ghost", size: "sm", onClick: clear }, t.clear()) : null, props.children) : null)
    );
  });

  // src/BottomNav.tsx
  var React40 = __toESM(require_react(), 1);
  var BottomNav = React40.forwardRef(function BottomNav2(props, ref) {
    const t = useStrings();
    const Link = useLinkComponent(props.linkComponent);
    const st = useMaybeControlled(
      props.value,
      props.defaultValue,
      props.onChange
    );
    const active = st[0];
    const hide = props.hideFrom === false ? "always" : "below-" + (props.hideFrom || "lg");
    return /* @__PURE__ */ React40.createElement(React40.Fragment, null, /* @__PURE__ */ React40.createElement("div", { className: cx("aura-bottomnav-spacer", "aura-bottomnav--" + hide), "aria-hidden": "true" }), /* @__PURE__ */ React40.createElement(
      "nav",
      {
        ref,
        className: cx("aura-bottomnav", "aura-bottomnav--" + hide, props.className),
        "aria-label": props.label || t.mainNav
      },
      /* @__PURE__ */ React40.createElement("ul", { className: "aura-bottomnav__list" }, props.items.map(function(it) {
        const on = active === it.id;
        const count = it.count != null && it.count > 0 ? it.count > 99 ? "99+" : String(it.count) : null;
        const common = {
          className: cx("aura-bottomnav__item", on && "is-active"),
          "aria-current": on ? "page" : void 0,
          onClick: function(e) {
            if (!it.href) e.preventDefault();
            st[1](it.id);
          }
        };
        const inner = [
          /* @__PURE__ */ React40.createElement("span", { key: "i", className: "aura-bottomnav__icon" }, /* @__PURE__ */ React40.createElement(Icon, { name: it.icon, size: "md" }), count ? /* @__PURE__ */ React40.createElement("span", { className: "aura-bottomnav__count", "aria-hidden": "true" }, count) : it.badge ? /* @__PURE__ */ React40.createElement("span", { className: "aura-bottomnav__dot", "aria-hidden": "true" }) : null),
          /* @__PURE__ */ React40.createElement("span", { key: "l", className: "aura-bottomnav__label" }, it.label),
          count || it.badge && it.badgeLabel ? /* @__PURE__ */ React40.createElement("span", { key: "s", className: "aura-sr-only" }, " (" + (count || it.badgeLabel) + ")") : null
        ];
        return /* @__PURE__ */ React40.createElement("li", { key: it.id, className: "aura-bottomnav__cell" }, it.href ? /* @__PURE__ */ React40.createElement(Link, { href: it.href, ...common }, inner) : /* @__PURE__ */ React40.createElement("button", { type: "button", ...common }, inner));
      }))
    ));
  });

  // src/Surface.tsx
  var React41 = __toESM(require_react(), 1);
  var h8 = React41.createElement;
  var Surface = React41.forwardRef(function Surface2(props, ref) {
    const t = props.texture || "mesh";
    const rest = omit(props, ["texture", "className", "children", "as"]);
    return h8(
      props.as || "div",
      Object.assign({}, rest, {
        ref,
        /* Textures stay light in every theme, so everything on them uses the light tokens. */
        "data-theme": "light",
        className: cx(
          "aura-surface",
          (t === "mesh" || t === "mesh-grain") && "aura-mesh",
          (t === "grain" || t === "mesh-grain") && "aura-grain",
          props.className
        )
      }),
      props.children
    );
  });

  // src/Stat.tsx
  var React42 = __toESM(require_react(), 1);
  var Stat = React42.forwardRef(function Stat2(props, ref) {
    const ch = props.change;
    const dir = ch && (ch.direction || "flat");
    const tone2 = ch && (ch.tone || (dir === "up" ? "positive" : dir === "down" ? "negative" : "neutral"));
    const Link = useLinkComponent(props.linkComponent);
    const v = props.value;
    const numeric = typeof v === "number" || typeof v === "string" && /\d/.test(v) && /^[\s\d.,:+\-\u2212%()\u0E3F$\u20AC\u00A3\u00A5kKmMbB]+$/.test(v.replace(/\b[A-Z]{3}\b/g, ""));
    const Tag3 = props.href ? Link : props.onClick ? "button" : "div";
    const interactive = !!(props.href || props.onClick);
    return /* @__PURE__ */ React42.createElement(
      Tag3,
      {
        ref,
        className: cx("aura-stat", interactive && "is-interactive", props.loading && "is-loading", props.className),
        href: props.href,
        onClick: props.onClick,
        type: Tag3 === "button" ? "button" : void 0,
        "aria-busy": props.loading || void 0
      },
      /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__head" }, /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__label" }, props.label), props.icon ? /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__icon" }, /* @__PURE__ */ React42.createElement(Icon, { name: props.icon })) : null),
      props.loading ? /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__value" }, /* @__PURE__ */ React42.createElement("span", { className: "aura-skel aura-stat__skel" })) : /* @__PURE__ */ React42.createElement("span", { className: cx("aura-stat__value", numeric && "is-numeric") }, props.value, props.unit ? /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__unit" }, props.unit) : null),
      ch && !props.loading || props.caption ? /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__foot" }, ch && !props.loading ? /* @__PURE__ */ React42.createElement("span", { className: cx("aura-stat__change", "is-" + tone2) }, /* @__PURE__ */ React42.createElement(Icon, { name: dir === "up" ? "trending-up" : dir === "down" ? "trending-down" : "minus", size: 14 }), /* @__PURE__ */ React42.createElement("span", null, ch.value)) : null, ch && ch.label && !props.loading ? /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__caption" }, ch.label) : null, props.caption ? /* @__PURE__ */ React42.createElement("span", { className: "aura-stat__caption" }, props.caption) : null) : null
    );
  });

  // src/TimePicker.tsx
  var React43 = __toESM(require_react(), 1);
  var import_react_dom10 = __toESM(require_react_dom(), 1);

  // src/text.ts
  function formatBytes(n2) {
    if (n2 == null) return "";
    if (n2 < 1024) return n2 + " B";
    let u = ["KB", "MB", "GB"], i = -1;
    do {
      n2 /= 1024;
      i++;
    } while (n2 >= 1024 && i < u.length - 1);
    return (n2 >= 10 || Math.round(n2) === n2 ? Math.round(n2) : n2.toFixed(1)) + " " + u[i];
  }
  function pad2(n2) {
    return (n2 < 10 ? "0" : "") + n2;
  }
  function parseTime(text) {
    let s = String(text || "").trim().toLowerCase().replace(/\s*(น\.?|นาฬิกา)$/, "").trim();
    const pm = /\s*(pm|p\.m\.)$/.test(s), am = /\s*(am|a\.m\.)$/.test(s);
    s = s.replace(/\s*(am|pm|a\.m\.|p\.m\.)$/, "");
    const m = /^(\d{1,2})(?:[:.](\d{2}))?$/.exec(s) || /^(\d{1,2})(\d{2})$/.exec(s);
    if (!m) return null;
    let hh = +m[1], mm = m[2] ? +m[2] : 0;
    if (pm && hh < 12) hh += 12;
    if (am && hh === 12) hh = 0;
    if (hh > 23 || mm > 59) return null;
    return pad2(hh) + ":" + pad2(mm);
  }

  // src/TimePicker.tsx
  function pad3(n2) {
    return (n2 < 10 ? "0" : "") + n2;
  }
  function toMin(t) {
    const m = /^(\d{2}):(\d{2})$/.exec(t || "");
    return m ? +m[1] * 60 + +m[2] : null;
  }
  function fromMin(n2) {
    return pad3(Math.floor(n2 / 60)) + ":" + pad3(n2 % 60);
  }
  var TimePicker = React43.forwardRef(function TimePicker2(props, ref) {
    const t = useStrings();
    const auto = uid(), id = props.id || auto, listId = id + "-list";
    const st = useMaybeControlled(
      props.value,
      props.defaultValue == null ? null : props.defaultValue,
      props.onChange
    );
    const value = st[0];
    const step = props.step || 30, lo = toMin(props.min) != null ? toMin(props.min) : 0, hi = toMin(props.max) != null ? toMin(props.max) : 24 * 60 - 1;
    const slots = React43.useMemo(
      function() {
        const out = [];
        for (let m = lo; m <= hi; m += step) out.push(fromMin(m));
        return out;
      },
      [lo, hi, step]
    );
    function blocked(v) {
      const n2 = toMin(v);
      return n2 == null || n2 < lo || n2 > hi || props.isTimeDisabled && props.isTimeDisabled(v);
    }
    const openState = React43.useState(false), open = openState[0], setOpen = openState[1];
    const editState = React43.useState(null), editing = editState[0], setEditing = editState[1];
    const aState = React43.useState(0), active = aState[0], setActive = aState[1];
    const errState = React43.useState(null);
    const pos = React43.useState(null);
    const boxRef = React43.useRef(null), inputRef = React43.useRef(null), listRef = React43.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    const mounted = useMounted();
    function nearest(v) {
      const n2 = toMin(v);
      if (n2 == null) return 0;
      let best = 0;
      slots.forEach(function(s, i) {
        if (Math.abs(toMin(s) - n2) < Math.abs(toMin(slots[best]) - n2)) best = i;
      });
      return best;
    }
    function place() {
      if (!boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect(), below = window.innerHeight - r.bottom - 8, up = below < 200 && r.top > below;
      pos[1]({
        left: r.left,
        width: Math.max(r.width, 160),
        top: up ? void 0 : r.bottom + 4,
        bottom: up ? window.innerHeight - r.top + 4 : void 0,
        maxHeight: Math.min(280, (up ? r.top : below) - 8)
      });
    }
    useIsoLayoutEffect(
      function() {
        if (open) place();
      },
      [open]
    );
    React43.useEffect(
      function() {
        if (!open) return;
        function outside(e) {
          if (boxRef.current && boxRef.current.contains(e.target) || listRef.current && listRef.current.contains(e.target))
            return;
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
      },
      [open]
    );
    React43.useEffect(
      function() {
        if (!open || !listRef.current) return;
        const el = listRef.current.querySelector('[data-idx="' + active + '"]');
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
      },
      [active, open]
    );
    function show2() {
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
      const v = slots[i];
      if (!v || blocked(v)) return;
      commit(v);
      setEditing(null);
      setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    function commitTyped() {
      if (editing == null) return;
      const txt = editing.trim();
      if (!txt) commit(null);
      else {
        const v = parseTime(txt);
        if (v) commit(v);
        else errState[1](t.timeInvalid);
      }
      setEditing(null);
    }
    function move(d) {
      let i = active;
      for (let k = 0; k < slots.length; k++) {
        i = Math.min(slots.length - 1, Math.max(0, i + d));
        if (!blocked(slots[i])) break;
      }
      setActive(i);
    }
    function onKeyDown(e) {
      const k = e.key;
      if (k === "ArrowDown") {
        e.preventDefault();
        if (!open) show2();
        else move(1);
      } else if (k === "ArrowUp") {
        e.preventDefault();
        if (!open) show2();
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
    const error = errState[0] || props.error;
    const list = open && mounted && pos[0] ? (0, import_react_dom10.createPortal)(
      /* @__PURE__ */ React43.createElement("div", { ref: listRef, className: "aura-combo__popover aura-time__popover", style: pos[0] }, /* @__PURE__ */ React43.createElement("ul", { id: listId, role: "listbox", "aria-label": props.label, className: "aura-combo__list" }, slots.map(function(s, i) {
        const dis = blocked(s), sel = s === value;
        return /* @__PURE__ */ React43.createElement(
          "li",
          {
            key: s,
            id: id + "-opt-" + i,
            role: "option",
            "data-idx": i,
            "aria-selected": sel,
            "aria-disabled": dis || void 0,
            className: cx(
              "aura-combo__option aura-time__option",
              i === active && "is-active",
              sel && "is-selected",
              dis && "is-disabled"
            ),
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
          /* @__PURE__ */ React43.createElement("span", { className: "aura-combo__label" }, s),
          sel ? /* @__PURE__ */ React43.createElement(Icon, { name: "check", className: "aura-combo__check" }) : null
        );
      }))),
      document.body
    ) : null;
    return /* @__PURE__ */ React43.createElement(
      Field,
      {
        id,
        label: props.label,
        hint: props.hint,
        error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React43.createElement("div", { ref: boxRef, className: cx("aura-input aura-combo aura-time has-icon", open && "is-open") }, /* @__PURE__ */ React43.createElement(Icon, { name: "clock", className: "aura-input__icon" }), /* @__PURE__ */ React43.createElement(
        "input",
        {
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
            const v = parseTime(e.target.value);
            if (v) {
              if (!open) show2();
              setActive(nearest(v));
            }
          },
          onClick: show2,
          onKeyDown,
          onBlur: function() {
            setTimeout(function() {
              if (listRef.current && listRef.current.contains(document.activeElement)) return;
              commitTyped();
              setOpen(false);
            }, 0);
          }
        }
      ), props.clearable !== false && value != null && !props.disabled ? /* @__PURE__ */ React43.createElement(
        "button",
        {
          type: "button",
          className: "aura-combo__clear",
          "aria-label": t.clear(props.label),
          tabIndex: -1,
          onClick: function() {
            commit(null);
            setEditing(null);
            if (inputRef.current) inputRef.current.focus();
          }
        },
        /* @__PURE__ */ React43.createElement(Icon, { name: "x" })
      ) : null, /* @__PURE__ */ React43.createElement(
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
              show2();
              inputRef.current && inputRef.current.focus();
            }
          }
        },
        /* @__PURE__ */ React43.createElement(Icon, { name: "chevron-down" })
      )),
      list
    );
  });

  // src/FileUpload.tsx
  var React44 = __toESM(require_react(), 1);
  function matches(file, accept) {
    if (!accept) return true;
    const name = (file.name || "").toLowerCase(), type = (file.type || "").toLowerCase();
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
  var FileUpload = React44.forwardRef(function FileUpload2(props, ref) {
    const t = useStrings();
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(props.value, props.defaultValue || [], props.onChange);
    const items2 = st[0] || [];
    const dragState = React44.useState(false), over = dragState[0];
    const inputRef = React44.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    const urls = React44.useRef({});
    const maxFiles = props.multiple ? props.maxFiles : 1;
    const note = t.accepts(describeAccept(props.accept, t), props.maxSize ? formatBytes(props.maxSize) : "");
    React44.useEffect(function() {
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
      const files = Array.prototype.slice.call(list || []);
      if (!files.length || props.disabled) return;
      const keep = props.multiple ? items2.slice() : [];
      let room = maxFiles ? maxFiles - keep.filter(function(i) {
        return !i.error;
      }).length : Infinity;
      files.forEach(function(f) {
        let err = null;
        if (!matches(f, props.accept)) err = t.fileWrongType;
        else if (props.maxSize && f.size > props.maxSize) err = t.fileTooBig(formatBytes(props.maxSize));
        else if (room <= 0) err = t.tooManyFiles(maxFiles);
        else room--;
        keep.push({
          id: "f" + ++seq,
          file: f,
          name: f.name,
          size: f.size,
          type: f.type,
          status: err ? "error" : "ready",
          error: err || void 0
        });
      });
      st[1](keep);
    }
    function remove(it) {
      if (urls.current[it.id]) {
        URL.revokeObjectURL(urls.current[it.id]);
        delete urls.current[it.id];
      }
      st[1](
        items2.filter(function(x) {
          return x.id !== it.id;
        })
      );
      if (props.onRemove) props.onRemove(it);
      if (inputRef.current) inputRef.current.focus();
    }
    const error = props.error;
    return /* @__PURE__ */ React44.createElement(
      Field,
      {
        id,
        label: props.label,
        hint: props.hint,
        error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React44.createElement(
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
        /* @__PURE__ */ React44.createElement(Icon, { name: "cloud-upload", size: "lg", className: "aura-upload__icon" }),
        /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__text" }, t.dropFiles, " "),
        /* @__PURE__ */ React44.createElement(
          "input",
          {
            ref: inputMerged,
            id,
            type: "file",
            className: "aura-upload__input",
            accept: props.accept,
            multiple: !!props.multiple,
            disabled: props.disabled,
            name: props.name,
            required: props.required && !items2.some(function(i) {
              return !i.error;
            }),
            "aria-invalid": error ? true : void 0,
            "aria-describedby": [error ? id + "-error" : props.hint ? id + "-hint" : null, note ? id + "-note" : null].filter(Boolean).join(" ") || void 0,
            onChange: function(e) {
              add(e.target.files);
              e.target.value = "";
            }
          }
        ),
        /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__browse", "aria-hidden": true }, props.multiple ? t.browse : t.browseOne),
        note ? /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__note", id: id + "-note" }, note) : null
      ),
      items2.length ? /* @__PURE__ */ React44.createElement("ul", { className: "aura-upload__list", "aria-live": "polite" }, items2.map(function(it) {
        const src = thumb(it);
        return /* @__PURE__ */ React44.createElement("li", { key: it.id, className: cx("aura-upload__item", it.error && "is-error") }, src ? /* @__PURE__ */ React44.createElement("img", { className: "aura-upload__thumb", src, alt: "" }) : /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__thumb is-icon", "aria-hidden": true }, /* @__PURE__ */ React44.createElement(Icon, { name: /^image\//.test(it.type || "") ? "image" : "file", size: "md" })), /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__meta" }, /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__name" }, it.name), /* @__PURE__ */ React44.createElement("span", { className: "aura-upload__sub" }, it.error ? /* @__PURE__ */ React44.createElement(React44.Fragment, null, /* @__PURE__ */ React44.createElement(Icon, { name: "circle-alert", size: 12 }), it.error) : it.status === "uploading" ? t.uploading + (it.progress != null ? " " + Math.round(it.progress) + "%" : "") : it.status === "done" ? /* @__PURE__ */ React44.createElement(React44.Fragment, null, /* @__PURE__ */ React44.createElement(Icon, { name: "circle-check", size: 12 }), formatBytes(it.size)) : formatBytes(it.size)), it.status === "uploading" ? /* @__PURE__ */ React44.createElement(
          "span",
          {
            className: "aura-upload__bar",
            role: "progressbar",
            "aria-label": it.name,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": it.progress != null ? Math.round(it.progress) : void 0
          },
          /* @__PURE__ */ React44.createElement("span", { style: { width: (it.progress || 0) + "%" } })
        ) : null), /* @__PURE__ */ React44.createElement(
          IconButton,
          {
            icon: "x",
            label: t.remove(it.name),
            onClick: function() {
              remove(it);
            }
          }
        ));
      })) : null
    );
  });

  // src/theme.ts
  function hexToRgb(hex) {
    let h9 = String(hex).trim().replace("#", "");
    if (h9.length === 3)
      h9 = h9.split("").map(function(c) {
        return c + c;
      }).join("");
    if (!/^[0-9a-f]{6}$/i.test(h9)) throw new Error('createTheme: "' + hex + '" is not a #rgb or #rrggbb colour');
    return [0, 2, 4].map(function(i) {
      return parseInt(h9.slice(i, i + 2), 16) / 255;
    });
  }
  function rgbToHex(rgb) {
    return "#" + rgb.map(function(v) {
      const n2 = Math.round(Math.min(1, Math.max(0, v)) * 255);
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
    const r = lin(rgb[0]), g = lin(rgb[1]), b = lin(rgb[2]);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
    return [L, Math.sqrt(A * A + B * B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
  }
  function oklchToRgbRaw(L, C, H) {
    const a = C * Math.cos(H * Math.PI / 180), b = C * Math.sin(H * Math.PI / 180);
    const l = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3);
    const m = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3);
    const s = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3);
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
    let lo = 0, hi = C, rgb = oklchToRgbRaw(L, C, H);
    if (inGamut(rgb)) return rgbToHex(rgb);
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (inGamut(oklchToRgbRaw(L, mid, H))) lo = mid;
      else hi = mid;
    }
    return rgbToHex(oklchToRgbRaw(L, lo, H));
  }
  function luminance(hex) {
    const c = hexToRgb(hex).map(lin);
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  }
  function contrast(a, b) {
    const x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function mix(a, b, t) {
    const x = hexToRgb(a), y = hexToRgb(b);
    return rgbToHex(
      x.map(function(v, i) {
        return v + (y[i] - v) * t;
      })
    );
  }
  var STEPS = {
    50: [0.975, 0.18],
    100: [0.945, 0.3],
    200: [0.895, 0.5],
    300: [0.81, 0.72],
    400: [0.715, 0.9],
    500: [0.635, 1],
    600: [0.555, 1],
    700: [0.49, 0.95],
    800: [0.43, 0.85],
    900: [0.38, 0.72]
  };
  function scale(hex) {
    const o = rgbToOklch(hexToRgb(hex)), C = Math.max(o[1], 0.02), out = {};
    Object.keys(STEPS).forEach(function(k) {
      out[k] = oklchToHex(STEPS[k][0], C * STEPS[k][1] / 0.95 * (o[1] < 0.03 ? 0.4 : 1), o[2]);
    });
    return out;
  }
  function fit(hex, grounds, target, dir) {
    let o = rgbToOklch(hexToRgb(hex)), L = o[0], c = hex;
    for (let i = 0; i < 80; i++) {
      if (grounds.every(function(g) {
        return contrast(c, g) >= target;
      }))
        return c;
      L = Math.min(1, Math.max(0, L + dir * 0.01));
      c = oklchToHex(L, o[1], o[2]);
    }
    return c;
  }
  function atLuminance(hex, Y) {
    const o = rgbToOklch(hexToRgb(hex)), C = Math.max(o[1], 0.02);
    let lo = 0, hi = 1, c = hex;
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      c = oklchToHex(mid, C, o[2]);
      if (luminance(c) < Y) lo = mid;
      else hi = mid;
    }
    return c;
  }
  var CHART_Y = { light: 0.075, dark: 0.46 };
  var SEQ_Y = { light: [0.26, 0.165, 0.1, 0.055, 0.028], dark: [0.14, 0.22, 0.34, 0.5, 0.7] };
  var CHART_2 = "#0a8b7a";
  var ZINC = { 0: "#ffffff", 50: "#fafafa", 100: "#f4f4f5", 800: "#27272a", 900: "#18181b", 950: "#09090b" };
  var INK = "#18181b";
  function createTheme(opts) {
    const o = opts || {};
    if (!o.brand) throw new Error('createTheme: pass { brand: "#rrggbb" }');
    const b = scale(o.brand), s = o.signal ? scale(o.signal) : null;
    const lightGrounds = [ZINC[0], ZINC[50]], darkGrounds = [ZINC[900], ZINC[950]];
    const L = {}, D = {};
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
    L["chart-1"] = atLuminance(o.brand, CHART_Y.light);
    D["chart-1"] = atLuminance(o.brand, CHART_Y.dark);
    SEQ_Y.light.forEach(function(y, i) {
      L["chart-seq-" + (i + 1)] = atLuminance(o.brand, y);
    });
    SEQ_Y.dark.forEach(function(y, i) {
      D["chart-seq-" + (i + 1)] = atLuminance(o.brand, y);
    });
    D["fg-accent"] = fit(b[300], darkGrounds, 4.5, 1);
    D["accent-violet"] = fit(b[400], darkGrounds, 3, 1);
    D["focus-ring"] = fit(b[400], darkGrounds, 3, 1);
    D["bg-selected"] = mix(ZINC[900], b[500], 0.16);
    D["alert-info-bg"] = D["bg-selected"];
    D["alert-info-fg"] = fit(b[300], [D["alert-info-bg"]], 4.5, 1);
    D["alert-info-border"] = mix(ZINC[900], b[400], 0.4);
    D["status-progress-bg"] = mix(ZINC[900], b[500], 0.2);
    D["status-progress-fg"] = fit(b[300], [D["status-progress-bg"]], 4.5, 1);
    if (s) {
      L["accent-dot"] = s[200];
      L["accent-lime"] = s[200];
      L["mesh-to"] = s[200];
      D["accent-dot"] = s[200];
      D["accent-lime"] = s[200];
      D["mesh-to"] = s[200];
    }
    const shadowLight = INK, shadowDark = D["accent-violet"];
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
    const checks = [];
    function check(theme, fg, bg, target, fgHex, bgHex) {
      const r = contrast(fgHex, bgHex);
      checks.push({
        theme,
        pair: fg + " on " + bg,
        ratio: Math.round(r * 100) / 100,
        target,
        pass: r >= target - 5e-3
      });
    }
    [
      ["bg-surface", ZINC[0]],
      ["bg-canvas", ZINC[50]],
      ["bg-selected", L["bg-selected"]]
    ].forEach(function(g) {
      check("light", "fg-accent", g[0], 4.5, L["fg-accent"], g[1]);
      check("light", "focus-ring", g[0], 3, L["focus-ring"], g[1]);
    });
    [
      ["bg-surface", ZINC[900]],
      ["bg-canvas", ZINC[950]],
      ["bg-selected", D["bg-selected"]]
    ].forEach(function(g) {
      check("dark", "fg-accent", g[0], 4.5, D["fg-accent"], g[1]);
      check("dark", "focus-ring", g[0], 3, D["focus-ring"], g[1]);
    });
    [
      ["light", ZINC[0], L],
      ["light", ZINC[50], L],
      ["dark", ZINC[900], D],
      ["dark", ZINC[950], D]
    ].forEach(function(g) {
      const t = g[0], ground = g[1], m = g[2], name = ground === ZINC[0] || ground === ZINC[900] ? "bg-surface" : "bg-canvas";
      ["chart-1", "chart-seq-1", "chart-seq-5"].forEach(function(k) {
        check(t, k, name, 3, m[k], ground);
      });
    });
    check("light", "chart-1", "chart-2 (lightness step)", 1.8, L["chart-1"], CHART_2);
    check("dark", "chart-1", "chart-2 (lightness step)", 1.8, D["chart-1"], CHART_2);
    check("light", "fg-primary", "bg-selected", 4.5, INK, L["bg-selected"]);
    check("dark", "fg-primary", "bg-selected", 4.5, "#ffffff", D["bg-selected"]);
    check("light", "status-progress-fg", "status-progress-bg", 4.5, L["status-progress-fg"], L["status-progress-bg"]);
    check("dark", "status-progress-fg", "status-progress-bg", 4.5, D["status-progress-fg"], D["status-progress-bg"]);
    check("light", "alert-info-fg", "alert-info-bg", 4.5, L["alert-info-fg"], L["alert-info-bg"]);
    check("dark", "alert-info-fg", "alert-info-bg", 4.5, D["alert-info-fg"], D["alert-info-bg"]);
    if (o.primary === "brand") {
      check("light", "button-primary-fg", "button-primary-bg", 4.5, L["button-primary-fg"], L["button-primary-bg"]);
      check(
        "light",
        "button-primary-fg",
        "button-primary-bg-hover",
        4.5,
        L["button-primary-fg"],
        L["button-primary-bg-hover"]
      );
      check("dark", "button-primary-fg", "button-primary-bg", 4.5, D["button-primary-fg"], D["button-primary-bg"]);
      check(
        "dark",
        "button-primary-fg",
        "button-primary-bg-hover",
        4.5,
        D["button-primary-fg"],
        D["button-primary-bg-hover"]
      );
    }
    if (s) check("light", "ink", "accent-lime (signal)", 4.5, INK, s[200]);
    function css(selector) {
      const light = selector ? selector : ':root, [data-theme="light"]';
      const dark = selector ? selector + ".dark, .dark " + selector + ", " + selector + '[data-theme="dark"], [data-theme="dark"] ' + selector : '.dark, [data-theme="dark"]';
      const system = selector ? '[data-theme="system"] ' + selector + ", " + selector + '[data-theme="system"]' : '[data-theme="system"]';
      function block(sel, m) {
        return sel + " {\n" + Object.keys(m).map(function(k) {
          return "  --aura-" + k + ": " + m[k] + ";";
        }).join("\n") + "\n}";
      }
      return "/* AURA theme" + (o.name ? ' "' + o.name + '"' : "") + ": brand " + o.brand + (o.signal ? ", signal " + o.signal : "") + (o.primary === "brand" ? ", brand primary buttons" : "") + ". Load after aura.css. Generated by createTheme. */\n" + block(light, L) + "\n" + block(dark, D) + "\n@media (prefers-color-scheme: dark) {\n" + block(system, D) + "\n}\n";
    }
    return {
      name: o.name || null,
      brand: b,
      signal: s,
      light: L,
      dark: D,
      checks,
      ok: checks.every(function(c) {
        return c.pass;
      }),
      css
    };
  }

  // src/ThemeStyle.tsx
  var React45 = __toESM(require_react(), 1);
  function ThemeStyle(props) {
    const css = React45.useMemo(
      function() {
        return createTheme({ brand: props.brand, signal: props.signal, primary: props.primary, name: props.name }).css(
          props.selector
        );
      },
      [props.brand, props.signal, props.primary, props.name, props.selector]
    );
    return /* @__PURE__ */ React45.createElement("style", { "data-aura-theme": props.name || props.brand, dangerouslySetInnerHTML: { __html: css } });
  }

  // src/colorScheme.tsx
  var React46 = __toESM(require_react(), 1);

  // src/colorSchemeScript.ts
  var DEFAULT_KEY = "aura-color-scheme";
  var SCHEMES = ["light", "dark", "system"];
  var EVENT = "aura-color-scheme";
  function valid(v) {
    return typeof v === "string" && SCHEMES.indexOf(v) >= 0;
  }
  function colorSchemeScript(options) {
    const key = JSON.stringify(options && options.storageKey || DEFAULT_KEY);
    const fallback = JSON.stringify(options && options.defaultScheme || "system");
    return "(function(){try{var s=localStorage.getItem(" + key + ");if(s!=='light'&&s!=='dark'&&s!=='system')s=" + fallback + `;var d=document.documentElement;d.setAttribute("data-theme",s);var dark=s==='dark'||(s==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);d.classList.toggle("dark",dark);}catch(e){}})();`;
  }

  // src/colorScheme.tsx
  function ColorSchemeScript(props) {
    return /* @__PURE__ */ React46.createElement(
      "script",
      {
        "data-aura-color-scheme": "",
        nonce: props.nonce,
        dangerouslySetInnerHTML: { __html: colorSchemeScript(props) }
      }
    );
  }
  function systemDark() {
    return typeof window !== "undefined" && !!window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function readScheme(fallback) {
    if (typeof document === "undefined") return fallback;
    const attr = document.documentElement.getAttribute("data-theme");
    return valid(attr) ? attr : fallback;
  }
  function apply(scheme) {
    const d = document.documentElement;
    d.setAttribute("data-theme", scheme);
    d.classList.toggle("dark", scheme === "dark" || scheme === "system" && systemDark());
  }
  function useColorScheme(options) {
    const key = options && options.storageKey || DEFAULT_KEY;
    const fallback = options && options.defaultScheme || "system";
    const subscribe2 = React46.useCallback(
      function(cb) {
        const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
        function onSystem() {
          if (readScheme(fallback) === "system") apply("system");
          cb();
        }
        if (mq) mq.addEventListener("change", onSystem);
        window.addEventListener(EVENT, cb);
        window.addEventListener("storage", cb);
        return function() {
          if (mq) mq.removeEventListener("change", onSystem);
          window.removeEventListener(EVENT, cb);
          window.removeEventListener("storage", cb);
        };
      },
      [fallback]
    );
    const snapshot = React46.useSyncExternalStore(
      subscribe2,
      function() {
        const s = readScheme(fallback);
        return s + "|" + (s === "dark" || s === "system" && systemDark() ? "dark" : "light");
      },
      function() {
        return fallback + "|light";
      }
    );
    const parts = snapshot.split("|");
    const setScheme = React46.useCallback(
      function(next) {
        if (!valid(next)) return;
        try {
          localStorage.setItem(key, next);
        } catch (e) {
        }
        apply(next);
        window.dispatchEvent(new Event(EVENT));
      },
      [key]
    );
    return { scheme: parts[0], resolved: parts[1], setScheme };
  }
  function ColorSchemeToggle(props) {
    const t = useStrings();
    const cs = useColorScheme(props);
    const names = { light: t.schemeLight, dark: t.schemeDark, system: t.schemeSystem };
    const label = props.label || t.colorScheme;
    return /* @__PURE__ */ React46.createElement(
      DropdownMenu,
      {
        label,
        trigger: /* @__PURE__ */ React46.createElement(IconButton, { icon: cs.resolved === "dark" ? "moon" : "sun", label: label + ": " + names[cs.scheme] }),
        items: SCHEMES.map(function(s) {
          return {
            label: names[s],
            checked: cs.scheme === s,
            onSelect: function() {
              cs.setScheme(s);
            }
          };
        })
      }
    );
  }

  // src/Badge.tsx
  var React47 = __toESM(require_react(), 1);
  var Badge = React47.forwardRef(function Badge2(props, ref) {
    const rest = omit(props, ["tone", "variant", "icon", "className", "children"]);
    return /* @__PURE__ */ React47.createElement(
      "span",
      {
        ...rest,
        ref,
        className: cx(
          "aura-badge",
          "aura-badge--" + tone(props.tone),
          props.variant === "solid" && "is-solid",
          props.variant === "outline" && "is-outline",
          props.className
        )
      },
      props.icon ? /* @__PURE__ */ React47.createElement(Icon, { name: props.icon, size: 12 }) : null,
      props.children
    );
  });

  // src/Progress.tsx
  var React48 = __toESM(require_react(), 1);
  var Progress = React48.forwardRef(function Progress2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const max = props.max || 100, det = props.value != null;
    const pct = det ? Math.max(0, Math.min(100, props.value / max * 100)) : 0;
    const shown = props.valueLabel != null ? props.valueLabel : det ? Math.round(pct) + "%" : null;
    return /* @__PURE__ */ React48.createElement(
      "div",
      {
        ref,
        className: cx(
          "aura-progress",
          "aura-progress--" + tone(props.tone || "accent"),
          props.size === "sm" && "is-sm",
          props.className
        )
      },
      props.label || props.showValue && shown ? /* @__PURE__ */ React48.createElement("div", { className: "aura-progress__head" }, props.label ? /* @__PURE__ */ React48.createElement("span", { className: "aura-progress__label", id: id + "-label" }, props.label) : /* @__PURE__ */ React48.createElement("span", null), props.showValue && shown ? /* @__PURE__ */ React48.createElement("span", { className: "aura-progress__value" }, shown) : null) : null,
      /* @__PURE__ */ React48.createElement(
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
        /* @__PURE__ */ React48.createElement("span", { className: "aura-progress__bar", style: det ? { width: pct + "%" } : void 0 })
      ),
      props.hint ? /* @__PURE__ */ React48.createElement("p", { className: "aura-progress__hint" }, props.hint) : null
    );
  });

  // src/Skeleton.tsx
  var React49 = __toESM(require_react(), 1);
  var Skeleton = React49.forwardRef(function Skeleton2(props, ref) {
    const v = props.variant || "text";
    if (v === "text" && (props.lines || 1) > 1) {
      const n2 = props.lines, rows = [];
      for (let i = 0; i < n2; i++)
        rows.push(/* @__PURE__ */ React49.createElement("span", { key: i, className: "aura-skel aura-skel--text", style: { width: i === n2 - 1 ? "60%" : "100%" } }));
      return /* @__PURE__ */ React49.createElement(
        "span",
        {
          ref,
          className: cx("aura-skel-lines", props.className),
          "aria-hidden": true,
          style: props.width ? { width: props.width } : void 0
        },
        rows
      );
    }
    const style = {
      width: props.width,
      height: props.height
    };
    if (v === "circle") {
      style.width = style.height = props.size || props.width || 40;
    }
    return /* @__PURE__ */ React49.createElement("span", { ref, "aria-hidden": true, className: cx("aura-skel", "aura-skel--" + v, props.className), style });
  });

  // src/EmptyState.tsx
  var React50 = __toESM(require_react(), 1);
  var EmptyState = React50.forwardRef(function EmptyState2(props, ref) {
    const HT = "h" + (props.headingLevel || 3);
    return /* @__PURE__ */ React50.createElement(
      "div",
      {
        ref,
        className: cx("aura-empty", props.size === "sm" && "is-sm", props.bordered && "is-bordered", props.className)
      },
      /* @__PURE__ */ React50.createElement("span", { className: "aura-empty__icon", "aria-hidden": true }, /* @__PURE__ */ React50.createElement(Icon, { name: props.icon || "inbox", size: props.size === "sm" ? "md" : "lg" })),
      /* @__PURE__ */ React50.createElement(HT, { className: "aura-empty__title" }, props.title),
      props.description ? /* @__PURE__ */ React50.createElement("p", { className: "aura-empty__text" }, props.description) : null,
      props.action ? /* @__PURE__ */ React50.createElement("div", { className: "aura-empty__action" }, props.action) : null
    );
  });

  // src/Pagination.tsx
  var React51 = __toESM(require_react(), 1);
  function pageList(page, count, sib) {
    let out = [], lo = Math.max(2, page - sib), hi = Math.min(count - 1, page + sib);
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
    for (let i = lo; i <= hi; i++) out.push(i);
    if (hi === count - 2) out.push(count - 1);
    else if (hi < count - 2) out.push("\u2026b");
    if (count > 1) out.push(count);
    return out;
  }
  var Pagination = React51.forwardRef(function Pagination2(props, ref) {
    const t = useStrings();
    const count = Math.max(1, props.pageCount || 1);
    const st = useMaybeControlled(props.page, props.defaultPage || 1, props.onChange);
    const page = Math.min(count, Math.max(1, st[0]));
    function go(p) {
      if (p >= 1 && p <= count && p !== page) st[1](p);
    }
    const link = props.getHref;
    const Link = useLinkComponent(props.linkComponent);
    function item(p, label, extra) {
      const common = Object.assign(
        {
          className: cx("aura-page", p === page && "is-current"),
          "aria-current": p === page ? "page" : void 0,
          "aria-label": t.pageN(p)
        },
        extra
      );
      return link ? /* @__PURE__ */ React51.createElement(
        Link,
        {
          href: link(p),
          onClick: function(e) {
            if (props.onChange) {
              e.preventDefault();
              go(p);
            }
          },
          ...common
        },
        label
      ) : /* @__PURE__ */ React51.createElement(
        "button",
        {
          type: "button",
          onClick: function() {
            go(p);
          },
          ...common
        },
        label
      );
    }
    function arrow(p, icon, label, rel, disabled) {
      if (!link || disabled)
        return /* @__PURE__ */ React51.createElement(
          IconButton,
          {
            icon,
            label,
            disabled,
            onClick: function() {
              go(p);
            }
          }
        );
      return /* @__PURE__ */ React51.createElement(
        Link,
        {
          href: link(p),
          rel,
          className: "aura-icon-btn",
          "aria-label": label,
          title: label,
          onClick: function(e) {
            if (props.onChange) {
              e.preventDefault();
              go(p);
            }
          }
        },
        /* @__PURE__ */ React51.createElement(Icon, { name: icon, size: "sm" })
      );
    }
    return /* @__PURE__ */ React51.createElement("nav", { ref, className: cx("aura-pagination", props.className), "aria-label": props.label || t.pagination }, arrow(page - 1, "chevron-left", t.prevPage, "prev", page <= 1), /* @__PURE__ */ React51.createElement("ol", { className: "aura-pagination__list" }, pageList(page, count, props.siblingCount == null ? 1 : props.siblingCount).map(function(p) {
      return typeof p === "number" ? /* @__PURE__ */ React51.createElement("li", { key: p }, item(p, p)) : /* @__PURE__ */ React51.createElement("li", { key: p, className: "aura-pagination__gap", "aria-hidden": true }, "\u2026");
    })), /* @__PURE__ */ React51.createElement("span", { className: "aura-pagination__compact", "aria-hidden": true }, t.page(page, count)), arrow(page + 1, "chevron-right", t.nextPage, "next", page >= count));
  });

  // src/Accordion.tsx
  var React52 = __toESM(require_react(), 1);
  var Accordion = React52.forwardRef(function Accordion2(props, ref) {
    const auto = uid(), base = props.id || auto;
    const multiple = props.type === "multiple";
    const st = useMaybeControlled(
      props.value,
      props.defaultValue != null ? props.defaultValue : multiple ? [] : null,
      props.onChange
    );
    const open = multiple ? st[0] || [] : st[0] ? [st[0]] : [];
    const HT = "h" + (props.headingLevel || 3);
    const items2 = props.items || [];
    function toggle(id) {
      const isOpen = open.indexOf(id) >= 0;
      if (multiple)
        st[1](
          isOpen ? open.filter(function(x) {
            return x !== id;
          }) : open.concat([id])
        );
      else st[1](isOpen ? props.collapsible === false ? id : null : id);
    }
    function onKey(e) {
      const btns = Array.prototype.slice.call(
        e.currentTarget.querySelectorAll(
          ":scope > .aura-accordion__item > .aura-accordion__heading > button:not([disabled])"
        )
      );
      let i = btns.indexOf(document.activeElement), k = e.key, n2 = null;
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
    return /* @__PURE__ */ React52.createElement("div", { ref, className: cx("aura-accordion", props.className), onKeyDown: onKey }, items2.map(function(it) {
      const on = open.indexOf(it.id) >= 0, bid = base + "-btn-" + it.id, pid = base + "-panel-" + it.id;
      return /* @__PURE__ */ React52.createElement("div", { key: it.id, className: cx("aura-accordion__item", on && "is-open") }, /* @__PURE__ */ React52.createElement(HT, { className: "aura-accordion__heading" }, /* @__PURE__ */ React52.createElement(
        "button",
        {
          type: "button",
          id: bid,
          "aria-expanded": on,
          "aria-controls": pid,
          disabled: it.disabled,
          onClick: function() {
            toggle(it.id);
          }
        },
        it.icon ? /* @__PURE__ */ React52.createElement(Icon, { name: it.icon, className: "aura-accordion__lead" }) : null,
        /* @__PURE__ */ React52.createElement("span", { className: "aura-accordion__title" }, it.title, it.description ? /* @__PURE__ */ React52.createElement("span", { className: "aura-accordion__desc" }, it.description) : null),
        /* @__PURE__ */ React52.createElement(Icon, { name: "chevron-down", className: "aura-accordion__chevron" })
      )), /* @__PURE__ */ React52.createElement("div", { id: pid, role: "region", "aria-labelledby": bid, className: "aura-accordion__panel", hidden: !on }, it.content));
    }));
  });

  // src/Popover.tsx
  var React53 = __toESM(require_react(), 1);
  var import_react_dom11 = __toESM(require_react_dom(), 1);
  function position(anchor, pop, placement) {
    const r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 6;
    let side = (placement || "bottom-start").split("-")[0], align = (placement || "bottom-start").split("-")[1] || "start";
    if (side === "bottom" && r.bottom + gap + ph > vh - 8 && r.top - gap - ph > 8) side = "top";
    else if (side === "top" && r.top - gap - ph < 8 && r.bottom + gap + ph < vh - 8) side = "bottom";
    const top = side === "top" ? r.top - gap - ph : r.bottom + gap;
    const left = align === "end" ? r.right - pw : align === "center" ? r.left + r.width / 2 - pw / 2 : r.left;
    return { top: Math.max(8, top), left: Math.max(8, Math.min(left, vw - pw - 8)), side };
  }
  var Popover = React53.forwardRef(function Popover2(props, ref) {
    const t = useStrings();
    const density = useDensity();
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(props.open, !!props.defaultOpen, props.onOpenChange);
    const open = !!st[0];
    const wrap = React53.useRef(null), pop = React53.useRef(null), popMerged = useMergedRef(ref, pop);
    const pos = React53.useState(null), mounted = useMounted();
    function trigger() {
      return wrap.current && (wrap.current.querySelector('button, [role="button"], a, input') || wrap.current.firstElementChild);
    }
    function close(restore) {
      st[1](false);
      if (restore) {
        const tr = trigger();
        if (tr && tr.focus) tr.focus();
      }
    }
    useIsoLayoutEffect(
      function() {
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
      },
      [open, mounted, props.placement]
    );
    React53.useEffect(
      function() {
        if (!open || !mounted) return;
        if (props.autoFocus !== false && pop.current) {
          const f = pop.current.querySelector("[data-autofocus]") || pop.current.querySelector(FOCUSABLE);
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
      },
      [open, mounted]
    );
    const child = React53.Children.only(props.trigger);
    const panel = open && mounted ? (0, import_react_dom11.createPortal)(
      /* @__PURE__ */ React53.createElement(
        "div",
        {
          ref: popMerged,
          id,
          "data-density": density,
          role: "dialog",
          "aria-modal": false,
          "aria-label": props.title ? void 0 : props.label,
          "aria-labelledby": props.title ? id + "-title" : void 0,
          tabIndex: -1,
          className: cx("aura-popover", pos[0] && "is-" + pos[0].side, props.className),
          style: Object.assign(
            { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 },
            props.width ? { width: props.width } : null
          ),
          onKeyDown: function(e) {
            if (e.key === "Escape") {
              e.stopPropagation();
              close(true);
            } else trapTab(e, pop.current);
          }
        },
        props.title ? /* @__PURE__ */ React53.createElement("div", { className: "aura-popover__head" }, /* @__PURE__ */ React53.createElement("p", { className: "aura-popover__title", id: id + "-title" }, props.title), /* @__PURE__ */ React53.createElement(
          IconButton,
          {
            icon: "x",
            label: t.close,
            onClick: function() {
              close(true);
            }
          }
        )) : null,
        /* @__PURE__ */ React53.createElement("div", { className: "aura-popover__body" }, typeof props.children === "function" ? props.children({
          close: function() {
            close(true);
          }
        }) : props.children)
      ),
      document.body
    ) : null;
    return /* @__PURE__ */ React53.createElement("span", { ref: wrap, className: "aura-popover-anchor" }, React53.cloneElement(child, {
      onClick: function(e) {
        if (child.props.onClick) child.props.onClick(e);
        st[1](!open);
      },
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "aria-controls": open ? id : void 0
    }), panel);
  });

  // src/NumberField.tsx
  var React54 = __toESM(require_react(), 1);
  function decimalsOf(n2) {
    const s = String(n2);
    const i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  }
  function parse(text) {
    const s = text.replace(/[,\s ]/g, "");
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return Number(s);
  }
  var NumberField = React54.forwardRef(function NumberField2(props, ref) {
    const t = useStrings();
    const auto = uid(), id = props.id || auto;
    const step = props.step || 1;
    const decimals = props.decimals != null ? props.decimals : decimalsOf(step);
    const st = useMaybeControlled(
      props.value,
      props.defaultValue == null ? null : props.defaultValue,
      props.onChange
    );
    const value = st[0], setValue = st[1];
    const draftState = React54.useState(null), draft = draftState[0], setDraft = draftState[1];
    function fmt2(n2) {
      if (n2 == null || isNaN(n2)) return "";
      return n2.toLocaleString("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    function fit2(n2) {
      let v = n2;
      if (props.min != null && v < props.min) v = props.min;
      if (props.max != null && v > props.max) v = props.max;
      const f = Math.pow(10, decimals);
      return Math.round(v * f) / f;
    }
    function nudge(by) {
      if (props.disabled || props.readOnly) return;
      const base = value == null ? props.min != null && props.min > 0 ? props.min - by : 0 : value;
      const next = fit2(base + by);
      setValue(next);
      setDraft(null);
    }
    function onKeyDown(e) {
      const k = e.key;
      let by = 0;
      if (k === "ArrowUp") by = step;
      else if (k === "ArrowDown") by = -step;
      else if (k === "PageUp") by = step * 10;
      else if (k === "PageDown") by = -step * 10;
      else if (k === "Home" && props.min != null) {
        e.preventDefault();
        setValue(props.min);
        setDraft(null);
        return;
      } else if (k === "End" && props.max != null) {
        e.preventDefault();
        setValue(props.max);
        setDraft(null);
        return;
      }
      if (by) {
        e.preventDefault();
        nudge(by);
      }
    }
    const atMin = value != null && props.min != null && value <= props.min;
    const atMax = value != null && props.max != null && value >= props.max;
    const affixText = function(x) {
      return typeof x === "string" || typeof x === "number" ? String(x) : "";
    };
    const valueText = value == null ? void 0 : [affixText(props.prefix), fmt2(value), affixText(props.suffix)].join(" ").trim();
    const stepper = props.stepper !== false && !props.readOnly;
    return /* @__PURE__ */ React54.createElement(
      Field,
      {
        id,
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      /* @__PURE__ */ React54.createElement("div", { className: cx("aura-input aura-number", stepper && "has-stepper") }, props.prefix != null ? /* @__PURE__ */ React54.createElement("span", { className: "aura-number__affix", "aria-hidden": true }, props.prefix) : null, /* @__PURE__ */ React54.createElement(
        "input",
        {
          ref,
          id,
          type: "text",
          role: "spinbutton",
          inputMode: decimals > 0 || props.min != null && props.min < 0 ? "decimal" : "numeric",
          autoComplete: "off",
          className: "aura-input__control",
          name: props.name,
          placeholder: props.placeholder,
          disabled: props.disabled,
          readOnly: props.readOnly,
          required: props.required,
          "aria-valuenow": value == null ? void 0 : value,
          "aria-valuemin": props.min,
          "aria-valuemax": props.max,
          "aria-valuetext": valueText,
          "aria-invalid": props.error ? true : void 0,
          "aria-describedby": describedBy(id, props),
          value: draft != null ? draft : fmt2(value),
          onFocus: function() {
            setDraft(fmt2(value));
          },
          onChange: function(e) {
            const text = e.target.value;
            setDraft(text);
            if (!text.trim()) setValue(null);
            else {
              const n2 = parse(text);
              if (!isNaN(n2)) setValue(n2);
            }
          },
          onBlur: function(e) {
            const n2 = draft == null ? value : !draft.trim() ? null : parse(draft);
            if (n2 == null) {
              if (value != null) setValue(null);
            } else if (!isNaN(n2)) {
              const f = fit2(n2);
              if (f !== value) setValue(f);
            }
            setDraft(null);
            if (props.onBlur) props.onBlur(e);
          },
          onKeyDown
        }
      ), props.suffix != null ? /* @__PURE__ */ React54.createElement("span", { className: "aura-number__affix", "aria-hidden": true }, props.suffix) : null, stepper ? /* @__PURE__ */ React54.createElement("span", { className: "aura-number__steps" }, /* @__PURE__ */ React54.createElement(
        "button",
        {
          type: "button",
          tabIndex: -1,
          className: "aura-number__step",
          "aria-label": t.decrease,
          "aria-controls": id,
          disabled: props.disabled || atMin,
          onPointerDown: function(e) {
            e.preventDefault();
          },
          onClick: function() {
            nudge(-step);
          }
        },
        /* @__PURE__ */ React54.createElement(Icon, { name: "minus" })
      ), /* @__PURE__ */ React54.createElement(
        "button",
        {
          type: "button",
          tabIndex: -1,
          className: "aura-number__step",
          "aria-label": t.increase,
          "aria-controls": id,
          disabled: props.disabled || atMax,
          onPointerDown: function(e) {
            e.preventDefault();
          },
          onClick: function() {
            nudge(step);
          }
        },
        /* @__PURE__ */ React54.createElement(Icon, { name: "plus" })
      )) : null)
    );
  });

  // src/Stepper.tsx
  var React55 = __toESM(require_react(), 1);
  var Stepper = React55.forwardRef(function Stepper2(props, ref) {
    const t = useStrings();
    const steps = props.steps || [];
    let at = -1;
    steps.forEach(function(s, i) {
      if (s.id === props.current) at = i;
    });
    if (at < 0) at = 0;
    const vertical = props.orientation === "vertical";
    const cur = steps[at];
    return /* @__PURE__ */ React55.createElement(
      "nav",
      {
        ref,
        "aria-label": props.label,
        className: cx("aura-stepper", vertical ? "aura-stepper--vertical" : "aura-stepper--horizontal", props.className)
      },
      /* @__PURE__ */ React55.createElement("ol", { className: "aura-stepper__list" }, steps.map(function(s, i) {
        const state = i < at ? "done" : i === at ? "current" : "upcoming";
        const marker = /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__marker", "aria-hidden": true }, state === "done" ? /* @__PURE__ */ React55.createElement(Icon, { name: "check" }) : i + 1);
        const text = /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__text" }, /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__label" }, s.label, state === "done" ? /* @__PURE__ */ React55.createElement("span", { className: "aura-sr-only" }, ", " + t.stepDone) : null), s.description ? /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__desc" }, s.description) : null);
        const clickable = state === "done" && !!props.onStepClick;
        return /* @__PURE__ */ React55.createElement(
          "li",
          {
            key: s.id,
            className: cx("aura-stepper__item", "is-" + state),
            "aria-current": state === "current" ? "step" : void 0
          },
          clickable ? /* @__PURE__ */ React55.createElement(
            "button",
            {
              type: "button",
              className: "aura-stepper__step aura-focusable",
              onClick: function() {
                props.onStepClick(s.id);
              }
            },
            marker,
            text
          ) : /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__step" }, marker, text)
        );
      })),
      !vertical && cur ? /* @__PURE__ */ React55.createElement("p", { className: "aura-stepper__compact", "aria-hidden": true }, /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__count" }, t.stepOf(at + 1, steps.length)), /* @__PURE__ */ React55.createElement("span", { className: "aura-stepper__compact-label" }, cur.label)) : null
    );
  });

  // src/SegmentedControl.tsx
  var React56 = __toESM(require_react(), 1);
  function toOpt2(o) {
    return typeof o === "object" ? o : { value: o, label: o };
  }
  var SegmentedControl = React56.forwardRef(
    function SegmentedControl2(props, ref) {
      const options = (props.options || []).map(toOpt2);
      const firstEnabled = options.filter(function(o) {
        return !o.disabled;
      })[0];
      const st = useMaybeControlled(
        props.value,
        props.defaultValue != null ? props.defaultValue : firstEnabled ? firstEnabled.value : void 0,
        props.onChange
      );
      const value = st[0], setValue = st[1];
      const auto = uid(), id = props.id || auto;
      const refs = React56.useRef([]);
      const selIdx = options.findIndex(function(o) {
        return o.value === value;
      });
      const tabIdx = selIdx >= 0 && !options[selIdx].disabled ? selIdx : options.indexOf(firstEnabled);
      function move(from, dir) {
        const n2 = options.length;
        for (let k = 1; k <= n2; k++) {
          const i = ((from + dir * k) % n2 + n2) % n2;
          if (!options[i].disabled) {
            setValue(options[i].value);
            const el = refs.current[i];
            if (el) el.focus();
            return;
          }
        }
      }
      function onKeyDown(e, i) {
        const k = e.key;
        if (k === "ArrowRight" || k === "ArrowDown") {
          e.preventDefault();
          move(i, 1);
        } else if (k === "ArrowLeft" || k === "ArrowUp") {
          e.preventDefault();
          move(i, -1);
        } else if (k === "Home") {
          e.preventDefault();
          move(-1, 1);
        } else if (k === "End") {
          e.preventDefault();
          move(options.length, -1);
        }
      }
      return /* @__PURE__ */ React56.createElement(
        "div",
        {
          ref,
          id,
          role: "radiogroup",
          "aria-label": props.label,
          "aria-disabled": props.disabled || void 0,
          className: cx(
            "aura-segmented",
            props.size === "sm" && "aura-segmented--sm",
            props.fullWidth && "is-full",
            props.disabled && "is-disabled",
            props.className
          )
        },
        options.map(function(o, i) {
          const on = o.value === value;
          const off = props.disabled || o.disabled;
          return /* @__PURE__ */ React56.createElement(
            "button",
            {
              key: o.value,
              ref: function(el) {
                refs.current[i] = el;
              },
              type: "button",
              role: "radio",
              "aria-checked": on,
              "aria-label": o.iconOnly ? o.label : void 0,
              title: o.iconOnly ? o.label : void 0,
              tabIndex: i === tabIdx && !props.disabled ? 0 : -1,
              disabled: off,
              className: cx("aura-segmented__option", on && "is-selected", o.iconOnly && "is-icon"),
              onClick: function() {
                setValue(o.value);
              },
              onKeyDown: function(e) {
                onKeyDown(e, i);
              }
            },
            o.icon ? /* @__PURE__ */ React56.createElement(Icon, { name: o.icon }) : null,
            o.iconOnly ? null : /* @__PURE__ */ React56.createElement("span", null, o.label)
          );
        })
      );
    }
  );
  return __toCommonJS(index_exports);
})();
