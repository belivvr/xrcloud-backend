import { Injectable, NotFoundException } from '@nestjs/common'
import { Assert, updateIntersection } from 'src/common'
import { RoomOption } from '../rooms/interfaces'
import { Option } from './entities'
import { OptionsRepository } from './options.repository'
import { Funcs, OptionRole } from './types'

@Injectable()
export class OptionsService {
    constructor(private readonly optionsRepository: OptionsRepository) {}

    async createOption(roomId: string, roomOption: RoomOption) {
        const funcs = this.generateFuncs()

        const optionValue = {
            ...roomOption,
            funcs
        }

        const [hostOption, guestOption] = await Promise.all([
            this.optionsRepository.create({
                role: OptionRole.Host,
                values: optionValue,
                roomId
            }),
            this.optionsRepository.create({
                role: OptionRole.Guest,
                values: optionValue,
                roomId
            })
        ])

        return {
            hostOptionId: hostOption.id,
            guestOptionId: guestOption.id
        }
    }

    async getOption(optionId: string) {
        const option = await this.optionsRepository.findById(optionId)

        if (!option) {
            return null
        }

        return option
    }

    async updateOption(roomId: string, optionValues: RoomOption) {
        const [hostOption, guestOption] = await Promise.all([
            this.findHostOptionByRoomId(roomId),
            this.findGuestOptionByRoomId(roomId)
        ])

        const funcs = this.generateFuncs()

        const hostOptionValue = {
            ...optionValues,
            funcs
        }

        const updateHostOption = {
            values: hostOptionValue
        }

        const updateGuestOption = {
            values: optionValues
        }

        const updatedHostOption = updateIntersection(hostOption, updateHostOption)

        const updatedGuestOption = updateIntersection(guestOption, updateGuestOption)

        const [savedHostOption, savedGuestOption] = await Promise.all([
            this.optionsRepository.update(updatedHostOption),
            this.optionsRepository.update(updatedGuestOption)
        ])

        Assert.deepEquals(
            savedHostOption,
            updatedHostOption,
            'The result is different from the update request'
        )

        Assert.deepEquals(
            savedGuestOption,
            updatedGuestOption,
            'The result is different from the update request'
        )

        return {
            hostOptionId: savedHostOption.id,
            guestOptionId: savedGuestOption.id
        }
    }

    async findOptionByRoomId(roomId: string): Promise<Option[]> {
        const options = await this.optionsRepository.findByRoomId(roomId)

        return options
    }

    async findHostOptionByRoomId(roomId: string): Promise<Option> {
        const option = await this.optionsRepository.findHostOptionByRoomId(roomId)

        if (!option) {
            throw new NotFoundException(`HostOption with roomId "${roomId}" not found.`)
        }

        return option
    }

    async findGuestOptionByRoomId(roomId: string): Promise<Option> {
        const option = await this.optionsRepository.findGuestOptionByRoomId(roomId)

        if (!option) {
            throw new NotFoundException(`GuestOption with roomId "${roomId}" not found.`)
        }

        return option
    }

    generateFuncs() {
        const funcs: Funcs = {
            '3rd-view': true,
            'share-screen': true,
            'object-button': true,
            'invitation-button': true,
            'camera-button': true,
            'left-button': true
        }

        return funcs
    }
}
