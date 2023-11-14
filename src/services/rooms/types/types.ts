export enum RoomEntryType {
    private = 'private',
    public = 'public'
}

export type RoomUrl = {
    host: string
    guest: string
}

export enum RoomAccessType {
    Join = 'join',
    Exit = 'exit'
}
