import React from 'react';
import { renderWithProviders } from '@test/utils/test-utils';

import { Item } from './item';

const setup = (disabled = false) => {
  const onClickSpy = jest.fn();
  const context = renderWithProviders(
    <Item
      item={{
        dataTestid: 'collapsable-list-item',
        text: 'Item',
        disabled: disabled,
        navigateTo: '/item',
        hidden: false,
      }}
      onClick={onClickSpy}
    />,
  );

  return { context, onClickSpy };
};

describe('CollapsableList-Item component', () => {
  it('should display the item', () => {
    const utils = setup();

    expect(utils.context.getByTestId('collapsable-list-item')).toBeInTheDocument();
  });

  it('should exec on click method', () => {
    const utils = setup();

    const item = utils.context.getByTestId('collapsable-list-item');

    expect(item).toBeInTheDocument();

    item.click();

    expect(utils.onClickSpy).toHaveBeenCalled();
  });

  it('should not exec on click method', () => {
    const utils = setup(true);

    const item = utils.context.getByTestId('collapsable-list-item');

    expect(item).toBeInTheDocument();
    expect(item).toHaveClass('Mui-disabled');

    item.click();

    expect(utils.onClickSpy).not.toHaveBeenCalled();
  });
});
