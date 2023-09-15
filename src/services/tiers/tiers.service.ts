import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { Assert } from 'src/common'
import { TierDto, TierQueryDto } from './dto'
import { Tier } from './entities'
import { TiersRepository } from './tiers.repository'

@Injectable()
export class TiersService {
    constructor(private readonly tiersRepository: TiersRepository) {}

    async findTiers(queryDto: TierQueryDto) {
        const tiers = await this.tiersRepository.find(queryDto)

        const items = tiers.items.map((tier) => new TierDto(tier))

        return { ...items, items }
    }

    async getTier(tierId: string): Promise<Tier> {
        const tier = await this.tiersRepository.findById(tierId)

        Assert.defined(tier, `Tier with ID "${tierId}" not found.`)

        return tier as Tier
    }

    async getDefaultTier(): Promise<Tier> {
        const defaultTier = await this.tiersRepository.getDefaultTier()

        if (!defaultTier) {
            throw new NotFoundException(`Default tier not found.`)
        }

        return defaultTier
    }

    async tierExists(tierId: string): Promise<boolean> {
        return this.tiersRepository.exist(tierId)
    }

    async validateTierExists(tierId: string) {
        const tierExists = await this.tierExists(tierId)

        if (!tierExists) {
            throw new NotFoundException(`Tier with ID "${tierId}" not found.`)
        }
    }

    async validateMaxRooms(desiredRoomCount: number, tierId?: string) {
        const tier = tierId ? await this.getTier(tierId) : await this.getDefaultTier()

        if (tier.maxRooms && desiredRoomCount >= tier.maxRooms) {
            throw new BadRequestException(`Cannot create more than ${tier.maxRooms} rooms for this tier.`)
        }
    }

    async validateMaxRoomSize(desiredRoomSize: number, tierId?: string) {
        const tier = tierId ? await this.getTier(tierId) : await this.getDefaultTier()

        if (tier.maxRoomSize && desiredRoomSize > tier.maxRoomSize) {
            throw new BadRequestException(`Room size cannot exceed ${tier.maxRoomSize} for this tier.`)
        }
    }
}
