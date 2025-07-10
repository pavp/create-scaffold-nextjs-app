import React from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslations } from 'next-intl';

import { useContextStore } from '@/store/context/hooks';
import colors from '@/styles/colors';
import { Box } from '@/ui';

import { CustomerDataItem } from './components';

import styles from './styles.module.scss';

const { CustomerDataContainer } = styles;

const CustomerData = () => {
  const t = useTranslations('common');
  const { customerName, companyName } = useContextStore();

  return (
    <Box className={CustomerDataContainer} data-testid="customer-data-container">
      <CustomerDataItem
        Icon={PersonIcon}
        bgcolor={colors.customerDataBlue}
        label={t('customer')}
        value={customerName}
      />
      <CustomerDataItem
        Icon={BusinessCenterIcon}
        bgcolor={colors.customerDataPink}
        label={t('company')}
        value={companyName}
      />
    </Box>
  );
};

const MemoizedComponent = React.memo(CustomerData);

export { MemoizedComponent as CustomerData };
