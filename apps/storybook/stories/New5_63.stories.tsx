import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.63 Chamber-OS 178' };
export default meta;

/* #178: a chip that reaches PageHeader as a lazy node — as a Server Component's child through a client wrapper on
 * Next's dev server — still makes `meta` the chip row; `metaLayout` sets it outright. */
const pill = React.lazy(() =>
  Promise.resolve({ default: (<Aura.StatusPill tone="ready">Full benefits</Aura.StatusPill>) as any }),
) as unknown as React.ReactNode;

export const LazyChip: StoryObj = {
  render: () => (
    <React.Suspense fallback={null}>
      <div style={{ display: 'grid', gap: 32 }}>
        <div data-testid="lazy">
          <Aura.PageHeader
            title="Benefits"
            meta={[
              <Aura.Badge key="plan" variant="solid">
                Corporate Gold
              </Aura.Badge>,
              pill,
            ]}
          />
        </div>
        <div data-testid="row">
          <Aura.PageHeader
            title="Forced row"
            metaLayout="row"
            meta={
              <>
                Plan <Aura.Badge variant="solid">Corporate Gold</Aura.Badge>
              </>
            }
          />
        </div>
        <div data-testid="line">
          <Aura.PageHeader
            title="Forced line"
            metaLayout="line"
            meta={
              <>
                <Aura.Badge variant="solid">A</Aura.Badge>
                <Aura.Badge>B</Aura.Badge>
              </>
            }
          />
        </div>
      </div>
    </React.Suspense>
  ),
};
