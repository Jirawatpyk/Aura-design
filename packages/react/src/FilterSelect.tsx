import * as React from 'react';
import { Select, FILTER_KEY } from './Select.js';
import { omit } from './internal.js';
import type { FilterSelectProps, SelectProps } from './types.js';

/** A compact filter for FilterBar (5.12): a small button reading "Status All ▾" that opens Select's list. The name
 * is the accessible name, the chosen option its value; forms, refs and the keyboard work as in Select. */
export const FilterSelect = React.forwardRef<HTMLSelectElement, FilterSelectProps>(function FilterSelect(props, ref) {
  const onChange = props.onChange;
  const pass = Object.assign(omit(props, ['label', 'allLabel', 'onChange']), {
    [FILTER_KEY]: { name: props.label, allLabel: props.allLabel },
    onChange: onChange
      ? function (e: React.ChangeEvent<HTMLSelectElement>) {
          onChange(e.target.value);
        }
      : undefined,
  }) as unknown as SelectProps;
  return <Select {...pass} ref={ref} />;
});
