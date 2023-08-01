import { Admin } from '../entities'

export class AdminDto {
    id: string
    email: string

    constructor(admin: Admin) {
        const { id, email } = admin

        Object.assign(this, { id, email })
    }
}
