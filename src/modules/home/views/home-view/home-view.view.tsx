/* eslint-disable no-console */
'use client';

import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import dayjs, { Dayjs } from 'dayjs';
import { useTranslations } from 'next-intl';

import { CommonGrid } from '@/components/common-grid/common-grid.component';
import { NoSearchResults } from '@/components/no-search-results/no-search-results.component';
import { createAutocompleteOptionBuilder } from '@/core/builders';
import { MainLayout } from '@/core/layouts';
import tokens from '@/styles/tokens';
import {
  AutocompleteSelector,
  Badge,
  Box,
  Button,
  Calendar,
  Checkbox,
  Container,
  DateRangePicker,
  Link,
  LoadingIndicator,
  Modal,
  NumberPicker,
  Pagination,
  RadioButton,
  Selector,
  Switch,
  Typography,
} from '@/ui';
import { IAutocompleteOption } from '@/ui/autocomplete-selector';
import { useShowDialog } from '@/ui/dialog/hooks';
import { usePagination } from '@/ui/pagination/hooks';
import { useShowToast } from '@/ui/toast/hooks';

const optionsAutoComplete: IAutocompleteOption[] = [
  createAutocompleteOptionBuilder().setId('1').setLabel('Option 1').build(),
  createAutocompleteOptionBuilder().setId('2').setLabel('Option 2').build(),
  createAutocompleteOptionBuilder().setId('3').setLabel('Option 3').build(),
];

export const HomeView = () => {
  const t = useTranslations('common');
  const { showToast } = useShowToast();
  const { showDialog } = useShowDialog();
  const [checked, setChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isRadioButton, setIsRadioButton] = useState(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const { onChangePage, page } = usePagination();

  return (
    <MainLayout showCustomerData>
      <CommonGrid>
        <CommonGrid.LeftContainer>
          <CommonGrid.Header showGoBackButton showIcons title="Header title" />
          <CommonGrid.Subtitle>Subtitle</CommonGrid.Subtitle>
          <CommonGrid.MainContainer>
            <Container data-testid="main-page" maxWidth="largeScreen">
              <Box
                sx={{
                  my: tokens.spacing.scale8,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography component="h1" sx={{ mb: tokens.spacing.scale4 }} variant="h4">
                  Material UI - Next.js App Router example in TypeScript
                </Typography>
                <Link href="/about">{t('appointmentLabel')}</Link>
                <Button onClick={() => showToast({ snackbarMessage: 'test', severity: 'SUCCESS' })}>
                  Show Success Toast
                </Button>
                <Checkbox checked={checked} label="Checkbox" onChange={() => setChecked((prev) => !prev)} />
                <Button onClick={() => setIsVisible(true)}>Show Modal</Button>
                <LoadingIndicator />
                <Button
                  onClick={() =>
                    showDialog({
                      message: 'test',
                      severity: 'WARNING',
                      handleAccept: () => {},
                      acceptText: 'Continue',
                      title: 'Test dialog',
                    })
                  }
                >
                  Show Dialog
                </Button>
                <NoSearchResults />
                <Box sx={{ marginBottom: tokens.spacing.scale4 }}>
                  <Pagination page={page} totalPages={4} onChangePage={onChangePage} />
                </Box>
                <Box sx={{ marginBottom: tokens.spacing.scale4 }}>
                  <Selector
                    handleOnChange={(value) => console.log(value)}
                    list={[{ key: '1', value: '1', label: 'Option 1' }]}
                    name="selector"
                    placeholder="Select"
                  />
                </Box>
                <Box sx={{ marginBottom: tokens.spacing.scale4 }}>
                  <Switch label="Right" labelLeft="Left" onChange={(checked) => console.log(checked)} />
                </Box>
                <Box sx={{ marginBottom: tokens.spacing.scale4, width: '50%' }}>
                  <AutocompleteSelector
                    backgroundColor={tokens.colors.primitiveWhite}
                    options={optionsAutoComplete}
                    placeholder="Search"
                    startAdornment={
                      <SearchIcon style={{ fontSize: '1.5rem', color: tokens.colors.primitiveGray500 }} />
                    }
                    onChange={(value) => console.log(value)}
                    onChangeInput={(value) => console.log(value)}
                  />
                </Box>

                <Box
                  sx={{
                    marginBottom: tokens.spacing.scale4,
                    width: '50px',
                  }}
                >
                  <Badge
                    invisible={false}
                    overlap="circular"
                    sx={{
                      span: {
                        top: 16,
                        right: 16,
                        height: 15,
                        width: 15,
                        borderRadius: '50%',
                        backgroundColor: '#39DE5F',
                      },
                    }}
                    variant="dot"
                  >
                    <Box sx={{ width: '50px', height: '50px', backgroundColor: tokens.colors.primitiveGray900 }} />
                  </Badge>
                </Box>

                <Box
                  sx={{
                    marginBottom: tokens.spacing.scale4,
                    width: '50%',
                  }}
                >
                  <Calendar
                    selectedDate={date}
                    onChangeDay={(date) => {
                      console.log({ date });
                      setDate(date);
                    }}
                    onChangeMonthAndYear={(value) => console.log(value)}
                  />
                </Box>

                <Box
                  sx={{
                    marginBottom: tokens.spacing.scale4,
                    width: '50%',
                  }}
                >
                  <NumberPicker defaultValue={1} width="100%" onChange={(value) => console.log(value)} />
                </Box>

                <Box
                  sx={{
                    marginBottom: tokens.spacing.scale4,
                    width: '20%',
                  }}
                >
                  <RadioButton label="Radio Button" value={isRadioButton} onChange={setIsRadioButton} />
                </Box>

                <DateRangePicker handleOnChange={(from, to) => console.log(from, to)} width="300px" />

                <Modal handleClose={() => setIsVisible(false)} isVisible={isVisible}>
                  <Modal.Header handleClick={() => setIsVisible(false)} title="Modal title" />
                  <Modal.Content>
                    <Box sx={{ width: '500px', height: '300px' }}>
                      <Typography>Test modal</Typography>
                    </Box>
                  </Modal.Content>
                  <Modal.Footer>
                    <Typography>Footer</Typography>
                  </Modal.Footer>
                </Modal>
              </Box>
            </Container>
          </CommonGrid.MainContainer>
          <CommonGrid.BottomContainer>Bottom</CommonGrid.BottomContainer>
        </CommonGrid.LeftContainer>
        <CommonGrid.RightContainer>Right Container</CommonGrid.RightContainer>
      </CommonGrid>
    </MainLayout>
  );
};
