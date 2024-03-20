import * as fs from 'fs/promises'
import { serverOptions } from './options'
import { Path } from './path'

export class FileStorage {
    private static readonly uploadDir = '/app/storage'

    static async save(fileBuffer: Buffer, key: string | undefined): Promise<string> {
        if (!key) {
            throw new Error('Key for uploading files is required.')
        }

        try {
            const filePath = Path.join(this.uploadDir, key)

            await fs.mkdir(Path.dirname(filePath), { recursive: true })
            await fs.writeFile(filePath, fileBuffer)

            const fileUrl = `${serverOptions.host}/storage/${key}`

            return fileUrl
        } catch (error) {
            throw new Error(`Failed to save file: ${error.message}`)
        }
    }

    static getFileUrl(fileId: string, fileType: string) {
        const prePath = fileId.slice(0, 3)

        return `${serverOptions.host}/storage/${fileType}/${prePath}/${fileId}`
    }

    static async remove(key: string): Promise<void> {
        try {
            const filePath = Path.join(this.uploadDir, key)

            await fs.unlink(filePath)
        } catch (error) {
            throw new Error(`Failed to delete file: ${error.message}`)
        }
    }
}
