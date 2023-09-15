import { IsNotEmpty, IsString } from 'class-validator'

export class CreatePaymentDto {
    @IsNotEmpty()
    @IsString()
    tierId: string

    @IsNotEmpty()
    @IsString()
    successUrl: string

    @IsNotEmpty()
    @IsString()
    errorUrl: string

    @IsNotEmpty()
    @IsString()
    cancelUrl: string
}
