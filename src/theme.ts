'use client';

import { Roboto } from 'next/font/google';

import breakpoints from '@/styles/breakpoints';
import colors from '@/styles/colors';

import { createTheme } from './ui';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false; // removes the `xs` breakpoint
    sm: false;
    md: false;
    lg: false;
    xl: false;
    minMobile: true; // adds the `mobile` breakpoint
    maxMobile: true;
    minTablet: true;
    maxTablet: true;
    minDesktop: true;
    largeScreen: true;
    xlargeScreen: true;
  }
}

let theme = createTheme({
  breakpoints: {
    values: {
      minMobile: parseInt(breakpoints.mobileMin.split('px')[0]),
      maxMobile: parseInt(breakpoints.mobileMax.split('px')[0]),
      minTablet: parseInt(breakpoints.tabletMin.split('px')[0]),
      maxTablet: parseInt(breakpoints.tabletMax.split('px')[0]),
      minDesktop: parseInt(breakpoints.desktopMin.split('px')[0]),
      largeScreen: parseInt(breakpoints.desktopLargeScreen.split('px')[0]),
      xlargeScreen: parseInt(breakpoints.desktopXLargeScreen.split('px')[0]),
    },
  },
});

theme = createTheme({
  breakpoints: { ...theme.breakpoints },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: colors.opacityBlack,
          '&::placeholder': {
            opacity: 1,
          },
        },
        root: {
          height: '2.75rem',
          width: '100%',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        outlined: {
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'white',
          },
        },
        root: {
          borderRadius: 30,
          height: '2.8125rem',
          width: 'fit-content',
          fontWeight: 400,
          fontSize: '18px',
          lineHeight: '18px',
          [theme.breakpoints.between('minMobile', 'maxMobile')]: {
            width: 'fit-content',
          },
          [theme.breakpoints.between('minTablet', 'maxTablet')]: {
            width: 'fit-content',
            height: '2.125rem',
          },
          '&.Mui-disabled': {
            background: colors.primaryDisable,
            borderColor: colors.primaryDisable,
          },
          '&.MuiButtonBase-root-MuiButton-root': {
            color: colors.primary,
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 0,
          svg: {
            height: '1.25rem',
            width: '1.25rem',
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: colors.primary,
          },
          '&.Mui-disabled': {
            color: colors.primaryDisable,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&.mediumTextFieldClass': {
            [theme.breakpoints.up('minTablet')]: {
              maxWidth: '18.75rem',
            },
          },
          '&.longTextFieldClass': {
            [theme.breakpoints.between('minTablet', 'maxTablet')]: {
              maxWidth: '18.75rem',
            },
            [theme.breakpoints.up('minDesktop')]: {
              maxWidth: '28.125rem',
            },
          },
          '&.MuiTextField-root': {
            '.MuiInputBase-root': {
              height: '2.75rem',
              '&.MuiInputBase-multiline': {
                height: 'auto',
              },
              input: {
                color: colors.textColor,
                fontSize: '16px',
                '&::placeholder': {
                  color: colors.greyMainLight,
                },
              },
            },
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderRadius: 15,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: roboto.style.fontFamily,
          '&.mobileTypoClass': {
            [theme.breakpoints.between('minMobile', 'maxMobile')]: {
              fontSize: '0.625rem',
              lineHeight: '0.625rem',
              fonWeitgh: 400,
            },
          },
          '&.tabletTypoClass': {
            [theme.breakpoints.between('minTablet', 'maxTablet')]: {
              fontSize: '0.625rem',
              lineHeight: '1.5',
              fonWeitgh: 400,
            },
          },
          '&.desktopTypoClass': {
            [theme.breakpoints.up('minDesktop')]: {
              fontSize: '0.75rem',
              lineHeight: '1.5',
              fonWeitgh: 400,
            },
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          height: '3.0625rem',
          borderRadius: '.3125rem',
          padding: 0,
          marginLeft: 0,
          marginRight: 16,
          svg: {
            height: '1.5rem',
            width: '1.5rem',
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
          alignItems: 'flex-start',
          '&.Mui-required .MuiOutlinedInput-notchedOutline': {
            border: '0.125rem solid',
            borderColor: colors.mandatoryColor,
          },
          '.MuiFormControlLabel-asterisk': {
            display: 'none',
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          background: 'rgba(0, 0, 0, 0.6)',
        },
        invisible: {
          background: 'transparent',
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 39,
          height: 24,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: '3px 3px',
            transitionDuration: '300ms',
            '&.Mui-checked': {
              margin: '3px 1px',
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: colors.primary,
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                backgroundColor: colors.primaryDisable,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: colors.primary,
              border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: colors.primaryDisable,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.7,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 18,
            height: 18,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: colors.greyMainTint,
            opacity: 1,
            transition: {
              'background-color': {
                duration: 500,
              },
            },
          },
        },
      },
    },
    MuiCircularProgress: { defaultProps: { color: 'primary' } },
    MuiAlert: {
      styleOverrides: {
        root: {
          width: '100%',
          minHeight: '2.75rem',
          alignItems: 'center',
          borderRadius: 0,
        },
        icon: {
          marginLeft: 'auto',
          svg: {
            color: colors.whiteMain,
            width: '1.25rem',
            height: '1.25rem',
          },
        },
        action: {
          svg: {
            width: '1.25rem',
            height: '1.25rem',
          },
        },
        standardError: {
          borderRadius: 'unset',
          background: colors.danger,
          color: 'white',
        },
        standardSuccess: {
          borderRadius: 'unset',
          background: colors.success,
          color: 'white',
        },
        standardInfo: {
          borderRadius: 'unset',
          background: colors.info,
          color: 'white',
        },
        standardWarning: {
          borderRadius: 'unset',
          background: colors.warning,
          color: 'white',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: colors.dividerGrey,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '&.warningDialog': {
            '.MuiDialogTitle-root': {
              backgroundColor: colors.dialogWarning,
            },
          },
          '&.errorDialog': {
            '.MuiDialogTitle-root': {
              backgroundColor: colors.dialogError,
            },
          },
          '.MuiDialog-paper': {
            margin: '1rem',
          },
          '.MuiDialogTitle-root': {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: colors.whiteMain,
            fontSize: '18px',
            fontWeight: '700',
            svg: {
              width: '1.5rem',
              height: '1.5rem',
            },
          },
          '.MuiDialogContent-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '24.625rem',
            width: 'calc(100vw - 2rem)',
            height: '150px',
            [theme.breakpoints.between('minMobile', 'maxMobile')]: {
              borderBottom: 0,
            },
          },
          '.MuiDialogActions-root': {
            display: 'flex',
            alignItems: 'center',
            [theme.breakpoints.between('minMobile', 'maxMobile')]: {
              justifyContent: 'center',
            },
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        root: {
          flexGrow: 1,
        },
      },
    },
    MuiUseMediaQuery: {
      defaultProps: {
        noSsr: true,
      },
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    button: {
      textTransform: 'capitalize',
      fontSize: 16,
    },
  },
  palette: {
    primary: {
      main: '#2a165b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#000000',
      contrastText: '#fff',
    },
    surface: {
      main: '#F8F8F8',
    },
    greyColor: {
      light: '#F8F8F8',
      main: '#B7B7B7',
      dark: '#3E3E3E',
      darker: '#404041',
    },
    orangeColor: {
      main: '#EC6500',
      dark: '#B93900',
    },
    greenColor: {
      main: '#55611B',
      dark: '#353915',
    },
    whiteColor: {
      main: '#FFFFFF',
    },
    blueColor: {
      main: '#2165BD',
      dark: '#0B2C5F',
      darker: '#0B2C5F',
      contrastText: '#fff',
    },
  },
  shape: {
    borderRadius: 5,
  },
});

declare module '@mui/material/styles' {
  interface PaletteOptions {
    surface?: PaletteOptions['primary'];
  }
  interface PaletteOptions {
    greyColor?: PaletteOptions['primary'];
  }
  interface PaletteOptions {
    orangeColor?: PaletteOptions['primary'];
  }
  interface PaletteOptions {
    greenColor?: PaletteOptions['primary'];
  }
  interface PaletteOptions {
    blueColor?: PaletteOptions['primary'];
  }
  interface PaletteOptions {
    whiteColor?: PaletteOptions['primary'];
  }
  interface SimplePaletteColorOptions {
    darker?: string;
  }
}

export default theme;
