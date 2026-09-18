import type { Preview } from '@storybook/react';
import React from 'react';
import { AuraProvider } from '@aura/react';
import '../../../packages/tokens/aura.css';
import '../../../packages/react/styles/components.css';

const preview: Preview = {
  globalTypes: {
    locale: {
      description: 'AuraProvider locale (none = English labels, Thai พ.ศ. dates)',
      defaultValue: 'none',
      toolbar: { title: 'Locale', icon: 'globe', items: ['none', 'th', 'en'], dynamicTitle: true },
    },
    theme: {
      description: 'AURA theme',
      defaultValue: 'light',
      toolbar: { title: 'Theme', icon: 'mirror', items: ['light', 'dark'], dynamicTitle: true },
    },
  },
  decorators: [
    (Story, ctx) => {
      const theme = ctx.globals.theme || 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
      document.documentElement.setAttribute('data-theme', theme);
      document.body.style.background = 'var(--aura-bg-canvas)';
      document.body.style.color = 'var(--aura-fg-primary)';
      document.body.style.fontFamily = 'var(--font-sans)';
      const body = React.createElement('div', { style: { padding: 24 } }, React.createElement(Story));
      const locale = ctx.globals.locale;
      return locale === 'th' || locale === 'en' ? React.createElement(AuraProvider, { locale }, body) : body;
    },
  ],
  parameters: {
    a11y: { config: { rules: [{ id: 'color-contrast', enabled: true }] } },
    chromatic: { modes: { light: { theme: 'light' }, dark: { theme: 'dark' } } },
    layout: 'fullscreen',
    options: { storySort: { order: ['Welcome', 'AURA', ['Actions', 'Forms', 'Feedback', 'Pickers', 'Overlays', 'Data', 'Layout', 'Responsive']] } },
  },
};
export default preview;
