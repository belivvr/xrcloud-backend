import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateSubsTierDto {
    @IsOptional()
    @IsString()
    productCode: string

    @IsOptional()
    @IsString()
    priceCode: string

    @IsNotEmpty()
    @IsString()
    name: string

    @IsOptional()
    @IsString()
    currency?: string = 'KRW'

    @IsOptional()
    @IsString()
    price?: string = 'NONE'
}
