import sha1 from 'crypto-js/sha1';

export const encryptString = (text: string): string => {
  const encrypted = sha1(text).toString();

  return encrypted;
};
