---
'@jirawatpyk/aura-react': patch
'@jirawatpyk/aura-tokens': patch
---

- **Switch**: a disabled switch that is on keeps reading as on. Disabled rows (on or off) are no longer faded as a whole: the label turns secondary, the description stays readable, and only the switch fades — off to the disabled opacity, on to 0.75, ≥3:1 apart in both themes; `GrayText` in forced colours.
- **Tag**: the remove button's name comes from the text of any children (`<strong>Acme</strong> AB` → "Remove Acme AB"), skipping `aria-hidden` text; a dev notice asks for `removeLabel` when there is no text.
- Docs: SideNav faults and warnings use a toned `badge` (`<Badge tone="danger">`).
