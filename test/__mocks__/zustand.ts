import { act } from '@testing-library/react';

const { create: actualCreate, createStore: actualCreateStore } = jest.requireActual('zustand');

// A variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

const createUncurried = (stateCreator: any) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

// When creating a store, we get its initial state, create a reset function and add it in the set
export const create = ((stateCreator: any) => {
  return typeof stateCreator === 'function' ? createUncurried(stateCreator) : createUncurried;
}) as typeof actualCreate;

const createStoreUncurried = (stateCreator: any) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getState();

  storeResetFns.add(() => {
    store.setState(initialState, true);
  });

  return store;
};

// When creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = ((stateCreator: any) => {
  return typeof stateCreator === 'function' ? createStoreUncurried(stateCreator) : createStoreUncurried;
}) as typeof actualCreateStore;

// Reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
