import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconDownload, IconEllipsis } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.21' };
export default meta;

function Exports(props: { rowHeight?: 'density'; stackBelow?: 'sm'; stackStyle?: 'cards' }) {
  return (
    <Aura.Table
      caption="Recent exports"
      captionHidden
      rowHeight={props.rowHeight}
      align="middle"
      stackBelow={props.stackBelow}
      stackStyle={props.stackStyle}
    >
      <Aura.THead>
        <Aura.Tr>
          <Aura.Th>File</Aura.Th>
          <Aura.Th>Status</Aura.Th>
          <Aura.Th>
            <span className="aura-sr-only">Action</span>
          </Aura.Th>
        </Aura.Tr>
      </Aura.THead>
      <Aura.TBody>
        <Aura.Tr data-testid="row-button">
          <Aura.Td>members-2026-09.csv</Aura.Td>
          <Aura.Td>
            <Aura.StatusPill tone="ready">Ready</Aura.StatusPill>
          </Aura.Td>
          <Aura.Td align="end">
            <Aura.Button size="sm" variant="secondary" icon={<IconDownload />}>
              Download
            </Aura.Button>
          </Aura.Td>
        </Aura.Tr>
        <Aura.Tr data-testid="row-pill">
          <Aura.Td>members-2026-08.csv</Aura.Td>
          <Aura.Td>
            <Aura.StatusPill tone="progress">In progress</Aura.StatusPill>
          </Aura.Td>
          <Aura.Td />
        </Aura.Tr>
        <Aura.Tr data-testid="row-icon">
          <Aura.Td>members-2026-07.csv</Aura.Td>
          <Aura.Td>Expired</Aura.Td>
          <Aura.Td align="end">
            <Aura.IconButton icon={<IconEllipsis />} label="More for members-2026-07.csv" size="sm" />
          </Aura.Td>
        </Aura.Tr>
        <Aura.Tr data-testid="row-wrap">
          <Aura.Td>members-with-a-very-long-name-that-has-to-wrap-onto-a-second-line-2026-06.csv</Aura.Td>
          <Aura.Td>Expired</Aura.Td>
          <Aura.Td />
        </Aura.Tr>
      </Aura.TBody>
    </Aura.Table>
  );
}

/* 117 (Chamber-OS addendum 21): the directory's Recent exports — every row the density's height. */
export const TableRowHeight: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 640 }}>
      <Aura.Stack gap={6}>
        <Aura.AuraProvider density="compact">
          <div data-testid="compact">
            <Exports rowHeight="density" />
          </div>
          <div data-testid="compact-default">
            <Exports />
          </div>
          <div data-testid="compact-stacked" style={{ width: 360 }}>
            <Exports rowHeight="density" stackBelow="sm" />
          </div>
          <div data-testid="compact-stacked-default" style={{ width: 360 }}>
            <Exports stackBelow="sm" />
          </div>
          <div data-testid="compact-cards" style={{ width: 360 }}>
            <Exports rowHeight="density" stackBelow="sm" stackStyle="cards" />
          </div>
          <div data-testid="compact-cards-default" style={{ width: 360 }}>
            <Exports stackBelow="sm" stackStyle="cards" />
          </div>
        </Aura.AuraProvider>
        <div data-testid="comfortable">
          <Exports rowHeight="density" />
        </div>
        <div data-testid="no-align">
          <Aura.Table caption="No align" captionHidden rowHeight="density">
            <Aura.TBody>
              <Aura.Tr data-testid="no-align-row">
                <Aura.Td>members-2026-09.csv</Aura.Td>
                <Aura.Td>
                  <Aura.StatusPill tone="ready">Ready</Aura.StatusPill>
                </Aura.Td>
              </Aura.Tr>
            </Aura.TBody>
          </Aura.Table>
        </div>
      </Aura.Stack>
    </div>
  ),
};
