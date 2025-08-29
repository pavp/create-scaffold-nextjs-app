import { NextRequest, NextResponse } from 'next/server';

import type { BackendError } from '@/api/api.types';
import { createApiResponse, createErrorResponse } from '@/api/helpers';

// This would normally come from a database
// Using a simple in-memory array for demo purposes
// Note: This won't persist across server restarts
const getTodos = () => {
  // In a real app, this would be fetched from a database
  // For now, we'll simulate it with the same data
  return [
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
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};

// GET /api/todos/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const todos = getTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      const notFoundError: BackendError = createErrorResponse({
        message: 'common.errors.notFound',
        status: 404,
        translate: true,
        translationParams: { resource: 'Todo' },
      });

      return NextResponse.json(notFoundError, { status: 404 });
    }

    // Simulate loading delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(createApiResponse(todo, 'Todo retrieved successfully'));
  } catch {
    const backendError: BackendError = createErrorResponse({
      message: 'Failed to fetch todo',
      status: 500,
      translate: false,
    });

    return NextResponse.json(backendError, { status: 500 });
  }
}

// PUT /api/todos/[id]
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const todos = getTodos();

    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      const notFoundError: BackendError = createErrorResponse({
        message: 'common.errors.notFound',
        status: 404,
        translate: true,
        translationParams: { resource: 'Todo' },
      });

      return NextResponse.json(notFoundError, { status: 404 });
    }

    // Update todo
    const updatedTodo = {
      ...todos[todoIndex],
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
    };

    todos[todoIndex] = updatedTodo;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    return NextResponse.json(createApiResponse(updatedTodo, 'Todo updated successfully'));
  } catch {
    const backendError: BackendError = createErrorResponse({
      message: 'Failed to update todo',
      status: 500,
      translate: false,
    });

    return NextResponse.json(backendError, { status: 500 });
  }
}

// DELETE /api/todos/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    const todos = getTodos();

    const todoIndex = todos.findIndex((t) => t.id === id);

    if (todoIndex === -1) {
      const notFoundError: BackendError = createErrorResponse({
        message: 'common.errors.notFound',
        status: 404,
        translate: true,
        translationParams: { resource: 'Todo' },
      });

      return NextResponse.json(notFoundError, { status: 404 });
    }

    // Remove todo
    todos.splice(todoIndex, 1);

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 200));

    return NextResponse.json(createApiResponse(null, 'Todo deleted successfully'));
  } catch {
    const backendError: BackendError = createErrorResponse({
      message: 'Failed to delete todo',
      status: 500,
      translate: false,
    });

    return NextResponse.json(backendError, { status: 500 });
  }
}
