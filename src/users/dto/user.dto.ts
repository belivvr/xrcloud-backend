import { User } from '../entities'

export class UserDto {
    id: string
    projectId: string

    constructor(user: User) {
        const { id, projectId } = user

        Object.assign(this, { id, projectId })
    }
}
