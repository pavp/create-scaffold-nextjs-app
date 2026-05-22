import { fireEvent, render, screen, waitFor } from '@test/utils';

import { AboutView } from './about-view.view';

// Mock console.log to test form submission
const mockConsoleLog = jest.fn();

jest.spyOn(console, 'log').mockImplementation(mockConsoleLog);

describe('AboutView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should render the about page title', () => {
    render(<AboutView />);

    expect(screen.getByTestId('about-page')).toBeInTheDocument();
    expect(screen.getByText('Material UI - Next.js example in TypeScript')).toBeInTheDocument();
  });

  it('should render the home page link', () => {
    render(<AboutView />);

    const homeLink = screen.getByRole('link', { name: /go to the home page/i });

    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should render personal information form', () => {
    render(<AboutView />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Surname')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should have submit button disabled initially', () => {
    render(<AboutView />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    expect(submitButton).toBeDisabled();
  });

  it('should enable submit button when form is valid', async () => {
    render(<AboutView />);

    const nameInput = screen.getByPlaceholderText('Name');
    const surnameInput = screen.getByPlaceholderText('Surname');
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Fill form with valid data
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

    // Wait for form validation
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });
  });

  it('should render all form fields with correct properties', () => {
    render(<AboutView />);

    const nameInput = screen.getByPlaceholderText('Name');
    const surnameInput = screen.getByPlaceholderText('Surname');
    const emailInput = screen.getByPlaceholderText('Email');

    // Check required attribute
    expect(nameInput).toBeRequired();
    expect(surnameInput).toBeRequired();
    expect(emailInput).toBeRequired();

    // Check placeholders
    expect(nameInput).toHaveAttribute('placeholder', 'Name');
    expect(surnameInput).toHaveAttribute('placeholder', 'Surname');
    expect(emailInput).toHaveAttribute('placeholder', 'Email');
  });

  it('should handle form field limits correctly', () => {
    render(<AboutView />);

    const surnameInput = screen.getByPlaceholderText('Surname');
    const emailInput = screen.getByPlaceholderText('Email');

    // Check maxLength attributes are properly set
    expect(surnameInput).toHaveAttribute('maxLength', '50');
    expect(emailInput).toHaveAttribute('maxLength', '50');
  });

  it('should display form with proper grid layout', () => {
    render(<AboutView />);

    const form = screen.getByText('Personal Information').closest('form');

    expect(form).toBeInTheDocument();
    expect(form).toHaveAttribute('noValidate');
  });

  it('should not submit form with invalid data', () => {
    render(<AboutView />);

    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Try to submit empty form
    fireEvent.click(submitButton);

    // Form should not submit (button is disabled)
    expect(mockConsoleLog).not.toHaveBeenCalled();
  });

  it('should have form elements with proper structure', () => {
    render(<AboutView />);

    // Check container structure
    expect(screen.getByText('Material UI - Next.js example in TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();

    // Check form fields exist
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Surname')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should handle form submission with valid data', async () => {
    render(<AboutView />);

    const nameInput = screen.getByPlaceholderText('Name');
    const surnameInput = screen.getByPlaceholderText('Surname');
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button', { name: /submit/i });

    // Fill form with valid data
    fireEvent.change(nameInput, { target: { value: 'John' } });
    fireEvent.change(surnameInput, { target: { value: 'Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john.doe@example.com' } });

    // Wait for form to be valid
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    // Submit form
    fireEvent.click(submitButton);

    // Check that form data was logged
    await waitFor(() => {
      expect(mockConsoleLog).toHaveBeenCalledWith({
        name: 'John',
        surname: 'Doe',
        email: 'john.doe@example.com',
      });
    });
  });

  it('should show validation error for empty name field', async () => {
    render(<AboutView />);

    const nameInput = screen.getByPlaceholderText('Name');

    // Touch field and leave empty to trigger validation
    fireEvent.focus(nameInput);
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for empty surname field', async () => {
    render(<AboutView />);

    const surnameInput = screen.getByPlaceholderText('Surname');

    // Touch field and leave empty to trigger validation
    fireEvent.focus(surnameInput);
    fireEvent.blur(surnameInput);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for empty email field', async () => {
    render(<AboutView />);

    const emailInput = screen.getByPlaceholderText('Email');

    // Touch field and leave empty to trigger validation
    fireEvent.focus(emailInput);
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for invalid email format', async () => {
    render(<AboutView />);

    const emailInput = screen.getByPlaceholderText('Email');

    // Enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);

    await waitFor(() => {
      expect(screen.getByText(/email/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for name exceeding max length', async () => {
    render(<AboutView />);

    const nameInput = screen.getByPlaceholderText('Name');

    // Enter name longer than 20 characters
    fireEvent.change(nameInput, { target: { value: 'a'.repeat(21) } });
    fireEvent.blur(nameInput);

    await waitFor(() => {
      expect(screen.getByText(/maxLength/i)).toBeInTheDocument();
    });
  });

  it('should show validation error for surname exceeding max length', async () => {
    render(<AboutView />);

    const surnameInput = screen.getByPlaceholderText('Surname');

    // Enter surname longer than 20 characters
    fireEvent.change(surnameInput, { target: { value: 'b'.repeat(21) } });
    fireEvent.blur(surnameInput);

    await waitFor(() => {
      expect(screen.getByText(/maxLength/i)).toBeInTheDocument();
    });
  });
});
