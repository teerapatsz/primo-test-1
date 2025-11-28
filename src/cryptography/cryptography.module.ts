import { Module } from '@nestjs/common';
import { CryptographyService } from './cryptography.service';
import { SharedModule } from 'src/shared/shared.module';

@Module({
  imports: [
    SharedModule
  ],
  controllers: [],
  providers: [CryptographyService],
})
export class CryptographyModule { }
