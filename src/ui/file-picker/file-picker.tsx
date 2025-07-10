'use client';

import { ChangeEvent, memo, useCallback, useEffect, useRef, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import { Box, FormControlLabel, IconButton, InputAdornment, TextField } from '@mui/material';

import { DEFAULT_TEXT_FIELD_WIDTH } from '../text-field/constants';
import { useShowToast } from '../utils';

import { DEFAULT_MAX_IMAGE_SIZE_MB } from './constants';
import { FilePickerProps } from './types';

const FilePicker = ({
  testId,
  placeholder,
  width = DEFAULT_TEXT_FIELD_WIDTH,
  disabled,
  required,
  label,
  className,
  startAdornment,
  defaultValue = '',
  onChange,
  accept,
  sizeLimit = DEFAULT_MAX_IMAGE_SIZE_MB,
}: FilePickerProps) => {
  const inputFile = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState<string>(defaultValue);

  useEffect(() => {
    if (defaultValue) setValue(defaultValue);
  }, [defaultValue]);

  const { showToast } = useShowToast();

  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target?.files?.[0];

      if (file) {
        if (!!sizeLimit && file.size > sizeLimit) {
          //TO DO: add translations
          showToast({ snackbarMessage: `Maximum size file ${sizeLimit / 1000000}MB.`, severity: 'ERROR' });
        } else {
          setValue(file.name);
          onChange(file);
        }
      }
    },
    [onChange, showToast, sizeLimit],
  );

  return (
    <Box data-testid="file-picker-container">
      <input ref={inputFile} hidden accept={accept} type="file" onChange={handleOnChange} />
      <FormControlLabel
        control={
          <TextField
            className={className}
            data-testid={testId}
            disabled={disabled}
            placeholder={placeholder}
            required={required}
            slotProps={{
              input: {
                inputProps: { 'data-testid': `${testId}-input`, sx: { ':hover': { cursor: 'pointer' } } },
                startAdornment,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      disabled={!value}
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue('');
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
                readOnly: true,
              },
            }}
            sx={{ alignSelf: 'flex-start', width }}
            value={value}
            onClick={() => {
              inputFile?.current && inputFile.current.click();
            }}
          />
        }
        label={label}
        labelPlacement="top"
        slotProps={{ typography: { alignSelf: 'flex-start' } }}
      />
    </Box>
  );
};

const MemoizedComponent = memo(FilePicker);

export { MemoizedComponent as FilePicker };
