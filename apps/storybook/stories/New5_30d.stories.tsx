import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.30 polish' };
export default meta;

type Row = { id: string; member: string; city: string; tier: string; owner: string; amount: string };
const ROWS: Row[] = [
  { id: 'M-101', member: 'Acme AB', city: 'Stockholm', tier: 'Corporate', owner: 'Jirawat', amount: '12,400.00' },
  { id: 'M-102', member: 'Nordic Timber Oy', city: 'Helsinki', tier: 'SME', owner: 'Ploy', amount: '8,100.00' },
];

/* 5.30 audit, items 4, 8–20: "chosen" is violet everywhere; tables say they scroll; fields, filters and bars line up. */
export const Polish: StoryObj = {
  render: () => {
    const [page, setPage] = React.useState(2);
    const [tags, setTags] = React.useState(['Status: Unpaid', 'Tier: SME']);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 760 }}>
        <div data-testid="chosen" style={{ display: 'grid', gap: 12 }}>
          <Aura.Checkbox defaultChecked>Send a copy</Aura.Checkbox>
          <Aura.RadioGroup
            label="Plan"
            options={['Monthly', 'Yearly']}
            defaultValue="Yearly"
            orientation="horizontal"
          />
          <Aura.Switch label="Email me" defaultChecked />
          <Aura.Tabs
            label="Sections"
            tabs={[
              { id: 'a', label: 'Overview', content: <p>Overview</p> },
              { id: 'b', label: 'Invoices', content: <p>Invoices</p> },
            ]}
          />
          <Aura.Pagination pageCount={5} page={page} onChange={setPage} />
          <Aura.Stepper
            label="Setup"
            current="b"
            steps={[
              { id: 'a', label: 'Profile' },
              { id: 'b', label: 'Team' },
              { id: 'c', label: 'Plan' },
            ]}
          />
        </div>
        <div data-testid="row" style={{ display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <Aura.TextField label="Search" placeholder="Name or ID" />
          <Aura.SegmentedControl label="View" options={['Table', 'Cards']} defaultValue="Table" />
        </div>
        <Aura.FilterBar label="Member filters" search="" onSearchChange={() => {}} searchLabel="Search members">
          <Aura.FilterSelect label="Tier" allLabel="All" options={['All tiers', 'Corporate', 'SME']} />
        </Aura.FilterBar>
        <div data-testid="tags" style={{ display: 'flex', gap: 8 }}>
          {tags.map((t) => (
            <Aura.Tag key={t} onRemove={() => setTags(tags.filter((x) => x !== t))}>
              {t}
            </Aura.Tag>
          ))}
        </div>
        <Aura.PasswordField label="Password" defaultValue="secret" />
        <Aura.Card title="Membership">
          <p data-testid="prose">
            See the <a href="#benefits">benefits</a> of the plan.
          </p>
          <Aura.ActionBar
            position="container"
            label="Card actions"
            start={<Aura.Button variant="ghost">Cancel</Aura.Button>}
          >
            <Aura.Button>Save</Aura.Button>
          </Aura.ActionBar>
        </Aura.Card>
        <div data-testid="narrow" style={{ width: 320 }}>
          <Aura.Table caption="Members">
            <Aura.THead>
              <Aura.Tr>
                <Aura.Th>ID</Aura.Th>
                <Aura.Th>MEMBER</Aura.Th>
                <Aura.Th>CITY</Aura.Th>
                <Aura.Th>TIER</Aura.Th>
                <Aura.Th numeric>AMOUNT</Aura.Th>
              </Aura.Tr>
            </Aura.THead>
            <Aura.TBody>
              {ROWS.map((r) => (
                <Aura.Tr key={r.id}>
                  <Aura.Td mono>{r.id}</Aura.Td>
                  <Aura.Td>{r.member}</Aura.Td>
                  <Aura.Td>{r.city}</Aura.Td>
                  <Aura.Td>{r.tier}</Aura.Td>
                  <Aura.Td numeric>{r.amount}</Aura.Td>
                </Aura.Tr>
              ))}
            </Aura.TBody>
            <Aura.TFoot>
              <Aura.Tr>
                <Aura.Th scope="row" colSpan={4}>
                  Subtotal
                </Aura.Th>
                <Aura.Td numeric>20,500.00</Aura.Td>
              </Aura.Tr>
              <Aura.Tr>
                <Aura.Th scope="row" colSpan={4}>
                  Total
                </Aura.Th>
                <Aura.Td numeric>21,935.00</Aura.Td>
              </Aura.Tr>
            </Aura.TFoot>
          </Aura.Table>
        </div>
        <div data-testid="email" style={{ width: 600 }}>
          <Aura.Table caption="Billing contacts">
            <Aura.THead>
              <Aura.Tr>
                <Aura.Th>MEMBER</Aura.Th>
                <Aura.Th>EMAIL</Aura.Th>
                <Aura.Th>TIER</Aura.Th>
              </Aura.Tr>
            </Aura.THead>
            <Aura.TBody>
              <Aura.Tr>
                <Aura.Td>Nordic Timber Oy</Aura.Td>
                <Aura.Td>accounts.payable.department@nordictimbergroupholdings.example.com</Aura.Td>
                <Aura.Td>Corporate</Aura.Td>
              </Aura.Tr>
            </Aura.TBody>
          </Aura.Table>
        </div>
        <div data-testid="narrow-grid" style={{ width: 360 }}>
          <Aura.DataTable<Row>
            label="Members grid"
            rows={ROWS}
            rowKey="id"
            columns={[
              { key: 'id', label: 'ID', width: 100 },
              { key: 'member', label: 'MEMBER', width: 180 },
              { key: 'city', label: 'CITY', width: 140 },
              { key: 'owner', label: 'OWNER', width: 140 },
            ]}
          />
        </div>
      </div>
    );
  },
};
