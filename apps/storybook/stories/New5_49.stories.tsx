import type { Meta, StoryObj } from '@storybook/react';
import { ShortScreen } from './New5_48.stories';

type Lang = 'en' | 'th' | 'sv';
const meta: Meta<{ lang: Lang }> = {
  title: 'AURA/New in 5.49 Chamber-OS 155',
  parameters: { layout: 'fullscreen' },
  args: { lang: 'en' },
  argTypes: { lang: { control: 'inline-radio', options: ['en', 'th', 'sv'] } },
};
export default meta;

/* #155: the short-screen threshold is 30rem, the browser's text size × 30. Set the browser's default font size to
 * 32px (Settings → Appearance → Font size) on a 390×844 phone: the page holds what a 422px screen holds at 16px, so the
 * header actions stay in the header, the ActionBar sits in the flow and the top bar scrolls away. At 16px nothing
 * changes from 5.48. */
export const LargeText: StoryObj<{ lang: Lang }> = { render: ShortScreen.render };
