import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsNotEmpty,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  midName?: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty()
  email: string;
  @ApiProperty()
  @Matches(/(2507[8,9,3,2])[0-9]{7}/, {
    message:
      'Phone number must be MTN or Airtel phone number formatted like 2507********',
  })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty()
  @MinLength(6)
  password: string;
}
