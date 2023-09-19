import { IsEnum, IsNotEmpty } from 'class-validator'
import { RoomOptionType } from '../types'

export class OptionQueryDto {
    @IsNotEmpty()
    @IsEnum(RoomOptionType)
    type: string
}
