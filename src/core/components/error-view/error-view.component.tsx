'use client';

import { ERROR_CODE } from '@/core/constants';
import { Box, Card, OverridableComponent, SvgIconTypeMap, Typography } from '@/ui';

import styles from './styles.module.scss';

const { container, card, codeTextError, divider, icon, messageText, subtitleText } = styles;

interface ErrorViewProps {
  error: ERROR_CODE | string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  subtitle: string;
  message: string;
}

export const ErrorView = ({ error, Icon, message, subtitle }: ErrorViewProps) => {
  return (
    <Box className={container} data-testid="error-container">
      <Icon className={icon} data-testid="error-icon" />
      <Card className={card}>
        <Typography className={codeTextError} data-testid="error-title" variant="h1">
          {error}
        </Typography>
        <Typography className={subtitleText} data-testid="error-subtitle" variant="h4">
          {subtitle}
        </Typography>
        <Box className={divider} />
        <Typography className={messageText} data-testid="error-message" variant="h6">
          {message}
        </Typography>
      </Card>
    </Box>
  );
};
