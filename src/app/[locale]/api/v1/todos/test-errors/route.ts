import { NextRequest, NextResponse } from 'next/server';

import type { BackendError } from '@/api/api.types';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const errorType = searchParams.get('type') || 'generic';

  // Special case for zod-response: return successful response without required field
  if (errorType === 'zod-response') {
    return NextResponse.json(
      {
        id: 1,
        title: 'Test Todo',
        description: 'This response is missing requiredNewField',
        completed: false,
        priority: 'medium',
        dueDate: '2024-01-01',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        // Missing requiredNewField - this will cause validation to fail on client
      },
      { status: 200 },
    );
  }

  const errors: Record<string, { status: number; error: BackendError }> = {
    validation: {
      status: 400,
      error: {
        message: 'common.validation.requiredField',
        translate: true,
        statusCode: '400',
        title: 'Validation Error',
        translationParams: { field: 'email' },
      },
    },
    'zod-request': {
      status: 400,
      error: {
        message: 'Request validation failed with Zod schema',
        translate: false,
        statusCode: '400',
        title: 'Zod Request Validation Error',
        translationParams: {
          errors: 'title - Required, priority - Invalid enum value, dueDate - Expected string, received number',
        },
      },
    },
    unauthorized: {
      status: 401,
      error: {
        message: 'common.auth.unauthorized',
        translate: true,
        statusCode: '401',
        title: 'Unauthorized',
      },
    },
    forbidden: {
      status: 403,
      error: {
        message: 'common.auth.forbidden',
        translate: true,
        statusCode: '403',
        title: 'Access Forbidden',
      },
    },
    notfound: {
      status: 404,
      error: {
        message: 'common.errors.notFound',
        translate: true,
        statusCode: '404',
        title: 'Not Found',
      },
    },
    server: {
      status: 500,
      error: {
        message: 'Internal server error occurred',
        statusCode: '500',
        title: 'Server Error',
      },
    },
    network: {
      status: 503,
      error: {
        message: 'Service temporarily unavailable',
        statusCode: '503',
        title: 'Service Unavailable',
      },
    },
    generic: {
      status: 400,
      error: {
        message: 'Something went wrong',
        statusCode: '400',
        title: 'Error',
      },
    },
  };

  const selectedError = errors[errorType] || errors.generic;

  return NextResponse.json(selectedError.error, {
    status: selectedError.status,
  });
}

export async function POST(_request: NextRequest) {
  // Always return validation error for zod-request testing
  // The actual validation should happen on client side before reaching here
  const backendError: BackendError = {
    message: 'Request validation failed with Zod schema',
    translate: false,
    statusCode: '400',
    title: 'Zod Request Validation Error',
    translationParams: {
      errors: 'title - Required, priority - Invalid enum value, dueDate - Expected string, received number',
    },
  };

  return NextResponse.json(backendError, { status: 400 });
}
