import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconTrash2 } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.11' };
export default meta;

type Member = { id: string; company: string; tier: string; tags: string[]; city: string };
const members: Member[] = [
  { id: 'M-101', company: 'Acme AB', tier: 'Gold', tags: ['Exporter', 'Board member'], city: 'Stockholm' },
  { id: 'M-102', company: 'Nordic Timber Oy', tier: 'Silver', tags: ['Importer'], city: 'Helsinki' },
  { id: 'M-103', company: 'Siam Logistics Co., Ltd.', tier: 'Gold', tags: ['Exporter', 'Sponsor'], city: 'Bangkok' },
];

/* 75 + 77 (Chamber-OS addendum 11): each row box is named after its row, and every box — header too — takes clicks
 * over 24×24 around the 16px it draws. Grid and cards (stackBelow) are the same markup. */
export const SelectionLabelsAndTargets: StoryObj = {
  render: () => {
    const [sel, setSel] = React.useState<Array<string | number>>([]);
    const table = (label: string, stack?: number) => (
      <Aura.DataTable<Member>
        label={label}
        rows={members}
        rowKey="id"
        selectable
        selected={sel}
        onSelectionChange={setSel}
        rowSelectLabel={(r) => 'Select ' + r.company}
        stackBelow={stack}
        columns={[
          { key: 'company', label: 'COMPANY', width: 220 },
          { key: 'tier', label: 'TIER', width: 96 },
          { key: 'city', label: 'CITY' },
        ]}
      />
    );
    return (
      <Aura.Stack gap={6}>
        <div data-testid="sel-grid">{table('Members')}</div>
        <div data-testid="sel-cards" style={{ maxWidth: 420 }}>
          {table('Members (cards)', 640)}
        </div>
        <div data-testid="sel-default">
          <Aura.DataTable
            label="Members (default names)"
            rows={members}
            rowKey="id"
            selectable
            columns={[
              { key: 'company', label: 'COMPANY', width: 220 },
              { key: 'city', label: 'CITY' },
            ]}
          />
        </div>
        {/* Fixed height (sticky header) and narrower than its columns (scrolls sideways), nothing pinned. */}
        <div data-testid="sel-scroll" style={{ width: 380 }}>
          <Aura.DataTable<Member>
            label="Members (scrolling)"
            rows={[...members, ...members.map((m) => ({ ...m, id: m.id + '-b' }))]}
            rowKey="id"
            selectable
            height={200}
            rowSelectLabel={(r) => 'Select ' + r.company + ' ' + r.id}
            columns={[
              { key: 'company', label: 'COMPANY', width: 220 },
              { key: 'tier', label: 'TIER', width: 96 },
              { key: 'city', label: 'CITY' },
            ]}
          />
        </div>
      </Aura.Stack>
    );
  },
};

/* 76: a passed aria-describedby is kept, with the description's own id after it. */
export const CheckboxDescribedBy: StoryObj = {
  render: () => (
    <Aura.Stack gap={3}>
      <p id="terms-hint" className="aura-text-body">
        You can withdraw consent at any time.
      </p>
      <Aura.Checkbox id="terms" aria-describedby="terms-hint" description="We send one newsletter a month.">
        Email me the member newsletter
      </Aura.Checkbox>
      <Aura.Checkbox id="plain">No description</Aura.Checkbox>
      <Aura.Checkbox id="only-own" aria-describedby="terms-hint">
        Only a passed hint
      </Aura.Checkbox>
    </Aura.Stack>
  ),
};

/* 78: rowHeight="auto" — the TAGS cell wraps its two badges and the row grows; other cells stay centred. The second
 * table is the default: one fixed line per row. Cards are unchanged by it. */
export const AutoRowHeight: StoryObj = {
  render: () => {
    const columns: Aura.DataTableColumn<Member>[] = [
      { key: 'id', label: 'ID', width: 96, mono: true, pinned: true },
      { key: 'company', label: 'COMPANY', width: 180 },
      {
        key: 'tags',
        label: 'TAGS',
        width: 150,
        render: (r) =>
          r.tags.map((t) => (
            <Aura.Badge key={t} tone="accent">
              {t}
            </Aura.Badge>
          )),
      },
      { key: 'tier', label: 'TIER', width: 96, pill: true, tones: { Gold: 'ready', Silver: 'neutral' } },
      { key: 'city', label: 'CITY', align: 'end' },
    ];
    return (
      <Aura.Stack gap={6}>
        <div data-testid="auto-rows" style={{ maxWidth: 760 }}>
          <Aura.DataTable<Member>
            label="Members (auto rows)"
            rows={members}
            rowKey="id"
            selectable
            rowHeight="auto"
            columns={columns}
          />
        </div>
        <div data-testid="fixed-rows" style={{ maxWidth: 760 }}>
          <Aura.DataTable<Member>
            label="Members (fixed rows)"
            rows={members}
            rowKey="id"
            selectable
            columns={columns}
          />
        </div>
        {/* Below stackBelow both are cards, and look the same. */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {[true, false].map((auto) => (
            <div key={String(auto)} data-testid={auto ? 'auto-cards' : 'fixed-cards'} style={{ width: 380 }}>
              <Aura.DataTable<Member>
                label={auto ? 'Members (auto rows, cards)' : 'Members (cards)'}
                rows={members}
                rowKey="id"
                selectable
                stackBelow={640}
                rowHeight={auto ? 'auto' : undefined}
                columns={columns.filter((c) => !c.pinned)}
              />
            </div>
          ))}
        </div>
        {/* Compact density with small buttons: rows that don't wrap keep the density height in both modes. */}
        {[true, false].map((auto) => (
          <div key={String(auto)} data-testid={auto ? 'auto-compact' : 'fixed-compact'} style={{ maxWidth: 760 }}>
            <Aura.DataTable<Member>
              label={auto ? 'Members (auto rows, compact)' : 'Members (compact)'}
              density="compact"
              rows={members}
              rowKey="id"
              rowHeight={auto ? 'auto' : undefined}
              columns={[
                { key: 'company', label: 'COMPANY', width: 220 },
                { key: 'tier', label: 'TIER', width: 96, pill: true, tones: { Gold: 'ready', Silver: 'neutral' } },
                {
                  key: 'edit',
                  label: '',
                  width: 180,
                  render: (r) => (
                    <>
                      <Aura.Button size="sm" variant="secondary">
                        Edit
                      </Aura.Button>{' '}
                      <Aura.IconButton icon={<IconTrash2 />} label={'Remove ' + r.company} />
                    </>
                  ),
                },
                { key: 'city', label: 'CITY' },
              ]}
            />
          </div>
        ))}
      </Aura.Stack>
    );
  },
};
