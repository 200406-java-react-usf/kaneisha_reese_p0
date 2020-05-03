import data from "../data/groomers-db";
import { Groomer } from "../models/groomer";
import { GroomerRepo } from "../repos/groomer-repo";
import { 
    isValidId, 
    isValidStrings, 
    isValidObject, 
    isPropertyOf, 
    isEmptyObject 
}  from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    NotImplementedError, 
    ResourcePersistenceError, 
    AuthenticationError 
} from "../errors/errors";


export class GroomerService {

    constructor(private groomerRepo: GroomerRepo){
        this.groomerRepo = groomerRepo
    }

    getAllGroomers(): Promise<Groomer[]> {
        
        
        return new Promise<Groomer[]>(async (resolve, reject) => {

            let groomers: Groomer[] = [];
            let result = await this.groomerRepo.getAll();

            for(let groomer of result) {
                groomers.push({...groomer});
            }

            if (groomers.length == 0){
                reject(new ResourceNotFoundError());
                return;
            }

            resolve(groomers);

            
        });

    }

    getGroomerById(id: number): Promise<Groomer> {
    
        return new Promise<Groomer>(async (resolve, reject) => {

            if (!isValidId(id)){
                return reject(new BadRequestError());

            }
            let groomer = {...await this.groomerRepo.getById(id)};

            if(isEmptyObject(groomer)){
                return reject(new ResourceNotFoundError());
            }
            resolve(groomer);
        });
        
    }

    getGroomerByUniqueKey(queryObj: any): Promise<Groomer> {
        return new Promise<Groomer>(async (resolve, reject) => {

            // we need to wrap this up in a try/catch in case errors are thrown for our awaits
            try {

                let queryKeys = Object.keys(queryObj);

                if(!queryKeys.every(key => isPropertyOf(key, Groomer))) {
                    return reject(new BadRequestError());
                }

                // we will only support single param searches (for now)
                let key = queryKeys[0];
                let val = queryObj[key];

                // if they are searching for a user by id, reuse the logic we already have
                if (key === 'id') {
                    return resolve(await this.getGroomerById(+val));
                }

                // ensure that the provided key value is valid
                if(!isValidStrings(val)) {
                    return reject(new BadRequestError());
                }

                let groomer = {...await this.groomerRepo.getGroomerByUniqueKey(key, val)};

                if (isEmptyObject(groomer)) {
                    return reject(new ResourceNotFoundError());
                }

                resolve(groomer);

            } catch (e) {
                reject(e);
            }

        });  
    
    }

    addNewGroomer(newGroomer: Groomer): Promise<Groomer> {
        return new Promise((resolve, reject) => {
            if (!isValidObject(newGroomer, 'id')) {
                reject(new BadRequestError('Invalid property values found in provided user.'));
                return;
            }

            let conflict = this.getGroomerByUniqueKey({username: newGroomer.username})
        
                newGroomer.id = (data.length) + 1;
                data.push(newGroomer);
        
                resolve(newGroomer);
        
            

        });
    
    }
    update(updatedGroomer: Groomer): Promise<boolean> {
        
        return new Promise<boolean>((resolve, reject) => {

            if (!isValidObject(updatedGroomer)) {
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
            
            if (!isValidId(id)) {
                reject(new BadRequestError());
            }

            reject(new NotImplementedError());
        });
    }
}