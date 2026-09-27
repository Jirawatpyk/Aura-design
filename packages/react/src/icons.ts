import { defineIcon } from './iconSvg.js';
import type { AuraIcon } from './iconSvg.js';
export { defineIcon } from './iconSvg.js';
export type { AuraIcon, IconShape } from './iconSvg.js';

/* @jirawatpyk/aura-react/icons (5.9): one component per icon, so a bundler keeps only the ones you import. Lucide
 * (ISC), path data from lucide-static 1.47.0. Each renders the same <svg> as <Icon name="…" /> and works wherever
 * AURA takes an icon: <Button icon={<IconPlus />}>. The name map for icon names as strings is `allIcons` (pass it to
 * registerIcons). Generated from the 5.8 ICONS map. */
export const IconCheck = /* @__PURE__ */ defineIcon('check', [['path', { d: 'M20 6 9 17l-5-5' }]]);
export const IconX = /* @__PURE__ */ defineIcon('x', [
  ['path', { d: 'M18 6 6 18' }],
  ['path', { d: 'm6 6 12 12' }],
]);
export const IconPlus = /* @__PURE__ */ defineIcon('plus', [
  ['path', { d: 'M5 12h14' }],
  ['path', { d: 'M12 5v14' }],
]);
export const IconMinus = /* @__PURE__ */ defineIcon('minus', [['path', { d: 'M5 12h14' }]]);
export const IconSearch = /* @__PURE__ */ defineIcon('search', [
  ['path', { d: 'm21 21-4.34-4.34' }],
  ['circle', { cx: '11', cy: '11', r: '8' }],
]);
export const IconChevronDown = /* @__PURE__ */ defineIcon('chevron-down', [['path', { d: 'm6 9 6 6 6-6' }]]);
export const IconChevronUp = /* @__PURE__ */ defineIcon('chevron-up', [['path', { d: 'm18 15-6-6-6 6' }]]);
export const IconChevronLeft = /* @__PURE__ */ defineIcon('chevron-left', [['path', { d: 'm15 18-6-6 6-6' }]]);
export const IconChevronRight = /* @__PURE__ */ defineIcon('chevron-right', [['path', { d: 'm9 18 6-6-6-6' }]]);
export const IconArrowRight = /* @__PURE__ */ defineIcon('arrow-right', [
  ['path', { d: 'M5 12h14' }],
  ['path', { d: 'm12 5 7 7-7 7' }],
]);
export const IconArrowUpRight = /* @__PURE__ */ defineIcon('arrow-up-right', [
  ['path', { d: 'M7 7h10v10' }],
  ['path', { d: 'M7 17 17 7' }],
]);
export const IconArrowUpDown = /* @__PURE__ */ defineIcon('arrow-up-down', [
  ['path', { d: 'm21 16-4 4-4-4' }],
  ['path', { d: 'M17 20V4' }],
  ['path', { d: 'm3 8 4-4 4 4' }],
  ['path', { d: 'M7 4v16' }],
]);
export const IconLoaderCircle = /* @__PURE__ */ defineIcon('loader-circle', [
  ['path', { d: 'M21 12a9 9 0 1 1-6.219-8.56' }],
]);
export const IconCircleAlert = /* @__PURE__ */ defineIcon('circle-alert', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['line', { x1: '12', x2: '12', y1: '8', y2: '12' }],
  ['line', { x1: '12', x2: '12.01', y1: '16', y2: '16' }],
]);
export const IconCircleCheck = /* @__PURE__ */ defineIcon('circle-check', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'm16 9-5.5 5.5L8 12' }],
]);
export const IconInfo = /* @__PURE__ */ defineIcon('info', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'M12 16v-4' }],
  ['path', { d: 'M12 8h.01' }],
]);
export const IconTriangleAlert = /* @__PURE__ */ defineIcon('triangle-alert', [
  ['path', { d: 'm21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3' }],
  ['path', { d: 'M12 9v4' }],
  ['path', { d: 'M12 17h.01' }],
]);
export const IconSettings = /* @__PURE__ */ defineIcon('settings', [
  [
    'path',
    {
      d: 'M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915',
    },
  ],
  ['circle', { cx: '12', cy: '12', r: '3' }],
]);
export const IconUser = /* @__PURE__ */ defineIcon('user', [
  ['path', { d: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' }],
  ['circle', { cx: '12', cy: '7', r: '4' }],
]);
export const IconUsers = /* @__PURE__ */ defineIcon('users', [
  ['path', { d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' }],
  ['path', { d: 'M16 3.128a4 4 0 0 1 0 7.744' }],
  ['path', { d: 'M22 21v-2a4 4 0 0 0-3-3.87' }],
  ['circle', { cx: '9', cy: '7', r: '4' }],
]);
export const IconFilter = /* @__PURE__ */ defineIcon('filter', [
  [
    'path',
    {
      d: 'M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z',
    },
  ],
]);
export const IconEllipsis = /* @__PURE__ */ defineIcon('ellipsis', [
  ['circle', { cx: '12', cy: '12', r: '1' }],
  ['circle', { cx: '19', cy: '12', r: '1' }],
  ['circle', { cx: '5', cy: '12', r: '1' }],
]);
export const IconExternalLink = /* @__PURE__ */ defineIcon('external-link', [
  ['path', { d: 'M15 3h6v6' }],
  ['path', { d: 'M10 14 21 3' }],
  ['path', { d: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6' }],
]);
export const IconCopy = /* @__PURE__ */ defineIcon('copy', [
  ['rect', { width: '14', height: '14', x: '8', y: '8', rx: '2', ry: '2' }],
  ['path', { d: 'M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2' }],
]);
export const IconTrash2 = /* @__PURE__ */ defineIcon('trash-2', [
  ['path', { d: 'M10 11v6' }],
  ['path', { d: 'M14 11v6' }],
  ['path', { d: 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6' }],
  ['path', { d: 'M3 6h18' }],
  ['path', { d: 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2' }],
]);
export const IconPencil = /* @__PURE__ */ defineIcon('pencil', [
  [
    'path',
    {
      d: 'M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z',
    },
  ],
  ['path', { d: 'm15 5 4 4' }],
]);
export const IconDownload = /* @__PURE__ */ defineIcon('download', [
  ['path', { d: 'M12 15V3' }],
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
  ['path', { d: 'm7 10 5 5 5-5' }],
]);
export const IconUpload = /* @__PURE__ */ defineIcon('upload', [
  ['path', { d: 'M12 3v12' }],
  ['path', { d: 'm17 8-5-5-5 5' }],
  ['path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }],
]);
export const IconCalendar = /* @__PURE__ */ defineIcon('calendar', [
  ['path', { d: 'M8 2v3' }],
  ['path', { d: 'M16 2v3' }],
  ['rect', { x: '3', y: '3', width: '18', height: '18', rx: '2' }],
  ['path', { d: 'M3 9h18' }],
]);
export const IconBell = /* @__PURE__ */ defineIcon('bell', [
  ['path', { d: 'M10.268 21a2 2 0 0 0 3.464 0' }],
  [
    'path',
    {
      d: 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326',
    },
  ],
]);
export const IconMenu = /* @__PURE__ */ defineIcon('menu', [
  ['path', { d: 'M4 5h16' }],
  ['path', { d: 'M4 12h16' }],
  ['path', { d: 'M4 19h16' }],
]);
export const IconEye = /* @__PURE__ */ defineIcon('eye', [
  [
    'path',
    { d: 'M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0' },
  ],
  ['circle', { cx: '12', cy: '12', r: '3' }],
]);
export const IconLogOut = /* @__PURE__ */ defineIcon('log-out', [
  ['path', { d: 'm16 17 5-5-5-5' }],
  ['path', { d: 'M21 12H9' }],
  ['path', { d: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' }],
]);
export const IconCircle = /* @__PURE__ */ defineIcon('circle', [['circle', { cx: '12', cy: '12', r: '10' }]]);
export const IconCircleDotDashed = /* @__PURE__ */ defineIcon('circle-dot-dashed', [
  ['path', { d: 'M10.1 2.18a9.93 9.93 0 0 1 3.8 0' }],
  ['path', { d: 'M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7' }],
  ['path', { d: 'M21.82 10.1a9.93 9.93 0 0 1 0 3.8' }],
  ['path', { d: 'M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69' }],
  ['path', { d: 'M13.9 21.82a9.94 9.94 0 0 1-3.8 0' }],
  ['path', { d: 'M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7' }],
  ['path', { d: 'M2.18 13.9a9.93 9.93 0 0 1 0-3.8' }],
  ['path', { d: 'M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69' }],
  ['circle', { cx: '12', cy: '12', r: '1' }],
]);
export const IconBan = /* @__PURE__ */ defineIcon('ban', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'M4.929 4.929 19.07 19.071' }],
]);
export const IconArrowUp = /* @__PURE__ */ defineIcon('arrow-up', [
  ['path', { d: 'm5 12 7-7 7 7' }],
  ['path', { d: 'M12 19V5' }],
]);
export const IconArrowDown = /* @__PURE__ */ defineIcon('arrow-down', [
  ['path', { d: 'M12 5v14' }],
  ['path', { d: 'm19 12-7 7-7-7' }],
]);
export const IconInbox = /* @__PURE__ */ defineIcon('inbox', [
  ['polyline', { points: '22 12 16 12 14 15 10 15 8 12 2 12' }],
  [
    'path',
    { d: 'M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z' },
  ],
]);
export const IconPin = /* @__PURE__ */ defineIcon('pin', [
  ['path', { d: 'M12 17v5' }],
  [
    'path',
    {
      d: 'M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z',
    },
  ],
]);
export const IconPinOff = /* @__PURE__ */ defineIcon('pin-off', [
  ['path', { d: 'M12 17v5' }],
  ['path', { d: 'M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89' }],
  ['path', { d: 'm2 2 20 20' }],
  ['path', { d: 'M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11' }],
]);
export const IconEyeOff = /* @__PURE__ */ defineIcon('eye-off', [
  ['path', { d: 'M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49' }],
  ['path', { d: 'M14.084 14.158a3 3 0 0 1-4.242-4.242' }],
  ['path', { d: 'M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143' }],
  ['path', { d: 'm2 2 20 20' }],
]);
export const IconColumns3 = /* @__PURE__ */ defineIcon('columns-3', [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
  ['path', { d: 'M9 3v18' }],
  ['path', { d: 'M15 3v18' }],
]);
export const IconArrowLeft = /* @__PURE__ */ defineIcon('arrow-left', [
  ['path', { d: 'm12 19-7-7 7-7' }],
  ['path', { d: 'M19 12H5' }],
]);
export const IconRotateCcw = /* @__PURE__ */ defineIcon('rotate-ccw', [
  ['path', { d: 'M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' }],
  ['path', { d: 'M3 3v5h5' }],
]);
export const IconHouse = /* @__PURE__ */ defineIcon('house', [
  ['path', { d: 'M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8' }],
  [
    'path',
    { d: 'M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' },
  ],
]);
export const IconLayoutDashboard = /* @__PURE__ */ defineIcon('layout-dashboard', [
  ['rect', { width: '7', height: '9', x: '3', y: '3', rx: '1' }],
  ['rect', { width: '7', height: '5', x: '14', y: '3', rx: '1' }],
  ['rect', { width: '7', height: '9', x: '14', y: '12', rx: '1' }],
  ['rect', { width: '7', height: '5', x: '3', y: '16', rx: '1' }],
]);
export const IconFolder = /* @__PURE__ */ defineIcon('folder', [
  [
    'path',
    {
      d: 'M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z',
    },
  ],
]);
export const IconChartColumn = /* @__PURE__ */ defineIcon('chart-column', [
  ['path', { d: 'M3 3v16a2 2 0 0 0 2 2h16' }],
  ['path', { d: 'M18 17V9' }],
  ['path', { d: 'M13 17V5' }],
  ['path', { d: 'M8 17v-3' }],
]);
export const IconFileText = /* @__PURE__ */ defineIcon('file-text', [
  [
    'path',
    {
      d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z',
    },
  ],
  ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5' }],
  ['path', { d: 'M10 9H8' }],
  ['path', { d: 'M16 13H8' }],
  ['path', { d: 'M16 17H8' }],
]);
export const IconMail = /* @__PURE__ */ defineIcon('mail', [
  ['path', { d: 'm22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7' }],
  ['rect', { x: '2', y: '4', width: '20', height: '16', rx: '2' }],
]);
export const IconLock = /* @__PURE__ */ defineIcon('lock', [
  ['rect', { width: '18', height: '11', x: '3', y: '11', rx: '2', ry: '2' }],
  ['path', { d: 'M7 11V7a5 5 0 0 1 10 0v4' }],
]);
export const IconClock = /* @__PURE__ */ defineIcon('clock', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'M12 6v6l4 2' }],
]);
export const IconTrendingUp = /* @__PURE__ */ defineIcon('trending-up', [
  ['path', { d: 'M16 7h6v6' }],
  ['path', { d: 'm22 7-8.5 8.5-5-5L2 17' }],
]);
export const IconTrendingDown = /* @__PURE__ */ defineIcon('trending-down', [
  ['path', { d: 'M16 17h6v-6' }],
  ['path', { d: 'm22 17-8.5-8.5-5 5L2 7' }],
]);
export const IconImage = /* @__PURE__ */ defineIcon('image', [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2', ry: '2' }],
  ['circle', { cx: '9', cy: '9', r: '2' }],
  ['path', { d: 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21' }],
]);
export const IconPaperclip = /* @__PURE__ */ defineIcon('paperclip', [
  [
    'path',
    {
      d: 'm16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551',
    },
  ],
]);
export const IconCloudUpload = /* @__PURE__ */ defineIcon('cloud-upload', [
  ['path', { d: 'M12 13v8' }],
  ['path', { d: 'M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242' }],
  ['path', { d: 'm8 17 4-4 4 4' }],
]);
export const IconFile = /* @__PURE__ */ defineIcon('file', [
  [
    'path',
    {
      d: 'M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z',
    },
  ],
  ['path', { d: 'M14 2v5a1 1 0 0 0 1 1h5' }],
]);
export const IconSun = /* @__PURE__ */ defineIcon('sun', [
  ['circle', { cx: '12', cy: '12', r: '4' }],
  ['path', { d: 'M12 2v2' }],
  ['path', { d: 'M12 20v2' }],
  ['path', { d: 'm4.93 4.93 1.41 1.41' }],
  ['path', { d: 'm17.66 17.66 1.41 1.41' }],
  ['path', { d: 'M2 12h2' }],
  ['path', { d: 'M20 12h2' }],
  ['path', { d: 'm6.34 17.66-1.41 1.41' }],
  ['path', { d: 'm19.07 4.93-1.41 1.41' }],
]);
export const IconMoon = /* @__PURE__ */ defineIcon('moon', [
  [
    'path',
    {
      d: 'M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401',
    },
  ],
]);
export const IconMonitor = /* @__PURE__ */ defineIcon('monitor', [
  ['rect', { width: '20', height: '14', x: '2', y: '3', rx: '2' }],
  ['line', { x1: '8', x2: '16', y1: '21', y2: '21' }],
  ['line', { x1: '12', x2: '12', y1: '17', y2: '21' }],
]);
export const IconPanelLeftClose = /* @__PURE__ */ defineIcon('panel-left-close', [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
  ['path', { d: 'M9 3v18' }],
  ['path', { d: 'm16 15-3-3 3-3' }],
]);
export const IconPanelLeftOpen = /* @__PURE__ */ defineIcon('panel-left-open', [
  ['rect', { width: '18', height: '18', x: '3', y: '3', rx: '2' }],
  ['path', { d: 'M9 3v18' }],
  ['path', { d: 'm14 9 3 3-3 3' }],
]);
export const IconServer = /* @__PURE__ */ defineIcon('server', [
  ['rect', { width: '20', height: '8', x: '2', y: '2', rx: '2', ry: '2' }],
  ['rect', { width: '20', height: '8', x: '2', y: '14', rx: '2', ry: '2' }],
  ['line', { x1: '6', x2: '6.01', y1: '6', y2: '6' }],
  ['line', { x1: '6', x2: '6.01', y1: '18', y2: '18' }],
]);
export const IconGlobe = /* @__PURE__ */ defineIcon('globe', [
  ['circle', { cx: '12', cy: '12', r: '10' }],
  ['path', { d: 'M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20' }],
  ['path', { d: 'M2 12h20' }],
]);
export const IconActivity = /* @__PURE__ */ defineIcon('activity', [
  [
    'path',
    {
      d: 'M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2',
    },
  ],
]);
export const IconShieldAlert = /* @__PURE__ */ defineIcon('shield-alert', [
  [
    'path',
    {
      d: 'M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z',
    },
  ],
  ['path', { d: 'M12 8v4' }],
  ['path', { d: 'M12 16h.01' }],
]);
export const IconPhone = /* @__PURE__ */ defineIcon('phone', [
  [
    'path',
    {
      d: 'M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384',
    },
  ],
]);
export const IconWrench = /* @__PURE__ */ defineIcon('wrench', [
  [
    'path',
    {
      d: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z',
    },
  ],
]);

/** Every icon — what `registerIcons(allIcons)` takes to keep icon names as strings working in 6.0. */
export const allIcons: AuraIcon[] = [
  IconCheck,
  IconX,
  IconPlus,
  IconMinus,
  IconSearch,
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconArrowRight,
  IconArrowUpRight,
  IconArrowUpDown,
  IconLoaderCircle,
  IconCircleAlert,
  IconCircleCheck,
  IconInfo,
  IconTriangleAlert,
  IconSettings,
  IconUser,
  IconUsers,
  IconFilter,
  IconEllipsis,
  IconExternalLink,
  IconCopy,
  IconTrash2,
  IconPencil,
  IconDownload,
  IconUpload,
  IconCalendar,
  IconBell,
  IconMenu,
  IconEye,
  IconLogOut,
  IconCircle,
  IconCircleDotDashed,
  IconBan,
  IconArrowUp,
  IconArrowDown,
  IconInbox,
  IconPin,
  IconPinOff,
  IconEyeOff,
  IconColumns3,
  IconArrowLeft,
  IconRotateCcw,
  IconHouse,
  IconLayoutDashboard,
  IconFolder,
  IconChartColumn,
  IconFileText,
  IconMail,
  IconLock,
  IconClock,
  IconTrendingUp,
  IconTrendingDown,
  IconImage,
  IconPaperclip,
  IconCloudUpload,
  IconFile,
  IconSun,
  IconMoon,
  IconMonitor,
  IconPanelLeftClose,
  IconPanelLeftOpen,
  IconServer,
  IconGlobe,
  IconActivity,
  IconShieldAlert,
  IconPhone,
  IconWrench,
];
