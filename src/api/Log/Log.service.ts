import { GenericRepository } from '../baseService';
import { Log } from './Log.model';

export class LogService extends GenericRepository<Log>
{
    constructor()
    {
        super(Log);
    }

    public async getLogs(page: number, pageSize: number, orderDes = true): Promise<[Log[], number]>
    {
        return new Promise<[Log[], number]>((resolve, reject) =>
        {
            try
            {
                let response = this.repository.createQueryBuilder("log")

                    .skip((page - 1) * pageSize)
                    .take(pageSize)
                    .orderBy("log.inserted_at", orderDes ? "DESC": "ASC")
                    .getManyAndCount();

                resolve(response);
            }
            catch (error)
            {
                reject(error);
            }
        });
    }

    public async listByDateRange(startDate: Date,
        endDate: Date,
        pageSize= 1000,
        page= 1,
        orderDes = true
    ): Promise<[Log[], number]>
    {
        return new Promise<[Log[], number]>((resolve, reject) =>
        {
            try
            {
                resolve(this.repository.createQueryBuilder("log")
                    .where("log.inserted_at >= :startDate", { startDate })
                    .andWhere("log.inserted_at <= :endDate", { endDate })
                    .skip((page - 1) * pageSize)
                    .take(pageSize)
                    .orderBy("log.inserted_at", orderDes ? "DESC": "ASC")
                    .getManyAndCount());
            }
            catch (error)
            {
                reject(error);
            }
        });
    }
}
