import { render } from '@testing-library/react';

import { PopoverHOC } from './popover.component';

const anchor = document.createElement('button');

anchor.getBoundingClientRect = () => ({
  width: 100,
  height: 20,
  top: 50,
  right: 150,
  bottom: 70,
  left: 50,
  x: 50,
  y: 50,
  toJSON: () => {},
});

describe('PopoverHOC', () => {
  it('should render indicator when open with indicator flag', () => {
    const { getByTestId } = render(
      <PopoverHOC indicator open anchorEl={anchor} anchorOrigin={{ horizontal: 'left', vertical: 'top' }} id="pop-id">
        <div data-testid="inner">Content</div>
      </PopoverHOC>,
    );

    expect(getByTestId('container')).toBeInTheDocument();
    expect(getByTestId('popover-indicator')).toBeInTheDocument();
  });

  it('should render without indicator when indicator flag false', () => {
    const { getByTestId } = render(
      <PopoverHOC open anchorEl={anchor} anchorOrigin={{ horizontal: 'left', vertical: 'top' }} id="pop-id">
        <div data-testid="inner">Content</div>
      </PopoverHOC>,
    );

    expect(getByTestId('container')).toBeInTheDocument();
    expect(document.querySelector('[data-testid="popover-indicator"]')).toBeNull();
  });
});
