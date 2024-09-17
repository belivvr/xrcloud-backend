import { Injectable } from '@nestjs/common'
import { SafeConfigService } from 'src/common'

@Injectable()
export class SteppayConfigService {
    public readonly steppayPaymentKey: string
    public readonly steppaySecretKey: string
    public readonly steppayApiUrl: string

    constructor(config: SafeConfigService) {
        // Steppay 서비스는 나중에 다시 검토
     //   this.steppayPaymentKey = config.getString('STEPPAY_PAYMENT_KEY')
     //   this.steppaySecretKey = config.getString('STEPPAY_SECRET_KEY')
     //   this.steppayApiUrl = config.getString('STEPPAY_API_URL')
    }
}
