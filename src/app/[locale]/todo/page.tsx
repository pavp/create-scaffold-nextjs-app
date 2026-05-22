import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

import { getQueryClient } from '@/core/lib/react-query';
import { todoRepository } from '@/modules/todo/repositories/todo';
import { TodoManagementView } from '@/modules/todo/views';

export default async function TodoPage() {
  const queryClient = getQueryClient();

  // Prefetch todos data for SSR
  await todoRepository.queries.prefetch.prefetchTodos(queryClient);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TodoManagementView />
    </HydrationBoundary>
  );
}
