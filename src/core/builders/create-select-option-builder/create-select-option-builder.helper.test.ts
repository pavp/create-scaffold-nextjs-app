import { createSelectOptionBuilder } from './create-select-option-builder.helper';

describe('createSelectOptionBuilder', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a builder with default empty values', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.build();

    expect(option).toEqual({
      key: '',
      value: '',
      label: '',
    });
  });

  it('should set key correctly', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.setKey('test-key').build();

    expect(option.key).toBe('test-key');
    expect(option.value).toBe('');
    expect(option.label).toBe('');
  });

  it('should set value correctly', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.setValue('test-value').build();

    expect(option.key).toBe('');
    expect(option.value).toBe('test-value');
    expect(option.label).toBe('');
  });

  it('should set label correctly', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.setLabel('Test Label').build();

    expect(option.key).toBe('');
    expect(option.value).toBe('');
    expect(option.label).toBe('Test Label');
  });

  it('should chain methods correctly', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.setKey('user-1').setValue('john-doe').setLabel('John Doe').build();

    expect(option).toEqual({
      key: 'user-1',
      value: 'john-doe',
      label: 'John Doe',
    });
  });

  it('should allow partial setting of properties', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.setKey('option-1').setLabel('Option 1').build();

    expect(option).toEqual({
      key: 'option-1',
      value: '',
      label: 'Option 1',
    });
  });

  it('should allow overriding values', () => {
    const builder = createSelectOptionBuilder();
    const option = builder
      .setKey('initial-key')
      .setKey('final-key')
      .setValue('initial-value')
      .setValue('final-value')
      .setLabel('initial-label')
      .setLabel('final-label')
      .build();

    expect(option).toEqual({
      key: 'final-key',
      value: 'final-value',
      label: 'final-label',
    });
  });

  it('should handle empty strings', () => {
    const builder = createSelectOptionBuilder();
    const option = builder.setKey('').setValue('').setLabel('').build();

    expect(option).toEqual({
      key: '',
      value: '',
      label: '',
    });
  });

  it('should handle special characters and spaces', () => {
    const builder = createSelectOptionBuilder();
    const option = builder
      .setKey('key-with-special-chars!@#$%')
      .setValue('value with spaces')
      .setLabel('Label with émojis 🚀 and ñ')
      .build();

    expect(option).toEqual({
      key: 'key-with-special-chars!@#$%',
      value: 'value with spaces',
      label: 'Label with émojis 🚀 and ñ',
    });
  });

  it('should create multiple independent builders', () => {
    const builder1 = createSelectOptionBuilder();
    const builder2 = createSelectOptionBuilder();

    const option1 = builder1.setKey('key1').setLabel('Label 1').build();
    const option2 = builder2.setKey('key2').setLabel('Label 2').build();

    expect(option1).toEqual({
      key: 'key1',
      value: '',
      label: 'Label 1',
    });

    expect(option2).toEqual({
      key: 'key2',
      value: '',
      label: 'Label 2',
    });

    // Ensure builders are independent
    expect(option1.key).not.toBe(option2.key);
    expect(option1.label).not.toBe(option2.label);
  });

  it('should return the same instance for method chaining', () => {
    const builder = createSelectOptionBuilder();

    expect(builder.setKey('test')).toBe(builder);
    expect(builder.setValue('test')).toBe(builder);
    expect(builder.setLabel('test')).toBe(builder);
  });
});
