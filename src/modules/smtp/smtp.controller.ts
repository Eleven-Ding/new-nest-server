import { SmtpService } from './smtp.service';
import { Body, Controller, Post } from '@nestjs/common';
import { SendCodeDto } from './dto/sendCode.dto';

@Controller('smtp')
export class SmtpController {
  constructor(private smtpService: SmtpService) {}

  @Post('/sendCode')
  sendCode(@Body() body: SendCodeDto) {
    return this.smtpService.sendCode(body);
  }
}
