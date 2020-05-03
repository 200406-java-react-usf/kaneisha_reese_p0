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
        g.id, 
        g.username, 
        g.password, 
        g.first_name,
        g.last_name,
        g.hours_worked,
        g.earnings
        
    from groomers g
`;

async getAll(): Promise<Groomer[]> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${this.baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapGroomerResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }

}

    async getById(id: number): Promise<Groomer> {
    
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where g.id = $1`;
            let rs = await client.query(sql, [id]); // rs = ResultSet
            return mapGroomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
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
            values ($1, $2, $3, $4)`;
            let rs = await client.query(sql,[newGroomer.username,newGroomer.password,newGroomer.firstName, newGroomer.lastName]); // rs = ResultSet
            newGroomer.id = rs.rows[0].id;
            return newGroomer;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    async update(updatedGroomer: Groomer): Promise<boolean> {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where g.id = $1`;
            let rs = await client.query(sql); // rs = ResultSet
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());
        });
    }

    async getGroomerByUniqueKey(key: string, val: string): Promise<Groomer> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where ${key} = $1`;
            let rs = await client.query(sql, [val]); // rs = ResultSet
            return mapGroomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

    async getGroomerByCredentials(un: string, pw: string) {
        
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where g.username = $1 and au.password = $2`;
            let rs = await client.query(sql, [un, pw]);
            return mapGroomerResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
}