import { NextRequest, NextResponse } from 'next/server';

import { SettingsResponse } from '@/shared/settings/settings.types';

// localhost:3000/api/front-end-settings
export async function GET(_request: NextRequest) {
  const settings: SettingsResponse = {
    mixPanelKey: 'mixPanelKey',
    screeb_website_id: 'screeb_website_id',
    muiKey: '',
  };

  return NextResponse.json(settings);
}
