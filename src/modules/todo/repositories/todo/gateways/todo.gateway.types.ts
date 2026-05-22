import type { CreateTodoRequest, ErrorType, Todo, TodoFilters, UpdateTodoRequest } from '@/modules/todo/todo.types';
import type { BaseGateway, GatewayOptions } from '@/types/gateway.types';

// Todo-specific gateway interface extending the base gateway
export interface TodoGateway extends BaseGateway {
  findAll(filters?: TodoFilters, options?: GatewayOptions): Promise<Todo[]>;
  findById(id: string | number, options?: GatewayOptions): Promise<Todo>;
  create(todo: CreateTodoRequest, options?: GatewayOptions): Promise<Todo>;
  update(id: string | number, todo: UpdateTodoRequest, options?: GatewayOptions): Promise<Todo>;
  delete(id: string | number, options?: GatewayOptions): Promise<void>;
  testError(type: ErrorType, options?: GatewayOptions): Promise<any>;
}
