import { KmsService } from './../kms/kms.service';
import { Module } from '@nestjs/common';
import { SmtpService } from './smtp.service';
import { SmtpController } from './smtp.controller';
import { KmsModule } from '../kms/kms.module';

@Module({
  imports: [KmsModule],
  providers: [SmtpService],
  controllers: [SmtpController],
})
export class SmtpModule {}
