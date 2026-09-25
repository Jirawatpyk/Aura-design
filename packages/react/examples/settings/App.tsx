/* Pilot 2: a form-heavy settings page (English, react-hook-form).
 * Checks AURA outside admin tables: long forms, validation, uploads, toggles, sections, quotas, audit list. */
import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  AppShell, SideNav, Container, Stack, Grid, Tabs, Card, Button, IconButton, Badge, Tag, Progress, Accordion, Popover,
  EmptyState, Pagination, TextField, Textarea, Select, RadioGroup, Checkbox, Switch, Combobox, TimePicker, FileUpload,
  Dialog, Alert, Toaster, toast, Skeleton, AuraProvider, ColorSchemeToggle, NumberField, Stepper,
} from '@aura/react';
import type { UploadItem } from '@aura/react';

interface Member { name: string; role: string }
const TIMEZONES = ['Asia/Bangkok', 'Asia/Singapore', 'Asia/Tokyo', 'Europe/London', 'America/New_York'].map((z) => ({ value: z, label: z.replace('_', ' ') }));
const AUDIT = Array.from({ length: 46 }, (_, i) => ({ id: i, who: ['Tao', 'Mai', 'Anna', 'Somchai'][i % 4], what: ['changed the time zone', 'invited a member', 'rotated an API key', 'updated billing email'][i % 4], when: `${(i % 23) + 1}h ago` }));

function Profile() {
  const defaults = { name: 'Tao P', email: 'tao@example.com', role: 'Project Manager', bio: '', timezone: 'Asia/Bangkok' as string | null, avatar: [] as UploadItem[], quietFrom: '22:00' as string | null, quietTo: '07:00' as string | null, hours: 40 as number | null };
  const { register, control, handleSubmit, reset, formState: { errors, isDirty, isSubmitting } } = useForm({ defaultValues: defaults });
  type ProfileForm = typeof defaults;
  async function save(v: ProfileForm) { await new Promise((r) => setTimeout(r, 300)); reset(v); toast({ title: 'Profile saved', tone: 'success' }); }
  return (
    <form onSubmit={handleSubmit(save)} noValidate>
      <Stack gap={6}>
        <Card headingLevel={2} title="Getting started" description="Three steps to a working workspace.">
          <Stepper label="Workspace setup" orientation="vertical" current="team" steps={[
            { id: 'profile', label: 'Complete your profile', description: 'Name, photo and time zone' },
            { id: 'team', label: 'Invite your team', description: '3 of 5 seats used' },
            { id: 'billing', label: 'Choose a plan', description: 'Free until you add a sixth member' },
          ]} />
        </Card>
        <Card headingLevel={2} title="Profile" description="Shown to your team on comments and assignments.">
          <Stack gap={5}>
            <Grid columns={{ base: 1, sm: 2 }} gap={4}>
              <TextField label="Full name" required {...register('name', { required: 'Enter your name' })} error={errors.name?.message} />
              <TextField label="Email" type="email" required {...register('email', { required: 'Enter an email', pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: 'Use an address like name@company.com' } })} error={errors.email?.message} />
            </Grid>
            <TextField label="Role" optional {...register('role')} />
            <Textarea label="Bio" optional rows={3} hint="Up to 200 characters." {...register('bio', { maxLength: { value: 200, message: 'Keep it under 200 characters' } })} error={errors.bio?.message} />
            <Controller name="timezone" control={control} render={({ field }) => <Combobox label="Time zone" options={TIMEZONES} value={field.value} onChange={field.onChange} ref={field.ref} clearable={false} />} />
            <Controller name="avatar" control={control} render={({ field }) => <FileUpload label="Photo" optional accept="image/*" maxSize={2 * 1024 * 1024} value={field.value} onChange={field.onChange} ref={field.ref} />} />
          </Stack>
        </Card>
        <Card headingLevel={2} title="Quiet hours" description="No push notifications between these times.">
          <Grid columns={{ base: 1, sm: 2 }} gap={4}>
            <Controller name="quietFrom" control={control} render={({ field }) => <TimePicker label="From" value={field.value} onChange={field.onChange} ref={field.ref} step={60} />} />
            <Controller name="quietTo" control={control} render={({ field }) => <TimePicker label="To" value={field.value} onChange={field.onChange} ref={field.ref} step={60} />} />
            <Controller name="hours" control={control} rules={{ required: 'Enter your working hours', max: { value: 60, message: 'Up to 60 hours a week' } }}
              render={({ field }) => <NumberField label="Working hours a week" suffix="h" min={0} max={80} value={field.value} onChange={field.onChange} onBlur={field.onBlur} ref={field.ref} error={errors.hours?.message} />} />
          </Grid>
        </Card>
        <Stack direction="row" gap={3} justify="flex-end">
          <Button variant="secondary" disabled={!isDirty} onClick={() => reset()}>Discard</Button>
          <Button type="submit" loading={isSubmitting} disabled={!isDirty}>Save changes</Button>
        </Stack>
      </Stack>
    </form>
  );
}

function Notifications() {
  const [digest, setDigest] = React.useState('daily');
  return (
    <Card headingLevel={2} title="Notifications">
      <Stack gap={5}>
        <RadioGroup label="Email digest" value={digest} onChange={setDigest}
          options={[{ value: 'off', label: 'Off' }, { value: 'daily', label: 'Daily', description: 'One email at 08:00 with everything new.' }, { value: 'weekly', label: 'Weekly', description: 'Monday morning summary.' }]} />
        <Stack gap={3}>
          <Checkbox id="n-mention" defaultChecked description="When someone @mentions you.">Mentions</Checkbox>
          <Checkbox id="n-assign" defaultChecked description="When a task is assigned to you.">Assignments</Checkbox>
          <Checkbox id="n-product" description="New features, at most once a month.">Product news</Checkbox>
        </Stack>
        <Switch label="Push notifications on this device" defaultChecked />
      </Stack>
    </Card>
  );
}

function Team() {
  const [domains, setDomains] = React.useState(['example.com', 'example.co.th']);
  const [draft, setDraft] = React.useState('');
  const [removing, setRemoving] = React.useState<Member | null>(null);
  const [members, setMembers] = React.useState<Member[]>([{ name: 'Tao P', role: 'Owner' }, { name: 'Mai K', role: 'Admin' }, { name: 'Anna S', role: 'Member' }]);
  return (
    <Stack gap={6}>
      <Card headingLevel={2} title="Members" actions={<Badge tone="accent">{members.length} of 5 seats</Badge>}>
        <ul className="pilot-list">
          {members.map((m) => (
            <li key={m.name}>
              <span><strong>{m.name}</strong> <Badge tone={m.role === 'Owner' ? 'accent' : 'neutral'}>{m.role}</Badge></span>
              {m.role !== 'Owner' ? <IconButton icon="trash-2" label={'Remove ' + m.name} onClick={() => setRemoving(m)} /> : null}
            </li>
          ))}
        </ul>
      </Card>
      <Card headingLevel={2} title="Allowed email domains" description="People with these addresses can join without an invite.">
        <Stack gap={4}>
          <Stack direction="row" gap={2} wrap>{domains.map((d) => <Tag key={d} onRemove={() => setDomains(domains.filter((x) => x !== d))}>{d}</Tag>)}</Stack>
          <form onSubmit={(e) => { e.preventDefault(); const d = draft.trim().toLowerCase(); if (d && !domains.includes(d)) setDomains([...domains, d]); setDraft(''); }}>
            <Stack direction={{ base: 'column', sm: 'row' }} gap={3} align={{ base: 'stretch', sm: 'flex-end' }}>
              <TextField label="Add a domain" placeholder="company.com" value={draft} onChange={(e) => setDraft(e.target.value)} />
              <Button type="submit" variant="secondary" icon="plus">Add</Button>
            </Stack>
          </form>
        </Stack>
      </Card>
      <Dialog open={!!removing} onClose={() => setRemoving(null)} role="alertdialog" size="sm" title={removing ? `Remove ${removing.name}?` : ''}
        description="They lose access straight away. Their tasks stay and become unassigned."
        footer={<><Button variant="secondary" onClick={() => setRemoving(null)}>Cancel</Button><Button onClick={() => { setMembers(members.filter((m) => m !== removing)); if (removing) toast({ title: `${removing.name} removed`, tone: 'warning' }); setRemoving(null); }}>Remove Member</Button></>} />
    </Stack>
  );
}

function Billing() {
  return (
    <Stack gap={6}>
      <Card headingLevel={2} title="Plan" actions={<Badge tone="success" icon="check">Active</Badge>}>
        <Stack gap={5}>
          <p className="pilot-p">Team plan · ฿1,490 / month · renews 1 Oct 2026</p>
          <Progress label="Storage" value={7.4} max={10} valueLabel="7.4 of 10 GB" showValue hint="Old attachments are archived after 12 months." />
          <Progress label="Seats" value={3} max={5} valueLabel="3 of 5" showValue tone="neutral" />
        </Stack>
      </Card>
      <Card headingLevel={2} title="API keys">
        <EmptyState size="sm" icon="lock" title="No API keys yet" description="Create a key to connect your own tools. You can revoke it any time."
          action={<Button variant="secondary" icon="plus">Create API Key</Button>} headingLevel={3} />
      </Card>
      <Card headingLevel={2} title="Advanced">
        <Accordion headingLevel={3} items={[
          { id: 'export', title: 'Export all data', description: 'A ZIP of every record, sent by email.', content: <Button variant="secondary" icon="download">Request Export</Button> },
          { id: 'sso', title: 'Single sign-on', description: 'Available on Business.', content: <Alert tone="info" title="Upgrade to use SSO">SAML and Google Workspace sign-in come with the Business plan.</Alert> },
          { id: 'delete', title: 'Delete workspace', content: <Alert tone="danger" title="This can't be undone">Every project, file and member is removed after 30 days.</Alert> },
        ]} />
      </Card>
    </Stack>
  );
}

function Audit() {
  const [page, setPage] = React.useState(1);
  const per = 8, pages = Math.ceil(AUDIT.length / per);
  const rows = AUDIT.slice((page - 1) * per, page * per);
  const [loading, setLoading] = React.useState(true);
  React.useEffect(() => { const t = setTimeout(() => setLoading(false), 400); return () => clearTimeout(t); }, []);
  return (
    <Card headingLevel={2} title="Audit log" actions={
      <Popover title="What's recorded" trigger={<IconButton icon="info" label="What's recorded" />}>
        <p className="pilot-p">Sign-ins, member changes, billing and API keys. Kept for 90 days.</p>
      </Popover>}>
      <Stack gap={4}>
        {loading ? <Skeleton lines={6} /> : (
          <ul className="pilot-list" aria-label="Audit events">
            {rows.map((r) => <li key={r.id}><span><strong>{r.who}</strong> {r.what}</span><span className="pilot-muted">{r.when}</span></li>)}
          </ul>
        )}
        <Pagination pageCount={pages} page={page} onChange={setPage} label="Audit log pages" />
      </Stack>
    </Card>
  );
}

export function App() {
  const [tab, setTab] = React.useState('profile');
  return (
    <AuraProvider locale="en">
      <AppShell navLabel="Main" header={<div className="pilot-bar"><strong>Settings</strong><ColorSchemeToggle /></div>}
        nav={<SideNav value="settings" header={<strong className="pilot-brand">AURA</strong>} items={[
          { id: 'home', label: 'Home', icon: 'house' }, { id: 'projects', label: 'Projects', icon: 'folder' }, { id: 'settings', label: 'Settings', icon: 'settings' }]} />}>
        <Container size="narrow">
          <Stack gap={6}>
            <div><h1 className="pilot-h1">Settings</h1><p className="pilot-sub">Workspace “Acme” · you are an Owner</p></div>
            <Tabs label="Settings sections" value={tab} onChange={setTab} tabs={[
              { id: 'profile', label: 'Profile', content: <Profile /> },
              { id: 'notifications', label: 'Notifications', content: <Notifications /> },
              { id: 'team', label: 'Team', count: 3, content: <Team /> },
              { id: 'billing', label: 'Billing', content: <Billing /> },
              { id: 'audit', label: 'Audit log', content: <Audit /> },
            ]} />
          </Stack>
        </Container>
        <Toaster />
      </AppShell>
    </AuraProvider>
  );
}
