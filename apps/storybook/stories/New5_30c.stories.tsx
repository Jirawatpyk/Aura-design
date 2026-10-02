import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.30 addendum 38' };
export default meta;

const RATES = [
  { value: 'export', label: 'Export of goods (0%)' },
  { value: 'intl', label: 'International transport (0%)', description: 'Section 80/1 (2)' },
  { value: 'none', label: 'Not zero-rated' },
];

/* 135 (Chamber-OS addendum 38): the issue dialog's zero-rate rows, certificate number and typed-phrase fields at 44px
 * at every width, inside a compact page; `true` only on phones and touch screens; the default stays compact. */
export const TouchFields: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
        <div data-testid="always" style={{ display: 'grid', gap: 16 }}>
          <Aura.RadioGroup label="Zero-rate reason" options={RATES} defaultValue="export" touchHeight="always" />
          <Aura.TextField label="Certificate number" hint="As printed on the export certificate" touchHeight="always" />
          <Aura.TextField label="Type CONFIRM to issue" error="Type the word exactly" touchHeight="always" />
          <Aura.Select label="Branch" options={['Head office', 'Chiang Mai']} touchHeight="always" />
          <Aura.Textarea label="Note" rows={1} touchHeight="always" />
          <Aura.Checkbox touchHeight="always">I checked the certificate</Aura.Checkbox>
        </div>
        <div data-testid="touch" style={{ display: 'grid', gap: 16 }}>
          <Aura.RadioGroup label="Zero-rate reason (touch)" options={RATES} defaultValue="export" touchHeight />
          <Aura.TextField label="Certificate number (touch)" touchHeight />
          <Aura.Checkbox touchHeight>I checked it (touch)</Aura.Checkbox>
        </div>
        <div data-testid="default" style={{ display: 'grid', gap: 16 }}>
          <Aura.RadioGroup label="Zero-rate reason (default)" options={RATES} defaultValue="export" />
          <Aura.TextField label="Certificate number (default)" />
          <Aura.Checkbox>I checked it (default)</Aura.Checkbox>
        </div>
      </div>
    </Aura.AuraProvider>
  ),
};
