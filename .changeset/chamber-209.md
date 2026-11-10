---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Chamber-OS addendum 109: while a modal is open, known third-party challenge frames already in the page (Stripe, reCAPTCHA, hCaptcha, Turnstile) are never made inert, and `keepOutside` (Dialog, Drawer, Command) / `modalKeepOutside` (AuraProvider) keep any other selector live.
