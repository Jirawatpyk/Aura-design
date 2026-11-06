import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.86 Chamber-OS 199-202' };
export default meta;

/* #199: a titled Card labels its root by its title only where a name is allowed. A step card in a list of steps
 * (as="div") keeps its heading and id but no aria-labelledby; a section, or a div with a role, is labelled. */
export const CardNames: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <ol style={{ display: 'grid', gap: 12, margin: 0, padding: 0, listStyle: 'none' }}>
        {['Choose the plan', 'Set the renewal date'].map((s, i) => (
          <li key={s}>
            <Aura.Card as="div" data-testid={'step-' + (i + 1)} title={s} titleId={'step-title-' + (i + 1)}>
              Step {i + 1} of 2
            </Aura.Card>
          </li>
        ))}
      </ol>
      <Aura.Card data-testid="section" title="Renewal schedule" titleId="schedule-title">
        A section, labelled by its title.
      </Aura.Card>
      <Aura.Card as="div" role="group" data-testid="group" title="Reminders" titleId="reminders-title">
        A div with a role, labelled by its title.
      </Aura.Card>
      <Aura.Card as="article" data-testid="article" title="Notice" titleId="notice-title">
        An article.
      </Aura.Card>
    </div>
  ),
};

/* #201: icon={false} — a short placeholder with no icon circle. #202: tone="danger" defaults to triangle-alert. */
export const EmptyStateIcons: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
      <div data-testid="no-icon">
        <Aura.EmptyState size="sm" icon={false} title="No lapsed members" headingLevel={false} />
      </div>
      <div data-testid="danger">
        <Aura.EmptyState tone="danger" title="Couldn't load invoices" description="Try again in a moment." />
      </div>
      <div data-testid="default">
        <Aura.EmptyState title="No invoices yet" />
      </div>
      <span data-testid="ref-triangle" hidden>
        <Aura.Icon name="triangle-alert" size="lg" />
      </span>
      <div data-testid="danger-own">
        <Aura.EmptyState tone="danger" icon="ban" title="Access removed" />
      </div>
    </div>
  ),
};
