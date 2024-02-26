export type OptionValue = {
    role: OptionRole
    faviconUrl: string
    logoUrl: string
    returnUrl: string
    token?: string
    funcs?: Funcs
    linkPayload?: string
}

export enum OptionRole {
    Host = 'host',
    Guest = 'guest'
}

export type Funcs = {
    '3rd-view': boolean
    'share-screen': boolean
    'object-button': boolean
    'invitation-button': boolean
    'camera-button': boolean
    'left-button': boolean
}
