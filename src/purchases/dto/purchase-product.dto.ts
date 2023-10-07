import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class PurchaseListDto {
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PurchaseProductDto)
  products: PurchaseProductDto[];
}

export class PurchaseProductDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}
