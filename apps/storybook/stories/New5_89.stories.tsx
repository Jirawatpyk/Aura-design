import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.89 Chamber-OS 209' };
export default meta;

/* Addendum 109: third-party overlays and an open modal. A library's node appended to <body> after the modal opened
 * (a 3-D Secure challenge) stays live; one already in the page stays live when it is a known challenge frame
 * (Stripe, reCAPTCHA, hCaptcha, Turnstile) or matches keepOutside / AuraProvider's modalKeepOutside. */
function addToBody(id: string, inner: string, tag = 'div') {
  const el = document.createElement(tag);
  el.id = id;
  el.setAttribute('data-testid', id);
  el.innerHTML = inner;
  // As a real challenge overlay: fixed, above everything (Stripe uses the maximum z-index).
  const slot = { 'tp-pre': 0, 'tp-provider': 1, 'tp-stripe': 2, 'tp-late': 3, 'tp-ra': 4 }[id] || 0;
  el.style.cssText = 'position: fixed; z-index: 2147483647; left: 8px; bottom: ' + (8 + slot * 60) + 'px;';
  document.body.appendChild(el);
  return el;
}

export const ThirdPartyOverlays: StoryObj = {
  render: function Render() {
    const [open, setOpen] = React.useState<'plain' | 'keep' | null>(null);
    React.useEffect(() => {
      const made = [
        addToBody('tp-pre', '<button type="button">Pre-existing widget</button>'),
        addToBody('tp-provider', '<button type="button">Provider-kept widget</button>'),
        addToBody(
          'tp-stripe',
          '<iframe name="__privateStripeFrame5551" title="Stripe challenge" src="about:blank"></iframe>',
        ),
      ];
      // 5.90 (#210): a React Aria top layer already in the page (Stripe's 3-D Secure layer carries the attribute).
      const ra = addToBody('tp-ra', '<button type="button">Top-layer widget</button>');
      ra.setAttribute('data-react-aria-top-layer', '');
      made.push(ra);
      return () => made.forEach((m) => m.remove());
    }, []);
    React.useEffect(() => {
      if (!open) return;
      // A library opening its challenge after the modal is open (Stripe's confirmPayment 3-D Secure).
      const t = setTimeout(() => addToBody('tp-late', '<button type="button">Complete authentication</button>'), 500);
      return () => {
        clearTimeout(t);
        const l = document.getElementById('tp-late');
        if (l) l.remove();
      };
    }, [open]);
    return (
      <Aura.AuraProvider modalKeepOutside="#tp-provider">
        <div data-testid="page">
          <Aura.Button data-testid="open-plain" onClick={() => setOpen('plain')}>
            Pay
          </Aura.Button>
          <Aura.Button data-testid="open-keep" variant="secondary" onClick={() => setOpen('keep')}>
            Pay (keepOutside)
          </Aura.Button>
        </div>
        <Aura.Drawer
          open={open !== null}
          onClose={() => setOpen(null)}
          title="Pay invoice"
          keepOutside={open === 'keep' ? '#tp-pre' : undefined}
        >
          <Aura.Button data-testid="close" onClick={() => setOpen(null)}>
            Done
          </Aura.Button>
        </Aura.Drawer>
      </Aura.AuraProvider>
    );
  },
};
