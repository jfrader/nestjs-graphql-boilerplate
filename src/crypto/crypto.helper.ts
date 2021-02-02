import * as crypto from 'crypto';

export const hash_sha256 = (str: string) =>
  crypto.createHash('sha256').update(str).digest('base64');
