'use client';
import { memo, useCallback } from 'react';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { Box, InputAdornment } from '@mui/material';
import { DateRange, DateRangePicker as DatePickerMui, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

import styles from './styles.module.scss';

const { mainContainer, datePicker } = styles;

const DEFAULT_FORMAT = 'YYYY/MM/DD';

const DEFAULT_SELECTOR_WIDTH = '200px';

export interface DatePicker {
  width?: string;
  returnDateFormat?: string;
  handleOnChange: (from: string, to: string) => void;
}

const DateRangePicker = ({
  width = DEFAULT_SELECTOR_WIDTH,
  returnDateFormat = DEFAULT_FORMAT,
  handleOnChange,
}: DatePicker) => {
  const t = useTranslations('common');
  const onChangeValue = useCallback(
    (value: DateRange<Dayjs> | null) => {
      if (!value?.length) return;

      const [from, to] = value;

      if (from && to) handleOnChange(dayjs(from).format(returnDateFormat), dayjs(to).format(returnDateFormat));
      if (!from && !to) handleOnChange('', '');
    },
    [handleOnChange, returnDateFormat],
  );

  return (
    <Box className={mainContainer} data-testid="container" sx={{ flexBasis: width }}>
      <DatePickerMui
        className={datePicker}
        slotProps={{
          field: {
            clearable: true,
          },
          textField: {
            InputProps: {
              placeholder: t('datePickerPlaceHolder'),
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon />
                </InputAdornment>
              ),
            },
          },
        }}
        slots={{ field: SingleInputDateRangeField }}
        onChange={(value) => onChangeValue(value as DateRange<Dayjs>)}
      />
    </Box>
  );
};

const MemoizedComponent = memo(DateRangePicker);

export { MemoizedComponent as DateRangePicker };
