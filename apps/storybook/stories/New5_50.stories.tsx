import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.50 Chamber-OS 156' };
export default meta;

/* Contrast of a #rrggbb colour with white text (WCAG relative luminance). */
function contrast(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0;
  const n = parseInt(m[1]!, 16);
  const lin = (c: number) => ((c /= 255) <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const l = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  return 1.05 / (l + 0.05);
}

/* #156: the brand form. The colour is invalid while white text on it is under 4.5:1; the page explains why in its
 * own readout and reason line (which Save points at), so the field takes `invalid`, not `error`: the danger edge and
 * aria-invalid, no AURA message, and its aria-describedby is still the hint plus the readout. */
export const InvalidWithoutMessage: StoryObj = {
  render: function Render() {
    const [colour, setColour] = React.useState('#F0F4F8');
    const ratio = contrast(colour);
    const ok = ratio >= 4.5;
    return (
      <Aura.AuraProvider>
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 24, padding: 16, maxWidth: 480 }}>
          <div data-testid="brand">
            <Aura.TextField
              id="primary"
              label="Primary colour"
              hint="A hex value, e.g. #1F4E8C."
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              invalid={!ok}
              aria-describedby="primary-readout"
            />
            <p id="primary-readout" className="aura-text-body" style={{ marginTop: 8 }}>
              Contrast with white text: {ratio.toFixed(2)}:1{ok ? '' : ' — below 4.5:1'}
            </p>
            <p id="save-reason" className="aura-text-caption">
              {ok ? 'Ready to save.' : 'Pick a darker colour so white text on it stays readable.'}
            </p>
            <Aura.Button disabled={!ok} aria-describedby="save-reason">
              Save
            </Aura.Button>
          </div>
          <div data-testid="textarea">
            <Aura.Textarea label="Footer text" hint="Up to 140 characters." invalid defaultValue="…" />
          </div>
          {/* A caller's own aria-invalid is enough (the stand-in Chamber-OS used until now). */}
          <div data-testid="own-aria">
            <Aura.TextField label="Secondary colour" hint="Optional." aria-invalid="true" defaultValue="#FFFFFF" />
          </div>
          <div data-testid="error">
            <Aura.TextField label="Accent colour" hint="Hidden by the error." error="Enter a hex value." invalid />
          </div>
          <div data-testid="valid">
            <Aura.TextField label="Text colour" hint="Optional." defaultValue="#111111" />
          </div>
          {/* A custom Field holding two boxes: only the invalid one turns red. */}
          <div data-testid="nested">
            <Aura.Field id="phone-number" label="Phone">
              <div style={{ display: 'flex', gap: 8 }}>
                <Aura.TextField label="Country code" defaultValue="+66" />
                <Aura.TextField label="Number" aria-invalid="true" defaultValue="12" />
              </div>
            </Aura.Field>
          </div>
          <div data-testid="disabled">
            <Aura.TextField label="Locked colour" disabled invalid defaultValue="#FFFFFF" />
          </div>
        </div>
      </Aura.AuraProvider>
    );
  },
};
