import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 4.13' };
export default meta;

/* 8: tone shorthands, a loading toast that turns into its result, one toast per id. */
export const Toasts: StoryObj = {
  render: () => (
    <Aura.Stack direction="row" gap={3} wrap>
      <Aura.Toaster />
      <Aura.Button
        onClick={() => {
          const id = Aura.toast.loading('Saving invoice', { id: 'save' });
          setTimeout(() => Aura.toast.success('Invoice saved', { id, description: 'INV-1042 was sent to Acme AB.' }), 900);
        }}
      >
        Save (loading → success)
      </Aura.Button>
      <Aura.Button variant="secondary" onClick={() => Aura.toast.error('Could not reach the payment service', { id: 'pay' })}>
        Error
      </Aura.Button>
      <Aura.Button variant="secondary" onClick={() => Aura.toast.warning('Membership renews in 7 days')}>Warning</Aura.Button>
      <Aura.Button variant="secondary" onClick={() => Aura.toast.info('3 new members this week')}>Info</Aura.Button>
    </Aura.Stack>
  ),
};

/* 10: PasswordField and FormErrorSummary with react-hook-form (register, setFocus, formState.errors). */
type SignIn = { email: string; password: string };
export const SignInForm: StoryObj = {
  render: () => {
    const { register, handleSubmit, setFocus, formState } = useForm<SignIn>({ shouldFocusError: false });
    const [done, setDone] = React.useState(false);
    return (
      <form
        noValidate
        style={{ maxWidth: 380, display: 'grid', gap: 20 }}
        onSubmit={handleSubmit(() => setDone(true))}
      >
        <Aura.FormErrorSummary errors={formState.errors} focusKey={formState.submitCount} onSelect={(f) => setFocus(f as keyof SignIn)} />
        <Aura.TextField
          label="Email address"
          type="email"
          autoComplete="email"
          error={formState.errors.email?.message}
          {...register('email', { required: 'Enter your email address' })}
        />
        <Aura.PasswordField
          label="Password"
          error={formState.errors.password?.message}
          {...register('password', { required: 'Enter your password', minLength: { value: 8, message: 'Use at least 8 characters' } })}
        />
        <Aura.Button type="submit">Sign in</Aura.Button>
        {done ? <p className="aura-text-body" data-testid="done">Signed in</p> : null}
      </form>
    );
  },
};

/* 11: FilterBar driving a server-mode DataTable; the state lives in the URL (search params). */
const MEMBERS = Array.from({ length: 64 }, (_, i) => ({
  id: 'M-' + (2001 + i),
  name: ['Acme AB', 'Nordic Rail', 'Siam Foods', 'Volvo Thai', 'Ericsson TH', 'Ikea Bangna', 'Scania TH', 'SKF Thailand'][i % 8] + (i >= 8 ? ' ' + (Math.floor(i / 8) + 1) : ''),
  tier: ['Corporate', 'SME', 'Individual'][i % 3],
  status: ['Active', 'Lapsed', 'Active', 'Pending'][i % 4],
}));
function readUrl() {
  const p = new URLSearchParams(window.location.search);
  return { q: p.get('q') || '', tier: p.get('tier') || '', page: Number(p.get('page') || 1) };
}
export const FilterBarServer: StoryObj = {
  name: 'FilterBar + server table',
  render: () => {
    const [st, setSt] = React.useState(readUrl);
    const write = (next: Partial<typeof st>) =>
      setSt((prev) => {
        const s = { ...prev, ...next };
        const p = new URLSearchParams(window.location.search);
        (['q', 'tier', 'page'] as const).forEach((k) => (s[k] && !(k === 'page' && s[k] === 1) ? p.set(k, String(s[k])) : p.delete(k)));
        window.history.replaceState(null, '', '?' + p.toString());
        return s;
      });
    const match = MEMBERS.filter(
      (m) => (!st.q || m.name.toLowerCase().includes(st.q.toLowerCase())) && (!st.tier || m.tier === st.tier),
    );
    return (
      <Aura.Stack gap={4}>
        <Aura.FilterBar
          search={st.q}
          onSearchChange={(q) => write({ q, page: 1 })}
          searchLabel="Search members"
          filters={st.tier ? [{ id: 'tier', label: 'Tier: ' + st.tier, onRemove: () => write({ tier: '', page: 1 }) }] : []}
          onClearAll={() => write({ q: '', tier: '', page: 1 })}
          resultCount={match.length}
          actions={<Aura.Button variant="secondary" icon="download">Export</Aura.Button>}
        >
          <Aura.SegmentedControl
            label="Tier"
            size="sm"
            value={st.tier || 'All'}
            onChange={(v) => write({ tier: v === 'All' ? '' : v, page: 1 })}
            options={['All', 'Corporate', 'SME', 'Individual']}
          />
        </Aura.FilterBar>
        <Aura.DataTable
          label="Members"
          manual
          rows={match.slice((st.page - 1) * 10, st.page * 10)}
          totalRows={match.length}
          pageSize={10}
          page={st.page}
          onPageChange={(page) => write({ page })}
          empty={{ icon: 'search', title: 'No members match', description: 'Try another name or clear the filters.' }}
          columns={[
            { key: 'id', label: 'ID', width: 100, mono: true },
            { key: 'name', label: 'NAME' },
            { key: 'tier', label: 'TIER', width: 140 },
            { key: 'status', label: 'STATUS', width: 120, pill: true, tones: { Active: 'ready', Pending: 'progress' } },
          ]}
        />
      </Aura.Stack>
    );
  },
};

/* 12: aura-prose over every tag the editor allows. */
export const Prose: StoryObj = {
  name: 'aura-prose',
  render: () => (
    <article className="aura-prose" style={{ maxWidth: 640 }}>
      <h1>Annual meeting 2026</h1>
      <p>
        The <strong>SweCham annual meeting</strong> is on <em>Thursday 15 October</em> at the <u>Siam Kempinski</u>.
        Read the <a href="#agenda">full agenda</a> before you register.
      </p>
      <h2>Agenda</h2>
      <ol>
        <li>Welcome and opening remarks</li>
        <li>
          Board report
          <ul>
            <li>Membership: 312 companies</li>
            <li>Events: 48 this year</li>
          </ul>
        </li>
        <li>Election of the board</li>
      </ol>
      <h3>Before you come</h3>
      <ul>
        <li>Bring your member card</li>
        <li>Parking is free for members</li>
      </ul>
      <blockquote>“A chamber is only as strong as the members who show up.”</blockquote>
      <hr />
      <h4>Contact</h4>
      <p>Questions? Write to the secretariat.</p>
    </article>
  ),
};

/* 13: a command palette (⌘K / Ctrl+K), also from inside a Dialog. */
export const CommandPalette: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [dlg, setDlg] = React.useState(false);
    const [last, setLast] = React.useState('');
    const items: Aura.CommandItem[] = [
      { id: 'dash', label: 'Dashboard', group: 'Pages', icon: 'layout-dashboard', shortcut: 'G D' },
      { id: 'inv', label: 'Invoices', group: 'Pages', icon: 'file-text', keywords: ['billing', 'faktura'], shortcut: 'G I' },
      { id: 'mem', label: 'Members', group: 'Pages', icon: 'users' },
      { id: 'set', label: 'Settings', group: 'Pages', icon: 'settings', disabled: true, description: 'Admins only' },
      { id: 'new-inv', label: 'New invoice', group: 'Actions', icon: 'plus' },
      { id: 'export', label: 'Export members', group: 'Actions', icon: 'download' },
    ];
    return (
      <Aura.Stack gap={3}>
        <Aura.Stack direction="row" gap={3}>
          <Aura.Button variant="secondary" icon="search" onClick={() => setOpen(true)}>Open command menu</Aura.Button>
          <Aura.Button variant="secondary" onClick={() => setDlg(true)}>Open a dialog</Aura.Button>
        </Aura.Stack>
        <p className="aura-text-body" data-testid="last">Last command: {last || '—'}</p>
        <Aura.Command open={open} onOpenChange={setOpen} items={items} onSelect={(it) => setLast(it.label)} />
        <Aura.Dialog open={dlg} onClose={() => setDlg(false)} title="Edit member">
          <p>Press ⌘K / Ctrl+K here: the palette opens above this dialog.</p>
          <Aura.Button variant="secondary" onClick={() => setOpen(true)}>Open command menu</Aura.Button>
        </Aura.Dialog>
      </Aura.Stack>
    );
  },
};
