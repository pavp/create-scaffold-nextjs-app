import { createAutocompleteOptionBuilder } from './create-autocomplete-option-builder.helper';

describe('createAutocompleteOptionBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a builder with default empty values', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.build();

    expect(option).toEqual({
      id: '',
      label: '',
    });
  });

  it('should set id correctly', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId('test-id').build();

    expect(option.id).toBe('test-id');
    expect(option.label).toBe('');
  });

  it('should set label correctly', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setLabel('Test Label').build();

    expect(option.id).toBe('');
    expect(option.label).toBe('Test Label');
  });

  it('should chain methods correctly', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId('user-1').setLabel('John Doe').build();

    expect(option).toEqual({
      id: 'user-1',
      label: 'John Doe',
    });
  });

  it('should allow partial setting of properties', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId('option-1').build();

    expect(option).toEqual({
      id: 'option-1',
      label: '',
    });
  });

  it('should allow overriding values', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder
      .setId('initial-id')
      .setId('final-id')
      .setLabel('initial-label')
      .setLabel('final-label')
      .build();

    expect(option).toEqual({
      id: 'final-id',
      label: 'final-label',
    });
  });

  it('should handle empty strings', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId('').setLabel('').build();

    expect(option).toEqual({
      id: '',
      label: '',
    });
  });

  it('should handle special characters and spaces', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId('id-with-special-chars!@#$%').setLabel('Label with émojis 🚀 and ñ').build();

    expect(option).toEqual({
      id: 'id-with-special-chars!@#$%',
      label: 'Label with émojis 🚀 and ñ',
    });
  });

  it('should handle numeric strings', () => {
    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId('123').setLabel('Option 123').build();

    expect(option).toEqual({
      id: '123',
      label: 'Option 123',
    });
  });

  it('should create multiple independent builders', () => {
    const builder1 = createAutocompleteOptionBuilder();
    const builder2 = createAutocompleteOptionBuilder();

    const option1 = builder1.setId('id1').setLabel('Label 1').build();
    const option2 = builder2.setId('id2').setLabel('Label 2').build();

    expect(option1).toEqual({
      id: 'id1',
      label: 'Label 1',
    });

    expect(option2).toEqual({
      id: 'id2',
      label: 'Label 2',
    });

    // Ensure builders are independent
    expect(option1.id).not.toBe(option2.id);
    expect(option1.label).not.toBe(option2.label);
  });

  it('should return the same instance for method chaining', () => {
    const builder = createAutocompleteOptionBuilder();

    expect(builder.setId('test')).toBe(builder);
    expect(builder.setLabel('test')).toBe(builder);
  });

  it('should handle long strings', () => {
    const longId = 'a'.repeat(1000);
    const longLabel = 'Very long label '.repeat(100);

    const builder = createAutocompleteOptionBuilder();
    const option = builder.setId(longId).setLabel(longLabel).build();

    expect(option.id).toBe(longId);
    expect(option.label).toBe(longLabel);
    expect(option.id.length).toBe(1000);
  });

  it('should build the same object multiple times', () => {
    const builder = createAutocompleteOptionBuilder().setId('consistent-id').setLabel('Consistent Label');

    const option1 = builder.build();
    const option2 = builder.build();

    expect(option1).toEqual(option2);
    expect(option1).toEqual({
      id: 'consistent-id',
      label: 'Consistent Label',
    });
  });
});
