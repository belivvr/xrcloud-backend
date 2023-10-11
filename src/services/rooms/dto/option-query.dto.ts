import { IsEnum, IsNotEmpty } from 'class-validator'
import { RoomEntryType } from '../types'

export class OptionQueryDto {
    @IsNotEmpty()
    @IsEnum(RoomEntryType)
    type: string
}
