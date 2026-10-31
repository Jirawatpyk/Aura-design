import { createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';

/* routeTree.gen.ts is written by the TanStack Start Vite plugin on `npm run dev` / `npm run build`. */
export function getRouter() {
  return createRouter({ routeTree, scrollRestoration: true, defaultPreload: 'intent' });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
