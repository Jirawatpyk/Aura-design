import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.20' };
export default meta;

const PLANS = [
  ['Corporate 2026', '฿48,000.00', 'Active'],
  ['SME 2026', '฿24,000.00', 'Active'],
  ['Corporate 2025', '฿45,000.00', 'Archived'],
];
function Plans(props: { density?: 'compact' | 'comfortable'; stackBelow?: 'sm' }) {
  return (
    <Aura.Table caption="Plans" captionHidden density={props.density} stackBelow={props.stackBelow}>
      <Aura.THead>
        <Aura.Tr>
          <Aura.Th>Plan</Aura.Th>
          <Aura.Th numeric>Fee</Aura.Th>
          <Aura.Th>Status</Aura.Th>
        </Aura.Tr>
      </Aura.THead>
      <Aura.TBody>
        {PLANS.map((r) => (
          <Aura.Tr key={r[0]}>
            <Aura.Td>{r[0]}</Aura.Td>
            <Aura.Td numeric>{r[1]}</Aura.Td>
            <Aura.Td>{r[2]}</Aura.Td>
          </Aura.Tr>
        ))}
      </Aura.TBody>
    </Aura.Table>
  );
}

/* 115 (Chamber-OS addendum 20): the staff frame is compact, so its plans table is too — without a prop. */
export const TableDensity: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <div data-testid="page">
        <Plans />
      </div>
      <Aura.AuraProvider density="compact">
        <div data-testid="frame">
          <Plans />
        </div>
        <div data-testid="override">
          <Plans density="comfortable" />
        </div>
        <div data-testid="frame-stacked" style={{ width: 360 }}>
          <Plans stackBelow="sm" />
        </div>
      </Aura.AuraProvider>
      <div data-density="compact" data-testid="attr">
        <Plans />
        <div data-density="comfortable" data-testid="nested">
          <Plans />
        </div>
      </div>
    </Aura.Stack>
  ),
};

/* 116: the new-plan wizard's bar — Cancel at the start, Back and Next at the end. */
export const ActionBarStart: StoryObj = {
  render: () => (
    <Aura.Stack gap={6}>
      <Aura.Card data-testid="wizard">
        <p>Step 2 of 4 — Fees</p>
        <Aura.ActionBar
          position="container"
          label="Wizard actions"
          start={<Aura.Button variant="ghost">Cancel</Aura.Button>}
        >
          <Aura.Button variant="secondary">Back</Aura.Button>
          <Aura.Button variant="primary">Next</Aura.Button>
        </Aura.ActionBar>
      </Aura.Card>
      <div dir="rtl">
        <Aura.Card data-testid="rtl">
          <Aura.ActionBar
            position="container"
            label="RTL actions"
            status="Unsaved changes"
            start={<Aura.Button variant="ghost">Discard</Aura.Button>}
          >
            <Aura.Button variant="primary">Save</Aura.Button>
          </Aura.ActionBar>
        </Aura.Card>
      </div>
      <div style={{ width: 320 }}>
        <Aura.Card data-testid="narrow-wizard">
          <Aura.ActionBar
            position="container"
            label="Narrow wizard"
            start={<Aura.Button variant="ghost">Cancel</Aura.Button>}
          >
            <Aura.Button variant="secondary">Back</Aura.Button>
            <Aura.Button variant="primary">Next</Aura.Button>
          </Aura.ActionBar>
        </Aura.Card>
      </div>
      <div style={{ width: 320 }}>
        <Aura.Card data-testid="narrow">
          <Aura.ActionBar
            position="container"
            label="Narrow actions"
            status="Unsaved changes"
            start={<Aura.Button variant="ghost">Discard</Aura.Button>}
          >
            <Aura.Button variant="primary">Save</Aura.Button>
          </Aura.ActionBar>
        </Aura.Card>
      </div>
      <Aura.Card data-testid="with-status">
        <Aura.ActionBar
          position="container"
          label="Form actions"
          status="Unsaved changes"
          start={<Aura.Button variant="ghost">Discard</Aura.Button>}
        >
          <Aura.Button variant="primary">Save</Aura.Button>
        </Aura.ActionBar>
      </Aura.Card>
    </Aura.Stack>
  ),
};
