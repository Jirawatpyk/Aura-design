import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { IconFileText, IconMenu, IconPencil, IconPlus } from '@aura/react/icons';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.66 Chamber-OS 181-182' };
export default meta;

/* #181: the phone editor's "Lists and headings" menu — checkable items keep their icons, the state is a check mark at
 * the end. An item with no icon keeps the leading box; checkPlacement="start" keeps the old look. */
export const CheckableIcons: StoryObj = {
  render: function Render() {
    const [h2, setH2] = React.useState(true);
    const [bullets, setBullets] = React.useState(false);
    return (
      <Aura.DropdownMenu
        label="Lists and headings"
        trigger={<Aura.IconButton icon={<IconMenu />} label="Lists and headings" />}
        items={[
          { label: 'Heading', icon: <IconFileText />, checked: h2, keepOpen: true, onSelect: () => setH2(!h2) },
          {
            label: 'Bulleted list',
            icon: <IconMenu />,
            checked: bullets,
            keepOpen: true,
            hint: '⌘⇧8',
            onSelect: () => setBullets(!bullets),
          },
          { label: 'Plain', checked: true },
          { label: 'Old look', icon: <IconPencil />, checked: true, checkPlacement: 'start' },
          { label: 'Insert image', icon: <IconPlus /> },
        ]}
      />
    );
  },
};

const MEMBERS = [
  { value: 'nordic', label: 'Nordic Timber Oy' },
  { value: 'siam', label: 'Siam Steel Co.' },
];

/* #182: the staff composer's member picker — a page alert beside it, pointed at with aria-describedby, and invalid. */
export const ComboboxDescribed: StoryObj = {
  render: () => (
    <div style={{ display: 'grid', gap: 24, maxWidth: 360 }}>
      <div data-testid="described">
        <Aura.Combobox
          label="Member"
          hint="Search by company name"
          options={MEMBERS}
          invalid
          aria-describedby="member-alert"
        />
        <p id="member-alert" role="alert" className="aura-text-body">
          That member no longer exists. Pick another member.
        </p>
      </div>
      <div data-testid="error">
        <Aura.Combobox
          label="Member"
          hint="Search by company name"
          options={MEMBERS}
          error="Pick a member."
          invalid
          aria-describedby="other"
        />
      </div>
      <div data-testid="dup">
        <Aura.Combobox
          id="dupe"
          label="Member"
          hint="Search by company name"
          options={MEMBERS}
          aria-describedby="dupe-hint  member-alert member-alert"
        />
      </div>
      <div data-testid="plain">
        <Aura.Combobox label="Member" hint="Search by company name" options={MEMBERS} />
      </div>
    </div>
  ),
};
