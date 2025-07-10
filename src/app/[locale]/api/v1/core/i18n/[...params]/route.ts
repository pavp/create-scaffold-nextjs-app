import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

// localhost:3000/api/i18n/en/common
export async function GET(request: NextRequest) {
  const { pathname } = new URL(request.url);

  try {
    const slices = pathname.split('/').slice(1);
    const lng = slices[5];

    const ns = slices[slices.length - 1];
    const filePath = path.resolve('.', `public/server/${lng}/${ns}.json`);
    const content = fs.readFileSync(filePath, 'utf8');

    return NextResponse.json(JSON.parse(content), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
