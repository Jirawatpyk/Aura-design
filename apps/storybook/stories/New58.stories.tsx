import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.8' };
export default meta;

/* 66: a standing notice in a danger tone that doesn't interrupt, with its own icon and test hooks. */
export const AlertRoleAndIcon: StoryObj = {
  render: () => (
    <Aura.Stack gap={3} style={{ maxWidth: 560 }}>
      <Aura.Alert
        tone="warning"
        role="status"
        icon="clock"
        title="Pending review"
        data-testid="pending"
        id="cr-pending"
      >
        Your change request is waiting for the membership team.
      </Aura.Alert>
      <Aura.Alert
        tone="danger"
        role="status"
        data-outcome="paused"
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" data-icon="pause">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        }
        title="Benefits paused"
      >
        Renew your membership to use member rates again.
      </Aura.Alert>
      <Aura.Alert tone="danger" title="Could not save">
        Default: danger is role=alert with its own icon.
      </Aura.Alert>
    </Aura.Stack>
  ),
};

/* 67: a change request as field / seen / proposed; stacked into cards below 640px of the table's box. */
export const StackedDiff: StoryObj = {
  render: () => (
    <Aura.Table caption="Changes requested" stackBelow="sm">
      <Aura.THead>
        <Aura.Tr>
          <Aura.Th>Field</Aura.Th>
          <Aura.Th>Seen at submission</Aura.Th>
          <Aura.Th>Proposed</Aura.Th>
        </Aura.Tr>
      </Aura.THead>
      <Aura.TBody>
        <Aura.Tr>
          <Aura.Th scope="row">Company name</Aura.Th>
          <Aura.Td>Nordic Rail Co., Ltd.</Aura.Td>
          <Aura.Td>Nordic Rail (Thailand) Co., Ltd.</Aura.Td>
        </Aura.Tr>
        <Aura.Tr>
          <Aura.Th scope="row">Address</Aura.Th>
          <Aura.Td>
            98 Sathorn Square, 21st floor
            <br />
            North Sathorn Road, Silom
            <br />
            Bang Rak, Bangkok
            <br />
            10500
          </Aura.Td>
          <Aura.Td label="Proposed (new)">
            1 Empire Tower, 30th floor
            <br />
            South Sathorn Road, Yannawa
            <br />
            Sathorn, Bangkok
            <br />
            10120
          </Aura.Td>
        </Aura.Tr>
      </Aura.TBody>
    </Aura.Table>
  ),
};

/* 69: attributes on Card and StatusPill roots — a scroll anchor and e2e hooks. */
export const CardAndPillAttributes: StoryObj = {
  render: () => (
    <Aura.Card
      id="renewal-prefs"
      data-testid="history-item"
      data-request-id="CR-1042"
      title="Renewal preferences"
      titleId="renewal-prefs-title"
    >
      <Aura.StatusPill tone="ready" data-state="decided" data-outcome="approved">
        Approved
      </Aura.StatusPill>
    </Aura.Card>
  ),
};
