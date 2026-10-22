import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconSearch, IconUser, IconUsers } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.56 Chamber-OS 168', parameters: { layout: 'fullscreen' } };
export default meta;

/* #168: a compact staff top bar. AppShell's own menu button ("Open navigation") is 44×44 below 640px or on a coarse
 * pointer, like the touchHeight search and account buttons beside it; with a mouse from 640px it stays 32px. */
export const MenuButton: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <Aura.AppShell
        header={
          <>
            <strong className="aura-text-label" style={{ flex: 1 }}>
              Chamber OS
            </strong>
            <Aura.IconButton data-testid="search" icon={<IconSearch />} label="Search" touchHeight />
            <Aura.IconButton data-testid="account" icon={<IconUser />} label="Account" touchHeight />
          </>
        }
        nav={
          <Aura.SideNav
            value="members"
            sections={[{ title: 'Work', items: [{ id: 'members', label: 'Members', icon: <IconUsers /> }] }]}
          />
        }
      >
        <p>Members</p>
      </Aura.AppShell>
    </Aura.AuraProvider>
  ),
};
