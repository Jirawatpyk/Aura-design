import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconCircleCheck, IconUsers } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.17' };
export default meta;

/* 110 (Chamber-OS addendum 18): the portal's membership tiles — test hooks on the root, a status line under the
 * value, the link on the heading with the whole tile clickable, and a loading tile hidden from assistive tech. */
export const StatOptions: StoryObj = {
  render: () => (
    <Aura.Grid columns={{ base: 1, md: 3 }} gap={4}>
      <Aura.Stat
        data-testid="stat-card"
        data-variant="warning"
        label="Membership"
        headingLevel={2}
        href="#membership"
        linkArea="label"
        value="Gold"
        icon={<IconUsers />}
        status={
          <>
            <span style={{ display: 'inline-flex', color: 'var(--aura-fg-positive)' }}>
              <IconCircleCheck />
            </span>
            Active · renews 1 Jan
          </>
        }
        caption={<a href="#benefits">4 benefits</a>}
      />
      <Aura.Stat data-testid="stat-tile" label="Invoices" headingLevel={2} href="#invoices" value={3} />
      <Aura.Stat data-testid="stat-loading" label="E-Blasts" loading aria-hidden />
    </Aura.Grid>
  ),
};

/* 111: the quota shows "2 of 6 used" and is read as "2 used, 1 reserved, 3 remaining of 6". */
export const ProgressValueText: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Aura.Progress
        label="E-Blasts this year"
        value={2}
        max={6}
        secondaryValue={1}
        showValue
        valueLabel="2 of 6 used"
        valueText="2 used, 1 reserved, 3 remaining of 6"
      />
    </div>
  ),
};
