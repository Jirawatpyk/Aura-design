import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/* Runs axe (WCAG 2.1 A + AA) against every story, in light and dark. Needs `npm run storybook` or a static build on :6006. */
/* Storybook's a11y addon runs its own axe as a story mounts; a scan that starts meanwhile throws "Axe is already
 * running". Wait and try again (a few times) instead of failing the whole sweep on that race. */
async function scan(page: Page, root: string) {
  for (let i = 0; ; i++) {
    try {
      return await new AxeBuilder({ page }).include(root).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    } catch (e) {
      if (i >= 4 || !/Axe is already running/.test(String(e))) throw e;
      await page.waitForTimeout(250);
    }
  }
}

test('AURA stories have no WCAG AA violations', async ({ page, request }) => {
  test.setTimeout(15 * 60 * 1000);   // every story × 2 themes, pilot pages included
  const index = await (await request.get('/index.json')).json();
  const stories = Object.values(index.entries as Record<string, { id: string; type: string }>).filter((e) => e.type === 'story');
  expect(stories.length).toBeGreaterThan(0);
  const failures: string[] = [];
  for (const theme of ['light', 'dark']) {
    for (const s of stories) {
      await page.goto(`/iframe.html?id=${s.id}&viewMode=story&globals=theme:${theme}`);
      await page.waitForSelector('#storybook-root > *');
      /* The theme is applied after mount, which starts colour transitions; measure only once they've finished. */
      await page.waitForFunction(() =>
        document.getAnimations().every((a) => !(a instanceof CSSTransition) || a.playState === 'finished'),
      );
      const { violations } = await scan(page, '#storybook-root');
      for (const v of violations) failures.push(`${theme} ${s.id}: ${v.id} — ${v.help} (${v.nodes.length})`);
    }
  }
  /* MDX pages (Welcome): the docs frame follows Storybook's own light theme. */
  const docs = Object.values(index.entries as Record<string, { id: string; type: string }>).filter((e) => e.type === 'docs');
  for (const d of docs) {
    await page.goto(`/iframe.html?id=${d.id}&viewMode=docs`);
    await page.waitForSelector('#storybook-docs .sbdocs-content > *');
    const { violations } = await scan(page, '#storybook-docs');
    for (const v of violations) failures.push(`docs ${d.id}: ${v.id} — ${v.help} (${v.nodes.length})`);
  }
  expect(failures, failures.join('\n')).toEqual([]);
});
