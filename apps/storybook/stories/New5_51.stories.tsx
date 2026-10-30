import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

type Lang = 'en' | 'th' | 'sv';
const meta: Meta<{ lang: Lang }> = {
  title: 'AURA/New in 5.51 Chamber-OS 157-160',
  args: { lang: 'en' },
  argTypes: { lang: { control: 'inline-radio', options: ['en', 'th', 'sv'] } },
};
export default meta;

const STAGE = {
  en: ['Awaiting marketing review', 'Member approved — awaiting schedule', 'Changes requested by member', 'Sent'],
  th: ['รอฝ่ายการตลาดตรวจสอบ', 'สมาชิกอนุมัติแล้ว — รอกำหนดเวลา', 'สมาชิกขอให้แก้ไข', 'ส่งแล้ว'],
  sv: [
    'Väntar på marknadsgranskning',
    'Medlem godkände — väntar på schemaläggning',
    'Ändringar begärda av medlem',
    'Skickad',
  ],
};
const ORDERS = [
  { id: 'stage', label: 'Longest in stage first', col: 'timeInStage', dir: 'descending' as const },
  { id: 'recent', label: 'Most recent first', col: 'submitted', dir: 'descending' as const },
  { id: 'send', label: 'By send time', col: 'sendTime', dir: 'ascending' as const },
];

function rowsFor(lang: Lang) {
  return [0, 1, 2, 3].map((i) => ({
    id: 'EB-' + (1201 + i),
    member: ['Nordic Foods Co., Ltd.', 'Siam Volvo Parts', 'Lund Design Studio', 'Bangkok Timber AB'][i],
    subject: ['Autumn mixer invitation', 'Board election notice', 'New member welcome', 'Year-end gala'][i],
    stage: STAGE[lang][i],
    turn: ['Marketing', 'Member', 'Member', '—'][i],
    timeInStage: ['6 d', '4 d', '2 d', '1 h'][i],
    submitted: ['12 Oct', '14 Oct', '16 Oct', '18 Oct'][i],
    sendTime: ['24 Oct 09:00', '22 Oct 10:00', '—', '18 Oct 14:00'][i],
    audience: ['All members', 'Corporate', 'New members', 'All members'][i],
  }));
}

/* #157 + #159: the E-Blast review queue. The page orders it (the buttons stand in for the URL), so the column the
 * order follows carries sortDirection: aria-sort on that header, no sort button, no icon. Every flexible column has
 * a minWidth; the row minimum adds those (868px here) instead of 160 each, so the table fits a 959px box. */
export const ReviewQueue: StoryObj<{ lang: Lang }> = {
  render: function Render(a) {
    const [order, setOrder] = React.useState(ORDERS[0]!);
    const [sel, setSel] = React.useState<Array<string | number>>([]);
    const selectAll = React.useRef<HTMLInputElement | null>(null);
    const dir = (key: string) => (order.col === key ? order.dir : undefined);
    const columns = [
      { key: 'member', label: 'Member', minWidth: 112 },
      { key: 'subject', label: 'Subject', minWidth: 112 },
      {
        key: 'stage',
        label: 'Stage',
        minWidth: 120,
        render: (r: any) => (
          <Aura.StatusPill tone="progress" wrap>
            {r.stage}
          </Aura.StatusPill>
        ),
      },
      { key: 'turn', label: 'Whose turn', minWidth: 80 },
      { key: 'timeInStage', label: 'Time in stage', minWidth: 132, sortDirection: dir('timeInStage') },
      { key: 'sendTime', label: 'Send time', minWidth: 84, sortDirection: dir('sendTime') },
      { key: 'audience', label: 'Audience', minWidth: 100 },
      {
        key: 'actions',
        label: 'Actions',
        width: 128,
        render: () => (
          <span style={{ display: 'flex', gap: 4 }}>
            <Aura.Button size="sm">Approve</Aura.Button>
          </span>
        ),
      },
    ];
    return (
      <div lang={a.lang} style={{ padding: 16 }}>
        <div role="group" aria-label="Order" style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
          {ORDERS.map((o) => (
            <Aura.Tag key={o.id} selected={order.id === o.id} onClick={() => setOrder(o)}>
              {o.label}
            </Aura.Tag>
          ))}
        </div>
        <div data-testid="box" style={{ width: 959, maxWidth: '100%' }}>
          <Aura.DataTable
            label="E-Blast review queue"
            columns={columns}
            rows={rowsFor(a.lang)}
            rowKey="id"
            selectable
            selected={sel}
            onSelectionChange={setSel}
            selectAllRef={selectAll}
            rowHeight="auto"
          />
        </div>
        <p className="aura-text-caption" data-testid="order-line">
          Ordered: {order.label}.
        </p>
        <Aura.Button
          variant="secondary"
          onClick={() => {
            setSel([]);
            selectAll.current?.focus();
          }}
        >
          Clear selection
        </Aura.Button>
      </div>
    );
  },
};

/* #161: keyboard="tab" — Tab walks every checkbox, sort button, subject link and row action in reading order;
 * the grid's headers and arrow keys stay. The first table is the same with the default (grid) keyboard. */
function KeyTable(p: { keyboard?: 'grid' | 'tab'; lang: Lang; testid: string; controls?: boolean }) {
  const [sel, setSel] = React.useState<Array<string | number>>([]);
  const [done, setDone] = React.useState('');
  return (
    <div data-testid={p.testid}>
      <Aura.DataTable
        label={'Queue (' + (p.keyboard || 'grid') + ')'}
        keyboard={p.keyboard}
        columnControls={p.controls}
        rowKey="id"
        selectable
        selected={sel}
        onSelectionChange={setSel}
        stackBelow={640}
        rowHeight="auto"
        columns={[
          { key: 'member', label: 'Member', sortable: true, minWidth: 140 },
          {
            key: 'subject',
            label: 'Subject',
            minWidth: 160,
            render: (r: any) => <a href={'#' + r.id}>{r.subject}</a>,
          },
          {
            key: 'stage',
            label: 'Stage',
            minWidth: 120,
            render: (r: any) => (
              <Aura.StatusPill tone="progress" wrap>
                {r.stage}
              </Aura.StatusPill>
            ),
          },
          {
            key: 'actions',
            label: '',
            actions: true,
            width: 200,
            render: (r: any) => (
              <span style={{ display: 'flex', gap: 4 }}>
                <Aura.Button size="sm" onClick={() => setDone('Approved ' + r.id)}>
                  Approve
                </Aura.Button>
                <Aura.Button size="sm" variant="secondary" onClick={() => setDone('Rejected ' + r.id)}>
                  Reject
                </Aura.Button>
              </span>
            ),
          },
        ]}
        rows={rowsFor(p.lang).slice(0, 3)}
      />
      <p className="aura-text-caption" data-testid={p.testid + '-done'}>
        {done}
      </p>
    </div>
  );
}
export const TabKeys: StoryObj<{ lang: Lang }> = {
  render: (a) => (
    <div lang={a.lang} style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
      <Aura.TextField label="Search e-blasts" data-testid="before" />
      <KeyTable keyboard="tab" lang={a.lang} testid="tab" />
      <Aura.Button variant="secondary" data-testid="after">
        After the table
      </Aura.Button>
      <KeyTable lang={a.lang} testid="grid" />
      <KeyTable keyboard="tab" lang={a.lang} testid="tab-controls" controls />
    </div>
  ),
};

/* #162: grow — the Actions column takes three shares of the spare width, so Approve and Reject sit side by side
 * once the table is wide; at its minimum width it is as before. The second table is the same without grow. */
function GrowTable(p: { grow?: number; testid: string; lang: Lang }) {
  return (
    <div data-testid={p.testid}>
      <Aura.DataTable
        label={'Grow ' + (p.grow || 1)}
        rowKey="id"
        selectable
        stackBelow={640}
        rowHeight="auto"
        columns={[
          { key: 'member', label: 'Member', minWidth: 112 },
          { key: 'subject', label: 'Subject', minWidth: 112 },
          {
            key: 'stage',
            label: 'Stage',
            minWidth: 120,
            render: (r: any) => (
              <Aura.StatusPill tone="progress" wrap>
                {r.stage}
              </Aura.StatusPill>
            ),
          },
          { key: 'turn', label: 'Whose turn', minWidth: 80 },
          { key: 'timeInStage', label: 'Time in stage', minWidth: 132 },
          { key: 'audience', label: 'Audience', minWidth: 100 },
          {
            key: 'actions',
            label: 'Actions',
            minWidth: 128,
            grow: p.grow,
            render: () => (
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <Aura.Button size="sm">Approve</Aura.Button>
                <Aura.Button size="sm" variant="secondary">
                  Reject
                </Aura.Button>
              </span>
            ),
          },
        ]}
        rows={rowsFor(p.lang).slice(0, 2)}
      />
    </div>
  );
}
export const GrowActions: StoryObj<{ lang: Lang }> = {
  parameters: { layout: 'fullscreen' },
  render: (a) => (
    <div lang={a.lang} style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
      <GrowTable grow={3} testid="grow" lang={a.lang} />
      <GrowTable testid="even" lang={a.lang} />
    </div>
  ),
};

/* #163: a wide grid in a narrow box scrolls sideways; the wheel over it still scrolls the page. The second grid has a
 * fixed height (sticky header): the wheel scrolls it first, then the page. */
export const WheelOverWideGrid: StoryObj<{ lang: Lang }> = {
  parameters: { layout: 'fullscreen' },
  render: (a) => (
    <div lang={a.lang} style={{ padding: 16 }}>
      <div style={{ height: 400 }} />
      <div data-testid="wide" style={{ width: 700, maxWidth: '100%' }}>
        <GrowTable testid="wide-table" lang={a.lang} />
      </div>
      <div style={{ height: 200 }} />
      <div data-testid="fixed" style={{ width: 600, maxWidth: '100%' }}>
        <Aura.DataTable
          label="Fixed height"
          rowKey="id"
          height={200}
          columns={[
            { key: 'id', label: 'ID', width: 96 },
            { key: 'member', label: 'Member' },
          ]}
          rows={Array.from({ length: 30 }, (_, i) => ({ id: 'R-' + (i + 1), member: 'Member ' + (i + 1) }))}
        />
      </div>
      <div style={{ height: 1200 }} />
    </div>
  ),
};

/* #157 with a sortable column: the page's order (sortDirection on Received) shows until someone sorts by Name;
 * then Name's sort is the only one announced. */
export const PageOrderAndSortable: StoryObj = {
  render: () => (
    <div style={{ padding: 16, maxWidth: 640 }}>
      <Aura.DataTable
        label="Mixed"
        rowKey="id"
        columns={[
          { key: 'id', label: 'ID', width: 96 },
          { key: 'name', label: 'Name', sortable: true },
          { key: 'received', label: 'Received', sortDirection: 'descending' },
          { key: 'amount', label: 'Amount', sortable: true },
        ]}
        rows={[
          { id: 'A-1', name: 'Nordic Foods', received: '18 Oct', amount: 3 },
          { id: 'A-2', name: 'Lund Design', received: '16 Oct', amount: 1 },
          { id: 'A-3', name: 'Siam Parts', received: '12 Oct', amount: 2 },
        ]}
      />
    </div>
  ),
};

/* #158: a pill in a narrow box. With wrap the words break inside one rounded pill; without it, as before. */
export const PillWrap: StoryObj<{ lang: Lang }> = {
  render: (a) => (
    <div lang={a.lang} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16, padding: 16 }}>
      <div data-testid="narrow" style={{ width: 128, border: '1px dashed var(--aura-border-default)' }}>
        <Aura.StatusPill tone="progress" wrap>
          {STAGE[a.lang][1]}
        </Aura.StatusPill>
      </div>
      <div data-testid="wide" style={{ width: 480, maxWidth: '100%' }}>
        <Aura.StatusPill tone="progress" wrap>
          {STAGE[a.lang][3]}
        </Aura.StatusPill>{' '}
        <Aura.StatusPill tone="progress">{STAGE[a.lang][3]}</Aura.StatusPill>
      </div>
      {/* Addendum 61: the Swedish example in a 200px box → two lines with 16px corners; "Scheduled" on one line as before. */}
      <div data-testid="sv200" lang="sv" style={{ width: 200 }}>
        <Aura.StatusPill tone="progress" wrap>
          Väntar på granskning av marknadsföring
        </Aura.StatusPill>
      </div>
      <div data-testid="oneline" style={{ display: 'grid', justifyItems: 'start', gap: 8 }}>
        <div>
          <Aura.StatusPill tone="progress" wrap>
            Scheduled
          </Aura.StatusPill>
        </div>
        <div>
          <Aura.StatusPill tone="progress">Scheduled</Aura.StatusPill>
        </div>
      </div>
      <div data-testid="plain" style={{ width: 128 }}>
        <Aura.StatusPill tone="progress">{STAGE[a.lang][0]}</Aura.StatusPill>
      </div>
      <div data-testid="cards" style={{ width: 360, maxWidth: '100%' }}>
        <Aura.DataTable
          label="Stacked"
          stackBelow={640}
          rowKey="id"
          columns={[
            { key: 'id', label: 'ID' },
            {
              key: 'stage',
              label: 'Stage',
              render: (r: any) => (
                <Aura.StatusPill tone="progress" wrap>
                  {r.stage}
                </Aura.StatusPill>
              ),
            },
          ]}
          rows={rowsFor(a.lang).slice(0, 2)}
        />
      </div>
    </div>
  ),
};

/* #160: stage toggles (pressed Tags with a count) are FilterBar's own controls, so from 640px they show their whole
 * label; a Tag outside FilterBar keeps the 24ch cap. */
export const FilterToggles: StoryObj<{ lang: Lang }> = {
  render: function Render(a) {
    const [stage, setStage] = React.useState(2);
    return (
      <div lang={a.lang} style={{ padding: 16, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24 }}>
        <div data-testid="bar">
          <Aura.FilterBar
            collapseBelow="sm"
            search=""
            onSearchChange={() => {}}
            searchLabel="Search e-blasts"
            filterCount={1}
          >
            <fieldset
              style={{ border: 0, margin: 0, padding: 0, display: 'flex', gap: 8, flexWrap: 'wrap', minWidth: 0 }}
            >
              <legend className="aura-sr-only">Stage</legend>
              {STAGE[a.lang].slice(0, 3).map((s, i) => (
                <Aura.Tag key={s} selected={stage === i} onClick={() => setStage(i)} touchHeight>
                  {s} <span>{i + 1}</span>
                </Aura.Tag>
              ))}
            </fieldset>
          </Aura.FilterBar>
        </div>
        <div data-testid="outside">
          <Aura.Tag selected={false} onClick={() => {}}>
            {STAGE[a.lang][1] + ' · ' + STAGE[a.lang][2]} <span>3</span>
          </Aura.Tag>
        </div>
      </div>
    );
  },
};

/* 5.50 follow-up: a disabled box with aria-invalid inside an enabled custom Field keeps its disabled edge. */
export const DisabledInvalidInField: StoryObj = {
  render: () => (
    <div data-testid="nested-disabled" style={{ padding: 16, maxWidth: 480 }}>
      <Aura.Field id="phone" label="Phone">
        <div style={{ display: 'flex', gap: 8 }}>
          <Aura.TextField label="Country code" defaultValue="+66" disabled aria-invalid="true" />
          <Aura.TextField label="Number" aria-invalid="true" defaultValue="12" />
          <Aura.Textarea label="Note" disabled aria-invalid="true" defaultValue="—" />
        </div>
      </Aura.Field>
    </div>
  ),
};
