import { IsNumber, ArrayNotEmpty } from 'class-validator';

export class CreatePurchaseDto {
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  readonly productIds: number[];
}
