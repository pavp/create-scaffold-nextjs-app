import { encryptString } from './encrypt-string.helper';

describe('encryptString', () => {
  it('should encrypt string using sha1', () => {
    const text = 'hello world';
    const expectedHash = '2aae6c35c94fcfb415dbe95f408b9ce91ee846ed';

    const result = encryptString(text);

    expect(result).toEqual(expectedHash);
  });
});
