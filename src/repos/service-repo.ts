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
            s.id,
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
            let sql = `${this.baseQuery} where s.id = $1`;
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
        let costs = newService.costs;
        let hours = newService.hours;
        try {
            client = await connectionPool.connect();
            let sql = ` insert into Services ( 
            name)
            values ($1) returning id`;
            let rs = await client.query(sql,[newService.name]); // rs = ResultSet
            newService.id = rs.rows[0].id;
            let costing = (await client.query(`insert into service_pricing_by_size values( $1, 1, $2, $3),( $1, 2, $4, $5),( $1, 3, $6, $7), [newService.id, costs[0], hours[0], costs[1], hours[1], costs[2], hours[2]]`)).rows[0].id
            if (!costing){
                throw new InternalServerError();
            }
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
            let sql = 'update Services set name = $1 where id = $2;';
            let rs = await client.query(sql,[updatedService.name, updatedService.id]); // rs = ResultSet
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
            console.log(id);
            client = await connectionPool.connect();
            let sql = `delete from Services where id = $1 on delete cascade;`;
            await client.query(sql, [id]); 
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }



}