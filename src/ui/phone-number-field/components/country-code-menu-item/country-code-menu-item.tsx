import { memo } from 'react';

import { Box } from '@/ui';

import { FlagIcon } from '../flag-icon/flag-icon';

import styles from './styles.module.scss';

const { container, textContainer } = styles;

export interface CountryCodeMenuItemProps {
  code: string;
  name: string;
  phoneCode: string;
  flagUrl: string;
}

const CountryCodeMenuItem = ({ code, flagUrl, phoneCode, name }: CountryCodeMenuItemProps) => {
  return (
    <Box className={container}>
      <FlagIcon code={code} flagUrl={flagUrl} />
      <Box className={textContainer}>{phoneCode}</Box>
      <Box className={textContainer}>{name}</Box>
    </Box>
  );
};

const MemoizedComponent = memo(CountryCodeMenuItem);

export { MemoizedComponent as CountryCodeMenuItem };
