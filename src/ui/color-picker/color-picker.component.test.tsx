import { fireEvent, render } from '@testing-library/react';

import { ColorPicker } from './color-picker.component';

const baseProps = {
  color: '#ff0000',
  onChange: jest.fn(),
  onChangeComplete: jest.fn(),
  onClose: jest.fn(),
};

describe('ColorPicker', () => {
  it('should not render when not visible', () => {
    const { container } = render(<ColorPicker {...baseProps} visible={false} />);

    expect(container.firstChild).toBeNull();
  });

  it('should render and handle close', () => {
    render(<ColorPicker {...baseProps} visible />);
    // Cover div is first child with no role; simulate click via querySelector
    const cover = document.querySelector('[class*=colorPickerCover]') as HTMLElement;

    fireEvent.click(cover);
    expect(baseProps.onClose).toHaveBeenCalled();
  });
});
