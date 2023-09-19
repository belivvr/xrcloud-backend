import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Assert, hashPassword, makeApikey, updateIntersection, validatePassword } from 'src/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, UpdateAdminDto, UpdatePasswordDto } from './dto'
import { Admin } from './entities'

@Injectable()
export class AdminsService {
    constructor(private readonly adminsRepository: AdminsRepository) {}

    async createAdmin(createAdminDto: CreateAdminDto) {
        const { password } = createAdminDto

        const hashedPassword = await hashPassword(password)

        const createAdmin = {
            ...createAdminDto,
            password: hashedPassword
        }

        return await this.adminsRepository.create(createAdmin)
    }

    async updatePassword(updatePasswordDto: UpdatePasswordDto, adminId: string) {
        const { oldPassword, newPassword } = updatePasswordDto

        const admin = await this.getAdmin(adminId)

        const validateAdmin = await this.validateAdmin(oldPassword, admin.password)

        if (!validateAdmin) {
            throw new UnauthorizedException('Invalid password.')
        }

        const hashedPassword = await hashPassword(newPassword)

        const updateAdmin = {
            password: hashedPassword
        }

        const updatedAdmin = updateIntersection(admin, updateAdmin)

        const savedAdmin = await this.adminsRepository.update(updatedAdmin)

        Assert.deepEquals(savedAdmin, updatedAdmin, 'The result is different from the update request')

        return savedAdmin
    }

    async generateApiKey(adminId: string) {
        const admin = await this.getAdmin(adminId)

        const apiKey = makeApikey()

        const updateAdmin = {
            apiKey: apiKey
        }

        const updatedScene = updateIntersection(admin, updateAdmin)

        return await this.adminsRepository.update(updatedScene)
    }

    // TODO
    async getAdmin(adminId: string, withPassword = false): Promise<Admin> {
        let admin

        if (withPassword) {
            admin = await this.adminsRepository.findByIdWithPassword(adminId)
        } else {
            admin = await this.adminsRepository.findById(adminId)
        }

        Assert.defined(admin, `Admin with ID "${adminId}" not found.`)

        return admin as Admin
    }

    async updateAdmin(adminId: string, updateAdminDto: UpdateAdminDto) {
        const admin = await this.getAdmin(adminId)

        const updateAdmin = {
            ...updateAdminDto
        }

        const updatedAdmin = updateIntersection(admin, updateAdmin)

        const savedAdmin = await this.adminsRepository.update(updatedAdmin)

        Assert.deepEquals(savedAdmin, updatedAdmin, 'The result is different from the update request')

        return savedAdmin
    }

    async removeAdmin(adminId: string) {
        const admin = await this.getAdmin(adminId)

        await this.adminsRepository.remove(admin)
    }

    async findAdminByEmail(email: string): Promise<Admin | null> {
        const admin = await this.adminsRepository.findByEmail(email)

        return admin
    }

    async findAdminByApiKey(apiKey: string): Promise<Admin | null> {
        const admin = await this.adminsRepository.findByApiKey(apiKey)

        return admin
    }

    async adminExists(adminId: string): Promise<boolean> {
        return this.adminsRepository.exist(adminId)
    }

    async emailExists(email: string): Promise<boolean> {
        return this.adminsRepository.emailExists(email)
    }

    async count() {
        return await this.adminsRepository.count()
    }

    async validateAdmin(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return validatePassword(plainPassword, hashedPassword)
    }

    async validateAdminExists(adminId: string) {
        const adminExists = await this.adminExists(adminId)

        if (!adminExists) {
            throw new NotFoundException(`Admin with ID "${adminId}" not found.`)
        }
    }
}
