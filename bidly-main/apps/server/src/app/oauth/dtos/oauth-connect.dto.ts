import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { OauthCreateDTO } from './oauth.create.dto';

export class OAuthConnectDTO {
  @ApiPropertyOptional({ type: String, required: false })
  @IsOptional()
  token?: string;

  @ApiProperty({ type: () => OauthCreateDTO, nullable: false })
  @IsNotEmpty()
  @Type(() => OauthCreateDTO)
  oAuth: OauthCreateDTO;

  constructor() {
    this.token = '';
    this.oAuth = new OauthCreateDTO();
  }
}
