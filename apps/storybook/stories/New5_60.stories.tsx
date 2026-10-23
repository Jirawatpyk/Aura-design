import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconChevronDown, IconExternalLink, IconPlus } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.60 Chamber-OS 173' };
export default meta;

const truncate: React.CSSProperties = { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const URL_TEXT =
  'https://www.scandinavian-thai-precision-engineering-and-industrial-supplies.co.th/about/company-profile';

/* #173: linkClass layouts with a mouse as well as on touch — an icon after a truncating label, a <button> with an
 * icon, a link stretched by a flex column, a type class on the link, a <summary> — with no hand-written classes. */
export const Layouts: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 480 }}>
      {/* a profile's website: truncates inside its parent, 4px before the icon (block parent, then a flex row) */}
      <div data-testid="site" style={{ width: 300 }}>
        <a href="#site" className={Aura.linkClass({ touchHeight: true, underline: 'hover' })}>
          <span style={truncate}>{URL_TEXT}</span>
          <IconExternalLink size={16} aria-hidden />
        </a>
      </div>
      <div data-testid="site-row" style={{ width: 300, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>Web</span>
        <a href="#site" className={Aura.linkClass({ touchHeight: true, underline: 'hover' })}>
          <span style={truncate}>{URL_TEXT}</span>
          <IconExternalLink size={16} aria-hidden />
        </a>
      </div>
      {/* the event picker's action: a <button> with an icon */}
      <div>
        <button
          type="button"
          data-testid="create"
          className={Aura.linkClass({ touchHeight: true, underline: 'hover' })}
        >
          <IconPlus size={16} aria-hidden />
          Create new event
        </button>
      </div>
      {/* stretched by a flex column (a phone card): the label starts at the box's start */}
      <div data-testid="column" style={{ display: 'flex', flexDirection: 'column', width: 300 }}>
        <a href="#co" className={Aura.linkClass({ touchHeight: true, tone: 'inherit', underline: 'hover' })}>
          Nordic Trade Co.
        </a>
      </div>
      {/* a type class on the link itself */}
      <a href="#label" data-testid="typed" className={Aura.linkClass() + ' aura-text-label'}>
        Membership history
      </a>
      {/* a <summary> with its own chevron */}
      <details data-testid="details">
        <summary className={Aura.linkClass({ touchHeight: true, underline: 'hover' })}>
          Technical details
          <IconChevronDown size={16} aria-hidden />
        </summary>
        <p>Member ID 10482</p>
      </details>
      {/* an app's own display class wins; a leading icon sits on the text's line */}
      <button type="button" data-testid="hidden" className={Aura.linkClass() + ' story-hide'}>
        Hidden by the app
      </button>
      <style>
        {'.story-hide { display: none; } .story-space { margin-top: 24px; padding-inline: 8px; font-weight: 700; }'}
      </style>
      <div>
        <button type="button" data-testid="spaced" className={Aura.linkClass() + ' story-space'}>
          Spaced by the app
        </button>
      </div>
      <p data-testid="row">
        Before{' '}
        <button type="button" className={Aura.linkClass({ underline: 'hover' })}>
          <IconPlus size={16} aria-hidden />
          Create
        </button>{' '}
        after
      </p>
      <p data-testid="row-tall" style={{ fontSize: 16, lineHeight: 1.75 }}>
        Before{' '}
        <button type="button" className={Aura.linkClass({ underline: 'hover' })}>
          <IconPlus size={16} aria-hidden />
          Create
        </button>{' '}
        and{' '}
        <a href="#out" className={Aura.linkClass({ touchHeight: true })}>
          Site
          <IconExternalLink size={16} aria-hidden />
        </a>{' '}
        after
      </p>
      {/* an element reset as normalize.css or Tailwind v3 preflight ship it, unlayered */}
      <style>{'summary { display: list-item; }'}</style>
      <details data-testid="details-reset">
        <summary className={Aura.linkClass({ touchHeight: true })}>Reset summary</summary>
        <p>x</p>
      </details>
      {/* a plain one-word link on its own line, and one in a sentence: unchanged */}
      <div>
        <a href="#all" data-testid="plain" className={Aura.linkClass()}>
          All
        </a>
      </div>
      <p data-testid="sentence" style={{ width: 220 }}>
        Read the{' '}
        <a href="#terms" className={Aura.linkClass()}>
          membership payment terms and conditions
        </a>{' '}
        first.
      </p>
    </div>
  ),
};
