'use client';

import { Roboto } from 'next/font/google';

import tokens from '@/styles/tokens';

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
      minMobile: parseInt(tokens.breakpoints.mobileMin.split('px')[0]),
      maxMobile: parseInt(tokens.breakpoints.mobileMax.split('px')[0]),
      minTablet: parseInt(tokens.breakpoints.tabletMin.split('px')[0]),
      maxTablet: parseInt(tokens.breakpoints.tabletMax.split('px')[0]),
      minDesktop: parseInt(tokens.breakpoints.desktopMin.split('px')[0]),
      largeScreen: parseInt(tokens.breakpoints.desktopLargeScreen.split('px')[0]),
      xlargeScreen: parseInt(tokens.breakpoints.desktopXLargeScreen.split('px')[0]),
    },
  },
});

theme = createTheme({
  breakpoints: { ...theme.breakpoints },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          color: tokens.colors.semanticBackgroundOverlay,
          '&::placeholder': {
            opacity: 1,
          },
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 1000px ${tokens.colors.semanticBackgroundPrimary} inset`,
            WebkitTextFillColor: tokens.colors.semanticTextPrimary,
          },
          '&:-webkit-autofill:hover': {
            WebkitBoxShadow: `0 0 0 1000px ${tokens.colors.semanticBackgroundPrimary} inset`,
            WebkitTextFillColor: tokens.colors.semanticTextPrimary,
          },
          '&:-webkit-autofill:focus': {
            WebkitBoxShadow: `0 0 0 1000px ${tokens.colors.semanticBackgroundPrimary} inset`,
            WebkitTextFillColor: tokens.colors.semanticTextPrimary,
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
          borderRadius: parseInt(tokens.borders.borderRadiusFull.split('px')[0]),
          height: '2.8125rem',
          width: 'fit-content',
          fontWeight: tokens.typography.fontWeightNormal,
          fontSize: tokens.typography.fontSizeLg,
          lineHeight: tokens.typography.fontSizeLg,
          [theme.breakpoints.between('minMobile', 'maxMobile')]: {
            width: 'fit-content',
          },
          [theme.breakpoints.between('minTablet', 'maxTablet')]: {
            width: 'fit-content',
            height: '2.125rem',
          },
          '&.Mui-disabled': {
            background: tokens.colors.semanticComponentButtonDisabled,
            borderColor: tokens.colors.semanticComponentButtonDisabled,
          },
          '&.MuiButtonBase-root-MuiButton-root': {
            color: tokens.colors.semanticBrandPrimary,
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
            color: tokens.colors.semanticBrandPrimary,
          },
          '&.Mui-disabled': {
            color: tokens.colors.semanticComponentButtonDisabled,
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
                color: tokens.colors.semanticTextPrimary,
                fontSize: tokens.typography.fontSizeBase,
                '&::placeholder': {
                  color: tokens.colors.semanticTextSecondary,
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
            borderColor: tokens.colors.semanticComponentMandatory,
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
                backgroundColor: tokens.colors.semanticBrandPrimary,
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                backgroundColor: tokens.colors.semanticComponentButtonDisabled,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: tokens.colors.semanticBrandPrimary,
              border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: tokens.colors.semanticComponentButtonDisabled,
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
            backgroundColor: tokens.colors.semanticBorderSecondary,
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
            color: tokens.colors.primitiveWhite,
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
          background: tokens.colors.semanticFeedbackError,
          color: 'white',
        },
        standardSuccess: {
          borderRadius: 'unset',
          background: tokens.colors.semanticFeedbackSuccess,
          color: 'white',
        },
        standardInfo: {
          borderRadius: 'unset',
          background: tokens.colors.semanticFeedbackInfo,
          color: 'white',
        },
        standardWarning: {
          borderRadius: 'unset',
          background: tokens.colors.semanticFeedbackWarning,
          color: 'white',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: tokens.colors.semanticBorderDivider,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          '&.warningDialog': {
            '.MuiDialogTitle-root': {
              backgroundColor: tokens.colors.semanticDialogWarning,
            },
          },
          '&.errorDialog': {
            '.MuiDialogTitle-root': {
              backgroundColor: tokens.colors.semanticDialogError,
            },
          },
          '.MuiDialog-paper': {
            margin: '1rem',
          },
          '.MuiDialogTitle-root': {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: tokens.colors.primitiveWhite,
            fontSize: tokens.typography.fontSizeLg,
            fontWeight: tokens.typography.fontWeightBold,
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
    fontWeightMedium: tokens.typography.fontWeightMedium,
    fontWeightBold: tokens.typography.fontWeightBold,
    button: {
      textTransform: 'capitalize',
      fontSize: tokens.typography.fontSizeBase,
    },
  },
  palette: {
    primary: {
      main: tokens.colors.semanticBrandPrimary,
      contrastText: tokens.colors.primitiveWhite,
    },
    secondary: {
      main: tokens.colors.primitiveBlack,
      contrastText: tokens.colors.primitiveWhite,
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
      main: tokens.colors.primitiveWhite,
    },
    blueColor: {
      main: '#2165BD',
      dark: '#0B2C5F',
      darker: '#0B2C5F',
      contrastText: tokens.colors.primitiveWhite,
    },
  },
  shape: {
    borderRadius: parseInt(tokens.borders.borderRadiusBase.split('px')[0]),
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
