'use client';

import { memo } from 'react';
import { FieldValues } from 'react-hook-form';

import { TextField } from '../text-field/text-field.component';
import { CommonTextFieldProps } from '../text-field/text-field.types';

import { TextAreaProps } from './text-area.types';

const TextArea = <T extends FieldValues>({
  testId,
  placeholder,
  defaultValue = '',
  fullWidth = false,
  width,
  control,
  disabled,
  required,
  label,
  name,
  className,
  onChange,
  errorMessage,
  rows,
  maxLength,
  styles,
}: TextAreaProps<T>) => {
  const textFieldProps: CommonTextFieldProps = {
    testId,
    placeholder,
    fullWidth,
    width,
    disabled,
    required,
    label,
    className,
    multiline: true,
    rows,
    maxLength,
    styles,
  };

  return control ? (
    <TextField
      {...textFieldProps}
      control={control}
      errorMessage={errorMessage}
      maxLength={maxLength}
      name={name}
      styles={styles}
    />
  ) : (
    <TextField
      {...textFieldProps}
      defaultValue={defaultValue}
      maxLength={maxLength}
      styles={styles}
      onChange={onChange}
    />
  );
};

const MemoizedComponent = memo(TextArea) as typeof TextArea;

export { MemoizedComponent as TextArea };
