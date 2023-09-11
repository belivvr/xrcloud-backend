import { Admin } from '../entities'

export class AdminDto {
    id: string
    email: string
    name: string
    apiKey: string

    constructor(admin: Admin) {
        const { id, email, name, apiKey } = admin

        Object.assign(this, { id, email, name, apiKey })
    }
}
