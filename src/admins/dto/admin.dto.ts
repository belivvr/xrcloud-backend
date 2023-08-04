import { Admin } from '../entities'

export class AdminDto {
    id: string
    email: string
    apiKey: string

    constructor(admin: Admin) {
        const { id, email, apiKey } = admin

        Object.assign(this, { id, email, apiKey })
    }
}
