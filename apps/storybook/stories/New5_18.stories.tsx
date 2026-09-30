import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.18' };
export default meta;

/* 112 (Chamber-OS addendum 19): the new-plan wizard after Save found errors on Fees — the step says so, and
 * choosing it goes back there (where it is the current step, still with errors). */
export const StepperErrors: StoryObj = {
  render: () => {
    const [cur, setCur] = React.useState('review');
    const steps = [
      { id: 'basics', label: 'Basics' },
      { id: 'fees', label: 'Fees', status: 'error' as const },
      { id: 'benefits', label: 'Benefits' },
      { id: 'review', label: 'Review' },
    ];
    return (
      <Aura.Stack gap={6}>
        <div data-testid="wizard">
          <Aura.Stepper label="New plan" steps={steps} current={cur} onStepClick={setCur} />
        </div>
        <p data-testid="page">Page: {cur}</p>
        <div data-testid="vertical" style={{ maxWidth: 320 }}>
          <Aura.Stepper
            label="New plan (vertical)"
            orientation="vertical"
            current="benefits"
            steps={[
              { id: 'basics', label: 'Basics', description: 'Name and period' },
              { id: 'fees', label: 'Fees', description: 'Two fields need a value', status: 'error' },
              { id: 'benefits', label: 'Benefits' },
              { id: 'review', label: 'Review', status: 'error' },
            ]}
          />
        </div>
        <div data-testid="swedish">
          <Aura.AuraProvider locale="sv">
            <Aura.Stepper
              label="Ny plan"
              current="granska"
              steps={[
                { id: 'grund', label: 'Grund' },
                { id: 'avgifter', label: 'Avgifter', status: 'error' },
                { id: 'granska', label: 'Granska' },
              ]}
              onStepClick={() => {}}
            />
          </Aura.AuraProvider>
        </div>
      </Aura.Stack>
    );
  },
};
