import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming/create';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'AURA Design System',
    brandUrl: 'https://github.com/Jirawatpyk/Aura-design',
    brandTarget: '_blank',
  }),
});
