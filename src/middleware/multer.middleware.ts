import { BadRequestException } from '@nestjs/common'
import { extname } from 'path'

export const multerOptions = {
    // eslint-disable-next-line @typescript-eslint/ban-types
    imageFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
        const ext = extname(file.originalname).toLowerCase()

        if (!['.ico', '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'].includes(ext)) {
            return cb(new BadRequestException('Only image files are allowed'), false)
        }

        cb(null, true)
    }
}
