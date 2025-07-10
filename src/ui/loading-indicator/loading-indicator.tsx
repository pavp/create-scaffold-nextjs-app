import { memo } from 'react';
import { CircularProgress } from '@mui/material';

interface LoadingIndicatorProps {
  size?: string | number;
}

const LoadingIndicator = ({ size }: LoadingIndicatorProps) => {
  return <CircularProgress color="info" data-testid="circular-progress" size={size} />;
};

const MemoizedComponent = memo(LoadingIndicator) as typeof LoadingIndicator;

export { MemoizedComponent as LoadingIndicator };
