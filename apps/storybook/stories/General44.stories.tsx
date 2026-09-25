/* aura-lint: allow-colours — ThemedStory passes a sample brand colour to ThemeStyle, the input a project would give. */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import { App as SettingsPage } from '../../../packages/react/examples/settings/App.js';
import { App as LandingPage } from '../../../packages/react/examples/landing/App.js';
import '../../../packages/react/examples/settings/pilot.css';

const meta: Meta = { title: 'AURA/New in 4.4' };
export default meta;

export const BadgesAndTags: StoryObj = {
  name: 'Badge and Tag',
  render: () => {
    const [on, setOn] = React.useState(['Open now']);
    const [d, setD] = React.useState(['example.com', 'wren.studio']);
    return (
      <Aura.Stack gap={4}>
        <Aura.Stack direction="row" gap={2} align="center">{(['neutral', 'accent', 'success', 'warning', 'danger'] as const).map((t) => <Aura.Badge key={t} tone={t}>{t}</Aura.Badge>)}</Aura.Stack>
        <div role="group" aria-label="Filters"><Aura.Stack direction="row" gap={2}>{['Open now', 'Weekend'].map((x) => <Aura.Tag key={x} selected={on.includes(x)} onClick={() => setOn(on.includes(x) ? on.filter((y) => y !== x) : [...on, x])}>{x}</Aura.Tag>)}</Aura.Stack></div>
        <Aura.Stack direction="row" gap={2}>{d.map((x) => <Aura.Tag key={x} onRemove={() => setD(d.filter((y) => y !== x))}>{x}</Aura.Tag>)}</Aura.Stack>
        <p data-testid="domains">{d.join(',')}</p>
      </Aura.Stack>
    );
  },
};
export const ProgressSkeletonEmpty: StoryObj = {
  name: 'Progress, Skeleton, EmptyState',
  render: () => (
    <Aura.Stack gap={6}>
      <Aura.Progress label="Storage" value={7.4} max={10} valueLabel="7.4 of 10 GB" showValue />
      <Aura.Progress aria-label="Importing" />
      <Aura.Skeleton lines={3} />
      <Aura.EmptyState bordered icon="folder" title="No projects yet" description="Projects group orders, files and people." action={<Aura.Button icon="plus">New Project</Aura.Button>} />
    </Aura.Stack>
  ),
};
export const PaginationStory: StoryObj = {
  name: 'Pagination',
  render: () => { const [p, setP] = React.useState(5); return <><Aura.Pagination pageCount={12} page={p} onChange={setP} /><p data-testid="page">Page {p}</p></>; },
};
export const AccordionStory: StoryObj = {
  name: 'Accordion',
  render: () => <div style={{ maxWidth: 560 }}><Aura.Accordion type="multiple" defaultValue={['a']} items={[
    { id: 'a', title: 'Do I need a card?', content: 'No. 14 days, every feature.' },
    { id: 'b', title: 'Where is my data?', content: 'Singapore, encrypted.' },
    { id: 'c', title: 'Buddhist calendar?', content: 'Yes, พ.ศ. everywhere.' }]} /></div>,
};
export const PopoverStory: StoryObj = {
  name: 'Popover',
  render: () => (
    <Aura.Popover title="Filters" trigger={<Aura.Button variant="secondary" icon="filter">Filters</Aura.Button>}>
      {({ close }) => <Aura.Stack gap={3}><Aura.Checkbox id="p1" defaultChecked>Open now</Aura.Checkbox><Aura.Checkbox id="p2">Weekend</Aura.Checkbox><Aura.Button onClick={close}>Apply</Aura.Button></Aura.Stack>}
    </Aura.Popover>
  ),
};
export const ThemedStory: StoryObj = {
  name: 'Theme: sky, brand buttons',
  render: () => (
    <div className="tenant">
      <Aura.ThemeStyle brand="#0ea5e9" primary="brand" selector=".tenant" />
      <Aura.Stack gap={4}>
        <Aura.Stack direction="row" gap={3}><Aura.Button icon="plus">New Project</Aura.Button><Aura.Button variant="secondary">Invite</Aura.Button></Aura.Stack>
        <Aura.Alert tone="info" title="Heads up">Info alerts follow the brand.</Aura.Alert>
        <Aura.Progress label="Setup" value={60} showValue />
        <Aura.Pagination pageCount={5} defaultPage={2} />
      </Aura.Stack>
    </div>
  ),
};
export const Settings: StoryObj = { name: 'Pilot: settings page', parameters: { layout: 'fullscreen' }, decorators: [(S) => <div style={{ margin: -24 }}><S /></div>], render: () => <SettingsPage /> };
export const Landing: StoryObj = { name: 'Pilot: launch page', parameters: { layout: 'fullscreen' }, decorators: [(S) => <div style={{ margin: -24 }}><S /></div>], render: () => <LandingPage /> };
