import { delayCallback } from './delay-callback';

describe('delayCallback', () => {
  const delay = 1000;
  const callback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it('should delay execution of callback', async () => {
    const promise = delayCallback(delay, callback);

    jest.advanceTimersByTime(delay);

    await promise;

    expect(callback).toHaveBeenCalled();
  });

  it('should return a promise', () => {
    const promise = delayCallback(delay, callback);

    expect(promise).toBeInstanceOf(Promise);
  });

  it('should handle zero delay', async () => {
    const delay = 0;

    const promise = delayCallback(delay, callback);

    jest.advanceTimersByTime(delay);
    await promise;

    expect(callback).toHaveBeenCalled();
  });
});
