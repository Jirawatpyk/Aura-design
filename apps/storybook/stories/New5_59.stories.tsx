import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Aura } from './aura';

const meta: Meta = { title: 'AURA/New in 5.59 Chamber-OS 172' };
export default meta;

/* #172: linkClass() — a link that reads as text. With touchHeight it is at least 44×44 below 640px or on a coarse
 * pointer (a row title, a short "#12"), the look unchanged; the plain links beside them are the same text for
 * comparison. A <button> with the class looks like the <a>. */
export const TextLinks: StoryObj = {
  render: () => (
    <Aura.AuraProvider density="compact">
      <div style={{ display: 'grid', gap: 16, maxWidth: 560 }}>
        <div data-testid="touch" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a
            href="#inv-2041"
            data-testid="long"
            className={Aura.linkClass({ touchHeight: true, tone: 'inherit', underline: 'hover' })}
          >
            INV-2026-2041
          </a>
          <a href="#12" data-testid="short" className={Aura.linkClass({ touchHeight: true })}>
            #12
          </a>
        </div>
        <div data-testid="plain" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a
            href="#inv-2041"
            data-testid="long-plain"
            className={Aura.linkClass({ tone: 'inherit', underline: 'hover' })}
          >
            INV-2026-2041
          </a>
          <a href="#12" data-testid="short-plain" className={Aura.linkClass()}>
            #12
          </a>
        </div>
        {/* #172 follow-up: the same class on a <button> (it opens a modal, it doesn't navigate) looks like the <a>. */}
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button type="button" data-testid="btn" className={Aura.linkClass({ touchHeight: true, tone: 'accent' })}>
            + Create new event
          </button>
          <a href="#new" data-testid="btn-a" className={Aura.linkClass({ touchHeight: true, tone: 'accent' })}>
            + Create new event
          </a>
        </div>
        {/* without touchHeight, under an uppercase label: still alike */}
        <div style={{ display: 'flex', gap: 16, textTransform: 'uppercase' }}>
          <button type="button" data-testid="btn-plain" className={Aura.linkClass()}>
            Edit
          </button>
          <a href="#edit" data-testid="btn-a-plain" className={Aura.linkClass()}>
            Edit
          </a>
        </div>
        {/* in a DataTable cell the link stays inline: the cell keeps its ellipsis and the row its height */}
        <div style={{ width: 150, height: 40 }}>
          <div className="aura-table__td" data-testid="cell" style={{ width: 150 }}>
            <a href="#inv" className={Aura.linkClass({ touchHeight: true, tone: 'inherit' })}>
              INV-2026-2041 Scandinavian Precision
            </a>
          </div>
        </div>
        {/* a stacked DataTable (cards): the title link keeps its 44px target */}
        <div data-testid="cards" style={{ width: 340 }}>
          <Aura.DataTable
            label="Oldest overdue"
            rowKey="id"
            stackBelow={640}
            rows={[
              { id: 1, doc: 'INV-7', due: '2 Oct' },
              { id: 2, doc: 'INV-2026-2041', due: '9 Oct' },
            ]}
            columns={[
              {
                key: 'doc',
                label: 'Invoice',
                render: (r: any) => (
                  <a href={'#' + r.id} className={Aura.linkClass({ touchHeight: true, tone: 'inherit' })}>
                    {r.doc}
                  </a>
                ),
              },
              { key: 'due', label: 'Due' },
            ]}
          />
        </div>
        <p>
          A link in a sentence stays inline:{' '}
          <a href="#terms" className={Aura.linkClass()}>
            payment terms
          </a>
          .
        </p>
      </div>
    </Aura.AuraProvider>
  ),
};
