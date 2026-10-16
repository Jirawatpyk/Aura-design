import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.47 Chamber-OS 152' };
export default meta;

const NAME = {
  en: 'Siam Nordic Trading Co., Ltd.',
  th: 'บริษัท สยามนอร์ดิก เทรดดิ้ง จำกัด',
  sv: 'Siam Nordic Handelsbolag AB',
};

/* #152: size="compact" — the staff boards' 26px title (32px from 640px) on a 1.2 line; hero now steps to 36px from
 * 1024px like hero-lg, and the room above a hero is --aura-page-header-hero-space (default 16px). */
export const TitleSizes: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 40, padding: 16 }}>
      {(['en', 'th', 'sv'] as const).map((l) => (
        <div key={l} data-testid={'compact-' + l} lang={l}>
          <Aura.PageHeader
            size="compact"
            title={NAME[l]}
            subtitle="Corporate member since 2014"
            actions={<Aura.Button>Edit</Aura.Button>}
          />
        </div>
      ))}
      <div data-testid="hero">
        <Aura.PageHeader size="hero" title="Welcome back, Anna" />
      </div>
      <div data-testid="hero-th" lang="th">
        <Aura.PageHeader size="hero" title="ยินดีต้อนรับกลับ" />
      </div>
      <div data-testid="hero-lg">
        <Aura.PageHeader size="hero-lg" title="Benefits" />
      </div>
      <div data-testid="hero-space" style={{ ['--aura-page-header-hero-space' as string]: '24px' }}>
        <Aura.PageHeader size="hero" title="Edit your profile" />
      </div>
      <div data-testid="default">
        <Aura.PageHeader title="Default" />
      </div>
    </div>
  ),
};
