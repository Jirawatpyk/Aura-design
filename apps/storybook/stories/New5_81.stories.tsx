import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.81 DxT Monitor 24', parameters: { layout: 'fullscreen' } };
export default meta;

const TABS = [
  { id: 'overview', label: 'Overview', icon: 'layout-dashboard' as const, href: '#overview' },
  { id: 'oncall', label: 'On-call', icon: 'phone' as const, href: '#oncall' },
  { id: 'alerts', label: 'Alerts', icon: 'bell' as const, href: '#alerts' },
];

/* Request 24: a BottomNav with hideOnScroll under client-side navigation — a tab tap changes the page in place and
 * the bar stays mounted. The tap's focus on the tab no longer pins the bar: scrolling down hides it. Keyboard focus
 * in the bar still keeps it. */
export const HideAfterTap: StoryObj = {
  render: function Render() {
    const [tab, setTab] = React.useState('overview');
    /* A stand-in for a router's Link: no document load, the page re-renders. */
    const RouterLink = React.useMemo(
      () =>
        React.forwardRef<HTMLAnchorElement, React.AnchorHTMLAttributes<HTMLAnchorElement>>(function RouterLink(
          { href, onClick, ...rest },
          ref,
        ) {
          return (
            <a
              ref={ref}
              href={href}
              {...rest}
              onClick={(e) => {
                onClick?.(e);
                if (e.defaultPrevented) return;
                e.preventDefault();
                window.scrollTo(0, 0);
              }}
            />
          );
        }),
      [],
    );
    const label = TABS.find((t) => t.id === tab)!.label;
    return (
      <Aura.AuraProvider linkComponent={RouterLink}>
        <Aura.AppShell
          header={<strong>DxT Monitor</strong>}
          bottomNav={<Aura.BottomNav items={TABS} value={tab} onChange={setTab} hideOnScroll />}
        >
          <Aura.PageHeader title={label} />
          <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: 40 }, (_, i) => (
              <Aura.Card key={i} title={label + ' ' + (i + 1)}>
                Shift {i + 1}
              </Aura.Card>
            ))}
          </div>
        </Aura.AppShell>
      </Aura.AuraProvider>
    );
  },
};
