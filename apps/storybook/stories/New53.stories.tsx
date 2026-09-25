import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.3' };
export default meta;

/* Select opens AURA's own list (like Combobox), in light and dark alike. */
export const SelectList: StoryObj = {
  render: () => {
    const [owner, setOwner] = React.useState('Jirawat');
    return (
      <Aura.Stack gap={4} style={{ maxWidth: 360 }}>
        <Aura.Select
          label="Owner"
          icon="user"
          value={owner}
          onChange={(e) => setOwner(e.target.value)}
          options={['Jirawat', 'Design', 'Dev', 'QA', { value: 'ops', label: 'Ops (on leave)', disabled: true }]}
        />
        <p className="aura-text-body" data-testid="owner">
          Owner: {owner}
        </p>
        <Aura.Select label="Region" placeholder="Choose a region">
          <optgroup label="Asia">
            <option value="th">Thailand</option>
            <option value="vn">Vietnam</option>
          </optgroup>
          <optgroup label="Europe">
            <option value="se">Sweden</option>
          </optgroup>
        </Aura.Select>
        <Aura.Select label="Locked" options={['One']} disabled />
      </Aura.Stack>
    );
  },
};

/* react-hook-form register(), reset() and setFocus(); a native form post; required. */
export const SelectInForms: StoryObj = {
  render: () => {
    const { register, handleSubmit, reset, setFocus, setValue, formState } = useForm<{ tier: string }>({
      defaultValues: { tier: 'SME' },
    });
    const [sent, setSent] = React.useState('');
    const [posted, setPosted] = React.useState('');
    return (
      <Aura.Stack gap={6} style={{ maxWidth: 360 }}>
        <form onSubmit={handleSubmit((v) => setSent('tier=' + v.tier))}>
          <Aura.Stack gap={3}>
            <Aura.Select
              label="Tier"
              {...register('tier', { validate: (v) => v !== 'Corporate' || 'Corporate needs approval' })}
              options={['SME', 'Corporate', 'Enterprise']}
              error={formState.errors.tier?.message}
            />
            <Aura.Stack direction="row" gap={2}>
              <Aura.Button type="submit">Save</Aura.Button>
              <Aura.Button variant="secondary" onClick={() => reset({ tier: 'Enterprise' })}>
                Reset
              </Aura.Button>
              <Aura.Button variant="secondary" onClick={() => setValue('tier', 'Corporate')}>
                Set
              </Aura.Button>
              <Aura.Button variant="secondary" onClick={() => setFocus('tier')}>
                Focus
              </Aura.Button>
            </Aura.Stack>
            <p className="aura-text-body" data-testid="sent">
              {sent}
            </p>
          </Aura.Stack>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPosted('size=' + new FormData(e.currentTarget).get('size'));
          }}
        >
          <Aura.Stack gap={3}>
            <Aura.Select label="Size" name="size" placeholder="Choose a size" required options={['S', 'M', 'L']} />
            <Aura.Button type="submit">Post</Aura.Button>
            <p className="aura-text-body" data-testid="posted">
              {posted}
            </p>
          </Aura.Stack>
        </form>
      </Aura.Stack>
    );
  },
};

/* Inside a dialog and a popover: picking keeps the overlay open; Escape closes the list first. */
export const SelectInOverlays: StoryObj = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    const [role, setRole] = React.useState('Viewer');
    return (
      <Aura.Stack direction="row" gap={3}>
        <Aura.Button onClick={() => setOpen(true)}>Edit member</Aura.Button>
        <Aura.Dialog open={open} onClose={() => setOpen(false)} title="Edit member">
          <Aura.Select
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            options={['Viewer', 'Editor', 'Admin']}
          />
        </Aura.Dialog>
        <Aura.Popover title="Filter" trigger={<Aura.Button variant="secondary">Filter</Aura.Button>}>
          <Aura.Select label="Status" options={['Any', 'Open', 'Closed']} />
        </Aura.Popover>
        <p className="aura-text-body" data-testid="role">
          Role: {role}
        </p>
      </Aura.Stack>
    );
  },
};

/* What callers pass lands where it did its job before: style, data-*, focus and key handlers on the control people
 * use; aria-labelledby names it; id = name still reads back through form.elements; options that load late. */
export const SelectEdges: StoryObj = {
  render: () => {
    const [log, setLog] = React.useState<string[]>([]);
    const add = (s: string) => setLog((l) => [...l, s]);
    const [late, setLate] = React.useState(['Alpha']);
    const [read, setRead] = React.useState('');
    return (
      <Aura.Stack gap={4} style={{ maxWidth: 360 }}>
        <Aura.Select label="Auto" autoFocus options={['One', 'Two']} />
        <Aura.Select
          label="Props"
          data-testid="props-sel"
          title="Pick one"
          style={{ letterSpacing: '1px' }}
          onFocus={() => add('focus')}
          onBlur={() => add('blur')}
          onKeyDown={(e) => add('key:' + e.key)}
          options={['One', 'Two']}
        />
        <p className="aura-text-body" data-testid="log">
          {log.join(',')}
        </p>
        <span id="ext-name">External name</span>
        <Aura.Select aria-labelledby="ext-name" options={['One', 'Two']} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const el = e.currentTarget.elements.namedItem('country') as HTMLSelectElement;
            setRead(el.value);
          }}
        >
          <Aura.Stack gap={2}>
            <Aura.Select id="country" name="country" label="Country" options={['TH', 'VN']} defaultValue="VN" />
            <Aura.Button type="submit">Read</Aura.Button>
            <p className="aura-text-body" data-testid="read">
              {read}
            </p>
          </Aura.Stack>
        </form>
        <Aura.Select label="Empty" placeholder="Nothing yet" />
        <Aura.Select label="Late" value="Alpha" onChange={() => {}} options={late} />
        <Aura.Button variant="secondary" onClick={() => setTimeout(() => setLate(['Zulu', 'Alpha', 'Bravo']), 400)}>
          Grow later
        </Aura.Button>
        <Aura.Select label="City" options={['New York', 'New Delhi', 'Newcastle']} />
      </Aura.Stack>
    );
  },
};
