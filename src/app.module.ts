import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CryptographyModule } from './cryptography/cryptography.module';
import { CryptographyService } from './cryptography/cryptography.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [CryptographyModule, SharedModule],
  controllers: [AppController],
  providers: [CryptographyService],
})
export class AppModule { }
