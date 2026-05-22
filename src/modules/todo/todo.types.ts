import { z } from 'zod';

// === ZOD SCHEMAS (SOURCE OF TRUTH) ===

// Todo priority enum schema
export const TodoPrioritySchema = z.enum(['low', 'medium', 'high']);

// Base Todo schema
export const TodoSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'common.validation.requiredField'),
  description: z.string().optional(),
  completed: z.boolean().default(false),
  priority: TodoPrioritySchema.default('medium'),
  dueDate: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

// Derived schemas
export const CreateTodoSchema = TodoSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completed: true, // Remove completed from required, will be set by server
}).extend({
  completed: z.boolean().optional(),
  priority: TodoPrioritySchema.optional(), // Make priority optional for creation
});

export const UpdateTodoSchema = CreateTodoSchema.extend({
  completed: z.boolean().optional(),
}).partial();

export const TodoFiltersSchema = z
  .object({
    completed: z.union([z.boolean(), z.string().transform((val) => val === 'true')]).optional(),
    priority: TodoPrioritySchema.optional().catch(undefined), // Ignore invalid priority values
    search: z.string().optional(),
    dueBefore: z.string().optional(),
    dueAfter: z.string().optional(),
    // From BaseFilters - handle string to number conversion for query params
    page: z.union([z.number().int().positive(), z.string().transform((val) => parseInt(val, 10))]).optional(),
    limit: z.union([z.number().int().positive(), z.string().transform((val) => parseInt(val, 10))]).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
  })
  .loose(); // Allow additional properties to pass through

export const TodoArraySchema = z.array(TodoSchema);

// === TYPES (INFERRED FROM SCHEMAS) ===

// Primary types - inferred from Zod schemas (these replace manual interfaces)
export type Todo = z.infer<typeof TodoSchema>;

export type CreateTodoRequest = z.infer<typeof CreateTodoSchema>;

export type UpdateTodoRequest = z.infer<typeof UpdateTodoSchema>;

export type TodoFilters = z.infer<typeof TodoFiltersSchema>;

export type TodoPriority = z.infer<typeof TodoPrioritySchema>;

// === ERROR TEST TYPES ===

export const ERROR_TYPES = [
  { type: 'validation', label: 'Validation', color: 'warning' as const },
  { type: 'zod-request', label: 'Zod Request', color: 'warning' as const },
  { type: 'zod-response', label: 'Zod Response', color: 'warning' as const },
  { type: 'unauthorized', label: 'Unauthorized (401)', color: 'error' as const },
  { type: 'forbidden', label: 'Forbidden (403)', color: 'error' as const },
  { type: 'notfound', label: 'Not Found (404)', color: 'secondary' as const },
  { type: 'server', label: 'Server Error (500)', color: 'error' as const },
  { type: 'network', label: 'Network (503)', color: 'info' as const },
  { type: 'generic', label: 'Generic Error', color: 'primary' as const },
] as const;

export type ErrorType = (typeof ERROR_TYPES)[number]['type'];
