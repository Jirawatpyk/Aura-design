import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Theming/Color scheme' };
export default meta;

function Status() {
  const cs = Aura.useColorScheme();
  return (
    <p data-testid="scheme-status" style={{ margin: 0 }}>
      scheme: <code>{cs.scheme}</code> · on screen: <code>{cs.resolved}</code>
    </p>
  );
}

/* In an app: <ColorSchemeScript /> in <head>, <ColorSchemeToggle /> in the top bar. Here the toolbar's Theme
 * switch also sets data-theme, so the story shows the toggle and hook on their own. */
export const Toggle: StoryObj = {
  render: () => (
    <Aura.Stack gap={4}>
      <Aura.Stack direction="row" gap={3} align="center">
        <Aura.ColorSchemeToggle />
        <Status />
      </Aura.Stack>
      <Aura.Card title="Follows the tokens" headingLevel={2}>
        Surfaces, text, borders and components switch with the scheme; <code>system</code> follows the operating system.
      </Aura.Card>
      <Aura.ColorSchemeScript />
    </Aura.Stack>
  ),
};
