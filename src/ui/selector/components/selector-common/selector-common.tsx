import { useMemo } from 'react';
import { Checkbox, FormControl, InputLabel, ListItemIcon, ListItemText, MenuItem } from '@mui/material';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTranslations } from 'next-intl';

import { ISelectOption } from '../../types';

export interface ISelectorCommonProps {
  name: string;
  placeholder?: string;
  list: ISelectOption[];
  multiple?: boolean;
  selectedOptions: string[];
  handleChange: (event: SelectChangeEvent<string[]>, onChange?: (...event: any[]) => void) => void;
  required?: boolean;
  disabled?: boolean;
  needsTranslation?: boolean;
  fullWidth?: boolean;
  width?: number | string;
}

export const SelectorCommon = ({
  name,
  placeholder = '',
  list,
  multiple,
  selectedOptions,
  handleChange,
  required,
  disabled,
  needsTranslation,
  fullWidth,
  width,
}: ISelectorCommonProps) => {
  const t = useTranslations();

  const isAllSelected = useMemo(
    () => list.length > 0 && selectedOptions.length === list.length,
    [list.length, selectedOptions.length],
  );

  const isVisibleAllOption = useMemo(() => multiple && list.length > 1, [list.length, multiple]);

  return (
    <FormControl sx={{ width: fullWidth ? '100%' : width }}>
      {!selectedOptions.length && (
        <InputLabel id={name} shrink={false} sx={{ top: -4 }}>
          {placeholder}
        </InputLabel>
      )}
      <Select
        data-testid={`selector-${name}-testid`}
        disabled={disabled}
        inputProps={{ 'data-testid': `selector-${name}-testid-input` }}
        labelId={name}
        multiple={multiple}
        renderValue={(selected) => {
          return list
            .filter((item) => selected.indexOf(item.value) > -1 || selectedOptions.includes(item.value))
            .map((item) => (needsTranslation ? t(item.label) : item.label))
            .join(', ');
        }}
        required={required}
        role="selector-role"
        sx={{ width: '100%' }}
        value={selectedOptions}
        onChange={(event) => handleChange(event)}
      >
        <MenuItem sx={{ display: 'none' }} value="" />
        {isVisibleAllOption && (
          <MenuItem value="all">
            <ListItemIcon>
              <Checkbox checked={isAllSelected} />
            </ListItemIcon>
            <ListItemText primary={t('common.selector.label.selectAll')} />
          </MenuItem>
        )}
        {list.map(({ key, value, label }) => (
          <MenuItem key={key} data-testid={`item-selector-${name}-${value}`} value={value}>
            {multiple && <Checkbox checked={selectedOptions && selectedOptions?.indexOf(value) > -1} />}
            {needsTranslation ? t(label) : label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
