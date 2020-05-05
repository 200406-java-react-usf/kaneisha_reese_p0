import { Groomer } from '../models/groomer'
import { CrudRepo } from './crud-repo'
import Validator from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    ResourcePersistenceError,
    NotImplementedError,
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapGroomerResultSet } from '../util/result-set-mapper';

export class GroomerRepo implements CrudRepo<Groomer> {
    
    baseQuery = `
        select
            g.groomer_id, 
            g.username, 
            g.password, 
            g.first_name,
            g.last_name,
            g.earnings,
            g.hours
            
        from groomers g
    `;

async getAll(): Promise<Groomer[]> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${this.baseQuery};`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapGroomerResultSet);
    } catch (e) {
        throw new InternalServerError('fail1');
    } finally {
        client && client.release();
    }

}

    async getById(id: number): Promise<Groomer> {
    
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where g.groomer_id = $1`;
            let rs = await client.query(sql, [id]); // rs = ResultSet
            return mapGroomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError('fail2');
        } finally {
            client && client.release();
        }
        
    }

    async save(newGroomer: Groomer): Promise<Groomer> {
        
        let client: PoolClient;
        
        try {
            client = await connectionPool.connect();
            let sql = ` insert into groomers ( 
            username, 
            password, 
            first_name,
            last_name)
            values ($1, $2, $3, $4) returning groomer_id`;
            let rs = await client.query(sql,[newGroomer.username,newGroomer.password,newGroomer.firstName, newGroomer.lastName]); // rs = ResultSet
            newGroomer.id = rs.rows[0].id;
            return newGroomer;
        } catch (e) {
            throw new InternalServerError('fail3');
        } finally {
            client && client.release();
        }
    
    }
    async update(updatedGroomer: Groomer): Promise<Boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'update groomers set password = $1, first_name = $2, last_name = $3 where username = $4;';
            let rs = await client.query(sql,[updatedGroomer.password, updatedGroomer.firstName, updatedGroomer.lastName, updatedGroomer.username]); // rs = ResultSet
            return true;
        } catch (e) {
            throw new InternalServerError(e);
        } finally {
            client && client.release();
        }
    
    }

    async deleteById(id: number): Promise<boolean> {
        let client: PoolClient;
		

        try {
            console.log(id);
            client = await connectionPool.connect();
            let sql = `delete from groomers where groomer_id = $1 on delete cascade;`;
            await client.query(sql, [id]); 
            return true;
        } catch (e) {
            throw new InternalServerError('try333');
        } finally {
            client && client.release();
        }
    }

    async getGroomerByUniqueKey(key: string, val: string): Promise<Groomer> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ${key} = $1`;
            let rs = await client.query(sql, [val]); // rs = ResultSet
            return mapGroomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError('fail5');
        } finally {
            client && client.release();
        }
    }

}