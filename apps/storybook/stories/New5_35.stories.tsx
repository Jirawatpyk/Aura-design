import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import { th } from '@aura/react/locales/th';

const meta: Meta = { title: 'AURA/New in 5.35 DxT Monitor 11-12' };
export default meta;

/* Request 11: on a touch screen every crumb link gets a 44px hit area (Button size="sm"'s), its text unmoved.
 * Request 12: StatusTile status="unknown" for a site before its first round. */
export const CrumbsAndNoData: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, padding: 24, maxWidth: 720 }}>
      <div data-testid="crumbs">
        <Aura.Breadcrumb
          items={[
            { label: 'Sites', href: '#sites' },
            { label: 'A', href: '#a' },
            { label: 'Edit monitors', onClick: () => {} },
            { label: 'Response time' },
          ]}
        />
      </div>
      {/* Wrapped on a phone, right above a PageHeader title (DxT's detail pages). */}
      <div data-testid="wrapped" style={{ width: 300 }}>
        <Aura.PageHeader
          breadcrumb={
            <Aura.Breadcrumb
              items={['Home', 'Monitors', 'Production', 'Bangkok', 'Region', 'A', 'B', 'Sites'].map((l, i, a) =>
                i < a.length - 1 ? { label: l, href: '#' + l } : { label: l },
              )}
            />
          }
          title="Site detail"
          headingLevel={2}
        />
      </div>
      <div data-testid="collapsed" style={{ width: 300 }}>
        <Aura.Breadcrumb
          collapseBelow="sm"
          items={[
            { label: 'A', href: '#a1' },
            { label: 'Middle one', href: '#m1' },
            { label: 'Middle two', href: '#m2' },
            { label: 'B', href: '#b1' },
            { label: 'Here' },
          ]}
        />
      </div>
      <Aura.TileGrid data-testid="grid" aria-label="Sites">
        <Aura.StatusTile
          data-testid="unknown"
          status="unknown"
          title="new-site.example.co.th"
          meta="Added 2 min ago"
          href="#u"
        />
        <Aura.StatusTile
          data-testid="ok"
          status="ok"
          title="api.example.co.th"
          value="99.98%"
          meta="240 ms"
          href="#ok"
        />
        <Aura.StatusTile data-testid="bogus" status={'paused' as never} title="Unrecognised status" href="#b" />
      </Aura.TileGrid>
      <Aura.AuraProvider locale="th" strings={th}>
        <div lang="th" data-testid="th" style={{ maxWidth: 260 }}>
          <Aura.StatusTile status="unknown" title="เว็บไซต์ใหม่" meta="เพิ่มเมื่อ 2 นาทีที่แล้ว" href="#th" />
        </div>
      </Aura.AuraProvider>
    </div>
  ),
};
