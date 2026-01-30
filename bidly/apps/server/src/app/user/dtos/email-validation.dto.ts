import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailValidationDTO {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;
}

export class VerifyEmailDTO {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  token: string;
}
