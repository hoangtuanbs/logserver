import { GenericRepository } from '../baseService';
import { Log } from './Log.model';

export class LogService extends GenericRepository<Log>
{
    constructor()
    {
        super(Log);
    }
}
