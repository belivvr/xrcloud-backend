export type OptionValue = {
    token?: string
    faviconUrl: string
    logoUrl: string
    returnUrl: string
    funcs?: funcs
}

export enum OptionRole {
    Host = 'host',
    Guest = 'guest'
}

type funcs = {
    'object-button': boolean
    'invitation-button': boolean
    'place-button': boolean
    'camera-button': boolean
    'left-button': boolean
    'more-button': boolean
}
