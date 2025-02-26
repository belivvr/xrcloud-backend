import { HttpStatus } from '@nestjs/common'
import { TestingModule } from '@nestjs/testing'
import { createHttpTestModule } from 'src/common/test'
import { TestModule } from './filter.fixture'

describe('BaseRepository', () => {
    let module: TestingModule
    let request: any

    beforeEach(async () => {
        const sut = await createHttpTestModule({
            imports: [TestModule]
        })

        module = sut.module
        request = sut.request

        sut.app.useLogger(false)
    })

    afterEach(async () => {
        if (module) await module.close()
    })

    it('ErrorFilter', async () => {
        const res = await request.get({
            url: '/error'
        })

        expect(res.status).toEqual(HttpStatus.INTERNAL_SERVER_ERROR)
    })

    it('HttpExceptionFilter', async () => {
        const res = await request.get({
            url: '/http-exception'
        })

        expect(res.status).toEqual(HttpStatus.BAD_REQUEST)
    })
})
