import { fireEvent, render } from '@testing-library/react';

import { ToggleButton } from './toggle-button.component';

describe('ToggleButton', () => {
  it('should toggle uncontrolled value and call onChange', () => {
    const onChange = jest.fn();
    const { getByRole, rerender } = render(
      <ToggleButton value={false} onChange={onChange}>
        {(v) => (v ? 'ON' : 'OFF')}
      </ToggleButton>,
    );

    const button = getByRole('button');

    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(true);

    // simulate prop update to reflect new state
    rerender(
      <ToggleButton value={true} onChange={onChange}>
        {(v) => (v ? 'ON' : 'OFF')}
      </ToggleButton>,
    );
    expect(button).toHaveTextContent('ON');
  });
});
