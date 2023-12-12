/* eslint-disable @typescript-eslint/ban-types */
import { BadRequestException } from '@nestjs/common'
import { extname } from 'path'

export const multerOptions = {
    imageFilter: (req: Express.Request, file: Express.Multer.File, callback: Function) => {
        const ext = extname(file.originalname).toLowerCase()

        if (!['.ico', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'].includes(ext)) {
            return callback(new BadRequestException('Only image files are allowed'), false)
        }

        callback(null, true)
    },
    assetFilter: (req: Request, file: Express.Multer.File, callback: Function) => {
        if (!file) {
            return callback(new BadRequestException('File is invalid or not present.'), false)
        }

        const customMimeType = getCustomMimeType(file.originalname, file.mimetype)

        if (customMimeType) {
            file.mimetype = customMimeType
        }

        const forbiddenTypes = [
            'text/html',
            'text/javascript',
            'application/javascript',
            'application/x-javascript',
            'application/xhtml+xml'
        ]

        if (forbiddenTypes.includes(file.mimetype)) {
            return callback(new BadRequestException('Forbidden file type.'), false)
        }

        const allowTypes = [
            '.mp3',
            'audio/mpeg',
            '.mp4',
            'video/mp4',
            '.png',
            '.jpeg',
            '.jpg',
            '.gif',
            'image/png',
            'image/jpeg',
            'image/gif',
            '.glb',
            'model/gltf-binary'
        ]

        const matchesFileTypes = (file: Express.Multer.File, fileTypes: string[]) => {
            for (const pattern of fileTypes) {
                if (pattern.startsWith('.')) {
                    if (file.originalname.toLowerCase().endsWith(pattern)) {
                        return true
                    }
                } else if (file.mimetype.startsWith(pattern)) {
                    return true
                }
            }
            return false
        }

        if (!matchesFileTypes(file, allowTypes)) {
            return callback(
                new BadRequestException(
                    `"${
                        file.originalname
                    }" does not match the following mime types or extensions: ${allowTypes.join(', ')}`
                ),
                false
            )
        }

        callback(null, true)
    }
}

function getCustomMimeType(filename: string, mimetype: string): string | null {
    const ext = extname(filename).toLowerCase()

    if (ext === '.glb' && mimetype === 'application/octet-stream') {
        return 'model/gltf-binary'
    }

    return null
}
