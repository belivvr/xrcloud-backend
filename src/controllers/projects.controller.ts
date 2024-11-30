import {
    BadRequestException,
    Body,
    ConflictException,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    Req,
    UploadedFiles,
    UseGuards,
    UseInterceptors,
    Logger,
    forwardRef
} from '@nestjs/common'
import { FileFieldsInterceptor } from '@nestjs/platform-express'
import { Assert, PublicApi } from 'src/common'
import { FAVICON, LOGO } from 'src/common/constants'
import { multerOptions } from 'src/middleware'
import { ClearService } from 'src/services/clear/clear.service'
import { UploadedFilesType } from 'src/services/manage-asset/types'
import { CreateProjectDto, ProjectsQueryDto, UpdateProjectDto } from 'src/services/projects/dto'
import { ProjectsService } from 'src/services/projects/projects.service'
import { HeaderAuthGuard, ProjectExistsGuard } from './guards'
import { UsersService } from 'src/services/users/users.service'
import { RoomsService } from 'src/services/rooms/rooms.service'

@Controller('api/projects')
@UseGuards(HeaderAuthGuard)
export class ProjectsController {
    constructor(
        private readonly projectsService: ProjectsService,
        private readonly usersService: UsersService,
        @Inject(forwardRef(() => ClearService))
        private readonly clearService: ClearService,
        private readonly roomsService: RoomsService
    ) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: FAVICON, maxCount: 1 },
                { name: LOGO, maxCount: 1 }
            ],
            {
                fileFilter: multerOptions.imageFilter
            }
        )
    )
    async createProject(
        @Body() createProjectDto: CreateProjectDto,
        @UploadedFiles() files: UploadedFilesType,
        @Req() req: any
    ) {
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

        if (createProjectDto.label) {
            const labelExists = await this.projectsService.findProjectByAdminIdAndLabel(
                req.user.adminId,
                createProjectDto.label
            )

            if (labelExists) {
                throw new ConflictException(`Project with label ${createProjectDto.label} already exists`)
            }
        }

        if (!files[FAVICON] || !files[LOGO]) {
            throw new BadRequestException('Files is required.')
        }

        return await this.projectsService.createProject(createProjectDto, files, req.user.adminId)
    }

    @Get()
    async findProjects(@Query() queryDto: ProjectsQueryDto, @Req() req: any) {
        Assert.defined(req.user, 'Admin authentication failed. req.user is null.')

        return await this.projectsService.findProjects(queryDto, req.user.adminId)
    }

    @Get(':projectId')
    @PublicApi()
    @UseGuards(ProjectExistsGuard)
    async getProject(@Param('projectId') projectId: string) {
        return await this.projectsService.getProjectDto(projectId)
    }

    // 사용자의 ID를 가져옿는 메소드
    @Get(':projectId/getIdFromUserId/:userId')
    @PublicApi()
    @UseGuards(ProjectExistsGuard)
    async getInfraUser(@Param('projectId') projectId: string, @Param('userId') userId: string) {
        let user =  await this.usersService.findUserByProjectIdAndInfraUserId(projectId, userId)
        Logger.log('user:',user);
        if (user && user.id) {
            Logger.log('User exists with ID:', user.id);
            return user;
        }        
        Logger.log('user is not exist:',user);
        let registerUser =  await this.roomsService.registerUser(projectId, userId);
        Logger.log('registerUser:',registerUser);
        return registerUser;
    }


    @Patch(':projectId')
    @UseGuards(ProjectExistsGuard)
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: FAVICON, maxCount: 1 },
                { name: LOGO, maxCount: 1 }
            ],
            {
                fileFilter: multerOptions.imageFilter
            }
        )
    )
    async updateProject(
        @Param('projectId') projectId: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @UploadedFiles() files: UploadedFilesType
    ) {
        return await this.projectsService.updateProject(projectId, updateProjectDto, files)
    }

    @Delete(':projectId')
    @UseGuards(ProjectExistsGuard)
    async removeProject(@Param('projectId') projectId: string) {
        return await this.clearService.clearProject(projectId)
    }
}
