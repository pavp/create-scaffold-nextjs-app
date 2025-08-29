'use client';

import { memo, SyntheticEvent, useCallback, useState } from 'react';
import { Dayjs } from 'dayjs';

import { Box, Button, Calendar, Modal } from '@/ui';

import styles from './styles.module.scss';

const { footer, saveButton } = styles;

interface DateCalendarModalProps {
  isVisible: boolean;
  selectedDate: Dayjs | null;
  modalTitle: string;
  saveLabel: string;
  disabledDates?: string[];
  minDate?: Dayjs;
  onChangeMonthAndYearCalendar?: (date: Dayjs) => void;
  onClose: () => void;
  onSave: (newValue: Dayjs) => void;
}

const DateCalendarModal = ({
  isVisible,
  selectedDate,
  modalTitle,
  saveLabel,
  disabledDates,
  minDate,
  onChangeMonthAndYearCalendar,
  onClose,
  onSave,
}: DateCalendarModalProps) => {
  const [selectedDateCalendar, setSelectedDateCalendar] = useState<Dayjs | null>(selectedDate);

  const handleClickSave = useCallback(
    (event: SyntheticEvent) => {
      event.stopPropagation();
      if (selectedDateCalendar) {
        onSave(selectedDateCalendar);
        onClose();
      }
    },
    [onClose, onSave, selectedDateCalendar],
  );

  return (
    <Box>
      <Modal handleClose={onClose} isVisible={isVisible}>
        <Modal.Header handleClick={onClose} title={modalTitle} />
        <Modal.Content>
          <Box>
            <Calendar
              disabledDates={disabledDates}
              minDate={minDate}
              selectedDate={selectedDateCalendar}
              onChangeDay={setSelectedDateCalendar}
              onChangeMonthAndYear={onChangeMonthAndYearCalendar}
            />
          </Box>
        </Modal.Content>
        <Modal.Footer>
          <Box className={footer}>
            <Button className={saveButton} variant="contained" onClick={(event) => handleClickSave(event)}>
              {saveLabel}
            </Button>
          </Box>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};

const MemoizedComponent = memo(DateCalendarModal);

export { MemoizedComponent as DateCalendarModal };
