import React from 'react';
import { Checkbox as CheckboxMui, FormControlLabel } from '@mui/material';

import styles from './styles.module.scss';

const { selectAllCheckbox } = styles;

interface CheckboxProps {
  testId?: string;
  label: string;
  value?: string;
  checked: boolean;
  indeterminate?: boolean;
  selectAll?: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({ testId, label, value, checked, indeterminate, onChange, selectAll }: CheckboxProps) => {
  const selectAllClass = selectAll ? selectAllCheckbox : '';

  return (
    <FormControlLabel
      className={selectAllClass}
      control={
        <CheckboxMui
          checked={checked}
          data-testid={testId}
          indeterminate={indeterminate}
          value={value}
          onChange={onChange}
        />
      }
      data-testid="checkbox-controller"
      label={label}
      sx={{
        alignItems: 'center',
      }}
    />
  );
};

const MemoizedComponent = React.memo(Checkbox);

export { MemoizedComponent as Checkbox };
