import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly category?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly price?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly quantity?: number;
}
