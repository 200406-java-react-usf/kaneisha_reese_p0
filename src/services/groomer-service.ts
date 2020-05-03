
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

    async getAllGroomers(): Promise<Groomer[]> {
        
        
        let groomer = await this.groomerRepo.getAll();

        if (groomer.length ==0) {
            throw new ResourceNotFoundError();
        }

        return groomer.map(this.removePassword);

    }

    async getGroomerById(id: number): Promise<Groomer> {
    
        if (!isValidId(id)){
            throw new BadRequestError();
        }

        let groomer = await this.groomerRepo.getById(id);

        if (isEmptyObject(groomer)) {
            throw new ResourceNotFoundError();
        }

        return this.removePassword(groomer);
        
        
    }

    async getGroomerByUniqueKey(queryObj: any): Promise<Groomer> {
       
        try {

            let queryKeys = Object.keys(queryObj);

            if(!queryKeys.every(key => isPropertyOf(key, Groomer))) {
                throw new BadRequestError();
            }

            // we will only support single param searches (for now)
            let key = queryKeys[0];
            let val = queryObj[key];

            // if they are searching for a user by id, reuse the logic we already have
            if (key === 'id') {
                return await this.getGroomerById(+val);
            }

            // ensure that the provided key value is valid
            if(!isValidStrings(val)) {
                throw new BadRequestError();
            }

            let groomer = {...await this.groomerRepo.getGroomerByUniqueKey(key, val)};

            if (isEmptyObject(groomer)) {
                throw new ResourceNotFoundError();
            }

            return this.removePassword(groomer);

        } catch (e) {
            throw e;
        }
  
    
    }

    

    async addNewGroomer(newGroomer: Groomer): Promise<Groomer> {
        
        try {

            if (!isValidObject(newGroomer, 'id')) {
                throw new BadRequestError('Invalid property values found in provided user.');
            }

            let usernameAvailable = await this.isUsernameAvailable(newGroomer.username);

            if (!usernameAvailable) {
                throw new ResourcePersistenceError('The provided username is already taken.');
            }

            const persistedGroomer = await this.groomerRepo.save(newGroomer);

            return this.removePassword(persistedGroomer);

        } catch (e) {
            throw e
        }

    }

    async updateGroomer(updatedGroomer: Groomer): Promise<boolean> {
        
        try {

            if (!isValidObject(updatedGroomer)) {
                throw new BadRequestError('Invalid user provided (invalid values found).');
            }

            // let repo handle some of the other checking since we are still mocking db
            return await this.groomerRepo.update(updatedGroomer);
        } catch (e) {
            throw e;
        }

    }

    async deleteById(id: number): Promise<boolean> {
        
        try {
            throw new NotImplementedError();
        } catch (e) {
            throw e;
        }

    }

    private async isUsernameAvailable(username: string): Promise<boolean> {

        try {
            await this.getGroomerByUniqueKey({'username': username});
        } catch (e) {
            console.log('username is available')
            return true;
        }

        console.log('username is unavailable')
        return false;

    }

   

    

    private removePassword(groomer: Groomer): Groomer {
        if(!groomer || !groomer.password) return groomer;
        let gmr = {...groomer};
        delete gmr.password;
        return gmr;   
    }
}