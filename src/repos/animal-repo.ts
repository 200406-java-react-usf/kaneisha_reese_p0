import { Animal } from '../models/Animal'
import { CrudRepo } from './crud-repo'
import { 
    InternalServerError
} from '../errors/errors';
import { PoolClient } from 'pg';
import { connectionPool } from '..';
import { mapAnimalResultSet } from '../util/result-set-mapper';

export class AnimalRepo implements CrudRepo<Animal> {
    
    baseQuery = `
        select
            a.animal_id,
            a.name,
            a.groomer_id,
            a.weight
            
        from Animals a
    `;

async getAll(): Promise<Animal[]> {

    let client: PoolClient;

    try {
       
        client = await connectionPool.connect();
        
        let sql = `${this.baseQuery};`;
        let rs = await client.query(sql); // rs = ResultSet
       
        return rs.rows.map(mapAnimalResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }

}

    async getById(id: number): Promise<Animal> {
    
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = `${this.baseQuery} where a.animal_id = $1`;
            let rs = await client.query(sql, [id]); // rs = ResultSet
            return mapAnimalResultSet(rs.rows[0]);
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
        
    }

    async save(newAnimal: Animal): Promise<Animal> {
        
        let client: PoolClient;
        let name = newAnimal.name;
        
        try {
            
            client = await connectionPool.connect();
            let sql = `insert into animals (name, groomer_id, weight) values ($1, $2, $3) returning animal_id;`;
            let rs = await client.query(sql,[name]); // rs = ResultSet
            newAnimal.animal_id = rs.rows[0].animal_id;
            return newAnimal;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    async update(updatedAnimal: Animal): Promise<Boolean> {
        let client: PoolClient;

        try {
            client = await connectionPool.connect();
            let sql = 'update Animals set weight = $1 where animal_id = $2;';
            let rs = await client.query(sql,[updatedAnimal.weight, updatedAnimal.animal_id]); // rs = ResultSet
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
            let sql = `delete from Animals where animal_id = $1;`;
            await client.query(sql, [id]); 
            return true;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    }

}