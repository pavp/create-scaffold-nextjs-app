import { memo, useCallback } from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InsertInvitationIcon from '@mui/icons-material/InsertInvitation';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import { Box, IconButton } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers-pro';
import { Dayjs } from 'dayjs';

import { DATE_FORMAT } from '@/constants';

import styles from './styles.module.scss';

const { dateCalendar, smallDateCalendar, iconButtonContainer, container } = styles;

export interface CalendarProps {
  selectedDate: Dayjs | null;
  smallCalendar?: boolean;
  disabledDates?: string[];
  minDate?: Dayjs;
  disabled?: boolean;
  loading?: boolean;
  onChangeDay: (newValue: Dayjs | null) => void;
  onChangeMonthAndYear?: (date: Dayjs) => void;
}

const Calendar = ({
  selectedDate,
  smallCalendar,
  disabledDates,
  minDate,
  disabled,
  loading,
  onChangeDay,
  onChangeMonthAndYear,
}: CalendarProps) => {
  const calendarClassName = smallCalendar ? `${dateCalendar} ${smallDateCalendar}` : dateCalendar;

  const shouldDisableDate = useCallback(
    (date: Dayjs) => {
      if (!disabledDates) return false;
      const formattedDate = date.format(DATE_FORMAT);

      return disabledDates.includes(formattedDate);
    },
    [disabledDates],
  );

  return (
    <Box className={container}>
      <DateCalendar
        className={calendarClassName}
        disabled={disabled}
        loading={loading}
        minDate={minDate}
        shouldDisableDate={shouldDisableDate}
        slots={{
          switchViewIcon: ExpandMoreIcon,
          previousIconButton: (props) => (
            <>
              <IconButton {...props} className={iconButtonContainer} disabled={props.disabled || disabled || loading}>
                <KeyboardArrowLeftIcon />
              </IconButton>

              <InsertInvitationIcon />
            </>
          ),
          nextIconButton: (props) => (
            <IconButton {...props} className={iconButtonContainer} disabled={props.disabled || disabled || loading}>
              <KeyboardArrowRightIcon />
            </IconButton>
          ),
        }}
        value={selectedDate}
        onChange={onChangeDay}
        onMonthChange={onChangeMonthAndYear}
        onYearChange={onChangeMonthAndYear}
      />
    </Box>
  );
};

const MemoizedComponent = memo(Calendar);

export { MemoizedComponent as Calendar };
