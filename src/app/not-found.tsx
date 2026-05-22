import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import { useTranslations } from 'next-intl';

import { ErrorView } from '@/core/components';

export const dynamic = 'force-dynamic';

export default function NotFound() {
  const t = useTranslations('common');

  return <ErrorView Icon={TravelExploreIcon} error={404} message={t('notFoundMessage')} subtitle={t('notFound')} />;
}
