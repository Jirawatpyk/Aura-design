import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';

const config: StorybookConfig = {
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y', '@chromatic-com/storybook'],
  framework: { name: '@storybook/react-vite', options: {} },
  /* Props tables read the TypeScript sources of @aura/react (types + JSDoc), not the stories.
   * Inherited DOM attributes from @types/react are left out so each table shows AURA's own props. */
  typescript: {
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      tsconfigPath: path.resolve(__dirname, '../../../packages/react/tsconfig.src.json'),
      include: ['../../packages/react/src/**/*.tsx'],
      shouldExtractLiteralValuesFromEnum: false,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) => !prop.parent || !/node_modules/.test(prop.parent.fileName),
    },
  },
  staticDirs: [{ from: '../../../packages/tokens', to: '/aura' }],
  // Stories import the real ES-module package source, so edits hot-reload and tree-shaking is exercised.
  viteFinal: async (cfg) => {
    cfg.resolve = cfg.resolve || {};
    cfg.resolve.dedupe = ['react', 'react-dom', 'react-hook-form'];
    /* The subpath entries first: '@aura/react' would otherwise match '@aura/react/icons' as a prefix. */
    const src = path.resolve(__dirname, '../../../packages/react/src');
    cfg.resolve.alias = {
      ...(cfg.resolve.alias || {}),
      '@aura/react/icons': path.join(src, 'icons.ts'),
      '@aura/react/locales/th': path.join(src, 'strings.th.ts'),
      '@aura/react/locales/sv': path.join(src, 'strings.sv.ts'),
      '@aura/react': path.join(src, 'index.ts'),
    };
    return cfg;
  },
};
export default config;
