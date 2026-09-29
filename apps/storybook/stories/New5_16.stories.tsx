import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconLayoutDashboard, IconLogOut, IconSettings, IconUsers } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.16' };
export default meta;

/* 95, 96 (Chamber-OS addenda 15–16): the staff rail — a Sign out action row, a labelled collapse row, groups whose
 * chevron points right when closed, and a brand, its dot and a Staff badge on one row at 240px. */
export const SideNavActions: StoryObj = {
  render: () => {
    const [page, setPage] = React.useState('members');
    const [log, setLog] = React.useState('');
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ height: 560, display: 'flex' }} data-testid="rail">
          <Aura.SideNav
            value={page}
            onChange={setPage}
            chevron="right"
            collapsible
            collapseToggle="row"
            header={
              /* Fixed widths (142 + 8 + 48, 6px apart = 210px), so the test doesn't depend on which font loaded: it
               * fits the 215px the header has with 8px end padding, and wraps in the 207px 16px left. */
              <span data-testid="brand" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
                <strong
                  className="aura-text-label"
                  style={{ width: 142, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}
                >
                  Swedish Chamber OS
                </strong>
                <span
                  aria-hidden="true"
                  style={{ width: 8, height: 8, borderRadius: 999, background: 'var(--aura-accent-dot)' }}
                />
                <span style={{ display: 'inline-flex', width: 48 }}>
                  <Aura.Badge>Staff</Aura.Badge>
                </span>
              </span>
            }
            sections={[
              {
                title: 'Work',
                items: [
                  { id: 'dash', label: 'Dashboard', icon: <IconLayoutDashboard /> },
                  { id: 'members', label: 'Members', icon: <IconUsers /> },
                  {
                    id: 'admin',
                    label: 'Admin',
                    icon: <IconSettings />,
                    children: [
                      { id: 'roles', label: 'Roles' },
                      { id: 'audit', label: 'Audit log' },
                    ],
                  },
                ],
              },
              {
                items: [
                  {
                    id: 'signout',
                    label: 'Sign out',
                    icon: <IconLogOut />,
                    selectable: false,
                    onSelect: () => setLog('Signed out'),
                  },
                ],
              },
            ]}
          />
        </div>
        <div>
          <p data-testid="page">Page: {page}</p>
          <p data-testid="log">{log || 'No action yet'}</p>
        </div>
      </div>
    );
  },
};

type Member = { id: string; company: string };
const MEMBERS: Member[] = ['Acme AB', 'Nordic Timber Oy', 'Siam Logistics', 'Volvo Thailand', 'IKEA Bangna'].map(
  (company, i) => ({ id: 'M-10' + (i + 1), company }),
);

/* 98: Shift-click a box to select a range; the last change is shown as onSelectionChange reports it. */
export const DataTableRange: StoryObj = {
  render: () => {
    const [sel, setSel] = React.useState<Array<string | number>>([]);
    const [change, setChange] = React.useState('');
    return (
      <Aura.Stack gap={4}>
        <Aura.DataTable<Member>
          label="Members"
          rows={MEMBERS}
          rowKey="id"
          selectable
          rangeSelect
          selected={sel}
          onSelectionChange={(keys, c) => {
            setSel(keys);
            setChange(JSON.stringify(c));
          }}
          rowSelectLabel={(r) => 'Select ' + r.company}
          columns={[
            { key: 'id', label: 'MEMBER NO.', width: 140, mono: true },
            { key: 'company', label: 'COMPANY' },
          ]}
        />
        <p data-testid="selected">Selected: {sel.join(', ') || 'none'}</p>
        <pre data-testid="change">{change}</pre>
      </Aura.Stack>
    );
  },
};

/* A footer button inside a Dialog that opens itself closes it with useDialogClose. */
function ContactCancel() {
  const close = Aura.useDialogClose();
  return (
    <Aura.Button variant="secondary" onClick={close}>
      Cancel
    </Aura.Button>
  );
}

/* A Dialog that can't be dismissed still closes from its own Save. */
function AcceptTerms() {
  const close = Aura.useDialogClose();
  return <Aura.Button onClick={close}>Accept</Aura.Button>;
}

/* 101: a Dialog that brings its own trigger and puts attributes on its panel; one that sends focus to the row it
 * just created and resets the page only once it has closed. */
export const DialogOptions: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [rows, setRows] = React.useState(['Anna Berg']);
    const [log, setLog] = React.useState<string[]>([]);
    const newRow = React.useRef<HTMLButtonElement | null>(null);
    return (
      <Aura.Stack gap={4}>
        <Aura.Dialog
          trigger={<Aura.Button variant="secondary">Add contact</Aura.Button>}
          title="Add contact"
          data-testid="contact-dialog"
          footer={<ContactCancel />}
        >
          <Aura.TextField label="Name" />
        </Aura.Dialog>
        <Aura.Dialog
          trigger={<Aura.Button variant="secondary">Accept terms</Aura.Button>}
          title="Accept the new terms"
          dismissible={false}
          footer={<AcceptTerms />}
        >
          <p>You can continue once you accept.</p>
        </Aura.Dialog>
        <Aura.Button onClick={() => setOpen(true)}>Restore primary</Aura.Button>
        <Aura.Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Restore primary contact"
          finalFocus={newRow}
          onCloseComplete={() =>
            setLog((l) => l.concat(['closed:' + (document.querySelector('[role=dialog]') ? 'still-open' : 'gone')]))
          }
          footer={
            <>
              <Aura.Button variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Aura.Button>
              <Aura.Button
                onClick={() => {
                  setRows((r) => r.concat(['Lars Holm']));
                  setOpen(false);
                }}
              >
                Restore
              </Aura.Button>
            </>
          }
        >
          <p>Lars Holm becomes the primary contact again.</p>
        </Aura.Dialog>
        <ul>
          {rows.map((r, i) => (
            <li key={r}>
              <button type="button" ref={i === rows.length - 1 && i > 0 ? newRow : undefined}>
                {r}
              </button>
            </li>
          ))}
        </ul>
        <p data-testid="log">{log.join(' ')}</p>
      </Aura.Stack>
    );
  },
};

const PROVINCES = ['Bangkok', 'Chiang Mai', 'Chon Buri', 'Phuket'];
const COUNTRIES = ['Denmark', 'Finland', 'Germany', 'Japan', 'Norway'];

/* 105: an address field that takes a province abroad, and countries with Thailand and Sweden first as a group. */
export const ComboboxCustom: StoryObj = {
  render: () => {
    const [province, setProvince] = React.useState<string | null>(null);
    const [country, setCountry] = React.useState<string | null>(null);
    return (
      <div style={{ maxWidth: 360 }}>
        <Aura.Stack gap={4}>
          <Aura.Combobox
            label="Province / region"
            options={PROVINCES}
            allowCustomValue
            value={province}
            onChange={setProvince}
          />
          <p data-testid="province">Province: {province ?? 'none'}</p>
          <Aura.Combobox
            label="Country"
            groups={[
              { label: 'Most used', options: ['Thailand', 'Sweden'] },
              { label: 'All countries', options: COUNTRIES },
            ]}
            value={country}
            onChange={setCountry}
          />
          <p data-testid="country">Country: {country ?? 'none'}</p>
          <Aura.Combobox
            label="Country (first three)"
            limit={3}
            groups={[
              { label: 'Most used', options: ['Thailand', 'Sweden'] },
              { label: 'All countries', options: COUNTRIES },
            ]}
          />
        </Aura.Stack>
      </div>
    );
  },
};

/* 95: Sign out in AppShell's phone drawer closes the drawer. */
export const ShellSignOut: StoryObj = {
  render: () => {
    const [log, setLog] = React.useState('');
    return (
      <div style={{ margin: -24 }}>
        <Aura.AppShell
          header={<strong className="aura-text-label">Members</strong>}
          nav={
            <Aura.SideNav
              defaultValue="members"
              items={[
                { id: 'members', label: 'Members', icon: <IconUsers /> },
                {
                  id: 'out',
                  label: 'Sign out',
                  icon: <IconLogOut />,
                  selectable: false,
                  onSelect: () => setLog('Signed out'),
                },
              ]}
            />
          }
        >
          <p data-testid="log">{log || 'Signed in'}</p>
        </Aura.AppShell>
      </div>
    );
  },
};
