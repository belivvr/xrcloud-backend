import { IsOptional, IsString } from 'class-validator'
import { PaginationOptions } from 'src/common'

export class ProjectsQueryDto extends PaginationOptions {
    @IsOptional()
    @IsString()
    label?: string
}
