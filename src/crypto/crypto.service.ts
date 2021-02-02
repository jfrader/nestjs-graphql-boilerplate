import { Injectable } from '@nestjs/common';
import { hash_sha256 } from './crypto.helper';

@Injectable()
export class CryptoService {
  async sha256(str: string): Promise<string> {
    return hash_sha256(str);
  }
}
