import { defineConfig } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  server: { port: 3000 },
  /* TanStack Start's plugin first: it generates the route tree; React's plugin must come after it. */
  plugins: [tanstackStart(), viteReact()],
});
