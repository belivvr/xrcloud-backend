import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common'
import { Assert, hashPassword, makeApikey, updateIntersection, validatePassword } from 'src/common'
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service'
import { AdminsRepository } from './admins.repository'
import { CreateAdminDto, UpdateAdminDto } from './dto'
import { Admin } from './entities'
import { CreateOrderAccountData } from './interfaces'
import { OrderAccountRepository } from './order-account.repository'

@Injectable()
export class AdminsService {
    constructor(
        private readonly adminsRepository: AdminsRepository,
        private readonly orderAccountRepository: OrderAccountRepository,
        @Inject(forwardRef(() => SubscriptionsService))
        private readonly subscriptionsService: SubscriptionsService
    ) {}

    async createAdmin(createAdminDto: CreateAdminDto) {
        const { password } = createAdminDto

        const hashedPassword = await hashPassword(password)

        const starterTierId = await this.subscriptionsService.getStarterTierId()

        const createAdmin = {
            ...createAdminDto,
            password: hashedPassword,
            subsTierId: starterTierId
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

    async createOrderAccount(createOrderAccountData: CreateOrderAccountData) {
        const createOrderAccount = {
            ...createOrderAccountData
        }

        return await this.orderAccountRepository.create(createOrderAccount)
    }

    async findOrderAccountByAdminId(adminId: string) {
        return await this.orderAccountRepository.findByAdminId(adminId)
    }

    async findOrderAccountByAccountId(accountId: number) {
        const orderAccount = await this.orderAccountRepository.findByAccountId(accountId)

        if (!orderAccount) {
            throw new NotFoundException(`OrderAccount with accountId "${accountId}" not found.`)
        }

        return orderAccount
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
