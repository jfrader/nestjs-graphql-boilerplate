import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class CryptoService {
  async sha256(str: string): Promise<string> {
    return crypto.createHash('sha256').update(str).digest('base64');
  }
}
