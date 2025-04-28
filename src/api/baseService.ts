// src/api/baseService.ts
import { Repository, DeepPartial, FindManyOptions } from "typeorm";
import { AppDataSource } from "../dataSource/dataSource";

export class GenericRepository<T>
{
    public repository: Repository<T>;

    constructor(entity: new () => T)
    {
        this.repository = AppDataSource.getRepository(entity);
    }

    async save(data: DeepPartial<T>): Promise<T>
    {
        return await this.repository.save(data);
    }

    async list(options?: FindManyOptions<T>): Promise<T[]>
    {
        return await this.repository.find(options);
    }

    async listPage(page: number, limit: number): Promise<T[]>
    {
        return await this.repository.find(
        {
            skip: (page - 1) * limit,
            take: limit
        });
    }

    async findOne(id: number): Promise<T | null>
    {
        return await this.repository.findOneBy({ id } as any);
    }

    async delete(id: number): Promise<void>
    {
        await this.repository.delete(id);
    }
}