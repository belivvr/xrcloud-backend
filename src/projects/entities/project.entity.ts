import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('projects')
export class Project extends AggregateRoot {
    @Column()
    name: string

    @Column({ nullable: true })
    projectKey: string

    @Column()
    faviconId: string

    @Column()
    logoId: string

    @Column()
    adminId: string
}
