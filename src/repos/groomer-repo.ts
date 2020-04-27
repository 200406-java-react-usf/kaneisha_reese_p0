import data from '../data/groomers-db'
import { Groomer } from '../models/groomer'
import { CrudRepo } from './crud-repo'
import Validator from '../util/validator';
import { 
    BadRequestError, 
    ResourceNotFoundError, 
    ResourcePersistenceError,
    NotImplementedError
} from '../errors/errors';

export class GroomerRepo implements CrudRepo<Groomer> {
    
    
    private static instance: GroomerRepo;
    private constructor() { }

    static getInstance() {
        return !GroomerRepo.instance ? GroomerRepo.instance = new GroomerRepo() : GroomerRepo.instance;
    }

    getAll(): Promise<Groomer[]> {
        
        console.log(data);
        
        return new Promise<Groomer[]>((resolve, reject) => {

            setTimeout(() => {
                let groomers: Groomer[] = [];

                for(let groomer of data) {
                    groomers.push({...groomer});
                }

                if (groomers.length == 0){
                    reject(new ResourceNotFoundError());
                    return;
                }

                resolve(groomers);

            });
        });

    }

    getById(id: number): Promise<Groomer> {
    
        return new Promise<Groomer>((resolve, reject) => {
    
            if (!Validator.isValidId(id)) {
                reject(new BadRequestError());
                return;
            }
    
            setTimeout(function() {
    
                const groomer: Groomer = {...data.filter(groomer => groomer.id === id).pop()};
                
                if (!groomer) {
                    reject(new ResourceNotFoundError());
                    return;
                }
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
}