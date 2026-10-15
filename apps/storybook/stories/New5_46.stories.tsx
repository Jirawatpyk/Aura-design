import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.46 Chamber-OS 151' };
export default meta;

const T = {
  en: {
    title: 'Members',
    sub: 'Members, plans and renewals for SweCham',
    role: 'Admin',
    add: 'Add member',
    exp: 'Export',
  },
  th: {
    title: 'สมาชิก',
    sub: 'สมาชิก แผน และการต่ออายุของหอการค้าสวีเดน',
    role: 'ผู้ดูแล',
    add: 'เพิ่มสมาชิก',
    exp: 'ส่งออก',
  },
  sv: {
    title: 'Medlemmar',
    sub: 'Medlemmar, planer och förnyelser för SweCham',
    role: 'Administratör',
    add: 'Lägg till medlem',
    exp: 'Exportera',
  },
};

/* #151: a subtitle at body size under the title, a chip on the title's line, the actions at the end. */
export const SubtitleAndAddon: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 40, padding: 16 }}>
      {(['en', 'th', 'sv'] as const).map((l) => (
        <div key={l} data-testid={l} lang={l}>
          <Aura.PageHeader
            title={T[l].title}
            titleAddon={<Aura.Badge>{T[l].role}</Aura.Badge>}
            subtitle={T[l].sub}
            meta="312 members · updated 2 min ago"
            actionsFullWidthBelow="sm"
            actions={
              <>
                <Aura.Button variant="secondary">{T[l].exp}</Aura.Button>
                <Aura.Button>{T[l].add}</Aura.Button>
              </>
            }
          />
        </div>
      ))}
      {/* With titleHideBelow the addon leaves with the title (the top bar shows it); the subtitle stays. */}
      <div data-testid="hide">
        <Aura.PageHeader
          title="Invoice SC-2026-900001"
          titleHideBelow="lg"
          titleAddon={<Aura.StatusPill tone="ready">Paid</Aura.StatusPill>}
          subtitle="Issued 1 Oct 2026"
        />
      </div>
      {/* A long title beside wide actions at a tablet width: the text keeps its room, the actions drop under it. */}
      <div data-testid="squeeze">
        <Aura.PageHeader
          title="Nordic Timber Oy — corporate membership"
          subtitle="Member since 2014"
          actions={
            <>
              <Aura.Button variant="secondary">Send renewal reminder</Aura.Button>
              <Aura.Button variant="secondary">Change plan</Aura.Button>
              <Aura.Button>Edit member</Aura.Button>
            </>
          }
        />
      </div>
    </div>
  ),
};

/* The member detail board: status, member number and badges above the title; chips in meta too. */
export const MemberDetail: StoryObj = {
  render: () => (
    <div data-testid="member" style={{ padding: 16 }}>
      <Aura.PageHeader
        eyebrow={
          <>
            <Aura.StatusPill tone="ready">Active</Aura.StatusPill>
            <Aura.Tag>No. 004217</Aura.Tag>
            <Aura.Badge>Patron</Aura.Badge>
          </>
        }
        title="Nordic Timber Oy"
        subtitle="Corporate plan · 12 seats"
        meta={
          <span style={{ display: 'inline-flex', gap: 8, flexWrap: 'wrap' }}>
            <Aura.Tag>Forestry</Aura.Tag>
            <Aura.Tag>Bangkok</Aura.Tag>
          </span>
        }
        actions={<Aura.Button variant="secondary">Edit</Aura.Button>}
      />
    </div>
  ),
};

/* A portal page: the hero title, the actions lined up with its top. */
export const PortalHero: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 40, padding: 16 }}>
      <div data-testid="hero">
        <Aura.PageHeader
          size="hero"
          actionsAlign="start"
          title="Welcome back, Anna"
          subtitle="Your membership renews on 1 January 2027."
          actions={<Aura.Button>Renew now</Aura.Button>}
        />
      </div>
      <div data-testid="hero-lg">
        <Aura.PageHeader size="hero-lg" title="Benefits" subtitle="What your plan includes" />
      </div>
      <div
        data-testid="custom"
        style={{
          ['--aura-page-header-title-size' as string]: '26px',
          ['--aura-page-header-title-line-height' as string]: '32px',
        }}
      >
        <Aura.PageHeader title="Staff page" />
      </div>
      <div data-testid="plain">
        <Aura.PageHeader
          title="Default"
          actions={<Aura.Button>Action</Aura.Button>}
          subtitle="Two lines of text so the actions sit at the bottom by default."
        />
      </div>
    </div>
  ),
};

/* After a redirect (renewal done): the heading has focus, with no ring, and the page did not scroll. */
export const RenewalSuccess: StoryObj = {
  render: () => (
    <div data-testid="success" style={{ padding: 16 }}>
      <Aura.PageHeader
        focusTitleOnMount
        title="Renewal complete"
        subtitle="Thank you — a receipt is on its way to anna@example.com."
      />
      <p className="aura-text-body">
        <a href="#home">Back to the portal</a>
      </p>
    </div>
  ),
};
