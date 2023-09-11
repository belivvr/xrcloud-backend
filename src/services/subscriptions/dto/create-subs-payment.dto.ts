import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateSubsPaymentDto {
    @IsNotEmpty()
    @IsNumber()
    subsTierId: number

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
