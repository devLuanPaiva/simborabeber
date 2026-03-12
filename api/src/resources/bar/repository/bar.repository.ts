import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BarEntity } from "../entities/bar.entity";
import { Repository } from "typeorm";

@Injectable()
export class BarRepository {
    constructor(
        @InjectRepository(BarEntity)
        private readonly repository: Repository<BarEntity>,
    ) { }

    async createBar(bar: Partial<BarEntity>): Promise<BarEntity> {
        const entity = this.repository.create(bar)
        return this.repository.save(entity)
    }

    async findAll(): Promise<BarEntity[]> {
        return this.repository.find()
    }

    async findBySlug(slug: string): Promise<BarEntity | null> {
        return this.repository.findOne({
            where: { slug },
        })
    }

    async updateBar(bar: Partial<BarEntity>): Promise<BarEntity> {
        return this.repository.save(bar)
    }

    async deleteBar(bar: BarEntity): Promise<void> {
        await this.repository.remove(bar)
    }

}