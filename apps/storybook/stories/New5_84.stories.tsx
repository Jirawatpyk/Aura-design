import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.84 Chamber-OS 197' };
export default meta;

/* #197: a forward-only keyset list (newest first) leaves Previous out with showPrevious={false} (and First with
 * showFirst={false}); the default still draws a disabled Previous. */
export const ForwardOnly: StoryObj = {
  render: function Render() {
    const [batch, setBatch] = React.useState(1);
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 640 }}>
        <div data-testid="forward">
          <Aura.Pagination
            mode="cursor"
            label="E-Blast queue pages"
            showFirst={false}
            showPrevious={false}
            onNext={() => setBatch(batch + 1)}
            hasNext={batch < 3}
            status={'Showing batch ' + batch}
          />
        </div>
        <div data-testid="first-only">
          <Aura.Pagination
            mode="cursor"
            label="Renewal tasks pages"
            showPrevious={false}
            firstHref="#first"
            nextHref="#next"
          />
        </div>
        <div data-testid="default">
          <Aura.Pagination mode="cursor" label="Change requests pages" nextHref="#next" />
        </div>
      </div>
    );
  },
};
