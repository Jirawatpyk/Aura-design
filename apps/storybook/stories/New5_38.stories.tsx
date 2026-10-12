import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.38 Chamber-OS 140-142' };
export default meta;

const ROLE = ['All roles', 'Admin', 'Staff', 'Member'];
const STATUS = ['All statuses', 'Active', 'Invited', 'Disabled'];
const COMPANIES = [
  { value: 'acme', label: 'Acme AB' },
  { value: 'nord', label: 'Nordic Timber Oy' },
  { value: 'siam', label: 'Siam Freight Co., Ltd.' },
];

/* #140: the users page's bar in compact density. With touchHeight the search and both FilterSelects are 44px below
 * 640px (or on a coarse pointer) like the Button beside them; without it they keep the density's 36px with a mouse. */
export const FilterBarTouch: StoryObj = {
  render: function Render() {
    const [q, setQ] = React.useState('');
    const [role, setRole] = React.useState('All roles');
    const [status, setStatus] = React.useState('All statuses');
    return (
      <Aura.AuraProvider density="compact">
        <div style={{ display: 'grid', gap: 32, padding: 16 }}>
          <div data-testid="touch">
            <Aura.FilterBar
              touchHeight
              search={q}
              onSearchChange={setQ}
              searchLabel="Search users"
              actions={<Aura.Button touchHeight>Invite</Aura.Button>}
            >
              <Aura.FilterSelect label="Role" allLabel="All" options={ROLE} value={role} onChange={setRole} />
              <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} value={status} onChange={setStatus} />
              <Aura.SegmentedControl label="View" options={['List', 'Cards']} />
              <Aura.Combobox label="Company" options={COMPANIES} defaultValue="acme" clearable />
            </Aura.FilterBar>
          </div>
          <div data-testid="plain">
            <Aura.FilterBar search="" onSearchChange={() => {}} searchLabel="Search users">
              <Aura.FilterSelect label="Role" allLabel="All" options={ROLE} />
            </Aura.FilterBar>
          </div>
          <div data-testid="one" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Aura.FilterSelect label="Role" allLabel="All" options={ROLE} touchHeight="always" />
            <Aura.FilterSelect label="Status" allLabel="All" options={STATUS} />
          </div>
        </div>
      </Aura.AuraProvider>
    );
  },
};

/* #141: the invite dialog's fields in compact density — the member picker (a Combobox) matches the email field and
 * role select, its clear button and chevron 44px wide side by side. DatePicker, TimePicker and NumberField too. */
export const FieldsTouch: StoryObj = {
  render: function Render() {
    const [company, setCompany] = React.useState<string | null>('nord');
    const [many, setMany] = React.useState<string[]>(['acme', 'nord', 'siam']);
    return (
      <Aura.AuraProvider density="compact">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 16, padding: 16, maxWidth: 420 }}>
          <div data-testid="email">
            <Aura.TextField label="Email" touchHeight defaultValue="anna@example.com" />
          </div>
          <div data-testid="role">
            <Aura.Select label="Role" options={['Admin', 'Staff', 'Member']} touchHeight />
          </div>
          <div data-testid="combo">
            <Aura.Combobox
              label="Link to member company"
              options={COMPANIES}
              value={company}
              onChange={setCompany}
              clearable
              touchHeight
            />
          </div>
          <div data-testid="multi">
            <Aura.Combobox
              label="Companies"
              options={COMPANIES}
              multiple
              value={many}
              onChange={setMany}
              clearable
              touchHeight
            />
          </div>
          <div data-testid="date">
            <Aura.DatePicker label="Event date" defaultValue="2026-10-20" clearable touchHeight />
          </div>
          <div data-testid="time">
            <Aura.TimePicker label="Starts" defaultValue="09:30" touchHeight />
          </div>
          <div data-testid="number">
            <Aura.NumberField label="Seats" defaultValue={4} touchHeight />
          </div>
          <div data-testid="combo-always">
            <Aura.Combobox label="Always" options={COMPANIES} defaultValue="acme" clearable touchHeight="always" />
          </div>
          <div data-testid="combo-plain">
            <Aura.Combobox label="Plain" options={COMPANIES} defaultValue="acme" clearable />
          </div>
        </div>
      </Aura.AuraProvider>
    );
  },
};

const USERS = [
  { id: 'u_101', name: 'Anna Berg', email: 'anna@example.com', role: 'Admin' },
  { id: 'u_102', name: 'Somchai P.', email: 'somchai@example.co.th', role: 'Staff' },
  { id: 'u_103', name: 'Lena Holm', email: 'lena@example.se', role: 'Member' },
];

/* #142: rowProps — data-* and id on each row (table and stacked card); anything else is ignored. */
export const RowProps: StoryObj = {
  render: () => (
    <div data-testid="users" style={{ padding: 16, maxWidth: 820 }}>
      <Aura.DataTable
        label="Users"
        rows={USERS}
        rowKey="id"
        selectable
        stackBelow={640}
        columns={[
          { key: 'name', label: 'NAME' },
          { key: 'email', label: 'EMAIL' },
          { key: 'role', label: 'ROLE', width: 120 },
        ]}
        rowProps={(u) =>
          ({
            id: 'user-' + u.id,
            'data-user-email': u.email,
            'data-user-id': u.id,
            role: 'presentation',
            className: 'not-allowed',
          }) as never
        }
      />
    </div>
  ),
};
