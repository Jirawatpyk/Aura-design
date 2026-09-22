import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@chromatic-com/storybook'],
  framework: { name: '@storybook/react-vite', options: {} },
  staticDirs: [{ from: '../../../packages/tokens', to: '/aura' }],
  // Stories import the real ES-module package source, so edits hot-reload and tree-shaking is exercised.
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.dedupe = ['react', 'react-dom', 'react-hook-form'];
    cfg.resolve.alias = { ...(cfg.resolve.alias || {}), '@aura/react': path.resolve(__dirname, '../../../packages/react/src/index.ts') };
    return cfg;
  },
};
export default config;
