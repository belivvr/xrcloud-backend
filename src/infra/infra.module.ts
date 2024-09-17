import { Module } from '@nestjs/common'
import { EmailConfigService } from './email/email-config.service'
import { EmailService } from './email/email.service'

//2024년 9월 17일 oss부분을 제거하여 임시 삭제, azure oss를 사용하는 경우, 다시 사용 필요성 검토
//import { FileStorageConfigService } from './file-storage/file-storage-config.service'
//import { FileStorageService } from './file-storage/file-storage.service'
import { ReticulumConfigService } from './reticulum/reticulum-config.service'
import { ReticulumService } from './reticulum/reticulum.service'
import { SteppayConfigService } from './steppay/steppay-config.service'
import { SteppayService } from './steppay/steppay.service'

@Module({
    providers: [
        EmailService,
        EmailConfigService,
  //      FileStorageService,
  //      FileStorageConfigService,
        ReticulumService,
        ReticulumConfigService,
        SteppayService,
        SteppayConfigService
    ],
 //   exports: [EmailService, FileStorageService, ReticulumService, SteppayService]
    exports: [EmailService, ReticulumService, SteppayService]
})
export class InfraModule {}
