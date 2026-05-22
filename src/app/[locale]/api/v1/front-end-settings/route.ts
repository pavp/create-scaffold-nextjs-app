import { NextRequest, NextResponse } from 'next/server';

import { SettingsResponse } from '@/shared/settings/settings.types';

export async function GET(_request: NextRequest) {
  const settings: SettingsResponse = {
    muiKey: '',
  };

  return NextResponse.json(settings);
}
