import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import { AuthUtil } from '../auth/auth.util';
import { SmsService } from '../sms/sms.service';
import { VerifyCodeDTO } from './dtos/code.dto';
import { SendSMSDTO } from './dtos/send-SMS.dto';
import { SendSMSResponseDTO } from './dtos/send-SMS.response.dto';
import { ValidationService } from './validation.service';

@ApiTags('Validation')
@Controller({ path: 'validation' })
export class ValidationController {
  constructor(
    private readonly authUtil: AuthUtil,
    private readonly smsService: SmsService,
    private readonly validationService: ValidationService,
  ) {}

  @Post('send-sms-code')
  @ApiBody({
    type: SendSMSDTO,
  })
  @ApiOkResponse({
    type: SendSMSResponseDTO,
  })
  @ApiOperation({
    summary: 'send SMS code',
  })
  async sendCode(
    @Body() body: { contact: string },
  ): Promise<SendSMSResponseDTO> {
    const { contact } = body;
    const code = randomInt(100000, 999999);

    await this.smsService.send({
      body: `[${process.env['SERVICE_NAME']}] 인증번호 [${code}]를 입력해 주세요.`,
      receiver: contact,
    });

    const token = this.authUtil.createToken(
      {
        contact,
        code,
      },
      '3m',
    );

    return { token };
  }

  @Post('verify-code')
  @ApiBody({
    type: VerifyCodeDTO,
  })
  @ApiOkResponse({
    type: Boolean,
  })
  @ApiOperation({
    summary: '연락처 인증 코드 확인',
  })
  async verifyCode(@Body() data: VerifyCodeDTO): Promise<boolean> {
    try {
      const { code } = data;
      const payload = this.authUtil.verifyToken<{
        contact: string;
        code: string;
      }>(data.token);

      return `${payload.code}` === `${code}`;
    } catch (e) {
      throw new BadRequestException('Invalid token or code');
    }
  }
}
