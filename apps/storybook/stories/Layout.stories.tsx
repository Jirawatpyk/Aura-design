import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/Layout' };
export default meta;

export const Cards: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 24 }}>
      <Aura.Card title="Token adoption" description="Last 30 days" actions={<Aura.IconButton icon="ellipsis" label="Card options" />}>
        <div style={{ fontSize: 36, fontWeight: 600 }}>92.3%</div>
      </Aura.Card>
      <Aura.Card title="Pilot teams" footer={<Aura.Button variant="secondary" iconRight="arrow-right">View All</Aura.Button>}>
        <div style={{ display: 'flex', gap: 8 }}><Aura.Avatar name="Dashboard Team" /><Aura.Avatar name="Marketing Team" /><Aura.Avatar name="Mobile Team" /></div>
      </Aura.Card>
      <Aura.Card variant="creative" title="Human Creative">Brand moments get the hard offset shadow.</Aura.Card>
    </div>
  ),
};
export const TabsStory: StoryObj = {
  name: 'Tabs',
  render: () => (
    <Aura.Tabs label="Token views" tabs={[
      { id: 'overview', label: 'Overview', content: 'Every token grouped by family.' },
      { id: 'changes', label: 'Changes', count: 12, content: '12 tokens changed since 4.0.' },
      { id: 'usage', label: 'Usage', icon: 'chart-column', content: 'Where each token is used.' },
    ]} />
  ),
};
export const AppShell: StoryObj = {
  render: () => (
    <div style={{ display: 'flex', height: 480, border: '1px solid var(--aura-border-default)', borderRadius: 20, overflow: 'hidden' }}>
      <Aura.SideNav defaultValue="tokens"
        sections={[
          { items: [{ id: 'home', label: 'Home', icon: 'house' }, { id: 'inbox', label: 'Inbox', icon: 'inbox', count: 4 }] },
          { title: 'Design System', items: [{ id: 'tokens', label: 'Tokens', icon: 'folder' }, { id: 'components', label: 'Components', icon: 'file-text', count: 22 }] },
        ]}
        footer={<div style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 13 }}><Aura.Avatar name="Jirawat P" size="sm" status="online" />Jirawat</div>} />
      <main style={{ flex: 1, padding: 24, background: 'var(--aura-bg-surface)' }}>
        <Aura.Breadcrumb items={[{ label: 'Design System', href: '#' }, { label: 'Tokens' }]} />
      </main>
    </div>
  ),
};
