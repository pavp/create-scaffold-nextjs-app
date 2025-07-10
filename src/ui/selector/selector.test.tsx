import { Control, UseFormClearErrors } from 'react-hook-form';
import { faker } from '@faker-js/faker';
import { fireEvent, render } from '@test/utils/test-utils';

import { ISelectorCommonProps } from './components/selector-common/selector-common';
import { Selector } from './selector';
import { ISelectOption } from './types';

const SELECTOR_COMMON_MOCK_TEST_ID = 'SELECTOR_COMMON_MOCK_TEST_ID';
const CONTROLLER_MOCK_TEST_ID = 'CONTROLLER_MOCK_TEST_ID';

const mockOnChange = jest.fn();

jest.mock('@/ui/selector/components/selector-common/selector-common', () => {
  return {
    SelectorCommon: ({ handleChange }: ISelectorCommonProps) => (
      <button
        data-testid={SELECTOR_COMMON_MOCK_TEST_ID}
        onClick={(event) => handleChange(event as any, mockOnChange)}
      />
    ),
  };
});

jest.mock('react-hook-form', () => {
  return {
    Controller: () => <div data-testid={CONTROLLER_MOCK_TEST_ID} />,
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
});
