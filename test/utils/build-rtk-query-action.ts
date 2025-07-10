import { faker } from '@faker-js/faker';
import { QueryStatus } from '@reduxjs/toolkit/query';

interface BuildRtkQueryActionProps {
  endpointName: string;
  queryType: keyof typeof QueryStatus;
  payload?: Record<string, any>;
  type?: 'query' | 'mutation';
}

export const buildRtkQueryAction = ({ endpointName, queryType, payload, type = 'query' }: BuildRtkQueryActionProps) => {
  return {
    type: `api/executeQuery/${queryType}`,
    payload,
    meta: {
      startedTimeStamp: faker.date.recent().getTime(),
      RTK_autoBatch: true,
      arg: {
        type,
        subscribe: true,
        subscriptionOptions: {},
        endpointName,
        queryCacheKey: `${endpointName}(${JSON.stringify(payload)})`,
      },
      requestId: faker.string.uuid(),
      requestStatus: queryType,
    },
  };
};
