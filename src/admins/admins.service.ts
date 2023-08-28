import { Injectable, NotFoundException } from '@nestjs/common'
import { hashPassword, makeApikey, updateIntersection, validatePassword } from 'src/common'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto } from './dto'
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

    async generateApiKey(adminId: string) {
        const admin = await this.getAdmin(adminId)

        const apiKey = makeApikey()

        const updateAdmin = {
            apiKey: apiKey
        }

        const updatedScene = updateIntersection(admin, updateAdmin)

        return await this.adminsRepository.update(updatedScene)
    }

    async getAdmin(adminId: string): Promise<Admin> {
        const admin = await this.adminsRepository.findById(adminId)

        if (!admin) {
            throw new NotFoundException(`Admin with ID "${adminId}" not found.`)
        }

        return admin
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
        const count = await this.adminsRepository.count()

        return count
    }

    async validateAdmin(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return validatePassword(plainPassword, hashedPassword)
    }
}
