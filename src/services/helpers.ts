import type { FindOptionsWhere, ObjectLiteral, Repository, DeepPartial } from 'typeorm';

import { AppDataSource } from '../data-source';

export abstract class BaseRepo<Model extends ObjectLiteral> {
    public repo: Repository<Model>;

    constructor(entity: new () => Model) {
        this.repo = AppDataSource.getRepository(entity);
    }

    public async getRecord(where:FindOptionsWhere<Model>): Promise<Model | null> {
        return await this.repo.findOne({ where });
    }

    public async updateRecord(where:FindOptionsWhere<Model>, data: Partial<Model>): Promise<void> {
        await this.repo.update(where, data);
    }

    public async createNewRecord(data:DeepPartial<Model>): Promise<Model> {
        const record = this.repo.create(data);
        return await this.repo.save(record);
    }
}