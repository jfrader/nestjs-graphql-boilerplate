import { Module } from '@nestjs/common';
import { CryptoService } from './crypto.service';

@Module({
  providers: [CryptoService],
  imports: [CryptoService],
  exports: [CryptoService],
})
export class CryptoModule {}
