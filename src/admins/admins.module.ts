import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AdminsController } from './admins.controller'
import { AdminsRepository } from './admins.repository'
import { AdminsService } from './admins.service'
import { Admin } from './entities'

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    controllers: [AdminsController],
    providers: [AdminsService, AdminsRepository],
    exports: [AdminsService]
})
export class AdminsModule {}
