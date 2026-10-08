import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';
import { th } from '@aura/react/locales/th';

const meta: Meta = { title: 'AURA/New in 5.34 status tiles' };
export default meta;

const LATENCY = [180, 210, 190, null, null, 240, 260, 230, 420, 380, 220, 200, 190, null, 210, 205];
const FAILED = LATENCY.map((v) => v == null);
/* A router link written without forwardRef, as many apps do. */
const PlainLink = (p: React.AnchorHTMLAttributes<HTMLAnchorElement>) => <a {...p} data-plain-link="" />;

/* DxT Monitor Overview (S06): one tile per site — status icon and tint, a two-line name, the value top right, a meta
 * line and markers — in a TileGrid (three columns on a desktop, two on a phone). */
export const Overview: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, padding: 24, maxWidth: 960 }}>
      <Aura.TileGrid data-testid="grid" aria-label="Sites">
        <Aura.StatusTile
          data-testid="down"
          status="down"
          title="api.example.co.th"
          value="12m"
          meta="since 09:41"
          markers={[{ icon: 'lock', label: 'SSL expires in 5 days', tone: 'warning' }]}
          href="#down"
        />
        <Aura.StatusTile
          data-testid="problem"
          status="problem"
          title="Checkout"
          value="1.8 s"
          meta="slow · 3 of 4 regions"
          href="#problem"
        />
        <Aura.StatusTile
          data-testid="maintenance"
          status="maintenance"
          title="Billing"
          value="until 14:00"
          valueTone="neutral"
          meta="Planned"
          href="#maintenance"
        />
        <Aura.StatusTile
          data-testid="ok"
          status="ok"
          title="Customer portal — production (Bangkok region, primary)"
          value="99.98%"
          meta="240 ms"
          markers={[
            { icon: 'bell', label: 'Alerts muted' },
            { icon: 'lock', label: 'SSL valid' },
          ]}
          href="#ok"
        />
        <Aura.StatusTile
          data-testid="ok-similar"
          status="ok"
          title="Customer portal — production (Bangkok region, secondary)"
          value="99.91%"
          meta="260 ms"
          href="#ok2"
        />
        <Aura.StatusTile data-testid="plain" status="ok" title="Status page" />
      </Aura.TileGrid>

      <Aura.AuraProvider locale="th" strings={th}>
        <Aura.TileGrid data-testid="grid-th" columns={2} lang="th">
          <Aura.StatusTile
            status="down"
            title="ระบบลงทะเบียนสมาชิกหอการค้า (สำนักงานใหญ่และสาขาภูมิภาค)"
            value="3 ชม."
            meta="ตั้งแต่ 08:12"
            href="#th1"
          />
          <Aura.StatusTile status="ok" title="หน้าเว็บหลัก" value="100%" meta="180 ms" href="#th2" />
        </Aura.TileGrid>
      </Aura.AuraProvider>

      {/* Outside a TileGrid: in a flex row, beside other content. Fragments in a TileGrid are items too. */}
      <div data-testid="row" style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
        <Aura.StatusTile status="problem" title="Queue" value="41" meta="backlog" href="#row" />
        <span>Other content</span>
      </div>
      <div data-testid="plain-link" style={{ width: 180 }}>
        <Aura.StatusTile
          status="down"
          title="A long site name on a router link that does not forward refs"
          value="2m"
          href="#plain-link"
          linkComponent={PlainLink}
        />
      </div>
      <div data-testid="with-button" style={{ width: 180 }}>
        <Aura.StatusTile
          status="problem"
          title="A long site name with a retry button in its meta line"
          meta={<button type="button">Retry</button>}
        />
      </div>
      <Aura.TileGrid data-testid="grid-frag" columns={3}>
        <>
          <Aura.StatusTile status="ok" title="One" />
          <Aura.StatusTile status="ok" title="Two" />
        </>
        <Aura.StatusTile status="ok" title="Three" />
      </Aura.TileGrid>

      <div dir="rtl" data-testid="rtl" style={{ maxWidth: 320 }}>
        <Aura.StatusTile
          status="problem"
          title="Mirror"
          value="4m"
          meta="slow"
          markers={[{ icon: 'bell', label: 'Muted' }]}
        />
      </div>

      <div data-testid="in-meta" style={{ maxWidth: 320 }}>
        <Aura.StatusTile
          status="ok"
          title="Search API"
          value="210 ms"
          meta={
            <Aura.Sparkline data={LATENCY} failed={FAILED} failures="ticks" label="Response time, last 16 checks" />
          }
          href="#spark"
        />
      </div>
    </div>
  ),
};

/* Sparkline: null breaks the line; failures off (default), as a band or as ticks; tones; sm 80×24 and md 120×32. */
export const Sparklines: StoryObj = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'max-content max-content',
        gap: '12px 24px',
        padding: 24,
        alignItems: 'center',
      }}
    >
      <span>Gaps</span>
      <Aura.Sparkline data-testid="gaps" data={LATENCY} failed={FAILED} label="Response time with gaps" />
      <span>Band</span>
      <Aura.Sparkline data-testid="band" data={LATENCY} failed={FAILED} failures="band" tone="accent" label="Band" />
      <span>Ticks</span>
      <Aura.Sparkline data-testid="ticks" data={LATENCY} failed={FAILED} failures="ticks" tone="danger" label="Ticks" />
      <span>md</span>
      <Aura.Sparkline data-testid="md" size="md" data={LATENCY} tone="positive" label="Medium" />
      <span>Lone point</span>
      <Aura.Sparkline data-testid="lone" data={[null, 5, null, 3, 4]} label="Lone point" />
      <span>Flat</span>
      <Aura.Sparkline data-testid="flat" data={[7, 7, 7, 7]} tone="warning" label="Flat" />
      <span>Empty</span>
      <Aura.Sparkline data-testid="empty" data={[]} label="No data" />
      <span>Decorative</span>
      <Aura.Sparkline data-testid="decor" data={[1, 3, 2, 5]} />
      <span>Shared scale</span>
      <span style={{ display: 'flex', gap: 8 }}>
        <Aura.Sparkline data-testid="scale-a" data={[100, 100]} min={0} max={400} label="A" />
        <Aura.Sparkline data-testid="scale-b" data={[400, 400]} min={0} max={400} label="B" />
        <Aura.Sparkline data-testid="scale-swapped" data={[400, 400]} min={400} max={0} label="Swapped" />
      </span>
    </div>
  ),
};
