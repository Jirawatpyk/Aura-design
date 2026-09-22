import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta<typeof Aura.Button> = {
  title: 'AURA/Actions/Button',
  component: (p: any) => <Aura.Button {...p} />,
  args: { children: 'Enterprise', variant: 'primary' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'creative'] },
    icon: { control: 'text' }, iconRight: { control: 'text' },
    loading: { control: 'boolean' }, disabled: { control: 'boolean' },
  },
};
export default meta;
type S = StoryObj<typeof meta>;

export const Primary: S = {};
export const Secondary: S = { args: { variant: 'secondary', children: 'Secondary' } };
export const Creative: S = { args: { variant: 'creative', children: 'Start a Project', iconRight: 'arrow-right' } };
export const Loading: S = { args: { loading: true, children: 'Saving' } };
export const AllStates: S = {
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Aura.Button>Enterprise</Aura.Button>
        <Aura.Button variant="secondary">Secondary</Aura.Button>
        <Aura.Button variant="creative">Creative</Aura.Button>
        <Aura.Button disabled>Disabled</Aura.Button>
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Aura.Button icon="plus">New Token</Aura.Button>
        <Aura.Button variant="secondary" iconRight="arrow-right">Continue</Aura.Button>
        <Aura.Button loading>Saving</Aura.Button>
        <Aura.IconButton icon="ellipsis" label="More" />
      </div>
    </div>
  ),
};
/** `href` turns the Button into a link that looks the same — for navigation. Actions stay buttons. */
export const AsLink: S = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Aura.Button href="#orders" iconRight="arrow-right">View Orders</Aura.Button>
      <Aura.Button href="https://github.com/Jirawatpyk/Aura-design" target="_blank" rel="noreferrer" variant="secondary" iconRight="external-link">
        Source on GitHub
      </Aura.Button>
      <Aura.Button href="#launch" variant="creative">Start a Project</Aura.Button>
      <Aura.Button href="#billing" disabled variant="secondary">Billing (admins only)</Aura.Button>
    </div>
  ),
};
