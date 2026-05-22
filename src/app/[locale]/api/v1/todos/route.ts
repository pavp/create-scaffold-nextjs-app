import { NextRequest, NextResponse } from 'next/server';

import type { BackendError } from '@/api/api.types';
import { createApiResponse, createErrorResponse } from '@/api/helpers';

// In-memory storage for development/testing
const todos = [
  {
    id: 1,
    title: 'Learn React Query',
    description: 'Understand how to use React Query for server state management',
    completed: false,
    priority: 'high' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Implement Zustand',
    description: 'Set up Zustand for client state management',
    completed: true,
    priority: 'medium' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Create Todo Module',
    description: 'Build the todo module with the new architecture',
    completed: false,
    priority: 'high' as const,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let nextId = 4;

// GET /api/todos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters for filtering
    const completed = searchParams.get('completed');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    let filteredTodos = [...todos];

    // Apply filters
    if (completed !== null) {
      filteredTodos = filteredTodos.filter((todo) => todo.completed === (completed === 'true'));
    }

    if (priority) {
      filteredTodos = filteredTodos.filter((todo) => todo.priority === priority);
    }

    if (search) {
      const searchLower = search.toLowerCase();

      filteredTodos = filteredTodos.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) || todo.description?.toLowerCase().includes(searchLower),
      );
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json(createApiResponse(filteredTodos, 'Todos retrieved successfully'));
  } catch {
    const backendError: BackendError = createErrorResponse({
      message: 'Failed to fetch todos',
      status: 500,
      translate: false,
    });

    return NextResponse.json(backendError, { status: 500 });
  }
}

// POST /api/todos
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title) {
      const validationError: BackendError = createErrorResponse({
        message: 'common.validation.requiredField',
        status: 400,
        translate: true,
        translationParams: { field: 'title' },
      });

      return NextResponse.json(validationError, { status: 400 });
    }

    const newTodo = {
      id: nextId++,
      title: body.title,
      description: body.description || '',
      completed: false,
      priority: body.priority || 'medium',
      dueDate: body.dueDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    todos.push(newTodo);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(createApiResponse(newTodo, 'Todo created successfully'), { status: 201 });
  } catch {
    const backendError: BackendError = createErrorResponse({
      message: 'Failed to create todo',
      status: 500,
      translate: false,
    });

    return NextResponse.json(backendError, { status: 500 });
  }
}
