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
        let services = newAnimal.services;
        let weight = newAnimal.weight;
        let size: number;
        if (weight <=20 ){
           size = 1; 
        } else if (weight <=45 ){
            size = 2;
        } else size =3;
        try {
            console.log('made it here 1');
            client = await connectionPool.connect();
            let groomerId = (await client.query(`select groomer_id from groomers g where g.hours = (select min(hours) from groomers) limit 1`)).rows[0].groomer_id;
            console.log(groomerId)
            console.log('made it here 2')
            let sql = `insert into animals (name, groomer_id, weight) values ($1, $2, $3) returning animal_id;` /*insert into animal_size values (animal_id, $4); */;
            let rs = await client.query(sql,[name, groomerId, weight]); // rs = ResultSet
            console.log(rs);
            console.log('made it here 3');
            newAnimal.animal_id = rs.rows[0].animal_id;
            
            //loop over service and add to junction table
            // for (let i=1; i<= services.length; i++){
            //    await client.query(`insert into animal_services values($1, (select service_id from services s where s.name = $2))`, [newAnimal.animal_id, services[i-1]]);
            // }
            return newAnimal;
        } catch (e) {
            throw new InternalServerError();
        } finally {
            client && client.release();
        }
    
    }
    async update(updatedAnimal: Animal): Promise<Boolean> {
        let client: PoolClient;

        let size: number;
        if (updatedAnimal.weight <=20 ){
           size = 1; 
        } else if (updatedAnimal.weight <=45 ){
            size = 2;
        } else size =3;

        try {
            client = await connectionPool.connect();
            let sql = `update animals set weight = $1 where animal_id = $2; update animal_size set animal_size = ${size} where animal_id = $2; `;
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