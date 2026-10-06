---
'@jirawatpyk/aura-react': patch
---

WCAG 2.5.3 (axe-core 4.14 runs label-content-name-mismatch by default): Accordion, Stepper, FilterDateRange, BottomNav (with ariaLabel), Combobox and Command options are named from their content — the full name in an sr-only span or the visible label, the visible short label or description aria-hidden, descriptions still via aria-describedby — instead of aria-label/aria-labelledby over visible text the name didn't contain. Names and descriptions read the same. BottomNav warns in development when ariaLabel doesn't contain the visible label. The repo pins axe-core 4.14.0 for every CI leg.
