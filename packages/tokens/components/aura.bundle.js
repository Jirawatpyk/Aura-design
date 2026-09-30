/* @ds-bundle: {"format":4,"namespace":"Aura","components":[{"name":"Icon"},{"name":"Button"},{"name":"IconButton"},{"name":"Menu"},{"name":"DropdownMenu"},{"name":"Checkbox"},{"name":"StatusPill"},{"name":"TextField"},{"name":"Textarea"},{"name":"Select"},{"name":"FilterSelect"},{"name":"RadioGroup"},{"name":"Switch"},{"name":"Combobox"},{"name":"DatePicker"},{"name":"DateRangePicker"},{"name":"Calendar"},{"name":"Alert"},{"name":"Toaster"},{"name":"PasswordField"},{"name":"FormErrorSummary"},{"name":"FilterBar"},{"name":"Command"},{"name":"Tooltip"},{"name":"Dialog"},{"name":"Drawer"},{"name":"DataTable"},{"name":"Card"},{"name":"Tabs"},{"name":"SideNav"},{"name":"Breadcrumb"},{"name":"Avatar"},{"name":"Stack"},{"name":"Grid"},{"name":"Container"},{"name":"AppShell"},{"name":"ActionBar"},{"name":"Separator"},{"name":"Table"},{"name":"Tr"},{"name":"Th"},{"name":"Td"},{"name":"BottomNav"},{"name":"Surface"},{"name":"Stat"},{"name":"TimePicker"},{"name":"FileUpload"},{"name":"ColorSchemeScript"},{"name":"ColorSchemeToggle"},{"name":"Badge"},{"name":"Tag"},{"name":"Progress"},{"name":"Skeleton"},{"name":"EmptyState"},{"name":"Pagination"},{"name":"Accordion"},{"name":"Popover"},{"name":"NumberField"},{"name":"Stepper"},{"name":"SegmentedControl"}]} */
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
    DataTable: () => DataTable2,
    DatePicker: () => DatePicker,
    DateRangePicker: () => DateRangePicker,
    Dialog: () => Dialog,
    Drawer: () => Drawer,
    DropdownMenu: () => DropdownMenu,
    EmptyState: () => EmptyState,
    Field: () => Field,
    FileUpload: () => FileUpload,
    FilterBar: () => FilterBar,
    FilterSelect: () => FilterSelect,
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
    Separator: () => Separator,
    SideNav: () => SideNav,
    Skeleton: () => Skeleton,
    Stack: () => Stack,
    Stat: () => Stat,
    StatusPill: () => StatusPill,
    Stepper: () => Stepper,
    Surface: () => Surface,
    Switch: () => Switch,
    TBody: () => TBody,
    TFoot: () => TFoot,
    THead: () => THead,
    Table: () => Table,
    Tabs: () => Tabs,
    Tag: () => Tag,
    Td: () => Td,
    TextField: () => TextField,
    Textarea: () => Textarea,
    Th: () => Th,
    ThemeStyle: () => ThemeStyle,
    TimePicker: () => TimePicker,
    Toaster: () => Toaster,
    Tooltip: () => Tooltip,
    Tr: () => Tr,
    brandScale: () => scale,
    breakpoints: () => breakpoints,
    buttonClass: () => buttonClass,
    colorSchemeScript: () => colorSchemeScript,
    comboboxFilter: () => defaultFilter,
    contrast: () => contrast,
    createTheme: () => createTheme,
    formatBytes: () => formatBytes,
    formatDate: () => formatDate,
    iconNames: () => iconNames,
    parseDate: () => parseDate,
    parseTime: () => parseTime,
    registerIcons: () => registerIcons,
    statusTone: () => toneFor,
    toast: () => toast,
    todayIn: () => todayIn,
    useAuraLocale: () => useAuraLocale,
    useBreakpoint: () => useBreakpoint,
    useColorScheme: () => useColorScheme,
    useDensity: () => useDensity,
    useDialogClose: () => useDialogClose,
    useFormatDate: () => useFormatDate,
    useResponsive: () => useResponsive
  });

  // src/Icon.tsx
  var React2 = __toESM(require_react(), 1);

  // src/classes.ts
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
  var TONES = ["neutral", "accent", "success", "warning", "danger"];
  function tone(t) {
    return TONES.indexOf(t) >= 0 ? t : "neutral";
  }
  var warned = {};
  function devWarnOnce(key, message) {
    if (warned[key]) return;
    let dev = false;
    try {
      dev = true;
    } catch (e) {
      dev = false;
    }
    if (!dev) return;
    warned[key] = true;
    console.warn("[AURA] " + message);
  }

  // src/iconSvg.tsx
  var React = __toESM(require_react(), 1);
  var h = React.createElement;
  var SIZES = { sm: 16, md: 20, lg: 24 };
  function iconSize(size) {
    return SIZES[size] || size || 16;
  }
  function iconSvg(shapes, props, ref) {
    const size = iconSize(props.size);
    const a11y = props.label ? { role: "img", "aria-label": props.label } : { "aria-hidden": true, focusable: "false" };
    return /* @__PURE__ */ React.createElement(
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
  }
  function defineIcon(name, shapes) {
    const C = React.forwardRef(function AuraIcon(props, ref) {
      return iconSvg(shapes, props, ref);
    });
    C.displayName = "Icon" + name.split("-").map(function(p) {
      return p.charAt(0).toUpperCase() + p.slice(1);
    }).join("");
    return Object.assign(C, { auraShapes: shapes, iconName: name });
  }
  function shapesOf(el) {
    if (!React.isValidElement(el)) return null;
    const t = el.type;
    return typeof t !== "string" && t && t.auraShapes || null;
  }

  // src/Icon.tsx
  var map = { "check": [["path", { "d": "M20 6 9 17l-5-5" }]], "x": [["path", { "d": "M18 6 6 18" }], ["path", { "d": "m6 6 12 12" }]], "plus": [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]], "minus": [["path", { "d": "M5 12h14" }]], "search": [["path", { "d": "m21 21-4.34-4.34" }], ["circle", { "cx": "11", "cy": "11", "r": "8" }]], "chevron-down": [["path", { "d": "m6 9 6 6 6-6" }]], "chevron-up": [["path", { "d": "m18 15-6-6-6 6" }]], "chevron-left": [["path", { "d": "m15 18-6-6 6-6" }]], "chevron-right": [["path", { "d": "m9 18 6-6-6-6" }]], "arrow-right": [["path", { "d": "M5 12h14" }], ["path", { "d": "m12 5 7 7-7 7" }]], "arrow-up-right": [["path", { "d": "M7 7h10v10" }], ["path", { "d": "M7 17 17 7" }]], "arrow-up-down": [["path", { "d": "m21 16-4 4-4-4" }], ["path", { "d": "M17 20V4" }], ["path", { "d": "m3 8 4-4 4 4" }], ["path", { "d": "M7 4v16" }]], "loader-circle": [["path", { "d": "M21 12a9 9 0 1 1-6.219-8.56" }]], "circle-alert": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["line", { "x1": "12", "x2": "12", "y1": "8", "y2": "12" }], ["line", { "x1": "12", "x2": "12.01", "y1": "16", "y2": "16" }]], "circle-check": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "m16 9-5.5 5.5L8 12" }]], "info": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 16v-4" }], ["path", { "d": "M12 8h.01" }]], "triangle-alert": [["path", { "d": "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }], ["path", { "d": "M12 9v4" }], ["path", { "d": "M12 17h.01" }]], "settings": [["path", { "d": "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]], "user": [["path", { "d": "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }], ["circle", { "cx": "12", "cy": "7", "r": "4" }]], "users": [["path", { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["path", { "d": "M16 3.128a4 4 0 0 1 0 7.744" }], ["path", { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }], ["circle", { "cx": "9", "cy": "7", "r": "4" }]], "filter": [["path", { "d": "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z" }]], "ellipsis": [["circle", { "cx": "12", "cy": "12", "r": "1" }], ["circle", { "cx": "19", "cy": "12", "r": "1" }], ["circle", { "cx": "5", "cy": "12", "r": "1" }]], "external-link": [["path", { "d": "M15 3h6v6" }], ["path", { "d": "M10 14 21 3" }], ["path", { "d": "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]], "copy": [["rect", { "width": "14", "height": "14", "x": "8", "y": "8", "rx": "2", "ry": "2" }], ["path", { "d": "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]], "trash-2": [["path", { "d": "M10 11v6" }], ["path", { "d": "M14 11v6" }], ["path", { "d": "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" }], ["path", { "d": "M3 6h18" }], ["path", { "d": "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" }]], "pencil": [["path", { "d": "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" }], ["path", { "d": "m15 5 4 4" }]], "download": [["path", { "d": "M12 15V3" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }], ["path", { "d": "m7 10 5 5 5-5" }]], "upload": [["path", { "d": "M12 3v12" }], ["path", { "d": "m17 8-5-5-5 5" }], ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]], "calendar": [["path", { "d": "M8 2v3" }], ["path", { "d": "M16 2v3" }], ["rect", { "x": "3", "y": "3", "width": "18", "height": "18", "rx": "2" }], ["path", { "d": "M3 9h18" }]], "bell": [["path", { "d": "M10.268 21a2 2 0 0 0 3.464 0" }], ["path", { "d": "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" }]], "menu": [["path", { "d": "M4 5h16" }], ["path", { "d": "M4 12h16" }], ["path", { "d": "M4 19h16" }]], "eye": [["path", { "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }], ["circle", { "cx": "12", "cy": "12", "r": "3" }]], "log-out": [["path", { "d": "m16 17 5-5-5-5" }], ["path", { "d": "M21 12H9" }], ["path", { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]], "circle": [["circle", { "cx": "12", "cy": "12", "r": "10" }]], "circle-dot-dashed": [["path", { "d": "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }], ["path", { "d": "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }], ["path", { "d": "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }], ["path", { "d": "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }], ["path", { "d": "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }], ["path", { "d": "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }], ["path", { "d": "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }], ["path", { "d": "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }], ["circle", { "cx": "12", "cy": "12", "r": "1" }]], "ban": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M4.929 4.929 19.07 19.071" }]], "arrow-up": [["path", { "d": "m5 12 7-7 7 7" }], ["path", { "d": "M12 19V5" }]], "arrow-down": [["path", { "d": "M12 5v14" }], ["path", { "d": "m19 12-7 7-7-7" }]], "inbox": [["polyline", { "points": "22 12 16 12 14 15 10 15 8 12 2 12" }], ["path", { "d": "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }]], "pin": [["path", { "d": "M12 17v5" }], ["path", { "d": "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" }]], "pin-off": [["path", { "d": "M12 17v5" }], ["path", { "d": "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }], ["path", { "d": "m2 2 20 20" }], ["path", { "d": "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" }]], "eye-off": [["path", { "d": "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }], ["path", { "d": "M14.084 14.158a3 3 0 0 1-4.242-4.242" }], ["path", { "d": "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }], ["path", { "d": "m2 2 20 20" }]], "columns-3": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "M15 3v18" }]], "arrow-left": [["path", { "d": "m12 19-7-7 7-7" }], ["path", { "d": "M19 12H5" }]], "rotate-ccw": [["path", { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }], ["path", { "d": "M3 3v5h5" }]], "house": [["path", { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }], ["path", { "d": "M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }]], "layout-dashboard": [["rect", { "width": "7", "height": "9", "x": "3", "y": "3", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "14", "y": "3", "rx": "1" }], ["rect", { "width": "7", "height": "9", "x": "14", "y": "12", "rx": "1" }], ["rect", { "width": "7", "height": "5", "x": "3", "y": "16", "rx": "1" }]], "folder": [["path", { "d": "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" }]], "chart-column": [["path", { "d": "M3 3v16a2 2 0 0 0 2 2h16" }], ["path", { "d": "M18 17V9" }], ["path", { "d": "M13 17V5" }], ["path", { "d": "M8 17v-3" }]], "file-text": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }], ["path", { "d": "M10 9H8" }], ["path", { "d": "M16 13H8" }], ["path", { "d": "M16 17H8" }]], "mail": [["path", { "d": "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }], ["rect", { "x": "2", "y": "4", "width": "20", "height": "16", "rx": "2" }]], "lock": [["rect", { "width": "18", "height": "11", "x": "3", "y": "11", "rx": "2", "ry": "2" }], ["path", { "d": "M7 11V7a5 5 0 0 1 10 0v4" }]], "clock": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 6v6l4 2" }]], "trending-up": [["path", { "d": "M16 7h6v6" }], ["path", { "d": "m22 7-8.5 8.5-5-5L2 17" }]], "trending-down": [["path", { "d": "M16 17h6v-6" }], ["path", { "d": "m22 17-8.5-8.5-5 5L2 7" }]], "image": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2", "ry": "2" }], ["circle", { "cx": "9", "cy": "9", "r": "2" }], ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]], "paperclip": [["path", { "d": "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" }]], "cloud-upload": [["path", { "d": "M12 13v8" }], ["path", { "d": "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }], ["path", { "d": "m8 17 4-4 4 4" }]], "file": [["path", { "d": "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z" }], ["path", { "d": "M14 2v5a1 1 0 0 0 1 1h5" }]], "sun": [["circle", { "cx": "12", "cy": "12", "r": "4" }], ["path", { "d": "M12 2v2" }], ["path", { "d": "M12 20v2" }], ["path", { "d": "m4.93 4.93 1.41 1.41" }], ["path", { "d": "m17.66 17.66 1.41 1.41" }], ["path", { "d": "M2 12h2" }], ["path", { "d": "M20 12h2" }], ["path", { "d": "m6.34 17.66-1.41 1.41" }], ["path", { "d": "m19.07 4.93-1.41 1.41" }]], "moon": [["path", { "d": "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" }]], "monitor": [["rect", { "width": "20", "height": "14", "x": "2", "y": "3", "rx": "2" }], ["line", { "x1": "8", "x2": "16", "y1": "21", "y2": "21" }], ["line", { "x1": "12", "x2": "12", "y1": "17", "y2": "21" }]], "panel-left-close": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "m16 15-3-3 3-3" }]], "panel-left-open": [["rect", { "width": "18", "height": "18", "x": "3", "y": "3", "rx": "2" }], ["path", { "d": "M9 3v18" }], ["path", { "d": "m14 9 3 3-3 3" }]], "server": [["rect", { "width": "20", "height": "8", "x": "2", "y": "2", "rx": "2", "ry": "2" }], ["rect", { "width": "20", "height": "8", "x": "2", "y": "14", "rx": "2", "ry": "2" }], ["line", { "x1": "6", "x2": "6.01", "y1": "6", "y2": "6" }], ["line", { "x1": "6", "x2": "6.01", "y1": "18", "y2": "18" }]], "globe": [["circle", { "cx": "12", "cy": "12", "r": "10" }], ["path", { "d": "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }], ["path", { "d": "M2 12h20" }]], "activity": [["path", { "d": "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2" }]], "shield-alert": [["path", { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }], ["path", { "d": "M12 8v4" }], ["path", { "d": "M12 16h.01" }]], "phone": [["path", { "d": "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" }]], "wrench": [["path", { "d": "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" }]] };
  var ICONS = map;
  var registered = {};
  function registerIcons(icons) {
    for (let i = 0; i < icons.length; i++) {
      const c = icons[i];
      if (c && c.auraShapes) {
        map[c.iconName] = c.auraShapes;
        registered[c.iconName] = true;
      }
    }
  }
  var Icon = React2.forwardRef(function Icon2(props, ref) {
    const own = shapesOf(props.name);
    if (own) {
      const ep = props.name.props;
      return iconSvg(
        own,
        {
          size: props.size || ep.size,
          label: props.label || ep.label,
          strokeWidth: props.strokeWidth || ep.strokeWidth,
          className: cx(ep.className, props.className) || void 0
        },
        ref
      );
    }
    const drawn = props.name;
    if (React2.isValidElement(drawn) && drawn.type === "svg" && /(^| )aura-icon( |$)/.test(String(drawn.props.className || "")) && !/aura-icon--custom/.test(String(drawn.props.className || ""))) {
      const dp = drawn.props;
      const o = { ref };
      if (props.size) o.width = o.height = iconSize(props.size);
      if (props.strokeWidth) o.strokeWidth = props.strokeWidth;
      if (props.className) o.className = cx(String(dp.className), props.className);
      if (props.label)
        Object.assign(o, { role: "img", "aria-label": props.label, "aria-hidden": void 0, focusable: void 0 });
      return React2.cloneElement(drawn, o);
    }
    if (React2.isValidElement(props.name)) {
      const size = iconSize(props.size);
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
    if (typeof props.name === "string" && !registered[props.name])
      devWarnOnce(
        "icon-names",
        'Icon names as strings (icon="' + props.name + '") need registerIcons() from 6.0. Import icons from "@jirawatpyk/aura-react/icons" (npx aura-icons-codemod), or call registerIcons(allIcons) once.'
      );
    const shapes = map[props.name];
    if (!shapes) return null;
    return iconSvg(shapes, props, ref);
  });
  var iconNames = Object.keys(map);

  // src/Button.tsx
  var React6 = __toESM(require_react(), 1);

  // src/internal.tsx
  var React3 = __toESM(require_react(), 1);
  function useMaybeControlled(value, initial, onChange) {
    const s = React3.useState(initial);
    const wasSet = React3.useState(value !== void 0);
    if (value !== void 0 && !wasSet[0]) wasSet[1](true);
    else if (value === void 0 && wasSet[0]) {
      wasSet[1](false);
      s[1](initial);
    }
    const controlled = value !== void 0;
    const latest = React3.useRef({ controlled, onChange, set: s[1] });
    latest.current = { controlled, onChange, set: s[1] };
    const set = React3.useCallback(function(next) {
      const l = latest.current;
      if (!l.controlled) l.set(next);
      if (l.onChange) l.onChange(next);
    }, []);
    return [controlled ? value : s[0], set];
  }
  var collator = typeof Intl !== "undefined" ? new Intl.Collator(["th", "en"], { numeric: true, sensitivity: "base" }) : null;
  function compare(a, b) {
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    return collator ? collator.compare(String(a), String(b)) : String(a).localeCompare(String(b));
  }
  var uid = React3.useId || function() {
    const r = React3.useRef(null);
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
    return React3.useSyncExternalStore(noopSubscribe, yes, no);
  }
  var useIsoLayoutEffect = typeof window !== "undefined" ? React3.useLayoutEffect : React3.useEffect;
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
    return React3.useCallback(
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
  function plainClick(e) {
    return !e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey;
  }

  // src/display.tsx
  var React4 = __toESM(require_react(), 1);

  // src/status.ts
  var TONE_WORDS = {
    ready: ["ready", "done", "complete", "completed", "approved", "live", "passed"],
    progress: ["in progress", "in review", "review", "syncing", "running", "pending"],
    warning: ["warning", "problem", "degraded", "at risk"],
    blocked: ["blocked", "failed", "error", "rejected", "on hold", "cancelled"]
  };
  function toneFor(status) {
    const s = String(status == null ? "" : status).trim().toLowerCase();
    for (const t in TONE_WORDS) if (TONE_WORDS[t].indexOf(s) >= 0) return t;
    return "neutral";
  }
  var TONE_ORDER = { neutral: 0, progress: 1, ready: 2, warning: 3, blocked: 4 };

  // src/icons.ts
  var IconCheck = /* @__PURE__ */ defineIcon("check", [["path", { d: "M20 6 9 17l-5-5" }]]);
  var IconX = /* @__PURE__ */ defineIcon("x", [
    ["path", { d: "M18 6 6 18" }],
    ["path", { d: "m6 6 12 12" }]
  ]);
  var IconPlus = /* @__PURE__ */ defineIcon("plus", [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "M12 5v14" }]
  ]);
  var IconMinus = /* @__PURE__ */ defineIcon("minus", [["path", { d: "M5 12h14" }]]);
  var IconSearch = /* @__PURE__ */ defineIcon("search", [
    ["path", { d: "m21 21-4.34-4.34" }],
    ["circle", { cx: "11", cy: "11", r: "8" }]
  ]);
  var IconChevronDown = /* @__PURE__ */ defineIcon("chevron-down", [["path", { d: "m6 9 6 6 6-6" }]]);
  var IconChevronLeft = /* @__PURE__ */ defineIcon("chevron-left", [["path", { d: "m15 18-6-6 6-6" }]]);
  var IconChevronRight = /* @__PURE__ */ defineIcon("chevron-right", [["path", { d: "m9 18 6-6-6-6" }]]);
  var IconArrowRight = /* @__PURE__ */ defineIcon("arrow-right", [
    ["path", { d: "M5 12h14" }],
    ["path", { d: "m12 5 7 7-7 7" }]
  ]);
  var IconArrowUpDown = /* @__PURE__ */ defineIcon("arrow-up-down", [
    ["path", { d: "m21 16-4 4-4-4" }],
    ["path", { d: "M17 20V4" }],
    ["path", { d: "m3 8 4-4 4 4" }],
    ["path", { d: "M7 4v16" }]
  ]);
  var IconLoaderCircle = /* @__PURE__ */ defineIcon("loader-circle", [
    ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]
  ]);
  var IconCircleAlert = /* @__PURE__ */ defineIcon("circle-alert", [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
    ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]
  ]);
  var IconCircleCheck = /* @__PURE__ */ defineIcon("circle-check", [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "m16 9-5.5 5.5L8 12" }]
  ]);
  var IconInfo = /* @__PURE__ */ defineIcon("info", [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 16v-4" }],
    ["path", { d: "M12 8h.01" }]
  ]);
  var IconTriangleAlert = /* @__PURE__ */ defineIcon("triangle-alert", [
    ["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
    ["path", { d: "M12 9v4" }],
    ["path", { d: "M12 17h.01" }]
  ]);
  var IconEllipsis = /* @__PURE__ */ defineIcon("ellipsis", [
    ["circle", { cx: "12", cy: "12", r: "1" }],
    ["circle", { cx: "19", cy: "12", r: "1" }],
    ["circle", { cx: "5", cy: "12", r: "1" }]
  ]);
  var IconCalendar = /* @__PURE__ */ defineIcon("calendar", [
    ["path", { d: "M8 2v3" }],
    ["path", { d: "M16 2v3" }],
    ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
    ["path", { d: "M3 9h18" }]
  ]);
  var IconMenu = /* @__PURE__ */ defineIcon("menu", [
    ["path", { d: "M4 5h16" }],
    ["path", { d: "M4 12h16" }],
    ["path", { d: "M4 19h16" }]
  ]);
  var IconEye = /* @__PURE__ */ defineIcon("eye", [
    [
      "path",
      { d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" }
    ],
    ["circle", { cx: "12", cy: "12", r: "3" }]
  ]);
  var IconCircle = /* @__PURE__ */ defineIcon("circle", [["circle", { cx: "12", cy: "12", r: "10" }]]);
  var IconCircleDotDashed = /* @__PURE__ */ defineIcon("circle-dot-dashed", [
    ["path", { d: "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }],
    ["path", { d: "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }],
    ["path", { d: "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }],
    ["path", { d: "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }],
    ["path", { d: "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }],
    ["path", { d: "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }],
    ["path", { d: "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }],
    ["path", { d: "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }],
    ["circle", { cx: "12", cy: "12", r: "1" }]
  ]);
  var IconBan = /* @__PURE__ */ defineIcon("ban", [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M4.929 4.929 19.07 19.071" }]
  ]);
  var IconArrowUp = /* @__PURE__ */ defineIcon("arrow-up", [
    ["path", { d: "m5 12 7-7 7 7" }],
    ["path", { d: "M12 19V5" }]
  ]);
  var IconArrowDown = /* @__PURE__ */ defineIcon("arrow-down", [
    ["path", { d: "M12 5v14" }],
    ["path", { d: "m19 12-7 7-7-7" }]
  ]);
  var IconInbox = /* @__PURE__ */ defineIcon("inbox", [
    ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }],
    [
      "path",
      { d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" }
    ]
  ]);
  var IconPin = /* @__PURE__ */ defineIcon("pin", [
    ["path", { d: "M12 17v5" }],
    [
      "path",
      {
        d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"
      }
    ]
  ]);
  var IconPinOff = /* @__PURE__ */ defineIcon("pin-off", [
    ["path", { d: "M12 17v5" }],
    ["path", { d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }],
    ["path", { d: "m2 2 20 20" }],
    ["path", { d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" }]
  ]);
  var IconEyeOff = /* @__PURE__ */ defineIcon("eye-off", [
    ["path", { d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" }],
    ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
    ["path", { d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" }],
    ["path", { d: "m2 2 20 20" }]
  ]);
  var IconColumns3 = /* @__PURE__ */ defineIcon("columns-3", [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "M15 3v18" }]
  ]);
  var IconArrowLeft = /* @__PURE__ */ defineIcon("arrow-left", [
    ["path", { d: "m12 19-7-7 7-7" }],
    ["path", { d: "M19 12H5" }]
  ]);
  var IconRotateCcw = /* @__PURE__ */ defineIcon("rotate-ccw", [
    ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
    ["path", { d: "M3 3v5h5" }]
  ]);
  var IconClock = /* @__PURE__ */ defineIcon("clock", [
    ["circle", { cx: "12", cy: "12", r: "10" }],
    ["path", { d: "M12 6v6l4 2" }]
  ]);
  var IconTrendingUp = /* @__PURE__ */ defineIcon("trending-up", [
    ["path", { d: "M16 7h6v6" }],
    ["path", { d: "m22 7-8.5 8.5-5-5L2 17" }]
  ]);
  var IconTrendingDown = /* @__PURE__ */ defineIcon("trending-down", [
    ["path", { d: "M16 17h6v-6" }],
    ["path", { d: "m22 17-8.5-8.5-5 5L2 7" }]
  ]);
  var IconImage = /* @__PURE__ */ defineIcon("image", [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
    ["circle", { cx: "9", cy: "9", r: "2" }],
    ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
  ]);
  var IconCloudUpload = /* @__PURE__ */ defineIcon("cloud-upload", [
    ["path", { d: "M12 13v8" }],
    ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
    ["path", { d: "m8 17 4-4 4 4" }]
  ]);
  var IconFile = /* @__PURE__ */ defineIcon("file", [
    [
      "path",
      {
        d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z"
      }
    ],
    ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5" }]
  ]);
  var IconSun = /* @__PURE__ */ defineIcon("sun", [
    ["circle", { cx: "12", cy: "12", r: "4" }],
    ["path", { d: "M12 2v2" }],
    ["path", { d: "M12 20v2" }],
    ["path", { d: "m4.93 4.93 1.41 1.41" }],
    ["path", { d: "m17.66 17.66 1.41 1.41" }],
    ["path", { d: "M2 12h2" }],
    ["path", { d: "M20 12h2" }],
    ["path", { d: "m6.34 17.66-1.41 1.41" }],
    ["path", { d: "m19.07 4.93-1.41 1.41" }]
  ]);
  var IconMoon = /* @__PURE__ */ defineIcon("moon", [
    [
      "path",
      {
        d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      }
    ]
  ]);
  var IconPanelLeftClose = /* @__PURE__ */ defineIcon("panel-left-close", [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m16 15-3-3 3-3" }]
  ]);
  var IconPanelLeftOpen = /* @__PURE__ */ defineIcon("panel-left-open", [
    ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
    ["path", { d: "M9 3v18" }],
    ["path", { d: "m14 9 3 3-3 3" }]
  ]);

  // src/display.tsx
  var h2 = React4.createElement;
  var ALERT_ICON = {
    info: IconInfo,
    success: IconCircleCheck,
    warning: IconTriangleAlert,
    danger: IconCircleAlert
  };
  function alertElement(props, ref, close) {
    const tone2 = props.tone || "info";
    const rest = omit(props, ["tone", "title", "children", "action", "onDismiss", "className", "role", "icon"]);
    return /* @__PURE__ */ React4.createElement(
      "div",
      {
        ...rest,
        ref,
        className: cx("aura-alert", "aura-alert--" + tone2, props.className),
        role: props.role || (tone2 === "danger" || tone2 === "warning" ? "alert" : "status")
      },
      /* @__PURE__ */ React4.createElement(Icon, { name: props.icon || h2(ALERT_ICON[tone2]), className: "aura-alert__icon" }),
      /* @__PURE__ */ React4.createElement("div", { className: "aura-alert__body" }, props.title ? /* @__PURE__ */ React4.createElement("p", { className: "aura-alert__title" }, props.title) : null, props.children ? /* @__PURE__ */ React4.createElement("div", { className: "aura-alert__text" }, props.children) : null, props.action ? /* @__PURE__ */ React4.createElement("div", { className: "aura-alert__action" }, props.action) : null),
      close
    );
  }
  function cardElement(props, ref) {
    const creative = props.variant === "creative";
    const rest = omit(props, [
      "title",
      "description",
      "actions",
      "footer",
      "children",
      "variant",
      "headingLevel",
      "interactive",
      "as",
      "className",
      "titleId",
      "header",
      "flushBelow"
    ]);
    const head = props.header !== void 0 && props.header !== null && props.header !== false;
    return h2(
      props.as || "section",
      Object.assign({}, rest, {
        ref,
        className: cx(
          "aura-card",
          creative && "aura-card--creative",
          props.interactive && "is-interactive",
          props.flushBelow && "aura-card--flush-below-" + props.flushBelow,
          props.className
        ),
        /* A titled card is labelled by its title; otherwise the caller's aria-labelledby stays (5.8). */
        "aria-labelledby": !head && props.title && props.titleId ? props.titleId : props["aria-labelledby"]
      }),
      head || props.title || props.actions ? /* @__PURE__ */ React4.createElement("div", { className: "aura-card__head" }, /* @__PURE__ */ React4.createElement("div", { className: "aura-card__heading" }, head ? props.header : null, !head && props.title ? h2("h" + (props.headingLevel || 3), { className: "aura-card__title", id: props.titleId }, props.title) : null, !head && props.description ? /* @__PURE__ */ React4.createElement("p", { className: "aura-card__desc" }, props.description) : null), props.actions ? /* @__PURE__ */ React4.createElement("div", { className: "aura-card__actions" }, props.actions) : null) : null,
      props.children ? /* @__PURE__ */ React4.createElement("div", { className: "aura-card__body" }, props.children) : null,
      props.footer ? /* @__PURE__ */ React4.createElement("div", { className: "aura-card__foot" }, props.footer) : null
    );
  }
  var PILL_ICON = {
    neutral: IconCircle,
    progress: IconCircleDotDashed,
    ready: IconCircleCheck,
    warning: IconTriangleAlert,
    blocked: IconBan
  };
  function statusPillElement(props, ref) {
    const tone2 = props.tone || toneFor(props.children);
    const rest = omit(props, ["tone", "className", "children"]);
    return /* @__PURE__ */ React4.createElement("span", { ...rest, ref, className: cx("aura-pill", "aura-pill--" + tone2, props.className) }, /* @__PURE__ */ React4.createElement(Icon, { name: h2(PILL_ICON[tone2] || IconCircle), size: 12 }), props.children);
  }
  function badgeElement(props, ref) {
    const rest = omit(props, ["tone", "variant", "icon", "className", "children"]);
    return /* @__PURE__ */ React4.createElement(
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
      props.icon ? /* @__PURE__ */ React4.createElement(Icon, { name: props.icon, size: 12 }) : null,
      props.children
    );
  }
  function emptyStateElement(props, ref) {
    const HT = props.headingLevel === false ? "p" : "h" + (props.headingLevel || 3);
    const rest = omit(props, [
      "title",
      "description",
      "icon",
      "action",
      "size",
      "bordered",
      "headingLevel",
      "tone",
      "className",
      "children"
    ]);
    return /* @__PURE__ */ React4.createElement(
      "div",
      {
        ...rest,
        ref,
        className: cx(
          "aura-empty",
          props.size === "sm" && "is-sm",
          props.bordered && "is-bordered",
          props.tone === "danger" && "is-danger",
          props.className
        )
      },
      /* @__PURE__ */ React4.createElement("span", { className: "aura-empty__icon", "aria-hidden": true }, /* @__PURE__ */ React4.createElement(Icon, { name: props.icon || /* @__PURE__ */ React4.createElement(IconInbox, null), size: props.size === "sm" ? "md" : "lg" })),
      /* @__PURE__ */ React4.createElement(HT, { className: "aura-empty__title" }, props.title),
      props.description ? /* @__PURE__ */ React4.createElement("p", { className: "aura-empty__text" }, props.description) : null,
      props.action ? /* @__PURE__ */ React4.createElement("div", { className: "aura-empty__action" }, props.action) : null
    );
  }
  function statElement(props, ref, Link) {
    const ch = props.change;
    const dir = ch && (ch.direction || "flat");
    const tone2 = ch && (ch.tone || (dir === "up" ? "positive" : dir === "down" ? "negative" : "neutral"));
    const v = props.value;
    const numeric = typeof v === "number" || typeof v === "string" && /\d/.test(v) && /^[\s\d.,:+\-\u2212%()\u0E3F$\u20AC\u00A3\u00A5kKmMbB]+$/.test(v.replace(/\b[A-Z]{3}\b/g, ""));
    const labelLink = !!props.href && props.linkArea === "label";
    const Tag3 = labelLink ? "div" : props.href ? Link : props.onClick ? "button" : "div";
    const interactive = !!(props.href || props.onClick);
    const LINK_ARIA = ["aria-label", "aria-labelledby", "aria-describedby", "aria-current"];
    const root = {}, toLink = {};
    Object.keys(props).forEach(function(k) {
      const v2 = props[k];
      if (labelLink && LINK_ARIA.indexOf(k) >= 0) toLink[k] = v2;
      else if (k === "id" || k === "style" || k === "lang" || k === "dir" || /^(aria|data)-/.test(k)) root[k] = v2;
    });
    const busy = props.loading || props["aria-busy"] || void 0;
    if (props.headingLevel && Tag3 === "button")
      devWarnOnce(
        "stat-heading-button",
        "Stat `headingLevel` is ignored with `onClick`: a heading can\u2019t sit in a button. Use `href`, or put the heading outside."
      );
    const LabelTag = props.headingLevel && Tag3 !== "button" ? "h" + props.headingLevel : "span";
    const HeadTag = LabelTag === "span" ? "span" : "div";
    return /* @__PURE__ */ React4.createElement(
      Tag3,
      {
        ...root,
        ref,
        className: cx(
          "aura-stat",
          interactive && "is-interactive",
          labelLink && "aura-stat--label-link",
          props.loading && "is-loading",
          props.className
        ),
        href: labelLink ? void 0 : props.href,
        onClick: labelLink ? void 0 : props.onClick,
        type: Tag3 === "button" ? "button" : void 0,
        "aria-busy": busy
      },
      /* @__PURE__ */ React4.createElement(HeadTag, { className: "aura-stat__head" }, /* @__PURE__ */ React4.createElement(LabelTag, { className: "aura-stat__label" }, labelLink ? /* @__PURE__ */ React4.createElement(Link, { ...toLink, href: props.href, onClick: props.onClick, className: "aura-stat__link" }, props.label) : props.label), props.icon ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__icon" }, /* @__PURE__ */ React4.createElement(Icon, { name: props.icon })) : null),
      props.loading ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__value" }, /* @__PURE__ */ React4.createElement("span", { className: "aura-skel aura-stat__skel" })) : /* @__PURE__ */ React4.createElement("span", { className: cx("aura-stat__value", numeric && "is-numeric") }, props.value, props.unit ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__unit" }, props.unit) : null),
      props.status != null && props.status !== false && props.status !== "" && !props.loading ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__status" }, props.status) : null,
      ch && !props.loading || props.caption ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__foot" }, ch && !props.loading ? /* @__PURE__ */ React4.createElement("span", { className: cx("aura-stat__change", "is-" + tone2) }, /* @__PURE__ */ React4.createElement(
        Icon,
        {
          name: dir === "up" ? /* @__PURE__ */ React4.createElement(IconTrendingUp, null) : dir === "down" ? /* @__PURE__ */ React4.createElement(IconTrendingDown, null) : /* @__PURE__ */ React4.createElement(IconMinus, null),
          size: 14
        }
      ), /* @__PURE__ */ React4.createElement("span", null, ch.value)) : null, ch && ch.label && !props.loading ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__caption" }, ch.label) : null, props.caption ? /* @__PURE__ */ React4.createElement("span", { className: "aura-stat__caption" }, props.caption) : null) : null
    );
  }
  var AVATAR_TONES = ["progress", "ready", "neutral", "warning"];
  function initials(name) {
    const parts = String(name || "?").trim().split(/\s+/);
    return ((parts[0] || "?")[0] + (parts.length > 1 ? parts[parts.length - 1][0] : parts[0][1] || "")).toUpperCase();
  }
  function avatarElement(props, ref, broken, onError) {
    const size = props.size || "md";
    let hash = 0;
    String(props.name || "").split("").forEach(function(ch) {
      hash = hash * 31 + ch.charCodeAt(0) >>> 0;
    });
    const tone2 = AVATAR_TONES[hash % AVATAR_TONES.length];
    return /* @__PURE__ */ React4.createElement(
      "span",
      {
        ref,
        className: cx("aura-avatar", "aura-avatar--" + size, "aura-avatar--" + tone2, props.className),
        role: "img",
        "aria-label": props.name + (props.status ? ", " + props.status : "")
      },
      props.src && broken !== props.src ? /* @__PURE__ */ React4.createElement("img", { key: props.src, src: props.src, alt: "", onError }) : /* @__PURE__ */ React4.createElement("span", { "aria-hidden": true }, initials(props.name)),
      props.status === "online" ? /* @__PURE__ */ React4.createElement("span", { className: "aura-avatar__status", "aria-hidden": true }) : null
    );
  }
  function buttonClass(opts = {}) {
    return cx(
      "aura-btn",
      "aura-btn--" + (opts.variant || "primary"),
      opts.size === "sm" && "aura-btn--sm",
      opts.fullWidth && "aura-btn--full",
      opts.touchHeight && "aura-btn--touch",
      opts.loading && "is-loading",
      opts.className
    );
  }

  // src/locale.tsx
  var React5 = __toESM(require_react(), 1);

  // src/strings.th.ts
  var n = function(x) {
    return Number(x).toLocaleString("en");
  };
  var th = {
    close: "\u0E1B\u0E34\u0E14",
    dismiss: "\u0E1B\u0E34\u0E14",
    dismissToast: "\u0E1B\u0E34\u0E14\u0E01\u0E32\u0E23\u0E41\u0E08\u0E49\u0E07\u0E40\u0E15\u0E37\u0E2D\u0E19",
    showPassword: "\u0E41\u0E2A\u0E14\u0E07\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19",
    filters: "\u0E15\u0E31\u0E27\u0E01\u0E23\u0E2D\u0E07",
    search: "\u0E04\u0E49\u0E19\u0E2B\u0E32",
    clearFilters: "\u0E25\u0E49\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",
    results: function(n3) {
      return n3.toLocaleString("en") + " \u0E23\u0E32\u0E22\u0E01\u0E32\u0E23";
    },
    commandMenu: "\u0E40\u0E21\u0E19\u0E39\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07",
    commandPlaceholder: "\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E33\u0E2A\u0E31\u0E48\u0E07\u0E2B\u0E23\u0E37\u0E2D\u0E04\u0E49\u0E19\u0E2B\u0E32\u2026",
    commandHint: "\u2191\u2193 \u0E40\u0E25\u0E37\u0E48\u0E2D\u0E19 \xB7 Enter \u0E40\u0E1B\u0E34\u0E14 \xB7 Esc \u0E1B\u0E34\u0E14",
    errorSummary: function(n3) {
      return "\u0E41\u0E01\u0E49\u0E44\u0E02 " + n3 + " \u0E0A\u0E48\u0E2D\u0E07\u0E01\u0E48\u0E2D\u0E19\u0E44\u0E1B\u0E15\u0E48\u0E2D";
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
    rangeOpen: function(a, b) {
      return a + "\u2013" + b + " \u0E08\u0E32\u0E01\u0E2B\u0E25\u0E32\u0E22\u0E23\u0E32\u0E22\u0E01\u0E32\u0E23";
    },
    pageOpen: function(p) {
      return "\u0E2B\u0E19\u0E49\u0E32 " + p;
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
    timeUnavailable: "\u0E40\u0E27\u0E25\u0E32\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E27\u0E48\u0E32\u0E07 \u0E40\u0E25\u0E37\u0E2D\u0E01\u0E40\u0E27\u0E25\u0E32\u0E2D\u0E37\u0E48\u0E19",
    dropFiles: "\u0E25\u0E32\u0E01\u0E44\u0E1F\u0E25\u0E4C\u0E21\u0E32\u0E27\u0E32\u0E07 \u0E2B\u0E23\u0E37\u0E2D",
    browse: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C",
    browseOne: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E1F\u0E25\u0E4C",
    remove: function(n3) {
      return "\u0E25\u0E1A " + n3;
    },
    fileTooBig: function(max) {
      return "\u0E44\u0E1F\u0E25\u0E4C\u0E43\u0E2B\u0E0D\u0E48\u0E40\u0E01\u0E34\u0E19 " + max;
    },
    fileWrongType: "\u0E44\u0E21\u0E48\u0E23\u0E2D\u0E07\u0E23\u0E31\u0E1A\u0E44\u0E1F\u0E25\u0E4C\u0E0A\u0E19\u0E34\u0E14\u0E19\u0E35\u0E49",
    tooManyFiles: function(n3) {
      return "\u0E41\u0E19\u0E1A\u0E44\u0E14\u0E49\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + n3 + " \u0E44\u0E1F\u0E25\u0E4C";
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
    progressReserved: function(v, r, max) {
      return "\u0E43\u0E0A\u0E49\u0E41\u0E25\u0E49\u0E27 " + n(v) + " \u0E08\u0E32\u0E01 " + n(max) + " \u0E08\u0E2D\u0E07\u0E44\u0E27\u0E49 " + n(r);
    },
    breadcrumbMore: "\u0E41\u0E2A\u0E14\u0E07\u0E40\u0E2A\u0E49\u0E19\u0E17\u0E32\u0E07\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14",
    stepError: "\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E1C\u0E34\u0E14\u0E1E\u0E25\u0E32\u0E14",
    accepts: function(list, max) {
      return [list, max && "\u0E44\u0E21\u0E48\u0E40\u0E01\u0E34\u0E19 " + max + " \u0E15\u0E48\u0E2D\u0E44\u0E1F\u0E25\u0E4C"].filter(Boolean).join(" \xB7 ");
    }
  };

  // src/strings.sv.ts
  var nsv = function(x) {
    return Number(x).toLocaleString("sv-SE");
  };
  var sv = {
    close: "St\xE4ng",
    dismiss: "St\xE4ng",
    dismissToast: "St\xE4ng aviseringen",
    showPassword: "Visa l\xF6senord",
    filters: "Filter",
    search: "S\xF6k",
    clearFilters: "Rensa alla",
    results: function(n3) {
      return n3 === 1 ? "1 tr\xE4ff" : n3.toLocaleString("sv-SE") + " tr\xE4ffar";
    },
    commandMenu: "Kommandomeny",
    commandPlaceholder: "Skriv ett kommando eller s\xF6k\u2026",
    commandHint: "\u2191\u2193 flytta \xB7 Enter \xF6ppna \xB7 Esc st\xE4ng",
    errorSummary: function(n3) {
      return n3 === 1 ? "R\xE4tta 1 f\xE4lt f\xF6r att forts\xE4tta" : "R\xE4tta " + n3 + " f\xE4lt f\xF6r att forts\xE4tta";
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
    rangeOpen: function(a, b) {
      return a + "\u2013" + b + " av m\xE5nga";
    },
    pageOpen: function(p) {
      return "Sida " + p;
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
    timeUnavailable: "Den tiden \xE4r inte ledig. V\xE4lj en annan.",
    dropFiles: "Dra filer hit eller",
    browse: "V\xE4lj filer",
    browseOne: "V\xE4lj en fil",
    remove: function(n3) {
      return "Ta bort " + n3;
    },
    fileTooBig: function(max) {
      return "St\xF6rre \xE4n " + max;
    },
    fileWrongType: "Den h\xE4r filtypen godtas inte",
    tooManyFiles: function(n3) {
      return "H\xF6gst " + n3 + " filer";
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
    progressReserved: function(v, r, max) {
      return nsv(v) + " av " + nsv(max) + " anv\xE4nda, " + nsv(r) + " reserverade";
    },
    breadcrumbMore: "Visa hela s\xF6kv\xE4gen",
    stepError: "har fel",
    accepts: function(list, max) {
      return [list, max && "h\xF6gst " + max + " per fil"].filter(Boolean).join(", ");
    }
  };

  // src/strings.ts
  var n2 = function(x) {
    return Number(x).toLocaleString("en");
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
      results: function(n3) {
        return n3 === 1 ? "1 result" : n3.toLocaleString("en") + " results";
      },
      commandMenu: "Command menu",
      commandPlaceholder: "Type a command or search\u2026",
      commandHint: "\u2191\u2193 to move \xB7 Enter to open \xB7 Esc to close",
      errorSummary: function(n3) {
        return n3 === 1 ? "Fix 1 field to continue" : "Fix " + n3 + " fields to continue";
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
        return "Keep typing to narrow " + n2(total) + " options";
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
        return n2(c) + " selected";
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
        return a + "\u2013" + b + " of " + n2(total);
      },
      page: function(p, total) {
        return "Page " + p + " of " + total;
      },
      rangeOpen: function(a, b) {
        return a + "\u2013" + b + " of many";
      },
      pageOpen: function(p) {
        return "Page " + p;
      },
      prevPage: "Previous page",
      nextPage: "Next page",
      totals: "Totals",
      rowCount: function(c) {
        return n2(c) + " rows";
      },
      actions: "Actions",
      optional: "optional",
      timePlaceholder: "hh:mm",
      timeInvalid: "Type a time like 09:30",
      timeOutOfRange: function(a, b) {
        return "Choose a time between " + a + " and " + b;
      },
      timeUnavailable: "That time isn't available. Choose another.",
      dropFiles: "Drag files here or",
      browse: "Choose files",
      browseOne: "Choose a file",
      remove: function(n3) {
        return "Remove " + n3;
      },
      fileTooBig: function(max) {
        return "Larger than " + max;
      },
      fileWrongType: "This file type isn\u2019t accepted",
      tooManyFiles: function(n3) {
        return "Up to " + n3 + " files";
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
      progressReserved: function(v, r, max) {
        return n2(v) + " of " + n2(max) + " used, " + n2(r) + " reserved";
      },
      breadcrumbMore: "Show the full path",
      stepError: "has errors",
      accepts: function(list, max) {
        return [list, max && "up to " + max + " each"].filter(Boolean).join(", ");
      }
    },
    th,
    sv
  };

  // src/locale.tsx
  var LocaleContext = React5.createContext(null);
  function AuraProvider(props) {
    const outer = React5.useContext(LocaleContext);
    const l = props.locale;
    if ((l === "th" || l === "sv") && !(props.strings && Object.keys(props.strings).length >= Object.keys(STRINGS.en).length))
      devWarnOnce(
        "locale-pack-" + l,
        'AuraProvider locale="' + l + '": from 6.0 only English is built in. Pass the pack: import { ' + l + " } from '@jirawatpyk/aura-react/locales/" + l + `'; <AuraProvider locale="` + l + '" strings={' + l + "}>."
      );
    const density = props.density || outer && outer.density || null;
    const timeZone = props.timeZone || outer && outer.timeZone || null;
    const value = React5.useMemo(
      function() {
        const own = !!props.locale || !outer || !outer.locale;
        const base = own ? props.locale && STRINGS[props.locale] || STRINGS.en : outer.strings;
        return {
          locale: props.locale || outer && outer.locale || "en",
          calendar: props.calendar || (own ? null : outer.calendar),
          strings: props.strings ? Object.assign({}, base, props.strings) : base,
          linkComponent: props.linkComponent || outer && outer.linkComponent || null,
          density,
          timeZone
        };
      },
      [props.locale, props.calendar, props.strings, props.linkComponent, density, timeZone, outer]
    );
    return /* @__PURE__ */ React5.createElement(LocaleContext.Provider, { value }, props.density ? /* @__PURE__ */ React5.createElement("div", { className: "aura-density", "data-density": props.density }, props.children) : props.children);
  }
  function useAuraLocale() {
    return React5.useContext(LocaleContext) || { locale: null, calendar: null, strings: STRINGS.en };
  }
  function useLinkComponent(own) {
    const ctx = React5.useContext(LocaleContext);
    return own || ctx && ctx.linkComponent || "a";
  }
  function useDensity() {
    const ctx = React5.useContext(LocaleContext);
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
      "size",
      "touchHeight"
    ]);
    const Tag3 = disabled ? "a" : Link;
    return /* @__PURE__ */ React6.createElement(
      Tag3,
      {
        ...rest,
        ref,
        href: disabled ? void 0 : props.href,
        role: disabled ? "link" : void 0,
        "aria-disabled": disabled || void 0,
        tabIndex: disabled ? -1 : props.tabIndex,
        className: buttonClass({
          variant,
          size: props.size,
          fullWidth: props.fullWidth,
          touchHeight: props.touchHeight,
          className: props.className
        }),
        onClick: disabled ? void 0 : props.onClick
      },
      props.icon ? /* @__PURE__ */ React6.createElement(Icon, { name: props.icon }) : null,
      props.children,
      props.iconRight ? /* @__PURE__ */ React6.createElement(Icon, { name: props.iconRight }) : null
    );
  }
  var Button = React6.forwardRef(
    function Button2(all, ref) {
      const Link = useLinkComponent(all.linkComponent);
      if (typeof all.href === "string") {
        return ButtonLink(all, ref, Link);
      }
      const props = all;
      const variant = props.variant || "primary";
      const loading = !!props.loading;
      const ad = props["aria-disabled"];
      const blocked = loading || ad === true || ad === "true";
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
        "size",
        "touchHeight"
      ]);
      return /* @__PURE__ */ React6.createElement(
        "button",
        {
          ...rest,
          ref,
          type: props.type || "button",
          className: buttonClass({
            variant,
            size: props.size,
            fullWidth: props.fullWidth,
            touchHeight: props.touchHeight,
            loading,
            className: props.className
          }),
          "aria-busy": loading || void 0,
          "aria-disabled": blocked || void 0,
          onClick: blocked ? function(e) {
            e.preventDefault();
          } : props.onClick
        },
        loading ? /* @__PURE__ */ React6.createElement(Icon, { name: /* @__PURE__ */ React6.createElement(IconLoaderCircle, null), className: "aura-spin" }) : props.icon ? /* @__PURE__ */ React6.createElement(Icon, { name: props.icon }) : null,
        props.children,
        props.iconRight && !loading ? /* @__PURE__ */ React6.createElement(Icon, { name: props.iconRight }) : null
      );
    }
  );

  // src/IconButton.tsx
  var React7 = __toESM(require_react(), 1);
  var IconButton = React7.forwardRef(function IconButton2(props, ref) {
    const rest = omit(props, ["icon", "label", "className", "size", "tone", "touchHeight"]);
    return /* @__PURE__ */ React7.createElement(
      "button",
      {
        ...rest,
        ref,
        type: props.type || "button",
        "aria-label": props.label,
        title: props.label,
        className: cx(
          "aura-icon-btn",
          props.tone === "danger" && "aura-icon-btn--danger",
          props.touchHeight && "aura-icon-btn--touch",
          props.className
        )
      },
      /* @__PURE__ */ React7.createElement(Icon, { name: props.icon, size: props.size || "sm" })
    );
  });

  // src/Menu.tsx
  var React8 = __toESM(require_react(), 1);
  var import_react_dom = __toESM(require_react_dom(), 1);
  var ITEMS = '[role^="menuitem"]';
  var Menu = React8.forwardRef(function Menu2(props, ref) {
    const own = React8.useRef(null), merged = useMergedRef(ref, own);
    const posState = React8.useState(null);
    const pos = posState[0], setPos = posState[1];
    const items2 = props.items || [];
    const mounted = useMounted();
    const headerId = uid(), itemId = uid();
    const hasHeader = props.header != null && props.header !== false && props.header !== "";
    const Link = useLinkComponent(props.linkComponent);
    useIsoLayoutEffect(
      function() {
        const a = props.anchor, m = own.current;
        if (!a || !m) return;
        const r = a.getBoundingClientRect(), mh = m.scrollHeight, mw = m.offsetWidth, below2 = window.innerHeight - r.bottom - 12, above = r.top - 12;
        let top = r.bottom + 4, maxHeight;
        if (mh > below2) {
          if (mh <= above) top = r.top - mh - 4;
          else if (above > below2) {
            maxHeight = above;
            top = r.top - above - 4;
          } else maxHeight = below2;
        }
        const left = Math.max(8, Math.min(r.right - mw, window.innerWidth - mw - 8));
        setPos({ top, left, maxHeight });
      },
      [props.anchor, mounted, hasHeader]
    );
    const hadHeader = React8.useRef(hasHeader);
    React8.useEffect(
      function() {
        if (hadHeader.current === hasHeader) return;
        hadHeader.current = hasHeader;
        const a = document.activeElement;
        if (own.current && (!a || a === document.body)) {
          const first = own.current.querySelector(ITEMS);
          (first || own.current.querySelector('[role="menu"]') || own.current).focus();
        }
      },
      [hasHeader]
    );
    React8.useEffect(
      function() {
        if (!mounted) return;
        const first = own.current && own.current.querySelector(ITEMS);
        if (props.autoFocus !== false) {
          if (first) first.focus();
          else if (own.current) (own.current.querySelector('[role="menu"]') || own.current).focus();
        }
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
      const list2 = Array.prototype.slice.call(own.current.querySelectorAll(ITEMS));
      const i = list2.indexOf(document.activeElement);
      if (!list2.length && e.key !== "Escape" && e.key !== "Tab") {
        e.stopPropagation();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        list2[(i + 1) % list2.length].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        list2[i < 0 ? list2.length - 1 : (i - 1 + list2.length) % list2.length].focus();
      } else if (e.key === "Home") {
        e.preventDefault();
        list2[0].focus();
      } else if (e.key === "End") {
        e.preventDefault();
        list2[list2.length - 1].focus();
      } else if (e.key === " " && document.activeElement && document.activeElement.tagName === "A") {
        e.preventDefault();
        document.activeElement.click();
      } else if (e.key === "Escape") {
        e.preventDefault();
        props.onClose(true);
      } else if (e.key === "Tab") {
        props.onClose(true);
      }
      e.stopPropagation();
    }
    function groupItems(list2) {
      const out = [];
      list2.forEach(function(it, i) {
        const g = it.type === "radio" && it.group ? it.group : null;
        const last = out[out.length - 1];
        if (last && last.group === g && g !== null) last.items.push({ it, i });
        else out.push({ group: g, items: [{ it, i }] });
      });
      return out;
    }
    function renderItem(it, i) {
      if (it.separator) return /* @__PURE__ */ React8.createElement("div", { key: "s" + i, role: "separator", className: "aura-menu__sep" });
      const isRadio = it.type === "radio";
      const isCheck = !isRadio && it.checked !== void 0;
      const lead = isRadio ? /* @__PURE__ */ React8.createElement("span", { className: cx("aura-menu__radio", it.checked && "is-on") }) : isCheck ? /* @__PURE__ */ React8.createElement("span", { className: cx("aura-menu__check", it.checked && "is-on") }, it.checked ? /* @__PURE__ */ React8.createElement(Icon, { name: /* @__PURE__ */ React8.createElement(IconCheck, null), size: 12, strokeWidth: 3 }) : null) : it.icon ? /* @__PURE__ */ React8.createElement(Icon, { name: it.icon }) : /* @__PURE__ */ React8.createElement("span", { className: "aura-menu__blank" });
      const body = [
        /* @__PURE__ */ React8.createElement(React8.Fragment, { key: "l" }, lead),
        /* @__PURE__ */ React8.createElement("span", { key: "t", className: "aura-menu__label" }, it.label),
        it.hint ? /* @__PURE__ */ React8.createElement("span", { key: "h", className: "aura-menu__hint" }, it.hint) : null
      ];
      const cls = cx("aura-menu__item", it.tone === "danger" && "aura-menu__item--danger");
      const reasonId = it.disabled && it.disabledReason ? itemId + "-r" + i : void 0;
      if (reasonId)
        body[2] = /* Hidden from the name (it would be read twice); aria-describedby still reads it. */
        /* @__PURE__ */ React8.createElement("span", { key: "h", id: reasonId, className: "aura-menu__hint aura-menu__reason", "aria-hidden": true }, it.disabledReason);
      if (it.href && !it.disabled)
        return /* @__PURE__ */ React8.createElement(
          Link,
          {
            key: i,
            href: it.href,
            target: it.target,
            rel: it.target === "_blank" ? "noreferrer" : void 0,
            tabIndex: -1,
            role: "menuitem",
            className: cls,
            onClick: function(e) {
              if (it.onSelect) it.onSelect();
              props.onClose(e.detail === 0);
            }
          },
          body
        );
      return /* @__PURE__ */ React8.createElement(
        "button",
        {
          key: i,
          type: "button",
          tabIndex: -1,
          "aria-disabled": it.disabled ? true : void 0,
          "aria-describedby": reasonId,
          role: isRadio ? "menuitemradio" : isCheck ? "menuitemcheckbox" : "menuitem",
          "aria-checked": isRadio || isCheck ? !!it.checked : void 0,
          className: cls,
          onClick: function() {
            if (it.disabled) return;
            if (it.onSelect) it.onSelect();
            if (!it.keepOpen) props.onClose(true);
          }
        },
        body
      );
    }
    const style = {
      top: pos ? pos.top : -9999,
      left: pos ? pos.left : -9999,
      maxHeight: pos && pos.maxHeight ? pos.maxHeight : void 0
    };
    const list = groupItems(items2).map(function(block, bi) {
      const rendered = block.items.map(function(x) {
        return renderItem(x.it, x.i);
      });
      return block.group ? /* @__PURE__ */ React8.createElement("div", { key: "g" + bi, role: "group", "aria-label": block.group, className: "aura-menu__group" }, rendered) : /* @__PURE__ */ React8.createElement(React8.Fragment, { key: "f" + bi }, rendered);
    });
    const el = hasHeader ? /* @__PURE__ */ React8.createElement("div", { ref: merged, className: "aura-menu has-header", onKeyDown, style }, /* @__PURE__ */ React8.createElement(
      "div",
      {
        className: "aura-menu__header",
        id: headerId,
        onMouseDown: function(e) {
          e.preventDefault();
        }
      },
      props.header
    ), /* @__PURE__ */ React8.createElement("div", { role: "menu", tabIndex: -1, "aria-label": props.label, "aria-describedby": headerId, className: "aura-menu__list" }, list)) : /* @__PURE__ */ React8.createElement(
      "div",
      {
        ref: merged,
        role: "menu",
        tabIndex: -1,
        "aria-label": props.label,
        className: "aura-menu",
        onKeyDown,
        style
      },
      list
    );
    return mounted ? (0, import_react_dom.createPortal)(el, document.body) : null;
  });

  // src/DropdownMenu.tsx
  var React9 = __toESM(require_react(), 1);
  var DropdownMenu = React9.forwardRef(function DropdownMenu2(props, ref) {
    const st = React9.useState(null), anchor = st[0], setAnchor = st[1];
    const wrap = React9.useRef(null), wrapMerged = useMergedRef(ref, wrap);
    const child = React9.Children.only(props.trigger);
    const menuRef = React9.useRef(null), toLast = React9.useRef(false);
    React9.useEffect(
      function() {
        if (!anchor || !toLast.current || !menuRef.current) return;
        toLast.current = false;
        const list = menuRef.current.querySelectorAll('[role^="menuitem"]');
        if (list.length) list[list.length - 1].focus();
      },
      [anchor]
    );
    function toggle(e) {
      if (child.props.onClick) child.props.onClick(e);
      const el = wrap.current && (wrap.current.querySelector('button, [role="button"], a') || wrap.current);
      setAnchor(anchor ? null : el);
    }
    function onKeyDown(e) {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !anchor) {
        e.preventDefault();
        toLast.current = e.key === "ArrowUp";
        setAnchor(wrap.current.querySelector('button, [role="button"], a') || wrap.current);
      }
    }
    return /* @__PURE__ */ React9.createElement("span", { ref: wrapMerged, className: "aura-dropdown", onKeyDown }, React9.cloneElement(child, { onClick: toggle, "aria-haspopup": "menu", "aria-expanded": anchor ? true : false }), anchor ? /* @__PURE__ */ React9.createElement(
      Menu,
      {
        ref: menuRef,
        anchor,
        label: props.label,
        items: props.items,
        linkComponent: props.linkComponent,
        header: props.header,
        onClose: function(restore) {
          setAnchor(null);
          if (restore && typeof anchor.focus === "function") anchor.focus();
        }
      }
    ) : null);
  });

  // src/Checkbox.tsx
  var React10 = __toESM(require_react(), 1);
  var Checkbox = React10.forwardRef(function Checkbox2(props, ref) {
    const own = React10.useRef(null), merged = useMergedRef(ref, own);
    const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
    const on = !!st[0];
    const auto = uid();
    React10.useEffect(function() {
      if (own.current) own.current.indeterminate = !!props.indeterminate;
    });
    const rest = omit(props, [
      "checked",
      "defaultChecked",
      "onChange",
      "indeterminate",
      "label",
      "hideLabel",
      "children",
      "description",
      "className",
      "tabIndex",
      "disabled",
      "hitArea"
    ]);
    const text2 = props.children;
    const labelled = text2 != null && text2 !== "";
    if (!labelled && props.label && !props.hideLabel)
      devWarnOnce(
        "checkbox-label",
        "Checkbox `label` is only the accessible name: it is not shown. In 6.0 it will be shown beside the box, like Switch and TextField. For visible text now pass it as children; for a bare box (a table row) add `hideLabel`."
      );
    const descId = props.description ? (props.id || auto) + "-desc" : void 0;
    const ha = props.hitArea;
    const hit = !labelled && ha && ha !== "box" ? ha === "target" ? { x: 4, y: 4 } : ha : null;
    return /* @__PURE__ */ React10.createElement(
      "label",
      {
        className: cx(
          "aura-check",
          labelled && "aura-check--labelled",
          hit && "has-hit",
          props.disabled && "is-disabled",
          props.className
        ),
        style: hit ? { "--aura-check-hit-x": hit.x + "px", "--aura-check-hit-y": hit.y + "px" } : void 0,
        onClick: function(e) {
          e.stopPropagation();
        }
      },
      /* @__PURE__ */ React10.createElement(
        "input",
        {
          ...rest,
          ref: merged,
          type: "checkbox",
          className: "aura-check__input",
          checked: on,
          tabIndex: props.tabIndex,
          disabled: props.disabled,
          "aria-describedby": cx(props["aria-describedby"], descId) || void 0,
          "aria-label": labelled ? void 0 : props.label,
          onChange: function(e) {
            st[1](e.target.checked);
          }
        }
      ),
      /* @__PURE__ */ React10.createElement("span", { className: "aura-check__box", "aria-hidden": true }, props.indeterminate ? /* @__PURE__ */ React10.createElement(Icon, { name: /* @__PURE__ */ React10.createElement(IconMinus, null), size: 12, strokeWidth: 3 }) : on ? /* @__PURE__ */ React10.createElement(Icon, { name: /* @__PURE__ */ React10.createElement(IconCheck, null), size: 12, strokeWidth: 3 }) : null),
      !labelled && props.description ? /* @__PURE__ */ React10.createElement("span", { className: "aura-sr-only", id: descId }, props.description) : null,
      labelled ? /* @__PURE__ */ React10.createElement("span", { className: "aura-check__text" }, /* @__PURE__ */ React10.createElement("span", { className: "aura-check__label" }, text2), props.description ? /* @__PURE__ */ React10.createElement("span", { className: "aura-check__desc", id: descId }, props.description) : null) : null
    );
  });

  // src/StatusPill.tsx
  var React11 = __toESM(require_react(), 1);
  var StatusPill = React11.forwardRef(function StatusPill2(props, ref) {
    return statusPillElement(props, ref);
  });

  // src/Field.tsx
  var React12 = __toESM(require_react(), 1);
  var h3 = React12.createElement;
  var Field = React12.forwardRef(function Field2(props, ref) {
    const t = useStrings();
    return /* @__PURE__ */ React12.createElement(
      "div",
      {
        ref,
        className: cx("aura-field", props.error && "is-invalid", props.disabled && "is-disabled", props.className)
      },
      props.label ? h3(
        props.labelAs || "label",
        { className: "aura-field__label", htmlFor: props.labelAs ? void 0 : props.id, id: props.labelId },
        props.label,
        props.required ? /* @__PURE__ */ React12.createElement("span", { className: "aura-field__req", "aria-hidden": true }, " *") : null,
        props.optional ? /* @__PURE__ */ React12.createElement("span", { className: "aura-field__opt" }, " (" + t.optional + ")") : null
      ) : null,
      props.children,
      props.error ? /* @__PURE__ */ React12.createElement("p", { className: "aura-field__error", id: props.id + "-error" }, /* @__PURE__ */ React12.createElement(Icon, { name: /* @__PURE__ */ React12.createElement(IconCircleAlert, null), size: 14 }), props.error) : props.hint ? /* @__PURE__ */ React12.createElement("p", { className: "aura-field__hint", id: props.id + "-hint" }, props.hint) : null
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
  var React13 = __toESM(require_react(), 1);
  var TextField = React13.forwardRef(function TextField2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const rest = omit(props, FIELD_KEYS);
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
      /* @__PURE__ */ React13.createElement("div", { className: cx("aura-input", props.icon && "has-icon", props.suffix && "has-suffix") }, props.icon ? /* @__PURE__ */ React13.createElement(Icon, { name: props.icon, className: "aura-input__icon" }) : null, /* @__PURE__ */ React13.createElement(
        "input",
        {
          type: "text",
          ...rest,
          ref,
          id,
          className: "aura-input__control",
          placeholder: props.placeholder,
          required: props.required,
          "aria-invalid": props.error ? true : rest["aria-invalid"],
          "aria-describedby": [describedBy(id, props), rest["aria-describedby"]].filter(Boolean).join(" ") || void 0
        }
      ), props.suffix ? /* @__PURE__ */ React13.createElement("span", { className: "aura-input__suffix" }, props.suffix) : null)
    );
  });

  // src/Textarea.tsx
  var React14 = __toESM(require_react(), 1);
  var Textarea = React14.forwardRef(function Textarea2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const rest = omit(props, FIELD_KEYS);
    return /* @__PURE__ */ React14.createElement(
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
      /* @__PURE__ */ React14.createElement(
        "textarea",
        {
          rows: 4,
          ...rest,
          ref,
          id,
          className: "aura-input aura-textarea",
          placeholder: props.placeholder,
          required: props.required,
          "aria-invalid": props.error ? true : rest["aria-invalid"],
          "aria-describedby": [describedBy(id, props), rest["aria-describedby"]].filter(Boolean).join(" ") || void 0
        }
      )
    );
  });

  // src/Select.tsx
  var React15 = __toESM(require_react(), 1);
  var import_react_dom2 = __toESM(require_react_dom(), 1);
  var h4 = React15.createElement;
  var FILTER_KEY = "__auraFilter";
  var FORM_KEYS = ["name", "form", "value", "defaultValue", "disabled", "autoComplete", "onInput", "onInvalid"];
  var HANDLED_KEYS = FORM_KEYS.concat([
    "onChange",
    "onBlur",
    "onFocus",
    "onKeyDown",
    "onClick",
    "autoFocus",
    "tabIndex",
    "aria-label",
    "aria-labelledby",
    "aria-describedby",
    "multiple",
    "size"
  ]);
  function pick(o, keys) {
    const r = {};
    for (const k of keys) if (k in o) r[k] = o[k];
    return r;
  }
  function readItems(el) {
    if (!el) return [];
    return Array.prototype.map.call(el.options, function(o, i) {
      const g = o.parentElement && o.parentElement.tagName === "OPTGROUP" ? o.parentElement : null;
      return {
        value: o.value,
        label: o.textContent || "",
        disabled: o.disabled || !!(g && g.disabled),
        group: g ? g.label : null,
        index: i
      };
    });
  }
  function textOf(n3) {
    if (n3 == null || typeof n3 === "boolean") return "";
    if (typeof n3 === "string" || typeof n3 === "number") return String(n3);
    if (Array.isArray(n3)) return n3.map(textOf).join("");
    return React15.isValidElement(n3) ? textOf(n3.props.children) : "";
  }
  function childOptions(children, off) {
    const out = [];
    React15.Children.forEach(children, function(c) {
      if (!React15.isValidElement(c)) return;
      const p = c.props;
      if (c.type === "optgroup" || c.type === React15.Fragment)
        out.push.apply(out, childOptions(p.children, off || c.type === "optgroup" && !!p.disabled));
      else if (c.type === "option") {
        const label = textOf(p.children);
        out.push({ value: p.value != null ? String(p.value) : label, label, disabled: off || !!p.disabled });
      }
    });
    return out;
  }
  function initialLabel(props, filter) {
    const opts = (props.options || []).map(function(o) {
      return typeof o === "object" ? o : { value: o, label: o };
    }).concat(childOptions(props.children));
    const first = opts.filter(function(o) {
      return !o.disabled;
    })[0];
    const v = props.value !== void 0 && props.value !== null ? String(props.value) : props.defaultValue !== void 0 && props.defaultValue !== null ? String(props.defaultValue) : props.placeholder ? "" : first ? first.value : "";
    const hit = opts.filter(function(o) {
      return o.value === v;
    })[0];
    if (hit)
      return {
        label: filter && filter.allLabel && opts[0] && hit.value === opts[0].value ? filter.allLabel : hit.label,
        full: hit.label,
        empty: false
      };
    return { label: props.placeholder || "", full: props.placeholder || "", empty: true };
  }
  var Select = React15.forwardRef(function Select2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const filter = props[FILTER_KEY];
    const rest = omit(props, FIELD_KEYS.concat(["children", FILTER_KEY, "readOnly"]));
    const ro = !!props.readOnly && !props.disabled;
    const mounted = useMounted();
    const kept = React15.useRef(null);
    const current2 = [].concat(props.value != null ? props.value : props.defaultValue != null ? props.defaultValue : []).map(String);
    const opts = (props.options || []).map(function(o) {
      const v = typeof o === "object" ? o : { value: o, label: o };
      return /* @__PURE__ */ React15.createElement(
        "option",
        {
          key: v.value,
          value: v.value,
          disabled: v.disabled || ro && !mounted && current2.length > 0 && current2.indexOf(v.value) < 0 || void 0
        },
        v.label
      );
    });
    if (props.placeholder)
      opts.unshift(
        /* @__PURE__ */ React15.createElement("option", { key: "__ph", value: "", disabled: true }, props.placeholder)
      );
    const extra = props.value === void 0 && props.defaultValue === void 0 && props.placeholder ? { defaultValue: "" } : {};
    const native = !!props.multiple || props.size != null && props.size > 1;
    const live = !native && mounted;
    const density = useDensity();
    React15.useEffect(function() {
      if (filter || props.label || props["aria-label"] || props["aria-labelledby"] || props.title) return;
      if (document.querySelector('label[for="' + id.replace(/["\\]/g, "\\$&") + '"]')) return;
      devWarnOnce(
        "select-name",
        "Select needs a label, aria-label or aria-labelledby: screen readers announce it with no name."
      );
    }, []);
    const selRef = React15.useRef(null), trigRef = React15.useRef(null), listRef = React15.useRef(null);
    const shown = React15.useState(function() {
      return initialLabel(props, filter);
    });
    const openState = React15.useState(false), open = openState[0];
    const activeState = React15.useState(-1), active = activeState[0];
    const items2 = React15.useState([]);
    const pos = React15.useState(null);
    const typed = React15.useRef({ text: "", at: 0 });
    const allLabel = React15.useRef(void 0);
    allLabel.current = filter ? filter.allLabel : void 0;
    const sync = React15.useCallback(function() {
      const el = selRef.current;
      if (!el) return;
      const o = el.selectedIndex >= 0 ? el.options[el.selectedIndex] : null;
      const text2 = o ? o.textContent || "" : "";
      const short = allLabel.current && el.selectedIndex === 0 ? allLabel.current : text2;
      const next = o ? { label: short, full: text2, empty: o.value === "" } : { label: "", full: "", empty: true };
      shown[1](function(cur) {
        return cur.label === next.label && cur.full === next.full && cur.empty === next.empty ? cur : next;
      });
    }, []);
    const hook = React15.useCallback(
      function(el) {
        selRef.current = el;
        if (!el || native || el.__auraHooked) return;
        el.__auraHooked = true;
        const proto = HTMLSelectElement.prototype;
        const pv = Object.getOwnPropertyDescriptor(proto, "value"), pi = Object.getOwnPropertyDescriptor(proto, "selectedIndex");
        if (pv && pv.set && pv.get)
          Object.defineProperty(el, "value", {
            configurable: true,
            get: function() {
              return pv.get.call(el);
            },
            set: function(v) {
              pv.set.call(el, v);
              sync();
            }
          });
        if (pi && pi.set && pi.get)
          Object.defineProperty(el, "selectedIndex", {
            configurable: true,
            get: function() {
              return pi.get.call(el);
            },
            set: function(v) {
              pi.set.call(el, v);
              sync();
            }
          });
        el.focus = function(o) {
          if (trigRef.current) trigRef.current.focus(o);
          else proto.focus.call(el, o);
        };
      },
      [native, sync]
    );
    const selMerged = useMergedRef(ref, hook);
    React15.useEffect(
      function() {
        const f = selRef.current && selRef.current.form;
        if (!f || native) return;
        function onReset() {
          setTimeout(sync, 0);
        }
        f.addEventListener("reset", onReset);
        return function() {
          f.removeEventListener("reset", onReset);
        };
      },
      [native, sync]
    );
    const focusedOnce = React15.useRef(false);
    React15.useEffect(
      function() {
        if (!live || focusedOnce.current || !trigRef.current) return;
        focusedOnce.current = true;
        if (props.autoFocus || selRef.current && document.activeElement === selRef.current) trigRef.current.focus();
      },
      [live]
    );
    useIsoLayoutEffect(function() {
      if (!live) return;
      sync();
      if (!open) return;
      const now = readItems(selRef.current), was = items2[0];
      const same2 = now.length === was.length && now.every(function(it, i) {
        const w = was[i];
        return w.value === it.value && w.label === it.label && w.disabled === it.disabled && w.group === it.group;
      });
      if (same2) return;
      items2[1](now);
      if (!choices(now).length) {
        close(false);
        return;
      }
      const hv = was[active] ? was[active].value : null;
      const again = now.filter(function(it) {
        return !it.disabled && it.value === hv;
      })[0];
      const cur = selRef.current ? selRef.current.selectedIndex : -1;
      activeState[1](again ? again.index : now[cur] && !now[cur].disabled ? cur : choices(now)[0].index);
    });
    function choices(list) {
      return list.filter(function(i) {
        return !i.disabled;
      });
    }
    function choose(it) {
      const el = selRef.current;
      if (!el || it.disabled || ro) return;
      if (el.value !== it.value) {
        el.value = it.value;
        el.dispatchEvent(new Event("input", { bubbles: true }));
        el.dispatchEvent(new Event("change", { bubbles: true }));
      }
      sync();
      close(true);
    }
    function openList(at) {
      if (props.disabled || ro || trigRef.current && trigRef.current.disabled) return;
      const list = readItems(selRef.current);
      const ok = choices(list);
      if (!ok.length) return;
      items2[1](list);
      const cur = selRef.current ? selRef.current.selectedIndex : -1;
      let a = at === "first" ? ok[0].index : at === "last" ? ok[ok.length - 1].index : cur;
      if (typeof at === "number") a = at;
      if (a < 0 || !list[a] || list[a].disabled) a = ok[0].index;
      activeState[1](a);
      openState[1](true);
    }
    function close(focus) {
      openState[1](false);
      pos[1](null);
      if (focus && trigRef.current) trigRef.current.focus();
    }
    function step(from, dir, list) {
      for (let i = from + dir; i >= 0 && i < list.length; i += dir) if (!list[i].disabled) return i;
      return from;
    }
    function typing() {
      return !!typed.current.text && Date.now() - typed.current.at < 500;
    }
    function typeahead(ch, list, from) {
      const now = Date.now(), t = typed.current;
      t.text = now - t.at < 500 ? t.text + ch : ch;
      t.at = now;
      const q = t.text.toLocaleLowerCase();
      for (let k = 1; k <= list.length; k++) {
        const i = (from + (t.text.length > 1 ? 0 : 1) + k - 1 + list.length) % list.length;
        if (!list[i].disabled && list[i].label.toLocaleLowerCase().indexOf(q) === 0) return i;
      }
      t.text = "";
      return -1;
    }
    function onKeyDown(e) {
      const k = e.key;
      const printable = k.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
      const search = printable && (k !== " " || typing());
      if (!open) {
        if (search) {
          const list2 = readItems(selRef.current);
          const i = typeahead(k, list2, selRef.current ? selRef.current.selectedIndex : -1);
          e.preventDefault();
          if (i >= 0) openList(i);
        } else if (k === "ArrowDown" || k === "ArrowUp" || k === "Enter" || k === " ") {
          e.preventDefault();
          openList(k === "ArrowUp" && !(selRef.current && selRef.current.value) ? "last" : void 0);
        }
        return;
      }
      const list = items2[0];
      if (search) {
        e.preventDefault();
        const i = typeahead(k, list, active);
        if (i >= 0) activeState[1](i);
      } else if (k === "ArrowDown") {
        e.preventDefault();
        activeState[1](step(active, 1, list));
      } else if (k === "ArrowUp") {
        e.preventDefault();
        activeState[1](step(active, -1, list));
      } else if (k === "Home" || k === "PageUp") {
        e.preventDefault();
        activeState[1](k === "Home" ? step(-1, 1, list) : Math.max(step(-1, 1, list), step(active - 9, 1, list)));
      } else if (k === "End" || k === "PageDown") {
        e.preventDefault();
        activeState[1](
          k === "End" ? step(list.length, -1, list) : Math.min(step(list.length, -1, list), step(active + 9, -1, list))
        );
      } else if (k === "Enter" || k === " ") {
        e.preventDefault();
        if (list[active]) choose(list[active]);
      } else if (k === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      } else if (k === "Tab") {
        close(false);
      }
    }
    useIsoLayoutEffect(
      function() {
        if (!open) return;
        function place() {
          const t = trigRef.current && trigRef.current.parentElement;
          if (!t) return;
          const r = t.getBoundingClientRect(), below2 = window.innerHeight - r.bottom - 8, above = r.top - 8, want = listRef.current ? listRef.current.scrollHeight : 320, up = below2 < Math.min(want, 200) && above > below2;
          const lw = listRef.current ? Math.max(r.width, listRef.current.offsetWidth) : r.width;
          const rtl = getComputedStyle(t).direction === "rtl";
          const left = lw <= r.width ? r.left : Math.max(8, Math.min(rtl ? r.right - lw : r.left, window.innerWidth - lw - 8));
          pos[1]({
            left,
            width: r.width,
            top: up ? void 0 : r.bottom + 4,
            bottom: up ? window.innerHeight - r.top + 4 : void 0,
            maxHeight: Math.min(320, (up ? above : below2) - 4),
            rtl
          });
        }
        place();
        function outside(e) {
          const n3 = e.target;
          if (listRef.current && listRef.current.contains(n3)) return;
          if (trigRef.current && trigRef.current.contains(n3)) return;
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
    React15.useEffect(
      function() {
        if (!open || !listRef.current || active < 0) return;
        const el = listRef.current.querySelector('[data-idx="' + active + '"]');
        if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
      },
      [open, active, pos[0] != null]
    );
    const described = [describedBy(id, props), rest["aria-describedby"]].filter(Boolean).join(" ") || void 0;
    function keep(e) {
      kept.current = Array.prototype.filter.call(e.currentTarget.options, function(o) {
        return o.selected;
      }).map(function(o) {
        return o.value;
      });
    }
    const listBoxLock = ro && native ? {
      onFocus: function(e) {
        const user = rest.onFocus;
        if (user) user(e);
        keep(e);
      },
      onPointerDown: function(e) {
        const user = rest.onPointerDown;
        if (user) user(e);
        keep(e);
      },
      onMouseDown: function(e) {
        const user = rest.onMouseDown;
        if (user) user(e);
        e.preventDefault();
        e.currentTarget.focus();
      },
      onKeyDown: function(e) {
        const user = rest.onKeyDown;
        if (user) user(e);
        const k = e.key;
        const picks = /^(Arrow(Up|Down|Left|Right)|Home|End|Page(Up|Down))$/.test(k) || k.length === 1 && !e.altKey && (!(e.ctrlKey || e.metaKey) || k === " " || k.toLowerCase() === "a");
        if (picks) e.preventDefault();
      },
      onChange: function(e) {
        const was = kept.current;
        if (!was) return;
        Array.prototype.forEach.call(e.currentTarget.options, function(o) {
          o.selected = was.indexOf(o.value) >= 0;
        });
      }
    } : {};
    const field = (child) => filter ? child : /* @__PURE__ */ React15.createElement(
      Field,
      {
        id,
        labelId: native ? void 0 : id + "-label",
        label: props.label,
        hint: props.hint,
        error: props.error,
        required: props.required,
        optional: props.optional,
        disabled: props.disabled,
        className: props.className
      },
      child
    );
    const nameId = id + "-name";
    const face = filter ? /* @__PURE__ */ React15.createElement(React15.Fragment, null, /* @__PURE__ */ React15.createElement("span", { id: nameId, className: "aura-filterselect__name", "aria-hidden": true }, filter.name), /* @__PURE__ */ React15.createElement("span", { className: "aura-filterselect__value", "aria-hidden": shown[0].label !== shown[0].full || void 0 }, shown[0].label || " "), shown[0].label !== shown[0].full ? /* @__PURE__ */ React15.createElement("span", { className: "aura-sr-only" }, shown[0].full) : null, /* @__PURE__ */ React15.createElement(Icon, { name: /* @__PURE__ */ React15.createElement(IconChevronDown, null), className: "aura-filterselect__chevron" })) : null;
    if (!live && filter)
      return /* @__PURE__ */ React15.createElement("div", { className: cx("aura-filterselect", props.disabled && "is-disabled", props.className) }, /* @__PURE__ */ React15.createElement("span", { className: "aura-filterselect__face", "aria-hidden": true, style: props.style }, face), h4(
        "select",
        Object.assign(extra, omit(rest, ["style"]), {
          ref: selMerged,
          id,
          className: "aura-filterselect__native",
          "aria-label": rest["aria-label"] || (rest["aria-labelledby"] ? void 0 : filter.name),
          "aria-describedby": described
        }),
        opts,
        props.children
      ));
    if (!live)
      return field(
        /* @__PURE__ */ React15.createElement("div", { className: cx("aura-input aura-select", props.icon && "has-icon", ro && "is-readonly") }, props.icon ? /* @__PURE__ */ React15.createElement(Icon, { name: props.icon, className: "aura-input__icon" }) : null, h4(
          "select",
          Object.assign(
            extra,
            rest,
            {
              ref: native ? ref : selMerged,
              id,
              className: "aura-input__control",
              required: props.required,
              "aria-invalid": props.error ? true : void 0,
              "aria-readonly": ro || void 0,
              "aria-describedby": described
            },
            listBoxLock
          ),
          opts,
          props.children
        ), ro ? null : /* @__PURE__ */ React15.createElement(Icon, { name: /* @__PURE__ */ React15.createElement(IconChevronDown, null), className: "aura-select__chevron" }))
      );
    const listId = id + "-list", labelId = id + "-label";
    const optId = function(i) {
      return id + "-opt-" + i;
    };
    const labelledBy = rest["aria-labelledby"] || (filter && !rest["aria-label"] ? nameId : props.label ? labelId : void 0);
    const selIndex = selRef.current ? selRef.current.selectedIndex : -1;
    const option = function(it) {
      const sel = selIndex === it.index;
      return /* @__PURE__ */ React15.createElement(
        "div",
        {
          key: it.index,
          id: optId(it.index),
          role: "option",
          "data-idx": it.index,
          "aria-selected": sel,
          "aria-disabled": it.disabled || void 0,
          className: cx(
            "aura-combo__option",
            it.index === active && "is-active",
            sel && "is-selected",
            it.disabled && "is-disabled"
          ),
          onPointerDown: function(e) {
            e.preventDefault();
          },
          onPointerMove: function() {
            if (!it.disabled && active !== it.index) activeState[1](it.index);
          },
          onClick: function() {
            choose(it);
          }
        },
        /* @__PURE__ */ React15.createElement("span", { className: "aura-combo__text" }, /* @__PURE__ */ React15.createElement("span", { className: "aura-combo__label" }, it.label)),
        sel ? /* @__PURE__ */ React15.createElement(Icon, { name: /* @__PURE__ */ React15.createElement(IconCheck, null), className: "aura-combo__check" }) : null
      );
    };
    const runs = [];
    items2[0].forEach(function(it) {
      if (it.value === "" && it.disabled) return;
      const last = runs[runs.length - 1];
      if (last && last.group === it.group) last.items.push(it);
      else runs.push({ group: it.group, items: [it] });
    });
    const popup = open ? (0, import_react_dom2.createPortal)(
      /* @__PURE__ */ React15.createElement(
        "div",
        {
          ref: listRef,
          "data-density": density,
          dir: pos[0] ? pos[0].rtl ? "rtl" : "ltr" : void 0,
          className: "aura-combo__popover aura-select__popover",
          style: pos[0] ? {
            left: pos[0].left,
            minWidth: pos[0].width,
            top: pos[0].top,
            bottom: pos[0].bottom,
            maxHeight: pos[0].maxHeight
          } : { left: -9999, top: -9999 }
        },
        /* @__PURE__ */ React15.createElement(
          "div",
          {
            id: listId,
            role: "listbox",
            "aria-labelledby": labelledBy,
            "aria-label": labelledBy ? void 0 : rest["aria-label"],
            className: "aura-combo__list"
          },
          runs.map(function(r, n3) {
            if (r.group === null) return /* @__PURE__ */ React15.createElement(React15.Fragment, { key: "r" + n3 }, r.items.map(option));
            const gid = id + "-group-" + n3;
            return /* @__PURE__ */ React15.createElement("div", { key: "r" + n3, role: "group", "aria-labelledby": gid }, /* @__PURE__ */ React15.createElement("div", { id: gid, className: "aura-select__group" }, r.group), r.items.map(option));
          })
        )
      ),
      document.body
    ) : null;
    const userFocus = rest.onFocus, userBlur = rest.onBlur, userKey = rest.onKeyDown, userClick = rest.onClick;
    return field(
      /* @__PURE__ */ React15.createElement(
        "div",
        {
          className: cx(
            filter ? "aura-filterselect" : "aura-input",
            "aura-select aura-select--custom",
            props.icon && "has-icon",
            ro && "is-readonly",
            open && "is-open",
            filter && props.disabled && "is-disabled",
            filter && props.className
          ),
          "data-invalid": props.error ? "" : void 0
        },
        props.icon && !filter ? /* @__PURE__ */ React15.createElement(Icon, { name: props.icon, className: "aura-input__icon" }) : null,
        h4(
          "select",
          Object.assign(extra, pick(rest, FORM_KEYS), {
            ref: selMerged,
            id: id + "-select",
            className: "aura-select__native",
            tabIndex: -1,
            "aria-hidden": true,
            required: props.required,
            onChange: function(e) {
              sync();
              if (props.onChange) props.onChange(e);
            },
            /* A browser focusing the <select> (the required bubble, a label click) hands focus to the button. */
            onFocus: function() {
              if (trigRef.current) trigRef.current.focus();
            },
            /* Only the blur the button reports (below): the <select>'s own, while it hands focus over, is not one. */
            onBlur: function(e) {
              if (!e.nativeEvent.isTrusted && userBlur) userBlur(e);
            }
          }),
          opts,
          props.children
        ),
        /* @__PURE__ */ React15.createElement(
          "button",
          {
            ...omit(rest, HANDLED_KEYS),
            ref: trigRef,
            type: "button",
            role: "combobox",
            form: id + "-no-form",
            className: filter ? "aura-select__trigger aura-filterselect__face" : "aura-input__control aura-select__trigger",
            disabled: props.disabled,
            tabIndex: rest.tabIndex,
            "aria-haspopup": "listbox",
            "aria-expanded": open,
            "aria-controls": open ? listId : void 0,
            "aria-activedescendant": open && active >= 0 ? optId(active) : void 0,
            id,
            "aria-label": rest["aria-label"],
            "aria-labelledby": rest["aria-labelledby"] || (filter && !rest["aria-label"] ? nameId : void 0),
            "aria-required": props.required || void 0,
            "aria-invalid": props.error ? true : void 0,
            "aria-readonly": ro || void 0,
            "aria-describedby": described,
            onFocus: function(e) {
              if (userFocus) userFocus(e);
            },
            onClick: function(e) {
              if (userClick) userClick(e);
              if (e.defaultPrevented) return;
              if (open) close(true);
              else openList();
            },
            onKeyDown: function(e) {
              if (userKey) userKey(e);
              if (!e.defaultPrevented) onKeyDown(e);
            },
            onBlur: function(e) {
              if (listRef.current && e.relatedTarget && listRef.current.contains(e.relatedTarget)) return;
              if (open) close(false);
              if (selRef.current) selRef.current.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
            }
          },
          face || /* @__PURE__ */ React15.createElement("span", { id: id + "-value", className: cx("aura-select__value", shown[0].empty && "is-placeholder") }, shown[0].label || " ")
        ),
        filter || ro ? null : /* @__PURE__ */ React15.createElement(Icon, { name: /* @__PURE__ */ React15.createElement(IconChevronDown, null), className: "aura-select__chevron" }),
        popup
      )
    );
  });

  // src/FilterSelect.tsx
  var React16 = __toESM(require_react(), 1);
  var FilterSelect = React16.forwardRef(function FilterSelect2(props, ref) {
    const onChange = props.onChange;
    const pass = Object.assign(omit(props, ["label", "allLabel", "onChange"]), {
      [FILTER_KEY]: { name: props.label, allLabel: props.allLabel },
      onChange: onChange ? function(e) {
        onChange(e.target.value);
      } : void 0
    });
    return /* @__PURE__ */ React16.createElement(Select, { ...pass, ref });
  });

  // src/RadioGroup.tsx
  var React17 = __toESM(require_react(), 1);
  var RadioGroup = React17.forwardRef(function RadioGroup2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(
      props.value,
      props.defaultValue,
      props.onChange
    );
    const name = props.name || id;
    const setRef = React17.useCallback(
      function(el) {
        if (el)
          el.focus = function(opts) {
            const r = el.querySelector('input[type="radio"]:checked') || el.querySelector('input[type="radio"]:not(:disabled)');
            if (r) r.focus(opts);
          };
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      },
      [ref]
    );
    return /* @__PURE__ */ React17.createElement(
      "fieldset",
      {
        ref: setRef,
        className: cx("aura-field aura-radio-group", props.error && "is-invalid", props.className),
        "aria-describedby": describedBy(id, props),
        "aria-invalid": props.error ? true : void 0,
        disabled: props.disabled
      },
      props.label ? /* @__PURE__ */ React17.createElement("legend", { className: "aura-field__label" }, props.label, props.required ? /* @__PURE__ */ React17.createElement("span", { className: "aura-field__req", "aria-hidden": true }, " *") : null) : null,
      /* @__PURE__ */ React17.createElement("div", { className: cx("aura-radio-group__list", props.orientation === "horizontal" && "is-horizontal") }, (props.options || []).map(function(o) {
        const v = typeof o === "object" ? o : { value: o, label: o };
        return /* @__PURE__ */ React17.createElement("label", { key: v.value, className: cx("aura-choice", v.disabled && "is-disabled") }, /* @__PURE__ */ React17.createElement(
          "input",
          {
            type: "radio",
            className: "aura-radio",
            name,
            value: v.value,
            disabled: v.disabled,
            required: props.required || void 0,
            checked: st[0] === v.value,
            onChange: function() {
              st[1](v.value);
            }
          }
        ), /* @__PURE__ */ React17.createElement("span", { className: "aura-choice__text" }, /* @__PURE__ */ React17.createElement("span", { className: "aura-choice__label" }, v.label), v.description ? /* @__PURE__ */ React17.createElement("span", { className: "aura-choice__desc" }, v.description) : null));
      })),
      props.error ? /* @__PURE__ */ React17.createElement("p", { className: "aura-field__error", id: id + "-error" }, /* @__PURE__ */ React17.createElement(Icon, { name: /* @__PURE__ */ React17.createElement(IconCircleAlert, null), size: 14 }), props.error) : props.hint ? /* @__PURE__ */ React17.createElement("p", { className: "aura-field__hint", id: id + "-hint" }, props.hint) : null
    );
  });

  // src/Switch.tsx
  var React18 = __toESM(require_react(), 1);
  var Switch = React18.forwardRef(function Switch2(props, ref) {
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(props.checked, !!props.defaultChecked, props.onChange);
    const on = !!st[0];
    const ro = !!props.readOnly && !props.disabled;
    const described = [props.description ? id + "-desc" : "", props["aria-describedby"] || ""].filter(Boolean).join(" ");
    return /* @__PURE__ */ React18.createElement(
      "div",
      {
        className: cx("aura-switch-row", props.disabled && "is-disabled", ro && "is-readonly", props.className),
        onClick: function(e) {
          const t = e.target;
          if (props.disabled || ro || t.closest("button, label, a, input")) return;
          st[1](!on);
        }
      },
      /* @__PURE__ */ React18.createElement(
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
          "aria-readonly": ro || void 0,
          "aria-describedby": described || void 0,
          className: cx("aura-switch", on && "is-on"),
          onClick: function() {
            if (!ro) st[1](!on);
          }
        },
        /* @__PURE__ */ React18.createElement("span", { className: "aura-switch__thumb" })
      ),
      props.label ? /* @__PURE__ */ React18.createElement("span", { className: "aura-choice__text" }, /* @__PURE__ */ React18.createElement("label", { className: "aura-choice__label", id: id + "-label", htmlFor: id }, props.label), props.description ? /* @__PURE__ */ React18.createElement("span", { className: "aura-choice__desc", id: id + "-desc" }, props.description) : null) : props.description ? /* @__PURE__ */ React18.createElement("span", { className: "aura-sr-only", id: id + "-desc" }, props.description) : null,
      props.icon ? /* @__PURE__ */ React18.createElement(Icon, { name: props.icon, className: "aura-switch-row__icon" }) : null
    );
  });

  // src/Combobox.tsx
  var React19 = __toESM(require_react(), 1);
  var import_react_dom3 = __toESM(require_react_dom(), 1);
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
  var Combobox = React19.forwardRef(
    function Combobox2(all, ref) {
      const props = all;
      const multi = all.multiple === true;
      const mp = all;
      const t = useStrings();
      const density = useDensity();
      const auto = uid(), id = props.id || auto, listId = id + "-list";
      const options = (props.options || []).map(toOpt);
      const groups = props.groups || [];
      groups.forEach(function(g, gi) {
        g.options.forEach(function(o) {
          options.push(Object.assign({}, toOpt(o), { __g: gi }));
        });
      });
      const custom = !multi && !!props.allowCustomValue;
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
      const openState = React19.useState(false), open = openState[0], setOpen = openState[1];
      const qState = React19.useState(null), query = qState[0], setQuery = qState[1];
      const aState = React19.useState(0), active = aState[0], setActive = aState[1];
      const posState = React19.useState(null);
      const inputRef = React19.useRef(null), inputMerged = useMergedRef(ref, inputRef), boxRef = React19.useRef(null), listRef = React19.useRef(null);
      const mounted = useMounted();
      const limit = props.limit || 200;
      const filter = props.filter || defaultFilter;
      let shown = props.onSearch || query == null ? options : options.filter(function(o) {
        return filter(o, query);
      });
      const more = shown.length > limit;
      shown = shown.slice(0, limit);
      const activeIdx = active < 0 ? query ? shown.findIndex(function(o) {
        return !o.disabled && norm(o.label) === norm(query.trim());
      }) : -1 : Math.min(active, shown.length - 1);
      function place() {
        if (!boxRef.current) return;
        const r = boxRef.current.getBoundingClientRect();
        const maxH = 320, below2 = window.innerHeight - r.bottom - 8, up = below2 < 200 && r.top > below2;
        posState[1]({
          left: r.left,
          width: r.width,
          top: up ? void 0 : r.bottom + 4,
          bottom: up ? window.innerHeight - r.top + 4 : void 0,
          maxHeight: Math.min(maxH, (up ? r.top : below2) - 8)
        });
      }
      useIsoLayoutEffect(
        function() {
          if (open) place();
        },
        [open, shown.length, values.length]
      );
      React19.useEffect(
        function() {
          if (!open) return;
          function outside(e) {
            if (boxRef.current && boxRef.current.contains(e.target)) return;
            if (listRef.current && listRef.current.contains(e.target)) return;
            if (commitRef.current()) return;
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
      React19.useEffect(
        function() {
          if (!open || !listRef.current) return;
          const el = listRef.current.querySelector('[data-idx="' + activeIdx + '"]');
          if (el && el.scrollIntoView) el.scrollIntoView({ block: "nearest" });
        },
        [activeIdx, open]
      );
      const live = props.loading ? [] : shown;
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
      const committed = React19.useRef(false);
      const commitRef = React19.useRef(function() {
        return false;
      });
      function commitTyped() {
        if (!custom || query == null || committed.current) return false;
        committed.current = true;
        const q = query.trim();
        if (!q) {
          if (props.clearable !== false) setValue(null);
        } else {
          const hit = options.filter(function(o) {
            return !o.disabled && norm(o.label) === norm(q);
          })[0];
          setValue(hit ? hit.value : q);
        }
        setQuery(null);
        setOpen(false);
        return true;
      }
      commitRef.current = commitTyped;
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
          else setActive(Math.max(0, Math.min(activeIdx + 1, live.length - 1)));
        } else if (k === "ArrowUp") {
          e.preventDefault();
          if (!open) openList();
          else setActive(Math.max(activeIdx - 1, 0));
        } else if (k === "Home" && open) {
          e.preventDefault();
          setActive(0);
        } else if (k === "End" && open) {
          e.preventDefault();
          setActive(Math.max(0, live.length - 1));
        } else if (k === "Enter") {
          if (e.nativeEvent.isComposing || e.keyCode === 229) return;
          if (open && live[activeIdx]) {
            e.preventDefault();
            choose(live[activeIdx]);
          } else if (commitTyped()) e.preventDefault();
        } else if (k === "Escape") {
          if (open) {
            e.preventDefault();
            e.stopPropagation();
            close();
          } else if (!multi && !props.readOnly && props.clearable !== false && value != null && query == null) {
            setValue(null);
          }
        } else if (k === "Backspace" && multi && !props.readOnly && !text2 && values.length) {
          setValues(values.slice(0, -1));
        } else if (k === "Tab") {
          if (custom && open && query != null && live[activeIdx]) {
            choose(live[activeIdx]);
            return;
          }
          if (commitTyped()) return;
          if (open) close();
        }
      }
      const text2 = query != null ? query : selected ? selected.label : custom && value != null ? value : "";
      const summaryId = id + "-picked";
      const optId = function(i) {
        return id + "-opt-" + i;
      };
      function renderOpt(o, i) {
        const isSel = multi ? isPicked(o.value) : !!selected && o.value === selected.value;
        const blocked = o.disabled || multi && full && !isSel;
        return /* @__PURE__ */ React19.createElement(
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
          o.icon ? /* @__PURE__ */ React19.createElement(Icon, { name: o.icon }) : null,
          /* @__PURE__ */ React19.createElement("span", { className: "aura-combo__text" }, /* @__PURE__ */ React19.createElement("span", { className: "aura-combo__label" }, o.label), o.description ? /* @__PURE__ */ React19.createElement("span", { className: "aura-combo__desc" }, o.description) : null),
          isSel ? /* @__PURE__ */ React19.createElement(Icon, { name: /* @__PURE__ */ React19.createElement(IconCheck, null), className: "aura-combo__check" }) : null
        );
      }
      function grouped(list2) {
        const out = [];
        list2.forEach(function(o, i) {
          const last = out[out.length - 1];
          if (last && last.g === o.__g) last.items.push([o, i]);
          else out.push({ g: o.__g, items: [[o, i]] });
        });
        return out;
      }
      const list = open && mounted && posState[0] ? (0, import_react_dom3.createPortal)(
        /* @__PURE__ */ React19.createElement(
          "div",
          {
            ref: listRef,
            "data-density": density,
            className: "aura-combo__popover",
            style: posState[0],
            onPointerDown: function(e) {
              e.preventDefault();
            }
          },
          live.length ? /* @__PURE__ */ React19.createElement(
            "ul",
            {
              id: listId,
              role: "listbox",
              "aria-label": props.label,
              "aria-multiselectable": multi || void 0,
              className: "aura-combo__list"
            },
            grouped(live).map(function(seg) {
              if (seg.g == null)
                return /* @__PURE__ */ React19.createElement(React19.Fragment, { key: "u" + seg.items[0][1] }, seg.items.map(function(p) {
                  return renderOpt(p[0], p[1]);
                }));
              const gid = id + "-group-" + seg.g + "-" + seg.items[0][1];
              return /* @__PURE__ */ React19.createElement("li", { key: gid, role: "group", "aria-labelledby": gid, className: "aura-combo__group" }, /* @__PURE__ */ React19.createElement("span", { id: gid, role: "presentation", className: "aura-combo__group-label" }, groups[seg.g].label), /* @__PURE__ */ React19.createElement("ul", { role: "none", className: "aura-combo__grouplist" }, seg.items.map(function(p) {
                return renderOpt(p[0], p[1]);
              })));
            })
          ) : null,
          props.loading || !live.length || more ? /* @__PURE__ */ React19.createElement("div", { className: "aura-combo__list", role: "status" }, props.loading ? /* @__PURE__ */ React19.createElement("div", { className: "aura-combo__note" }, /* @__PURE__ */ React19.createElement(Icon, { name: /* @__PURE__ */ React19.createElement(IconLoaderCircle, null), className: "aura-spin" }), props.loadingText || t.searching) : !live.length ? /* @__PURE__ */ React19.createElement("div", { className: "aura-combo__note" }, props.emptyText || t.noMatches) : /* @__PURE__ */ React19.createElement("div", { className: "aura-combo__note" }, t.keepTyping(options.length))) : null
        ),
        document.body
      ) : null;
      return /* @__PURE__ */ React19.createElement(
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
        /* @__PURE__ */ React19.createElement("div", { ref: boxRef, className: cx("aura-input aura-combo has-icon", open && "is-open", multi && "is-multi") }, /* @__PURE__ */ React19.createElement(Icon, { name: props.icon || /* @__PURE__ */ React19.createElement(IconSearch, null), className: "aura-input__icon" }), multi && picked.length ? /* @__PURE__ */ React19.createElement("span", { className: "aura-combo__chips" }, picked.map(function(o) {
          return /* @__PURE__ */ React19.createElement("span", { key: o.value, className: "aura-combo__chip" }, /* @__PURE__ */ React19.createElement("span", { className: "aura-combo__chip-label" }, o.label), props.disabled || props.readOnly ? null : /* @__PURE__ */ React19.createElement(
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
            /* @__PURE__ */ React19.createElement(Icon, { name: /* @__PURE__ */ React19.createElement(IconX, null) })
          ));
        })) : null, multi ? /* @__PURE__ */ React19.createElement("span", { id: summaryId, className: "aura-sr-only" }, picked.length ? t.selectedCount(picked.length) + ": " + picked.map(function(o) {
          return o.label;
        }).join(", ") : "") : null, props.name ? multi ? values.map(function(v) {
          return /* @__PURE__ */ React19.createElement("input", { key: v, type: "hidden", name: props.name, value: v });
        }) : /* @__PURE__ */ React19.createElement("input", { type: "hidden", name: props.name, value: value == null ? "" : value }) : null, /* @__PURE__ */ React19.createElement(
          "input",
          {
            ref: inputMerged,
            id,
            type: "text",
            role: "combobox",
            className: "aura-input__control",
            autoComplete: "off",
            "aria-expanded": open && live.length > 0,
            "aria-controls": open && live.length ? listId : void 0,
            "aria-autocomplete": "list",
            "aria-activedescendant": open && live[activeIdx] ? optId(activeIdx) : void 0,
            "aria-invalid": props.error ? true : void 0,
            "aria-describedby": [props.error ? id + "-error" : props.hint ? id + "-hint" : "", multi && picked.length ? summaryId : ""].filter(Boolean).join(" ") || void 0,
            placeholder: multi && values.length ? void 0 : props.placeholder,
            disabled: props.disabled,
            readOnly: props.readOnly,
            required: props.required && (!multi || !values.length),
            value: text2,
            onChange: function(e) {
              committed.current = false;
              setQuery(e.target.value);
              setActive(custom ? -1 : 0);
              if (!open) setOpen(true);
              if (props.onSearch) props.onSearch(e.target.value);
            },
            onClick: openList,
            onKeyDown,
            onBlur: function() {
              setTimeout(function() {
                if (listRef.current && listRef.current.contains(document.activeElement)) return;
                if (custom && document.activeElement === inputRef.current) return;
                if (commitRef.current()) return;
                setOpen(false);
                setQuery(null);
              }, 0);
            }
          }
        ), props.clearable !== false && values.length && !props.disabled && !props.readOnly ? /* @__PURE__ */ React19.createElement(
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
          /* @__PURE__ */ React19.createElement(Icon, { name: /* @__PURE__ */ React19.createElement(IconX, null) })
        ) : null, /* @__PURE__ */ React19.createElement(
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
          /* @__PURE__ */ React19.createElement(Icon, { name: /* @__PURE__ */ React19.createElement(IconChevronDown, null) })
        )),
        list
      );
    }
  );

  // src/DatePicker.tsx
  var React20 = __toESM(require_react(), 1);
  var import_react_dom4 = __toESM(require_react_dom(), 1);

  // src/dates.ts
  var ERA = /^พ\.ศ\.\s?|\s?(BE|พ\.ศ\.)$/g;
  var pad = function(n3) {
    return (n3 < 10 ? "0" : "") + n3;
  };
  function toISO(d) {
    if (!d) return null;
    const y = String(d.getFullYear());
    return ("000" + y).slice(-Math.max(4, y.length)) + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function makeDate(y, monthIndex2, day) {
    const d = new Date(2e3, 0, 1);
    d.setFullYear(y, monthIndex2, day);
    return d;
  }
  function fromISO(s) {
    if (!s) return null;
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
    if (!m) return null;
    const d = makeDate(+m[1], +m[2] - 1, +m[3]);
    return d.getMonth() === +m[2] - 1 && d.getDate() === +m[3] ? d : null;
  }
  function addDays(d, n3) {
    return makeDate(d.getFullYear(), d.getMonth(), d.getDate() + n3);
  }
  function addMonths(d, n3) {
    const t = makeDate(d.getFullYear(), d.getMonth() + n3, 1);
    const last = makeDate(t.getFullYear(), t.getMonth() + 1, 0).getDate();
    return makeDate(t.getFullYear(), t.getMonth(), Math.min(d.getDate(), last));
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
      chooseEnd: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E2A\u0E34\u0E49\u0E19\u0E2A\u0E38\u0E14",
      dateUnavailable: "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E19\u0E35\u0E49\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49 \u0E25\u0E2D\u0E07\u0E40\u0E1B\u0E34\u0E14\u0E1B\u0E0F\u0E34\u0E17\u0E34\u0E19\u0E14\u0E39\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E44\u0E14\u0E49"
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
      chooseEnd: "Choose the end date",
      dateUnavailable: "That date can't be chosen. Open the calendar to see the dates you can pick."
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
      chooseEnd: "V\xE4lj slutdatum",
      dateUnavailable: "Det datumet g\xE5r inte att v\xE4lja. \xD6ppna kalendern f\xF6r att se vilka datum som g\xE5r."
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
    const loc = o.locale || "en";
    return fmt(localeTag(loc, o.calendar || defaultCalendar(loc)), f, d).replace(ERA, "");
  }
  var MONTHS = null;
  function monthIndex(word) {
    if (!MONTHS) {
      MONTHS = {};
      ["th-TH", "en-GB", "sv-SE"].forEach(function(tag) {
        ["short", "long"].forEach(function(w) {
          for (let i = 0; i < 12; i++) {
            const n3 = new Intl.DateTimeFormat(tag, { month: w }).format(new Date(2020, i, 1)).toLowerCase().replace(/\.$/, "");
            MONTHS[n3] = i;
            if (/^[a-zåäö]/.test(n3)) MONTHS[n3.slice(0, 3)] = i;
          }
        });
      });
    }
    const k = word.toLowerCase().replace(/\.$/, "");
    return MONTHS[k] != null ? MONTHS[k] : -1;
  }
  function parseDate(text2) {
    const raw = String(text2 || "").trim();
    const gregorian = /ค\.ศ\.|\d\s*(AD|CE)\b|^\s*(AD|CE)\s/i.test(raw);
    let s = raw.replace(/พ\.ศ\.|ค\.ศ\./g, " ").replace(/(\d)\s*(BE|AD|CE)\b/gi, "$1 ").replace(/^\s*(BE|AD|CE)\s+/i, " ").replace(/\s+/g, " ").trim();
    const eight = /^(\d{2})(\d{2})(\d{4})$/.exec(s);
    if (eight) {
      const a = +eight[3] >= 1e3 ? parseDate(eight[1] + "/" + eight[2] + "/" + eight[3] + (gregorian ? " \u0E04.\u0E28." : "")) : null;
      if (a) return a;
      s = s.slice(0, 4) + "-" + s.slice(4, 6) + "-" + s.slice(6);
    }
    let m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s), y, mo, d;
    if (m) {
      y = +m[1];
      mo = +m[2];
      d = +m[3];
    } else if (m = /^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/.exec(s)) {
      d = +m[1];
      mo = +m[2];
      y = +m[3];
    } else if ((m = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(s)) && monthIndex(m[2]) >= 0) {
      d = +m[1];
      mo = monthIndex(m[2]) + 1;
      y = +m[3];
    } else return null;
    if (y >= 2400 && !gregorian) y -= 543;
    const dt = makeDate(y, mo - 1, d);
    return dt.getMonth() === mo - 1 && dt.getDate() === d ? toISO(dt) : null;
  }
  function todayIn(timeZone) {
    const now = /* @__PURE__ */ new Date();
    if (!timeZone) return toISO(now);
    try {
      return new Intl.DateTimeFormat("en-CA", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      }).format(now);
    } catch (e) {
      return toISO(now);
    }
  }

  // src/DatePicker.tsx
  function useFormatDate() {
    const ctx = useAuraLocale(), locale = ctx.locale || "en", calendar = ctx.calendar;
    return React20.useCallback(
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
  function allowedDate(iso, o) {
    const t = o.min === "today" || o.max === "today" ? o.today && fromISO(o.today) ? o.today : todayIn(o.timeZone) : "";
    const lo = o.min === "today" ? t : o.min, hi = o.max === "today" ? t : o.max;
    if (lo && fromISO(lo) && iso < lo) return false;
    if (hi && fromISO(hi) && iso > hi) return false;
    return !(o.isDateDisabled && o.isDateDisabled(iso));
  }
  var Calendar = React20.forwardRef(function Calendar2(props, ref) {
    const ctx = useAuraLocale(), locale = props.locale || ctx.locale || "en", calendar = props.calendar || ctx.calendar || defaultCalendar(locale), tag = localeTag(locale, calendar);
    const weekStart = props.weekStartsOn == null ? locale === "sv" ? 1 : 0 : props.weekStartsOn;
    const given = props.today && fromISO(props.today) ? props.today : null, zone = props.timeZone || ctx.timeZone;
    const todayISO = given || todayIn(zone);
    const today = fromISO(todayISO);
    const mounted = useMounted(), gridKey = given || mounted ? "client" : "server";
    const min = fromISO(props.min === "today" ? todayISO : props.min), max = fromISO(props.max === "today" ? todayISO : props.max);
    const start = fromISO(props.start), end = fromISO(props.end);
    function disabledAt(d) {
      return !!(min && d < min || max && d > max || props.isDateDisabled && props.isDateDisabled(toISO(d)));
    }
    function select(iso) {
      if (props.onSelect) props.onSelect(iso);
    }
    const focusState = React20.useState(function() {
      const d0 = fromISO(props.focus) || start || today;
      if (!disabledAt(d0)) return d0;
      for (let i = 1; i <= 366; i++) {
        if (!disabledAt(addDays(d0, i))) return addDays(d0, i);
        if (!disabledAt(addDays(d0, -i))) return addDays(d0, -i);
      }
      return d0;
    });
    const focusDate = focusState[0], setFocus = focusState[1];
    const viewState = React20.useState("days"), view = viewState[0], setView = viewState[1];
    const hoverState = React20.useState(null);
    const gridRef = React20.useRef(null), gridMerged = useMergedRef(ref, gridRef), moved = React20.useRef(false);
    const th2 = locale === "th";
    const dt = dateText(locale);
    function disabled(d) {
      return disabledAt(d);
    }
    React20.useEffect(function() {
      if (!moved.current) return;
      moved.current = false;
      const el = gridRef.current && gridRef.current.querySelector('[data-date="' + toISO(focusDate) + '"]');
      if (el) el.focus();
    });
    React20.useEffect(
      function() {
        if (props.autoFocus === false) return;
        const el = gridRef.current && gridRef.current.querySelector('[tabindex="0"]');
        if (el) el.focus();
      },
      [gridKey]
    );
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
      let k = e.key, n3 = null;
      if (k === "ArrowLeft") n3 = addDays(d, -1);
      else if (k === "ArrowRight") n3 = addDays(d, 1);
      else if (k === "ArrowUp") n3 = addDays(d, -7);
      else if (k === "ArrowDown") n3 = addDays(d, 7);
      else if (k === "Home") n3 = addDays(d, -((d.getDay() - weekStart + 7) % 7));
      else if (k === "End") n3 = addDays(d, 6 - (d.getDay() - weekStart + 7) % 7);
      else if (k === "PageUp") n3 = addMonths(d, e.shiftKey ? -12 : -1);
      else if (k === "PageDown") n3 = addMonths(d, e.shiftKey ? 12 : 1);
      else if (k === "Enter" || k === " ") {
        e.preventDefault();
        if (!disabled(d)) select(toISO(d));
        return;
      }
      if (n3) {
        e.preventDefault();
        move(n3);
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
      return { short: fmt(tag, { weekday: th2 ? "narrow" : "short" }, d), long: fmt(tag, { weekday: "long" }, d) };
    });
    if (view === "years") {
      const yr = focusDate.getFullYear(), base = yr - yr % 12;
      const years = [];
      for (let y = base; y < base + 12; y++) years.push(y);
      return /* @__PURE__ */ React20.createElement("div", { className: "aura-cal", ref: gridMerged, key: gridKey }, /* @__PURE__ */ React20.createElement("div", { className: "aura-cal__head" }, /* @__PURE__ */ React20.createElement(
        IconButton,
        {
          icon: /* @__PURE__ */ React20.createElement(IconChevronLeft, null),
          label: dt.prevYears,
          onClick: function() {
            setFocus(new Date(yr - 12, focusDate.getMonth(), 1));
          }
        }
      ), /* @__PURE__ */ React20.createElement(
        "button",
        {
          type: "button",
          className: "aura-cal__title",
          onClick: function() {
            setView("days");
          }
        },
        fmt(tag, { year: "numeric" }, new Date(base, 0, 1)).replace(ERA, "") + " \u2013 " + fmt(tag, { year: "numeric" }, new Date(base + 11, 0, 1)).replace(ERA, "")
      ), /* @__PURE__ */ React20.createElement(
        IconButton,
        {
          icon: /* @__PURE__ */ React20.createElement(IconChevronRight, null),
          label: dt.nextYears,
          onClick: function() {
            setFocus(new Date(yr + 12, focusDate.getMonth(), 1));
          }
        }
      )), /* @__PURE__ */ React20.createElement("div", { className: "aura-cal__years" }, years.map(function(y) {
        const d = new Date(y, focusDate.getMonth(), 1);
        return /* @__PURE__ */ React20.createElement(
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
    return /* @__PURE__ */ React20.createElement("div", { className: "aura-cal", ref: gridMerged, key: gridKey }, /* @__PURE__ */ React20.createElement("div", { className: "aura-cal__head" }, /* @__PURE__ */ React20.createElement(
      IconButton,
      {
        icon: /* @__PURE__ */ React20.createElement(IconChevronLeft, null),
        label: dt.prevMonth,
        onClick: function() {
          setFocus(addMonths(focusDate, -1));
        }
      }
    ), /* @__PURE__ */ React20.createElement(
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
      /* @__PURE__ */ React20.createElement(Icon, { name: /* @__PURE__ */ React20.createElement(IconChevronDown, null), size: 14 })
    ), /* @__PURE__ */ React20.createElement(
      IconButton,
      {
        icon: /* @__PURE__ */ React20.createElement(IconChevronRight, null),
        label: dt.nextMonth,
        onClick: function() {
          setFocus(addMonths(focusDate, 1));
        }
      }
    )), /* @__PURE__ */ React20.createElement("table", { role: "grid", className: "aura-cal__grid", "aria-label": monthTitle }, /* @__PURE__ */ React20.createElement("thead", null, /* @__PURE__ */ React20.createElement("tr", null, weekdayNames.map(function(n3, i) {
      return /* @__PURE__ */ React20.createElement("th", { key: i, scope: "col", abbr: n3.long }, /* @__PURE__ */ React20.createElement("span", { "aria-hidden": true }, n3.short));
    }))), /* @__PURE__ */ React20.createElement(
      "tbody",
      {
        onMouseLeave: function() {
          hoverState[1](null);
        }
      },
      weeks.map(function(wk, wi) {
        return /* @__PURE__ */ React20.createElement("tr", { key: wi }, wk.map(function(d) {
          const iso = toISO(d), out = d.getMonth() !== focusDate.getMonth(), dis = disabled(d);
          const isStart = same(d, start), isEnd = same(d, end) || !end && props.range && same(d, hover) && start;
          const sel = isStart || same(d, end);
          return /* @__PURE__ */ React20.createElement(
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
            /* @__PURE__ */ React20.createElement(
              "button",
              {
                type: "button",
                "data-date": iso,
                tabIndex: same(d, focusDate) ? 0 : -1,
                "aria-disabled": dis || void 0,
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
                  if (!dis) select(iso);
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
    )), props.footer === false ? null : /* @__PURE__ */ React20.createElement("div", { className: "aura-cal__foot" }, /* @__PURE__ */ React20.createElement(
      "button",
      {
        type: "button",
        className: "aura-cal__link",
        disabled: disabled(today),
        onClick: function() {
          move(today);
          select(toISO(today));
        }
      },
      dt.today
    ), props.onClear ? /* @__PURE__ */ React20.createElement("button", { type: "button", className: "aura-cal__link", onClick: props.onClear }, dt.clear) : null));
  });
  function useCalendarPopover(boxRef) {
    const openState = React20.useState(false), open = openState[0], setOpen = openState[1];
    const pos = React20.useState(null), popRef = React20.useRef(null), mounted = useMounted();
    function place() {
      if (!boxRef.current) return;
      const el = popRef.current, r = boxRef.current.getBoundingClientRect(), W = el ? el.offsetWidth : 320, H = el ? el.offsetHeight : 380;
      const up = window.innerHeight - r.bottom < H + 12 && r.top > H + 12;
      const left = Math.max(8, Math.min(r.left, window.innerWidth - W - 8));
      pos[1](up ? { left, bottom: window.innerHeight - r.top + 4 } : { left, top: r.bottom + 4 });
    }
    useIsoLayoutEffect(
      function() {
        if (open) place();
      },
      [open, !!pos[0]]
    );
    React20.useEffect(
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
    const editState = React20.useState(null), editing = editState[0], setEditing = editState[1];
    return /* @__PURE__ */ React20.createElement(
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
      /* @__PURE__ */ React20.createElement("div", { ref: props.boxRef, className: cx("aura-input aura-date", props.open && "is-open") }, /* @__PURE__ */ React20.createElement(
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
      ), props.clearable !== false && props.hasValue && !props.disabled ? /* @__PURE__ */ React20.createElement(
        "button",
        {
          type: "button",
          tabIndex: -1,
          className: "aura-combo__clear",
          "aria-label": props.clearLabel,
          onClick: props.onClear
        },
        /* @__PURE__ */ React20.createElement(Icon, { name: /* @__PURE__ */ React20.createElement(IconX, null) })
      ) : null, /* @__PURE__ */ React20.createElement(
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
        /* @__PURE__ */ React20.createElement(Icon, { name: /* @__PURE__ */ React20.createElement(IconCalendar, null) })
      ))
    );
  }
  var DatePicker = React20.forwardRef(function DatePicker2(props, ref) {
    const auto = uid(), id = props.id || auto, dialogId = id + "-cal";
    const ctx = useAuraLocale(), locale = props.locale || ctx.locale || "en", calendar = props.calendar || ctx.calendar || defaultCalendar(locale), dt = dateText(locale);
    const st = useMaybeControlled(
      props.value,
      props.defaultValue == null ? null : props.defaultValue,
      props.onChange
    );
    const boxRef = React20.useRef(null), inputRef = React20.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    const pop = useCalendarPopover(boxRef);
    const limits = {
      min: props.min,
      max: props.max,
      today: props.today,
      timeZone: props.timeZone || ctx.timeZone,
      isDateDisabled: props.isDateDisabled
    };
    const bad = React20.useState(null);
    React20.useEffect(
      function() {
        bad[1](null);
      },
      [st[0]]
    );
    function commit(text2) {
      bad[1](null);
      if (!text2.trim()) {
        st[1](null);
        return;
      }
      const iso = parseDate(text2);
      if (!iso) return;
      if (allowedDate(iso, limits)) st[1](iso);
      else bad[1](dt.dateUnavailable);
    }
    function close() {
      pop.setOpen(false);
      if (inputRef.current) inputRef.current.focus();
    }
    const cal = pop.open && pop.mounted && pop.pos ? (0, import_react_dom4.createPortal)(
      /* @__PURE__ */ React20.createElement(
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
        /* @__PURE__ */ React20.createElement(
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
              bad[1](null);
              st[1](iso);
              close();
            }
          }
        )
      ),
      document.body
    ) : null;
    return /* @__PURE__ */ React20.createElement(React20.Fragment, null, /* @__PURE__ */ React20.createElement(
      DateField,
      {
        id,
        dialogId,
        label: props.label,
        hint: props.hint,
        error: bad[0] || props.error,
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
          bad[1](null);
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
  var DateRangePicker = React20.forwardRef(
    function DateRangePicker2(props, ref) {
      const auto = uid(), id = props.id || auto, dialogId = id + "-cal";
      const ctx = useAuraLocale(), locale = props.locale || ctx.locale || "en", calendar = props.calendar || ctx.calendar || defaultCalendar(locale), dt = dateText(locale);
      const st = useMaybeControlled(
        props.value,
        props.defaultValue || { start: null, end: null },
        props.onChange
      );
      const v = st[0] || { start: null, end: null };
      const draft = React20.useState(null);
      const boxRef = React20.useRef(null), inputRef = React20.useRef(null), inputMerged = useMergedRef(ref, inputRef);
      const pop = useCalendarPopover(boxRef);
      const limits = {
        min: props.min,
        max: props.max,
        today: props.today,
        timeZone: props.timeZone || ctx.timeZone,
        isDateDisabled: props.isDateDisabled
      };
      const o = { locale, calendar };
      function show2(r) {
        if (!r.start) return "";
        if (!r.end) return formatDate(r.start, o) + " \u2013";
        return formatDate(r.start, o) + " \u2013 " + formatDate(r.end, o);
      }
      const bad = React20.useState(null);
      React20.useEffect(
        function() {
          bad[1](null);
        },
        [v.start, v.end]
      );
      function commit(text2) {
        bad[1](null);
        const parts = String(text2).split(/\s[–-]\s|\s*–\s*/);
        if (!text2.trim()) {
          st[1]({ start: null, end: null });
          return;
        }
        const a = parseDate(parts[0]), b = parseDate(parts[1] || "");
        if (a && b && !(allowedDate(a, limits) && allowedDate(b, limits))) bad[1](dt.dateUnavailable);
        else if (a && b) st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
      }
      function close() {
        pop.setOpen(false);
        draft[1](null);
        if (inputRef.current) inputRef.current.focus();
      }
      function pick2(iso) {
        if (!draft[0]) {
          draft[1](iso);
          return;
        }
        const a = draft[0], b = iso;
        bad[1](null);
        st[1](a <= b ? { start: a, end: b } : { start: b, end: a });
        close();
      }
      const cal = pop.open && pop.mounted && pop.pos ? (0, import_react_dom4.createPortal)(
        /* @__PURE__ */ React20.createElement(
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
          /* @__PURE__ */ React20.createElement("p", { className: "aura-cal__hint", "aria-live": "polite" }, draft[0] ? dt.chooseEnd : dt.chooseStart),
          /* @__PURE__ */ React20.createElement(
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
              onSelect: pick2
            }
          )
        ),
        document.body
      ) : null;
      return /* @__PURE__ */ React20.createElement(React20.Fragment, null, /* @__PURE__ */ React20.createElement(
        DateField,
        {
          id,
          dialogId,
          label: props.label,
          hint: props.hint,
          error: bad[0] || props.error,
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
            bad[1](null);
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
  var React21 = __toESM(require_react(), 1);
  var Alert = React21.forwardRef(function Alert2(props, ref) {
    const t = useStrings();
    return alertElement(
      props,
      ref,
      props.onDismiss ? /* @__PURE__ */ React21.createElement(IconButton, { icon: /* @__PURE__ */ React21.createElement(IconX, null), label: t.dismiss, className: "aura-alert__close", onClick: props.onDismiss }) : null
    );
  });

  // src/Toaster.tsx
  var React22 = __toESM(require_react(), 1);
  var import_react_dom5 = __toESM(require_react_dom(), 1);
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
  var hotkeyOrigin = /* @__PURE__ */ new WeakMap();
  function outsideToaster(el) {
    return el && el !== document.body && !el.closest(".aura-toaster") ? el : null;
  }
  function ToastItem(props) {
    const str = useStrings();
    const Link = useLinkComponent();
    const node = React22.useRef(null);
    const origin = React22.useRef(null);
    useIsoLayoutEffect(function() {
      origin.current = outsideToaster(document.activeElement);
      const el = node.current;
      return function() {
        if (!el || !el.contains(document.activeElement)) return;
        const back = [hotkeyOrigin.get(el), origin.current].filter(function(b) {
          return !!b && b.isConnected;
        })[0];
        hotkeyOrigin.delete(el);
        setTimeout(function() {
          if (back && back.isConnected && (!document.activeElement || document.activeElement === document.body))
            back.focus();
        }, 0);
      };
    }, []);
    const t = props.toast, timer = React22.useRef(null), left = React22.useRef(t.duration || 5e3), since = React22.useRef(0);
    const hover = React22.useRef(false), focused = React22.useRef(false);
    function syncFocus() {
      if (focused.current && !(node.current && node.current.contains(document.activeElement))) focused.current = false;
    }
    function start() {
      if (left.current === Infinity || timer.current) return;
      since.current = Date.now();
      timer.current = setTimeout(function() {
        toast.dismiss(t.id);
      }, left.current);
    }
    function resume() {
      syncFocus();
      if (!hover.current && !focused.current) start();
    }
    function pause() {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
        left.current -= Date.now() - since.current;
      }
    }
    React22.useEffect(
      function() {
        if (timer.current) clearTimeout(timer.current);
        timer.current = null;
        left.current = t.duration || 5e3;
        syncFocus();
        if (!hover.current && !focused.current) start();
        return function() {
          if (timer.current) clearTimeout(timer.current);
        };
      },
      [t.rev]
    );
    const rich = t.description != null && typeof t.description !== "boolean" && t.description !== "";
    const actions = (t.actions && t.actions.length ? t.actions : t.action ? [t.action] : []).slice(0, 2);
    function run(a) {
      if (a.onClick) a.onClick();
      if (a.dismiss !== false) toast.dismiss(t.id);
    }
    return /* @__PURE__ */ React22.createElement(
      "div",
      {
        ref: node,
        onKeyDown: function(e) {
          if (e.key === "Escape") {
            e.stopPropagation();
            toast.dismiss(t.id);
          }
        },
        className: cx(
          "aura-toast",
          "aura-toast--" + t.tone,
          t.loading && "is-loading",
          /* Two actions, or one beside a description, go on their own row under the text so it keeps its width. */
          (actions.length > 1 || actions.length && rich) && "has-action-row"
        ),
        role: t.tone === "danger" ? "alert" : "status",
        "aria-busy": t.loading || void 0,
        onMouseEnter: function() {
          hover.current = true;
          pause();
        },
        onMouseLeave: function() {
          hover.current = false;
          resume();
        },
        onFocus: function() {
          focused.current = true;
          pause();
        },
        onBlur: function(e) {
          if (node.current && e.relatedTarget && node.current.contains(e.relatedTarget)) return;
          focused.current = false;
          resume();
        }
      },
      /* @__PURE__ */ React22.createElement(
        Icon,
        {
          name: t.loading ? /* @__PURE__ */ React22.createElement(IconLoaderCircle, null) : React22.createElement(ALERT_ICON[t.tone] || IconInfo),
          className: cx("aura-toast__icon", t.loading && "aura-spin")
        }
      ),
      /* @__PURE__ */ React22.createElement("div", { className: "aura-toast__body" }, /* @__PURE__ */ React22.createElement("p", { className: "aura-toast__title" }, t.title), rich ? /* @__PURE__ */ React22.createElement("div", { className: "aura-toast__text" }, t.description) : null),
      actions.length ? /* @__PURE__ */ React22.createElement("div", { className: "aura-toast__actions" }, actions.map(function(a, i) {
        return a.href ? /* @__PURE__ */ React22.createElement(
          Link,
          {
            key: i,
            href: a.href,
            className: "aura-toast__action",
            onClick: function(e) {
              if (plainClick(e)) run(a);
              else if (a.onClick) a.onClick();
            }
          },
          a.label
        ) : /* @__PURE__ */ React22.createElement(
          "button",
          {
            key: i,
            type: "button",
            className: "aura-toast__action",
            onClick: function() {
              run(a);
            }
          },
          a.label
        );
      })) : null,
      /* @__PURE__ */ React22.createElement(
        IconButton,
        {
          icon: /* @__PURE__ */ React22.createElement(IconX, null),
          label: str.dismissToast,
          className: "aura-toast__close",
          onClick: function() {
            toast.dismiss(t.id);
          }
        }
      )
    );
  }
  function hotkeyMatcher(spec) {
    const parts = spec.split("+").map(function(p) {
      return p.trim().toLowerCase();
    });
    const key = parts[parts.length - 1] || "";
    const code = /^[a-z]$/.test(key) ? "Key" + key.toUpperCase() : /^[0-9]$/.test(key) ? "Digit" + key : null;
    const want = function(m) {
      return parts.indexOf(m) >= 0 && parts.indexOf(m) < parts.length - 1;
    };
    return function(e) {
      if (e.altKey !== want("alt") || e.ctrlKey !== want("ctrl") || e.shiftKey !== want("shift") || e.metaKey !== (want("meta") || want("cmd")))
        return false;
      return code ? e.code === code : e.key.toLowerCase() === key;
    };
  }
  function Toaster(props = {}) {
    const t = useStrings();
    const mounted = useMounted();
    const s = React22.useState(toastState.list);
    React22.useEffect(function() {
      toastState.subs.push(s[1]);
      s[1](toastState.list.slice());
      return function() {
        toastState.subs = toastState.subs.filter(function(f) {
          return f !== s[1];
        });
      };
    }, []);
    const region = React22.useRef(null);
    const hotkey = props.hotkey === void 0 ? "Alt+T" : props.hotkey;
    React22.useEffect(
      function() {
        if (!hotkey) return;
        const match = hotkeyMatcher(hotkey);
        function onKey(e) {
          if (!e.key || e.repeat || e.isComposing || !match(e) || !region.current) return;
          const el = e.target;
          const editable = !!el && (el.isContentEditable || /^(INPUT|TEXTAREA)$/.test(el.tagName || ""));
          const mac = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
          if (editable && mac && e.altKey && !e.ctrlKey && !e.metaKey && e.key.length === 1) return;
          const items2 = region.current.querySelectorAll(".aura-toast");
          const last = items2[items2.length - 1];
          if (!last) return;
          const target = last.querySelector(".aura-toast__action") || last.querySelector("button");
          if (!target) return;
          e.preventDefault();
          const from = outsideToaster(document.activeElement);
          if (from) hotkeyOrigin.set(last, from);
          target.focus();
        }
        document.addEventListener("keydown", onKey);
        return function() {
          document.removeEventListener("keydown", onKey);
        };
      },
      [hotkey]
    );
    if (!mounted) return null;
    const pos = props.position || "bottom";
    const offset = props.offset;
    return (0, import_react_dom5.createPortal)(
      /* @__PURE__ */ React22.createElement(
        "div",
        {
          ref: region,
          className: cx("aura-toaster", pos.indexOf("top") === 0 && "is-top", /center$/.test(pos) && "is-center"),
          style: offset != null ? { "--aura-toaster-offset": typeof offset === "number" ? offset + "px" : offset } : void 0,
          role: "region",
          "aria-live": "polite",
          "aria-label": hotkey ? t.notifications + " (" + hotkey + ")" : t.notifications,
          "aria-keyshortcuts": hotkey || void 0
        },
        s[0].map(function(t2) {
          return /* @__PURE__ */ React22.createElement(ToastItem, { key: t2.id, toast: t2 });
        })
      ),
      document.body
    );
  }

  // src/PasswordField.tsx
  var React23 = __toESM(require_react(), 1);
  var PasswordField = React23.forwardRef(function PasswordField2(props, ref) {
    const t = useStrings();
    const shown = React23.useState(false);
    const rest = omit(props, ["toggle", "className"]);
    return /* @__PURE__ */ React23.createElement(
      TextField,
      {
        autoComplete: "current-password",
        ...rest,
        ref,
        type: shown[0] ? "text" : "password",
        spellCheck: false,
        autoCapitalize: "none",
        className: cx("aura-password", props.className),
        suffix: props.toggle === false ? void 0 : /* @__PURE__ */ React23.createElement(
          IconButton,
          {
            icon: shown[0] ? /* @__PURE__ */ React23.createElement(IconEyeOff, null) : /* @__PURE__ */ React23.createElement(IconEye, null),
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
  var React24 = __toESM(require_react(), 1);
  function items(errors) {
    if (Array.isArray(errors)) return errors;
    const out = [];
    function walk(e, path, depth) {
      if (!e || typeof e !== "object" || depth > 8) return;
      const o = e;
      if (o.message) out.push({ field: path, message: o.message });
      for (const k in o) {
        if (k === "ref" || k === "type" || k === "types" || k === "message") continue;
        walk(o[k], path ? path + "." + k : k, depth + 1);
      }
    }
    walk(errors, "", 0);
    return out;
  }
  function fieldElement(field) {
    if (typeof document === "undefined") return null;
    const byId = document.getElementById(field);
    if (byId) return byId;
    const named = document.querySelector('[name="' + field.replace(/"/g, '\\"') + '"]');
    if (named && named.getAttribute("type") === "hidden") {
      const box = named.closest(".aura-field") || named.parentElement;
      return box && box.querySelector(
        'input:not([type="hidden"]), [role="combobox"], select, textarea, button:not([tabindex="-1"])'
      ) || named;
    }
    return named;
  }
  var FormErrorSummary = React24.forwardRef(
    function FormErrorSummary2(props, ref) {
      const t = useStrings();
      const auto = uid(), id = props.id || auto;
      const list = items(props.errors);
      const box = React24.useRef(null);
      const keyed = props.focusKey !== void 0;
      const lastKey = React24.useRef(null), armed = React24.useRef(false), hadErrors = React24.useRef(false);
      const has = list.length > 0;
      React24.useEffect(
        function() {
          const appeared = has && !hadErrors.current;
          hadErrors.current = has;
          if (!keyed) {
            lastKey.current = null;
            if (appeared && box.current) box.current.focus();
            return;
          }
          if (!lastKey.current) {
            lastKey.current = { v: props.focusKey };
            armed.current = has;
          } else if (!Object.is(lastKey.current.v, props.focusKey)) {
            lastKey.current = { v: props.focusKey };
            armed.current = true;
          }
          if (armed.current && has && box.current) {
            armed.current = false;
            box.current.focus();
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [has, props.focusKey, keyed]
      );
      React24.useEffect(
        function() {
          if (!keyed) return;
          function disarm() {
            armed.current = false;
          }
          const events = ["input", "change", "keydown", "pointerdown"];
          events.forEach(function(n3) {
            document.addEventListener(n3, disarm, true);
          });
          return function() {
            events.forEach(function(n3) {
              document.removeEventListener(n3, disarm, true);
            });
          };
        },
        [keyed]
      );
      if (!list.length) return null;
      return /* @__PURE__ */ React24.createElement(
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
        /* @__PURE__ */ React24.createElement(Icon, { name: /* @__PURE__ */ React24.createElement(IconCircleAlert, null), className: "aura-alert__icon" }),
        /* @__PURE__ */ React24.createElement("div", { className: "aura-alert__body" }, /* @__PURE__ */ React24.createElement("h2", { className: "aura-alert__title", id: id + "-title" }, props.title || t.errorSummary(list.length)), /* @__PURE__ */ React24.createElement("ul", { className: "aura-error-summary__list" }, list.map(function(e) {
          return /* @__PURE__ */ React24.createElement("li", { key: e.field }, /* @__PURE__ */ React24.createElement(
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
  var React26 = __toESM(require_react(), 1);

  // src/Tag.tsx
  var React25 = __toESM(require_react(), 1);
  function textOf2(node) {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(textOf2).join("");
    if (React25.isValidElement(node)) {
      const p = node.props;
      return p["aria-hidden"] === true || p["aria-hidden"] === "true" ? "" : textOf2(p.children);
    }
    return "";
  }
  var Tag = React25.forwardRef(function Tag2(props, ref) {
    const t = useStrings();
    const selectable = props.onClick != null || props.selected != null;
    const rest = omit(props, ["onRemove", "selected", "icon", "className", "children", "disabled", "removeLabel"]);
    const inner = [
      props.icon ? /* @__PURE__ */ React25.createElement(Icon, { key: "i", name: props.icon, size: 14 }) : null,
      /* @__PURE__ */ React25.createElement("span", { key: "t", className: "aura-tag__text" }, props.children)
    ];
    if (selectable) {
      return /* @__PURE__ */ React25.createElement(
        "button",
        {
          ...rest,
          ref,
          type: "button",
          "aria-pressed": !!props.selected,
          disabled: props.disabled,
          className: cx("aura-tag is-selectable", props.selected && "is-selected", props.className)
        },
        props.selected ? /* @__PURE__ */ React25.createElement(Icon, { name: /* @__PURE__ */ React25.createElement(IconCheck, null), size: 14 }) : inner[0],
        inner[1]
      );
    }
    const name = props.onRemove && !props.removeLabel ? textOf2(props.children).replace(/\s+/g, " ").trim() : "";
    if (props.onRemove && !props.disabled && !props.removeLabel && !name)
      devWarnOnce(
        "tag-remove-label",
        'Tag: the remove button has no name \u2014 its children have no text. Pass removeLabel (e.g. "Remove Acme AB").'
      );
    return /* @__PURE__ */ React25.createElement("span", { ...rest, ref, className: cx("aura-tag", props.disabled && "is-disabled", props.className) }, inner, props.onRemove && !props.disabled ? /* @__PURE__ */ React25.createElement(
      "button",
      {
        type: "button",
        className: "aura-tag__remove",
        "aria-label": props.removeLabel || t.remove(name),
        onClick: props.onRemove
      },
      /* @__PURE__ */ React25.createElement(Icon, { name: /* @__PURE__ */ React25.createElement(IconX, null), size: 12 })
    ) : null);
  });

  // src/FilterBar.tsx
  var FilterBar = React26.forwardRef(function FilterBar2(props, ref) {
    const t = useStrings();
    const id = uid();
    const hasSearch = !!props.onSearchChange;
    const draft = React26.useState(props.search || "");
    const timer = React26.useRef(null);
    const sent = React26.useRef(props.search || "");
    const onChange = React26.useRef(props.onSearchChange);
    onChange.current = props.onSearchChange;
    React26.useEffect(
      function() {
        if ((props.search || "") !== sent.current) {
          sent.current = props.search || "";
          draft[1](props.search || "");
        }
      },
      [props.search]
    );
    React26.useEffect(function() {
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
    return /* @__PURE__ */ React26.createElement(
      "div",
      {
        ref,
        role: "region",
        "aria-label": props.label || t.filters,
        className: cx(
          "aura-filterbar",
          props.searchGrow && "aura-filterbar--grow",
          props.controlsLayout === "fill" && "aura-filterbar--fill",
          props.stackBelow === "lg" && "aura-filterbar--stack-lg",
          props.className
        )
      },
      /* @__PURE__ */ React26.createElement("div", { className: "aura-filterbar__row" }, hasSearch ? /* @__PURE__ */ React26.createElement("div", { className: "aura-input has-icon aura-filterbar__search" }, /* @__PURE__ */ React26.createElement(Icon, { name: /* @__PURE__ */ React26.createElement(IconSearch, null), className: "aura-input__icon" }), /* @__PURE__ */ React26.createElement(
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
      ), draft[0] ? /* @__PURE__ */ React26.createElement(
        IconButton,
        {
          icon: /* @__PURE__ */ React26.createElement(IconX, null),
          label: t.clear((props.searchLabel || t.search).toLowerCase()),
          className: "aura-filterbar__clear-search",
          onClick: function() {
            draft[1]("");
            send("");
          }
        }
      ) : null) : null, props.children ? /* @__PURE__ */ React26.createElement("div", { className: "aura-filterbar__controls" }, props.children) : null, /* @__PURE__ */ React26.createElement("span", { className: "aura-filterbar__spacer" }), count != null ? /* @__PURE__ */ React26.createElement("span", { className: "aura-filterbar__count", "aria-live": "polite" }, count) : null, props.actions ? /* @__PURE__ */ React26.createElement("div", { className: "aura-filterbar__actions" }, props.actions) : null),
      filters.length || props.onClearAll && anything ? /* @__PURE__ */ React26.createElement("div", { className: "aura-filterbar__chips" }, filters.map(function(f) {
        return /* @__PURE__ */ React26.createElement(Tag, { key: f.id, onRemove: f.onRemove }, f.label);
      }), props.onClearAll && anything ? /* @__PURE__ */ React26.createElement(
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
  var React28 = __toESM(require_react(), 1);
  var import_react_dom6 = __toESM(require_react_dom(), 1);

  // src/useModal.tsx
  var React27 = __toESM(require_react(), 1);
  var locks = 0;
  var savedOverflow = "";
  function lockScroll() {
    const body = document.body;
    if (locks === 0) savedOverflow = body.style.overflow;
    locks++;
    body.style.overflow = "hidden";
    let done = false;
    return function() {
      if (done) return;
      done = true;
      locks--;
      if (locks === 0) body.style.overflow = savedOverflow;
    };
  }
  function tabbable(el) {
    const all = Array.prototype.filter.call(el.querySelectorAll(FOCUSABLE), function(c) {
      return c.tabIndex >= 0;
    });
    const shown = all.filter(function(c) {
      return c.getClientRects().length > 0;
    });
    return shown.length ? shown : all;
  }
  function useModal(open, ref, opts) {
    const mounted = useMounted();
    const prev = React27.useRef(null);
    const o = opts || {};
    const latest = React27.useRef(o);
    latest.current = o;
    React27.useEffect(
      function() {
        if (!open || !mounted) return;
        prev.current = document.activeElement;
        const unlock = lockScroll();
        const el = ref.current;
        const firstIn = function(scope) {
          if (!scope || !el) return null;
          const sel = FOCUSABLE.split(",").map(function(s) {
            return scope + " " + s;
          }).join(",");
          const list = el.querySelectorAll(sel);
          for (let i = 0; i < list.length; i++)
            if (list[i].tabIndex >= 0 && list[i].getClientRects().length > 0) return list[i];
          return null;
        };
        const target = el && (el.querySelector("[data-autofocus]") || firstIn(o.bodySelector) || firstIn(o.footSelector) || el);
        if (target && o.autoFocus !== false) target.focus();
        return function() {
          unlock();
          const l = latest.current;
          const ff = l.finalFocus;
          const to = ff ? typeof ff === "function" ? ff() : ff.current : null;
          const back = to && to.isConnected ? to : prev.current;
          if (back && back.focus) back.focus();
          if (l.onCloseComplete) l.onCloseComplete();
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
      if (e.key !== "Tab" || !ref.current || e.defaultPrevented) return;
      if (!ref.current.contains(e.target)) return;
      const list = tabbable(ref.current);
      if (!list.length) {
        e.preventDefault();
        return;
      }
      const first = list[0], last = list[list.length - 1], active = document.activeElement, stray = active === ref.current;
      if (e.shiftKey && (active === first || stray)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || stray)) {
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
    const box = React28.useRef(null);
    const input = React28.useRef(null);
    const qState = React28.useState(""), act = React28.useState(null);
    const query = props.query !== void 0 ? props.query : qState[0];
    function setQuery(v) {
      if (props.query === void 0) qState[1](v);
      if (props.onQueryChange) props.onQueryChange(v);
    }
    const openRef = React28.useRef(props.open);
    openRef.current = props.open;
    const close = function() {
      props.onOpenChange(false);
    };
    const modal = useModal(props.open, box, { onEscape: close });
    React28.useEffect(
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
    React28.useEffect(
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
    const flat2 = [];
    groups.forEach(function(g) {
      g.items.forEach(function(it) {
        flat2.push(it);
      });
    });
    const enabled = flat2.map(function(it, i2) {
      return it.disabled ? -1 : i2;
    }).filter(function(i2) {
      return i2 >= 0;
    });
    const byId = act[0] == null ? -1 : flat2.findIndex(function(it) {
      return it.id === act[0];
    });
    const active = enabled.indexOf(byId) >= 0 ? byId : enabled.length ? enabled[0] : -1;
    const optId = function(i2) {
      return id + "-o" + i2;
    };
    React28.useEffect(
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
      let n3;
      if (dir === "first") n3 = 0;
      else if (dir === "last") n3 = enabled.length - 1;
      else n3 = (at + dir + enabled.length) % enabled.length;
      act[1](flat2[enabled[n3]].id);
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
        if (e.nativeEvent.isComposing || e.keyCode === 229) return;
        e.preventDefault();
        if (active >= 0) run(flat2[active]);
      }
    }
    if (!modal.ready) return null;
    let i = -1;
    return (0, import_react_dom6.createPortal)(
      /* @__PURE__ */ React28.createElement(
        "div",
        {
          className: "aura-dialog-layer aura-command-layer",
          "data-density": density,
          onKeyDown: function(e) {
            modal.onKeyDown(e);
            e.stopPropagation();
          }
        },
        /* @__PURE__ */ React28.createElement("div", { className: "aura-scrim", onClick: close, "aria-hidden": true }),
        /* @__PURE__ */ React28.createElement(
          "div",
          {
            ref: box,
            role: "dialog",
            "aria-modal": true,
            "aria-label": props.label || t.commandMenu,
            tabIndex: -1,
            className: cx("aura-command", props.className)
          },
          /* @__PURE__ */ React28.createElement("div", { className: "aura-command__search" }, /* @__PURE__ */ React28.createElement(Icon, { name: /* @__PURE__ */ React28.createElement(IconSearch, null), className: "aura-command__search-icon" }), /* @__PURE__ */ React28.createElement(
            "input",
            {
              ref: input,
              "data-autofocus": "",
              type: "text",
              role: "combobox",
              "aria-expanded": flat2.length > 0,
              "aria-controls": flat2.length ? listId : void 0,
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
          ), /* @__PURE__ */ React28.createElement("kbd", { className: "aura-command__kbd" }, "Esc")),
          /* @__PURE__ */ React28.createElement("div", { className: "aura-command__list", "aria-busy": props.loading || void 0 }, props.loading ? /* @__PURE__ */ React28.createElement("div", { className: "aura-command__loading" }, /* @__PURE__ */ React28.createElement(Icon, { name: /* @__PURE__ */ React28.createElement(IconLoaderCircle, null), className: "aura-spin" }), t.searching) : null, !flat2.length ? props.loading ? null : /* @__PURE__ */ React28.createElement("div", { className: "aura-command__empty" }, props.empty != null ? props.empty : props.emptyText || t.noMatches) : /* @__PURE__ */ React28.createElement(
            "div",
            {
              id: listId,
              role: "listbox",
              "aria-label": props.label || t.commandMenu,
              "aria-busy": props.loading || void 0
            },
            groups.map(function(g, gi) {
              const gid = id + "-g" + gi;
              return /* @__PURE__ */ React28.createElement(
                "div",
                {
                  key: g.name || gi,
                  role: "group",
                  "aria-labelledby": g.name ? gid : void 0,
                  className: "aura-command__group"
                },
                g.name ? /* @__PURE__ */ React28.createElement("div", { className: "aura-command__heading", id: gid, role: "presentation" }, g.name) : null,
                g.items.map(function(it) {
                  i++;
                  const n3 = i;
                  return /* @__PURE__ */ React28.createElement(
                    "div",
                    {
                      key: it.id,
                      id: optId(n3),
                      role: "option",
                      "aria-selected": n3 === active,
                      "aria-disabled": it.disabled || void 0,
                      className: cx(
                        "aura-command__item",
                        n3 === active && "is-active",
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
                    it.icon ? /* @__PURE__ */ React28.createElement(Icon, { name: it.icon }) : null,
                    /* @__PURE__ */ React28.createElement("span", { className: "aura-command__text" }, /* @__PURE__ */ React28.createElement("span", { className: "aura-command__label" }, it.label), it.description ? /* @__PURE__ */ React28.createElement("span", { className: "aura-command__desc" }, it.description) : null),
                    it.shortcut ? /* @__PURE__ */ React28.createElement("kbd", { className: "aura-command__kbd" }, it.shortcut) : null
                  );
                })
              );
            })
          )),
          /* @__PURE__ */ React28.createElement("span", { className: "aura-sr-only", role: "status" }, props.loading ? t.searching : query && !flat2.length ? t.noMatches : props.loading === false && query ? t.results(flat2.length) : ""),
          /* @__PURE__ */ React28.createElement("div", { className: "aura-command__foot", "aria-hidden": true }, t.commandHint, /* @__PURE__ */ React28.createElement("span", { className: "aura-command__mod" }, isMac() ? "\u2318K" : "Ctrl K"))
        )
      ),
      document.body
    );
  }

  // src/Tooltip.tsx
  var React29 = __toESM(require_react(), 1);
  var import_react_dom7 = __toESM(require_react_dom(), 1);
  var Tooltip = React29.forwardRef(function Tooltip2(props, ref) {
    const id = uid(), st = React29.useState(false), open = props.open !== void 0 ? props.open : st[0], set = st[1];
    const anchor = React29.useRef(null), anchorMerged = useMergedRef(ref, anchor), tip = React29.useRef(null), timer = React29.useRef(void 0);
    const pos = React29.useState(null), mounted = useMounted();
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
    function hideSoon() {
      clearTimeout(timer.current);
      timer.current = setTimeout(function() {
        set(false);
      }, 120);
    }
    React29.useEffect(function() {
      return function() {
        clearTimeout(timer.current);
      };
    }, []);
    function place() {
      if (!anchor.current || !tip.current) return;
      const r = anchor.current.getBoundingClientRect(), t = tip.current.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight, gap = 8, m = 8;
      let side = props.side || "top";
      if (side === "top" && r.top - t.height - gap < m && r.bottom + gap + t.height <= vh - m) side = "bottom";
      else if (side === "bottom" && r.bottom + gap + t.height > vh - m && r.top - t.height - gap >= m) side = "top";
      else if (side === "left" && r.left - t.width - gap < m && r.right + gap + t.width <= vw - m) side = "right";
      else if (side === "right" && r.right + gap + t.width > vw - m && r.left - t.width - gap >= m) side = "left";
      const clampX = function(x) {
        return Math.max(m, Math.min(x, vw - t.width - m));
      };
      const clampY = function(y) {
        return Math.max(m, Math.min(y, vh - t.height - m));
      };
      let top, left;
      if (side === "top" || side === "bottom") {
        top = clampY(side === "top" ? r.top - t.height - gap : r.bottom + gap);
        left = clampX(r.left + r.width / 2 - t.width / 2);
      } else {
        left = side === "left" ? r.left - t.width - gap : r.right + gap;
        left = clampX(left);
        top = clampY(r.top + r.height / 2 - t.height / 2);
      }
      pos[1]({ top, left });
    }
    useIsoLayoutEffect(
      function() {
        if (!open) return;
        place();
        window.addEventListener("scroll", place, true);
        window.addEventListener("resize", place);
        return function() {
          window.removeEventListener("scroll", place, true);
          window.removeEventListener("resize", place);
        };
      },
      [open, mounted]
    );
    React29.useEffect(
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
    const child = React29.Children.only(props.children);
    const trigger = /* @__PURE__ */ React29.createElement(
      "span",
      {
        ref: anchorMerged,
        className: "aura-tooltip-anchor",
        onMouseEnter: function() {
          show2(false);
        },
        onMouseLeave: hideSoon,
        onFocus: function() {
          show2(true);
        },
        onBlur: hide
      },
      React29.cloneElement(child, { "aria-describedby": open ? id : child.props["aria-describedby"] })
    );
    return /* @__PURE__ */ React29.createElement(React29.Fragment, null, trigger, open && mounted ? (0, import_react_dom7.createPortal)(
      /* @__PURE__ */ React29.createElement(
        "div",
        {
          ref: tip,
          id,
          role: "tooltip",
          onMouseEnter: function() {
            clearTimeout(timer.current);
          },
          onMouseLeave: hideSoon,
          className: "aura-tooltip aura-tooltip--hoverable",
          style: { top: pos[0] ? pos[0].top : -9999, left: pos[0] ? pos[0].left : -9999 }
        },
        props.content
      ),
      document.body
    ) : null);
  });

  // src/Dialog.tsx
  var React30 = __toESM(require_react(), 1);
  var import_react_dom8 = __toESM(require_react_dom(), 1);
  var DialogClose = React30.createContext(null);
  function useDialogClose() {
    return React30.useContext(DialogClose) || function() {
    };
  }
  var Dialog = React30.forwardRef(function Dialog2(props, ref) {
    const t = useStrings();
    const density = useDensity();
    const own = React30.useRef(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
    const openState = useMaybeControlled(props.open, false, null), open = openState[0];
    if (props.open === void 0 && !props.trigger)
      devWarnOnce("dialog-no-open", "Dialog has neither `open` nor `trigger`, so it can never open. Pass one of them.");
    const trigId = uid();
    function closeNow() {
      if (props.open === void 0) openState[1](false);
      if (props.onClose) props.onClose();
    }
    function close() {
      if (props.dismissible === false) return;
      closeNow();
    }
    const scrimCloses = props.dismissible !== false && (props.dismissOnScrim !== void 0 ? props.dismissOnScrim : props.role !== "alertdialog");
    const modal = useModal(open, own, {
      autoFocus: props.autoFocus,
      onEscape: close,
      bodySelector: ".aura-dialog__body",
      footSelector: ".aura-dialog__foot",
      /* With a trigger, focus goes back to it even where a click doesn't focus buttons (Safari). */
      finalFocus: props.trigger ? function() {
        const ff = props.finalFocus;
        const to = ff ? typeof ff === "function" ? ff() : ff.current : null;
        return to || document.querySelector('[data-aura-trigger="' + trigId + '"]');
      } : props.finalFocus,
      onCloseComplete: props.onCloseComplete
    });
    const trig = props.trigger;
    const trigger = trig && React30.isValidElement(trig) ? React30.cloneElement(trig, {
      "aria-haspopup": "dialog",
      "aria-expanded": open,
      "data-aura-trigger": trigId,
      onClick: function(e) {
        const own2 = trig.props.onClick;
        if (own2) own2(e);
        if (e.defaultPrevented) return;
        if (props.open === void 0) openState[1](true);
        if (props.onOpen) props.onOpen();
      }
    }) : null;
    if (!modal.ready) return trigger;
    const rest = omit(props, [
      "open",
      "onClose",
      "title",
      "description",
      "children",
      "footer",
      "size",
      "dismissible",
      "dismissOnScrim",
      "role",
      "autoFocus",
      "className",
      "trigger",
      "onOpen",
      "finalFocus",
      "onCloseComplete",
      "aria-labelledby",
      "aria-describedby",
      "aria-modal"
    ]);
    const panel = (0, import_react_dom8.createPortal)(
      /* @__PURE__ */ React30.createElement("div", { className: "aura-dialog-layer", "data-density": density, onKeyDown: modal.onKeyDown }, /* @__PURE__ */ React30.createElement(
        "div",
        {
          className: "aura-scrim",
          onClick: scrimCloses ? close : void 0,
          onMouseDown: scrimCloses ? void 0 : function(e) {
            e.preventDefault();
          },
          "aria-hidden": true
        }
      ), /* @__PURE__ */ React30.createElement(
        "div",
        {
          ...rest,
          ref: merged,
          role: props.role || "dialog",
          "aria-modal": true,
          "aria-labelledby": titleId,
          "aria-describedby": cx(props.description ? descId : "", props["aria-describedby"]) || void 0,
          tabIndex: -1,
          className: cx("aura-dialog", "aura-dialog--" + (props.size || "md"), props.className)
        },
        /* @__PURE__ */ React30.createElement("div", { className: "aura-dialog__head" }, /* @__PURE__ */ React30.createElement("h2", { className: "aura-dialog__title", id: titleId }, props.title), props.dismissible !== false ? /* @__PURE__ */ React30.createElement(IconButton, { icon: /* @__PURE__ */ React30.createElement(IconX, null), label: t.close, className: "aura-dialog__close", onClick: close }) : null),
        props.description ? /* @__PURE__ */ React30.createElement("p", { className: "aura-dialog__desc", id: descId }, props.description) : null,
        /* @__PURE__ */ React30.createElement(DialogClose.Provider, { value: closeNow }, props.children ? /* @__PURE__ */ React30.createElement("div", { className: "aura-dialog__body" }, props.children) : null, props.footer ? /* @__PURE__ */ React30.createElement("div", { className: "aura-dialog__foot" }, props.footer) : null)
      )),
      document.body
    );
    return trigger ? /* @__PURE__ */ React30.createElement(React30.Fragment, null, trigger, panel) : panel;
  });
  var Drawer = React30.forwardRef(function Drawer2(props, ref) {
    const t = useStrings();
    const density = useDensity();
    const own = React30.useRef(null), merged = useMergedRef(ref, own), titleId = uid(), descId = uid();
    function close() {
      if (props.dismissible !== false && props.onClose) props.onClose();
    }
    const modal = useModal(props.open, own, {
      autoFocus: props.autoFocus,
      onEscape: close,
      bodySelector: ".aura-drawer__body",
      footSelector: ".aura-drawer__foot",
      finalFocus: props.finalFocus,
      onCloseComplete: props.onCloseComplete
    });
    if (!modal.ready) return null;
    const side = props.side === "left" ? "left" : "right";
    const rest = omit(props, [
      "open",
      "onClose",
      "side",
      "size",
      "title",
      "description",
      "children",
      "footer",
      "dismissible",
      "dismissOnScrim",
      "autoFocus",
      "aria-label",
      "aria-describedby",
      "aria-labelledby",
      "className",
      "closeLabel",
      "closeProps",
      "finalFocus",
      "onCloseComplete"
    ]);
    const drawerScrimCloses = props.dismissible !== false && props.dismissOnScrim !== false;
    return (0, import_react_dom8.createPortal)(
      /* @__PURE__ */ React30.createElement("div", { className: "aura-dialog-layer aura-drawer-layer", "data-density": density, onKeyDown: modal.onKeyDown }, /* @__PURE__ */ React30.createElement(
        "div",
        {
          className: "aura-scrim",
          onClick: drawerScrimCloses ? close : void 0,
          onMouseDown: !drawerScrimCloses ? function(e) {
            e.preventDefault();
          } : void 0,
          "aria-hidden": true
        }
      ), /* @__PURE__ */ React30.createElement(
        "div",
        {
          ...rest,
          ref: merged,
          role: "dialog",
          "aria-modal": true,
          "aria-labelledby": props.title ? titleId : props["aria-labelledby"],
          "aria-label": props.title ? void 0 : props["aria-label"],
          "aria-describedby": cx(props.description ? descId : "", props["aria-describedby"]) || void 0,
          tabIndex: -1,
          className: cx("aura-drawer", "aura-drawer--" + side, "aura-drawer--" + (props.size || "md"), props.className)
        },
        props.title || props.dismissible !== false ? /* @__PURE__ */ React30.createElement("div", { className: "aura-drawer__head" }, props.title ? /* @__PURE__ */ React30.createElement("h2", { className: "aura-drawer__title", id: titleId }, props.title) : /* @__PURE__ */ React30.createElement("span", { style: { flex: 1 } }), props.dismissible !== false ? /* @__PURE__ */ React30.createElement(
          IconButton,
          {
            ...props.closeProps,
            icon: /* @__PURE__ */ React30.createElement(IconX, null),
            label: props.closeLabel || t.close,
            onClick: function(e) {
              const own2 = props.closeProps && props.closeProps.onClick;
              if (own2) own2(e);
              if (!e.defaultPrevented) close();
            }
          }
        ) : null) : null,
        props.description ? /* @__PURE__ */ React30.createElement("p", { className: "aura-drawer__desc", id: descId }, props.description) : null,
        /* @__PURE__ */ React30.createElement("div", { className: "aura-drawer__body" }, props.children),
        props.footer ? /* @__PURE__ */ React30.createElement("div", { className: "aura-drawer__foot" }, props.footer) : null
      )),
      document.body
    );
  });

  // src/DataTable.tsx
  var React31 = __toESM(require_react(), 1);
  var import_react_dom9 = __toESM(require_react_dom(), 1);
  var BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };
  var DEFAULT_COLUMNS = [
    { key: "id", label: "ID", width: 96, mono: true },
    { key: "name", label: "NAME", width: 160 },
    { key: "status", label: "STATUS", width: 112, pill: true },
    { key: "owner", label: "OWNER" }
  ];
  var SKELETON_WIDTHS = ["72%", "56%", "84%", "44%", "64%"];
  var Q = 1e4;
  var MAX_HIDE_LEVELS = 3;
  function below(w, threshold) {
    return w < threshold * (1 - 0.5 / Q);
  }
  function hidePx(c) {
    if (c.hideBelow == null) return void 0;
    const px = typeof c.hideBelow === "number" ? c.hideBelow : BP[c.hideBelow];
    return px != null && px > 0 ? px : void 0;
  }
  var ROW_H_DEFAULT = 48;
  var OVERSCAN = 8;
  var FLEX_MIN = 160;
  var DataTableImpl = React31.forwardRef(function DataTable(props, ref) {
    const t = useStrings();
    const columns = props.columns || DEFAULT_COLUMNS;
    const byKey = {};
    columns.forEach(function(c) {
      byKey[c.key] = c;
    });
    const rows = props.rows || [];
    const rowKey = props.rowKey || (columns[0] ? columns[0].key : "id");
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
    const selState = useMaybeControlled(props.selected, props.defaultSelected || [], null);
    const onSel = React31.useRef(props.onSelectionChange);
    onSel.current = props.onSelectionChange;
    const canSelect = function(r) {
      return !!r && (!props.isRowSelectable || !!props.isRowSelectable(r));
    };
    const rejected = {};
    if (props.isRowSelectable)
      rows.forEach(function(r) {
        if (!canSelect(r)) rejected[String(r[rowKey])] = true;
      });
    const selected = selState[0].filter(function(k) {
      return !rejected[String(k)];
    });
    function setSelected(next, change) {
      selState[1](next);
      if (onSel.current) onSel.current(next, change || { key: null, shiftKey: false, source: "sync" });
    }
    const droppedSig = selState[0].length === selected.length ? "" : "#" + selState[0].filter(function(k) {
      return rejected[String(k)];
    }).join("\0") + "#" + selected.join("\0");
    React31.useEffect(
      function() {
        if (droppedSig !== "") setSelected(selected);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [droppedSig]
    );
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
    const widthState = React31.useState({});
    const widths = widthState[0], setWidths = widthState[1];
    const activeState = React31.useState({ r: 1, c: 0 });
    const scrollState = React31.useState(0);
    const scrollTop = scrollState[0], setScrollTop = scrollState[1];
    const scrolledX = React31.useState(false);
    const menuState = React31.useState(null);
    const menu = menuState[0], setMenu = menuState[1];
    const dragState = React31.useState(null);
    const drag = dragState[0], setDrag = dragState[1];
    const gridRef = React31.useRef(null);
    const wrapRef = React31.useRef(null), wrapMerged = useMergedRef(ref, wrapRef);
    const boxWidth = React31.useState(null);
    const measure = !!props.stackBelow || columns.some(function(c) {
      return c.hideBelow != null;
    });
    const levelShape = (props.stackBelow ? "s" : "") + Math.min(
      MAX_HIDE_LEVELS,
      columns.map(hidePx).filter(function(px, i, a) {
        return px != null && a.indexOf(px) === i;
      }).length
    );
    React31.useEffect(
      function() {
        if (!measure || !wrapRef.current || typeof ResizeObserver === "undefined") return;
        const ro = new ResizeObserver(function(en) {
          const bb = en[0].borderBoxSize && en[0].borderBoxSize[0];
          boxWidth[1](bb ? bb.inlineSize : en[0].target.getBoundingClientRect().width);
        });
        ro.observe(wrapRef.current);
        return function() {
          ro.disconnect();
        };
      },
      [measure, levelShape]
    );
    const stacked = !!props.stackBelow && boxWidth[0] != null && below(boxWidth[0], props.stackBelow);
    const noCardSel = !!props.hideSelectionInCards && selectable;
    useIsoLayoutEffect(
      function() {
        if (measure && wrapRef.current) boxWidth[1](wrapRef.current.getBoundingClientRect().width);
      },
      [measure, levelShape]
    );
    const hideLevels = [];
    columns.forEach(function(c) {
      const px = hidePx(c);
      if (px != null && hideLevels.indexOf(px) < 0) hideLevels.push(px);
    });
    hideLevels.sort(function(a, b) {
      return b - a;
    });
    hideLevels.length = Math.min(hideLevels.length, MAX_HIDE_LEVELS);
    const levels = [];
    if (props.stackBelow && props.stackBelow > 0) levels.push({ name: "stack", px: props.stackBelow });
    hideLevels.forEach(function(px, i) {
      levels.push({ name: "h" + (i + 1), px });
    });
    function hideLevel(c) {
      const px = hidePx(c);
      const i = px == null ? -1 : hideLevels.indexOf(px);
      return i < 0 ? void 0 : i + 1;
    }
    function tooNarrow(c) {
      if (c.hideBelow == null || boxWidth[0] == null || stacked) return false;
      const px = hidePx(c);
      return px != null && below(boxWidth[0], px);
    }
    const scrollRef = React31.useRef(null);
    const tipState = React31.useState(null), tip = tipState[0], setTip = tipState[1];
    function showFull(e) {
      const el = e.target.closest ? e.target.closest(".aura-table__td") : null;
      if (!el || el.scrollWidth <= el.clientWidth + 1 || el.querySelector("button, input, .aura-pill"))
        return setTip(null);
      const r = el.getBoundingClientRect();
      setTip({ text: (el.textContent || "").trim(), left: r.left, top: r.top });
    }
    function hideFull() {
      setTip(null);
    }
    const tipEl = tip && typeof document !== "undefined" ? (0, import_react_dom9.createPortal)(
      /* @__PURE__ */ React31.createElement(
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
    const rowH = React31.useState(ROW_H_DEFAULT);
    const ROW_H = rowH[0];
    useIsoLayoutEffect(function() {
      const el = wrapRef.current;
      if (!el || typeof getComputedStyle === "undefined") return;
      const v = parseFloat(getComputedStyle(el).getPropertyValue("--aura-table-row-height"));
      if (v > 0 && v !== rowH[0]) rowH[1](v);
    });
    const pending = React31.useRef(null);
    const resizing = React31.useRef(false);
    useIsoLayoutEffect(function() {
      if (!gridRef.current) return;
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
    const pillKey = (vis.filter(function(c, i) {
      return i > 0 && c.pill;
    })[0] || { key: "" }).key;
    const ownTitle = vis.some(function(c) {
      return c.card === "title";
    }), ownPill = vis.some(function(c) {
      return c.card === "pill";
    });
    let autoTitle = -1;
    if (!ownTitle) {
      for (let i = 0; i < vis.length; i++)
        if (!vis[i].card && (i === 0 || !vis[i].actions)) {
          autoTitle = i;
          break;
        }
    }
    function cardPart(c, i) {
      if (c.card) return c.card;
      if (i === autoTitle) return "title";
      if (c.key === pillKey && !ownPill) return "pill";
      return c.actions ? "actions" : "field";
    }
    const cardRank = {};
    if (vis.some(function(c) {
      return c.cardOrder != null;
    }))
      vis.map(function(c, i) {
        return { c, i, o: c.cardOrder != null ? c.cardOrder : i };
      }).filter(function(x) {
        return cardPart(x.c, x.i) === "field";
      }).sort(function(a, b) {
        return a.o - b.o || a.i - b.i;
      }).forEach(function(x, n3) {
        cardRank[x.c.key] = n3;
      });
    function cardAttrs(c, i) {
      const part = cardPart(c, i), lv = hideLevel(c);
      return {
        "data-card": part,
        "data-label": part === "field" ? c.label || void 0 : void 0,
        "data-hide": lv ? String(lv) : void 0
      };
    }
    const hasFields = vis.some(function(c, i) {
      return cardPart(c, i) === "field";
    });
    const hasFlex = vis.some(function(c) {
      return widthOf(c) == null;
    });
    let fixedSum = 0, hideTerms = "";
    vis.forEach(function(c) {
      const w = widthOf(c) != null ? widthOf(c) : FLEX_MIN, lv = hideLevel(c);
      if (lv && boxWidth[0] == null) hideTerms += " + " + w + "px * var(--aura-h" + lv + "-on, 1)";
      else fixedSum += w;
    });
    let pinOffsets = {}, acc = "0px";
    vis.forEach(function(c) {
      if (isPinned(c)) {
        pinOffsets[c.key] = acc;
        const lv = hideLevel(c);
        acc += " + " + widthOf(c) + "px" + (lv && boxWidth[0] == null ? " * var(--aura-h" + lv + "-on, 1)" : "");
      }
    });
    const selW = selectable ? " + var(--aura-table-select-width)" : "";
    const gutterR = controls ? "var(--aura-space-12)" : "var(--aura-space-6)";
    const rowMinWidth = "calc(" + fixedSum + "px" + hideTerms + " + var(--aura-space-6) + " + gutterR + selW + ")";
    function cellStyle(c, i) {
      const w = widthOf(c), s = {};
      if (w == null) {
        s["--aura-cell-flex"] = "1 1 0";
        s["--aura-cell-min"] = (c.minWidth || FLEX_MIN) + "px";
      } else {
        s["--aura-cell-flex"] = !hasFlex && i === vis.length - 1 ? "1 0 auto" : "none";
        s["--aura-cell-w"] = w + "px";
      }
      if (isPinned(c)) s["--aura-cell-left"] = "calc(var(--aura-space-6)" + selW + " + " + pinOffsets[c.key] + ")";
      if (cardRank[c.key] != null) s["--aura-card-order"] = String(5 + cardRank[c.key]);
      return s;
    }
    const sortCol = sort && sort.key ? byKey[sort.key] : void 0;
    const view = React31.useMemo(
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
      [
        rows,
        manual,
        sort && sort.key,
        sort && sort.dir,
        !!sortCol,
        sortCol && sortCol.sortValue,
        sortCol && sortCol.pill,
        sortCol && sortCol.tones
      ]
    );
    function nextSort(key) {
      if (!sort || sort.key !== key) return { key, dir: "asc" };
      if (sort.dir === "asc") return { key, dir: "desc" };
      return null;
    }
    const pageSize = props.pageSize || 0;
    const total = manual ? props.totalRows != null ? props.totalRows : (Math.max(1, pageState[0] || 1) - 1) * pageSize + rows.length + (pageSize && rows.length >= pageSize ? 1 : 0) : view.length;
    const pageCount = pageSize ? Math.max(1, Math.ceil(total / pageSize), manual && props.totalRows == null ? pageState[0] || 1 : 1) : 1;
    const page = Math.min(Math.max(1, pageState[0] || 1), pageCount);
    const first = pageSize ? (page - 1) * pageSize : 0;
    const pageRows = pageSize && !manual ? view.slice(first, first + pageSize) : view;
    const canSortAny = !busy && (manual ? total > 1 : rows.length > 1);
    const shownTotal = manual && props.totalRows == null ? first + rows.length : total;
    const prevCount = React31.useRef(pageCount);
    React31.useEffect(
      function() {
        if (busy) return;
        const before = prevCount.current;
        prevCount.current = pageCount;
        const asked = pageState[0] || 1;
        if (asked === page || pageCount >= before || asked > before) return;
        if (props.getPageHref && !props.onPageChange && !props.onStateChange) return;
        pageState[1](page);
        emit(sort, page);
      },
      [pageState[0], page, busy, pageCount]
    );
    const linkPaging = !!props.getPageHref && !props.onPageChange && !oneCallback;
    const prevLink = React31.useRef(null), nextLink = React31.useRef(null), jumpLink = React31.useRef(null);
    const jumpState = React31.useState(null);
    React31.useEffect(
      function() {
        if (jumpState[0] == null) return;
        if (jumpLink.current) jumpLink.current.click();
        jumpState[1](null);
      },
      [jumpState[0]]
    );
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
        else jumpState[1](next);
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
      return rowHref ? /* @__PURE__ */ React31.createElement(Link, { href: rowHref(r), className: "aura-table__row-link" }, content) : content;
    }
    const height = props.height || 0;
    const autoRows = props.rowHeight === "auto" && !height;
    if (props.rowHeight === "auto" && height)
      devWarnOnce(
        "table-row-height-auto",
        'DataTable `rowHeight="auto"` is ignored with `height`: virtualized rows are one fixed height. Drop `height` (and paginate) to let rows grow.'
      );
    const virtual = !!height && !loading && pageRows.length > 0 && !stacked;
    const stickyTotal = !!(props.footer && props.stickyFooter && rows.length && !loading);
    const bodyH = Math.max(ROW_H, height - ROW_H - (stickyTotal ? ROW_H : 0));
    let start = 0, end = pageRows.length;
    if (virtual) {
      start = Math.max(0, Math.floor(scrollTop / ROW_H) - OVERSCAN);
      end = Math.min(pageRows.length, Math.ceil((scrollTop + bodyH) / ROW_H) + OVERSCAN);
    }
    const visibleRows = Math.max(1, Math.floor(bodyH / ROW_H));
    const nCols = vis.length + (selectable ? 1 : 0);
    const nRows = loading ? 0 : pageRows.length;
    const hasTotal = !!(props.footer && rows.length && !loading), T = nRows + 1, lastR = nRows + (hasTotal ? 1 : 0);
    const active = activeState[0];
    const ar = Math.min(active.r, lastR), ac = Math.min(active.c, nCols - 1);
    const activeRendered = ar === 0 || hasTotal && ar === T || ar - 1 >= start && ar - 1 < end;
    function colAt(ci) {
      return selectable ? ci === 0 ? null : vis[ci - 1] : vis[ci];
    }
    const cardHidden = [];
    for (let ci = 0; ci < nCols; ci++) {
      const col = colAt(ci);
      cardHidden.push(stacked && (col ? cardPart(col, vis.indexOf(col)) === "hide" : noCardSel));
    }
    function nearestShown(c, dir, ok) {
      if (ok(c)) return c;
      for (let d = 1; d < nCols; d++) {
        const a = c + d * dir, b = c - d * dir;
        if (a >= 0 && a < nCols && ok(a)) return a;
        if (b >= 0 && b < nCols && ok(b)) return b;
      }
      return c;
    }
    const acShown = nearestShown(ac, 1, function(cc) {
      return !cardHidden[cc];
    });
    const lastFocus = React31.useRef(null);
    React31.useEffect(
      function() {
        const was = lastFocus.current, g = gridRef.current;
        if (!stacked || !was || !g || !g.contains(was) || was.getClientRects().length > 0) return;
        if (document.activeElement && document.activeElement !== document.body && document.activeElement !== was) return;
        const el = g.querySelector('[data-rc="' + Math.max(1, ar) + ":" + acShown + '"]');
        if (el && el.getClientRects().length > 0) el.focus();
      },
      [stacked]
    );
    function tabFor(r, c) {
      if (!activeRendered) return r === 0 && c === ac ? 0 : -1;
      return r === ar && c === acShown ? 0 : -1;
    }
    React31.useEffect(function() {
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
      const ae = document.activeElement;
      if (ae && ae !== document.body && !gridRef.current.contains(ae)) {
        pending.current = null;
        return;
      }
      const el = gridRef.current.querySelector('[data-rc="' + p.r + ":" + c + '"]');
      if (el) {
        pending.current = null;
        el.focus();
      }
    });
    function focusCell(r, c, dir) {
      r = Math.max(0, Math.min(r, lastR));
      c = Math.max(0, Math.min(c, nCols - 1));
      if (stacked && r === 0 && nRows > 0 && (!(selectable && c === 0) || noCardSel)) r = 1;
      if (gridRef.current && (r === T && hasTotal || stacked)) {
        const shown2 = function(cc) {
          if (cardHidden[cc]) return false;
          const e = gridRef.current.querySelector('[data-rc="' + r + ":" + cc + '"]');
          return !!e && e.getClientRects().length > 0;
        };
        c = nearestShown(c, dir || 1, shown2);
      }
      activeState[1]({ r, c });
      pending.current = { r, c };
      if (virtual && hasTotal && r === T && !props.stickyFooter) {
        const sc = scrollRef.current;
        sc.scrollTop = sc.scrollHeight;
        setScrollTop(sc.scrollTop);
      } else if (virtual && r > 0 && r <= nRows) {
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
    const pageKeys = pageRows.filter(canSelect).map(function(r) {
      return r[rowKey];
    });
    const selSet = {};
    selected.forEach(function(k) {
      selSet[String(k)] = true;
    });
    const nSel = pageKeys.filter(function(k) {
      return selSet[String(k)];
    }).length;
    const all = nSel > 0 && nSel === pageKeys.length;
    const anchor = React31.useRef(null);
    const shiftClick = React31.useRef(false);
    function toggle(k, on, how) {
      const same2 = function(x) {
        return String(x) === String(k);
      };
      let range = null;
      if (props.rangeSelect && how.shiftKey && anchor.current != null) {
        const from = pageKeys.findIndex(function(x) {
          return String(x) === String(anchor.current);
        });
        const to = pageKeys.findIndex(same2);
        if (from >= 0 && to >= 0) range = pageKeys.slice(Math.min(from, to), Math.max(from, to) + 1);
      }
      anchor.current = k;
      const change = { key: k, shiftKey: how.shiftKey, source: how.source };
      if (range) {
        const inRange = {};
        range.forEach(function(x) {
          inRange[String(x)] = true;
        });
        const rest = selected.filter(function(x) {
          return !inRange[String(x)];
        });
        change.range = range;
        setSelected(on ? rest.concat(range) : rest, change);
        return;
      }
      setSelected(
        on ? selected.concat([k]) : selected.filter(function(x) {
          return !same2(x);
        }),
        change
      );
    }
    function toggleAll() {
      setSelected(
        all ? selected.filter(function(k) {
          return !pageKeys.some(function(p) {
            return String(p) === String(k);
          });
        }) : selected.concat(
          pageKeys.filter(function(k) {
            return !selSet[String(k)];
          })
        ),
        { key: null, shiftKey: false, source: "all" }
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
            icon: /* @__PURE__ */ React31.createElement(IconArrowUp, null),
            onSelect: function() {
              applySort({ key: c.key, dir: "asc" });
            }
          },
          {
            label: t.sortDesc,
            icon: /* @__PURE__ */ React31.createElement(IconArrowDown, null),
            onSelect: function() {
              applySort({ key: c.key, dir: "desc" });
            }
          },
          { separator: true }
        );
      if (c.width != null)
        items2.push({
          label: isPinned(c) ? t.unpin : t.pin,
          icon: isPinned(c) ? /* @__PURE__ */ React31.createElement(IconPinOff, null) : /* @__PURE__ */ React31.createElement(IconPin, null),
          onSelect: function() {
            togglePin(c.key);
          }
        });
      if (reorderable)
        items2.push(
          {
            label: t.moveLeft,
            icon: /* @__PURE__ */ React31.createElement(IconArrowLeft, null),
            disabled: gi <= 0,
            onSelect: function() {
              moveCol(c.key, -1);
            }
          },
          {
            label: t.moveRight,
            icon: /* @__PURE__ */ React31.createElement(IconArrowRight, null),
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
          icon: /* @__PURE__ */ React31.createElement(IconEyeOff, null),
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
      }).concat([{ separator: true }, { label: t.resetColumns, icon: /* @__PURE__ */ React31.createElement(IconRotateCcw, null), onSelect: resetColumns }]);
    }
    function openMenu(kind, key, anchor2, rc) {
      setMenu({ kind, key, anchor: anchor2, rc });
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
      const row = r > 0 && r <= nRows ? pageRows[r - 1] : null, isTotal = hasTotal && r === T;
      let handled = true;
      if (r === 0 && col && e.altKey && (k === "ArrowLeft" || k === "ArrowRight") && canResize(col))
        setW(col, widthOf(col) + (k === "ArrowLeft" ? -1 : 1) * (e.shiftKey ? 48 : 16), true);
      else if (r === 0 && col && e.ctrlKey && e.shiftKey && (k === "ArrowLeft" || k === "ArrowRight") && reorderable) {
        if (moveCol(col.key, k === "ArrowLeft" ? -1 : 1)) pending.current = { r: 0, key: col.key, c };
      } else if (r === 0 && col && (e.altKey && k === "ArrowDown" || k === "ContextMenu" || e.shiftKey && k === "F10") && controls)
        openMenu("col", col.key, target, { r: 0, c });
      else if (k === "ArrowRight") focusCell(r, c + 1);
      else if (k === "ArrowLeft") focusCell(r, c - 1, -1);
      else if (k === "ArrowDown") {
        if (r < lastR) focusCell(r + 1, c);
        else if (pageSize && page < pageCount && goPage(page + 1, { r: 1, c })) activeState[1]({ r: 1, c });
      } else if (k === "ArrowUp") {
        if (r > 1 || r === 1 && !(pageSize && page > 1)) focusCell(r - 1, c);
        else if (r === 1 && goPage(page - 1, { r: pageSize, c })) activeState[1]({ r: pageSize, c });
      } else if (k === "Home") focusCell(e.ctrlKey ? 1 : r, 0);
      else if (k === "End") focusCell(e.ctrlKey ? lastR : r, nCols - 1, -1);
      else if (k === "PageDown") {
        if (pageSize) {
          if (goPage(page + 1, { r: 1, c })) activeState[1]({ r: 1, c });
        } else focusCell(Math.min(lastR, r + visibleRows), c);
      } else if (k === "PageUp") {
        if (pageSize) {
          if (goPage(page - 1, { r: 1, c })) activeState[1]({ r: 1, c });
        } else focusCell(Math.max(1, r - visibleRows), c);
      } else if (isTotal && (k === " " || k === "Enter" || k === "F2")) {
        handled = false;
      } else if (k === "F2" && r > 0) {
        const inner = target.querySelector("button, a[href], input, select, textarea");
        if (inner) inner.focus();
        else handled = false;
      } else if (k === " " || k === "Enter") {
        if (r === 0 && !col && selectable && nRows) {
          if (pageKeys.length) toggleAll();
        } else if (r === 0 && col && col.sortable && canSortAny) sortBy(col.key);
        else if (r > 0 && k === " " && selectable) {
          if (canSelect(row) && !(stacked && noCardSel))
            toggle(row[rowKey], !selSet[row[rowKey]], { shiftKey: e.shiftKey, source: "keyboard" });
        } else if (r > 0 && k === "Enter" && rowHref && !target.querySelector("button, a[href]:not(.aura-table__row-link), input, select, textarea"))
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
    const head = [/* @__PURE__ */ React31.createElement("span", { key: "__gl", className: "aura-table__gutter", "aria-hidden": true })];
    if (selectable)
      head.push(
        /* @__PURE__ */ React31.createElement(
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
          pageKeys.length ? /* @__PURE__ */ React31.createElement(
            Checkbox,
            {
              hideLabel: true,
              checked: all,
              indeterminate: nSel > 0 && !all,
              tabIndex: -1,
              label: all ? t.deselectAllRows : t.selectAllRows,
              onChange: toggleAll
            }
          ) : null,
          pageKeys.length ? /* @__PURE__ */ React31.createElement("span", { className: "aura-table__sel-text" }, nSel ? t.selectedCount(nSel) : t.selectAll) : /* @__PURE__ */ React31.createElement("span", { className: "aura-sr-only" }, t.selectRows)
        )
      );
    vis.forEach(function(c, i) {
      const ci = i + (selectable ? 1 : 0);
      const isSorted = sort && sort.key === c.key;
      const canSort = c.sortable && canSortAny;
      const ariaSort = isSorted && canSort ? sort.dir === "desc" ? "descending" : "ascending" : canSort ? "none" : void 0;
      const pin = isPinned(c), edge = pin && i === nPinned - 1;
      head.push(
        /* @__PURE__ */ React31.createElement(
          "span",
          {
            key: c.key,
            role: "columnheader",
            "aria-sort": ariaSort,
            "aria-colindex": ci + 1,
            style: cellStyle(c, i),
            "data-hide": hideLevel(c) ? String(hideLevel(c)) : void 0,
            "data-card": cardPart(c, i) === "hide" ? "hide" : void 0,
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
          /* @__PURE__ */ React31.createElement("span", { className: "aura-table__th-inner" }, canSort ? /* @__PURE__ */ React31.createElement(
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
            /* @__PURE__ */ React31.createElement(
              Icon,
              {
                name: isSorted ? sort.dir === "desc" ? /* @__PURE__ */ React31.createElement(IconArrowDown, null) : /* @__PURE__ */ React31.createElement(IconArrowUp, null) : /* @__PURE__ */ React31.createElement(IconArrowUpDown, null),
                size: 12
              }
            )
          ) : /* @__PURE__ */ React31.createElement("span", { className: cx("aura-table__th-label", !c.label && "aura-sr-only") }, c.label || (c.actions ? t.actions : c.key)), pin ? /* @__PURE__ */ React31.createElement(Icon, { name: /* @__PURE__ */ React31.createElement(IconPin, null), size: 12, className: "aura-table__pin-icon", label: t.pinned }) : null, controls ? /* @__PURE__ */ React31.createElement(
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
            /* @__PURE__ */ React31.createElement(Icon, { name: /* @__PURE__ */ React31.createElement(IconEllipsis, null) })
          ) : null),
          canResize(c) ? /* @__PURE__ */ React31.createElement(
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
      /* @__PURE__ */ React31.createElement(
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
      return c.render ? c.render(r) : c.pill ? /* @__PURE__ */ React31.createElement(StatusPill, { ...{ tone: c.tones && c.tones[v] } }, v) : v;
    }
    function rowCells(r, i, k, isSel) {
      const ri = i + 1;
      const selLabel = selectable && canSelect(r) ? props.rowSelectLabel && props.rowSelectLabel(r) || t.selectRow(k) : void 0;
      const cells = [/* @__PURE__ */ React31.createElement("span", { key: "__gl", className: "aura-table__gutter", "aria-hidden": true })];
      if (selectable)
        cells.push(
          /* @__PURE__ */ React31.createElement(
            "span",
            {
              key: "__sel",
              role: "gridcell",
              "aria-colindex": 1,
              className: cx("aura-table__sel", nPinned && "is-pinned"),
              tabIndex: tabFor(ri, 0),
              "data-rc": ri + ":0",
              "aria-label": canSelect(r) ? selLabel : props.rowSelectDisabledLabel ? props.rowSelectDisabledLabel(r) : void 0,
              onFocus: function(e) {
                if (e.target === e.currentTarget) activeState[1]({ r: ri, c: 0 });
              },
              onClickCapture: function(e) {
                shiftClick.current = e.shiftKey;
              }
            },
            canSelect(r) ? /* @__PURE__ */ React31.createElement(
              Checkbox,
              {
                hideLabel: true,
                checked: isSel,
                tabIndex: -1,
                label: selLabel,
                onChange: function(on) {
                  const shift = shiftClick.current;
                  shiftClick.current = false;
                  toggle(k, on, { shiftKey: shift, source: "click" });
                }
              }
            ) : null
          )
        );
      vis.forEach(function(c, j) {
        const ci = j + (selectable ? 1 : 0), v = r[c.key], pin = isPinned(c);
        cells.push(
          /* @__PURE__ */ React31.createElement(
            "span",
            {
              key: c.key,
              role: "gridcell",
              "aria-colindex": ci + 1,
              tabIndex: tabFor(ri, ci),
              "data-rc": ri + ":" + ci,
              className: cx(
                "aura-table__td",
                autoRows && "aura-table__td--auto",
                c.mono && "aura-table__mono",
                c.align === "end" && "is-end",
                pin && "is-pinned",
                pin && j === nPinned - 1 && "is-pin-edge"
              ),
              style: cellStyle(c, j),
              ...cardAttrs(c, j),
              onFocus: function() {
                if (activeState[0].r !== ri || activeState[0].c !== ci) activeState[1]({ r: ri, c: ci });
              }
            },
            autoRows ? /* @__PURE__ */ React31.createElement("span", { className: "aura-table__cell" }, j === 0 ? rowLinkWrap(r, cellContent(c, r)) : cellContent(c, r)) : j === 0 ? rowLinkWrap(r, cellContent(c, r)) : cellContent(c, r)
          )
        );
      });
      if (hasFields) cells.push(/* @__PURE__ */ React31.createElement("span", { key: "__br", className: "aura-table__break", "aria-hidden": true }));
      cells.push(
        /* @__PURE__ */ React31.createElement(
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
    const rowStyle = { ["--aura-row-min"]: rowMinWidth };
    if (loading) {
      const n3 = pageSize || props.skeletonRows || 5;
      const skRows = body = [];
      for (let i = 0; i < n3; i++) {
        const sk = [/* @__PURE__ */ React31.createElement("span", { key: "__gl", className: "aura-table__gutter" })];
        if (selectable)
          sk.push(
            /* @__PURE__ */ React31.createElement("span", { key: "__sel", className: cx("aura-table__sel", nPinned && "is-pinned") }, /* @__PURE__ */ React31.createElement("span", { className: "aura-skel aura-skel--box" }))
          );
        vis.forEach(function(c, j) {
          sk.push(
            /* @__PURE__ */ React31.createElement(
              "span",
              {
                key: c.key,
                className: cx("aura-table__td", c.align === "end" && "is-end", isPinned(c) && "is-pinned"),
                style: cellStyle(c, j),
                ...cardAttrs(c, j),
                "data-label": void 0
              },
              /* @__PURE__ */ React31.createElement(
                "span",
                {
                  className: cx("aura-skel", c.pill && "aura-skel--pill"),
                  style: c.pill ? void 0 : { width: SKELETON_WIDTHS[(i + j) % SKELETON_WIDTHS.length] }
                }
              )
            )
          );
        });
        if (hasFields) sk.push(/* @__PURE__ */ React31.createElement("span", { key: "__br", className: "aura-table__break" }));
        sk.push(
          /* @__PURE__ */ React31.createElement("span", { key: "__gr", className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker") })
        );
        skRows.push(
          /* @__PURE__ */ React31.createElement("div", { key: "sk" + i, className: "aura-table__row aura-table__row--skeleton", "aria-hidden": true, style: rowStyle }, sk)
        );
      }
    } else if (!rows.length) {
      const em = props.empty || {};
      body = /* @__PURE__ */ React31.createElement("div", { className: "aura-table__empty", role: "row" }, /* @__PURE__ */ React31.createElement("div", { role: "gridcell" }, /* @__PURE__ */ React31.createElement("span", { className: "aura-table__empty-icon" }, /* @__PURE__ */ React31.createElement(Icon, { name: em.icon || /* @__PURE__ */ React31.createElement(IconInbox, null), size: "lg" })), /* @__PURE__ */ React31.createElement("p", { className: "aura-table__empty-title" }, em.title || t.empty), em.description ? /* @__PURE__ */ React31.createElement("p", { className: "aura-table__empty-text" }, em.description) : null, em.action ? /* @__PURE__ */ React31.createElement("div", { className: "aura-table__empty-action" }, em.action) : null));
    } else {
      const bodyRows = body = [];
      if (virtual && start > 0)
        bodyRows.push(
          /* @__PURE__ */ React31.createElement("div", { key: "__top", className: "aura-table__spacer", style: { height: start * ROW_H + "px" }, "aria-hidden": true })
        );
      for (let ri = start; ri < end; ri++) {
        (function(r, i) {
          const k = r[rowKey], isSel = !!selSet[k];
          bodyRows.push(
            /* @__PURE__ */ React31.createElement(
              "div",
              {
                key: k,
                role: "row",
                "aria-rowindex": first + i + 2,
                "aria-selected": selectable && canSelect(r) ? isSel : void 0,
                className: cx(
                  "aura-table__row",
                  autoRows && "aura-table__row--auto",
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
        bodyRows.push(
          /* @__PURE__ */ React31.createElement(
            "div",
            {
              key: "__bot",
              className: "aura-table__spacer",
              style: { height: (pageRows.length - end) * ROW_H + "px" },
              "aria-hidden": true
            }
          )
        );
    }
    let foot = null;
    function pagerButton(dir) {
      const p = page + dir, off = busy || (dir < 0 ? page <= 1 : page >= pageCount), label = dir < 0 ? t.prevPage : t.nextPage, icon = dir < 0 ? /* @__PURE__ */ React31.createElement(IconChevronLeft, null) : /* @__PURE__ */ React31.createElement(IconChevronRight, null);
      if (props.getPageHref && !off)
        return /* @__PURE__ */ React31.createElement(
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
          /* @__PURE__ */ React31.createElement(Icon, { name: icon })
        );
      return /* @__PURE__ */ React31.createElement(
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
    const openTotal = manual && props.totalRows == null && !!pageSize && rows.length >= pageSize;
    if (pageSize && (rows.length || busy || page > 1)) {
      const from = rows.length ? first + 1 : 0, to = manual ? first + rows.length : Math.min(first + pageSize, view.length);
      foot = /* @__PURE__ */ React31.createElement("div", { className: "aura-table__foot" }, /* @__PURE__ */ React31.createElement("span", { "aria-live": "polite" }, busy ? t.loading : openTotal ? t.rangeOpen(from, to) : t.range(from, to, shownTotal)), /* @__PURE__ */ React31.createElement("span", { className: "aura-table__pager" }, /* @__PURE__ */ React31.createElement("span", null, openTotal ? t.pageOpen(page) : t.page(page, pageCount)), pagerButton(-1), pagerButton(1)));
    } else if (height && rows.length && !loading) {
      foot = /* @__PURE__ */ React31.createElement("div", { className: "aura-table__foot" }, /* @__PURE__ */ React31.createElement("span", null, t.rowCount(shownTotal)), selectable && selected.length ? /* @__PURE__ */ React31.createElement("span", null, t.selectedCount(selected.length)) : /* @__PURE__ */ React31.createElement("span", null));
    }
    const totalRow = props.footer && rows.length && !loading ? /* @__PURE__ */ React31.createElement(
      "div",
      {
        role: "row",
        "aria-rowindex": shownTotal + 2,
        "aria-label": t.totals,
        className: cx("aura-table__row aura-table__total", props.stickyFooter && "is-sticky"),
        style: rowStyle
      },
      /* @__PURE__ */ React31.createElement("span", { className: "aura-table__gutter", "aria-hidden": true }),
      selectable ? /* @__PURE__ */ React31.createElement(
        "span",
        {
          role: "gridcell",
          "aria-colindex": 1,
          className: cx("aura-table__sel", nPinned && "is-pinned"),
          tabIndex: tabFor(T, 0),
          "data-rc": T + ":0",
          onFocus: function() {
            activeState[1]({ r: T, c: 0 });
          }
        }
      ) : null,
      vis.map(function(c, j) {
        const pin = isPinned(c), ci = j + (selectable ? 1 : 0);
        return /* @__PURE__ */ React31.createElement(
          "span",
          {
            key: c.key,
            role: "gridcell",
            "aria-colindex": j + (selectable ? 2 : 1),
            tabIndex: tabFor(T, ci),
            "data-rc": T + ":" + ci,
            onFocus: function() {
              if (activeState[0].r !== T || activeState[0].c !== ci) activeState[1]({ r: T, c: ci });
            },
            className: cx(
              "aura-table__td",
              c.mono && "aura-table__mono",
              c.align === "end" && "is-end",
              pin && "is-pinned",
              pin && j === nPinned - 1 && "is-pin-edge",
              props.footer[c.key] == null && "is-blank"
            ),
            style: cellStyle(c, j),
            ...cardAttrs(c, j),
            "data-label": cardPart(c, j) === "title" ? void 0 : c.label || t.totals
          },
          props.footer[c.key]
        );
      }),
      hasFields ? /* @__PURE__ */ React31.createElement("span", { className: "aura-table__break", "aria-hidden": true }) : null,
      /* @__PURE__ */ React31.createElement(
        "span",
        {
          className: cx("aura-table__gutter aura-table__gutter--end", controls && "has-picker"),
          "aria-hidden": true
        }
      )
    ) : null;
    const scrollStyle = {
      scrollPaddingLeft: "calc(var(--aura-space-6)" + selW + " + " + acc + ")",
      scrollPaddingTop: ROW_H + "px",
      scrollPaddingBottom: stickyTotal ? ROW_H + "px" : void 0
    };
    if (height) scrollStyle["--aura-table-h"] = height + "px";
    const gridEl = /* @__PURE__ */ React31.createElement(
      "div",
      {
        ref: levels.length ? wrapRef : wrapMerged,
        "data-density": props.density,
        className: cx(
          "aura-table",
          stacked && "aura-table--stacked",
          noCardSel && "aura-table--cards-nosel",
          scrolledX[0] && "is-scrolled-x",
          refreshing && "is-refreshing",
          !levels.length && props.className
        ),
        style: levels.length ? { ["--aura-q-back"]: String(levels[levels.length - 1].px / Q) } : void 0
      },
      refreshing ? /* @__PURE__ */ React31.createElement("span", { className: "aura-table__busy-bar", "aria-hidden": true }) : null,
      /* @__PURE__ */ React31.createElement(
        "div",
        {
          ref: function(el) {
            scrollRef.current = el;
            gridRef.current = el;
          },
          className: "aura-table__scroll",
          onMouseOver: showFull,
          onMouseLeave: hideFull,
          onFocus: function(e) {
            lastFocus.current = e.target;
            showFull(e);
          },
          onBlur: function(e) {
            const to = e.relatedTarget;
            if ((!to || !e.currentTarget.contains(to)) && e.target.getClientRects().length > 0)
              lastFocus.current = null;
            hideFull();
          },
          style: scrollStyle,
          role: "grid",
          "aria-label": props.label,
          "aria-busy": busy || void 0,
          "aria-rowcount": loading || manual && props.totalRows == null && pageSize && rows.length >= pageSize ? -1 : shownTotal + 1 + (totalRow ? 1 : 0),
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
        /* @__PURE__ */ React31.createElement(
          "div",
          {
            className: cx("aura-table__head", selectable && nRows > 0 && !busy && "has-select-all"),
            role: "row",
            "aria-rowindex": 1,
            style: rowStyle
          },
          head
        ),
        body,
        totalRow
      ),
      busy ? /* @__PURE__ */ React31.createElement("span", { className: "aura-sr-only", role: "status" }, t.loadingRows) : null,
      controls ? /* @__PURE__ */ React31.createElement("div", { className: "aura-table__picker" }, /* @__PURE__ */ React31.createElement(
        IconButton,
        {
          icon: /* @__PURE__ */ React31.createElement(IconColumns3, null),
          label: t.showHideColumns,
          "aria-haspopup": "menu",
          onClick: function(e) {
            openMenu("picker", null, e.currentTarget);
          }
        }
      )) : null,
      foot,
      menu ? /* @__PURE__ */ React31.createElement(
        Menu,
        {
          anchor: menu.anchor,
          onClose: closeMenu,
          label: menu.kind === "picker" ? t.columns : t.column(byKey[menu.key] && byKey[menu.key].label),
          items: menu.kind === "picker" ? pickerItems() : byKey[menu.key] ? columnMenuItems(byKey[menu.key]) : []
        }
      ) : null,
      tipEl,
      jumpState[0] != null && props.getPageHref ? /* @__PURE__ */ React31.createElement(Link, { ref: jumpLink, href: props.getPageHref(jumpState[0]), hidden: true, tabIndex: -1, "aria-hidden": true }) : null
    );
    if (!levels.length) return gridEl;
    let out = gridEl;
    for (let i = levels.length - 1; i >= 0; i--) {
      const prev = i === 0 ? Q : levels[i - 1].px;
      out = /* @__PURE__ */ React31.createElement(
        "div",
        {
          className: cx("aura-table-q", "aura-table-q--" + levels[i].name),
          style: { ["--aura-q-scale"]: String(prev / levels[i].px) }
        },
        out
      );
    }
    return /* @__PURE__ */ React31.createElement("div", { ref, className: cx("aura-table-box", props.className) }, out);
  });
  var DataTable2 = DataTableImpl;

  // src/Card.tsx
  var React32 = __toESM(require_react(), 1);
  var Card = React32.forwardRef(function Card2(props, ref) {
    return cardElement(props, ref);
  });

  // src/Tabs.tsx
  var React33 = __toESM(require_react(), 1);
  var Tabs = React33.forwardRef(function Tabs2(props, ref) {
    const items2 = props.tabs || [], base = uid();
    const asLinks = items2.length > 0 && items2.every(function(t) {
      return !!t.href;
    });
    const firstOn = items2.filter(function(t) {
      return !t.disabled;
    })[0];
    const st = useMaybeControlled(
      props.value,
      props.defaultValue || (asLinks ? void 0 : firstOn && firstOn.id),
      props.onChange
    );
    const cur = asLinks && "value" in props ? props.value : st[0];
    const refs = React33.useRef({});
    const current2 = items2.filter(function(t) {
      return t.id === cur;
    })[0] || firstOn || items2[0];
    const Link = useLinkComponent(props.linkComponent);
    const manual = props.activation === "manual";
    const seg = props.variant === "segmented";
    const fw = props.fullWidth;
    const listCls = cx(
      "aura-tabs__list",
      seg && "aura-segmented",
      fw === true && (seg ? "is-full" : "is-fill"),
      typeof fw === "string" && (seg ? "is-full-" : "is-fill-") + fw
    );
    const tabCls = function(on, extra) {
      return cx("aura-tab", on && "is-active", seg && "aura-segmented__option", seg && on && "is-selected", extra);
    };
    const rootCls = cx("aura-tabs", seg && "aura-tabs--segmented");
    const [focusId, setFocusId] = React33.useState(null);
    items2.forEach(function(t) {
      const al = t.tabProps && t.tabProps["aria-label"];
      if (al && al.toLowerCase().indexOf(String(t.label).toLowerCase()) !== 0)
        devWarnOnce(
          "tab-label-in-name",
          'Tabs: tabProps aria-label "' + al + '" should start with the visible label "' + t.label + '" so voice control finds the tab (WCAG 2.5.3 Label in Name).'
        );
    });
    if (asLinks)
      return /* @__PURE__ */ React33.createElement(
        "nav",
        {
          ref,
          "aria-label": props.label,
          className: cx(rootCls, "aura-tabs--links", props.className)
        },
        /* @__PURE__ */ React33.createElement("div", { className: listCls }, items2.map(function(t) {
          const on = t.id === cur;
          const inner = [
            t.icon ? /* @__PURE__ */ React33.createElement(Icon, { key: "i", name: t.icon }) : null,
            t.label,
            t.count != null ? /* @__PURE__ */ React33.createElement("span", { key: "c", className: "aura-tab__count" }, t.count) : null
          ];
          const own = omit(t.tabProps || {}, [
            "type",
            "disabled",
            "form",
            "formAction",
            "formEncType",
            "formMethod",
            "formNoValidate",
            "formTarget",
            "name",
            "value"
          ]);
          return t.disabled ? /* @__PURE__ */ React33.createElement(
            "span",
            {
              ...omit(own, ["onClick"]),
              key: t.id,
              className: cx(tabCls(false), "is-disabled", own.className),
              "aria-disabled": true
            },
            inner
          ) : /* @__PURE__ */ React33.createElement(
            Link,
            {
              ...own,
              key: t.id,
              href: t.href,
              className: tabCls(on, own.className),
              "aria-current": on ? props.current || "page" : void 0,
              onClick: function(e) {
                if (own.onClick) own.onClick(e);
                if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
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
      if (manual) setFocusId(t.id);
      else st[1](t.id);
      if (refs.current[t.id]) refs.current[t.id].focus();
    }
    const stop = manual && focusId && items2.filter(function(t) {
      return t.id === focusId && !t.disabled;
    })[0] || current2;
    return /* @__PURE__ */ React33.createElement("div", { ref, className: cx(rootCls, props.className) }, /* @__PURE__ */ React33.createElement(
      "div",
      {
        role: "tablist",
        "aria-label": props.label,
        className: listCls,
        onBlur: manual ? function(e) {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocusId(null);
        } : void 0,
        onKeyDown: function(e) {
          const enabled = items2.filter(function(t) {
            return !t.disabled;
          }), focused = enabled.filter(function(t) {
            return refs.current[t.id] === e.target;
          })[0], i = enabled.indexOf(focused || stop);
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
        const own = t.tabProps || {};
        return /* @__PURE__ */ React33.createElement(
          "button",
          {
            ...own,
            key: t.id,
            type: "button",
            role: "tab",
            id: base + "-tab-" + t.id,
            "aria-selected": on,
            "aria-controls": base + "-panel-" + t.id,
            tabIndex: stop && t.id === stop.id ? 0 : -1,
            disabled: t.disabled,
            ref: function(el) {
              refs.current[t.id] = el;
            },
            className: tabCls(on, own.className),
            onFocus: manual ? function(e) {
              if (own.onFocus) own.onFocus(e);
              setFocusId(t.id);
            } : own.onFocus,
            onClick: function(e) {
              if (own.onClick) own.onClick(e);
              if (e.defaultPrevented) return;
              if (manual && current2 && t.id === current2.id) return;
              st[1](t.id);
            }
          },
          t.icon ? /* @__PURE__ */ React33.createElement(Icon, { name: t.icon }) : null,
          t.label,
          t.count != null ? /* @__PURE__ */ React33.createElement("span", { className: "aura-tab__count" }, t.count) : null
        );
      })
    ), props.keepMounted ? (
      /* 5.9: every panel stays in the DOM (same node across switches); the inactive ones are hidden. */
      items2.map(function(t) {
        if (t.content === void 0) return null;
        const on = current2 && t.id === current2.id;
        return /* @__PURE__ */ React33.createElement(
          "div",
          {
            key: t.id,
            role: "tabpanel",
            id: base + "-panel-" + t.id,
            "aria-labelledby": base + "-tab-" + t.id,
            tabIndex: 0,
            hidden: !on,
            className: "aura-tabs__panel"
          },
          t.content
        );
      })
    ) : current2 && current2.content !== void 0 ? /* @__PURE__ */ React33.createElement(
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
  var React34 = __toESM(require_react(), 1);
  var import_react_dom10 = __toESM(require_react_dom(), 1);
  function contains(it, id) {
    return !!id && !!it.children && it.children.some(function(c) {
      return c.id === id || contains(c, id);
    });
  }
  var SideNav = React34.forwardRef(function SideNav2(props, ref) {
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
    const tipState = React34.useState(null), tip = tipState[0], setTip = tipState[1];
    React34.useEffect(
      function() {
        if (!collapsed) setTip(null);
      },
      [collapsed]
    );
    React34.useEffect(
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
    const openState = React34.useState({}), toggled = openState[0], setToggled = openState[1];
    function isOpen(it) {
      if (toggled[it.id] != null) return toggled[it.id];
      return !!it.defaultOpen || contains(it, active);
    }
    React34.useEffect(
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
    const navRef = React34.useRef(null);
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
        it.icon ? /* @__PURE__ */ React34.createElement(Icon, { key: "i", name: it.icon }) : collapsed ? /* @__PURE__ */ React34.createElement("span", { key: "i", className: "aura-nav__initial", "aria-hidden": "true" }, it.label.charAt(0)) : null,
        collapsed && marked ? /* @__PURE__ */ React34.createElement("span", { key: "d", className: "aura-nav__dot", "aria-hidden": "true" }) : null,
        /* @__PURE__ */ React34.createElement("span", { key: "l", className: "aura-nav__label" }, it.label),
        it.badge != null ? /* @__PURE__ */ React34.createElement("span", { key: "b", className: "aura-nav__badge" }, it.badge) : null,
        it.count != null ? /* @__PURE__ */ React34.createElement("span", { key: "c", className: "aura-nav__count" }, it.count) : null,
        group ? /* @__PURE__ */ React34.createElement(Icon, { key: "g", name: /* @__PURE__ */ React34.createElement(IconChevronDown, null), className: cx("aura-nav__chevron", open && "is-open") }) : null
      ];
    }
    function item(it, depth) {
      if (it.children) {
        const open = !collapsed && isOpen(it);
        const listId = base + "-" + it.id;
        const holdsActive = contains(it, active);
        return /* @__PURE__ */ React34.createElement("li", { key: it.id, className: "aura-nav__group" }, /* @__PURE__ */ React34.createElement(
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
        ), /* @__PURE__ */ React34.createElement("ul", { id: listId, className: "aura-nav__list aura-nav__sub", hidden: !open }, it.children.map(function(c) {
          return item(c, depth + 1);
        })));
      }
      const action = it.selectable === false;
      const on = !action && active === it.id;
      const common = {
        ...tipHandlers(it.label),
        className: cx("aura-nav__item", action && "aura-nav__item--action", on && "is-active"),
        "aria-current": on ? "page" : void 0,
        style: depth ? { ["--aura-nav-depth"]: depth } : void 0,
        onClick: function(e) {
          if (!it.href) e.preventDefault();
          else if (!plainClick(e)) return;
          if (!action) st[1](it.id);
          if (it.onSelect) it.onSelect();
          if (action && props.onAction) props.onAction(it.id);
        }
      };
      return /* @__PURE__ */ React34.createElement("li", { key: it.id }, it.href ? /* @__PURE__ */ React34.createElement(Link, { href: it.href, ...common }, inner(it, false, false)) : /* @__PURE__ */ React34.createElement("button", { type: "button", ...common }, inner(it, false, false)));
    }
    return /* @__PURE__ */ React34.createElement(
      "nav",
      {
        ref: function(el) {
          navRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        },
        className: cx(
          "aura-nav",
          collapsed && "aura-nav--collapsed",
          props.bordered === false && "aura-nav--borderless",
          props.chevron === "right" && "aura-nav--chevron-right",
          props.className
        ),
        "data-collapsed": collapsed ? "" : void 0,
        "aria-label": props.label || t.mainNav,
        onKeyDown
      },
      props.header ? /* @__PURE__ */ React34.createElement("div", { className: "aura-nav__header" }, props.header) : null,
      /* @__PURE__ */ React34.createElement("div", { className: "aura-nav__scroll" }, sections.map(function(s, i) {
        return /* @__PURE__ */ React34.createElement("div", { key: i, className: "aura-nav__section" }, s.title ? /* @__PURE__ */ React34.createElement("p", { className: "aura-nav__title" }, s.title) : null, /* @__PURE__ */ React34.createElement("ul", { className: "aura-nav__list" }, s.items.map(function(it) {
          return item(it, 0);
        })));
      })),
      props.footer ? /* @__PURE__ */ React34.createElement("div", { className: "aura-nav__footer" }, props.footer) : null,
      props.collapsible && props.collapseToggle === "row" ? /* @__PURE__ */ React34.createElement("div", { className: "aura-nav__toggle aura-nav__toggle--row" }, /* @__PURE__ */ React34.createElement(
        "button",
        {
          type: "button",
          className: "aura-nav__item aura-nav__item--action",
          ...tipHandlers(collapsed ? t.expandNav : t.collapseNav),
          onClick: function() {
            setTip(null);
            col[1](!collapsed);
          }
        },
        /* @__PURE__ */ React34.createElement(Icon, { name: collapsed ? /* @__PURE__ */ React34.createElement(IconPanelLeftOpen, null) : /* @__PURE__ */ React34.createElement(IconPanelLeftClose, null) }),
        /* @__PURE__ */ React34.createElement("span", { className: "aura-nav__label" }, collapsed ? t.expandNav : t.collapseNav)
      )) : props.collapsible ? /* @__PURE__ */ React34.createElement("div", { className: "aura-nav__toggle" }, /* @__PURE__ */ React34.createElement(
        IconButton,
        {
          icon: collapsed ? /* @__PURE__ */ React34.createElement(IconPanelLeftOpen, null) : /* @__PURE__ */ React34.createElement(IconPanelLeftClose, null),
          label: collapsed ? t.expandNav : t.collapseNav,
          size: "md",
          onClick: function() {
            setTip(null);
            col[1](!collapsed);
          }
        }
      )) : null,
      tip && typeof document !== "undefined" ? (0, import_react_dom10.createPortal)(
        /* @__PURE__ */ React34.createElement(
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
  var React35 = __toESM(require_react(), 1);
  var Breadcrumb = React35.forwardRef(function Breadcrumb2(props, ref) {
    const t = useStrings();
    const Link = useLinkComponent(props.linkComponent);
    const items2 = props.items || [];
    const collapsible = !!props.collapseBelow && items2.length > 2;
    const trail = items2.map(function(it) {
      return it.label + "" + (it.href || "");
    }).join("");
    const st = React35.useState(null), expanded = st[0] === trail, setExpanded = function() {
      st[1](trail);
    };
    const listRef = React35.useRef(null);
    const focusNext = React35.useRef(false);
    React35.useEffect(
      function() {
        if (!expanded || !focusNext.current) return;
        focusNext.current = false;
        const ol = listRef.current;
        if (!ol) return;
        let target = ol.querySelector(".aura-crumbs__middle a, .aura-crumbs__middle button");
        if (!target) {
          target = ol.querySelector(".aura-crumbs__middle > *");
          if (target) target.tabIndex = -1;
        }
        if (target) target.focus();
      },
      [expanded]
    );
    const sep = /* @__PURE__ */ React35.createElement(Icon, { name: /* @__PURE__ */ React35.createElement(IconChevronRight, null), size: 12, className: "aura-crumbs__sep" });
    const more = collapsible && !expanded ? /* @__PURE__ */ React35.createElement("li", { key: "more", className: "aura-crumbs__more" }, /* @__PURE__ */ React35.createElement(
      "button",
      {
        type: "button",
        "aria-label": t.breadcrumbMore,
        onClick: function() {
          focusNext.current = true;
          setExpanded();
        }
      },
      "\u2026"
    ), sep) : null;
    const out = [];
    items2.forEach(function(it, i) {
      const last = i === items2.length - 1;
      const lp = it.linkProps || {};
      const plain = lp;
      const own = lp.onClick;
      const click = own || it.onClick ? function(e) {
        if (own) own(e);
        if (it.onClick) it.onClick();
      } : void 0;
      out.push(
        /* @__PURE__ */ React35.createElement(
          "li",
          {
            key: i,
            ...it.itemProps,
            className: cx(it.itemProps && it.itemProps.className, collapsible && !last && i > 0 && "aura-crumbs__middle") || void 0
          },
          last ? /* @__PURE__ */ React35.createElement("span", { ...plain, "aria-current": "page", className: cx("aura-crumbs__current", lp.className) }, it.label) : it.href ? /* @__PURE__ */ React35.createElement(Link, { ...lp, href: it.href, onClick: click }, it.label) : it.onClick ? /* @__PURE__ */ React35.createElement("button", { ...lp, type: "button", onClick: click }, it.label) : (
            /* 5.7: a segment with no page and no action is text, not a button that does nothing. */
            /* @__PURE__ */ React35.createElement("span", { ...plain, className: cx("aura-crumbs__text", lp.className) }, it.label)
          ),
          last ? null : sep
        )
      );
      if (i === 0 && more) out.push(more);
    });
    return /* @__PURE__ */ React35.createElement(
      "nav",
      {
        ref,
        "aria-label": props.label || t.breadcrumb,
        className: cx(
          "aura-crumbs",
          collapsible && !expanded && "aura-crumbs--collapse-" + props.collapseBelow,
          props.className
        )
      },
      /* @__PURE__ */ React35.createElement("ol", { ref: listRef }, out)
    );
  });

  // src/Avatar.tsx
  var React36 = __toESM(require_react(), 1);
  var Avatar = React36.forwardRef(function Avatar2(props, ref) {
    const errState = React36.useState(null);
    return avatarElement(props, ref, errState[0], function() {
      errState[1](props.src || null);
    });
  });

  // src/Stack.tsx
  var React38 = __toESM(require_react(), 1);

  // src/responsive.tsx
  var React37 = __toESM(require_react(), 1);

  // src/breakpoints.ts
  var breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280 };

  // src/responsive.tsx
  var ORDER = ["base", "sm", "md", "lg", "xl"];
  function useBreakpoint() {
    return React37.useSyncExternalStore(subscribe, current, function() {
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
    const map2 = value;
    for (let i = ORDER.indexOf(bp); i >= 0; i--) if (map2[ORDER[i]] !== void 0) return map2[ORDER[i]];
    return void 0;
  }
  function respVars(prefix, value, map2) {
    const style = {};
    if (value == null) return style;
    if (typeof value !== "object") value = { base: value };
    let byBp = value, cur;
    ORDER.forEach(function(k) {
      if (byBp[k] !== void 0) cur = map2 ? map2(byBp[k]) : byBp[k];
      if (cur !== void 0) style["--" + prefix + "-" + k] = cur;
    });
    return style;
  }
  var space = function(v) {
    return typeof v === "number" ? "var(--aura-space-" + v + ")" : v;
  };

  // src/Stack.tsx
  var h5 = React38.createElement;
  var Stack = React38.forwardRef(function Stack2(props, ref) {
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
  var React39 = __toESM(require_react(), 1);
  var h6 = React39.createElement;
  var Grid = React39.forwardRef(function Grid2(props, ref) {
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
  var React40 = __toESM(require_react(), 1);
  var h7 = React40.createElement;
  var Container = React40.forwardRef(function Container2(props, ref) {
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
  var React41 = __toESM(require_react(), 1);
  var AppShell = React41.forwardRef(function AppShell2(props, ref) {
    const t = useStrings();
    const bp = useBreakpoint();
    const wide = bp === "lg" || bp === "xl";
    const st = React41.useState(false), open = st[0], setOpen = st[1];
    React41.useEffect(
      function() {
        if (wide) setOpen(false);
      },
      [wide]
    );
    const navEl = props.nav && React41.isValidElement(props.nav) ? props.nav : null;
    const shared = !!navEl && navEl.props.value === void 0 && (navEl.props.defaultValue !== void 0 || navEl.props.sections !== void 0 || navEl.props.items !== void 0);
    const navState = React41.useState(navEl ? navEl.props.defaultValue : void 0);
    function onNav(id) {
      if (shared) navState[1](id);
      if (navEl && navEl.props.onChange) navEl.props.onChange(id);
    }
    const rootRef = React41.useRef(null);
    const barRef = React41.useRef(null);
    const mergedRef = useMergedRef(ref, rootRef);
    const hasBar = !!(props.header || props.nav);
    useIsoLayoutEffect(
      function() {
        const root = rootRef.current, bar = barRef.current;
        if (!root || !bar) return;
        function sync() {
          root.style.setProperty("--aura-shell-bar-height", bar.getBoundingClientRect().height + "px");
        }
        sync();
        const ro = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(sync);
        if (ro) ro.observe(bar);
        return function() {
          if (ro) ro.disconnect();
          root.style.removeProperty("--aura-shell-bar-height");
        };
      },
      [hasBar]
    );
    const deskNav = navEl && shared ? React41.cloneElement(navEl, { value: navState[0], onChange: onNav }) : props.nav;
    const drawerNav = navEl ? React41.cloneElement(navEl, {
      value: shared ? navState[0] : navEl.props.value,
      onChange: function(id) {
        onNav(id);
        setOpen(false);
      },
      /* 5.16: an action row (Sign out) closes the drawer too. */
      onAction: function(id) {
        setOpen(false);
        if (navEl.props.onAction) navEl.props.onAction(id);
      },
      className: cx(navEl.props.className, "is-in-drawer"),
      collapsed: false,
      collapsible: false
    }) : props.nav;
    return /* @__PURE__ */ React41.createElement(
      "div",
      {
        ref: mergedRef,
        className: cx(
          "aura-shell",
          props.bottomNav && "aura-shell--bottomnav",
          /* 5.14: no top bar at all, or one that only holds the menu button (gone from lg up): the bar-height token is 0. */
          !props.header && !props.nav && "aura-shell--no-bar",
          !props.header && props.nav && "aura-shell--menu-bar",
          props.className
        )
      },
      props.nav ? /* @__PURE__ */ React41.createElement("div", { className: "aura-shell__nav" }, deskNav) : null,
      props.nav ? /* @__PURE__ */ React41.createElement(
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
      ) : null,
      /* @__PURE__ */ React41.createElement("div", { className: "aura-shell__main" }, props.header || props.nav ? /* @__PURE__ */ React41.createElement("header", { ref: barRef, className: cx("aura-shell__bar", !props.header && "aura-shell__bar--menu-only") }, props.nav ? /* @__PURE__ */ React41.createElement(
        IconButton,
        {
          className: "aura-shell__menu",
          icon: /* @__PURE__ */ React41.createElement(IconMenu, null),
          label: props.menuLabel || t.openNav,
          size: "md",
          onClick: function() {
            setOpen(true);
          },
          "aria-expanded": open
        }
      ) : null, /* @__PURE__ */ React41.createElement("div", { className: "aura-shell__bar-content" }, props.header)) : null, /* @__PURE__ */ React41.createElement(
        "main",
        {
          className: cx("aura-shell__content", props.contentPadding === false && "is-flush"),
          id: props.mainId || "main",
          tabIndex: -1
        },
        props.children
      ), props.bottomNav || null)
    );
  });

  // src/ActionBar.tsx
  var React42 = __toESM(require_react(), 1);
  var ActionBar = React42.forwardRef(function ActionBar2(props, ref) {
    const t = useStrings();
    const bulk = props.selected != null;
    const idle = bulk && !props.selected;
    const count = bulk && props.selected ? t.selectedCount(props.selected) : null;
    const hasStart = React42.Children.toArray(props.start).some(function(c) {
      return c !== "";
    });
    const cameFrom = React42.useRef(null);
    const own = React42.useRef(null);
    function clear() {
      props.onClearSelection();
      setTimeout(function() {
        const back = cameFrom.current;
        const a = document.activeElement;
        if ((!a || a === document.body || !a.isConnected) && back && back.isConnected) back.focus();
      }, 0);
    }
    return /* @__PURE__ */ React42.createElement(
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
      /* @__PURE__ */ React42.createElement("div", { className: cx("aura-actionbar__inner", hasStart && "has-start") }, /* @__PURE__ */ React42.createElement("div", { className: "aura-actionbar__status", role: "status" }, count, count && props.status ? " \xB7 " : null, props.status), !idle && hasStart ? /* @__PURE__ */ React42.createElement("div", { className: "aura-actionbar__start" }, props.start) : null, !idle ? /* @__PURE__ */ React42.createElement("div", { className: "aura-actionbar__actions" }, count && props.onClearSelection ? /* @__PURE__ */ React42.createElement(Button, { variant: "ghost", size: "sm", onClick: clear }, t.clear()) : null, props.children) : null)
    );
  });

  // src/Separator.tsx
  var React43 = __toESM(require_react(), 1);
  var Separator = React43.forwardRef(function Separator2(props, ref) {
    const vertical = props.orientation === "vertical";
    const decorative = props.decorative !== false;
    return /* @__PURE__ */ React43.createElement(
      "div",
      {
        ref,
        className: cx("aura-separator", vertical && "aura-separator--vertical", props.className),
        role: decorative ? "none" : "separator",
        "aria-orientation": !decorative && vertical ? "vertical" : void 0,
        style: props.spacing != null ? { ["--aura-separator-space"]: "var(--aura-space-" + props.spacing + ")" } : void 0
      }
    );
  });

  // src/Table.tsx
  var React44 = __toESM(require_react(), 1);
  var StackLabels = React44.createContext(null);
  var ColumnIndex = React44.createContext(-1);
  function flat(children) {
    const out = [];
    React44.Children.toArray(children).forEach(function(c) {
      if (React44.isValidElement(c) && c.type === React44.Fragment)
        out.push.apply(out, flat(c.props.children));
      else out.push(c);
    });
    return out;
  }
  function text(node) {
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) {
      const parts = node.map(text).filter(function(x) {
        return x != null;
      });
      return parts.length ? parts.join("") : void 0;
    }
    if (React44.isValidElement(node)) {
      const p = node.props;
      if (p["aria-hidden"] === true || p["aria-hidden"] === "true") return void 0;
      return text(p.children);
    }
    return void 0;
  }
  function headerLabels(children) {
    let out = [];
    flat(children).forEach(function(c) {
      if (out.length || !React44.isValidElement(c) || c.type !== THead) return;
      const row = flat(c.props.children).find(function(r) {
        return React44.isValidElement(r);
      });
      if (!row) return;
      flat(row.props.children).forEach(function(cell) {
        if (!React44.isValidElement(cell)) return;
        const p = cell.props;
        const t = text(p.children);
        const label = p.label != null ? p.label : t != null ? t.replace(/\s+/g, " ").trim() || void 0 : void 0;
        const span = Math.max(1, Number(p.colSpan) || 1);
        for (let i = 0; i < span; i++) out.push(label);
      });
    });
    return out;
  }
  var Table = React44.forwardRef(function Table2(props, ref) {
    const {
      caption,
      captionHidden,
      density,
      stackBelow,
      align,
      bordered,
      stackStyle,
      rowHeight,
      className,
      children,
      ...rest
    } = props;
    const cards = !!stackBelow && stackStyle === "cards";
    const labels = stackBelow ? headerLabels(children) : null;
    if (labels && !labels.length)
      devWarnOnce(
        "tbl-stack-labels",
        "Table stackBelow: no THead > Tr > Th found among its children, so cells have no labels. Pass `label` on each Td."
      );
    const outer = React44.useContext(StackLabels);
    const pageDensity = useDensity();
    const capId = uid();
    const wrap = React44.useRef(null);
    const sc = React44.useState(false), scrolls = sc[0];
    useIsoLayoutEffect(function() {
      const el = wrap.current;
      if (!el || typeof ResizeObserver === "undefined") return;
      function check() {
        sc[1](el.scrollWidth > el.clientWidth + 1);
      }
      check();
      const ro = new ResizeObserver(check);
      ro.observe(el);
      return function() {
        ro.disconnect();
      };
    }, []);
    const table = /* @__PURE__ */ React44.createElement(
      "div",
      {
        ref: wrap,
        className: cx("aura-tbl-wrap", stackBelow && "is-stackable", bordered === false && "is-flush"),
        "data-density": density || pageDensity,
        tabIndex: scrolls ? 0 : void 0,
        role: scrolls && (caption != null || rest["aria-label"]) ? "region" : void 0,
        "aria-labelledby": scrolls && caption != null ? capId : void 0,
        "aria-label": scrolls && caption == null ? rest["aria-label"] : void 0
      },
      /* @__PURE__ */ React44.createElement(
        "table",
        {
          ref,
          className: cx(
            "aura-tbl",
            stackBelow && "aura-tbl--stack-" + stackBelow,
            /* 5.21: even rows centre their content, as DataTable's auto rows do, unless `align="top"` is asked for. */
            (align === "middle" || rowHeight === "density" && align !== "top") && "aura-tbl--middle",
            rowHeight === "density" && "aura-tbl--row-density",
            cards && "aura-tbl--cards",
            className
          ),
          role: stackBelow ? "table" : void 0,
          ...rest
        },
        caption != null ? /* @__PURE__ */ React44.createElement("caption", { id: capId, className: cx("aura-tbl__caption", captionHidden && "aura-sr-only") }, caption) : null,
        labels ? /* @__PURE__ */ React44.createElement(StackLabels.Provider, { value: labels }, children) : outer ? /* @__PURE__ */ React44.createElement(StackLabels.Provider, { value: null }, children) : children
      )
    );
    return cards ? /* @__PURE__ */ React44.createElement("div", { className: "aura-tbl-cards aura-tbl-cards--" + stackBelow }, table) : table;
  });
  function section(tag, cls) {
    const C = React44.forwardRef(function TableSection(props, ref) {
      const { className, ...rest } = props;
      const stacked = React44.useContext(StackLabels) != null;
      return React44.createElement(
        tag,
        Object.assign({ ref, className: cx(cls, className), role: stacked ? "rowgroup" : void 0 }, rest)
      );
    });
    return C;
  }
  var THead = section("thead", "aura-tbl__head");
  THead.displayName = "THead";
  var TBody = section("tbody", "aura-tbl__body");
  TBody.displayName = "TBody";
  var TFoot = section("tfoot", "aura-tbl__foot");
  TFoot.displayName = "TFoot";
  var Tr = React44.forwardRef(function Tr2(props, ref) {
    const { className, children, ...rest } = props;
    const stacked = React44.useContext(StackLabels) != null;
    let col = 0;
    return /* @__PURE__ */ React44.createElement("tr", { ref, className: cx("aura-tbl__row", className), role: stacked ? "row" : void 0, ...rest }, stacked ? flat(children).map(function(c) {
      const at = col;
      if (React44.isValidElement(c)) col += Math.max(1, Number(c.props.colSpan) || 1);
      return /* @__PURE__ */ React44.createElement(ColumnIndex.Provider, { key: React44.isValidElement(c) && c.key != null ? c.key : at, value: at }, c);
    }) : children);
  });
  function cellClass(base, p) {
    const align = p.align || (p.numeric ? "end" : void 0);
    return cx(
      base,
      align === "end" && "is-end",
      align === "center" && "is-center",
      p.numeric && "is-numeric",
      p.mono && "aura-table__mono",
      p.className
    );
  }
  var Th = React44.forwardRef(function Th2(props, ref) {
    const { align, numeric, mono, className, scope, label, card, ...rest } = props;
    const stacked = React44.useContext(StackLabels) != null;
    return /* @__PURE__ */ React44.createElement(
      "th",
      {
        ref,
        scope: scope || "col",
        className: cellClass("aura-tbl__th", props),
        role: stacked ? scope === "row" ? "rowheader" : "columnheader" : void 0,
        "data-card": stacked && (card === "title" || card === "action") ? card : void 0,
        ...rest
      }
    );
  });
  var Td = React44.forwardRef(function Td2(props, ref) {
    const { align, numeric, mono, className, scope, label, card, ...rest } = props;
    const labels = React44.useContext(StackLabels), col = React44.useContext(ColumnIndex);
    const slot = labels && (card === "title" || card === "action") ? card : void 0;
    const shown = labels && !slot ? label != null ? label : col >= 0 ? labels[col] : void 0 : void 0;
    return /* @__PURE__ */ React44.createElement(
      "td",
      {
        ref,
        className: cellClass("aura-tbl__td", props),
        role: labels ? "cell" : void 0,
        "data-label": shown || void 0,
        "data-card": slot,
        ...rest
      }
    );
  });

  // src/BottomNav.tsx
  var React45 = __toESM(require_react(), 1);
  var BottomNav = React45.forwardRef(function BottomNav2(props, ref) {
    const t = useStrings();
    const Link = useLinkComponent(props.linkComponent);
    const st = useMaybeControlled(
      props.value,
      props.defaultValue,
      props.onChange
    );
    const active = st[0];
    const hide = props.hideFrom === false ? "always" : "below-" + (props.hideFrom || "lg");
    return /* @__PURE__ */ React45.createElement(React45.Fragment, null, /* @__PURE__ */ React45.createElement("div", { className: cx("aura-bottomnav-spacer", "aura-bottomnav--" + hide), "aria-hidden": "true" }), /* @__PURE__ */ React45.createElement(
      "nav",
      {
        ref,
        className: cx("aura-bottomnav", "aura-bottomnav--" + hide, props.className),
        "aria-label": props.label || t.mainNav
      },
      /* @__PURE__ */ React45.createElement("ul", { className: "aura-bottomnav__list" }, props.items.map(function(it) {
        const on = active === it.id;
        const count = it.count != null && it.count > 0 ? it.count > 99 ? "99+" : String(it.count) : null;
        const suffix = count || it.badge && it.badgeLabel ? " (" + (count || it.badgeLabel) + ")" : "";
        const common = {
          className: cx("aura-bottomnav__item", on && "is-active"),
          /* 5.7: a full name when the label is shortened; the count / badge words still follow. */
          "aria-label": it.ariaLabel ? it.ariaLabel + suffix : void 0,
          "aria-current": on ? "page" : void 0,
          onClick: function(e) {
            if (!it.href) e.preventDefault();
            else if (!plainClick(e)) return;
            st[1](it.id);
          }
        };
        const inner = [
          /* @__PURE__ */ React45.createElement("span", { key: "i", className: "aura-bottomnav__icon" }, /* @__PURE__ */ React45.createElement(Icon, { name: it.icon, size: "md" }), count ? /* @__PURE__ */ React45.createElement("span", { className: "aura-bottomnav__count", "aria-hidden": "true" }, count) : it.badge ? /* @__PURE__ */ React45.createElement("span", { className: "aura-bottomnav__dot", "aria-hidden": "true" }) : null),
          /* @__PURE__ */ React45.createElement("span", { key: "l", className: "aura-bottomnav__label" }, it.label),
          suffix && !it.ariaLabel ? /* @__PURE__ */ React45.createElement("span", { key: "s", className: "aura-sr-only" }, suffix) : null
        ];
        return /* @__PURE__ */ React45.createElement("li", { key: it.id, className: "aura-bottomnav__cell" }, it.href ? /* @__PURE__ */ React45.createElement(Link, { href: it.href, ...common }, inner) : /* @__PURE__ */ React45.createElement("button", { type: "button", ...common }, inner));
      }))
    ));
  });

  // src/Surface.tsx
  var React46 = __toESM(require_react(), 1);
  var h8 = React46.createElement;
  var Surface = React46.forwardRef(function Surface2(props, ref) {
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
  var React47 = __toESM(require_react(), 1);
  var Stat = React47.forwardRef(function Stat2(props, ref) {
    const Link = useLinkComponent(props.linkComponent);
    return statElement(props, ref, Link);
  });

  // src/TimePicker.tsx
  var React48 = __toESM(require_react(), 1);
  var import_react_dom11 = __toESM(require_react_dom(), 1);

  // src/text.ts
  function formatBytes(n3) {
    if (n3 == null) return "";
    if (n3 < 1024) return n3 + " B";
    let u = ["KB", "MB", "GB"], i = -1;
    do {
      n3 /= 1024;
      i++;
    } while (n3 >= 1024 && i < u.length - 1);
    return (n3 >= 10 || Math.round(n3) === n3 ? Math.round(n3) : n3.toFixed(1)) + " " + u[i];
  }
  function pad2(n3) {
    return (n3 < 10 ? "0" : "") + n3;
  }
  function parseTime(text2) {
    let s = String(text2 || "").trim().toLowerCase().replace(/\s*(น\.?|นาฬิกา)$/, "").trim();
    const pm = /\s*(pm|p\.m\.)$/.test(s), am = /\s*(am|a\.m\.)$/.test(s);
    s = s.replace(/\s*(am|pm|a\.m\.|p\.m\.)$/, "");
    const m = /^(\d{1,2})(?:[:.](\d{2}))?$/.exec(s) || /^(\d{1,2})(\d{2})$/.exec(s);
    if (!m) return null;
    let hh = +m[1], mm = m[2] ? +m[2] : 0;
    if ((am || pm) && (hh < 1 || hh > 12)) return null;
    if (pm && hh < 12) hh += 12;
    if (am && hh === 12) hh = 0;
    if (hh > 23 || mm > 59) return null;
    return pad2(hh) + ":" + pad2(mm);
  }

  // src/TimePicker.tsx
  function pad3(n3) {
    return (n3 < 10 ? "0" : "") + n3;
  }
  function toMin(t) {
    const m = /^(\d{2}):(\d{2})$/.exec(t || "");
    return m ? +m[1] * 60 + +m[2] : null;
  }
  function fromMin(n3) {
    return pad3(Math.floor(n3 / 60)) + ":" + pad3(n3 % 60);
  }
  var TimePicker = React48.forwardRef(function TimePicker2(props, ref) {
    const t = useStrings();
    const auto = uid(), id = props.id || auto, listId = id + "-list";
    const st = useMaybeControlled(
      props.value,
      props.defaultValue == null ? null : props.defaultValue,
      props.onChange
    );
    const value = st[0];
    const step = props.step || 30, lo = toMin(props.min) != null ? toMin(props.min) : 0, hi = toMin(props.max) != null ? toMin(props.max) : 24 * 60 - 1;
    const slots = React48.useMemo(
      function() {
        const out = [];
        for (let m = lo; m <= hi; m += step) out.push(fromMin(m));
        return out;
      },
      [lo, hi, step]
    );
    function blocked(v) {
      const n3 = toMin(v);
      return n3 == null || n3 < lo || n3 > hi || props.isTimeDisabled && props.isTimeDisabled(v);
    }
    const openState = React48.useState(false), open = openState[0], setOpen = openState[1];
    const editState = React48.useState(null), editing = editState[0], setEditing = editState[1];
    const aState = React48.useState(0), active = aState[0], setActive = aState[1];
    const errState = React48.useState(null);
    const pos = React48.useState(null);
    const boxRef = React48.useRef(null), inputRef = React48.useRef(null), listRef = React48.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    const mounted = useMounted();
    function nearest(v) {
      const n3 = toMin(v);
      if (n3 == null) return 0;
      let best = 0;
      slots.forEach(function(s, i) {
        if (Math.abs(toMin(s) - n3) < Math.abs(toMin(slots[best]) - n3)) best = i;
      });
      return best;
    }
    function place() {
      if (!boxRef.current) return;
      const r = boxRef.current.getBoundingClientRect(), below2 = window.innerHeight - r.bottom - 8, up = below2 < 200 && r.top > below2;
      pos[1]({
        left: r.left,
        width: Math.max(r.width, 160),
        top: up ? void 0 : r.bottom + 4,
        bottom: up ? window.innerHeight - r.top + 4 : void 0,
        maxHeight: Math.min(280, (up ? r.top : below2) - 8)
      });
    }
    useIsoLayoutEffect(
      function() {
        if (open) place();
      },
      [open]
    );
    React48.useEffect(
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
    React48.useEffect(
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
        const n3 = toMin(v);
        errState[1](n3 != null && n3 >= lo && n3 <= hi ? t.timeUnavailable : t.timeOutOfRange(fromMin(lo), fromMin(hi)));
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
    const list = open && mounted && pos[0] ? (0, import_react_dom11.createPortal)(
      /* @__PURE__ */ React48.createElement("div", { ref: listRef, className: "aura-combo__popover aura-time__popover", style: pos[0] }, /* @__PURE__ */ React48.createElement("ul", { id: listId, role: "listbox", "aria-label": props.label, className: "aura-combo__list" }, slots.map(function(s, i) {
        const dis = blocked(s), sel = s === value;
        return /* @__PURE__ */ React48.createElement(
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
          /* @__PURE__ */ React48.createElement("span", { className: "aura-combo__label" }, s),
          sel ? /* @__PURE__ */ React48.createElement(Icon, { name: /* @__PURE__ */ React48.createElement(IconCheck, null), className: "aura-combo__check" }) : null
        );
      }))),
      document.body
    ) : null;
    return /* @__PURE__ */ React48.createElement(
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
      /* @__PURE__ */ React48.createElement("div", { ref: boxRef, className: cx("aura-input aura-combo aura-time has-icon", open && "is-open") }, /* @__PURE__ */ React48.createElement(Icon, { name: /* @__PURE__ */ React48.createElement(IconClock, null), className: "aura-input__icon" }), /* @__PURE__ */ React48.createElement(
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
      ), props.clearable !== false && value != null && !props.disabled ? /* @__PURE__ */ React48.createElement(
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
        /* @__PURE__ */ React48.createElement(Icon, { name: /* @__PURE__ */ React48.createElement(IconX, null) })
      ) : null, /* @__PURE__ */ React48.createElement(
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
        /* @__PURE__ */ React48.createElement(Icon, { name: /* @__PURE__ */ React48.createElement(IconChevronDown, null) })
      )),
      list
    );
  });

  // src/FileUpload.tsx
  var React49 = __toESM(require_react(), 1);
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
  var FileUpload = React49.forwardRef(function FileUpload2(props, ref) {
    const t = useStrings();
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(props.value, props.defaultValue || [], props.onChange);
    const items2 = st[0] || [];
    const dragState = React49.useState(false), over = dragState[0];
    const inputRef = React49.useRef(null), inputMerged = useMergedRef(ref, inputRef);
    const urls = React49.useRef({});
    const maxFiles = props.multiple ? props.maxFiles : 1;
    const note = t.accepts(describeAccept(props.accept, t), props.maxSize ? formatBytes(props.maxSize) : "");
    React49.useEffect(function() {
      return function() {
        Object.keys(urls.current).forEach(function(k) {
          URL.revokeObjectURL(urls.current[k]);
        });
      };
    }, []);
    React49.useEffect(
      function() {
        const el = inputRef.current;
        if (!el || !props.name || typeof DataTransfer === "undefined") return;
        try {
          const dt = new DataTransfer();
          items2.forEach(function(i) {
            if (i.file && !i.error) dt.items.add(i.file);
          });
          el.files = dt.files;
        } catch (e) {
        }
      },
      [items2, props.name]
    );
    function thumb(it) {
      if (!it.file && it.url && /^image\//.test(it.type || "")) return it.url;
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
    return /* @__PURE__ */ React49.createElement(
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
      /* @__PURE__ */ React49.createElement(
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
        /* @__PURE__ */ React49.createElement(Icon, { name: /* @__PURE__ */ React49.createElement(IconCloudUpload, null), size: "lg", className: "aura-upload__icon" }),
        /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__text" }, t.dropFiles, " "),
        /* @__PURE__ */ React49.createElement(
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
        /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__browse", "aria-hidden": true }, props.multiple ? t.browse : t.browseOne),
        note ? /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__note", id: id + "-note" }, note) : null
      ),
      items2.length ? /* @__PURE__ */ React49.createElement("ul", { className: "aura-upload__list", "aria-live": "polite" }, items2.map(function(it) {
        const src = thumb(it);
        return /* @__PURE__ */ React49.createElement("li", { key: it.id, className: cx("aura-upload__item", it.error && "is-error") }, src ? /* @__PURE__ */ React49.createElement("img", { className: "aura-upload__thumb", src, alt: "" }) : /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__thumb is-icon", "aria-hidden": true }, /* @__PURE__ */ React49.createElement(Icon, { name: /^image\//.test(it.type || "") ? /* @__PURE__ */ React49.createElement(IconImage, null) : /* @__PURE__ */ React49.createElement(IconFile, null), size: "md" })), /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__meta" }, it.url && !it.error ? /* @__PURE__ */ React49.createElement("a", { className: "aura-upload__name", href: it.url, target: "_blank", rel: "noreferrer" }, it.name) : /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__name" }, it.name), /* @__PURE__ */ React49.createElement("span", { className: "aura-upload__sub" }, it.error ? /* @__PURE__ */ React49.createElement(React49.Fragment, null, /* @__PURE__ */ React49.createElement(Icon, { name: /* @__PURE__ */ React49.createElement(IconCircleAlert, null), size: 12 }), it.error) : it.status === "uploading" ? t.uploading + (it.progress != null ? " " + Math.round(it.progress) + "%" : "") : it.status === "done" ? /* @__PURE__ */ React49.createElement(React49.Fragment, null, /* @__PURE__ */ React49.createElement(Icon, { name: /* @__PURE__ */ React49.createElement(IconCircleCheck, null), size: 12 }), formatBytes(it.size)) : formatBytes(it.size)), it.status === "uploading" ? /* @__PURE__ */ React49.createElement(
          "span",
          {
            className: "aura-upload__bar",
            role: "progressbar",
            "aria-label": it.name,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-valuenow": it.progress != null ? Math.round(it.progress) : void 0
          },
          /* @__PURE__ */ React49.createElement("span", { style: { width: (it.progress || 0) + "%" } })
        ) : null), /* @__PURE__ */ React49.createElement(
          IconButton,
          {
            icon: /* @__PURE__ */ React49.createElement(IconX, null),
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
      const n3 = Math.round(Math.min(1, Math.max(0, v)) * 255);
      return (n3 < 16 ? "0" : "") + n3.toString(16);
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
      if (selector !== void 0 && /[<{};@\r\n]|\/\*|\*\//.test(selector))
        throw new Error('createTheme: "' + selector + '" is not a plain CSS selector');
      const light = selector ? selector : ':root, [data-theme="light"]';
      const dark = selector ? selector + ".dark, .dark " + selector + ", " + selector + '[data-theme="dark"], [data-theme="dark"] ' + selector : '.dark, [data-theme="dark"]';
      const system = selector ? '[data-theme="system"] ' + selector + ", " + selector + '[data-theme="system"]' : '[data-theme="system"]';
      function block(sel, m) {
        return sel + " {\n" + Object.keys(m).map(function(k) {
          return "  --aura-" + k + ": " + m[k] + ";";
        }).join("\n") + "\n}";
      }
      return "/* AURA theme" + (o.name ? ' "' + String(o.name).replace(/[*/<>\\]/g, "") + '"' : "") + ": brand " + o.brand + (o.signal ? ", signal " + o.signal : "") + (o.primary === "brand" ? ", brand primary buttons" : "") + ". Load after aura.css. Generated by createTheme. */\n" + block(light, L) + "\n" + block(dark, D) + "\n@media (prefers-color-scheme: dark) {\n" + block(system, D) + "\n}\n";
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
  var React50 = __toESM(require_react(), 1);
  function ThemeStyle(props) {
    const css = React50.useMemo(
      function() {
        try {
          return createTheme({
            brand: props.brand,
            signal: props.signal,
            primary: props.primary,
            name: props.name
          }).css(props.selector);
        } catch (e) {
          devWarnOnce("theme-style", "ThemeStyle ignored: " + e.message);
          return null;
        }
      },
      [props.brand, props.signal, props.primary, props.name, props.selector]
    );
    if (css === null) return null;
    return /* @__PURE__ */ React50.createElement("style", { "data-aura-theme": props.name || props.brand, dangerouslySetInnerHTML: { __html: css } });
  }

  // src/colorScheme.tsx
  var React51 = __toESM(require_react(), 1);

  // src/colorSchemeScript.ts
  var DEFAULT_KEY = "aura-color-scheme";
  var SCHEMES = ["light", "dark", "system"];
  var EVENT = "aura-color-scheme";
  function valid(v) {
    return typeof v === "string" && SCHEMES.indexOf(v) >= 0;
  }
  function colorSchemeScript(options) {
    const key = JSON.stringify(options && options.storageKey || DEFAULT_KEY).replace(/</g, "\\u003c");
    const fallback = JSON.stringify(options && options.defaultScheme || "system").replace(/</g, "\\u003c");
    return "(function(){try{var s=localStorage.getItem(" + key + ");if(s!=='light'&&s!=='dark'&&s!=='system')s=" + fallback + `;var d=document.documentElement;d.setAttribute("data-theme",s);var m=window.matchMedia('(prefers-color-scheme: dark)');d.classList.toggle('dark',s==='dark'||(s==='system'&&m.matches));if(m.addEventListener)m.addEventListener('change',function(e){if(d.getAttribute('data-theme')==='system')d.classList.toggle('dark',e.matches)});}catch(e){}})();`;
  }

  // src/colorScheme.tsx
  function ColorSchemeScript(props) {
    return /* @__PURE__ */ React51.createElement(
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
    const subscribe2 = React51.useCallback(
      function(cb) {
        const mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
        function onSystem() {
          if (readScheme(fallback) === "system") apply("system");
          cb();
        }
        function onStorage(e) {
          if (e.key === key) apply(valid(e.newValue) ? e.newValue : fallback);
          cb();
        }
        if (mq) mq.addEventListener("change", onSystem);
        window.addEventListener(EVENT, cb);
        window.addEventListener("storage", onStorage);
        return function() {
          if (mq) mq.removeEventListener("change", onSystem);
          window.removeEventListener(EVENT, cb);
          window.removeEventListener("storage", onStorage);
        };
      },
      [fallback, key]
    );
    const snapshot = React51.useSyncExternalStore(
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
    const setScheme = React51.useCallback(
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
    return /* @__PURE__ */ React51.createElement(
      DropdownMenu,
      {
        label,
        trigger: /* @__PURE__ */ React51.createElement(
          IconButton,
          {
            icon: cs.resolved === "dark" ? /* @__PURE__ */ React51.createElement(IconMoon, null) : /* @__PURE__ */ React51.createElement(IconSun, null),
            label: label + ": " + names[cs.scheme]
          }
        ),
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
  var React52 = __toESM(require_react(), 1);
  var Badge = React52.forwardRef(function Badge2(props, ref) {
    return badgeElement(props, ref);
  });

  // src/Progress.tsx
  var React53 = __toESM(require_react(), 1);
  var Progress = React53.forwardRef(function Progress2(props, ref) {
    const t = useStrings();
    const auto = uid(), id = props.id || auto;
    const max = props.max || 100, det = props.value != null;
    const pct = det ? Math.max(0, Math.min(100, props.value / max * 100)) : 0;
    const sec = det && props.secondaryValue != null && props.secondaryValue > 0 ? props.secondaryValue : 0;
    const spct = sec ? Math.max(0, Math.min(100 - pct, sec / max * 100)) : 0;
    const valueText = props.valueText != null ? props.valueText : props.valueLabel != null ? String(props.valueLabel) : sec ? t.progressReserved(props.value, sec, max) : void 0;
    const shown = props.valueLabel != null ? props.valueLabel : det ? Math.round(pct) + "%" : null;
    return /* @__PURE__ */ React53.createElement(
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
      props.label || props.showValue && shown ? /* @__PURE__ */ React53.createElement("div", { className: "aura-progress__head" }, props.label ? /* @__PURE__ */ React53.createElement("span", { className: "aura-progress__label", id: id + "-label" }, props.label) : /* @__PURE__ */ React53.createElement("span", null), props.showValue && shown ? /* @__PURE__ */ React53.createElement("span", { className: "aura-progress__value" }, shown) : null) : null,
      /* @__PURE__ */ React53.createElement(
        "div",
        {
          className: cx("aura-progress__track", !det && "is-indeterminate"),
          role: "progressbar",
          "aria-labelledby": props.label ? id + "-label" : void 0,
          "aria-label": props.label ? void 0 : props["aria-label"],
          "aria-valuemin": det ? 0 : void 0,
          "aria-valuemax": det ? max : void 0,
          "aria-valuenow": det ? props.value : void 0,
          "aria-valuetext": det ? valueText : void 0
        },
        /* @__PURE__ */ React53.createElement("span", { className: "aura-progress__bar", style: det ? { width: pct + "%" } : void 0 }),
        sec ? /* @__PURE__ */ React53.createElement(
          "span",
          {
            className: "aura-progress__bar aura-progress__bar--reserved",
            style: { left: pct + "%", width: spct + "%" }
          }
        ) : null
      ),
      props.hint ? /* @__PURE__ */ React53.createElement("p", { className: "aura-progress__hint" }, props.hint) : null
    );
  });

  // src/Skeleton.tsx
  var React54 = __toESM(require_react(), 1);
  var Skeleton = React54.forwardRef(function Skeleton2(props, ref) {
    const v = props.variant || "text";
    if (v === "text" && (props.lines || 1) > 1) {
      const n3 = props.lines, rows = [];
      for (let i = 0; i < n3; i++)
        rows.push(/* @__PURE__ */ React54.createElement("span", { key: i, className: "aura-skel aura-skel--text", style: { width: i === n3 - 1 ? "60%" : "100%" } }));
      return /* @__PURE__ */ React54.createElement(
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
    return /* @__PURE__ */ React54.createElement("span", { ref, "aria-hidden": true, className: cx("aura-skel", "aura-skel--" + v, props.className), style });
  });

  // src/EmptyState.tsx
  var React55 = __toESM(require_react(), 1);
  var EmptyState = React55.forwardRef(function EmptyState2(props, ref) {
    return emptyStateElement(props, ref);
  });

  // src/Pagination.tsx
  var React56 = __toESM(require_react(), 1);
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
  var Pagination = React56.forwardRef(function Pagination2(props, ref) {
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
      return link ? /* @__PURE__ */ React56.createElement(
        Link,
        {
          href: link(p),
          onClick: function(e) {
            if (props.onChange && plainClick(e)) {
              e.preventDefault();
              go(p);
            }
          },
          ...common
        },
        label
      ) : /* @__PURE__ */ React56.createElement(
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
        return /* @__PURE__ */ React56.createElement(
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
      return /* @__PURE__ */ React56.createElement(
        Link,
        {
          href: link(p),
          rel,
          className: "aura-icon-btn",
          "aria-label": label,
          title: label,
          onClick: function(e) {
            if (props.onChange && plainClick(e)) {
              e.preventDefault();
              go(p);
            }
          }
        },
        /* @__PURE__ */ React56.createElement(Icon, { name: icon, size: "sm" })
      );
    }
    return /* @__PURE__ */ React56.createElement("nav", { ref, className: cx("aura-pagination", props.className), "aria-label": props.label || t.pagination }, arrow(page - 1, /* @__PURE__ */ React56.createElement(IconChevronLeft, null), t.prevPage, "prev", page <= 1), /* @__PURE__ */ React56.createElement("ol", { className: "aura-pagination__list" }, pageList(page, count, props.siblingCount == null ? 1 : props.siblingCount).map(function(p) {
      return typeof p === "number" ? /* @__PURE__ */ React56.createElement("li", { key: p }, item(p, p)) : /* @__PURE__ */ React56.createElement("li", { key: p, className: "aura-pagination__gap", "aria-hidden": true }, "\u2026");
    })), /* @__PURE__ */ React56.createElement("span", { className: "aura-pagination__compact", "aria-hidden": true }, t.page(page, count)), arrow(page + 1, /* @__PURE__ */ React56.createElement(IconChevronRight, null), t.nextPage, "next", page >= count));
  });

  // src/Accordion.tsx
  var React57 = __toESM(require_react(), 1);
  var Accordion = React57.forwardRef(function Accordion2(props, ref) {
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
      let i = btns.indexOf(document.activeElement), k = e.key, n3 = null;
      if (i < 0) return;
      if (k === "ArrowDown") n3 = btns[(i + 1) % btns.length];
      else if (k === "ArrowUp") n3 = btns[(i - 1 + btns.length) % btns.length];
      else if (k === "Home") n3 = btns[0];
      else if (k === "End") n3 = btns[btns.length - 1];
      if (n3) {
        e.preventDefault();
        n3.focus();
      }
    }
    return /* @__PURE__ */ React57.createElement("div", { ref, className: cx("aura-accordion", props.className), onKeyDown: onKey }, items2.map(function(it) {
      const on = open.indexOf(it.id) >= 0, bid = base + "-btn-" + it.id, pid = base + "-panel-" + it.id;
      return /* @__PURE__ */ React57.createElement("div", { key: it.id, className: cx("aura-accordion__item", on && "is-open") }, /* @__PURE__ */ React57.createElement(HT, { className: "aura-accordion__heading" }, /* @__PURE__ */ React57.createElement(
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
        it.icon ? /* @__PURE__ */ React57.createElement(Icon, { name: it.icon, className: "aura-accordion__lead" }) : null,
        /* @__PURE__ */ React57.createElement("span", { className: "aura-accordion__title" }, it.title, it.description ? /* @__PURE__ */ React57.createElement("span", { className: "aura-accordion__desc" }, it.description) : null),
        /* @__PURE__ */ React57.createElement(Icon, { name: /* @__PURE__ */ React57.createElement(IconChevronDown, null), className: "aura-accordion__chevron" })
      )), /* @__PURE__ */ React57.createElement("div", { id: pid, role: "region", "aria-labelledby": bid, className: "aura-accordion__panel", hidden: !on }, it.content));
    }));
  });

  // src/Popover.tsx
  var React58 = __toESM(require_react(), 1);
  var import_react_dom12 = __toESM(require_react_dom(), 1);
  function position(anchor, pop, placement) {
    const r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.scrollHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 6;
    let side = (placement || "bottom-start").split("-")[0], align = (placement || "bottom-start").split("-")[1] || "start";
    if (side === "bottom" && r.bottom + gap + ph > vh - 8 && r.top - gap - ph > 8) side = "top";
    else if (side === "top" && r.top - gap - ph < 8 && r.bottom + gap + ph < vh - 8) side = "bottom";
    const below2 = vh - r.bottom - gap - 8, above = r.top - gap - 8;
    let maxHeight;
    if (ph > below2 && ph > above) {
      side = above > below2 ? "top" : "bottom";
      maxHeight = Math.max(120, side === "top" ? above : below2);
    }
    const h9 = maxHeight ? Math.min(ph, maxHeight) : ph;
    const top = side === "top" ? r.top - gap - h9 : r.bottom + gap;
    const left = align === "end" ? r.right - pw : align === "center" ? r.left + r.width / 2 - pw / 2 : r.left;
    return { top: Math.max(8, top), left: Math.max(8, Math.min(left, vw - pw - 8)), side, maxHeight };
  }
  var Popover = React58.forwardRef(function Popover2(props, ref) {
    const t = useStrings();
    const density = useDensity();
    const auto = uid(), id = props.id || auto;
    const st = useMaybeControlled(props.open, !!props.defaultOpen, props.onOpenChange);
    const open = !!st[0];
    const wrap = React58.useRef(null), pop = React58.useRef(null), popMerged = useMergedRef(ref, pop);
    const pos = React58.useState(null), mounted = useMounted();
    const inTree = React58.useRef(false);
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
    React58.useEffect(
      function() {
        if (!open || !mounted) return;
        if (props.autoFocus !== false && pop.current) {
          const f = pop.current.querySelector("[data-autofocus]") || pop.current.querySelector(FOCUSABLE);
          (f || pop.current).focus();
        }
        let timer;
        function outside(e) {
          if (pop.current && pop.current.contains(e.target)) return;
          if (wrap.current && wrap.current.contains(e.target)) return;
          inTree.current = false;
          clearTimeout(timer);
          timer = setTimeout(function() {
            if (!inTree.current) close(false);
          }, 0);
        }
        document.addEventListener("pointerdown", outside, true);
        return function() {
          clearTimeout(timer);
          document.removeEventListener("pointerdown", outside, true);
        };
      },
      [open, mounted]
    );
    const child = React58.Children.only(props.trigger);
    const panel = open && mounted ? (0, import_react_dom12.createPortal)(
      /* @__PURE__ */ React58.createElement(
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
          onPointerDownCapture: function() {
            inTree.current = true;
          },
          className: cx("aura-popover", pos[0] && "is-" + pos[0].side, props.className),
          style: Object.assign(
            {
              top: pos[0] ? pos[0].top : -9999,
              left: pos[0] ? pos[0].left : -9999,
              maxHeight: pos[0] && pos[0].maxHeight ? pos[0].maxHeight : void 0
            },
            props.width ? { width: props.width } : null
          ),
          onKeyDown: function(e) {
            if (e.key === "Escape") {
              e.stopPropagation();
              close(true);
            } else trapTab(e, pop.current);
          }
        },
        props.title ? /* @__PURE__ */ React58.createElement("div", { className: "aura-popover__head" }, /* @__PURE__ */ React58.createElement("p", { className: "aura-popover__title", id: id + "-title" }, props.title), /* @__PURE__ */ React58.createElement(
          IconButton,
          {
            icon: /* @__PURE__ */ React58.createElement(IconX, null),
            label: t.close,
            onClick: function() {
              close(true);
            }
          }
        )) : null,
        /* @__PURE__ */ React58.createElement("div", { className: "aura-popover__body" }, typeof props.children === "function" ? props.children({
          close: function() {
            close(true);
          }
        }) : props.children)
      ),
      document.body
    ) : null;
    return /* @__PURE__ */ React58.createElement("span", { ref: wrap, className: "aura-popover-anchor" }, React58.cloneElement(child, {
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
  var React59 = __toESM(require_react(), 1);
  function decimalsOf(n3) {
    const s = String(n3);
    const i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  }
  function parse(text2) {
    let t = text2.trim();
    if (t.indexOf(".") < 0 && /^-?\d+,\d+$/.test(t.replace(/[\s ]/g, "")) && !/,\d{3}$/.test(t)) t = t.replace(",", ".");
    const s = t.replace(/[,\s ]/g, "");
    if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return Number(s);
  }
  var NumberField = React59.forwardRef(function NumberField2(props, ref) {
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
    const draftState = React59.useState(null), draft = draftState[0], setDraft = draftState[1];
    function fmt2(n3) {
      if (n3 == null || isNaN(n3)) return "";
      return n3.toLocaleString("en", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    function fit2(n3) {
      let v = n3;
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
    return /* @__PURE__ */ React59.createElement(
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
      /* @__PURE__ */ React59.createElement("div", { className: cx("aura-input aura-number", stepper && "has-stepper") }, props.prefix != null ? /* @__PURE__ */ React59.createElement("span", { className: "aura-number__affix", "aria-hidden": true }, props.prefix) : null, /* @__PURE__ */ React59.createElement(
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
            const text2 = e.target.value;
            setDraft(text2);
            if (!text2.trim()) setValue(null);
            else {
              const n3 = parse(text2);
              if (!isNaN(n3)) setValue(n3);
            }
          },
          onBlur: function(e) {
            const n3 = draft == null ? value : !draft.trim() ? null : parse(draft);
            if (n3 == null) {
              if (value != null) setValue(null);
            } else if (!isNaN(n3)) {
              const f = fit2(n3);
              if (f !== value) setValue(f);
            }
            setDraft(null);
            if (props.onBlur) props.onBlur(e);
          },
          onKeyDown
        }
      ), props.suffix != null ? /* @__PURE__ */ React59.createElement("span", { className: "aura-number__affix", "aria-hidden": true }, props.suffix) : null, stepper ? /* @__PURE__ */ React59.createElement("span", { className: "aura-number__steps" }, /* @__PURE__ */ React59.createElement(
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
        /* @__PURE__ */ React59.createElement(Icon, { name: /* @__PURE__ */ React59.createElement(IconMinus, null) })
      ), /* @__PURE__ */ React59.createElement(
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
        /* @__PURE__ */ React59.createElement(Icon, { name: /* @__PURE__ */ React59.createElement(IconPlus, null) })
      )) : null)
    );
  });

  // src/Stepper.tsx
  var React60 = __toESM(require_react(), 1);
  var Stepper = React60.forwardRef(function Stepper2(props, ref) {
    const t = useStrings();
    const idBase = uid();
    const steps = props.steps || [];
    let at = -1;
    steps.forEach(function(s, i) {
      if (s.id === props.current) at = i;
    });
    if (at < 0) at = 0;
    const vertical = props.orientation === "vertical";
    const cur = steps[at];
    return /* @__PURE__ */ React60.createElement(
      "nav",
      {
        ref,
        "aria-label": props.label,
        className: cx("aura-stepper", vertical ? "aura-stepper--vertical" : "aura-stepper--horizontal", props.className)
      },
      /* @__PURE__ */ React60.createElement("ol", { className: "aura-stepper__list" }, steps.map(function(s, i) {
        const state = i < at ? "done" : i === at ? "current" : "upcoming";
        const error = s.status === "error";
        const marker = /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__marker", "aria-hidden": true }, error ? /* @__PURE__ */ React60.createElement(Icon, { name: /* @__PURE__ */ React60.createElement(IconCircleAlert, null) }) : state === "done" ? /* @__PURE__ */ React60.createElement(Icon, { name: /* @__PURE__ */ React60.createElement(IconCheck, null) }) : i + 1);
        const note = error ? t.stepError : state === "done" ? t.stepDone : "";
        const clickable = state === "done" && !!props.onStepClick;
        const named = clickable && (typeof s.label === "string" || typeof s.label === "number") && String(s.label).trim() !== "";
        const descId = idBase + "-step-" + i;
        const text2 = /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__text" }, /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__label" }, s.label, note ? /* @__PURE__ */ React60.createElement("span", { className: "aura-sr-only" }, ", " + note) : null), s.description ? /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__desc", id: named ? descId : void 0 }, s.description) : null);
        return /* @__PURE__ */ React60.createElement(
          "li",
          {
            key: s.id,
            className: cx("aura-stepper__item", "is-" + state, error && "is-error"),
            "aria-current": state === "current" ? "step" : void 0
          },
          clickable ? /* @__PURE__ */ React60.createElement(
            "button",
            {
              type: "button",
              className: "aura-stepper__step aura-focusable",
              "aria-label": named ? String(s.label) + (note ? ", " + note : "") : void 0,
              "aria-describedby": named && s.description ? descId : void 0,
              onClick: function() {
                props.onStepClick(s.id);
              }
            },
            marker,
            text2
          ) : /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__step" }, marker, text2)
        );
      })),
      !vertical && cur ? /* @__PURE__ */ React60.createElement("p", { className: "aura-stepper__compact", "aria-hidden": true }, /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__count" }, t.stepOf(at + 1, steps.length), cur.status === "error" ? /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__count-error" }, " \u2014 " + t.stepError) : null), /* @__PURE__ */ React60.createElement("span", { className: "aura-stepper__compact-label" }, cur.label)) : null
    );
  });

  // src/SegmentedControl.tsx
  var React61 = __toESM(require_react(), 1);
  function toOpt2(o) {
    return typeof o === "object" ? o : { value: o, label: o };
  }
  var SegmentedControl = React61.forwardRef(
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
      const refs = React61.useRef([]);
      const selIdx = options.findIndex(function(o) {
        return o.value === value;
      });
      const tabIdx = selIdx >= 0 && !options[selIdx].disabled ? selIdx : options.indexOf(firstEnabled);
      function move(from, dir) {
        const n3 = options.length;
        for (let k = 1; k <= n3; k++) {
          const i = ((from + dir * k) % n3 + n3) % n3;
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
      return /* @__PURE__ */ React61.createElement(
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
          return /* @__PURE__ */ React61.createElement(
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
            o.icon ? /* @__PURE__ */ React61.createElement(Icon, { name: o.icon }) : null,
            o.iconOnly ? null : /* @__PURE__ */ React61.createElement("span", null, o.label)
          );
        })
      );
    }
  );
  return __toCommonJS(index_exports);
})();
