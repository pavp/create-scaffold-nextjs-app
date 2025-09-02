'use client';

import { memo } from 'react';
import { Settings } from '@mui/icons-material';

import tokens from '@/styles/tokens';
import type { DataSource } from '@/types/gateway.types';
import { Box, Card, CardContent, Chip, IconButton, Selector, Typography } from '@/ui';

interface DataSourceSwitcherProps {
  currentSource: DataSource;
  onSourceChange: (source: DataSource) => void;
  sourceInfo: {
    name: string;
    description: string;
    icon: string;
    online: boolean;
  };
  isLoading?: boolean;
}

export const DataSourceSwitcher = memo(
  ({ currentSource, onSourceChange, sourceInfo, isLoading = false }: DataSourceSwitcherProps) => {
    const dataSourceOptions = [
      { key: 'http', value: 'http', label: '🌐 HTTP API' },
      { key: 'localStorage', value: 'localStorage', label: '💾 Local Storage' },
    ];

    return (
      <Card sx={{ mb: tokens.spacing.scale4 }}>
        <CardContent>
          <Box alignItems="center" display="flex" gap={2} justifyContent="space-between">
            <Box alignItems="center" display="flex" gap={2}>
              <IconButton color="primary" size="small">
                <Settings />
              </IconButton>
              <Box>
                <Typography variant="subtitle2">
                  Data Source: {sourceInfo.icon} {sourceInfo.name}
                </Typography>
                <Typography color="text.secondary" variant="caption">
                  {sourceInfo.description}
                </Typography>
              </Box>
              <Chip
                color={sourceInfo.online ? 'success' : 'default'}
                label={sourceInfo.online ? 'Online' : 'Offline'}
                size="small"
              />
            </Box>

            <Box display="flex" gap={2}>
              <Selector
                defaultValues={[currentSource]}
                handleOnChange={(values) => onSourceChange(values[0] as DataSource)}
                list={dataSourceOptions}
                name="data-source-selector"
                placeholder="Select data source"
              />

              {isLoading && (
                <Typography color="text.secondary" variant="caption">
                  Switching...
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  },
);

DataSourceSwitcher.displayName = 'DataSourceSwitcher';
