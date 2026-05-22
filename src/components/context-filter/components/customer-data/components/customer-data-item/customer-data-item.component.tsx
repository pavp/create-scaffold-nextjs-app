import React from 'react';

import { Box, OverridableComponent, SvgIconTypeMap, Typography } from '@/ui';

import styles from './styles.module.scss';

const {
  CustomerDataItemContainer,
  CustomerDataItemIcon,
  CustomerDataItemContent,
  CustomerDataItemLabel,
  CustomerDataItemValue,
} = styles;

interface CustomerDataItemProps {
  Icon: OverridableComponent<SvgIconTypeMap<object, 'svg'>>;
  bgcolor: string;
  label: string;
  value: string;
}

const CustomerDataItem = ({ Icon, bgcolor, label, value }: CustomerDataItemProps) => {
  return (
    <Box className={CustomerDataItemContainer} data-testid="cd-item-container">
      <Box className={CustomerDataItemIcon} data-testid="cd-item-icon" sx={{ bgcolor }}>
        <Icon />
      </Box>
      <Box className={CustomerDataItemContent}>
        <Typography className={CustomerDataItemLabel} data-testid="cd-item-label">
          {label}
        </Typography>
        <Typography className={CustomerDataItemValue} data-testid="cd-item-value">
          {value}
        </Typography>
      </Box>
    </Box>
  );
};

const MemoizedComponent = React.memo(CustomerDataItem);

export { MemoizedComponent as CustomerDataItem };
