import { faker } from '@faker-js/faker';
import { fireEvent, render, screen } from '@test/utils/test-utils';

import { Switch } from './switch';

const CONTROLLER_MOCK_TEST_ID = 'CONTROLLER_MOCK_TEST_ID';

jest.mock('react-hook-form', () => {
  return {
    Controller: () => <div data-testid={CONTROLLER_MOCK_TEST_ID} />,
  };
});

describe('Switch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should renders switch with default props', () => {
    render(<Switch onChange={jest.fn()} />);

    const switchElement = screen.getByRole('checkbox');

    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it('should renders switch with label', () => {
    const label = faker.lorem.word();

    render(<Switch label={label} onChange={jest.fn()} />);

    const labelElement = screen.getByText(label);

    expect(labelElement).toBeInTheDocument();
  });

  it('should calls onChange handler when clicked', () => {
    const onChangeMock = jest.fn();

    render(<Switch onChange={onChangeMock} />);

    const switchElement = screen.getByRole('checkbox');

    fireEvent.click(switchElement);

    expect(onChangeMock).toHaveBeenCalledTimes(1);
    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  it('should updates checked state when clicked', () => {
    render(<Switch onChange={jest.fn()} />);

    const switchElement = screen.getByRole('checkbox');

    fireEvent.click(switchElement);

    expect(switchElement).toBeChecked();
  });

  it('should render Controller component when control is defined', () => {
    render(<Switch control={{} as any} onChange={jest.fn()} />);

    const controller = screen.getByTestId(CONTROLLER_MOCK_TEST_ID);

    expect(controller).toBeInTheDocument();
  });
});
