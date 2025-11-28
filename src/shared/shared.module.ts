import { Module } from '@nestjs/common';
import { CryptoLogicService } from './crypto-logic/crypto-logic.service';

@Module({
  providers: [CryptoLogicService],
  exports: [CryptoLogicService]
})
export class SharedModule { }  
