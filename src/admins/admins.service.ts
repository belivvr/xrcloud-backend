import { Injectable, NotFoundException } from '@nestjs/common'
import { hashPassword, validatePassword } from 'src/common'
import { RoomsService } from 'src/rooms'
import { ScenesService } from 'src/scenes'
import { AdminsRepository } from './admins.repository'
import { AdminCreateRoomDto, AdminGetModifySceneUrlDto, AdminUpdateRoomDto, CreateAdminDto } from './dto'
import { Admin } from './entities'

@Injectable()
export class AdminsService {
    constructor(
        private readonly adminsRepository: AdminsRepository,
        private readonly scenesService: ScenesService,
        private readonly roomsService: RoomsService
    ) {}

    async create(createAdminDto: CreateAdminDto) {
        const { password } = createAdminDto

        const hashedPassword = await hashPassword(password)

        const createAdmin = {
            ...createAdminDto,
            password: hashedPassword
        }

        return await this.adminsRepository.create(createAdmin)
    }

    // async getSceneCreationUrl(projectId: string) {
    //     const personalId = `admin@${projectId}`

    //     return await this.scenesService.getSceneCreationUrl({ personalId: personalId, projectId: projectId })
    // }

    // async getSceneModificationUrl(projectId: string, getModifySceneUrlDto: AdminGetModifySceneUrlDto) {
    //     const { sceneId } = getModifySceneUrlDto

    //     const personalId = `admin@${projectId}`

    //     return await this.scenesService.getSceneModificationUrl({
    //         projectId: projectId,
    //         personalId: personalId,
    //         sceneId: sceneId
    //     })
    // }

    // async createRoom(projectId: string, createRoomDto: AdminCreateRoomDto) {
    //     const { sceneId, ...data } = createRoomDto

    //     const personalId = `admin@${projectId}`

    //     const createRoomData = {
    //         personalId: personalId,
    //         sceneId: sceneId,
    //         ...data
    //     }

    //     return await this.roomsService.create(projectId, createRoomData)
    // }

    // async updateRoom(projectId: string, roomId: string, updateRoomDto: AdminUpdateRoomDto) {
    //     const { ...data } = updateRoomDto

    //     const personalId = `admin@${projectId}`

    //     const updateRoomData = {
    //         personalId: personalId,
    //         ...data
    //     }

    //     return await this.roomsService.update(projectId, roomId, updateRoomData)
    // }

    async getAdmin(adminId: string): Promise<Admin> {
        const admin = await this.adminsRepository.findById(adminId)

        if (!admin) {
            throw new NotFoundException(`Admin with ID "${adminId}" not found`)
        }

        return admin
    }

    async findAdminByEmail(email: string): Promise<Admin | null> {
        const admin = await this.adminsRepository.findByEmail(email)

        return admin
    }

    async adminExists(adminId: string): Promise<boolean> {
        return this.adminsRepository.exist(adminId)
    }

    async emailExists(email: string): Promise<boolean> {
        return this.adminsRepository.emailExists(email)
    }

    async validateAdmin(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return validatePassword(plainPassword, hashedPassword)
    }
}
