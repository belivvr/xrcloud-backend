import { BaseEntity } from 'src/common'
import { Column, Entity } from 'typeorm'
import { LogDto } from '../dto/log.dto';


@Entity('room_logs')
export class RoomLogs extends BaseEntity {
    @Column()
    code: string;
    
    @Column()
    roomId: string;    

    @Column()
    sessionId: string;

    @Column()
    reticulumId: string;

    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    logTime: Date;
    
    @Column({ type: 'varchar', nullable: true })
    action: string | null;
    
    @Column({ type: 'varchar', nullable: true })
    ip?: string | null;

    @Column({ type: 'varchar', nullable: true })
    userAgent?: string | null;

    @Column({ type: 'varchar', nullable: true })
    device?: string | null;


    
    constructor(id: string, logDto: LogDto) {
        super();
        this.code = logDto?.code;
        this.roomId = id;
        this.sessionId = logDto?.sessionId;
        this.reticulumId = logDto?.reticulumId;
        this.logTime = logDto?.logTime ? new Date(logDto.logTime) : new Date();
        this.action = logDto?.action || null;
        this.ip = logDto?.ip;
        this.userAgent = logDto?.userAgent;
        this.device = logDto?.device;
    }
}
