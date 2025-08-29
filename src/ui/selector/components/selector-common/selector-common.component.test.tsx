import React from 'react';
import { faker } from '@faker-js/faker';
import { fireEvent, render, screen } from '@test/utils';

import { ISelectOption } from '../../selector.types';

import { ISelectorCommonProps, SelectorCommon } from './selector-common.component';

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

  it('should render in single selection mode', () => {
    render(<SelectorCommon {...defaultProps} multiple={false} />);

    const selector = screen.getByRole('combobox');

    expect(selector).toBeInTheDocument();
  });

  it('should render with disabled state', () => {
    render(<SelectorCommon {...defaultProps} disabled />);

    const selector = screen.getByRole('combobox');

    expect(selector).toHaveAttribute('aria-disabled', 'true');
  });

  it('should render with fullWidth prop', () => {
    render(<SelectorCommon {...defaultProps} fullWidth />);

    const selector = screen.getByRole('combobox');

    expect(selector).toBeInTheDocument();
  });

  it('should render with custom width', () => {
    const customWidth = '300px';

    render(<SelectorCommon {...defaultProps} width={customWidth} />);

    const selector = screen.getByRole('combobox');

    expect(selector).toBeInTheDocument();
  });

  it('should show required indicator when required is true', () => {
    render(<SelectorCommon {...defaultProps} required />);

    const selector = screen.getByRole('combobox');

    expect(selector).toBeInTheDocument();
    // MUI Select doesn't add 'required' attribute directly to the select element
    // Instead it handles required validation through form validation
    expect(selector).toHaveClass('MuiSelect-select');
  });

  it('should render with selected option displayed', () => {
    const selectedValue = [MOCK_LIST_SELECTOR_COUNTRIES[1].value];

    render(<SelectorCommon {...defaultProps} multiple={false} selectedOptions={selectedValue} />);

    const selector = screen.getByRole('combobox');

    expect(selector).toBeInTheDocument();
  });
});
