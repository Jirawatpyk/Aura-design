import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.7' };
export default meta;

/* 57: an account menu that opens with who is signed in. */
export const AccountMenu: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', justifyContent: 'flex-end', padding: 16 }}>
      <Aura.DropdownMenu
        label="Account"
        header={
          <>
            <p>
              <strong>Jirawat Piyakit</strong>
            </p>
            <p>tao@example.co.th</p>
            <p>Chamber admin</p>
          </>
        }
        trigger={<Aura.Button variant="secondary">Account</Aura.Button>}
        items={[
          { label: 'Profile', icon: 'user' },
          { label: 'Settings', icon: 'settings' },
          { separator: true, label: '' },
          { label: 'Sign out', icon: 'log-out' },
        ]}
      />
    </div>
  ),
};

/* 58: an organisational segment with no page reads as text. */
export const TextCrumb: StoryObj = {
  render: () => (
    <Aura.Breadcrumb items={[{ label: 'Settings', href: '#s' }, { label: 'Renewals' }, { label: 'Schedules' }]} />
  ),
};

/* 59 + 62: focus returns to <main> when the row acted on leaves the list; SideNav rows are 44px on touch. */
export const ShellFocus: StoryObj = {
  render: () => {
    const [rows, setRows] = React.useState(['Member A', 'Member B']);
    return (
      <Aura.AppShell
        mainId="main-content"
        header={<strong>Staff</strong>}
        nav={
          <Aura.SideNav
            defaultValue="users"
            sections={[
              {
                items: [
                  { id: 'home', label: 'Home', icon: 'house' },
                  { id: 'users', label: 'Users', icon: 'users' },
                ],
              },
            ]}
          />
        }
      >
        <Aura.Stack gap={2}>
          {rows.map((r) => (
            <Aura.Stack key={r} direction="row" gap={2}>
              <span className="aura-text-body">{r}</span>
              <Aura.Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  setRows((x) => x.filter((y) => y !== r));
                  document.getElementById('main-content')!.focus({ preventScroll: true });
                }}
              >
                {'Approve ' + r}
              </Aura.Button>
            </Aura.Stack>
          ))}
        </Aura.Stack>
      </Aura.AppShell>
    );
  },
};

/* 60: a confirmation with a typed reason ignores a stray scrim click; Escape and Close still close it. */
export const ConfirmWithReason: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [closed, setClosed] = React.useState(0);
    return (
      <div>
        <Aura.Button onClick={() => setOpen(true)}>Reject request</Aura.Button>
        <p className="aura-text-body" data-testid="closed">
          Closed {closed}
        </p>
        <Aura.Dialog
          open={open}
          role="alertdialog"
          title="Reject this change request?"
          onClose={() => {
            setOpen(false);
            setClosed((n) => n + 1);
          }}
          footer={
            <Aura.Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Aura.Button>
          }
        >
          <Aura.Textarea label="Reason" />
        </Aura.Dialog>
      </div>
    );
  },
};

/* 61: a short visible label with a full accessible name. */
export const ShortTabs: StoryObj = {
  render: () => (
    <Aura.BottomNav
      hideFrom={false}
      defaultValue="home"
      items={[
        { id: 'home', label: 'Hem', icon: 'house' },
        { id: 'perks', label: 'สิทธิ', ariaLabel: 'สิทธิประโยชน์', icon: 'file-text', count: 3 },
        { id: 'me', label: 'Konto', ariaLabel: 'Mitt konto', icon: 'user' },
      ]}
    />
  ),
};

/* 63 (5.7.1): long labels wrap to two lines in a 240px nav instead of an ellipsis. */
export const LongNavLabels: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', height: 420 }} lang="sv">
      <Aura.SideNav
        defaultValue="sv"
        sections={[
          {
            items: [
              { id: 'home', label: 'Home', icon: 'house' },
              { id: 'sv', label: 'Godkännande av medlemsändringar', icon: 'users', count: 4 },
              { id: 'th', label: 'การอนุมัติคำขอแก้ไขข้อมูลของสมาชิก', icon: 'file-text' },
              /* 64 (5.7.2): hyphens: auto where the browser has a Swedish dictionary; a soft hyphen everywhere. */
              { id: 'mg', label: 'Marknadsföringsmålgrupp', icon: 'mail', count: 12 },
              { id: 'shy', label: 'Marknadsförings\u00ADmålgrupp', icon: 'globe', count: 12 },
            ],
          },
        ]}
      />
    </div>
  ),
};

/* 65 (5.7.3): FormErrorSummary with react-hook-form's live errors takes focus on submit only, never while typing;
 * a server error set after a valid submit still takes it. */
type Login = { email: string; password: string };
export const SummaryFocusOnSubmit: StoryObj = {
  render: () => {
    const { register, handleSubmit, setError, setFocus, formState } = useForm<Login>({ shouldFocusError: false });
    return (
      <form
        noValidate
        style={{ maxWidth: 380, display: 'grid', gap: 20 }}
        onSubmit={handleSubmit(() => {
          /* The request isn't awaited: submitCount changes now, the server's answer arrives later. */
          setTimeout(() => setError('password', { message: 'Wrong email or password' }), 300);
        })}
      >
        <Aura.FormErrorSummary
          errors={formState.errors}
          focusKey={formState.submitCount}
          onSelect={(f) => setFocus(f as keyof Login)}
        />
        <Aura.TextField
          label="Email address"
          type="email"
          error={formState.errors.email?.message}
          {...register('email', { required: 'Enter your email address' })}
        />
        <Aura.PasswordField
          label="Password"
          error={formState.errors.password?.message}
          {...register('password', { required: 'Enter your password' })}
        />
        <Aura.Button type="submit">Sign in</Aura.Button>
      </form>
    );
  },
};

/* 65: validated on blur before any submit — the summary shows but doesn't take focus. */
export const SummaryFocusOnBlur: StoryObj = {
  render: () => {
    const { register, handleSubmit, formState } = useForm<Login>({ mode: 'onBlur', shouldFocusError: false });
    return (
      <form noValidate style={{ maxWidth: 380, display: 'grid', gap: 20 }} onSubmit={handleSubmit(() => {})}>
        <Aura.FormErrorSummary errors={formState.errors} focusKey={formState.submitCount} />
        <Aura.TextField
          label="Email address"
          type="email"
          error={formState.errors.email?.message}
          {...register('email', { required: 'Enter your email address' })}
        />
        <Aura.PasswordField label="Password" {...register('password')} />
        <Aura.Button type="submit">Sign in</Aura.Button>
      </form>
    );
  },
};
