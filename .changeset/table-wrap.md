---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Table cells wrap words whole (`overflow-wrap: break-word`): a long email or URL now widens its column and the table scrolls sideways (a `stickyHeader` table then stops pinning) — give that cell `wrap="anywhere"` for the old behaviour. New `wrap="anywhere" | "none"` on `Td`/`Th`; a wide `stickyHeader` Table's header no longer covers its first row (Chamber-OS 174, 175).
