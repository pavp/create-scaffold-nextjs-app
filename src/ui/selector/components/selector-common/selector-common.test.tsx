import React from 'react';
import { faker } from '@faker-js/faker';
import { fireEvent, render, screen } from '@test/utils/test-utils';

import { ISelectOption } from '../../types';

import { ISelectorCommonProps, SelectorCommon } from './selector-common';

const MOCK_LIST_SELECTOR_COUNTRIES: ISelectOption[] = Array.from({ length: 3 }, () => ({
  key: faker.string.uuid(),
  value: faker.location.countryCode(),
  label: faker.location.country(),
}));

const DEFAULT_VALUE = [MOCK_LIST_SELECTOR_COUNTRIES[0].value];

const defaultProps: ISelectorCommonProps = {
  name: faker.lorem.word(),
  placeholder: faker.lorem.words(),
  list: MOCK_LIST_SELECTOR_COUNTRIES,
  selectedOptions: DEFAULT_VALUE,
  handleChange: jest.fn(),
  required: false,
  disabled: false,
  needsTranslation: false,
};

describe('SelectorCommon component', () => {
  afterEach(() => jest.clearAllMocks());

  it('should renders correct placeholder when no option is selected', () => {
    render(<SelectorCommon {...defaultProps} multiple selectedOptions={[]} />);

    expect(screen.getByText(defaultProps.placeholder!)).toBeInTheDocument();
  });

  it('should have the provided options when we open the select', () => {
    render(<SelectorCommon {...defaultProps} multiple />);

    // Expanding select
    const selector = screen.getByRole('combobox');

    fireEvent.mouseDown(selector);

    const menuItems = screen.getAllByRole('option');

    // Account for the 'Select All' option
    const expectedLength = defaultProps.list.length + 1;

    expect(menuItems).toHaveLength(expectedLength);

    // Skip the "Select All" item at index 0
    menuItems.slice(1).forEach((item, index) => {
      expect(item.getAttribute('data-value')).toBe(defaultProps.list[index].value);
    });
  });

  it('should calls handleChange when an option is selected', () => {
    render(<SelectorCommon {...defaultProps} multiple />);

    //Expanding select
    const selector = screen.getByRole('combobox');

    fireEvent.mouseDown(selector);

    //selecting options
    const menuItem = screen.getByTestId(`item-selector-${defaultProps.name}-${defaultProps.list[1].value}`);

    fireEvent.click(menuItem);

    expect(defaultProps.handleChange).toHaveBeenCalled();
  });

  it('should translate label labels when needsTranslation is true', () => {
    const spyOnUseTranslations = jest.spyOn(require('next-intl'), 'useTranslations');

    render(<SelectorCommon {...defaultProps} multiple needsTranslation />);

    expect(spyOnUseTranslations).toHaveBeenCalled();
  });
});
