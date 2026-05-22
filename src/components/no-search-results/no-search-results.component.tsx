import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useTranslations } from 'next-intl';

import { Box, Typography } from '@/ui';

import styles from './styles.module.scss';

const { noResultLabel, noResultContainer } = styles;

export const NoSearchResults = () => {
  const t = useTranslations('common');

  return (
    <Box className={noResultContainer} data-testid="no-results-container">
      <SearchOffIcon data-testid="search-off-icon" fontSize="large" />
      <Typography className={noResultLabel} data-testid="no-results-label">
        {t('noResultsFilter')}
      </Typography>
    </Box>
  );
};
