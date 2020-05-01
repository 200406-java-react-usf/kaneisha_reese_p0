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

export class GroomerRepo implements CrudRepo<Groomer> {
    
    baseQuery = `
    select
        au.id, 
        au.username, 
        au.password, 
        au.first_name,
        au.last_name,
        au.email,
        ur.name as role_name
    from app_users au
    join user_roles ur
    on au.role_id = ur.id
`;

async getAll(): Promise<Groomer[]> {

    let client: PoolClient;

    try {
        client = await connectionPool.connect();
        let sql = `${this.baseQuery}`;
        let rs = await client.query(sql); // rs = ResultSet
        return rs.rows.map(mapUserResultSet);
    } catch (e) {
        throw new InternalServerError();
    } finally {
        client && client.release();
    }

}

    getById(id: number): Promise<Groomer> {
    
        return new Promise<Groomer>((resolve, reject) => {
    
    
            setTimeout(function() {
    
                const groomer: Groomer = {...data.filter(groomer => groomer.id === id).pop()};
                resolve(groomer);
    
            }, 5000);
    
        });
        
    }

    save(newGroomer: Groomer): Promise<Groomer> {
        return new Promise((resolve, reject) => {
            if (!Validator.isValidObject(newGroomer, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided user.'));
                return;
            }
        
            setTimeout(() => {
        
                
        
                newGroomer.id = (data.length) + 1;
                data.push(newGroomer);
        
                resolve(newGroomer);
        
            });

        });
    
    }
    update(updatedGroomer: Groomer): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {

            if (!Validator.isValidObject(updatedGroomer)) {
                reject(new BadRequestError('Invalid user provided (invalid values found).'));
                return;
            }
        
            setTimeout(() => {
        
                let persistedGroomer = data.find(user => user.id === updatedGroomer.id);
        
                if (!persistedGroomer) {
                    reject(new ResourceNotFoundError('No user found with provided id.'));
                    return;
                }
    
                persistedGroomer = updatedGroomer;
    
                resolve(true);
                return;
        
            });

        });
    
    }

    deleteById(id: number): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());
        });
    }

    getGroomerByUniqueKey(key: string, val: string): Promise<Groomer> {

        return new Promise<Groomer>((resolve, reject) => {
           
            setTimeout(() => {
                const user = {...data.find(user => user[key] === val)};
                resolve(user);
            }, 250);

        });
        
    
    }
}