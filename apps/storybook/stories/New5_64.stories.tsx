import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.64 Chamber-OS 179' };
export default meta;

const LEGEND = { value: 'Used', secondary: 'Reserved (in review or scheduled)' };

/* #179: the E-Blast quota bar with its key — a swatch per part in the bar's tone, the reserved one striped. The key
 * follows the danger tone, wraps on a phone and is absent while nothing is reserved. */
export const QuotaLegend: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
      <div data-testid="accent">
        <Aura.Progress
          label="E-Blasts this year"
          value={2}
          secondaryValue={1}
          max={6}
          showValue
          valueLabel="2 of 6 used"
          legend={LEGEND}
          hint="Resets on 1 Jan."
        />
      </div>
      <div data-testid="danger">
        <Aura.Progress
          label="E-Blasts this year"
          value={5}
          secondaryValue={1}
          max={6}
          tone="danger"
          showValue
          valueLabel="5 of 6 used"
          legend={LEGEND}
        />
      </div>
      <div data-testid="narrow" style={{ width: 200 }}>
        <Aura.Progress
          label="E-Blasts"
          value={2}
          secondaryValue={1}
          max={6}
          legend={{ value: 'Used', secondary: 'Reserved while in review or scheduled to send' }}
        />
      </div>
      <div data-testid="only-secondary">
        <Aura.Progress label="E-Blasts" value={2} secondaryValue={1} max={6} legend={{ secondary: 'Reserved' }} />
      </div>
      <div data-testid="full">
        <Aura.Progress label="E-Blasts" value={6} secondaryValue={1} max={6} legend={LEGEND} />
      </div>
      <div data-testid="none">
        <Aura.Progress
          label="E-Blasts this year"
          value={2}
          secondaryValue={0}
          max={6}
          showValue
          valueLabel="2 of 6 used"
          legend={LEGEND}
        />
      </div>
    </div>
  ),
};
