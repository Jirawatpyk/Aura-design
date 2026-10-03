import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.31 addendum 41' };
export default meta;

/* The phrase to type, as a chip with a copy button — Chamber-OS's Pattern-typed-confirm. */
function Phrase(props: { text: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      <code
        data-testid="phrase"
        style={{
          padding: '2px 8px',
          borderRadius: 6,
          background: 'var(--aura-bg-surface-hover)',
          border: '1px solid var(--aura-border-default)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        {props.text}
      </code>
      <Aura.IconButton
        icon="copy"
        size="sm"
        label={copied ? 'Copied' : 'Copy'}
        onClick={() => {
          void navigator.clipboard?.writeText(props.text).catch(() => undefined);
          setCopied(true);
        }}
      />
    </span>
  );
}

/* 138 (Chamber-OS addendum 41): `labelAddon` puts a node between a field's label and its box — here the phrase on a
 * typed confirmation, so it is read before the box and can be copied. Hint and error stay below. */
export const LabelAddon: StoryObj = {
  render: () => {
    const [value, setValue] = React.useState('');
    const [tried, setTried] = React.useState(false);
    const bill = 'SC-2026-000119';
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 420 }}>
        <div data-testid="void">
          <Aura.TextField
            label="Type the bill number to confirm"
            labelAddon={<Phrase text={bill} />}
            hint="Voiding can't be undone."
            error={tried && value !== bill ? 'Type the bill number exactly' : undefined}
            required
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-describedby="void-note"
            autoComplete="off"
          />
          <p id="void-note" style={{ margin: '8px 0 0', fontSize: 12 }}>
            The member is emailed a credit note.
          </p>
          <Aura.Button variant="danger" onClick={() => setTried(true)} style={{ marginTop: 8 }}>
            Void invoice
          </Aura.Button>
        </div>
        <div data-testid="refund">
          <Aura.Textarea label="Type the phrase to refund" labelAddon={<Phrase text="REFUND Acme AB" />} rows={2} />
        </div>
        <div data-testid="password">
          <Aura.PasswordField label="Password" labelAddon={<span>At least 12 characters.</span>} />
        </div>
        <div data-testid="plain">
          <Aura.TextField label="Bill number" hint="As printed" />
        </div>
        <div lang="th" data-testid="thai">
          <Aura.TextField label="พิมพ์เลขที่บิลเพื่อยืนยัน" labelAddon={<Phrase text={bill} />} />
        </div>
      </div>
    );
  },
};

/* 139 (Chamber-OS addendum 42): "chosen" follows the brand. A scoped ThemeStyle (SweCham blue) and AURA's default side
 * by side: checkbox, radio, switch, tab underline, current page, selected day and done step. */
function Chosen(props: { name: string }) {
  const [page, setPage] = React.useState(2);
  return (
    <div data-testid={props.name} style={{ display: 'grid', gap: 12, padding: 16 }}>
      <Aura.Checkbox defaultChecked>Send a copy</Aura.Checkbox>
      <Aura.RadioGroup label="Plan" options={['Monthly', 'Yearly']} defaultValue="Yearly" orientation="horizontal" />
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
        ]}
      />
      <Aura.Calendar start="2026-10-03" focus="2026-10-03" />
    </div>
  );
}

export const BrandChecked: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
      <Aura.ThemeStyle brand="#10487A" selector=".swecham" name="SweCham" />
      <div className="swecham">
        <Chosen name="brand" />
      </div>
      <Chosen name="default" />
    </div>
  ),
};
