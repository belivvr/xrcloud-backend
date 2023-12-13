import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common'
import {
    Assert,
    CacheService,
    convertTimeToSeconds,
    hashPassword,
    makeApikey,
    updateIntersection,
    validatePassword
} from 'src/common'
import { EmailService } from 'src/infra/email/email.service'
import { AdminConfigService } from './admin-config.service'
import { AdminsRepository } from './admins.repository'
import {
    AdminDto,
    CreateAdminDto,
    FindPasswordDto,
    ResetPasswordDto,
    UpdateAdminDto,
    UpdatePasswordDto
} from './dto'
import { Admin } from './entities'

@Injectable()
export class AdminsService {
    constructor(
        private readonly adminsRepository: AdminsRepository,
        private readonly configService: AdminConfigService,
        private readonly emailService: EmailService,
        private readonly cacheService: CacheService
    ) {}

    async createAdmin(createAdminDto: CreateAdminDto) {
        const { password } = createAdminDto

        const hashedPassword = await hashPassword(password)

        const createAdmin = {
            ...createAdminDto,
            password: hashedPassword
        }

        const admin = await this.adminsRepository.create(createAdmin)

        return new AdminDto(admin)
    }

    async updatePassword(adminId: string, updatePasswordDto: UpdatePasswordDto) {
        const { oldPassword, newPassword } = updatePasswordDto

        const admin = await this.getAdmin(adminId)

        const validateAdmin = await this.validateAdmin(oldPassword, admin.password)

        if (!validateAdmin) {
            throw new UnauthorizedException('Invalid password.')
        }

        if (oldPassword === newPassword) {
            throw new BadRequestException('New password must be different from the old password.')
        }

        const hashedPassword = await hashPassword(newPassword)

        const updateAdmin = {
            password: hashedPassword
        }

        const updatedAdmin = updateIntersection(admin, updateAdmin)

        const savedAdmin = await this.adminsRepository.update(updatedAdmin)

        Assert.deepEquals(savedAdmin, updatedAdmin, 'The result is different from the update request')

        return new AdminDto(savedAdmin)
    }

    async generateApiKey(adminId: string) {
        const admin = await this.getAdmin(adminId)

        const apiKey = makeApikey()

        const updateAdmin = {
            apiKey: apiKey
        }

        const updatedAdmin = updateIntersection(admin, updateAdmin)

        const savedAdmin = await this.adminsRepository.update(updatedAdmin)

        Assert.deepEquals(savedAdmin, updatedAdmin, 'The result is different from the update request')

        return new AdminDto(savedAdmin)
    }

    async findPassword(findPasswordDto: FindPasswordDto) {
        const { email } = findPasswordDto

        const admin = await this.findAdminByEmail(email)

        if (!admin) {
            throw new NotFoundException(`User with email ${email} not found.`)
        }

        const code = Math.floor(1000 + Math.random() * 9000).toString()

        const expireTime = convertTimeToSeconds(this.configService.findPasswordCodeExpiration)

        await this.cacheService.set(`findPassword:${email}`, code, expireTime)

        const createEmailData = { code }

        await this.emailService.sendEmailWithTemplate(
            email,
            this.configService.findPasswordTemplateId,
            createEmailData
        )
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { code, email, password } = resetPasswordDto

        const admin = await this.findAdminByEmail(email)

        if (!admin) {
            throw new NotFoundException(`User with email ${email} not found.`)
        }

        const savedCode = await this.cacheService.get(`findPassword:${email}`)

        if (!savedCode || savedCode !== code) {
            throw new ForbiddenException('Invalid verification code.')
        }

        const hashedPassword = await hashPassword(password)

        const updateAdmin = {
            password: hashedPassword
        }

        const updatedAdmin = updateIntersection(admin, updateAdmin)

        const savedAdmin = await this.adminsRepository.update(updatedAdmin)

        Assert.deepEquals(savedAdmin, updatedAdmin, 'The result is different from the update request')

        return new AdminDto(savedAdmin)
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

    async countAdmins() {
        return await this.adminsRepository.count()
    }

    async validateAdmin(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return validatePassword(plainPassword, hashedPassword)
    }
}
