import React from 'react';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import PersonIcon from '@mui/icons-material/Person';
import { useTranslations } from 'next-intl';

import colors from '@/styles/colors';
import { Box } from '@/ui';

import { CustomerDataItem } from './components/customer-data-item/customer-data-item.component';

import styles from './styles.module.scss';

const { CustomerDataContainer } = styles;

const CustomerData = () => {
  const t = useTranslations('common');
  // TODO: Replace with actual customer data from your project
  const customerName = 'Sample Customer';
  const companyName = 'Sample Company Ltd.';

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
