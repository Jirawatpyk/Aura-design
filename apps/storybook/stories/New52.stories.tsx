import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.2' };
export default meta;

/* The totals row is part of the grid: arrow keys reach it. Server paging without totalRows states no total. */
const lines = [
  { id: 'L1', item: 'Rack rental', amount: '12,000.00' },
  { id: 'L2', item: 'Bandwidth', amount: '3,500.00' },
];
export const TableTotalsAndOpenTotal: StoryObj = {
  render: () => {
    const all = Array.from({ length: 12 }, (_, i) => ({ id: 'H-' + (i + 1), host: 'host-' + (i + 1) }));
    const [page, setPage] = React.useState(1);
    return (
      <Aura.Stack gap={6}>
        <div data-testid="totals">
          <Aura.DataTable
            label="Invoice lines"
            rows={lines}
            columns={[
              { key: 'id', label: 'LINE', width: 100 },
              { key: 'item', label: 'ITEM' },
              { key: 'amount', label: 'AMOUNT', width: 140, align: 'end' },
            ]}
            footer={{ id: 'Total', amount: '15,500.00' }}
          />
        </div>
        <div data-testid="open">
          <Aura.DataTable
            label="Hosts, server paged"
            manual
            pageSize={5}
            page={page}
            onPageChange={setPage}
            rows={all.slice((page - 1) * 5, page * 5)}
            columns={[
              { key: 'id', label: 'ID', width: 120 },
              { key: 'host', label: 'HOST' },
            ]}
          />
        </div>
      </Aura.Stack>
    );
  },
};

/* Typing on a phone keypad; a time inside the range that is taken; a stored file with a link and thumbnail. */
const PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
export const InputsAndFiles: StoryObj = {
  render: () => {
    const [d, setD] = React.useState<string | null>(null);
    const [t, setT] = React.useState<string | null>(null);
    return (
      <Aura.Stack gap={4} style={{ maxWidth: 360 }}>
        <Aura.DatePicker label="Install date" value={d} onChange={setD} />
        <p className="aura-text-body" data-testid="date">
          Date: {d || '—'}
        </p>
        <Aura.TimePicker
          label="Visit time"
          min="09:00"
          max="17:00"
          value={t}
          onChange={setT}
          isTimeDisabled={(v) => v === '12:00'}
        />
        <Aura.FileUpload
          label="Contract"
          defaultValue={[{ id: 's1', name: 'contract.png', size: 2048, type: 'image/png', status: 'done', url: PIXEL }]}
        />
        <Aura.Stack direction="row" gap={4} align="center">
          <Aura.Avatar name="Tao Piyakit" status="online" />
          <Aura.SegmentedControl label="Range" options={['Day', 'Week', 'Month']} defaultValue="Week" />
        </Aura.Stack>
      </Aura.Stack>
    );
  },
};

/* A popover taller than the room above and below scrolls inside the viewport. */
export const TallPopover: StoryObj = {
  render: () => (
    <div style={{ paddingTop: 200 }}>
      <Aura.Popover title="All hosts" trigger={<Aura.Button variant="secondary">All hosts</Aura.Button>}>
        <Aura.Stack gap={2}>
          {Array.from({ length: 60 }, (_, i) => (
            <span key={i}>host-{i + 1}.dxt.local</span>
          ))}
        </Aura.Stack>
      </Aura.Popover>
    </div>
  ),
};

/* Filtering on page 3 leaves one page: the table reports page 1 so the app's state (and URL) match. */
export const ClampedPage: StoryObj = {
  render: () => {
    const all = Array.from({ length: 12 }, (_, i) => ({
      id: 'R-' + (i + 1),
      name: i < 4 ? 'match ' + i : 'other ' + i,
    }));
    const [page, setPage] = React.useState(3);
    const [filtered, setFiltered] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    return (
      <Aura.Stack gap={3}>
        <Aura.Button variant="secondary" onClick={() => setFiltered(true)}>
          Filter
        </Aura.Button>
        <Aura.Button
          variant="secondary"
          onClick={() => {
            setLoading(true);
            setTimeout(() => {
              setFiltered(true);
              setLoading(false);
            }, 200);
          }}
        >
          Refetch smaller
        </Aura.Button>
        <p className="aura-text-body" data-testid="state">
          App page: {page}
        </p>
        <Aura.DataTable
          label="Records"
          pageSize={5}
          page={page}
          onPageChange={setPage}
          rows={loading ? [] : filtered ? all.slice(0, 4) : all}
          loading={loading}
          columns={[
            { key: 'id', label: 'ID', width: 100 },
            { key: 'name', label: 'NAME' },
          ]}
        />
      </Aura.Stack>
    );
  },
};

/* A page restored from the URL is kept while the rows load. */
export const RestoredPage: StoryObj = {
  render: () => {
    const all = Array.from({ length: 30 }, (_, i) => ({ id: 'R-' + (i + 1), name: 'row ' + (i + 1) }));
    const [page, setPage] = React.useState(3);
    const [rows, setRows] = React.useState<typeof all>([]);
    React.useEffect(() => {
      const t = setTimeout(() => setRows(all), 300);
      return () => clearTimeout(t);
    }, []);
    return (
      <Aura.Stack gap={3}>
        <p className="aura-text-body" data-testid="state">
          App page: {page}
        </p>
        <Aura.DataTable
          label="Restored"
          pageSize={5}
          page={page}
          onPageChange={setPage}
          rows={rows}
          columns={[
            { key: 'id', label: 'ID', width: 100 },
            { key: 'name', label: 'NAME' },
          ]}
        />
      </Aura.Stack>
    );
  },
};

/* Cards with a totals card whose first fields are blank: arrows land on a shown cell. */
export const TotalsCards: StoryObj = {
  render: () => (
    <div style={{ maxWidth: 380 }}>
      <Aura.DataTable
        label="Lines, phone"
        stackBelow={640}
        rows={lines}
        columns={[
          { key: 'id', label: 'LINE', width: 100 },
          { key: 'item', label: 'ITEM' },
          { key: 'amount', label: 'AMOUNT', width: 140, align: 'end' },
        ]}
        footer={{ amount: '15,500.00' }}
      />
    </div>
  ),
};
