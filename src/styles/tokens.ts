// Consolidated design tokens export
import animations from './animations';
import borders from './borders';
import breakpoints from './breakpoints';
import colors from './colors';
import shadows from './shadows';
import spacing from './spacing';
import typography from './typography';

const tokens = {
  spacing,
  typography,
  colors,
  shadows,
  borders,
  animations,
  breakpoints,
} as const;

export default tokens;
