export interface FileType {
    type: 'favicon' | 'logo'
    extension: 'ico' | 'jpg'
}

export const FILE_TYPES: Map<string, FileType> = new Map([
    ['favicon', { type: 'favicon', extension: 'ico' }],
    ['logo', { type: 'logo', extension: 'jpg' }]
])
