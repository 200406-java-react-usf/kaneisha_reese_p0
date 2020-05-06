import { Service } from '../models/Service'
import { CrudRepo } from './crud-repo'
import { 
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapServiceResultSet } from '../util/result-set-mapper';

export class ServiceRepo implements CrudRepo<Service> {
    
    baseQuery = `
        select
            s.service_id,
            s.name 
            
        from Services s
    `;

async getAll(): Promise<Service[]> {

    let client: PoolClient;

    try {
       
        client = await connectionPool.connect();
        
        let sql = `${this.baseQuery};`;
        let rs = await client.query(sql); // rs = ResultSet
       
        return rs.rows.map(mapServiceResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }

}

    async getById(id: number): Promise<Service> {
    
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where s.service_id = $1`;
            let rs = await client.query(sql, [id]); // rs = ResultSet
            return mapServiceResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    }

    async save(newService: Service): Promise<Service> {
        
        let client: PoolClient;
        let name = newService.name;
        
        try {
            
            client = await connectionPool.connect();
            let sql = `insert into services (name) values ($1) returning service_id;`;
            let rs = await client.query(sql,[name]); // rs = ResultSet
            newService.service_id = rs.rows[0].service_id;
            return newService;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    async update(updatedService: Service): Promise<Boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'update Services set name = $1 where service_id = $2;';
            let rs = await client.query(sql,[updatedService.name, updatedService.service_id]); // rs = ResultSet
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;
		

        try {
           
            client = await connectionPool.connect();
            let sql = `delete from Services where service_id = $1;`;
            await client.query(sql, [id]); 
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }



}