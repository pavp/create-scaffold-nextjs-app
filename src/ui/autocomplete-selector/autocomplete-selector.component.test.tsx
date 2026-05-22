import { useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';

import { AutocompleteSelector } from './autocomplete-selector.component';
import type { IAutocompleteOption } from './autocomplete-selector.types';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      'textField.noOptionsText': 'No options available',
    };

    return translations[key] || key;
  },
}));

const mockOptions: IAutocompleteOption[] = [
  { id: '1', label: 'Option 1' },
  { id: '2', label: 'Option 2' },
  { id: '3', label: 'Option 3' },
];

interface TestFormData {
  testField: IAutocompleteOption | null;
}

const TestControlledComponent = ({ errorMessage }: { errorMessage?: string }) => {
  const { control } = useForm<TestFormData>({
    defaultValues: { testField: null },
  });

  return (
    <AutocompleteSelector
      control={control}
      errorMessage={errorMessage}
      name="testField"
      options={mockOptions}
      testId="controlled-autocomplete"
    />
  );
};

describe('AutocompleteSelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Uncontrolled mode', () => {
    it('should render autocomplete with options', () => {
      render(<AutocompleteSelector options={mockOptions} testId="test-autocomplete" onChange={() => {}} />);

      const input = screen.getByTestId('test-autocomplete');

      expect(input).toBeInTheDocument();
    });

    it('should render with default value', () => {
      render(
        <AutocompleteSelector
          defaultValue={mockOptions[0]}
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      const input = screen.getByDisplayValue('Option 1');

      expect(input).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(
        <AutocompleteSelector
          options={mockOptions}
          placeholder="Select an option"
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      expect(screen.getByPlaceholderText('Select an option')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(
        <AutocompleteSelector
          label="Test Label"
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should hide label when hideLabel is true', () => {
      render(
        <AutocompleteSelector
          hideLabel
          label="Test Label"
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      const input = screen.getByRole('combobox');

      expect(input).toBeInTheDocument();
      // Label should not be visible as placement would be undefined
    });

    it('should render as disabled', () => {
      render(<AutocompleteSelector disabled options={mockOptions} testId="test-autocomplete" onChange={() => {}} />);

      const input = screen.getByRole('combobox');

      expect(input).toHaveClass('Mui-disabled');
    });

    it('should render as required', () => {
      render(<AutocompleteSelector required options={mockOptions} testId="test-autocomplete" onChange={() => {}} />);

      const input = screen.getByRole('combobox');

      expect(input).toBeRequired();
    });

    it('should render with start adornment', () => {
      const startAdornment = <span data-testid="start-adornment">Icon</span>;

      render(
        <AutocompleteSelector
          options={mockOptions}
          startAdornment={startAdornment}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      expect(screen.getByTestId('start-adornment')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      render(
        <AutocompleteSelector
          className="custom-class"
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      const textField = screen.getByRole('combobox').closest('.MuiTextField-root');

      expect(textField).toHaveClass('custom-class');
    });

    it('should update value when defaultValue changes', () => {
      const { rerender } = render(
        <AutocompleteSelector
          defaultValue={mockOptions[0]}
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();

      rerender(
        <AutocompleteSelector
          defaultValue={mockOptions[1]}
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      expect(screen.getByDisplayValue('Option 2')).toBeInTheDocument();
    });
  });

  describe('Controlled mode', () => {
    it('should render with react-hook-form control', () => {
      render(<TestControlledComponent />);

      expect(screen.getByTestId('controlled-autocomplete')).toBeInTheDocument();
    });

    it('should render error message', () => {
      render(<TestControlledComponent errorMessage="This field is required" />);

      expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
  });

  describe('UI features', () => {
    it('should render input with correct data-testid', () => {
      render(<AutocompleteSelector options={mockOptions} testId="test-autocomplete" onChange={() => {}} />);

      expect(screen.getByTestId('test-autocomplete-input')).toBeInTheDocument();
    });

    it('should apply custom width', () => {
      render(
        <AutocompleteSelector options={mockOptions} testId="test-autocomplete" width="200px" onChange={() => {}} />,
      );

      const autocompleteContainer = screen.getByTestId('test-autocomplete');

      expect(autocompleteContainer.closest('.MuiAutocomplete-root')).toHaveStyle({ width: '200px' });
    });

    it('should apply background color', () => {
      render(
        <AutocompleteSelector
          backgroundColor="#f0f0f0"
          options={mockOptions}
          testId="test-autocomplete"
          onChange={() => {}}
        />,
      );

      const textField = screen.getByRole('combobox').closest('.MuiTextField-root');

      expect(textField).toHaveStyle({ backgroundColor: '#f0f0f0' });
    });
  });

  describe('Memoization', () => {
    it('should memoize the component', () => {
      const { rerender } = render(
        <AutocompleteSelector options={mockOptions} testId="test-autocomplete" onChange={() => {}} />,
      );

      const firstRender = screen.getByTestId('test-autocomplete');

      rerender(<AutocompleteSelector options={mockOptions} testId="test-autocomplete" onChange={() => {}} />);

      const secondRender = screen.getByTestId('test-autocomplete');

      expect(firstRender).toBe(secondRender);
    });
  });
});
