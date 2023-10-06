import {
  IsNotEmpty,
  IsString,
  IsOptional,
  Length,
  IsStrongPassword,
} from 'class-validator';

export class RegisterAdminDto {
  @IsNotEmpty()
  @IsString()
  @Length(7)
  readonly username: string;

  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  readonly role?: string;
}
