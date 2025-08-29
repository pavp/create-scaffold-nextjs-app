import { DataSource } from '@/types/gateway.types';

import { createHttpTodoGateway } from './http-gateway/http-gateway';
import { createLocalStorageTodoGateway } from './local-storage-gateway/local-storage-gateway';
import type { TodoGateway } from './todo.gateway.types';

/**
 * Gateway Factory Function
 * Creates appropriate gateway based on data source type
 * Now uses clean architecture API layer
 */
export const createTodoGateway = (source: DataSource = 'http'): TodoGateway => {
  switch (source) {
    case 'http':
      return createHttpTodoGateway();
    case 'localStorage':
      return createLocalStorageTodoGateway();
    default:
      return createHttpTodoGateway();
  }
};

// Export types and individual gateway creators
export { createHttpTodoGateway } from './http-gateway/http-gateway';
export { createLocalStorageTodoGateway } from './local-storage-gateway/local-storage-gateway';
export type { TodoGateway } from './todo.gateway.types';
