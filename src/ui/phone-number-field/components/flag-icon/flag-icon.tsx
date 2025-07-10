import { memo } from 'react';
import Image from 'next/image';

interface FlagIconProps {
  flagUrl: string;
  code: string;
}
const FlagIcon = ({ flagUrl, code }: FlagIconProps) => (
  <Image alt={`${code} flag`} height={12} src={flagUrl} width={18} />
);

const MemoizedComponent = memo(FlagIcon);

export { MemoizedComponent as FlagIcon };
