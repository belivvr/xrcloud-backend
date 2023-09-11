import { Exclude } from 'class-transformer'
import { AggregateRoot } from 'src/common'
import { Column, Entity } from 'typeorm'

@Entity('admins')
export class Admin extends AggregateRoot {
    @Column()
    email: string

    @Column()
    name: string

    @Column()
    @Exclude()
    password: string

    @Column({ nullable: true })
    apiKey: string
}
