import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.81 DxT Monitor 24-25', parameters: { layout: 'fullscreen' } };
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

const CHECKS = [
  { time: '09:41:12', status: 'Down', confirm: true },
  { time: '09:40:12', status: 'Down', confirm: false },
  { time: '09:39:12', status: 'Up', confirm: false },
];

/* Request 25: Badge size="xs" — a 16px mark under a cell's main value that keeps a rowHeight="density" row at 48px
 * (a 12px time, 4px, the badge). Same tones and variants as the 20px default. */
export const BadgeXs: StoryObj = {
  parameters: { layout: 'padded' },
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 560 }}>
      <div data-testid="sizes" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
        <Aura.Badge data-testid="sm" variant="outline">
          Confirm
        </Aura.Badge>
        <Aura.Badge data-testid="xs" size="xs" variant="outline">
          Confirm
        </Aura.Badge>
        {(['neutral', 'accent', 'success', 'warning', 'danger'] as const).map((t) => (
          <Aura.Badge key={t} size="xs" tone={t}>
            {t}
          </Aura.Badge>
        ))}
        <Aura.Badge size="xs" tone="danger" variant="solid">
          3 overdue
        </Aura.Badge>
        <Aura.Badge data-testid="xs-th" lang="th" size="xs" variant="outline">
          ยืนยันซ้ำ
        </Aura.Badge>
      </div>
      <Aura.Table aria-label="Check log" rowHeight="density" data-testid="log">
        <Aura.THead>
          <Aura.Tr>
            <Aura.Th>Time</Aura.Th>
            <Aura.Th>Result</Aura.Th>
          </Aura.Tr>
        </Aura.THead>
        <Aura.TBody>
          {CHECKS.map((c) => (
            <Aura.Tr key={c.time}>
              <Aura.Td>
                <div style={{ display: 'grid', gap: 4, justifyItems: 'start' }}>
                  <span className="aura-mono" style={{ fontSize: 12, lineHeight: '12px' }}>
                    {c.time}
                  </span>
                  {c.confirm ? (
                    <Aura.Badge size="xs" variant="outline">
                      Confirm
                    </Aura.Badge>
                  ) : null}
                </div>
              </Aura.Td>
              <Aura.Td>
                <Aura.StatusPill>{c.status}</Aura.StatusPill>
              </Aura.Td>
            </Aura.Tr>
          ))}
        </Aura.TBody>
      </Aura.Table>
    </div>
  ),
};
