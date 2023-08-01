import { IsString } from 'class-validator'

export class QueryDto {
    @IsString()
    key: string
}
