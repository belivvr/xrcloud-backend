export enum RoomEntryType {
    Private = 'private',
    Public = 'public'
}

export type RoomUrl = {
    public: {
        host: string
        guest: string
    }
    private: {
        host: string
        guest: string
    }
}

export enum RoomAccessType {
    Join = 'join',
    Exit = 'exit'
}
