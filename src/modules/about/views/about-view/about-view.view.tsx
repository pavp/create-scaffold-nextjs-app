/* eslint-disable no-console */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';

import tokens from '@/styles/tokens';
import { Box, Button, Container, Grid, Link, TextField, Typography } from '@/ui';

import { FormPersonalInfoInput, FormPersonalInfoInputSchema } from './about-view.types';

export const AboutView = () => {
  const t = useTranslations();
  const {
    formState: { errors, isValid },
    control,
    handleSubmit,
  } = useForm<FormPersonalInfoInput>({
    mode: 'onTouched',
    defaultValues: {
      name: '',
      surname: '',
      email: '',
    },
    resolver: zodResolver(FormPersonalInfoInputSchema),
  });

  const onSubmit = (data: FormPersonalInfoInput) => {
    console.log(data);
  };

  return (
    <Container maxWidth="largeScreen">
      <Box
        sx={{
          my: tokens.spacing.scale8,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" data-testid="about-page" sx={{ mb: tokens.spacing.scale4 }} variant="h4">
          Material UI - Next.js example in TypeScript
        </Typography>
        <Box sx={{ maxWidth: 'sm' }}>
          <Button component={Link} href="/" variant="contained">
            Go to the home page
          </Button>
        </Box>

        <Box>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={2} spacing={2} sx={{ height: 'fit-content' }}>
              <Grid size={2}>
                <Typography>Personal Information</Typography>
              </Grid>
              <Grid size={1}>
                <TextField
                  required
                  control={control}
                  errorMessage={errors.name?.message && t(errors.name?.message)}
                  label={'Name'}
                  name="name"
                  placeholder={'Name'}
                  width={'100%'}
                />
              </Grid>
              <Grid size={1}>
                <TextField
                  required
                  control={control}
                  errorMessage={errors.surname?.message && t(errors.surname?.message)}
                  label={'Surname'}
                  maxLength={50}
                  name="surname"
                  placeholder={'Surname'}
                  width={'100%'}
                />
              </Grid>
              <Grid size={1}>
                <TextField
                  required
                  control={control}
                  errorMessage={errors.email?.message && t(errors.email?.message)}
                  label={'Email'}
                  maxLength={50}
                  name="email"
                  placeholder={'Email'}
                  width={'100%'}
                />
              </Grid>
            </Grid>
            <Box sx={{ mt: tokens.spacing.scale4 }}>
              <Button disabled={!isValid} type="submit" variant="outlined">
                Submit
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Container>
  );
};
