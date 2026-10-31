---
'@jirawatpyk/aura-react': minor
'@jirawatpyk/aura-tokens': minor
---

Visual audit set 4: a TanStack Start recipe and starter (`templates/tanstack-start-starter`) — an `AuraLink` adapter that sends AURA's links through TanStack Router (`router.navigate({ href })`, preload on intent) while keeping AURA's own `aria-current`; CI builds the starter against the packed packages and clicks every AURA link in it. DataTable: keyboard paging through pager links (getPageHref) under a client-side router now moves the focus to the new page's row instead of dropping it to the page. FilterBar: compact filters sit 6px apart below 640px, so three filters and a Tag keep one 375px row with the self-hosted fonts too.
