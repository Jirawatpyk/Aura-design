---
'@jirawatpyk/aura-react': patch
'@jirawatpyk/aura-tokens': patch
---

SideNav: long compound words in labels hyphenate at a syllable (`hyphens: auto`, using the browser's dictionary for the page's `lang`) instead of breaking mid-word with no hyphen (Chamber-OS item 64). A soft hyphen in a label breaks there in every browser.
