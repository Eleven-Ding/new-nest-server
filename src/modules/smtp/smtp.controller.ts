import { SmtpService } from './smtp.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SendCodeDto } from './dto/sendCode.dto';
import { isPublic } from 'src/common/decorates/isPublic';

@Controller('smtp')
export class SmtpController {
  constructor(private smtpService: SmtpService) {}

  @Post('/sendCode')
  @isPublic()
  sendCode(@Body() body: SendCodeDto) {
    return this.smtpService.sendCode(body);
  }
}
