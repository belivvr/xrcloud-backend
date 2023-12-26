export type OptionValue = {
    token?: string
    faviconUrl: string
    logoUrl: string
    returnUrl: string
    funcs?: Funcs
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
