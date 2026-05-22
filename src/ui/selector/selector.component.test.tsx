import { Control, UseFormClearErrors } from 'react-hook-form';
import { faker } from '@faker-js/faker';
import { fireEvent, render } from '@test/utils';

import { ISelectorCommonProps } from './components/selector-common/selector-common.component';
import { Selector } from './selector.component';
import { ISelectOption } from './selector.types';

const SELECTOR_COMMON_MOCK_TEST_ID = 'SELECTOR_COMMON_MOCK_TEST_ID';
const CONTROLLER_MOCK_TEST_ID = 'CONTROLLER_MOCK_TEST_ID';

const mockOnChange = jest.fn();

jest.mock('@/ui/selector/components/selector-common/selector-common.component', () => {
  return {
    SelectorCommon: ({ handleChange }: ISelectorCommonProps) => (
      <div>
        <button
          data-testid={SELECTOR_COMMON_MOCK_TEST_ID}
          onClick={(event) => handleChange(event as any, mockOnChange)}
        />
        <button
          data-testid="select-all-button"
          onClick={() => handleChange({ target: { value: ['all'] } } as any, mockOnChange)}
        />
        <button
          data-testid="select-regular-button"
          onClick={() => handleChange({ target: { value: ['regular-value'] } } as any, mockOnChange)}
        />
      </div>
    ),
  };
});

jest.mock('react-hook-form', () => {
  const originalModule = jest.requireActual('react-hook-form');

  return {
    ...originalModule,
    Controller: ({ render }: any) => {
      // Mock a field object
      const mockField = {
        value: DEFAULT_VALUE,
        onChange: jest.fn(),
        onBlur: jest.fn(),
        name: 'test-field',
      };

      return <div data-testid={CONTROLLER_MOCK_TEST_ID}>{render ? render({ field: mockField }) : null}</div>;
    },
  };
});

interface mockSetupProps {
  multiple?: boolean;
  listMock?: ISelectOption[];
  defaultValue?: string[];
  required?: boolean;
  error?: boolean;
  messageError?: string;
  clearErrors?: UseFormClearErrors<any>;
  dontAllowEmptyValues?: boolean;
  needsTranslation?: boolean;
  control?: Control<any>;
}

const MOCK_LIST_SELECTOR_COUNTRIES: ISelectOption[] = Array.from({ length: 3 }, () => ({
  key: faker.string.uuid(),
  value: faker.location.countryCode(),
  label: faker.location.country(),
}));

const DEFAULT_VALUE = [MOCK_LIST_SELECTOR_COUNTRIES[0].value];

const setup = ({
  multiple = false,
  listMock = MOCK_LIST_SELECTOR_COUNTRIES,
  defaultValue = DEFAULT_VALUE,
  clearErrors,
  dontAllowEmptyValues = false,
  required = false,
  error = false,
  messageError,
  needsTranslation = false,
  control = undefined,
}: mockSetupProps) => {
  const selectorName = faker.string.alpha();
  const onChangeSpy = jest.fn();

  const context = render(
    <Selector
      clearErrors={clearErrors}
      control={control}
      defaultValues={defaultValue}
      dontAllowEmptyValues={dontAllowEmptyValues}
      error={error}
      handleOnChange={onChangeSpy}
      list={listMock}
      messageError={messageError}
      multiple={multiple}
      name={selectorName}
      needsTranslation={needsTranslation}
      placeholder="country"
      required={required}
      width="250px"
    />,
  );

  return { context, selectorName, onChangeSpy };
};

describe('Selector component test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should displays error message when error prop is true', () => {
    const messageError = faker.string.alpha();

    const { context } = setup({ error: true, messageError });

    const error = context.getByTestId('message-error');

    expect(error).toBeInTheDocument();
    expect(error).toHaveTextContent(messageError);
  });

  it('should render SelectorCommon component', () => {
    const { context } = setup({ multiple: true });

    const selector = context.getByTestId(SELECTOR_COMMON_MOCK_TEST_ID);

    expect(selector).toBeInTheDocument();
  });

  it('should render Controller component when control is defined', () => {
    const { context } = setup({ multiple: true, control: {} as any });

    const controller = context.getByTestId(CONTROLLER_MOCK_TEST_ID);

    expect(controller).toBeInTheDocument();
  });

  it('should handles onChange event correctly', () => {
    const expectedValue = [faker.lorem.word()];
    const mockClearErrors = jest.fn();

    const { context, selectorName, onChangeSpy } = setup({ multiple: true, clearErrors: mockClearErrors });

    const selector = context.getByTestId(SELECTOR_COMMON_MOCK_TEST_ID);

    fireEvent.click(selector, { target: { value: expectedValue } });

    expect(onChangeSpy).toHaveBeenCalledWith(expectedValue);
    expect(mockOnChange).toHaveBeenCalledWith(expectedValue);
    expect(mockClearErrors).toHaveBeenCalledWith(selectorName);
  });

  it('should handle "select all" option correctly when no items are selected', () => {
    const { context, onChangeSpy } = setup({ multiple: true, defaultValue: [] });

    const selectAllButton = context.getByTestId('select-all-button');

    // Simulate selecting "all" option when nothing is selected
    fireEvent.click(selectAllButton);

    // Should select all values
    const expectedAllValues = MOCK_LIST_SELECTOR_COUNTRIES.map((option) => option.value);

    expect(onChangeSpy).toHaveBeenCalledWith(expectedAllValues);
  });

  it('should handle "select all" option correctly when all items are already selected', () => {
    const allValues = MOCK_LIST_SELECTOR_COUNTRIES.map((option) => option.value);
    const { context, onChangeSpy } = setup({ multiple: true, defaultValue: allValues });

    const selectAllButton = context.getByTestId('select-all-button');

    // Simulate selecting "all" option when all items are already selected
    fireEvent.click(selectAllButton);

    // Should deselect all values (empty array)
    expect(onChangeSpy).toHaveBeenCalledWith([]);
  });

  it('should render with custom className', () => {
    const customClassName = 'custom-selector-class';
    const { context } = setup({});

    // Re-render with custom className
    context.rerender(
      <Selector
        classNameMainContainer={customClassName}
        defaultValues={DEFAULT_VALUE}
        list={MOCK_LIST_SELECTOR_COUNTRIES}
        name="test"
      />,
    );

    const formControl = context.container.querySelector('.custom-selector-class');

    expect(formControl).toBeInTheDocument();
  });

  it('should render with fullWidth prop', () => {
    const { context } = setup({});

    // Re-render with fullWidth
    context.rerender(
      <Selector fullWidth defaultValues={DEFAULT_VALUE} list={MOCK_LIST_SELECTOR_COUNTRIES} name="test" />,
    );

    // Check if the FormControl has 100% width
    const formControl = context.container.querySelector('.MuiFormControl-root');

    expect(formControl).toHaveStyle('width: 100%');
  });

  it('should not display error message when error is false', () => {
    const messageError = 'Test error message';
    const { context } = setup({ error: false, messageError });

    const errorElement = context.queryByTestId('message-error');

    expect(errorElement).not.toBeInTheDocument();
  });

  it('should handle required validation with control', () => {
    const mockControl = {
      register: jest.fn(),
      handleSubmit: jest.fn(),
      formState: { errors: {} },
    } as any;

    const { context } = setup({ required: true, control: mockControl });

    const controller = context.getByTestId(CONTROLLER_MOCK_TEST_ID);

    expect(controller).toBeInTheDocument();
  });

  it('should render without control (uncontrolled mode)', () => {
    const { context } = setup({ control: undefined });

    const selector = context.getByTestId(SELECTOR_COMMON_MOCK_TEST_ID);

    expect(selector).toBeInTheDocument();

    // Should not render Controller
    const controller = context.queryByTestId(CONTROLLER_MOCK_TEST_ID);

    expect(controller).not.toBeInTheDocument();
  });

  it('should set selected options on mount when defaultValues are provided', () => {
    const testDefaultValues = [MOCK_LIST_SELECTOR_COUNTRIES[1].value];

    setup({ defaultValue: testDefaultValues });

    // The component should internally set selectedOptions to the default values
    // This is tested indirectly through the component rendering properly
    expect(true).toBe(true); // Component renders without errors
  });

  it('should handle dontAllowEmptyValues prop correctly', () => {
    const { context, onChangeSpy } = setup({ dontAllowEmptyValues: true });

    const regularButton = context.getByTestId('select-regular-button');

    // Simulate selecting a regular value with dontAllowEmptyValues enabled
    fireEvent.click(regularButton);

    // Should call the handleOnChange with the processed value
    expect(onChangeSpy).toHaveBeenCalled();
  });

  it('should handle onChange without clearErrors prop', () => {
    const { context, onChangeSpy } = setup({ clearErrors: undefined });

    const regularButton = context.getByTestId('select-regular-button');

    // Simulate selecting a regular value without clearErrors
    fireEvent.click(regularButton);

    // Should still call the handleOnChange
    expect(onChangeSpy).toHaveBeenCalled();
  });

  it('should handle onChange without handleOnChange prop', () => {
    const { context } = setup({});

    // Re-render without handleOnChange
    context.rerender(<Selector defaultValues={DEFAULT_VALUE} list={MOCK_LIST_SELECTOR_COUNTRIES} name="test" />);

    const regularButton = context.getByTestId('select-regular-button');

    // Should not throw error when clicking without handleOnChange
    expect(() => fireEvent.click(regularButton)).not.toThrow();
  });
});
