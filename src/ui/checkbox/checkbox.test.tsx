import { faker } from '@faker-js/faker';
import { act, fireEvent, renderWithProviders } from '@test/utils/test-utils';

import { Checkbox } from './checkbox';

const CHECKBOX_ID = 'checkbox-id';

interface setupProps {
  label?: string;
  value?: string;
  checked?: boolean;
  indeterminate?: boolean;
  selectAll?: boolean;
}

const setup = ({ label = '', value, checked = false, indeterminate = false, selectAll = false }: setupProps) => {
  const spyOnChange = jest.fn();
  const context = renderWithProviders(
    <Checkbox
      checked={checked}
      indeterminate={indeterminate}
      label={label}
      selectAll={selectAll}
      testId={CHECKBOX_ID}
      value={value}
      onChange={spyOnChange}
    />,
  );

  return { context, spyOnChange };
};

describe('Checkbox component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render elements ny default', () => {
    const label = faker.lorem.words();
    const value = faker.lorem.words();
    const { context } = setup({ label, value });

    const controller = context.getByTestId('checkbox-controller');
    const checkbox = context.getByTestId(CHECKBOX_ID);

    expect(controller).toBeInTheDocument();
    expect(controller).toHaveTextContent(label);
    expect(controller).not.toHaveClass('selectAllCheckbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.querySelector('input')?.value).toBe(value);
    expect(checkbox.querySelector('input')).not.toBeChecked();
    expect(checkbox.querySelector('input')).not.toHaveAttribute('data-indeterminate', 'true');
  });

  it('should has selectAllCheckbox class if selectAll true', () => {
    const { context } = setup({ selectAll: true });

    expect(context.getByTestId('checkbox-controller')).toHaveClass('selectAllCheckbox');
  });

  it('should be checked if checked true', () => {
    const { context } = setup({ checked: true });

    const checkbox = context.getByTestId(CHECKBOX_ID).querySelector('input');

    expect(checkbox).toBeChecked();
  });

  it('should be indeterminate if indeterminate true', () => {
    const { context } = setup({ indeterminate: true });

    const checkbox = context.getByTestId(CHECKBOX_ID).querySelector('input');

    expect(checkbox).not.toBeChecked();
    expect(checkbox).toHaveAttribute('data-indeterminate', 'true');
  });

  it('should call onChange when clicking on the checkbox', () => {
    const { context, spyOnChange } = setup({});

    const checkbox = context.getByTestId(CHECKBOX_ID);

    act(() => {
      fireEvent.click(checkbox);
    });

    expect(spyOnChange).toHaveBeenCalled();
  });
});
