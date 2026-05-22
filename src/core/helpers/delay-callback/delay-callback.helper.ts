export const delayCallback = (ms: number, callback: () => void): Promise<void> => {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve(callback());
    }, ms),
  );
};
